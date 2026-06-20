import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  access: string
  refresh: string
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
    localStorage.setItem('refresh_token', data.refresh)
    return data
  },

  async me(): Promise<User> {
    const { data } = await api.get('/auth/me/')
    return data
  },

  logout() {
    localStorage.clear()
    window.location.href = '/login'
  },
}
