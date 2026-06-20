import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  access: string
}

export interface User {
  id: number
  email: string
  full_name: string
  role: string
  is_active: boolean
  date_joined: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login/', credentials)
    localStorage.setItem('access_token', data.access)
    return data
  },

  async me(): Promise<User> {
    const { data } = await api.get('/auth/me/')
    return data
  },

  async refresh(): Promise<string> {
    const { data } = await api.post('/auth/refresh/')
    localStorage.setItem('access_token', data.access)
    return data.access
  },

  async logout() {
    try {
      await api.post('/auth/logout/')
    } finally {
      localStorage.removeItem('access_token')
    }
  },
}
