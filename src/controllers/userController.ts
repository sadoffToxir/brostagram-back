import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User, { IUser } from '../models/User'
import { uploadFile } from '../utils/firebaseStorage'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token'
import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser: IUser = new User({
      username,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const accessTokenData = generateAccessToken(user._id as string)
    const refreshTokenData = generateRefreshToken(user._id as string)

    user.refreshToken = refreshTokenData.token
    await user.save()

    res.status(200).json({
      message: 'Login successful',
      accessToken: accessTokenData.token, 
      refreshToken: refreshTokenData.token, 
      accessTokenExpiresIn: accessTokenData.expiresIn,
      refreshTokenExpiresIn: refreshTokenData.expiresIn,
      userId: user._id 
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const accessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' })
  }

  try {
    const decoded = verifyRefreshToken(refreshToken)
    const user = await User.findById((decoded as any).id)
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' })
    }

    const accessTokenData = generateAccessToken(user._id as string)

    res.status(200).json({ 
      accessToken: accessTokenData.token, 
      accessTokenExpiresIn: accessTokenData.expiresIn,
      userId: user._id 
    })
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' })
  }
}

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const decodedToken = jwt.decode(req.headers.authorization!.split(' ')[1])
    
    let user
    
    if(!req.params.userId){
      user = await User.findById(decodedToken!['id' as keyof typeof decodedToken]).select('-password')
    } else {
      user = await User.findById(req.params.userId).select('-password')
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      userId: user._id
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const { username, email, bio, profileImage: newProfileImage } = req.body
    
    let profileImage = ''

    if (newProfileImage) {
      profileImage = await uploadFile(newProfileImage)
    }

    const updateData: Partial<IUser> = { username, email, bio }
    if (profileImage) {
      updateData.profileImage = profileImage
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const changePassword = async (req: Request, res: Response) => {
  const { userId } = req.params
  const { oldPassword, newPassword } = req.body

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Old password is incorrect' })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12)
    user.password = hashedNewPassword
    await user.save()

    res.status(200).json({ message: 'Password changed successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}