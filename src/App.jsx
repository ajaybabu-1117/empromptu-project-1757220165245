import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

// Components
import IntroVideo from './components/IntroVideo'
import LanguageSelector from './components/LanguageSelector'
import Onboarding from './components/Onboarding'
import Authentication from './components/Authentication'
import HomePage from './pages/HomePage'
import OrganizationProfile from './pages/OrganizationProfile'
import DonationFlow from './pages/DonationFlow'
import Profile from './pages/Profile'
import VoiceAssistant from './components/VoiceAssistant'
import FloatingDonateButton from './components/FloatingDonateButton'

// Hooks
import { useVoiceAssistant } from './hooks/useVoiceAssistant'
import { useAuth } from './hooks/useAuth'
import { useDarkMode } from './hooks/useDarkMode'

function App() {
  const { i18n } = useTranslation()
  const [showIntro, setShowIntro] = useState(true)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  
  const { isVoiceEnabled, toggleVoice } = useVoiceAssistant()
  const { user, login, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  useEffect(() => {
    // Check if user has seen intro before
    const hasSeenIntro = localStorage.getItem('kindheart_intro_seen')
    const selectedLanguage = localStorage.getItem('kindheart_language')
    const hasSeenOnboarding = localStorage.getItem('kindheart_onboarding_seen')
    
    if (hasSeenIntro) {
      setShowIntro(false)
      if (!selectedLanguage) {
        setShowLanguageSelector(true)
      } else if (!hasSeenOnboarding) {
        setShowOnboarding(true)
      }
    }
  }, [])

  const handleIntroComplete = () => {
    localStorage.setItem('kindheart_intro_seen', 'true')
    setShowIntro(false)
    
    const selectedLanguage = localStorage.getItem('kindheart_language')
    if (!selectedLanguage) {
      setShowLanguageSelector(true)
    } else {
      const hasSeenOnboarding = localStorage.getItem('kindheart_onboarding_seen')
      if (!hasSeenOnboarding) {
        setShowOnboarding(true)
      }
    }
  }

  const handleLanguageSelected = (language) => {
    i18n.changeLanguage(language)
    localStorage.setItem('kindheart_language', language)
    setShowLanguageSelector(false)
    
    const hasSeenOnboarding = localStorage.getItem('kindheart_onboarding_seen')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem('kindheart_onboarding_seen', 'true')
    setShowOnboarding(false)
  }

  const handleAuthRequired = () => {
    setShowAuth(true)
  }

  const handleAuthComplete = (userData) => {
    setIsAuthenticated(true)
    setShowAuth(false)
    login(userData)
  }

  if (showIntro) {
    return <IntroVideo onComplete={handleIntroComplete} />
  }

  if (showLanguageSelector) {
    return <LanguageSelector onLanguageSelected={handleLanguageSelected} />
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  if (showAuth) {
    return <Authentication onComplete={handleAuthComplete} />
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/organization/:id" element={<OrganizationProfile />} />
            <Route path="/donate/:orgId" element={<DonationFlow onAuthRequired={handleAuthRequired} />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          
          <VoiceAssistant isEnabled={isVoiceEnabled} onToggle={toggleVoice} />
          <FloatingDonateButton />
          
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#f3f4f6' : '#111827',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              },
            }}
          />
        </div>
      </Router>
    </div>
  )
}

export default App
