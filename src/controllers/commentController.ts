import { Request, Response } from 'express'
import Comment, { IComment } from '../models/Comment'
import Post from '../models/Post'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

export const commentOnPost = async (req: Request, res: Response) => {
  const user = jwt.decode(req.headers.authorization!.split(' ')[1])
  const userId = (user as Record<string, string>)['id']

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { postId } = req.params
  const { comment } = req.body

  try {
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const newComment: IComment = new Comment({
      userId,
      postId,
      comment
    })

    post.comments.push({ 
      userId: new ObjectId(userId), 
      comment: comment
    })
    await post.save()

    await newComment.save()
    res.status(201).json(newComment)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}
