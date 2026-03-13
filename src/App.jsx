import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import List from './pages/List'
import Details from './pages/Details'
import Result from './pages/Result'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/list" element={<List />} />
      <Route path="/details/:id" element={<Details />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  )
}

export default App
