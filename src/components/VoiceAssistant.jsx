import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const VoiceAssistant = ({ isEnabled, onToggle }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastCommand, setLastCommand] = useState('')

  const { speak, cancel, speaking } = useSpeechSynthesis()
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      handleVoiceCommand(result)
    },
    onError: (error) => {
      console.error('Speech recognition error:', error)
      setIsListening(false)
      setIsProcessing(false)
    }
  })

  useEffect(() => {
    if (isEnabled && !listening && isListening) {
      listen({ continuous: false, interimResults: false })
    }
  }, [isEnabled, isListening, listen, listening])

  const handleVoiceCommand = async (command) => {
    setIsProcessing(true)
    setLastCommand(command.toLowerCase())
    
    try {
      // Navigation commands
      if (command.toLowerCase().includes('donate now') || command.toLowerCase().includes('दान करें')) {
        speak({ text: 'Opening donation page' })
        navigate('/donate/1')
      } else if (command.toLowerCase().includes('home') || command.toLowerCase().includes('होम')) {
        speak({ text: 'Going to home page' })
        navigate('/')
      } else if (command.toLowerCase().includes('profile') || command.toLowerCase().includes('प्रोफाइल')) {
        speak({ text: 'Opening your profile' })
        navigate('/profile')
      } else if (command.toLowerCase().includes('search orphanage') || command.toLowerCase().includes('अनाथालय खोजें')) {
        speak({ text: 'Searching for orphanages' })
        // Implement search functionality
      } else if (command.toLowerCase().includes('help') || command.toLowerCase().includes('मदद')) {
        speak({ text: 'You can say donate now, search orphanages, or go to profile' })
      } else {
        speak({ text: 'I did not understand that command. Try saying donate now, search orphanages, or help' })
      }
    } catch (error) {
      console.error('Voice command error:', error)
      speak({ text: 'Sorry, I encountered an error processing your command' })
    } finally {
      setIsProcessing(false)
      setIsListening(false)
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stop()
      setIsListening(false)
    } else {
      setIsListening(true)
    }
  }

  const toggleSpeaking = () => {
    if (speaking) {
      cancel()
    }
  }

  if (!isEnabled) return null

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="flex items-center space-x-2">
        {/* Voice toggle button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
          aria-label="Toggle voice assistant"
        >
          {isEnabled ? (
            <Volume2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}
        </motion.button>

        {/* Microphone button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleListening}
          className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-primary-500 hover:bg-primary-600 text-white'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </motion.button>

        {/* Speaking indicator */}
        <AnimatePresence>
          {speaking && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={toggleSpeaking}
              className="p-3 bg-green-500 text-white rounded-full shadow-lg animate-pulse"
              aria-label="Stop speaking"
            >
              <Volume2 className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Status indicator */}
      <AnimatePresence>
        {(isListening || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-48"
          >
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isListening ? [4, 16, 4] : 4,
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: isListening ? Infinity : 0,
                      delay: i * 0.1,
                    }}
                    className="w-1 bg-primary-500 rounded-full"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isProcessing ? t('voice.processing') : t('voice.listening')}
              </span>
            </div>
            {lastCommand && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                "{lastCommand}"
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VoiceAssistant
