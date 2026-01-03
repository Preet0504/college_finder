import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import RecommendationsPage from '@/pages/RecommendationsPage'
import ScholarshipsPage from '@/pages/ScholarshipsPage'
import TimelinePage from '@/pages/TimelinePage'
import EssaysPage from '@/pages/EssaysPage'
import ForumsPage from '@/pages/ForumsPage'
import ComparisonPage from '@/pages/ComparisonPage'
import ProfilePage from '@/pages/ProfilePage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/essays" element={<EssaysPage />} />
          <Route path="/forums" element={<ForumsPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
