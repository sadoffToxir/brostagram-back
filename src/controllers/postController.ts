import { Request, Response } from 'express'
import Post, { IPost } from '../models/Post'
import User from '../models/User'
import Comment from '../models/Comment'
import Follow from '../models/Follow'
import jwt from 'jsonwebtoken'

const formatPostResponse = (post: any) => ({
  title: post.title,
  exercises: post.exercises,
  createdAt: post.createdAt,
  user: post.userId,
  _id: post._id,
  likes: post.likes.map((like: any) => like.userId),
  comments: post.comments.map((comment: any) => ({
    userId: comment.userId._id,
    username: comment.userId.username,
    profileImage: comment.userId.profileImage,
    comment: comment.comment,
  })),
})

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
    followedUserIds.push(userId) // Include the current user's ID

    const posts = await Post.find({ userId: { $in: followedUserIds } })
      .populate('userId', 'username profileImage')
      .populate('likes')
      .populate('comments.userId', 'profileImage username')
      .sort({ createdAt: -1 })

    const formattedPosts = posts.map(formatPostResponse)

    res.status(200).json(formattedPosts)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getUserPosts = async (req: Request, res: Response) => {
  const { userId } = req.params

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const posts = await Post.find({ userId })
      .populate('userId', 'username profileImage')
      .populate('likes.userId', 'username profileImage')
      .populate('comments.userId', 'username profileImage')
      .sort({ createdAt: -1 })

    const formattedPosts = posts.map(formatPostResponse)

    res.status(200).json(formattedPosts)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getPostById = async (req: Request, res: Response) => {
  const { postId } = req.params

  try {
    const post = await Post.findById(postId)
      .populate('userId', 'username profileImage')
      .populate('likes')
      .populate('comments.userId', 'profileImage username')
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const formattedPost = formatPostResponse(post)

    res.status(200).json(formattedPost)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
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
