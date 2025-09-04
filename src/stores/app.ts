import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Student,
  Product,
  Transaction,
  TransactionItem,
  CartItem,
  Earnings,
  ModalState,
  PrepaidOrder,
} from '@/types'
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
  writeBatch,
  deleteDoc,
} from 'firebase/firestore'
import { db, auth } from '@/firebase'

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
  const prepaidOrders = ref<PrepaidOrder[]>([])

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
    if (balance < 0) return BalanceStatus.CRITICAL
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

      // Tentar fazer login anônimo se não há usuário autenticado
      if (!auth.currentUser) {
        try {
          console.log('🔐 Tentando login anônimo...')
          const { signInAnonymous } = await import('@/firebase')
          await signInAnonymous()
          console.log('✅ Login anônimo realizado com sucesso')
        } catch (error: any) {
          console.warn('⚠️ Login anônimo falhou:', error.code)
          if (error.code === 'auth/admin-restricted-operation') {
            console.warn('⚠️ Login anônimo está desabilitado no Firebase Console')
            console.warn('⚠️ Algumas funcionalidades podem não funcionar corretamente')
          }
        }
      }

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
          if (
            productName.includes('cachorro quente') ||
            productName.includes('pipoca doce') ||
            productName.includes('biscoito teens chips yokitos') ||
            productName.includes('misto') ||
            productName.includes('passatempo') ||
            productName.includes('sanduíche') ||
            productName.includes('hambúrguer') ||
            productName.includes('pizza') ||
            productName.includes('pastel') ||
            productName.includes('coxinha') ||
            productName.includes('pão') ||
            productName.includes('lanche') ||
            productName.includes('salgado') ||
            productName.includes('empada') ||
            productName.includes('esfirra')
          ) {
            category = 'lanche'
          }
          // Bebidas específicas
          else if (
            productName.includes('toddynho') ||
            productName.includes('refrigerante lata') ||
            productName.includes('guaravita') ||
            productName.includes('suco') ||
            productName.includes('água') ||
            productName.includes('refrigerante') ||
            productName.includes('coca') ||
            productName.includes('pepsi') ||
            productName.includes('guaraná') ||
            productName.includes('fanta') ||
            productName.includes('sprite') ||
            productName.includes('bebida') ||
            productName.includes('café') ||
            productName.includes('chá') ||
            productName.includes('leite')
          ) {
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
          active: data.active !== false, // Default to true if not specified
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
      console.log(`Carregadas ${transactions.value.length} transações da coleção 'transactions'`)
      
      // Debug: mostrar transações por aluno
      const transactionsByStudent = transactions.value.reduce((acc, t) => {
        acc[t.studentId] = (acc[t.studentId] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      console.log('Transações por aluno:', transactionsByStudent)
    })

    // Carregar pedidos pré-pagos
    const prepaidOrdersQuery = query(
      collection(db, 'prepaidTransactions'),
      orderBy('createdAt', 'desc'),
    )
    onSnapshot(prepaidOrdersQuery, (snapshot) => {
      prepaidOrders.value = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as PrepaidOrder,
      )
      console.log(
        `Carregados ${prepaidOrders.value.length} pedidos pré-pagos da coleção 'prepaidTransactions'`,
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

  const deleteStudent = async (studentId: string) => {
    try {
      // Deletar o aluno do Firestore
      await deleteDoc(doc(db, 'alunos', studentId))

      // Remover o aluno da lista local
      const index = students.value.findIndex((s) => s.id === studentId)
      if (index !== -1) {
        students.value.splice(index, 1)
      }

      // Se o aluno deletado era o currentStudent, limpar a seleção
      if (currentStudent.value?.id === studentId) {
        currentStudent.value = null
      }

      closeModal()
    } catch (error) {
      console.error('Erro ao deletar aluno:', error)
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

  const deleteProduct = async (productId: string) => {
    try {
      if (!auth.currentUser) {
        throw new Error('Usuário não autenticado. Não é possível deletar o produto.')
      }

      // Deletar do Firestore
      const productRef = doc(db, 'produtos', productId)
      await deleteDoc(productRef)

      console.log('✅ Produto deletado com sucesso')
    } catch (error) {
      console.error('❌ Erro ao deletar produto:', error)
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

  const editConsumptionTransaction = async (
    transactionId: string,
    newItems: TransactionItem[],
    studentId: string,
  ): Promise<void> => {
    console.log('🔍 Iniciando editConsumptionTransaction:', { transactionId, newItems, studentId })

    // Verificar se o usuário está autenticado
    if (!auth.currentUser) {
      console.log('⚠️ Usuário não autenticado, tentando login anônimo...')
      try {
        const { signInAnonymous } = await import('@/firebase')
        await signInAnonymous()
        console.log('✅ Login anônimo realizado com sucesso')
      } catch (error) {
        console.error('❌ Erro no login anônimo:', error)
        throw new Error('Falha na autenticação')
      }
    }

    console.log('👤 Usuário autenticado:', auth.currentUser?.uid)

    // Encontrar a transação original primeiro
    console.log('🔍 Procurando transação com ID:', transactionId)
    const originalTransaction = transactions.value.find((t) => t.id === transactionId)
    if (!originalTransaction) {
      console.error('❌ Transação não encontrada!')
      throw new Error('Transação não encontrada')
    }

    console.log('✅ Transação encontrada:', originalTransaction)

    // Calcular novo valor total
    const newValue = newItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
    const oldValue = Math.abs(originalTransaction.value)
    const difference = newValue - oldValue
    console.log('💰 Valores calculados:', { newValue, oldValue, difference })

    // Implementar estratégia de retry com backoff exponencial
    const maxRetries = 5
    let retryDelay = 1000 // Começar com 1 segundo

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Tentativa ${attempt}/${maxRetries}`)

      try {
        // Usar uma abordagem mais simples sem batch para reduzir complexidade
        await performSimpleEdit(
          transactionId,
          originalTransaction,
          newItems,
          newValue,
          difference,
          studentId,
        )

        console.log('✅ Operação concluída com sucesso!')
        return // Sucesso, sair da função
      } catch (error: any) {
        console.error(`❌ Erro na tentativa ${attempt}:`, error)

        // Verificar se é um erro que justifica retry
        const shouldRetry = shouldRetryError(error)

        if (attempt === maxRetries || !shouldRetry) {
          console.error('❌ Falha definitiva após todas as tentativas')
          throw error
        }

        // Backoff exponencial com jitter
        const jitter = Math.random() * 500 // Adicionar aleatoriedade
        const delay = retryDelay + jitter
        console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        retryDelay *= 2 // Dobrar o delay para a próxima tentativa
      }
    }
  }

  const shouldRetryError = (error: any): boolean => {
    const errorMessage = error.message?.toLowerCase() || ''
    const errorCode = error.code?.toLowerCase() || ''

    // Erros que justificam retry
    const retryableErrors = [
      'err_aborted',
      'network',
      'timeout',
      'unavailable',
      'deadline-exceeded',
      'aborted',
      'cancelled',
      'connection',
      'fetch',
    ]

    return retryableErrors.some(
      (retryableError) =>
        errorMessage.includes(retryableError) || errorCode.includes(retryableError),
    )
  }

  const performSimpleEdit = async (
    transactionId: string,
    originalTransaction: Transaction,
    newItems: TransactionItem[],
    newValue: number,
    difference: number,
    studentId: string,
  ) => {
    // Atualizar a transação primeiro
    const transactionRef = doc(db, 'transactions', transactionId)

    console.log('📝 Atualizando transação...')
    await updateDoc(transactionRef, {
      value: -newValue, // Negativo para consumo
      items: newItems,
    })
    console.log('✅ Transação atualizada no Firestore')

    // Atualizar saldo do aluno usando a coleção correta 'alunos'
    const student = students.value.find((s) => s.id === studentId)
    if (student) {
      const studentRef = doc(db, 'alunos', studentId)

      // CORREÇÃO: Se o novo valor é menor que o antigo (difference negativo),
      // significa que removemos itens, então devemos ADICIONAR ao saldo
      // Se o novo valor é maior (difference positivo), devemos SUBTRAIR do saldo
      const oldValue = Math.abs(originalTransaction.value)
      const balanceChange = -difference // Inverter o sinal da diferença
      const newBalance = student.balance + balanceChange

      console.log('💳 Atualizando saldo do aluno:', {
        oldValue,
        newValue,
        difference,
        balanceChange,
        currentBalance: student.balance,
        newBalance,
      })

      await updateDoc(studentRef, {
        saldo: newBalance, // Usar campo 'saldo' do Firebase
      })
      console.log('✅ Saldo do aluno atualizado no Firestore')

      // Atualizar saldo local apenas após sucesso no Firestore
      student.balance = newBalance
      console.log('💰 Saldo local do estudante atualizado. Novo saldo:', student.balance)
    }
  }

  const processConsumption = async (studentId: string) => {
    try {
      const student = students.value.find((s) => s.id === studentId)
      if (!student) throw new Error('Aluno não encontrado')

      const total = cartTotal.value
      const newBalance = student.balance - total

      // Verificar se excede o limite de saldo negativo
      if (newBalance < -12.0) {
        throw new Error('Limite de saldo negativo atingido! Máximo permitido: -R$ 12,00')
      }

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

      // Verificar se o saldo ficou negativo e gerar mensagem para os pais
      if (newBalance < 0) {
        const message = generateNegativeBalanceMessage(student)
        console.log('Mensagem para os pais:', message)
        // Aqui você pode implementar o envio da mensagem (WhatsApp, email, etc.)
        // Por exemplo: await sendNotificationToParents(student, message)
      }

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

  const generateNegativeBalanceMessage = (student: Student): string => {
    const parentName = student.parentName || 'responsável'
    return (
      `🚨 ATENÇÃO - Saldo Negativo 🚨\n\n` +
      `Prezado(a) ${parentName}, \n\n` +
      `Informamos que ${student.name} está com saldo negativo na cantina.\n\n` +
      `💰 Saldo atual: ${formatCurrency(student.balance)}\n\n` +
      `⚠️ IMPORTANTE: Até que seja feito um depósito, não será mais liberado o lanche.\n\n` +
      `Por favor, realize uma recarga o quanto antes para normalizar a situação.\n\n` +
      `Atenciosamente,\n` +
      `Cantina Digital 🏫`
    )
  }

  const generateWeeklyReport = async (student: Student): Promise<string> => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const studentTransactions = transactions.value
      .filter((t) => t.studentId === student.id && t.date.toDate() >= oneWeekAgo)
      .sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime())

    // Função para calcular saldo após uma transação específica
    const getBalanceAfterTransaction = (targetTransaction: Transaction): number => {
      // Obter todas as transações do aluno ordenadas por data (mais antigas primeiro)
      const allTransactions = transactions.value
        .filter((t) => t.studentId === student.id)
        .sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime())

      // Encontrar o índice da transação alvo
      const targetIndex = allTransactions.findIndex((t) => t.id === targetTransaction.id)
      if (targetIndex === -1) return student.balance

      // Calcular o saldo inicial (saldo atual menos todas as transações após a transação alvo)
      let balance = student.balance

      // Subtrair todas as transações que aconteceram após a transação alvo
      for (let i = targetIndex + 1; i < allTransactions.length; i++) {
        const transaction = allTransactions[i]
        balance -= transaction.value
      }

      return balance
    }

    const parentName = student.parentName || 'responsável'
    let message = `📊 *RESUMO SEMANAL*\n`
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    message += `👤 *Aluno:* ${student.name}\n`
    message += `👨‍👩‍👧‍👦 *Responsável:* ${parentName}\n`
    message += `💰 *Saldo atual:* ${formatCurrency(student.balance)}\n\n`
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

    if (studentTransactions.length === 0) {
      message += `📭 *Nenhuma movimentação* nos últimos 7 dias.\n\n`
    } else {
      message += `📝 *MOVIMENTAÇÕES DOS ÚLTIMOS 7 DIAS:*\n\n`

      // Separar recargas e consumos
      const credits = studentTransactions.filter((t) => t.type === 'credit')
      const consumptions = studentTransactions.filter((t) => t.type === 'consumption')

      // Mostrar recargas primeiro
      if (credits.length > 0) {
        message += `💳 *RECARGAS:*\n`
        credits.forEach((transaction) => {
          const date = transaction.date.toDate().toLocaleDateString('pt-BR')
          const time = transaction.date
            .toDate()
            .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          message += `✅ ${date} às ${time}\n`
          message += `   💰 Valor: ${formatCurrency(transaction.value)}\n\n`
        })
      }

      // Mostrar consumos com saldo após cada transação
      if (consumptions.length > 0) {
        message += `🛒 *CONSUMOS:*\n`
        consumptions.forEach((transaction) => {
          const date = transaction.date.toDate().toLocaleDateString('pt-BR')
          const time = transaction.date
            .toDate()
            .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          const balanceAfter = getBalanceAfterTransaction(transaction)

          message += `🛍️ ${date} às ${time}\n`
          message += `   💸 Valor: ${formatCurrency(Math.abs(transaction.value))}\n`

          if (transaction.items && transaction.items.length > 0) {
            message += `   📦 Itens:\n`
            transaction.items.forEach((item) => {
              message += `      • ${item.quantity}x ${item.productName}\n`
            })
          }

          message += `   💰 Saldo após compra: ${formatCurrency(balanceAfter)}\n\n`
        })
      }

      // Resumo totais
      const totalCredits = credits.reduce((sum, t) => sum + t.value, 0)
      const totalConsumptions = Math.abs(consumptions.reduce((sum, t) => sum + t.value, 0))

      message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      message += `📊 *RESUMO DO PERÍODO:*\n`
      message += `💳 Total em recargas: ${formatCurrency(totalCredits)}\n`
      message += `🛒 Total em consumos: ${formatCurrency(totalConsumptions)}\n`
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    }

    message += `🏫 *Cantina Digital*\n`
    message += `📱 Sistema de gestão escolar`
    return message
  }

  // Funções para pedidos pré-pagos
  const addPrepaidOrder = async (order: Omit<PrepaidOrder, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'prepaidTransactions'), order)
      console.log('Pedido pré-pago adicionado com ID:', docRef.id)
      // O onSnapshot listener irá automaticamente atualizar o array prepaidOrders
    } catch (error) {
      console.error('Erro ao adicionar pedido pré-pago:', error)
      throw error
    }
  }

  const markOrderAsPickedUp = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'prepaidTransactions', orderId)
      const updateData = {
        status: 'picked_up' as const,
        pickedUpAt: Timestamp.now(),
      }

      await updateDoc(orderRef, updateData)

      const orderIndex = prepaidOrders.value.findIndex((order) => order.id === orderId)
      if (orderIndex !== -1) {
        prepaidOrders.value[orderIndex] = {
          ...prepaidOrders.value[orderIndex],
          ...updateData,
        }
      }

      console.log('Pedido marcado como retirado:', orderId)
    } catch (error) {
      console.error('Erro ao marcar pedido como retirado:', error)
      throw error
    }
  }

  const getPendingOrdersByStudent = (studentId: string) => {
    return prepaidOrders.value.filter(
      (order) => order.studentId === studentId && order.status === 'pending',
    )
  }

  const getAllOrdersByStudent = (studentId: string) => {
    return prepaidOrders.value.filter((order) => order.studentId === studentId)
  }

  const clearAllPrepaidOrders = async () => {
    try {
      // Limpar todos os pedidos do Firestore
      const batch = writeBatch(db)
      prepaidOrders.value.forEach((order) => {
        if (order.id) {
          const orderRef = doc(db, 'prepaidTransactions', order.id)
          batch.delete(orderRef)
        }
      })

      await batch.commit()

      // Limpar o array local
      prepaidOrders.value = []

      console.log('Todos os pedidos pré-pagos foram removidos')
    } catch (error) {
      console.error('Erro ao limpar pedidos pré-pagos:', error)
      throw error
    }
  }

  const deletePrepaidOrder = async (orderId: string) => {
    try {
      if (!auth.currentUser) {
        throw new Error('Usuário não autenticado. Não é possível deletar o pedido.')
      }

      // Deletar do Firestore
      const orderRef = doc(db, 'prepaidTransactions', orderId)
      await deleteDoc(orderRef)

      // Remover do array local
      const index = prepaidOrders.value.findIndex((order) => order.id === orderId)
      if (index !== -1) {
        prepaidOrders.value.splice(index, 1)
      }

      console.log('✅ Pedido deletado com sucesso')
    } catch (error) {
      console.error('❌ Erro ao deletar pedido:', error)
      throw error
    }
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
    prepaidOrders,

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
    deleteStudent,
    addProduct,
    updateProduct,
    deleteProduct,
    addCredit,
    editCreditTransaction,
    editConsumptionTransaction,
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
    generateNegativeBalanceMessage,
    generateWeeklyReport,
    addPrepaidOrder,
    markOrderAsPickedUp,
    clearAllPrepaidOrders,
    deletePrepaidOrder,
    getPendingOrdersByStudent,
    getAllOrdersByStudent,
  }
})
