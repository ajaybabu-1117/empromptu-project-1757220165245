import { useState, useEffect } from 'react'

export const useVoiceAssistant = () => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)

  useEffect(() => {
    const savedPreference = localStorage.getItem('kindheart_voice_enabled')
    if (savedPreference !== null) {
      setIsVoiceEnabled(JSON.parse(savedPreference))
    }
  }, [])

  const toggleVoice = () => {
    const newState = !isVoiceEnabled
    setIsVoiceEnabled(newState)
    localStorage.setItem('kindheart_voice_enabled', JSON.stringify(newState))
  }

  return {
    isVoiceEnabled,
    toggleVoice
  }
}
