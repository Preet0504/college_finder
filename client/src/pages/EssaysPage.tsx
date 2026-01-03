import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Sparkles, Download, Plus, Edit3, Trash2, BookOpen } from 'lucide-react'
import api from '@/lib/api'

interface Essay {
  id: string
  title: string
  university: string
  prompt: string
  content: string
  wordCount: number
  wordLimit: number
  lastEdited: string
}

const essayPrompts = [
  {
    title: "Personal Identity",
    prompt: "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.",
  },
  {
    title: "Overcoming Challenges",
    prompt: "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?",
  },
  {
    title: "Questioning Beliefs",
    prompt: "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
  },
  {
    title: "Intellectual Curiosity",
    prompt: "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?",
  },
  {
    title: "Personal Growth",
    prompt: "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
  },
  {
    title: "Topic of Choice",
    prompt: "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design.",
  },
]

export default function EssaysPage() {
  const [essays, setEssays] = useState<Essay[]>([])
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null)
  const [showPrompts, setShowPrompts] = useState(false)
  const [showNewEssayForm, setShowNewEssayForm] = useState(false)
  const [newEssayTitle, setNewEssayTitle] = useState('')
  const [newEssayUniversity, setNewEssayUniversity] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState('')

  useEffect(() => {
    const fetchEssays = async () => {
      try {
        console.log('Fetching essays...');
        const response = await api.get('/user/essays')
        console.log('Essays response:', response.data);
        const formatted = response.data.map((e: any) => ({
          id: e.id.toString(),
          title: e.title,
          university: 'General',
          prompt: 'Application Essay',
          content: e.content,
          wordCount: e.wordCount,
          wordLimit: 650,
          lastEdited: new Date(e.lastUpdated).toLocaleDateString()
        }))
        setEssays(formatted)
      } catch (error) {
        console.error('Failed to fetch essays:', error)
        setEssays([])
      }
    }
    fetchEssays()
  }, [])

  const createNewEssay = () => {
    if (!newEssayTitle.trim()) return
    
    const essay: Essay = {
      id: Date.now().toString(),
      title: newEssayTitle,
      university: newEssayUniversity || 'General',
      prompt: selectedPrompt || 'Write your essay here...',
      content: '',
      wordCount: 0,
      wordLimit: 650,
      lastEdited: 'Just now',
    }
    
    setEssays([...essays, essay])
    setSelectedEssay(essay)
    setShowNewEssayForm(false)
    setNewEssayTitle('')
    setNewEssayUniversity('')
    setSelectedPrompt('')
  }

  const updateEssay = (content: string) => {
    if (!selectedEssay) return
    
    const wordCount = content.split(/\s+/).filter(Boolean).length
    const updated = { 
      ...selectedEssay, 
      content, 
      wordCount,
      lastEdited: 'Just now',
    }
    
    setSelectedEssay(updated)
    setEssays(essays.map(e => e.id === updated.id ? updated : e))
  }

  const deleteEssay = (id: string) => {
    setEssays(essays.filter(e => e.id !== id))
    if (selectedEssay?.id === id) {
      setSelectedEssay(null)
    }
  }

  const getWordCountColor = (count: number, limit: number) => {
    const percentage = (count / limit) * 100
    if (percentage > 100) return 'text-red-600'
    if (percentage > 90) return 'text-orange-600'
    if (percentage > 70) return 'text-green-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Essay Assistant</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Write, organize, and perfect your college application essays
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowPrompts(!showPrompts)}>
            <BookOpen className="h-4 w-4 mr-2" />
            Essay Prompts
          </Button>
          <Button onClick={() => setShowNewEssayForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Essay
          </Button>
        </div>
      </div>

      {showPrompts && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <FileText className="h-5 w-5" />
                Common Application Essay Prompts 2024-2025
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {essayPrompts.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedPrompt(item.prompt)
                      setShowNewEssayForm(true)
                      setShowPrompts(false)
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full">
                        {index + 1}
                      </span>
                      <span className="font-semibold text-sm">{item.title}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {item.prompt}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {showNewEssayForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Create New Essay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Essay Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Personal Statement"
                    value={newEssayTitle}
                    onChange={(e) => setNewEssayTitle(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">University (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Stanford University"
                    value={newEssayUniversity}
                    onChange={(e) => setNewEssayUniversity(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>
              {selectedPrompt && (
                <div>
                  <label className="block text-sm font-medium mb-2">Selected Prompt</label>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                    {selectedPrompt}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button onClick={createNewEssay}>Create Essay</Button>
                <Button variant="outline" onClick={() => {
                  setShowNewEssayForm(false)
                  setSelectedPrompt('')
                }}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Essays</h2>
            <span className="text-sm text-gray-500">{essays.length} essays</span>
          </div>
          
          {essays.length > 0 ? (
            <div className="space-y-3">
              {essays.map((essay) => (
                <motion.div
                  key={essay.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card
                    className={`cursor-pointer transition-all border-0 shadow-md hover:shadow-lg ${
                      selectedEssay?.id === essay.id ? 'ring-2 ring-blue-600' : ''
                    }`}
                    onClick={() => setSelectedEssay(essay)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="font-semibold line-clamp-1">{essay.title}</div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteEssay(essay.id)
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {essay.university}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={getWordCountColor(essay.wordCount, essay.wordLimit)}>
                          {essay.wordCount} / {essay.wordLimit} words
                        </span>
                        <span className="text-gray-400">{essay.lastEdited}</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            essay.wordCount > essay.wordLimit ? 'bg-red-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min((essay.wordCount / essay.wordLimit) * 100, 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 bg-gray-50 dark:bg-gray-900">
              <CardContent className="p-8 text-center">
                <FileText className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-500 mb-4">No essays yet. Start writing!</p>
                <Button size="sm" onClick={() => setShowNewEssayForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Essay
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedEssay ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="border-b bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedEssay.title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedEssay.university}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Essay Prompt</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedEssay.prompt}
                    </div>
                  </div>

                  <Textarea
                    value={selectedEssay.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateEssay(e.target.value)}
                    className="min-h-[400px] font-serif text-base leading-relaxed resize-none border-0 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                    placeholder="Start writing your essay here..."
                  />

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className={`text-2xl font-bold ${getWordCountColor(selectedEssay.wordCount, selectedEssay.wordLimit)}`}>
                          {selectedEssay.wordCount}
                        </span>
                        <span className="text-gray-400"> / {selectedEssay.wordLimit} words</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedEssay.wordCount > selectedEssay.wordLimit 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {selectedEssay.wordCount > selectedEssay.wordLimit ? 'Over limit' : 'Within limit'}
                      </span>
                    </div>
                  </div>

                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        Writing Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Start with a compelling hook</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Show, don't tell with examples</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Connect story to future goals</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Be authentic and genuine</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>End with reflection and growth</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Proofread multiple times</span>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="h-full flex items-center justify-center border-dashed border-2 bg-gray-50 dark:bg-gray-900">
              <CardContent className="text-center py-16">
                <Edit3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No Essay Selected</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                  Select an essay from the list to start editing, or create a new one.
                </p>
                <Button onClick={() => setShowNewEssayForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Essay
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
