import { Router } from 'express'
import { db } from '../../db'
import { scholarships } from '../../../shared/schema'
import { ilike, or } from 'drizzle-orm'

const router = Router()

router.get('/search', async (req, res) => {
  try {
    const query = (req.query.q as string) || ''
    const results = await db.select().from(scholarships).where(
      or(
        ilike(scholarships.name, `%${query}%`),
        ilike(scholarships.description, `%${query}%`)
      )
    )
    res.json({ scholarships: results, count: results.length })
  } catch (error: any) {
    console.error('Scholarship search error:', error)
    res.status(500).json({ error: 'Failed to search scholarships' })
  }
})

router.get('/', async (req, res) => {
  try {
    const results = await db.select().from(scholarships).limit(10)
    res.json({ scholarships: results, count: results.length })
  } catch (error: any) {
    console.error('Scholarships error:', error)
    res.status(500).json({ error: 'Failed to fetch scholarships' })
  }
})

export default router
