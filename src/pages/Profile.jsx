import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Award, Calendar, Download, TrendingUp } from 'lucide-react'

const Profile = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [donations, setDonations] = useState([])
  const [stats, setStats] = useState({
    totalDonated: 0,
    organizationsSupported: 0,
    donationCount: 0,
    kindnessLevel: 1
  })

  useEffect(() => {
    fetchDonationHistory()
  }, [])

  const fetchDonationHistory = async () => {
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
          query: `
            SELECT d.*, o.name as organization_name, o.image_url as organization_image
            FROM newschema_18b52b86d167439a923daddcfe4a7092.donations d
            LEFT JOIN newschema_18b52b86d167439a923daddcfe4a7092.organizations o ON d.organization_id = o.id
            ORDER BY d.created_at DESC
          `
        })
      })

      const result = await response.json()
      if (result.success && result.data) {
        setDonations(result.data)
        
        // Calculate stats
        const totalDonated = result.data.reduce((sum, donation) => sum + donation.amount, 0)
        const organizationsSupported = new Set(result.data.map(d => d.organization_id)).size
        const donationCount = result.data.length
        const kindnessLevel = Math.floor(totalDonated / 1000) + 1

        setStats({
          totalDonated,
          organizationsSupported,
          donationCount,
          kindnessLevel: Math.min(kindnessLevel, 10)
        })
      }
    } catch (error) {
      console.error('Error fetching donation history:', error)
    }
  }

  const getKindnessLevelName = (level) => {
    const levels = [
      'Kind Heart', 'Generous Soul', 'Compassionate Spirit', 'Angel of Kindness',
      'Guardian of Hope', 'Champion of Change', 'Hero of Hearts', 'Saint of Giving',
      'Legend of Love', 'Master of Kindness'
    ]
    return levels[Math.min(level - 1, levels.length - 1)]
  }

  const getKindnessLevelColor = (level) => {
    if (level >= 8) return 'from-purple-500 to-purple-600'
    if (level >= 6) return 'from-yellow-500 to-yellow-600'
    if (level >= 4) return 'from-green-500 to-green-600'
    if (level >= 2) return 'from-blue-500 to-blue-600'
    return 'from-primary-500 to-primary-600'
  }

  const downloadReport = () => {
    const reportContent = `
KINDHEART IMPACT REPORT
======================

Total Donated: ₹${stats.totalDonated.toLocaleString()}
Organizations Supported: ${stats.organizationsSupported}
Number of Donations: ${stats.donationCount}
Kindness Level: ${stats.kindnessLevel} - ${getKindnessLevelName(stats.kindnessLevel)}

DONATION HISTORY:
${donations.map(d => `
- ${new Date(d.created_at).toLocaleDateString()}: ₹${d.amount} to ${d.organization_name}
`).join('')}

Thank you for making a difference!
KindHeart - Where Kindness Creates Change
    `
    
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `KindHeart_Impact_Report_${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              My Profile
            </h1>
            <button
              onClick={downloadReport}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Kindness Level */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${getKindnessLevelColor(stats.kindnessLevel)} rounded-full mb-6`}
          >
            <Award className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Level {stats.kindnessLevel}
          </h2>
          <h3 className="text-xl gradient-text font-semibold mb-4">
            {getKindnessLevelName(stats.kindnessLevel)}
          </h3>
          
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progress to next level</span>
              <span>{stats.totalDonated % 1000}/1000</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.totalDonated % 1000) / 10}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`bg-gradient-to-r ${getKindnessLevelColor(stats.kindnessLevel)} h-3 rounded-full`}
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white fill-current" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              ₹{stats.totalDonated.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Donated
            </div>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-trust-500 to-trust-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {stats.organizationsSupported}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Organizations Supported
            </div>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-warm-500 to-warm-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {stats.donationCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Donations
            </div>
          </div>
        </motion.div>

        {/* Donation History */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Donation History
          </h3>
          
          {donations.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                No donations yet
              </h4>
              <p className="text-gray-400 dark:text-gray-500 mb-6">
                Start your kindness journey by making your first donation
              </p>
              <button
                onClick={() => navigate('/')}
                className="btn-primary"
              >
                Explore Organizations
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl"
                >
                  <img
                    src={donation.organization_image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=100'}
                    alt={donation.organization_name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {donation.organization_name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(donation.created_at).toLocaleDateString()} • {donation.donation_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      ₹{donation.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      {donation.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Achievements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl ${stats.donationCount >= 1 ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stats.donationCount >= 1 ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <Heart className="w-5 h-5 text-white fill-current" />
                </div>
                <div>
                  <h4 className={`font-semibold ${stats.donationCount >= 1 ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    First Donation
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Make your first donation
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl ${stats.totalDonated >= 1000 ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stats.totalDonated >= 1000 ? 'bg-blue-500' : 'bg-gray-400'}`}>
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold ${stats.totalDonated >= 1000 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    Generous Giver
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Donate ₹1,000 or more
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl ${stats.organizationsSupported >= 3 ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800' : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stats.organizationsSupported >= 3 ? 'bg-purple-500' : 'bg-gray-400'}`}>
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold ${stats.organizationsSupported >= 3 ? 'text-purple-700 dark:text-purple-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    Community Hero
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Support 3+ organizations
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-2xl ${stats.donationCount >= 10 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800' : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stats.donationCount >= 10 ? 'bg-yellow-500' : 'bg-gray-400'}`}>
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold ${stats.donationCount >= 10 ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    Consistent Supporter
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Make 10+ donations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
