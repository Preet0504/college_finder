import { Router } from 'express'
import { db } from '../../db'
import { essays, applications } from '../../../shared/schema'
import { eq } from 'drizzle-orm'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/essays', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = Number(req.user?.id)
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Authentication required' })
    }
    
    let userEssays = await db.select().from(essays).where(eq(essays.userId, userId))
    
    if (userEssays.length === 0) {
      const initialEssays = [
        { userId, title: 'Personal Statement', content: 'This is my personal statement...', status: 'draft', wordCount: 500 },
        { userId, title: 'Why University X?', content: 'University X is my dream because...', status: 'in_progress', wordCount: 300 }
      ]
      await db.insert(essays).values(initialEssays)
      userEssays = await db.select().from(essays).where(eq(essays.userId, userId))
    }
    
    res.json(userEssays)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch essays' })
  }
})

router.get('/applications', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = Number(req.user?.id)
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: 'Authentication required' })
    }
    
    let userApps = await db.select().from(applications).where(eq(applications.userId, userId))
    
    if (userApps.length === 0) {
      const initialApps = [
        { userId, universityName: 'Harvard University', status: 'planned', deadline: '2025-01-01', priority: 'high' },
        { userId, universityName: 'Stanford University', status: 'in_progress', deadline: '2025-01-15', priority: 'high' }
      ]
      await db.insert(applications).values(initialApps)
      userApps = await db.select().from(applications).where(eq(applications.userId, userId))
    }
    
    res.json(userApps)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications' })
  }
})

export default router
