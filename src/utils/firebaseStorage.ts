import { bucket } from '../config/firebase'
import { v4 as uuidv4 } from 'uuid'

export const uploadFile = async (file: Express.Multer.File): Promise<string> => {
  const uniqueFilename = uuidv4()
  const fileUpload = bucket.file(uniqueFilename)

  return new Promise((resolve, reject) => {
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    })

    blobStream.on('error', (error) => {
      reject(error)
    })

    blobStream.on('finish', () => {
      // Generate the URL in the desired format
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`

      resolve(publicUrl)
    })

    blobStream.end(file.buffer)
  })
}
