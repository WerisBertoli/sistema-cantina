import type { Timestamp } from 'firebase/firestore'

// Interface para Aluno
export interface Student {
  id?: string
  name: string
  parentName: string
  parentPhone: string
  balance: number
}

// Interface para Produto
export interface Product {
  id: string
  name: string
  price: number
  imageUrl?: string
  category?: 'bebida' | 'lanche' | 'doce'
  active?: boolean
}

// Interface para item de transação
export interface TransactionItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

// Interface para Transação
export interface Transaction {
  id?: string
  studentId: string
  type: 'credit' | 'consumption'
  value: number
  date: Timestamp
  items?: TransactionItem[] // Apenas para type: 'consumption'
}

// Interface para item do carrinho
export interface CartItem {
  product: Product
  quantity: number
}

// Interface para ganhos por período
export interface Earnings {
  today: number
  thisWeek: number
  thisMonth: number
}

// Interface para pedidos pré-pagos
export interface PrepaidOrder {
  id?: string
  studentId: string
  studentName: string
  items: TransactionItem[]
  totalValue: number
  status: 'pending' | 'picked_up'
  createdAt: Timestamp
  pickedUpAt?: Timestamp
  notes?: string
}

// Enum para status de saldo
export enum BalanceStatus {
  NORMAL = 'normal',
  LOW = 'low',
  CRITICAL = 'critical',
}

// Interface para navegação
export interface NavigationTab {
  id: string
  label: string
  icon: string
}

// Tipo para abas de navegação
export type NavigationTabType = 'students' | 'earnings' | 'products' | 'todo' | 'orders'

// Interface para modal
export interface ModalState {
  isOpen: boolean
  type:
    | 'addStudent'
    | 'addCredit'
    | 'consumption'
    | 'quickConsumption'
    | 'message'
    | 'weeklyHistory'
    | 'editStudent'
    | 'addPrepaidOrder'
    | null
  data?: Student | TransactionItem[] | { student: Student } | { type: string } | PrepaidOrder | any
}
