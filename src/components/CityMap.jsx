import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import cityCoordinates from '../utils/cityCoordinates'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CityMap = ({ data }) => {
  const cityStats = {}

  data.forEach((emp) => {
    const city = emp[2]
    if (!cityStats[city]) cityStats[city] = { count: 0 }
    cityStats[city].count += 1
  })

  const markers = Object.entries(cityStats)
    .filter(([city]) => cityCoordinates[city])
    .map(([city, stats]) => ({
      city,
      count: stats.count,
      ...cityCoordinates[city],
    }))

  return (
    <div className="bg-gray-900 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-white">Employee Locations</h2>
      <div className="rounded-xl overflow-hidden" style={{ height: '400px' }}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {markers.map((m) => (
            <Marker key={m.city} position={[m.lat, m.lng]}>
              <Popup>
                <strong>{m.city}</strong><br />
                {m.count} employee{m.count > 1 ? 's' : ''}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

export default CityMap