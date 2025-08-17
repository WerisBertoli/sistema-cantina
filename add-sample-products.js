import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'

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
const db = getFirestore(app)

// Produtos de exemplo com imagens
const sampleProducts = [
  {
    name: 'Salgadinho de Batata',
    price: 3.50,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop&crop=center'
  },
  {
    name: 'Refrigerante Coca-Cola',
    price: 4.00,
    imageUrl: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=200&h=200&fit=crop&crop=center'
  },
  {
    name: 'Chocolate ao Leite',
    price: 2.50,
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=200&h=200&fit=crop&crop=center'
  },
  {
    name: 'Biscoito Recheado',
    price: 1.75,
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop&crop=center'
  },
  {
    name: 'Água Mineral',
    price: 2.00,
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop&crop=center'
  },
  {
    name: 'Suco de Laranja',
    price: 3.00,
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop&crop=center'
  },
  {
    name: 'Bala de Goma',
    price: 1.00,
    imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=200&h=200&fit=crop&crop=center'
  },
  {
    name: 'Pipoca Doce',
    price: 2.25,
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center'
  }
]

async function addSampleProducts() {
  try {
    console.log('🔄 Verificando produtos existentes...')
    
    // Verificar se já existem produtos
    const productsSnapshot = await getDocs(collection(db, 'products'))
    
    if (productsSnapshot.size > 0) {
      console.log(`📦 Já existem ${productsSnapshot.size} produtos no banco`)
      console.log('ℹ️  Pulando criação de produtos de exemplo')
      return
    }
    
    console.log('📦 Nenhum produto encontrado. Adicionando produtos de exemplo...')
    
    for (const product of sampleProducts) {
      try {
        const docRef = await addDoc(collection(db, 'products'), product)
        console.log(`✅ Produto adicionado: ${product.name} (ID: ${docRef.id})`)
      } catch (error) {
        console.error(`❌ Erro ao adicionar produto ${product.name}:`, error)
      }
    }
    
    console.log('🎉 Produtos de exemplo adicionados com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar o script
addSampleProducts()
  .then(() => {
    console.log('✅ Script finalizado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro no script:', error)
    process.exit(1)
  })