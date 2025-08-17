import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDJqJ0Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8",
  authDomain: "cantinaescolar-d73bc.firebaseapp.com",
  projectId: "cantinaescolar-d73bc",
  storageBucket: "cantinaescolar-d73bc.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789",
  measurementId: "G-VLMWET686D"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function debugProducts() {
  try {
    console.log('🔍 Verificando produtos no Firebase...')
    const querySnapshot = await getDocs(collection(db, 'produtos'))
    
    console.log(`📦 Total de produtos encontrados: ${querySnapshot.size}`)
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log('📋 Produto:', {
        id: doc.id,
        nome: data.nome,
        preco: data.preco,
        imageUrl: data.imageUrl,
        hasImage: !!data.imageUrl
      })
    })
    
  } catch (error) {
    console.error('❌ Erro ao carregar produtos:', error)
  }
}

debugProducts()