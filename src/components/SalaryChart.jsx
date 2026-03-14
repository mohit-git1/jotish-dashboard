import { useMemo } from 'react'

const SalaryChart = ({ data }) => {
  const cityData = useMemo(() => {
    const map = {}
    data.forEach((emp) => {
      const city = emp[2]
      const salary = parseInt(emp[5].replace(/[^\d]/g, ''))
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

  const barWidth = 60
  const barGap = 40
  const paddingLeft = 80
  const paddingRight = 30
  const paddingTop = 30
  const paddingBottom = 80
  const barAreaHeight = 220

  const chartWidth = paddingLeft + cityData.length * (barWidth + barGap) + paddingRight
  const chartHeight = barAreaHeight + paddingTop + paddingBottom

  return (
    <div>
      <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 20px 0' }}>Average Salary by City</h2>
      <div style={{ overflowX: 'auto' }}>
        <svg width={chartWidth} height={chartHeight}>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + barAreaHeight - ratio * barAreaHeight
            const value = Math.round(ratio * maxAvg)
            return (
              <g key={ratio}>
                <line x1={paddingLeft} x2={chartWidth - paddingRight} y1={y} y2={y} stroke="#e5e5e0" strokeWidth="1" />
                <text x={paddingLeft - 8} y={y + 4} textAnchor="end" fill="#999" fontSize="11">
                  {'\u20B9'}{(value / 1000).toFixed(0)}k
                </text>
              </g>
            )
          })}

          <line x1={paddingLeft} x2={paddingLeft} y1={paddingTop} y2={paddingTop + barAreaHeight} stroke="#ccc" strokeWidth="1" />
          <line x1={paddingLeft} x2={chartWidth - paddingRight} y1={paddingTop + barAreaHeight} y2={paddingTop + barAreaHeight} stroke="#ccc" strokeWidth="1" />

          {cityData.map((item, i) => {
            const barHeight = (item.avg / maxAvg) * barAreaHeight
            const x = paddingLeft + i * (barWidth + barGap)
            const y = paddingTop + barAreaHeight - barHeight

            return (
              <g key={item.city}>
                <rect x={x} y={y} width={barWidth} height={barHeight} fill="#1a1a1a" rx="3" />
                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill="#555" fontSize="11">
                  {'\u20B9'}{(item.avg / 1000).toFixed(0)}k
                </text>
                <text
                  x={x + barWidth / 2}
                  y={paddingTop + barAreaHeight + 16}
                  textAnchor="end"
                  fill="#888"
                  fontSize="12"
                  transform={`rotate(-40, ${x + barWidth / 2}, ${paddingTop + barAreaHeight + 16})`}
                >
                  {item.city}
                </text>
              </g>
            )
          })}

        </svg>
      </div>
    </div>
  )
}

export default SalaryChart