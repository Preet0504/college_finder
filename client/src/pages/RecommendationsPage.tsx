import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, MapPin, ExternalLink } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import api from '@/lib/api'

interface University {
  name: string
  location: string
  match_type: string
  tuition: number
  acceptanceRate: number
  website: string
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<University[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/recommendations/my')
        setRecommendations(response.data.universities || [])
      } catch (error: any) {
        console.error('Failed to fetch recommendations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecommendations()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading recommendations...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Personalized Matches</h1>
        <p className="text-gray-600">Based on your academic profile and budget</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.length > 0 ? (
          recommendations.map((uni: University, idx: number) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{uni.name}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    uni.match_type === 'reach' ? 'bg-purple-100 text-purple-700 border-purple-200' : 
                    uni.match_type === 'safety' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-green-100 text-green-700 border-green-200'
                  }`}>
                    {uni.match_type}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {uni.location}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-xs text-gray-500">Tuition</div>
                    <div className="font-bold">{formatCurrency(uni.tuition || 0)}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-xs text-gray-500">Acceptance</div>
                    <div className="font-bold">{uni.acceptanceRate || 0}%</div>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <a href={uni.website} target="_blank" rel="noreferrer">
                    Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
             <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
             <h3 className="text-lg font-semibold">No recommendations yet</h3>
             <p className="text-gray-600">Complete your questionnaire to get personalized matches!</p>
             <Link to="/questionnaire">
               <Button className="mt-4">Start Questionnaire</Button>
             </Link>
          </div>
        )}
      </div>
    </div>
  )
}
