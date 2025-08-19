import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDckbCik-4x5nl1QU81q-sTmlhQQMnBUII",
  authDomain: "cantinaescolar-d73bc.firebaseapp.com",
  databaseURL: "https://cantinaescolar-d73bc-default-rtdb.firebaseio.com",
  projectId: "cantinaescolar-d73bc",
  storageBucket: "cantinaescolar-d73bc.firebasestorage.app",
  messagingSenderId: "457335631363",
  appId: "1:457335631363:web:cbd9b38e1be1bb50d56836",
  measurementId: "G-VLMWET686D"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const analytics = getAnalytics(app)
export const storage = getStorage(app)

// Sign in anonymously
export const signInAnonymous = () => {
  return signInAnonymously(auth)
}

export default app