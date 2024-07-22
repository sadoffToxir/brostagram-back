import { Request, Response } from 'express'
import { ObjectId }from 'mongodb'
import Like from '../models/Like'
import Post from '../models/Post'
import jwt from 'jsonwebtoken'

export const likePost = async (req: Request, res: Response) => {
  const user = jwt.decode(req.headers.authorization!.split(' ')[1])
  const userId = (user as Record<string, string>)['id']
  const { postId } = req.params

  try {
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const existingLike = await Like.findOne({ userId, postId })
    if (existingLike) {
      return res.status(400).json({ message: 'Post already liked' })
    }

    const like = new Like({ userId, postId })
    await like.save()

    post.likes.push({ userId: new ObjectId(userId) })
    await post.save()

    res.status(201).json({ message: 'Post liked' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const unlikePost = async (req: Request, res: Response) => {
  const user = jwt.decode(req.headers.authorization!.split(' ')[1])
  const userId = (user as Record<string, string>)['id']
  const { postId } = req.params

  try {
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const like = await Like.findOneAndDelete({ userId, postId })
    if (!like) {
      return res.status(400).json({ message: 'Post not liked' })
    }

    post.likes = post.likes.filter(like => like.userId.toString() !== userId)
    await post.save()

    res.status(200).json({ message: 'Post unliked' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
