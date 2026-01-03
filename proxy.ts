import http from 'http';
import type { IncomingMessage, ServerResponse } from 'http';
import httpProxy from 'http-proxy';
import { spawn } from 'child_process';
import { join } from 'path';
import net from 'net';

// Debug: env check
console.log('Proxy: GOOGLE_API_KEY available:', !!process.env.GOOGLE_API_KEY);

// Create proxy with timeouts (prevents hanging)
const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  timeout: 5000,
  proxyTimeout: 5000,
});

// ---- Spawn backend ----
spawn('npx', ['ts-node', 'src/index.ts'], {
  cwd: join(__dirname, 'server'),
  stdio: 'inherit',
  env: { ...process.env },
});

// ---- Spawn frontend (Vite) ----
spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5001'], {
  cwd: join(__dirname, 'client'),
  stdio: 'inherit',
  env: { ...process.env },
});

// ---- Utility: wait for a port to be alive ----
function waitForPort(port: number, host = '127.0.0.1') {
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      const socket = net.createConnection(port, host);
      socket
        .once('connect', () => {
          clearInterval(interval);
          socket.end();
          resolve();
        })
        .once('error', () => socket.destroy());
    }, 200);
  });
}

// ---- HTTP server ----
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith('/api/')) {
    proxy.web(req, res, { target: 'http://localhost:3001' });
    return;
  }

  // Frontend routing (Vite)
  proxy.web(req, res, { target: 'http://localhost:5001' });
});

// ---- WebSocket upgrades (Vite HMR) ----
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head, { target: 'http://localhost:5001' });
});

// ---- Proxy error handling (NO HANGS) ----
proxy.on('error', (err: any, _req: any, res: any) => {
  if (err.code === 'ECONNREFUSED') {
    if (res && !res.headersSent) {
      res.writeHead(503, { 'Content-Type': 'text/plain' });
      res.end('Dev server starting… refresh in a second.');
    }
    return;
  }

  console.error('Proxy error:', err);
});

// ---- Start proxy ONLY after deps are ready ----
(async () => {
  await Promise.all([
    waitForPort(3001),
    waitForPort(5001),
  ]);

  server.listen(5000, '0.0.0.0', () => {
    console.log('✅ Proxy running on port 5000');
    console.log('✅ Backend API on port 3001');
    console.log('✅ Frontend (Vite) on port 5001');
  });
})();
