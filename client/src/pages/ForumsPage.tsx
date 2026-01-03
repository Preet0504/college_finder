import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, ThumbsUp, Plus, Search, Users, TrendingUp } from 'lucide-react'

interface Post {
  id: string
  title: string
  author: string
  category: string
  content: string
  likes: number
  replies: number
  timestamp: string
  isLiked: boolean
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Tips for writing a standout Common App essay?',
    author: 'Sarah M.',
    category: 'Essays',
    content: 'I\'m struggling to find a unique angle for my essay. What made your essays stand out?',
    likes: 24,
    replies: 15,
    timestamp: '2 hours ago',
    isLiked: false,
  },
  {
    id: '2',
    title: 'How important are extracurriculars really?',
    author: 'David K.',
    category: 'Admissions',
    content: 'I have good grades but limited extracurriculars. Should I be worried?',
    likes: 18,
    replies: 23,
    timestamp: '5 hours ago',
    isLiked: false,
  },
  {
    id: '3',
    title: 'Financial aid for international students',
    author: 'Maria L.',
    category: 'Financial Aid',
    content: 'Looking for schools that offer generous aid packages to international students.',
    likes: 31,
    replies: 19,
    timestamp: '1 day ago',
    isLiked: true,
  },
  {
    id: '4',
    title: 'Stanford vs MIT for Computer Science',
    author: 'Alex T.',
    category: 'College Life',
    content: 'Got into both! Trying to decide between Stanford and MIT for CS. Any insights?',
    likes: 42,
    replies: 34,
    timestamp: '2 days ago',
    isLiked: false,
  },
  {
    id: '5',
    title: 'Gap year before college - worth it?',
    author: 'Emma R.',
    category: 'General',
    content: 'Considering taking a gap year. What are the pros and cons?',
    likes: 15,
    replies: 11,
    timestamp: '3 days ago',
    isLiked: false,
  },
]

const categories = ['All', 'Essays', 'Admissions', 'Financial Aid', 'College Life', 'General']

export default function ForumsPage() {
  const [posts, setPosts] = useState(mockPosts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleLike = (id: string) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Student Forums</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with students and share your college journey
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-4">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Members</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-4">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold">3,582</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Posts</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">245</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Posts Today</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-card hover:shadow-xl transition-all cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{post.author}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                        {post.category}
                      </span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                <div className="flex items-center gap-4">
                  <Button
                    variant={post.isLiked ? 'default' : 'outline'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLike(post.id)
                    }}
                  >
                    <ThumbsUp className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {post.replies} Replies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No posts found matching your criteria. Try adjusting your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
