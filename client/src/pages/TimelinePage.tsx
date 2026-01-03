import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, CheckCircle2, Clock, AlertCircle, GripVertical, Trash2 } from 'lucide-react'
import api from '@/lib/api'

interface Application {
  id: string
  university: string
  deadline: string
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Completed'
  priority: 'high' | 'medium' | 'low'
  requirements: string[]
  website?: string
}

export default function TimelinePage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [draggedApp, setDraggedApp] = useState<Application | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<Application['status'] | null>(null)
  const [newApp, setNewApp] = useState({
    university: '',
    deadline: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
  })

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log('Fetching applications...');
        const response = await api.get('/user/applications')
        console.log('Applications response:', response.data);
        const formatted = response.data.map((app: any) => ({
          id: app.id.toString(),
          university: app.universityName,
          deadline: app.deadline || new Date().toISOString(),
          status: app.status === 'planned' ? 'Not Started' : (app.status === 'in_progress' ? 'In Progress' : 'Submitted'),
          priority: app.priority,
          requirements: ['Transcripts', 'Personal Statement']
        }))
        setApplications(formatted)
      } catch (error) {
        console.error('Failed to fetch applications:', error)
        setApplications([])
      }
    }
    fetchApplications()
  }, [])

  const statusColumns = {
    'Not Started': applications.filter(app => app.status === 'Not Started'),
    'In Progress': applications.filter(app => app.status === 'In Progress'),
    'Submitted': applications.filter(app => app.status === 'Submitted'),
    'Completed': applications.filter(app => app.status === 'Completed'),
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
      case 'medium': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Not Started': return { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' }
      case 'In Progress': return { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' }
      case 'Submitted': return { icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' }
      case 'Completed': return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' }
      default: return { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-100' }
    }
  }

  const handleDragStart = (app: Application) => {
    setDraggedApp(app)
  }

  const handleDragOver = (e: React.DragEvent, status: Application['status']) => {
    e.preventDefault()
    setDragOverColumn(status)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (newStatus: Application['status']) => {
    if (draggedApp) {
      setApplications(applications.map(app =>
        app.id === draggedApp.id ? { ...app, status: newStatus } : app
      ))
      setDraggedApp(null)
      setDragOverColumn(null)
    }
  }

  const handleDragEnd = () => {
    setDraggedApp(null)
    setDragOverColumn(null)
  }

  const addApplication = () => {
    if (!newApp.university || !newApp.deadline) return
    
    const application: Application = {
      id: Date.now().toString(),
      university: newApp.university,
      deadline: newApp.deadline,
      status: 'Not Started',
      priority: newApp.priority,
      requirements: ['Common App Essay', 'Transcripts', 'Letters of Recommendation'],
    }
    
    setApplications([...applications, application])
    setNewApp({ university: '', deadline: '', priority: 'medium' })
    setShowAddForm(false)
  }

  const deleteApplication = (id: string) => {
    setApplications(applications.filter(app => app.id !== id))
  }

  const upcomingDeadlines = applications
    .filter(app => app.status !== 'Completed' && getDaysUntilDeadline(app.deadline) <= 14 && getDaysUntilDeadline(app.deadline) > 0)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Application Timeline</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your college applications and never miss a deadline
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)} 
          size="lg"
          className="shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Application
        </Button>
      </div>

      {upcomingDeadlines.length > 0 && (
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertCircle className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {upcomingDeadlines.map((app) => (
                <div key={app.id} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-sm">{app.university}</span>
                  <span className="text-xs text-orange-600 font-semibold">
                    {getDaysUntilDeadline(app.deadline)} days left
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Add New Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">University Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Stanford University"
                    value={newApp.university}
                    onChange={(e) => setNewApp({ ...newApp, university: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Application Deadline</label>
                  <input
                    type="date"
                    value={newApp.deadline}
                    onChange={(e) => setNewApp({ ...newApp, deadline: e.target.value })}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={newApp.priority}
                    onChange={(e) => setNewApp({ ...newApp, priority: e.target.value as 'high' | 'medium' | 'low' })}
                    className="w-full h-11 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={addApplication}>Add Application</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(statusColumns).map(([status, apps]) => {
          const statusStyle = getStatusStyles(status)
          const StatusIcon = statusStyle.icon
          
          return (
            <div 
              key={status}
              onDragOver={(e) => handleDragOver(e, status as Application['status'])}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(status as Application['status'])}
              className={`min-h-[300px] rounded-xl p-4 transition-all ${statusStyle.bg} ${
                dragOverColumn === status ? 'ring-2 ring-blue-400 ring-offset-2' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <StatusIcon className={`h-5 w-5 ${statusStyle.color}`} />
                <h2 className="text-lg font-semibold">{status}</h2>
                <span className="ml-auto text-sm font-medium text-gray-500 bg-white dark:bg-gray-900 px-2 py-0.5 rounded-full">
                  {apps.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {apps.map((app, index) => {
                  const daysLeft = getDaysUntilDeadline(app.deadline)
                  const isOverdue = daysLeft < 0
                  const isUrgent = daysLeft > 0 && daysLeft <= 7
                  
                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      draggable
                      onDragStart={() => handleDragStart(app)}
                      onDragEnd={handleDragEnd}
                      className={`cursor-grab active:cursor-grabbing ${draggedApp?.id === app.id ? 'opacity-50' : ''}`}
                    >
                      <Card className="bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all border-0">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2">
                              <GripVertical className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <h3 className="font-semibold text-sm leading-tight">{app.university}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(app.deadline).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => deleteApplication(app.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getPriorityStyles(app.priority)}`}>
                              {app.priority.charAt(0).toUpperCase() + app.priority.slice(1)}
                            </span>
                            {isOverdue && (
                              <span className="text-xs px-2 py-1 bg-red-600 text-white rounded-full font-medium">
                                Overdue
                              </span>
                            )}
                            {isUrgent && !isOverdue && (
                              <span className="text-xs px-2 py-1 bg-orange-500 text-white rounded-full font-medium animate-pulse">
                                {daysLeft} days left
                              </span>
                            )}
                          </div>

                          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                            <div className="text-xs text-gray-500 mb-1.5">Requirements:</div>
                            <div className="space-y-1">
                              {app.requirements.slice(0, 2).map((req, i) => (
                                <div key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                  {req}
                                </div>
                              ))}
                              {app.requirements.length > 2 && (
                                <div className="text-xs text-blue-600 font-medium">
                                  +{app.requirements.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
                
                {apps.length === 0 && (
                  <div className="text-sm text-gray-400 text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    Drag applications here
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {applications.length === 0 && (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-dashed border-2">
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start tracking your college applications by adding your first one. You can drag and drop to update their status.
            </p>
            <Button size="lg" onClick={() => setShowAddForm(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Application
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
