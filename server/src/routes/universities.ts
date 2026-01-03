import { Router } from 'express'
import { db } from '../../db'
import { universities } from '../../../shared/schema'
import { ilike, or } from 'drizzle-orm'

const router = Router()

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' })
    }

    const results = await db.select().from(universities).where(
      or(
        ilike(universities.name, `%${query}%`),
        ilike(universities.location, `%${query}%`),
        ilike(universities.country, `%${query}%`)
      )
    )
    res.json({ universities: results, count: results.length })
  } catch (error: any) {
    console.error('University search error:', error)
    res.status(500).json({ error: 'Failed to search universities' })
  }
})

router.get('/popular', async (req, res) => {
  try {
    const results = await db.select().from(universities).limit(20)
    res.json({ universities: results, count: results.length })
  } catch (error: any) {
    console.error('Popular universities error:', error)
    res.status(500).json({ error: 'Failed to fetch popular universities' })
  }
})

router.get('/:name', async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name)
    const [university] = await db.select().from(universities).where(ilike(universities.name, name)).limit(1)
    
    if (!university) {
      return res.status(404).json({ error: 'University not found' })
    }

    res.json({ university })
  } catch (error: any) {
    console.error('University details error:', error)
    res.status(500).json({ error: 'Failed to fetch university details' })
  }
})

export default router
