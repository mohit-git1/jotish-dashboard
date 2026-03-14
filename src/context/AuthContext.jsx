import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const VALID_USERNAME = 'testuser'
const VALID_PASSWORD = 'Test123'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user')
    return saved || null
  })

  const login = (username, password) => {
    const isValid = username === VALID_USERNAME && password === VALID_PASSWORD
    if (isValid) {
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