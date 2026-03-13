import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const VALID_USERNAME = 'testuser'
const VALID_PASSWORD = 'Test123'

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    return localStorage.getItem('auth_user') || null
  })

  const login = (username, password) => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem('auth_user', username)
      setUser(username)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('auth_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)