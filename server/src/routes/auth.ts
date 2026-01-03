import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { db } from '../../db'
import { users } from '../../../shared/schema'
import { eq } from 'drizzle-orm'

const router = Router()

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  areaOfInterest: z.string().min(2),
  cgpa: z.string(),
  cgpaScale: z.string(),
  budget: z.string(),
  intake: z.string(),
  country: z.string(),
  ieltsScore: z.string().optional(),
  toeflScore: z.string().optional(),
  greScore: z.string().optional(),
  gmatScore: z.string().optional(),
  satScore: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

router.post('/signup', async (req, res) => {
  try {
    const data = signupSchema.parse(req.body)

    const [existing] = await db.select().from(users).where(eq(users.email, data.email)).limit(1)
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    
    await db.insert(users).values({
      username: data.name,
      email: data.email,
      password: hashedPassword,
      areaOfInterest: data.areaOfInterest,
      cgpa: parseFloat(data.cgpa),
      cgpaScale: parseFloat(data.cgpaScale),
      budget: parseInt(data.budget),
      intake: data.intake,
      country: data.country,
      ieltsScore: data.ieltsScore,
      toeflScore: data.toeflScore,
      greScore: data.greScore,
      gmatScore: data.gmatScore,
      satScore: data.satScore,
    })

    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message })
    }
    console.error('Signup error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    )

    console.log(`DEBUG: User ${user.username} logged in, setting cookie...`);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      domain: undefined, // Let the browser handle the domain
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        profile: {
          areaOfInterest: user.areaOfInterest,
          cgpa: user.cgpa,
          cgpaScale: user.cgpaScale,
          budget: user.budget,
          intake: user.intake,
          country: user.country
        }
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message })
    }
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/me', async (req, res) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: 'Not authenticated' })
  
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    const decoded = jwt.verify(token, jwtSecret) as any
    const [user] = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1)
    if (!user) return res.status(404).json({ message: 'User not found' })
    
    res.json({
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        profile: {
          areaOfInterest: user.areaOfInterest,
          cgpa: user.cgpa,
          cgpaScale: user.cgpaScale,
          budget: user.budget,
          intake: user.intake,
          country: user.country
        }
      }
    })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out successfully' })
})

export default router
