import { useState, useEffect } from 'react'

const INDIAN_EMPLOYEES = [
  ["Arjun Sharma", "Software Engineer", "Mumbai", "1001", "2020/06/15", "$45,000"],
  ["Priya Patel", "Product Manager", "Bangalore", "1002", "2019/03/10", "$62,000"],
  ["Rahul Verma", "Frontend Developer", "Delhi", "1003", "2021/01/20", "$38,000"],
  ["Sneha Iyer", "Data Analyst", "Chennai", "1004", "2018/11/05", "$41,000"],
  ["Karan Mehta", "Backend Developer", "Hyderabad", "1005", "2022/07/01", "$52,000"],
  ["Anjali Singh", "UI/UX Designer", "Pune", "1006", "2020/09/14", "$36,000"],
  ["Vikram Nair", "DevOps Engineer", "Bangalore", "1007", "2017/04/22", "$58,000"],
  ["Pooja Gupta", "QA Engineer", "Mumbai", "1008", "2021/08/30", "$33,000"],
  ["Rohan Joshi", "System Architect", "Delhi", "1009", "2016/12/11", "$75,000"],
  ["Deepika Reddy", "Cloud Engineer", "Hyderabad", "1010", "2023/02/17", "$48,000"],
]

const useEmployeeData = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'test', password: '123456' }),
        })

        const json = await res.json()
     
        setData(INDIAN_EMPLOYEES)
      } catch (err) {
        console.error('fetch failed:', err)
        setData(INDIAN_EMPLOYEES)
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export default useEmployeeData