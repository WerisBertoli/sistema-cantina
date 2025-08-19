import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Student, Product, Transaction, CartItem, Earnings, ModalState } from '@/types'
import { BalanceStatus } from '@/types'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db, signInAnonymous } from '@/firebase'

export const useAppStore = defineStore('app', () => {
  // Estado reativo
  const isLoading = ref(true)
  const isAuthenticated = ref(false)
  const students = ref<Student[]>([])
  const products = ref<Product[]>([])
  const transactions = ref<Transaction[]>([])
  const currentStudent = ref<Student | null>(null)
  const searchQuery = ref('')
  const activeTab = ref('students')
  const modal = ref<ModalState>({ isOpen: false, type: null })
  const cart = ref<CartItem[]>([])

  // Computed
  const filteredStudents = computed(() => {
    if (!searchQuery.value) return students.value
    return students.value.filter(
      (student) =>
        (student.name?.toLowerCase() || '').includes(searchQuery.value.toLowerCase()) ||
        (student.parentName?.toLowerCase() || '').includes(searchQuery.value.toLowerCase()),
    )
  })

  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + item.product.price * item.quantity, 0)
  })

  const earnings = computed((): Earnings => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const creditTransactions = transactions.value.filter((t) => t.type === 'credit')

    return {
      today: creditTransactions
        .filter((t) => t.date.toDate() >= today)
        .reduce((sum, t) => sum + t.value, 0),
      thisWeek: creditTransactions
        .filter((t) => t.date.toDate() >= startOfWeek)
        .reduce((sum, t) => sum + t.value, 0),
      thisMonth: creditTransactions
        .filter((t) => t.date.toDate() >= startOfMonth)
        .reduce((sum, t) => sum + t.value, 0),
    }
  })

  // Funções utilitárias
  const getBalanceStatus = (balance: number): BalanceStatus => {
    if (balance <= 0) return BalanceStatus.CRITICAL
    if (balance <= 15) return BalanceStatus.LOW
    return BalanceStatus.NORMAL
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Ações Firebase
  const initializeApp = async () => {
    try {
      isLoading.value = true
      console.log('🔄 Iniciando aplicação...')

      // Autenticação anônima
      await signInAnonymous()
      console.log('🔄 Inicializando aplicação...')
      isAuthenticated.value = true

      console.log('🔄 Carregando dados...')
      await loadData()
      console.log('✅ Dados carregados com sucesso')
    } catch (error: unknown) {
      console.error('❌ Erro ao inicializar app:', error)
      if (error instanceof Error) {
        console.error('❌ Mensagem do erro:', error.message)
      }
    } finally {
      isLoading.value = false
    }
  }

  const loadData = async () => {
    // Carregar alunos da coleção 'alunos' (dados antigos)
    const studentsQuery = query(collection(db, 'alunos'), orderBy('nome'))
    onSnapshot(studentsQuery, (snapshot) => {
      students.value = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.nome || data.name,
          parentName: data.nomePai || data.parentName,
          parentPhone: data.telefonePai || data.parentPhone,
          balance: data.saldo || data.balance || 0,
        } as Student
      })
      console.log(`Carregados ${students.value.length} alunos da coleção 'alunos'`)
    })

    // Carregar produtos da coleção 'produtos' (dados antigos)
    const productsQuery = query(collection(db, 'produtos'), orderBy('nome'))
    onSnapshot(productsQuery, async (snapshot) => {
      products.value = snapshot.docs.map((doc) => {
        const data = doc.data()
        const productName = (data.nome || data.name || '').toLowerCase()
        
        // Usar categoria do Firebase se disponível, senão determinar baseada no nome
        let category: 'bebida' | 'lanche' | 'doce' = data.category || 'doce'
        
        // Se não há categoria no Firebase, determinar baseada no nome do produto
        if (!data.category) {
          // Lanches específicos
          if (productName.includes('cachorro quente') || 
              productName.includes('pipoca doce') || 
              productName.includes('biscoito teens chips yokitos') || 
              productName.includes('misto') || 
              productName.includes('passatempo') ||
              productName.includes('sanduíche') || productName.includes('hambúrguer') ||
              productName.includes('pizza') || productName.includes('pastel') ||
              productName.includes('coxinha') || productName.includes('pão') ||
              productName.includes('lanche') || productName.includes('salgado') ||
              productName.includes('empada') || productName.includes('esfirra')) {
            category = 'lanche'
          }
          // Bebidas específicas
          else if (productName.includes('toddynho') || 
                   productName.includes('refrigerante lata') || 
                   productName.includes('guaravita') ||
                   productName.includes('suco') || productName.includes('água') || 
                   productName.includes('refrigerante') || productName.includes('coca') ||
                   productName.includes('pepsi') || productName.includes('guaraná') ||
                   productName.includes('fanta') || productName.includes('sprite') ||
                   productName.includes('bebida') || productName.includes('café') ||
                   productName.includes('chá') || productName.includes('leite')) {
            category = 'bebida'
          }
          // Todos os outros produtos (incluindo doces, chocolates, balas, etc.) ficam como 'doce'
        }
        
        const product = {
          id: doc.id,
          name: data.nome || data.name,
          price: data.preco || data.price || 0,
          imageUrl: data.imagem,
          category: category,
          active: data.active !== false // Default to true if not specified
        } as Product
        console.log('Produto carregado:', product)
        return product
      })

      // Produtos carregados do Firebase

      console.log(`Carregados ${products.value.length} produtos da coleção 'produtos'`)
      console.log(
        'Produtos com imagens:',
        products.value.filter((p) => p.imageUrl),
      )
      console.log('Todos os produtos:', products.value)
    })

    // Carregar transações
    const transactionsQuery = query(collection(db, 'transactions'), orderBy('date', 'desc'))
    onSnapshot(transactionsQuery, (snapshot) => {
      transactions.value = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Transaction,
      )
    })
  }

  // const createSampleProducts = async () => {
  //   const sampleProducts = [
  //     { name: 'Suco Natural', price: 4.5 },
  //     { name: 'Sanduíche', price: 8.0 },
  //     { name: 'Água', price: 2.0 },
  //     { name: 'Refrigerante', price: 3.5 },
  //     { name: 'Bolo', price: 5.0 },
  //   ]

  //   for (const product of sampleProducts) {
  //     await addDoc(collection(db, 'produtos'), product)
  //   }
  // }

  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      // Converter para os nomes de campos do Firebase
      const firebaseData = {
        nome: studentData.name,
        nomePai: studentData.parentName,
        telefonePai: studentData.parentPhone,
        saldo: studentData.balance || 0,
        dataCriacao: Timestamp.now(),
      }
      await addDoc(collection(db, 'alunos'), firebaseData)
      closeModal()
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error)
      throw error
    }
  }

  const updateStudent = async (
    studentId: string,
    studentData: Partial<Pick<Student, 'name' | 'parentName' | 'parentPhone'>>,
  ) => {
    try {
      // Converter para os nomes de campos do Firebase
      const firebaseData: Record<string, string> = {}
      if (studentData.name !== undefined) firebaseData.nome = studentData.name
      if (studentData.parentName !== undefined) firebaseData.nomePai = studentData.parentName
      if (studentData.parentPhone !== undefined) firebaseData.telefonePai = studentData.parentPhone

      await updateDoc(doc(db, 'alunos', studentId), firebaseData)
      closeModal()
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error)
      throw error
    }
  }

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      // Converter para os nomes de campos do Firebase
      const firebaseData = {
        nome: product.name,
        preco: product.price,
        imagem: product.imageUrl,
        category: product.category,
        active: product.active !== false,
        dataCriacao: Timestamp.now(),
      }
      await addDoc(collection(db, 'produtos'), firebaseData)
      closeModal()
    } catch (error) {
      console.error('Erro ao adicionar produto:', error)
      throw error
    }
  }

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      // Converter para os nomes de campos do Firebase
      const firebaseData: Record<string, any> = {}
      if (updates.name !== undefined) firebaseData.nome = updates.name
      if (updates.price !== undefined) firebaseData.preco = updates.price
      if (updates.imageUrl !== undefined) firebaseData.imagem = updates.imageUrl
      if (updates.category !== undefined) firebaseData.category = updates.category
      if (updates.active !== undefined) firebaseData.active = updates.active

      await updateDoc(doc(db, 'produtos', productId), firebaseData)
      closeModal()
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      throw error
    }
  }

  const addCredit = async (studentId: string, amount: number) => {
    try {
      const student = students.value.find((s) => s.id === studentId)
      if (!student) throw new Error('Aluno não encontrado')

      const newBalance = student.balance + amount

      // Atualizar saldo do aluno (usando campo 'saldo' do Firebase)
      await updateDoc(doc(db, 'alunos', studentId), {
        saldo: newBalance,
      })

      // Atualizar saldo local imediatamente
      student.balance = newBalance

      // Criar transação
      await addDoc(collection(db, 'transactions'), {
        studentId,
        type: 'credit',
        value: amount,
        date: Timestamp.now(),
      })

      closeModal()
    } catch (error) {
      console.error('Erro ao adicionar crédito:', error)
      throw error
    }
  }

  const editCreditTransaction = async (
    transactionId: string,
    oldAmount: number,
    newAmount: number,
    studentId: string,
  ) => {
    try {
      const student = students.value.find((s) => s.id === studentId)
      if (!student) throw new Error('Aluno não encontrado')

      const amountDifference = newAmount - oldAmount
      const newBalance = student.balance + amountDifference

      // Atualizar saldo do aluno
      await updateDoc(doc(db, 'alunos', studentId), {
        saldo: newBalance,
      })

      // Atualizar saldo local imediatamente
      student.balance = newBalance

      // Atualizar transação
      await updateDoc(doc(db, 'transactions', transactionId), {
        value: newAmount,
        editedAt: Timestamp.now(),
      })

      closeModal()
    } catch (error) {
      console.error('Erro ao editar transação de crédito:', error)
      throw error
    }
  }

  const processConsumption = async (studentId: string) => {
    try {
      const student = students.value.find((s) => s.id === studentId)
      if (!student) throw new Error('Aluno não encontrado')

      const total = cartTotal.value
      if (student.balance < total) {
        throw new Error('Saldo insuficiente')
      }

      const newBalance = student.balance - total

      // Atualizar saldo do aluno (usando campo 'saldo' do Firebase)
      await updateDoc(doc(db, 'alunos', studentId), {
        saldo: newBalance,
      })

      // Atualizar saldo local imediatamente
      student.balance = newBalance

      // Criar transação
      const items = cart.value.map((item) => ({
        productId: item.product.id!,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }))

      await addDoc(collection(db, 'transactions'), {
        studentId,
        type: 'consumption',
        value: -total,
        date: Timestamp.now(),
        items,
      })

      clearCart()
      closeModal()
    } catch (error) {
      console.error('Erro ao processar consumo:', error)
      throw error
    }
  }

  // Ações do carrinho
  const addToCart = (product: Product) => {
    const existingItem = cart.value.find((item) => item.product.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      cart.value.push({ product, quantity: 1 })
    }
  }

  const removeFromCart = (productId: string) => {
    const itemIndex = cart.value.findIndex((item) => item.product.id === productId)
    if (itemIndex > -1) {
      if (cart.value[itemIndex].quantity > 1) {
        cart.value[itemIndex].quantity--
      } else {
        cart.value.splice(itemIndex, 1)
      }
    }
  }

  const clearCart = () => {
    cart.value = []
  }

  // Ações de navegação e modal
  const setActiveTab = (tab: string) => {
    activeTab.value = tab
    // Limpar aluno selecionado quando navegar para outras abas
    if (tab !== 'students' && currentStudent.value) {
      currentStudent.value = null
    }
  }

  const setCurrentStudent = (student: Student | null) => {
    currentStudent.value = student
  }

  const openModal = (type: ModalState['type'], data?: ModalState['data']) => {
    modal.value = { isOpen: true, type, data }
  }

  const closeModal = () => {
    modal.value = { isOpen: false, type: null }
    clearCart()
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  // Funções de mensagem
  const generateLowBalanceMessage = (student: Student): string => {
    const parentName = student.parentName || 'responsável'
    return (
      `Prezado(a) ${parentName}, \n\n` +
      `Informamos que o saldo da cantina de ${student.name} está baixo.\n\n` +
      `💰 Saldo atual: ${formatCurrency(student.balance)}\n\n` +
      `Para garantir que não falte lanche, sugerimos realizar uma recarga.\n\n` +
      `Atenciosamente,\n` +
      `Cantina Digital 🏫`
    )
  }

  const generateWeeklyReport = async (student: Student): Promise<string> => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const studentTransactions = transactions.value.filter(
      (t) => t.studentId === student.id && t.date.toDate() >= oneWeekAgo,
    )

    const parentName = student.parentName || 'responsável'
    let message = `📊 Resumo Semanal - ${student.name}\n\n`
    message += `👨‍👩‍👧‍👦 Responsável: ${parentName}\n`
    message += `💰 Saldo atual: ${formatCurrency(student.balance)}\n\n`

    if (studentTransactions.length === 0) {
      message += `Nenhuma movimentação nos últimos 7 dias.\n\n`
    } else {
      message += `📝 Movimentações dos últimos 7 dias:\n\n`

      studentTransactions.forEach((transaction) => {
        const date = transaction.date.toDate().toLocaleDateString('pt-BR')
        if (transaction.type === 'credit') {
          message += `✅ ${date} - Recarga: ${formatCurrency(transaction.value)}\n`
        } else {
          message += `🛒 ${date} - Consumo: ${formatCurrency(Math.abs(transaction.value))}\n`
          if (transaction.items) {
            message += `   Items: ${transaction.items.map((item) => `${item.quantity}x ${item.productName}`).join(', ')}\n`
          }
        }
      })
    }

    message += `\nCantina Digital 🏫`
    return message
  }

  return {
    // Estado
    isLoading,
    isAuthenticated,
    students,
    products,
    transactions,
    currentStudent,
    searchQuery,
    activeTab,
    modal,
    cart,

    // Computed
    filteredStudents,
    cartTotal,
    earnings,

    // Funções
    getBalanceStatus,
    formatCurrency,
    initializeApp,
    addStudent,
    updateStudent,
    addProduct,
    updateProduct,
    addCredit,
    editCreditTransaction,
    processConsumption,
    addToCart,
    removeFromCart,
    clearCart,
    setActiveTab,
    setCurrentStudent,
    openModal,
    closeModal,
    setSearchQuery,
    generateLowBalanceMessage,
    generateWeeklyReport,
  }
})
