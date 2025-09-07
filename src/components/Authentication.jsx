import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, Mail, Phone, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const Authentication = ({ onComplete }) => {
  const { t } = useTranslation()
  const [authMethod, setAuthMethod] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      // Simulate Google login
      await new Promise(resolve => setTimeout(resolve, 1500))
      const userData = {
        id: 'google_' + Date.now(),
        name: 'John Doe',
        email: 'john@example.com',
        method: 'google'
      }
      onComplete(userData)
      toast.success('Welcome to KindHeart!')
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneLogin = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }
    
    setLoading(true)
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowOTP(true)
      toast.success('OTP sent to your phone')
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    
    setLoading(true)
    try {
      // Simulate email verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowOTP(true)
      toast.success('Verification code sent to your email')
    } catch (error) {
      toast.error('Failed to send verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerification = async () => {
    if (!otp || otp.length < 4) {
      toast.error('Please enter the verification code')
      return
    }
    
    setLoading(true)
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      const userData = {
        id: (authMethod === 'phone' ? 'phone_' : 'email_') + Date.now(),
        name: 'User',
        contact: authMethod === 'phone' ? phoneNumber : email,
        method: authMethod
      }
      onComplete(userData)
      toast.success('Welcome to KindHeart!')
    } catch (error) {
      toast.error('Invalid verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    onComplete(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl mb-6"
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold gradient-text mb-2"
          >
            {t('auth.title')}
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400"
          >
            {t('auth.subtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {!authMethod && !showOTP && (
            <>
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center space-x-3"
              >
                <span className="text-2xl">🔍</span>
                <span>{t('auth.googleLogin')}</span>
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              </button>

              <button
                onClick={() => setAuthMethod('phone')}
                className="w-full btn-secondary flex items-center justify-center space-x-3"
              >
                <Phone className="w-5 h-5" />
                <span>{t('auth.phoneLogin')}</span>
              </button>

              <button
                onClick={() => setAuthMethod('email')}
                className="w-full btn-secondary flex items-center justify-center space-x-3"
              >
                <Mail className="w-5 h-5" />
                <span>{t('auth.emailLogin')}</span>
              </button>

              <div className="text-center pt-4">
                <button
                  onClick={handleSkip}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium"
                >
                  {t('auth.skipForNow')}
                </button>
              </div>
            </>
          )}

          {authMethod === 'phone' && !showOTP && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.enterPhone')}
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800 bg-white dark:bg-gray-800"
                />
              </div>
              <button
                onClick={handlePhoneLogin}
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <span>{t('auth.continue')}</span>
                <ArrowRight className="w-5 h-5" />
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              </button>
              <button
                onClick={() => setAuthMethod(null)}
                className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Back
              </button>
            </motion.div>
          )}

          {authMethod === 'email' && !showOTP && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.enterEmail')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800 bg-white dark:bg-gray-800"
                />
              </div>
              <button
                onClick={handleEmailLogin}
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <span>{t('auth.continue')}</span>
                <ArrowRight className="w-5 h-5" />
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              </button>
              <button
                onClick={() => setAuthMethod(null)}
                className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Back
              </button>
            </motion.div>
          )}

          {showOTP && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.enterOTP')}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800 bg-white dark:bg-gray-800 text-center text-2xl tracking-widest"
                />
              </div>
              <button
                onClick={handleOTPVerification}
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <span>{t('auth.continue')}</span>
                <ArrowRight className="w-5 h-5" />
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              </button>
              <button
                onClick={() => setShowOTP(false)}
                className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Back
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Authentication
