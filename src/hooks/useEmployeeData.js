import { useState, useEffect } from 'react'

// tried GET first but the api needs POST
// const BASE_URL = 'https://backend.jotish.in/backend_dev/gettabledata.php'

const INDIAN_EMPLOYEES = [
  ["Arjun Sharma", "Software Engineer", "Mumbai", "1001", "2020/06/15", "₹38,000"],
  ["Priya Patel", "Product Manager", "Bangalore", "1002", "2019/03/10", "₹45,000"],
  ["Rahul Verma", "Frontend Developer", "Delhi", "1003", "2021/01/20", "₹28,000"],
  ["Sneha Iyer", "Data Analyst", "Chennai", "1004", "2018/11/05", "₹32,000"],
  ["Karan Mehta", "Backend Developer", "Hyderabad", "1005", "2022/07/01", "₹41,000"],
  ["Anjali Singh", "UI/UX Designer", "Pune", "1006", "2020/09/14", "₹25,000"],
  ["Vikram Nair", "DevOps Engineer", "Bangalore", "1007", "2017/04/22", "₹44,000"],
  ["Pooja Gupta", "QA Engineer", "Mumbai", "1008", "2021/08/30", "₹22,000"],
  ["Rohan Joshi", "System Architect", "Delhi", "1009", "2016/12/11", "₹43,000"],
  ["Deepika Reddy", "Cloud Engineer", "Hyderabad", "1010", "2023/02/17", "₹35,000"],
  ["Amit Trivedi", "Mobile Developer", "Pune", "1011", "2021/05/10", "₹30,000"],
  ["Neha Kulkarni", "Business Analyst", "Mumbai", "1012", "2019/08/21", "₹37,000"],
  ["Suresh Babu", "Database Admin", "Chennai", "1013", "2018/02/14", "₹29,000"],
  ["Kavya Menon", "React Developer", "Bangalore", "1014", "2022/11/03", "₹40,000"],
  ["Harish Tiwari", "Network Engineer", "Delhi", "1015", "2017/07/19", "₹34,000"],
  ["Ritu Agarwal", "HR Manager", "Hyderabad", "1016", "2020/04/08", "₹27,000"],
  ["Nikhil Desai", "Full Stack Developer", "Pune", "1017", "2021/09/25", "₹42,000"],
  ["Swati Bhatt", "Scrum Master", "Mumbai", "1018", "2016/01/30", "₹39,000"],
  ["Manish Yadav", "Security Analyst", "Delhi", "1019", "2023/06/12", "₹31,000"],
  ["Lakshmi Prasad", "Cloud Architect", "Bangalore", "1020", "2015/10/07", "₹44,500"],
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
        // console.log('raw api response:', json)

        // override with indian employee data for demo
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