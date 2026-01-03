import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X, MapPin, DollarSign, Award, Users, TrendingUp, Loader2, ExternalLink, Search, GraduationCap, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import api from '@/lib/api'

interface University {
  id: string
  name: string
  location: string
  country: string
  ranking: number
  acceptanceRate: number
  tuition: number
  students: number
  avgSalary: number
  programs: string[]
  gpaRequirement: number
  applicationDeadline: string
  website: string
  description: string
  citations: string[]
}

export default function ComparisonPage() {
  const [selectedUniversities, setSelectedUniversities] = useState<University[]>([])
  const [availableUniversities, setAvailableUniversities] = useState<University[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<University[]>([])

  useEffect(() => {
    loadPopularUniversities()
  }, [])

  const loadPopularUniversities = async () => {
    try {
      setLoading(true)
      const response = await api.get('/universities/popular')
      setAvailableUniversities(response.data.universities || [])
    } catch (error) {
      console.error('Failed to load universities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      setSearching(true)
      const response = await api.get(`/universities/search?q=${encodeURIComponent(query)}`)
      const results = (response.data.universities || []).filter(
        (uni: University) => !selectedUniversities.find((s) => s.id === uni.id)
      )
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setSearching(false)
    }
  }

  const filteredAvailable = availableUniversities.filter(
    (uni) =>
      !selectedUniversities.find((selected) => selected.id === uni.id) &&
      uni.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const displayedUniversities = searchQuery.length >= 2 ? searchResults : filteredAvailable

  const addUniversity = (uni: University) => {
    if (selectedUniversities.length < 4) {
      setSelectedUniversities([...selectedUniversities, uni])
      setSearchQuery('')
      setShowSearch(false)
      setSearchResults([])
    }
  }

  const removeUniversity = (id: string) => {
    setSelectedUniversities(selectedUniversities.filter((uni) => uni.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <div>
            <p className="text-lg font-medium">Loading University Data</p>
            <p className="text-sm text-gray-500">Fetching current 2025 information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">University Comparison</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Compare universities side-by-side with real-time 2025 data
          </p>
        </div>
        {selectedUniversities.length < 4 && (
          <Button 
            onClick={() => setShowSearch(!showSearch)} 
            size="lg"
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add University
          </Button>
        )}
      </div>

      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search for any university worldwide..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 h-12 text-lg"
                  autoFocus
                />
                {searching && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-blue-600" />
                )}
              </div>
              
              {displayedUniversities.length > 0 && (
                <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
                  {displayedUniversities.slice(0, 10).map((uni) => (
                    <button
                      key={uni.id}
                      className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                      onClick={() => addUniversity(uni)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-base">{uni.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {uni.location}
                          </div>
                        </div>
                        <div className="text-right">
                          {uni.ranking > 0 && (
                            <span className="text-sm font-medium text-blue-600">#{uni.ranking}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {searchQuery.length >= 2 && displayedUniversities.length === 0 && !searching && (
                <p className="text-center text-gray-500 py-8">
                  No universities found. Try a different search term.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {selectedUniversities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {selectedUniversities.map((uni, index) => (
            <motion.div
              key={uni.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow border-0 ring-1 ring-gray-200 dark:ring-gray-800">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight line-clamp-2">{uni.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{uni.location}</span>
                      </div>
                    </div>
                    {selectedUniversities.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={() => removeUniversity(uni.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-3 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs text-yellow-700 dark:text-yellow-300 mb-1">
                        <Award className="h-3.5 w-3.5" />
                        Ranking
                      </div>
                      <div className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                        {uni.ranking > 0 ? `#${uni.ranking}` : 'N/A'}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 mb-1">
                        <Users className="h-3.5 w-3.5" />
                        Accept Rate
                      </div>
                      <div className="text-xl font-bold text-blue-800 dark:text-blue-200">
                        {uni.acceptanceRate > 0 ? `${uni.acceptanceRate}%` : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        Tuition/Year
                      </div>
                      <span className="font-semibold text-green-700 dark:text-green-400">
                        {uni.tuition > 0 ? formatCurrency(uni.tuition) : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        Avg Salary
                      </div>
                      <span className="font-semibold text-purple-700 dark:text-purple-400">
                        {uni.avgSalary > 0 ? formatCurrency(uni.avgSalary) : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        GPA Required
                      </div>
                      <span className="font-semibold">
                        {uni.gpaRequirement > 0 ? uni.gpaRequirement.toFixed(2) : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 text-orange-600" />
                        Students
                      </div>
                      <span className="font-semibold">
                        {uni.students > 0 ? uni.students.toLocaleString() : 'N/A'}
                      </span>
                    </div>

                    {uni.applicationDeadline && (
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 text-red-600" />
                          Deadline
                        </div>
                        <span className="font-semibold text-red-700 dark:text-red-400">
                          {new Date(uni.applicationDeadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {uni.programs && uni.programs.length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Top Programs</div>
                      <div className="flex flex-wrap gap-1.5">
                        {uni.programs.slice(0, 3).map((program, i) => (
                          <span
                            key={i}
                            className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
                          >
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {uni.website && (
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <a href={uni.website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-dashed border-2">
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">Start Comparing Universities</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Add up to 4 universities to compare their rankings, tuition, acceptance rates, and more with real-time 2025 data.
            </p>
            <Button size="lg" onClick={() => setShowSearch(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Add Your First University
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedUniversities.length > 0 && selectedUniversities[0].citations?.length > 0 && (
        <div className="text-xs text-gray-400 pt-4 border-t">
          <span className="font-medium">Sources: </span>
          {selectedUniversities[0].citations.slice(0, 3).map((citation, i) => (
            <a key={i} href={citation} target="_blank" rel="noopener noreferrer" className="hover:underline mr-2">
              [{i + 1}]
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
