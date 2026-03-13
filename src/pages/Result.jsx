import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useEmployeeData from '../hooks/useEmployeeData'
import SalaryChart from '../components/SalaryChart'
import CityMap from '../components/CityMap'

const Result = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { data, loading } = useEmployeeData()

  const mergedImage = localStorage.getItem('merged_image')
  const employeeRaw = localStorage.getItem('audit_employee')
  const employee = employeeRaw ? JSON.parse(employeeRaw) : null

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Audit Result</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/list')}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              ← Back to List
            </button>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Audit Image</h2>
          {mergedImage ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={mergedImage}
                alt="Audit"
                className="rounded-xl max-w-full"
                style={{ maxHeight: '400px' }}
              />
              {employee && (
                <p className="text-gray-400 text-sm">
                  Verified: <span className="text-white font-medium">{employee[0]}</span> — {employee[1]}
                </p>
              )}
              
                href={mergedImage}
                download="audit-image.png"
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-sm transition-colors"
              >
                Download Image
              </a>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No audit image found. Go back and complete verification.</p>
          )}
        </div>

        {!loading && data.length > 0 && (
          <>
            <SalaryChart data={data} />
            <CityMap data={data} />
          </>
        )}

      </div>
    </div>
  )
}

export default Result