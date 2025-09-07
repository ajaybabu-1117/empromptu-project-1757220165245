import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useSpeechSynthesis } from 'react-speech-kit'

const IntroVideo = ({ onComplete }) => {
  const { t } = useTranslation()
  const { speak, cancel } = useSpeechSynthesis()
  const [currentPhase, setCurrentPhase] = useState(0)
  const [showSkip, setShowSkip] = useState(true)

  const phases = [
    {
      text: t('intro.narration1'),
      duration: 3000,
      visual: 'donation'
    },
    {
      text: t('intro.narration2'),
      duration: 3000,
      visual: 'impact'
    },
    {
      text: t('intro.narration3'),
      duration: 4000,
      visual: 'logo'
    }
  ]

  useEffect(() => {
    // Start narration
    const currentPhaseData = phases[currentPhase]
    if (currentPhaseData) {
      speak({ text: currentPhaseData.text })
    }

    const timer = setTimeout(() => {
      if (currentPhase < phases.length - 1) {
        setCurrentPhase(currentPhase + 1)
      } else {
        onComplete()
      }
    }, phases[currentPhase]?.duration || 3000)

    return () => {
      clearTimeout(timer)
      cancel()
    }
  }, [currentPhase, speak, cancel, onComplete])

  const handleSkip = () => {
    cancel()
    onComplete()
  }

  const renderVisual = () => {
    const phase = phases[currentPhase]
    
    switch (phase?.visual) {
      case 'donation':
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center space-y-6"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-4 border-primary-200 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-2xl">₹</span>
                </motion.div>
              </div>
            </div>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-white text-xl text-center max-w-md"
            >
              {phase.text}
            </motion.p>
          </motion.div>
        )
      
      case 'impact':
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center space-y-6"
          >
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="w-20 h-20 bg-gradient-to-br from-warm-400 to-warm-500 rounded-2xl flex items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, delay: i * 0.3, repeat: Infinity }}
                    className="text-white text-2xl"
                  >
                    😊
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-white text-xl text-center max-w-md"
            >
              {phase.text}
            </motion.p>
          </motion.div>
        )
      
      case 'logo':
        return (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center space-y-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl flex items-center justify-center shadow-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-white text-6xl"
              >
                ❤️
              </motion.div>
            </motion.div>
            <div className="text-center">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold text-white mb-2"
              >
                {t('app.name')}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-lg"
              >
                {t('app.tagline')}
              </motion.p>
            </div>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white text-xl text-center max-w-md"
            >
              {phase.text}
            </motion.p>
          </motion.div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="video-overlay">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center min-h-screen p-8"
        >
          {renderVisual()}
        </motion.div>
      </AnimatePresence>
      
      {showSkip && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleSkip}
          className="skip-button"
          aria-label={t('intro.skip')}
        >
          {t('intro.skip')}
        </motion.button>
      )}
      
      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {phases.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index <= currentPhase ? 'bg-white' : 'bg-white/30'
              }`}
              animate={{
                scale: index === currentPhase ? 1.2 : 1
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default IntroVideo
