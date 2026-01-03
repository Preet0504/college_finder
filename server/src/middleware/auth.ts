import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    id: number
    email: string
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured')
    }

    const decoded = jwt.verify(token, jwtSecret) as any
    ;(req as AuthRequest).user = {
      id: Number(decoded.id),
      email: decoded.email
    }
    
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token
    
    if (token) {
      const jwtSecret = process.env.JWT_SECRET
      if (jwtSecret) {
        const decoded = jwt.verify(token, jwtSecret) as any
        if (decoded) {
          ;(req as AuthRequest).user = {
            id: Number(decoded.id),
            email: decoded.email
          }
        }
      }
    }
  } catch (error) {
  }
  
  next()
}
