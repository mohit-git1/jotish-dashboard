import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const ok = login(username, password)
    if (ok) {
      navigate('/list')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '10px', border: '1px solid #ddd', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>Jotish Dashboard</h1>
        <p style={{ fontSize: '13px', color: '#888', margin: '0 0 28px 0' }}>Sign in to continue</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="testuser"
              style={{ padding: '9px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', color: '#1a1a1a', outline: 'none', background: '#fafaf8' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              style={{ padding: '9px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', color: '#1a1a1a', outline: 'none', background: '#fafaf8' }}
            />
          </div>

          {error && <p style={{ fontSize: '13px', color: '#c0392b', margin: 0 }}>{error}</p>}

          <button
            type="submit"
            style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login