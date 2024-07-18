import { bucket } from '../config/firebase'
import { v4 as uuidv4 } from 'uuid'

export const uploadFile = async (base64File: string): Promise<string> => {
  // Decode base64 string
  const matches = base64File.match(/^data:(.+);base64,(.+)$/)
  if (!matches) {
    throw new Error('Invalid base64 string')
  }
  const mimeType = matches[1]
  const fileBuffer = Buffer.from(matches[2], 'base64')
  const uniqueFilename = `${uuidv4()}.${mimeType.split('/')[1]}`
  const fileUpload = bucket.file(uniqueFilename)

  return new Promise((resolve, reject) => {
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: mimeType,
      },
    })

    blobStream.on('error', (error: any) => {
      reject(error)
    })

    blobStream.on('finish', () => {
      // Generate the URL in the desired format
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`
      resolve(publicUrl)
    })

    blobStream.end(fileBuffer)
  })
}
