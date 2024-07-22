import { Request, Response } from 'express'
import Follow, { IFollow } from '../models/Follow'
import User from '../models/User'
import { validationResult } from 'express-validator'

export const followUser = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { userId } = req.params

  try {
    const userToFollow = await User.findById(userId)
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' })
    }

    const existingFollow = await Follow.findOne({ followerId: req['user' as keyof Request].id, followeeId: userId })
    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' })
    }

    const newFollow: IFollow = new Follow({
      followerId: req['user' as keyof Request].id,
      followeeId: userId
    })

    await newFollow.save()

    await User.findByIdAndUpdate(req['user' as keyof Request].id, { $inc: { followingCount: 1 } })
    await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } })

    res.status(201).json(newFollow)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const unfollowUser = async (req: Request, res: Response) => {
  const { userId } = req.params

  try {
    const userToUnfollow = await User.findById(userId)
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' })
    }

    const follow = await Follow.findOne({ followerId: req['user' as keyof Request].id, followeeId: userId })
    if (!follow) {
      return res.status(400).json({ message: 'Not following this user' })
    }

    await Follow.deleteOne({ _id: follow._id })

    await User.findByIdAndUpdate(req['user' as keyof Request].id, { $inc: { followingCount: -1 } })
    await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } })

    res.status(200).json({ message: 'Unfollowed successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getFollowersList = async (req: Request, res: Response) => {
  const { userId } = req.params

  try {
    const followers = await Follow.find({ followeeId: userId }).populate('followerId', 'username profileImage')
    res.status(200).json(followers.map(follow => follow.followerId))
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getFollowingList = async (req: Request, res: Response) => {
  const { userId } = req.params

  try {
    const followings = await Follow.find({ followerId: userId }).populate('followeeId', 'username profileImage')
    res.status(200).json(followings.map(follow => follow.followeeId))
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
