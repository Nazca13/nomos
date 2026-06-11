'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getUserName as fetchUserName, updateUserName } from '@/app/actions'

interface UserContextValue {
  userName: string | null
  setUserName: (name: string) => void
  isNewUser: boolean
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState<string | null>(null)
  const [isNewUser, setIsNewUser] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    async function initUser() {
      try {
        const name = await fetchUserName()
        if (name) {
          setUserNameState(name)
        } else {
          setIsNewUser(true)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setMounted(true)
      }
    }
    initUser()
  }, [])

  const setUserName = async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setUserNameState(trimmed)
    setIsNewUser(false)
    try {
      await updateUserName(trimmed)
    } catch (e) {
      console.error('Failed to update user name', e)
    }
  }

  if (!mounted) return null

  return (
    <UserContext.Provider value={{ userName, setUserName, isNewUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}
