import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

// Firebase config
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
const auth = getAuth(app)

// Criar usuário de teste
async function createTestUser() {
  try {
    console.log('🔄 Criando usuário de teste...')
    
    const email = 'teste@cantina.com'
    const password = '123456'
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    console.log('✅ Usuário de teste criado com sucesso!')
    console.log('📧 Email:', email)
    console.log('🔑 Senha:', password)
    console.log('🆔 UID:', user.uid)
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Usuário de teste já existe!')
      console.log('📧 Email: teste@cantina.com')
      console.log('🔑 Senha: 123456')
    } else {
      console.error('❌ Erro ao criar usuário de teste:', error)
    }
  }
}

createTestUser()