import { useMemo } from 'react'

const SalaryChart = ({ data }) => {
  const cityData = useMemo(() => {
    const map = {}

    data.forEach((emp) => {
      const city = emp[2]
      const salaryStr = emp[5].replace(/[$,]/g, '')
      const salary = parseInt(salaryStr)
      if (!map[city]) map[city] = { total: 0, count: 0 }
      map[city].total += salary
      map[city].count += 1
    })

    return Object.entries(map).map(([city, val]) => ({
      city,
      avg: Math.round(val.total / val.count),
    }))
  }, [data])

  const maxAvg = Math.max(...cityData.map((d) => d.avg))

  const chartWidth = 600
  const chartHeight = 320
  const paddingLeft = 80
  const paddingBottom = 60
  const paddingTop = 20
  const paddingRight = 20

  const barAreaWidth = chartWidth - paddingLeft - paddingRight
  const barAreaHeight = chartHeight - paddingBottom - paddingTop
  const barWidth = Math.floor(barAreaWidth / cityData.length) - 10

  return (
    <div className="bg-gray-900 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-6">Average Salary by City</h2>
      <div className="overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight}
          style={{ display: 'block' }}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + barAreaHeight - ratio * barAreaHeight
            const value = Math.round(ratio * maxAvg)
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  x2={chartWidth - paddingRight}
                  y1={y}
                  y2={y}
                  stroke="#374151"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#9ca3af"
                  fontSize="11"
                >
                  ${(value / 1000).toFixed(0)}k
                </text>
              </g>
            )
          })}

          {cityData.map((item, i) => {
            const barHeight = (item.avg / maxAvg) * barAreaHeight
            const x = paddingLeft + i * (barAreaWidth / cityData.length) + 5
            const y = paddingTop + barAreaHeight - barHeight

            return (
              <g key={item.city}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#3b82f6"
                  rx="4"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fill="#e5e7eb"
                  fontSize="11"
                >
                  ${(item.avg / 1000).toFixed(0)}k
                </text>
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - paddingBottom + 16}
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize="11"
                  transform={`rotate(-35, ${x + barWidth / 2}, ${chartHeight - paddingBottom + 16})`}
                >
                  {item.city}
                </text>
              </g>
            )
          })}

          <line
            x1={paddingLeft}
            x2={paddingLeft}
            y1={paddingTop}
            y2={paddingTop + barAreaHeight}
            stroke="#6b7280"
            strokeWidth="1"
          />
          <line
            x1={paddingLeft}
            x2={chartWidth - paddingRight}
            y1={paddingTop + barAreaHeight}
            y2={paddingTop + barAreaHeight}
            stroke="#6b7280"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  )
}

export default SalaryChart