import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'

export interface ShoppingListItem {
  id: string
  text: string
  completed: boolean
  createdAt: Timestamp | Date
  completedAt?: Timestamp | Date
  userId?: string
}

const COLLECTION_NAME = 'shopping_list'

// Adicionar novo item à lista de compras
export const addShoppingItem = async (text: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      text: text.trim(),
      completed: false,
      createdAt: serverTimestamp(),
      userId: 'shared' // Para uso compartilhado entre todos os usuários
    })
    return docRef.id
  } catch (error) {
    console.error('Erro ao adicionar item:', error)
    throw error
  }
}

// Marcar item como comprado/não comprado
export const toggleShoppingItem = async (id: string, completed: boolean): Promise<void> => {
  try {
    const itemRef = doc(db, COLLECTION_NAME, id)
    const updateData: any = {
      completed
    }
    
    if (completed) {
      updateData.completedAt = serverTimestamp()
    } else {
      updateData.completedAt = null
    }
    
    await updateDoc(itemRef, updateData)
  } catch (error) {
    console.error('Erro ao atualizar item:', error)
    throw error
  }
}

// Excluir item da lista
export const deleteShoppingItem = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
  } catch (error) {
    console.error('Erro ao excluir item:', error)
    throw error
  }
}

// Excluir todos os itens concluídos
export const clearCompletedItems = async (items: ShoppingListItem[]): Promise<void> => {
  try {
    const completedItems = items.filter(item => item.completed)
    const deletePromises = completedItems.map(item => deleteShoppingItem(item.id))
    await Promise.all(deletePromises)
  } catch (error) {
    console.error('Erro ao limpar itens concluídos:', error)
    throw error
  }
}

// Escutar mudanças em tempo real na lista de compras
export const subscribeToShoppingList = (callback: (items: ShoppingListItem[]) => void) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc')
  )
  
  return onSnapshot(q, (snapshot) => {
    const items: ShoppingListItem[] = []
    snapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data()
      } as ShoppingListItem)
    })
    callback(items)
  }, (error) => {
    console.error('Erro ao escutar mudanças:', error)
  })
}

// Função para converter Timestamp do Firebase para Date
export const convertTimestampToDate = (timestamp: Timestamp | Date): Date => {
  if (timestamp instanceof Date) {
    return timestamp
  }
  return timestamp.toDate()
}