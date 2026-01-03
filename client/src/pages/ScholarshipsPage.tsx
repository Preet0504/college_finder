import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, DollarSign, Calendar, Bookmark, ExternalLink, Loader2, Award, Filter, RefreshCw } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import api from '@/lib/api'

interface Scholarship {
  id: string
  name: string
  amount: number
  deadline: string
  description: string
  eligibility: string
  provider: string
  url: string
  type: string
  bookmarked: boolean
  citations: string[]
}

const scholarshipTypes = ['All', 'Merit-Based', 'Need-Based', 'Field-Specific', 'Leadership', 'Diversity', 'Athletic', 'General']

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')

  useEffect(() => {
    loadScholarships()
  }, [])

  const loadScholarships = async () => {
    try {
      setLoading(true)
      const response = await api.get('/scholarships/')
      const data = (response.data.scholarships || []).map((s: Scholarship) => ({
        ...s,
        bookmarked: false,
      }))
      setScholarships(data)
    } catch (error) {
      console.error('Failed to load scholarships:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadScholarships()
      return
    }

    try {
      setSearching(true)
      const params = new URLSearchParams({ q: searchQuery })
      if (selectedType !== 'All') {
        params.append('type', selectedType)
      }
      const response = await api.get(`/scholarships/search?${params.toString()}`)
      const data = (response.data.scholarships || []).map((s: Scholarship) => ({
        ...s,
        bookmarked: false,
      }))
      setScholarships(data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setSearching(false)
    }
  }

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesType = selectedType === 'All' || scholarship.type === selectedType
    return matchesType
  })

  const toggleBookmark = (id: string) => {
    setScholarships(scholarships.map(s => 
      s.id === id ? { ...s, bookmarked: !s.bookmarked } : s
    ))
  }

  const bookmarkedCount = scholarships.filter(s => s.bookmarked).length
  const totalAmount = filteredScholarships.reduce((sum, s) => sum + s.amount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <div>
            <p className="text-lg font-medium">Finding Scholarships</p>
            <p className="text-sm text-gray-500">Searching for 2025 opportunities...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Scholarship Finder</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Discover real scholarships available for 2025
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {bookmarkedCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Bookmark className="h-4 w-4 text-blue-600 fill-current" />
              <span className="text-sm font-medium">{bookmarkedCount} saved</span>
            </div>
          )}
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Total Available</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</div>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search scholarships (e.g., 'engineering', 'international students', 'women in tech')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 h-12"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  className="h-12 pl-10 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium appearance-none cursor-pointer min-w-[160px]"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {scholarshipTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleSearch} disabled={searching} className="h-12 px-6">
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={loadScholarships} className="h-12 px-4">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredScholarships.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScholarships.map((scholarship, index) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all border-0 ring-1 ring-gray-200 dark:ring-gray-800 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {scholarship.name}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-xl font-bold text-green-600">
                            {formatCurrency(scholarship.amount)}
                          </span>
                        </div>
                        {scholarship.deadline && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>Due {formatDate(scholarship.deadline)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant={scholarship.bookmarked ? 'default' : 'outline'}
                      className="flex-shrink-0"
                      onClick={() => toggleBookmark(scholarship.id)}
                    >
                      <Bookmark className={`h-4 w-4 ${scholarship.bookmarked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {scholarship.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">Provider:</span>
                      <span className="text-gray-600 dark:text-gray-400">{scholarship.provider}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">Eligibility:</span>
                      <span className="text-gray-600 dark:text-gray-400 line-clamp-2">{scholarship.eligibility}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                      <Award className="h-3 w-3" />
                      {scholarship.type}
                    </span>
                    
                    {scholarship.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={scholarship.url} target="_blank" rel="noopener noreferrer">
                          Apply Now
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-dashed border-2">
          <CardContent className="p-12 text-center">
            <Award className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Scholarships Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search terms or filters to find more opportunities.
            </p>
            <Button onClick={loadScholarships}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Load All Scholarships
            </Button>
          </CardContent>
        </Card>
      )}

      {scholarships.length > 0 && scholarships[0].citations?.length > 0 && (
        <div className="text-xs text-gray-400 pt-4 border-t">
          <span className="font-medium">Sources: </span>
          {scholarships[0].citations.slice(0, 3).map((citation, i) => (
            <a key={i} href={citation} target="_blank" rel="noopener noreferrer" className="hover:underline mr-2">
              [{i + 1}]
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
