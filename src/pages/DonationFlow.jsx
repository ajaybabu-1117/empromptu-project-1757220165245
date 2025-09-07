import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Heart, Download, Share2 } from 'lucide-react'
import Confetti from 'react-confetti'
import toast from 'react-hot-toast'
import { useSpeechSynthesis } from 'react-speech-kit'

const DonationFlow = ({ onAuthRequired }) => {
  const { orgId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { speak } = useSpeechSynthesis()
  
  const [step, setStep] = useState(1) // 1: Amount, 2: Payment, 3: Success
  const [organization, setOrganization] = useState(null)
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [customAmount, setCustomAmount] = useState('')
  const [donationType, setDonationType] = useState('one-time')
  const [loading, setLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [donationId, setDonationId] = useState(null)

  const predefinedAmounts = [100, 500, 1000, 2500, 5000]

  useEffect(() => {
    fetchOrganization()
  }, [orgId])

  useEffect(() => {
    if (step === 3) {
      setShowConfetti(true)
      speak({ text: t('donation.success') + ' ' + t('donation.successMessage') })
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [step, speak, t])

  const fetchOrganization = async () => {
    try {
      const response = await fetch('https://builder.empromptu.ai/api_tools/templates/call_postgres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer a2a2a942a2b9564238feed3c93ae5293',
          'X-Generated-App-ID': '18b52b86-d167-439a-923d-addcfe4a7092',
          'X-Usage-Key': 'e85217307274d5b8ba7347ba629bab6a'
        },
        body: JSON.stringify({
          query: 'SELECT * FROM newschema_18b52b86d167439a923daddcfe4a7092.organizations WHERE id = $1',
          params: [orgId]
        })
      })

      const result = await response.json()
      if (result.success && result.data && result.data.length > 0) {
        setOrganization(result.data[0])
      }
    } catch (error) {
      console.error('Error fetching organization:', error)
    }
  }

  const createDonationsTable = async () => {
    try {
      await fetch('https://builder.empromptu.ai/api_tools/templates/call_postgres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer a2a2a942a2b9564238feed3c93ae5293',
          'X-Generated-App-ID': '18b52b86-d167-439a-923d-addcfe4a7092',
          'X-Usage-Key': 'e85217307274d5b8ba7347ba629bab6a'
        },
        body: JSON.stringify({
          query: `
            CREATE TABLE IF NOT EXISTS newschema_18b52b86d167439a923daddcfe4a7092.donations (
              id SERIAL PRIMARY KEY,
              organization_id INTEGER NOT NULL,
              amount INTEGER NOT NULL,
              donation_type VARCHAR(50) NOT NULL,
              donor_name VARCHAR(255),
              donor_email VARCHAR(255),
              payment_method VARCHAR(100),
              status VARCHAR(50) DEFAULT 'completed',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `
        })
      })
    } catch (error) {
      console.error('Error creating donations table:', error)
    }
  }

  const getImpactMessage = (amount) => {
    if (amount >= 5000) return "Provides comprehensive care for 10 beneficiaries for a month"
    if (amount >= 2500) return "Covers medical expenses for 5 beneficiaries"
    if (amount >= 1000) return "Provides educational materials for 10 children"
    if (amount >= 500) return "Feeds 5 children for a week"
    return "Provides basic necessities for 1 beneficiary"
  }

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount)
    setCustomAmount('')
    speak({ text: `Selected amount ${amount} rupees. ${getImpactMessage(amount)}` })
  }

  const handleCustomAmountChange = (value) => {
    setCustomAmount(value)
    setSelectedAmount(null)
    if (value && !isNaN(value)) {
      speak({ text: `Custom amount ${value} rupees. ${getImpactMessage(parseInt(value))}` })
    }
  }

  const handleDonationTypeChange = (type) => {
    setDonationType(type)
    speak({ text: `Selected ${type} donation` })
  }

  const handleProceedToPayment = () => {
    const amount = selectedAmount || parseInt(customAmount)
    if (!amount || amount < 10) {
      toast.error('Please select or enter a valid amount (minimum ₹10)')
      return
    }
    
    speak({ text: 'Proceeding to payment gateway' })
    setStep(2)
    
    // Simulate payment processing
    setTimeout(() => {
      processPayment(amount)
    }, 2000)
  }

  const processPayment = async (amount) => {
    setLoading(true)
    speak({ text: 'Processing your payment. Please wait.' })
    
    try {
      // Create donations table if it doesn't exist
      await createDonationsTable()
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Record the donation
      const donationResponse = await fetch('https://builder.empromptu.ai/api_tools/templates/call_postgres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer a2a2a942a2b9564238feed3c93ae5293',
          'X-Generated-App-ID': '18b52b86-d167-439a-923d-addcfe4a7092',
          'X-Usage-Key': 'e85217307274d5b8ba7347ba629bab6a'
        },
        body: JSON.stringify({
          query: `
            INSERT INTO newschema_18b52b86d167439a923daddcfe4a7092.donations 
            (organization_id, amount, donation_type, donor_name, payment_method, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
          `,
          params: [orgId, amount, donationType, 'Anonymous Donor', 'UPI', 'completed']
        })
      })

      const donationResult = await donationResponse.json()
      if (donationResult.success && donationResult.data) {
        setDonationId(donationResult.data[0].id)
      }

      // Update organization's raised amount
      await fetch('https://builder.empromptu.ai/api_tools/templates/call_postgres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer a2a2a942a2b9564238feed3c93ae5293',
          'X-Generated-App-ID': '18b52b86-d167-439a-923d-addcfe4a7092',
          'X-Usage-Key': 'e85217307274d5b8ba7347ba629bab6a'
        },
        body: JSON.stringify({
          query: `
            UPDATE newschema_18b52b86d167439a923daddcfe4a7092.organizations 
            SET raised_amount = raised_amount + $1 
            WHERE id = $2
          `,
          params: [amount, orgId]
        })
      })

      setStep(3)
      toast.success('Donation successful! Thank you for your kindness.')
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
      speak({ text: 'Payment failed. Please try again.' })
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  const generateReceipt = () => {
    const amount = selectedAmount || parseInt(customAmount)
    const receiptData = {
      donationId: donationId || 'KH' + Date.now(),
      organizationName: organization?.name,
      amount: amount,
      donationType: donationType,
      date: new Date().toLocaleDateString(),
      paymentMethod: 'UPI'
    }
    
    // Create and download receipt
    const receiptContent = `
KINDHEART DONATION RECEIPT
========================

Donation ID: ${receiptData.donationId}
Organization: ${receiptData.organizationName}
Amount: ₹${receiptData.amount}
Type: ${receiptData.donationType}
Date: ${receiptData.date}
Payment Method: ${receiptData.paymentMethod}

Thank you for your generous donation!
Your kindness makes a difference.

KindHeart - Where Kindness Creates Change
    `
    
    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `KindHeart_Receipt_${receiptData.donationId}.txt`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Receipt downloaded!')
  }

  const shareImpact = async () => {
    const amount = selectedAmount || parseInt(customAmount)
    const shareText = `I just donated ₹${amount} to ${organization?.name} through KindHeart! Join me in spreading kindness. #KindHeart #Donation #MakeADifference`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My KindHeart Donation',
          text: shareText,
          url: window.location.origin,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(shareText)
      toast.success('Impact message copied to clipboard!')
    }
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => step === 1 ? navigate(-1) : setStep(step - 1)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Step {step} of 3
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="space-y-6"
            >
              {/* Organization Info */}
              <div className="card text-center">
                <img
                  src={organization.image_url}
                  alt={organization.name}
                  className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover"
                />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {organization.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {organization.description}
                </p>
              </div>

              {/* Amount Selection */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {t('donation.selectAmount')}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {predefinedAmounts.map((amount) => (
                    <motion.button
                      key={amount}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        selectedAmount === amount
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                      }`}
                    >
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        ₹{amount}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('donation.customAmount')}
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800 bg-white dark:bg-gray-800"
                  />
                </div>

                {/* Impact Preview */}
                {(selectedAmount || customAmount) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-primary-50 to-trust-50 dark:from-primary-900/20 dark:to-trust-900/20 p-4 rounded-2xl mb-6"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {t('donation.impact')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getImpactMessage(selectedAmount || parseInt(customAmount))}
                    </p>
                  </motion.div>
                )}

                {/* Donation Type */}
                <div className="mb-6">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleDonationTypeChange('one-time')}
                      className={`flex-1 py-3 px-4 rounded-2xl border-2 transition-all ${
                        donationType === 'one-time'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {t('donation.oneTime')}
                    </button>
                    <button
                      onClick={() => handleDonationTypeChange('monthly')}
                      className={`flex-1 py-3 px-4 rounded-2xl border-2 transition-all ${
                        donationType === 'monthly'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {t('donation.monthly')}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  disabled={!selectedAmount && !customAmount}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  <span>{t('donation.donate')}</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="text-center"
            >
              <div className="card">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {t('donation.processing')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please wait while we process your donation securely...
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Donating to: {organization.name}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{selectedAmount || customAmount}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="text-center"
            >
              <div className="card">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center"
                >
                  <Heart className="w-10 h-10 text-white fill-current" />
                </motion.div>
                
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold gradient-text mb-4"
                >
                  {t('donation.success')}
                </motion.h2>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 dark:text-gray-400 mb-8"
                >
                  {t('donation.successMessage')}
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-primary-50 to-trust-50 dark:from-primary-900/20 dark:to-trust-900/20 p-6 rounded-2xl mb-8"
                >
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Your donation of
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    ₹{selectedAmount || customAmount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    to {organization.name}
                  </div>
                  <div className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {getImpactMessage(selectedAmount || parseInt(customAmount))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <button
                    onClick={generateReceipt}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>{t('donation.receipt')}</span>
                  </button>
                  <button
                    onClick={shareImpact}
                    className="btn-primary flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>{t('donation.shareImpact')}</span>
                  </button>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                  <button
                    onClick={() => navigate('/')}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium"
                  >
                    Continue Exploring Organizations
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DonationFlow
