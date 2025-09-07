import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Search, MapPin, Heart, Users, Home, Shield, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [organizations, setOrganizations] = useState([])
  const [urgentCampaigns, setUrgentCampaigns] = useState([])

  useEffect(() => {
    // Initialize database and fetch data
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      // Create tables if they don't exist
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
            CREATE TABLE IF NOT EXISTS newschema_18b52b86d167439a923daddcfe4a7092.organizations (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              type VARCHAR(100) NOT NULL,
              location VARCHAR(255) NOT NULL,
              description TEXT,
              image_url VARCHAR(500),
              verified BOOLEAN DEFAULT false,
              urgent_need BOOLEAN DEFAULT false,
              goal_amount INTEGER DEFAULT 0,
              raised_amount INTEGER DEFAULT 0,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `
        })
      })

      // Insert sample data
      await insertSampleData()
      
      // Fetch organizations
      await fetchOrganizations()
    } catch (error) {
      console.error('Error initializing data:', error)
    }
  }

  const insertSampleData = async () => {
    const sampleOrgs = [
      {
        name: 'Sunshine Orphanage',
        type: 'orphanage',
        location: 'Mumbai',
        description: 'Caring for 150 children with love and education',
        image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400',
        verified: true,
        urgent_need: true,
        goal_amount: 500000,
        raised_amount: 320000
      },
      {
        name: 'Golden Years Home',
        type: 'old_age',
        location: 'Delhi',
        description: 'Providing comfort and care to elderly residents',
        image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
        verified: true,
        urgent_need: false,
        goal_amount: 300000,
        raised_amount: 180000
      },
      {
        name: 'Hope Shelter',
        type: 'shelter',
        location: 'Bangalore',
        description: 'Safe haven for homeless individuals and families',
        image_url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400',
        verified: true,
        urgent_need: true,
        goal_amount: 400000,
        raised_amount: 150000
      },
      {
        name: 'Special Care Center',
        type: 'special_needs',
        location: 'Chennai',
        description: 'Supporting individuals with special needs and their families',
        image_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400',
        verified: true,
        urgent_need: false,
        goal_amount: 600000,
        raised_amount: 420000
      }
    ]

    for (const org of sampleOrgs) {
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
              INSERT INTO newschema_18b52b86d167439a923daddcfe4a7092.organizations 
              (name, type, location, description, image_url, verified, urgent_need, goal_amount, raised_amount)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
              ON CONFLICT DO NOTHING
            `,
            params: [
              org.name, org.type, org.location, org.description, 
              org.image_url, org.verified, org.urgent_need, 
              org.goal_amount, org.raised_amount
            ]
          })
        })
      } catch (error) {
        console.error('Error inserting sample data:', error)
      }
    }
  }

  const fetchOrganizations = async () => {
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
          query: 'SELECT * FROM newschema_18b52b86d167439a923daddcfe4a7092.organizations ORDER BY created_at DESC'
        })
      })

      const result = await response.json()
      if (result.success && result.data) {
        setOrganizations(result.data)
        setUrgentCampaigns(result.data.filter(org => org.urgent_need))
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    }
  }

  const categories = [
    {
      key: 'orphanages',
      name: t('home.categories.orphanages'),
      icon: Heart,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'from-primary-50 to-primary-100',
      type: 'orphanage'
    },
    {
      key: 'oldAge',
      name: t('home.categories.oldAge'),
      icon: Users,
      color: 'from-trust-500 to-trust-600',
      bgColor: 'from-trust-50 to-trust-100',
      type: 'old_age'
    },
    {
      key: 'specialNeeds',
      name: t('home.categories.specialNeeds'),
      icon: Shield,
      color: 'from-warm-500 to-warm-600',
      bgColor: 'from-warm-50 to-warm-100',
      type: 'special_needs'
    },
    {
      key: 'shelters',
      name: t('home.categories.shelters'),
      icon: Home,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      type: 'shelter'
    }
  ]

  const handleCategoryClick = (category) => {
    // Filter organizations by category type
    const filtered = organizations.filter(org => org.type === category.type)
    // Navigate to filtered results or update state
    console.log('Category clicked:', category, filtered)
  }

  const handleOrganizationClick = (org) => {
    navigate(`/organization/${org.id}`)
  }

  const handleDonateClick = (org) => {
    navigate(`/donate/${org.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">KindHeart</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('app.description')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('home.welcome')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Every donation creates countless smiles
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-2xl mx-auto"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('home.searchPlaceholder')}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800 text-lg"
          />
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Choose Your Cause
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.key}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category)}
                className="card card-hover p-6 text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${category.bgColor} rounded-2xl mb-4`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                    {React.createElement(category.icon, {
                      className: "w-6 h-6 text-white"
                    })}
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  {category.name}
                </h4>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Urgent Campaigns */}
        {urgentCampaigns.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-6 h-6 text-red-500" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t('home.urgentCampaigns')}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {urgentCampaigns.slice(0, 2).map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="card card-hover overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={campaign.image_url}
                      alt={campaign.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Urgent
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {campaign.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {campaign.description}
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>₹{campaign.raised_amount?.toLocaleString()}</span>
                        <span>₹{campaign.goal_amount?.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${(campaign.raised_amount / campaign.goal_amount) * 100}%` 
                          }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleOrganizationClick(campaign)}
                        className="btn-secondary flex-1"
                      >
                        Learn More
                      </button>
                      <button
                        onClick={() => handleDonateClick(campaign)}
                        className="btn-primary flex-1"
                      >
                        Donate Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Featured Organizations */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {t('home.featuredOrganizations')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.slice(0, 6).map((org, index) => (
              <motion.div
                key={org.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="card card-hover overflow-hidden cursor-pointer"
                onClick={() => handleOrganizationClick(org)}
              >
                <div className="relative">
                  <img
                    src={org.image_url}
                    alt={org.name}
                    className="w-full h-40 object-cover"
                  />
                  {org.verified && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-green-500 text-white p-1 rounded-full">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {org.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {org.location}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {org.description}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDonateClick(org)
                    }}
                    className="w-full btn-primary text-sm py-2"
                  >
                    Donate Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HomePage
