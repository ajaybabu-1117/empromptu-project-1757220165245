import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, MapPin, Users, Calendar, Heart, Share2, CheckCircle } from 'lucide-react'

const OrganizationProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrganization()
  }, [id])

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
          params: [id]
        })
      })

      const result = await response.json()
      if (result.success && result.data && result.data.length > 0) {
        setOrganization(result.data[0])
      }
    } catch (error) {
      console.error('Error fetching organization:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDonate = () => {
    navigate(`/donate/${id}`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: organization.name,
          text: organization.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Organization not found
          </h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const progressPercentage = (organization.raised_amount / organization.goal_amount) * 100

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
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card overflow-hidden mb-8"
        >
          <div className="relative h-64 md:h-80">
            <img
              src={organization.image_url}
              alt={organization.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {organization.name}
                </h1>
                {organization.verified && (
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-white/90">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{organization.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Since {new Date(organization.created_at).getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                About Us
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {organization.description}
              </p>
            </motion.div>

            {/* Mission & Impact */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Our Mission & Impact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    150+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Lives Impacted
                  </div>
                </div>
                <div className="text-center p-4 bg-trust-50 dark:bg-trust-900/20 rounded-2xl">
                  <div className="text-3xl font-bold text-trust-600 dark:text-trust-400 mb-2">
                    5+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Years of Service
                  </div>
                </div>
                <div className="text-center p-4 bg-warm-50 dark:bg-warm-900/20 rounded-2xl">
                  <div className="text-3xl font-bold text-warm-600 dark:text-warm-400 mb-2">
                    1000+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Donors Supported
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Updates */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Recent Updates
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary-500 pl-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    2 days ago
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Thanks to your generous donations, we were able to provide new educational materials to all our children.
                  </p>
                </div>
                <div className="border-l-4 border-trust-500 pl-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    1 week ago
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Our new playground equipment has been installed and the children are absolutely loving it!
                  </p>
                </div>
                <div className="border-l-4 border-warm-500 pl-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    2 weeks ago
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    We celebrated our 5th anniversary with a special event for all our residents and volunteers.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Progress */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Current Campaign
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Raised</span>
                    <span>Goal</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                    <span>₹{organization.raised_amount?.toLocaleString()}</span>
                    <span>₹{organization.goal_amount?.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
                    />
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {progressPercentage.toFixed(1)}% completed
                  </div>
                </div>
                
                <button
                  onClick={handleDonate}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  <span>Donate Now</span>
                </button>
              </div>
            </motion.div>

            {/* Impact Calculator */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Your Impact
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                  <span className="text-sm text-gray-700 dark:text-gray-300">₹500</span>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    = 1 month of meals for 1 child
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-trust-50 dark:bg-trust-900/20 rounded-xl">
                  <span className="text-sm text-gray-700 dark:text-gray-300">₹1,000</span>
                  <span className="text-sm font-medium text-trust-600 dark:text-trust-400">
                    = Educational supplies for 5 children
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-warm-50 dark:bg-warm-900/20 rounded-xl">
                  <span className="text-sm text-gray-700 dark:text-gray-300">₹2,500</span>
                  <span className="text-sm font-medium text-warm-600 dark:text-warm-400">
                    = Medical care for 10 residents
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {organization.location}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Registered NGO
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationProfile
