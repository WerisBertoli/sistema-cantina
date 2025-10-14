import jsPDF from 'jspdf'
import type { Student, Transaction } from '@/types'
import { Timestamp } from 'firebase/firestore'

export interface InvoiceData {
  student: Student
  transactions: Transaction[]
  weekDescription: string
  totalCredits: number
  totalConsumptions: number
  currentBalance: number
}

export const generateInvoicePDF = (data: InvoiceData): void => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20

  // Função auxiliar para adicionar texto centralizado
  const addCenteredText = (text: string, y: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize)
    const textWidth = doc.getTextWidth(text)
    const x = (pageWidth - textWidth) / 2
    doc.text(text, x, y)
    return y + fontSize * 0.5
  }

  // Função auxiliar para adicionar texto alinhado à esquerda
  const addLeftText = (text: string, x: number, y: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize)
    doc.text(text, x, y)
    return y + fontSize * 0.5
  }

  // Função auxiliar para adicionar texto alinhado à direita
  const addRightText = (text: string, x: number, y: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize)
    const textWidth = doc.getTextWidth(text)
    doc.text(text, x - textWidth, y)
    return y + fontSize * 0.5
  }

  // Função para formatar moeda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Função para formatar data
  const formatDate = (timestamp: Timestamp): string => {
    const date = timestamp.toDate()
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Adicionar logo da escola (placeholder - será uma imagem quando disponível)
  try {
    // Tentar carregar a logo da escola
    const logoPath = '/logo-erlach.png'
    doc.addImage(logoPath, 'PNG', 15, 10, 35, 18)
  } catch (error) {
    // Se não conseguir carregar a imagem, usar texto
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('ESCOLA', 15, 20)
    doc.text('ERLACH', 15, 28)
  }

  // Cabeçalho principal
  doc.setFont('helvetica', 'bold')
  yPosition = addCenteredText('CANTINA ESCOLAR - ESCOLA ERLACH', 18, 16)
  yPosition = addCenteredText('RELATÓRIO DE MOVIMENTAÇÃO FINANCEIRA', yPosition + 2, 10)

  // Data de emissão
  const currentDate = new Date().toLocaleDateString('pt-BR')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  addRightText(`Data de Emissão: ${currentDate}`, pageWidth - 20, 32)

  yPosition = 45

  // Caixa com informações do aluno
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.3)
  doc.rect(15, yPosition, pageWidth - 30, 45)

  yPosition += 8
  doc.setFont('helvetica', 'bold')
  yPosition = addCenteredText('DADOS DO ALUNO', yPosition, 11)

  yPosition += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)

  // Linha 1
  doc.text(`Nome: ${data.student.name}`, 20, yPosition)
  doc.text(`Telefone: ${data.student.parentPhone || 'Não informado'}`, 110, yPosition)

  yPosition += 8
  // Linha 2
  doc.text(`Responsável: ${data.student.parentName || 'Não informado'}`, 20, yPosition)
  doc.text(`Saldo Atual: ${formatCurrency(data.currentBalance)}`, 110, yPosition)

  yPosition += 8
  // Linha 3 - Período alinhado
  doc.text(`Período: ${data.weekDescription}`, 20, yPosition)

  yPosition += 28

  // Resumo financeiro em caixa
  const resumoHeight = 40
  doc.rect(20, yPosition, pageWidth - 40, resumoHeight)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  addCenteredText('RESUMO FINANCEIRO', yPosition + 12)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)

  // Calcular total de recargas do período
  const totalRecargasPeriodo = data.transactions
    .filter((t) => t.type === 'credit')
    .reduce((total, t) => total + t.value, 0)

  addLeftText(
    `Total de Recargas no Período: ${formatCurrency(totalRecargasPeriodo)}`,
    30,
    yPosition + 22,
  )
  addLeftText(`Total de Consumos: ${formatCurrency(data.totalConsumptions)}`, 30, yPosition + 32)

  const saldoColor = data.currentBalance >= 0 ? [0, 128, 0] : [255, 0, 0]
  doc.setTextColor(saldoColor[0], saldoColor[1], saldoColor[2])
  doc.setFont('helvetica', 'bold')
  addLeftText(
    `Saldo Atual: ${formatCurrency(data.currentBalance)}`,
    pageWidth / 2 + 10,
    yPosition + 27,
  )
  doc.setTextColor(0, 0, 0)

  yPosition += 55

  // Histórico de transações
  yPosition += 8
  doc.setFont('helvetica', 'bold')
  yPosition = addCenteredText('MOVIMENTAÇÕES FINANCEIRAS', yPosition, 12)
  yPosition += 8

  if (data.transactions.length === 0) {
    doc.setFont('helvetica', 'normal')
    yPosition = addCenteredText('Nenhuma movimentação encontrada no período.', yPosition)
  } else {
    // Tabela unificada de movimentações
    const rowHeight = 14
    // Cabeçalho da tabela de consumos com fundo cinza
    const x0 = 20
    const tableWidth = pageWidth - 40
    // Larguras proporcionais: Data 12%, Descrição 40%, Saldo Antes 16%, Valor 16%, Saldo Após 16%
    const colPositions = [x0, x0 + tableWidth * 0.12, x0 + tableWidth * 0.52, x0 + tableWidth * 0.68, x0 + tableWidth * 0.84]
    const tableRightX = x0 + tableWidth
    doc.setFillColor(240, 240, 240)
    doc.rect(20, yPosition, pageWidth - 40, rowHeight, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setLineWidth(0.3)
    doc.setDrawColor(180, 180, 180)
    doc.rect(20, yPosition, pageWidth - 40, rowHeight)

    // Desenhar linhas verticais para separar colunas
    for (let i = 1; i < colPositions.length; i++) {
      doc.line(colPositions[i], yPosition, colPositions[i], yPosition + rowHeight)
    }

    doc.setTextColor(0, 0, 0)
    addLeftText('Data', colPositions[0] + 2, yPosition + 9)
    addLeftText('Descrição', colPositions[1] + 2, yPosition + 9)
    addRightText('Saldo Antes', colPositions[3] - 8, yPosition + 9)
    addRightText('Valor', colPositions[4] - 8, yPosition + 9)
    addRightText('Saldo Após', tableRightX - 8, yPosition + 9)
    yPosition += rowHeight

    // Criar array apenas com consumos
    const consumos: Array<{
    date: Date | any
    description: string
    value: number
    items?: string[]
    }> = []
    
    // Adicionar apenas consumos
    data.transactions
      .filter((t) => t.type === 'consumption')
      .forEach((transaction) => {
      const itemLines = transaction.items?.map((item) => `${item.quantity}x ${item.productName}`) || []
      consumos.push({
      date: transaction.date,
      description: itemLines.length > 0 ? itemLines.join(', ') : 'Compra',
      value: transaction.value,
      items: itemLines,
      })
      })
    
    // Ordenar por data
    consumos.sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : a.date.toDate()
      const dateB = b.date instanceof Date ? b.date : b.date.toDate()
      return dateA.getTime() - dateB.getTime()
    })
