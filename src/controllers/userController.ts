import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User, { IUser } from '../models/User'
import { uploadFile } from '../utils/firebaseStorage'
import Follow from '../models/Follow'
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

export const searchUsers = async (req: Request, res: Response) => {
  const { username } = req.query
  const currentUser = jwt.decode(req.headers.authorization!.split(' ')[1])
  const userId = currentUser!['id' as keyof typeof currentUser]

  if (!username) {
    return res.status(400).json({ error: 'Username is required' })
  }

  try {
    const users = await User.find({ username: { $regex: username, $options: 'i' } })
      .select('username profileImage')
      .limit(10) // Limit the results for autocomplete

    const followedUsers = await Follow.find({ followerId: userId }).select('followeeId')
    const followedUserIds = followedUsers.map(follow => follow.followeeId.toString())

    const usersWithFollowStatus = users.map(user => ({
      ...user.toObject(),
      isFollowed: followedUserIds.includes(user['_id' as keyof typeof user].toString())
    }))

    res.status(200).json(usersWithFollowStatus)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const getUserProfile = async (req: Request, res: Response) => {
  const currentUser = jwt.decode(req.headers.authorization!.split(' ')[1])
  const currentUserId = currentUser!['id' as keyof typeof currentUser]
  const userId = req.params.userId
  
  try {
    let user
    if(userId) {
      user = await User.findById(userId).select('username profileImage bio email followersCount followingCount')
    } else {
      user = await User.findById(currentUserId).select('username profileImage email bio followersCount followingCount')
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isFollowed = await Follow.exists({ followerId: currentUserId, followeeId: userId })

    const userProfile = {
      ...user.toObject(),
      userId: user._id || user[userId as keyof typeof user],
      isFollowed: !!isFollowed
    }

    res.status(200).json(userProfile)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const { username, email, bio, profileImage } = req.body
    let profileImageUrl = ''

    if (profileImage) {
      if (profileImage.startsWith('data:image')) {
        profileImageUrl = await uploadFile(profileImage)
      } else {
        profileImageUrl = profileImage
      }
    }

    const updateData: Partial<IUser> = { username, email, bio }
    if (profileImageUrl) {
      updateData.profileImage = profileImageUrl
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