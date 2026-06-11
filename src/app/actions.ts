'use server'

import { prisma } from '@/lib/prisma'

// Mock authentication for local/single-user usage
async function getUserId(name: string = 'User') {
  let user = await prisma.user.findFirst()
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'default@nomos.app',
        name,
      }
    })
  }
  return user.id
}

// ----------------- USER -----------------

export async function getUserName() {
  const user = await prisma.user.findFirst()
  return user?.name || ''
}

export async function updateUserName(name: string) {
  const userId = await getUserId(name)
  await prisma.user.update({
    where: { id: userId },
    data: { name }
  })
  return name
}

// ----------------- TRANSACTIONS -----------------

export async function getTransactions() {
  const userId = await getUserId()
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' }
  })
}

export async function createTransaction(data: {
  amount: number
  type: string
  accountName: string
  category: string
  description: string
  rawPrompt?: string | null
}) {
  const userId = await getUserId()
  return prisma.transaction.create({
    data: {
      ...data,
      userId,
    }
  })
}

export async function deleteTransaction(id: string) {
  return prisma.transaction.delete({
    where: { id }
  })
}

// ----------------- SUBSCRIPTIONS -----------------

export async function getSubscriptions() {
  const userId = await getUserId()
  return prisma.subscription.findMany({
    where: { userId }
  })
}

export async function createSubscription(data: {
  name: string
  amount: number
  type: string
  account: string
  category: string
  billingDate: number
}) {
  const userId = await getUserId()
  return prisma.subscription.create({
    data: {
      ...data,
      userId,
    }
  })
}

export async function toggleSubscriptionAction(id: string, isActive: boolean) {
  return prisma.subscription.update({
    where: { id },
    data: { isActive }
  })
}

export async function updateSubscriptionBilledDate(id: string, date: Date) {
  return prisma.subscription.update({
    where: { id },
    data: { lastBilledDate: date }
  })
}

export async function deleteSubscription(id: string) {
  return prisma.subscription.delete({
    where: { id }
  })
}

// ----------------- VAULT ASSETS -----------------

export async function getVaultAssets() {
  const userId = await getUserId()
  return prisma.vaultAsset.findMany({
    where: { userId }
  })
}

export async function createVaultAsset(data: {
  name: string
  type: string
  value: number
}) {
  const userId = await getUserId()
  return prisma.vaultAsset.create({
    data: {
      ...data,
      userId,
    }
  })
}

export async function deleteVaultAsset(id: string) {
  return prisma.vaultAsset.delete({
    where: { id }
  })
}

// ----------------- CHAT MESSAGES -----------------

export async function getChatMessages() {
  const userId = await getUserId()
  return prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  })
}

export async function createChatMessage(data: { role: string, content: string }) {
  const userId = await getUserId()
  return prisma.chatMessage.create({
    data: {
      ...data,
      userId,
    }
  })
}
