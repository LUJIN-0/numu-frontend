'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!isMounted) return
        const email = currentUser.signInDetails?.loginId || currentUser.username || ''
        const name = email.includes('@') ? email.split('@')[0] : email
        setUser({ name })
      } catch {
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadUser()

    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn') loadUser()
      else if (payload.event === 'signedOut') setUser(null)
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
