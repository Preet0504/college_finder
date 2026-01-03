import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  GraduationCap, 
  Search, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Award,
  ArrowRight,
  Sparkles,
  Globe,
  Target,
  CheckCircle2
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'AI-Powered Matching',
    description: 'Get personalized university recommendations based on your academic profile, interests, and goals using real-time 2025 data.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: DollarSign,
    title: 'Scholarship Finder',
    description: 'Discover real scholarships with verified amounts, deadlines, and eligibility requirements updated for 2025.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: TrendingUp,
    title: 'Application Timeline',
    description: 'Stay organized with our Kanban-style tracker. Drag and drop to manage your application progress.',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: Award,
    title: 'Essay Assistant',
    description: 'Write compelling essays with guided prompts, word count tracking, and professional writing tips.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: Users,
    title: 'University Comparison',
    description: 'Compare universities side-by-side with real rankings, tuition costs, acceptance rates, and more.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Access data on universities worldwide including the US, UK, Canada, Australia, and Europe.',
    color: 'from-indigo-500 to-blue-500',
  },
]

const stats = [
  { value: '20K+', label: 'Universities' },
  { value: '$15B+', label: 'Scholarships' },
  { value: '150+', label: 'Countries' },
  { value: '2025', label: 'Updated Data' },
]

export default function HomePage() {
  return (
    <div className="space-y-24">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Powered by AI with Real-Time 2025 Data
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Find Your Perfect
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">University</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover universities tailored to your profile with AI-powered recommendations, 
            real-time rankings, scholarship matching, and application tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="pt-12 flex items-center justify-center gap-8 flex-wrap">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From discovery to acceptance — we've got you covered
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all bg-white dark:bg-gray-900 group cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="py-16">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-600 to-purple-700 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />
          
          <CardContent className="p-12 md:p-16 relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Students Choose Us
                </h2>
                <div className="space-y-4">
                  {[
                    'Real-time data updated for 2025 academic year',
                    'AI-powered recommendations based on your profile',
                    'Verified scholarship information with actual deadlines',
                    'Compare up to 4 universities side-by-side',
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-lg text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block p-8 bg-white/10 backdrop-blur-sm rounded-3xl">
                  <Target className="h-20 w-20 mx-auto mb-4 text-white/90" />
                  <div className="text-5xl font-bold mb-2">95%</div>
                  <div className="text-white/80">Match Accuracy</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="py-16">
        <Card className="border-0 shadow-xl bg-white dark:bg-gray-900">
          <CardContent className="p-12 md:p-16 text-center">
            <GraduationCap className="h-16 w-16 mx-auto mb-6 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Dream University?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Start your journey today with our AI-powered questionnaire. It only takes 5 minutes to get personalized recommendations.
            </p>
            <Link to="/signup">
              <Button size="lg" className="text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-blue-600 to-purple-600">
                Get Personalized Recommendations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
