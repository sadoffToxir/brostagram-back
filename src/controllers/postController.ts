import { Request, Response } from 'express'
import Post, { IPost } from '../models/Post'
import { validationResult } from 'express-validator'

export const createPost = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { content, exercises } = req.body
  const newPost: IPost = new Post({
    userId: req['user' as keyof Request].id,
    content,
    exercises
  })

  try {
    await newPost.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('userId', 'username profileImage')
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}

export const getPostById = async (req: Request, res: Response) => {
  const { postId } = req.params
  try {
    const post = await Post.findById(postId).populate('userId', 'username profileImage')
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
