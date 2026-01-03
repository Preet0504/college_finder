import { Router } from 'express'
import { db } from '../../db'
import { universities, users } from '../../../shared/schema'
import { and, lte, eq, inArray } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

const router = Router()

router.get('/my', async (req, res) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: 'Not authenticated' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    const [user] = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1)
    
    if (!user || !user.budget || !user.cgpa || !user.cgpaScale) {
      return res.status(400).json({ message: 'Complete your profile to get recommendations' })
    }

    const normalizedGpa = (user.cgpa / user.cgpaScale) * 4.0

    const results = await db.select().from(universities).where(
      and(
        lte(universities.tuition, user.budget),
        lte(universities.gpaRequirement, normalizedGpa)
      )
    ).limit(10)

    const recommendations = {
      universities: results.map((u: any) => ({
        ...u,
        match_type: u.gpaRequirement < normalizedGpa - 0.5 ? 'safety' : (u.gpaRequirement > normalizedGpa ? 'reach' : 'match'),
        key_strengths: u.programs || [],
        application_tips: "Tailored for your profile."
      })),
      summary: {
        total_recommendations: results.length,
        notes: "Based on your academic profile and budget."
      }
    }
    
    res.json(recommendations)
  } catch (error) {
    console.error('Recommendation error:', error)
    res.status(500).json({ message: 'Failed to retrieve recommendations' })
  }
})

export default router
