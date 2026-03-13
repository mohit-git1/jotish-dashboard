import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import List from './pages/List'
import Details from './pages/Details'
import Result from './pages/Result'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

const App = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/list" /> : <Login />} />
      <Route path="/list" element={user ? <List /> : <Navigate to="/login" replace />} />
      <Route path="/details/:id" element={user ? <Details /> : <Navigate to="/login" replace />} />
      <Route path="/result" element={user ? <Result /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App