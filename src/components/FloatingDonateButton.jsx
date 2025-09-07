import React from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const FloatingDonateButton = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleDonate = () => {
    navigate('/donate/1')
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleDonate}
      className="floating-donate-btn"
      aria-label={t('donation.donate')}
    >
      <Heart className="w-6 h-6 fill-current" />
    </motion.button>
  )
}

export default FloatingDonateButton
