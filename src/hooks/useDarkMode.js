import { useState, useEffect } from 'react'

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedMode = localStorage.getItem('kindheart_dark_mode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode))
    } else {
      setIsDarkMode(prefersDark)
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('kindheart_dark_mode', JSON.stringify(newMode))
  }

  return {
    isDarkMode,
    toggleDarkMode
  }
}
