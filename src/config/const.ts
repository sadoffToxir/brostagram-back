
import dotenv from 'dotenv'

dotenv.config()

export const env = {
  FB_API_KEY: process.env.FB_API_KEY,
  FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
  FB_PROJECT_ID: process.env.FB_PROJECT_ID,
  FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
  FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID,
  FB_APP_ID: process.env.FB_APP_ID,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY,
}