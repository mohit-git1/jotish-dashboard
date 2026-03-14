import { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useEmployeeData from '../hooks/useEmployeeData'

const ROW_HEIGHT = 60
const BUFFER = 5
// tried BUFFER = 3 first but scrolling felt janky

const List = () => {
  const { data, loading, error } = useEmployeeData()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)
  // const [search, setSearch] = useState('') // was going to add search filter

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

  console.log('rendering rows:', startIndex, 'to', endIndex)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white text-lg">Loading employees...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-red-400 text-lg">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Employee List</h1>
          <button onClick={() => { logout(); navigate('/login') }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors">
            Logout
          </button>
        </div>

        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="grid grid-cols-6 bg-gray-800 px-4 py-3 text-gray-400 text-sm font-semibold">
            <span>Name</span>
            <span>Position</span>
            <span>City</span>
            <span>ID</span>
            <span>Salary</span>
            <span>Action</span>
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
                  return (
                    <div
                      key={rowIndex}
                      style={{ height: `${ROW_HEIGHT}px` }}
                      className="grid grid-cols-6 px-4 items-center border-b border-gray-800 hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-sm">{emp[0]}</span>
                      <span className="text-sm text-gray-400">{emp[1]}</span>
                      <span className="text-sm text-gray-400">{emp[2]}</span>
                      <span className="text-sm text-gray-400">{emp[3]}</span>
                      <span className="text-sm text-green-400">{emp[5]}</span>
                      <button
                        onClick={() => navigate(`/details/${emp[3]}`)}
                        className="text-blue-400 hover:text-blue-300 text-sm text-left"
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

        <p className="text-gray-500 text-sm mt-3">
          Showing {startIndex + 1} to {endIndex} of {data.length} employees
        </p>
      </div>
    </div>
  )
}

export default List