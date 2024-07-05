// Import the functions you need from the SDKs you need
import * as serviceAccount from '../../serviceAccountKey.json'
import admin from 'firebase-admin'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { env } from './const'

// Your web app's Firebase configuration
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: env.FB_STORAGE_BUCKET,
}

admin.initializeApp(firebaseConfig)

const bucket = admin.storage().bucket()

export { bucket }