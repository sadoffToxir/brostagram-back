
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface CustomRequest extends Request {
  user?: any;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' })
  }
}

export default authMiddleware
