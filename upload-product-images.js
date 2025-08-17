import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore'

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

// URLs de imagens de exemplo para diferentes tipos de produtos
const productImages = {
  'salgadinho': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop&crop=center',
  'refrigerante': 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=200&h=200&fit=crop&crop=center',
  'chocolate': 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=200&h=200&fit=crop&crop=center',
  'biscoito': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop&crop=center',
  'água': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop&crop=center',
  'suco': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop&crop=center',
  'bala': 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=200&h=200&fit=crop&crop=center',
  'chiclete': 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=200&h=200&fit=crop&crop=center',
  'pipoca': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center',
  'doce': 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=200&h=200&fit=crop&crop=center',
  'sanduiche': 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=200&h=200&fit=crop&crop=center',
  'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop&crop=center',
  'hamburguer': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&crop=center',
  'batata': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop&crop=center',
  'default': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop&crop=center'
}

function getImageForProduct(productName) {
  const name = productName.toLowerCase()
  
  for (const [keyword, imageUrl] of Object.entries(productImages)) {
    if (name.includes(keyword)) {
      return imageUrl
    }
  }
  
  return productImages.default
}

async function updateProductImages() {
  try {
    console.log('🔄 Carregando produtos do Firebase...')
    
    // Buscar todos os produtos
    const productsSnapshot = await getDocs(collection(db, 'products'))
    const products = []
    
    productsSnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() })
    })
    
    console.log(`📦 Encontrados ${products.length} produtos`)
    
    for (const product of products) {
      try {
        console.log(`🔄 Processando produto: ${product.name}`)
        
        // Obter URL da imagem baseada no nome do produto
        const imageUrl = getImageForProduct(product.name)
        
        // Atualizar produto no Firestore
        await updateDoc(doc(db, 'products', product.id), {
          imageUrl: imageUrl
        })
        
        console.log(`✅ Imagem adicionada para ${product.name}: ${imageUrl}`)
        
      } catch (error) {
        console.error(`❌ Erro ao processar produto ${product.name}:`, error)
      }
    }
    
    console.log('🎉 Atualização de imagens concluída!')
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar o script
updateProductImages()
  .then(() => {
    console.log('✅ Script finalizado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro no script:', error)
    process.exit(1)
  })