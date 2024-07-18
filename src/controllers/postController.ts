import { Request, Response } from 'express'
import Post, { IPost } from '../models/Post'
import User from '../models/User'
import Follow from '../models/Follow'
import jwt from 'jsonwebtoken'

export const createPost = async (req: Request, res: Response) => {
  const user = jwt.decode(req.headers.authorization!.split(' ')[1])
  const userId = (user as Record<string, string>)['id']
  const { title, exercises } = req.body

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const newPost: IPost = new Post({
      userId,
      title,
      exercises,
    })

    await newPost.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const getFollowingPosts = async (req: Request, res: Response) => {
  const user = jwt.decode(req.headers.authorization!.split(' ')[1])
  const userId = (user as Record<string, string>)['id']

  try {
    const followedUsers = await Follow.find({ followerId: userId }).select('followeeId')
    const followedUserIds = followedUsers.map(follow => String(follow.followeeId))
    followedUserIds.push(userId)
    
    const posts = await Post.find({ userId: { $in: followedUserIds } }).sort({ createdAt: -1 })
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const getUserPosts = async (req: Request, res: Response) => {
  const { userId } = req.params

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const posts = await Post.find({ userId }).sort({ createdAt: -1 })

    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const getPostById = async (req: Request, res: Response) => {
  const { postId } = req.params

  try {
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    res.status(200).json(post)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params
  try {
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }
    if (post.userId.toString() !== req['user' as keyof Request].id) {
      return res.status(403).json({ error: 'User not authorized' })
    }
    await Post.deleteOne({ _id: postId })
    res.status(200).json({ message: 'Post deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}
