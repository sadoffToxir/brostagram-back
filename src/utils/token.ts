import jwt from 'jsonwebtoken'
import { env } from '../config/const'

const msToSeconds = (time: string): number => {
  const timeUnit = time.slice(-1)
  const timeValue = parseInt(time.slice(0, -1), 10)

  switch (timeUnit) {
  case 's':
    return timeValue * 1000
  case 'm':
    return timeValue * 60 * 1000
  case 'h':
    return timeValue * 60 * 60 * 1000
  case 'd':
    return timeValue * 24 * 60 * 60 * 1000
  default:
    return 0
  }
}

export const generateAccessToken = (userId: string) => {
  const expiresIn = env.JWT_ACCESS_EXPIRY as string
  const token = jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET as string, { expiresIn })
  return { token, expiresIn: new Date(Date.now() + msToSeconds(expiresIn)) }
}

export const generateRefreshToken = (userId: string) => {
  const expiresIn = env.JWT_REFRESH_EXPIRY as string
  const token = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET as string, { expiresIn })
  return { token, expiresIn: new Date(Date.now() + msToSeconds(expiresIn)) }
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET as string)
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET as string)
}
