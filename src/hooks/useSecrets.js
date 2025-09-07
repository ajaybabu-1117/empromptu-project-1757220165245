import { useState } from 'react'

export const useSecrets = () => {
  const getSecret = async (key) => {
    try {
      const response = await fetch('/api/secrets/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.value
      }
      return null
    } catch (error) {
      console.error('Error getting secret:', error)
      return null
    }
  }

  const setSecret = async (key, value) => {
    try {
      const response = await fetch('/api/secrets/set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      })
      
      return response.ok
    } catch (error) {
      console.error('Error setting secret:', error)
      return false
    }
  }

  return { getSecret, setSecret }
}
