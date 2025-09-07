const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Secrets storage file
const SECRETS_FILE = path.join(__dirname, 'secrets.json')

// Encryption key (in production, this should be from environment variables)
const ENCRYPTION_KEY = crypto.randomBytes(32)
const IV_LENGTH = 16

// Initialize secrets file if it doesn't exist
if (!fs.existsSync(SECRETS_FILE)) {
  fs.writeFileSync(SECRETS_FILE, JSON.stringify({}))
}

// Encryption functions
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

function decrypt(text) {
  const textParts = text.split(':')
  const iv = Buffer.from(textParts.shift(), 'hex')
  const encryptedText = textParts.join(':')
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY)
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

// Get secret
app.post('/api/secrets/get', (req, res) => {
  try {
    const { key } = req.body
    const secrets = JSON.parse(fs.readFileSync(SECRETS_FILE, 'utf8'))
    
    if (secrets[key]) {
      const decryptedValue = decrypt(secrets[key])
      res.json({ value: decryptedValue })
    } else {
      res.json({ value: null })
    }
  } catch (error) {
    console.error('Error getting secret:', error)
    res.status(500).json({ error: 'Failed to get secret' })
  }
})

// Set secret
app.post('/api/secrets/set', (req, res) => {
  try {
    const { key, value } = req.body
    const secrets = JSON.parse(fs.readFileSync(SECRETS_FILE, 'utf8'))
    
    secrets[key] = encrypt(value)
    fs.writeFileSync(SECRETS_FILE, JSON.stringify(secrets, null, 2))
    
    res.json({ success: true })
  } catch (error) {
    console.error('Error setting secret:', error)
    res.status(500).json({ error: 'Failed to set secret' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
