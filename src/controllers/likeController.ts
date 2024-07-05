import { Request, Response } from 'express'
import Like, { ILike } from '../models/Like'
import Post from '../models/Post'
import { validationResult } from 'express-validator'

export const likePost = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { postId } = req.params

  try {
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const existingLike = await Like.findOne({ userId: req['user' as keyof Request].id, postId })
    if (existingLike) {
      return res.status(400).json({ error: 'Post already liked' })
    }

    const newLike: ILike = new Like({
      userId: req['user' as keyof Request].id,
      postId
    })

    await newLike.save()
    res.status(201).json(newLike)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}
