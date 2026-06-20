import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, type User } from '../services/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchUser = useCallback(async () => {
    const u = await authService.me()
    setUser(u)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      fetchUser()
        .catch(() => {
          localStorage.removeItem('access_token')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      authService.refresh()
        .then(() => fetchUser())
        .catch(() => setUser(null))
        .finally(() => setLoading(false))
    }
  }, [fetchUser])

  const login = async (email: string, password: string) => {
    await authService.login({ email, password })
    const u = await authService.me()
    setUser(u)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
