import { useState, useEffect } from 'react'

const useEmployeeData = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'test', password: '123456' }),
        })
        const json = await response.json()
        setData(json.TABLE_DATA.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export default useEmployeeData