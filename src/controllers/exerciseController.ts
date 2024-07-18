import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

const exercisesPath = path.join(__dirname, '../data/exercises.json')
const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'))

export const getExercises = (req: Request, res: Response) => {
  const { name } = req.query
  if (name) {
    const filteredExercises = exercises.filter((exercise: any) =>
      exercise.name.toLowerCase().startsWith((name as string).toLowerCase())
    )
    res.status(200).json(filteredExercises)
  } else {
    res.status(200).json(exercises)
  }
}

export const getExerciseByName = (req: Request, res: Response) => {
  const { name } = req.params
  const exercise = exercises.find((exercise: any) => exercise.name.toLowerCase() === name.toLowerCase())
  if (exercise) {
    res.status(200).json(exercise)
  } else {
    res.status(404).json({ message: 'Exercise not found' })
  }
}
