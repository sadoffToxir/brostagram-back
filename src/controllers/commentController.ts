import { Request, Response } from 'express'
import Comment, { IComment } from '../models/Comment'
import Post from '../models/Post'
import { validationResult } from 'express-validator'

export const commentOnPost = async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { postId } = req.params
  const { content } = req.body

  try {
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const newComment: IComment = new Comment({
      userId: req['user' as keyof Request].id,
      postId,
      content
    })

    await newComment.save()
    res.status(201).json(newComment)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}
