import { useRef, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useEmployeeData from '../hooks/useEmployeeData'

const ROW_HEIGHT = 60
const BUFFER = 5

const List = () => {
  const { data, loading, error } = useEmployeeData()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [rowCount, setRowCount] = useState(0)
  useEffect(() => { setRowCount(data.length) }, [data.length])


  useEffect(() => {
    const interval = setInterval(() => {
      console.log('visible row count:', rowCount)
    }, 5000)
    return () => clearInterval(interval)
  }, []
  
  
)

  const handleScroll = useCallback(() => {
    setScrollTop(containerRef.current.scrollTop)
  }, [])

  const viewportHeight = 600
  const totalHeight = data.length * ROW_HEIGHT
  const startIndex = Math.floor(scrollTop / ROW_HEIGHT)
  const visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT)
  const endIndex = Math.min(startIndex + visibleCount + BUFFER, data.length)
  const offsetY = startIndex * ROW_HEIGHT
  const visibleRows = data.slice(startIndex, endIndex)

  const verifiedIds = data.map(e => e[3]).filter(eid => localStorage.getItem(`verified_${eid}`))

  console.log('rendering rows:', startIndex, 'to', endIndex)

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#555', fontSize: '16px' }}>Loading employees...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#c0392b', fontSize: '16px' }}>Error: {error}</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0', padding: '32px 24px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>Employee List</h1>
          <button
            onClick={() => { logout(); navigate('/login') }}
            style={{ background: '#c0392b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>

        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', padding: '12px 20px', background: '#efefea', borderBottom: '1px solid #ddd' }}>
            {['Name', 'Position', 'City', 'ID', 'Salary', 'Action'].map(h => (
              <span key={h} style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
            ))}
          </div>

          <div
            ref={containerRef}
            onScroll={handleScroll}
            style={{ height: `${viewportHeight}px`, overflowY: 'auto', position: 'relative' }}
          >
            <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
              <div style={{ transform: `translateY(${offsetY}px)` }}>
                {visibleRows.map((emp, i) => {
                  const rowIndex = startIndex + i
                  const isVerified = verifiedIds.includes(emp[3])
                  return (
                    <div
                      key={rowIndex}
                      style={{
                        height: `${ROW_HEIGHT}px`,
                        display: 'grid',
                        gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr',
                        padding: '0 20px',
                        alignItems: 'center',
                        borderBottom: '1px solid #eee',
                        background: rowIndex % 2 === 0 ? '#fff' : '#fafaf8',
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {emp[0]}
                        {isVerified && (
                          <span style={{ fontSize: '11px', background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>
                            Verified
                          </span>
                        )}
                      </span>
                      <span style={{ fontSize: '13px', color: '#555' }}>{emp[1]}</span>
                      <span style={{ fontSize: '13px', color: '#555' }}>{emp[2]}</span>
                      <span style={{ fontSize: '13px', color: '#555' }}>{emp[3]}</span>
                      <span style={{ fontSize: '13px', color: '#2e7d32', fontWeight: '500' }}>{emp[5]}</span>
                      <button
                        onClick={() => navigate(`/details/${emp[3]}`)}
                        style={{ fontSize: '13px', color: '#1a56db', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                      >
                        View
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
          Showing {startIndex + 1} to {endIndex} of {data.length} employees
        </p>
      </div>
    </div>
  )
}

export default List