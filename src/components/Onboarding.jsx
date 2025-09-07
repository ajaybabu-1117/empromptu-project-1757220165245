import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Heart, TrendingUp, Users, ChevronRight, ChevronLeft } from 'lucide-react'

const Onboarding = ({ onComplete }) => {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      icon: Heart,
      title: t('onboarding.title1'),
      description: t('onboarding.desc1'),
      color: 'from-primary-500 to-primary-600',
      bgColor: 'from-primary-50 to-primary-100'
    },
    {
      icon: TrendingUp,
      title: t('onboarding.title2'),
      description: t('onboarding.desc2'),
      color: 'from-trust-500 to-trust-600',
      bgColor: 'from-trust-50 to-trust-100'
    },
    {
      icon: Users,
      title: t('onboarding.title3'),
      description: t('onboarding.desc3'),
      color: 'from-warm-500 to-warm-600',
      bgColor: 'from-warm-50 to-warm-100'
    }
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const skip = () => {
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className={`inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br ${slides[currentSlide].bgColor} rounded-3xl mb-8`}>
              <div className={`w-20 h-20 bg-gradient-to-br ${slides[currentSlide].color} rounded-2xl flex items-center justify-center`}>
                {React.createElement(slides[currentSlide].icon, {
                  className: "w-10 h-10 text-white"
                })}
              </div>
            </div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-400 mb-12 leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Progress indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-primary-500' 
                  : 'w-2 bg-gray-300 dark:bg-gray-600'
              }`}
              animate={{
                scale: index === currentSlide ? 1.2 : 1
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={skip}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium"
          >
            {t('onboarding.skip')}
          </button>

          <div className="flex items-center space-x-4">
            {currentSlide > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={prevSlide}
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            )}

            <button
              onClick={nextSlide}
              className="btn-primary flex items-center space-x-2"
            >
              <span>
                {currentSlide === slides.length - 1 
                  ? t('onboarding.getStarted') 
                  : t('onboarding.next')
                }
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