// Criar lista de transações (créditos e consumos) ordenadas por data
const sortedTransactions = data.transactions
  .slice()
  .sort((a: Transaction, b: Transaction) => {
    const dateA = a.date instanceof Date ? a.date : a.date.toDate()
    const dateB = b.date instanceof Date ? b.date : b.date.toDate()
    return dateA.getTime() - dateB.getTime()
  })

    // Calcular saldo inicial (antes de todos os consumos do período)
    // Saldo inicial = saldo atual + total de consumos do período
    // Saldo inicial correto antes do período:
    // B0 = saldo atual - créditos do período - consumos do período (independente do sinal usado em consumos)
    let saldoAtual = data.currentBalance - data.totalCredits - data.totalConsumptions

    // Renderizar todas as transações
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)

    // ===== NOVO BLOCO: linhas da tabela com descrição em lista e altura dinâmica =====
    sortedTransactions.forEach((transaction: Transaction, index: number) => {
    // Capturar saldo antes da transação
    const saldoAntes = saldoAtual
    const isCredit = transaction.type === 'credit'
    // Remover retorno antecipado para créditos e permitir apenas tipos conhecidos
    // (crédito e consumo). Outros tipos serão ignorados.
    if (transaction.type !== 'credit' && transaction.type !== 'consumption') return
    
    // Montar informações de exibição
    const consumo = {
    date: transaction.date,
    description: isCredit
      ? 'Recarga'
      : (transaction.items?.map((item: any) => `${item.quantity}x ${item.productName}`) || []).join(', ') || 'Compra',
    value: transaction.value,
    items: isCredit ? [] : transaction.items?.map((item: any) => `${item.quantity}x ${item.productName}`) || []
    }
    // Preparar descrição em lista quando necessário
    const colDescWidth = colPositions[2] - colPositions[1] - 4
    const shouldUseList = (consumo.items && consumo.items.length > 1) || consumo.description.length > 25
    let descriptionLines: string[] = []
    if (shouldUseList && consumo.items && consumo.items.length > 0) {
    consumo.items.forEach((it) => {
    const wrapped = (doc as any).splitTextToSize(`• ${it}`, colDescWidth) as string[]
    descriptionLines.push(...wrapped)
    })
    } else {
    // linha única (com truncamento suave se necessário)
    const single = consumo.description.length > 40 ? consumo.description.substring(0, 37) + '...' : consumo.description
    descriptionLines = [single]
    }

    const lineHeight = 9
    const currentRowHeight = Math.max(rowHeight, 14 + (descriptionLines.length - 1) * lineHeight)

    // Quebra de página considerando a altura dinâmica
    if (yPosition + currentRowHeight > pageHeight - 30) {
    doc.addPage()
    yPosition = 20
    }

    const date = formatDate(consumo.date)

    // Alternar cor de fundo para melhor legibilidade
    if (index % 2 === 1) {
    doc.setFillColor(248, 248, 248)
    doc.rect(20, yPosition, pageWidth - 40, currentRowHeight, 'F')
    }

    // Desenhar bordas da linha
    doc.setLineWidth(0.3)
    doc.setDrawColor(200, 200, 200)
    doc.rect(20, yPosition, pageWidth - 40, currentRowHeight)

    // Desenhar linhas verticais para separar colunas
    for (let i = 1; i < colPositions.length; i++) {
    doc.line(colPositions[i], yPosition, colPositions[i], yPosition + currentRowHeight)
    }

    // Formatação de texto
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(0, 0, 0)

    // Data (formato dd/mm)
    const dateFormatted = date.substring(0, 5)
    addLeftText(dateFormatted, colPositions[0] + 2, yPosition + 9)

    // Descrição (lista ou linha única)
    descriptionLines.forEach((line, i) => {
    addLeftText(line, colPositions[1] + 2, yPosition + 9 + i * lineHeight)
    })

    // Saldo Antes (neutro)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    addRightText(formatCurrency(saldoAntes), colPositions[3] - 8, yPosition + 9)

    // Valor (crédito em verde, consumo em vermelho)
    const amountAbs = Math.abs(consumo.value)
    if (isCredit) {
    doc.setTextColor(0, 120, 0)
    doc.setFont('helvetica', 'bold')
    const valorStr = `${formatCurrency(amountAbs)}`
    addRightText(valorStr, colPositions[4] - 8, yPosition + 9)
    // Atualizar saldo após crédito
    saldoAtual += amountAbs
    } else {
    doc.setTextColor(200, 0, 0)
    doc.setFont('helvetica', 'bold')
    const valorStr = `-${formatCurrency(amountAbs).replace('-', '')}`
    addRightText(valorStr, colPositions[4] - 8, yPosition + 9)
    // Atualizar saldo após consumo
    saldoAtual -= amountAbs
    }

    // Saldo Após (verde se >= 0, vermelho se < 0)
    const balanceColor: [number, number, number] = saldoAtual >= 0 ? [0, 120, 0] : [200, 0, 0]
    doc.setTextColor(balanceColor[0], balanceColor[1], balanceColor[2])
    doc.setFont('helvetica', 'bold')
    addRightText(formatCurrency(saldoAtual), tableRightX - 8, yPosition + 9)

    yPosition += currentRowHeight
    })
  }

  // Rodapé
  yPosition = pageHeight - 30
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8)
  const footerDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  addCenteredText(`Documento gerado em ${footerDate}`, yPosition, 8)
  addCenteredText('Sistema de Cantina Escolar - Escola Erlach', yPosition + 8, 8)

  // Gerar nome do arquivo
  const fileName = `extrato_${data.student.name.replace(/\s+/g, '_')}_${data.weekDescription.replace(/\s+/g, '_')}.pdf`

  // Fazer download do PDF
  doc.save(fileName)
}
