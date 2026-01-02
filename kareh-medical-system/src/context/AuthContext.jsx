import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: '1',
    name: 'Dr. Juan Pérez',
    email: 'juan@kareh.com',
    role: 'doctor',
    permissions: ['read', 'write', 'delete'],
  })

  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout, login }}>
      {children}
    </AuthContext.Provider>
  )
}
