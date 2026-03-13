import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import List from './pages/List'
import Details from './pages/Details'
import Result from './pages/Result'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* These routes require login */}
      <Route path="/list" element={
        <ProtectedRoute><List /></ProtectedRoute>
      } />
      <Route path="/details/:id" element={
        <ProtectedRoute><Details /></ProtectedRoute>
      } />
      <Route path="/result" element={
        <ProtectedRoute><Result /></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
