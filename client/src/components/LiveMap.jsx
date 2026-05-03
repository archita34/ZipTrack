import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function makeDriverIcon(avatar, status) {
  const color = status === 'delivering' ? '#ff6b35' : '#06d6a0'
  return L.divIcon({
    html: `<div style="
      width:42px;height:42px;border-radius:50%;
      background:#13131a;border:2px solid ${color};
      display:flex;align-items:center;justify-content:center;
      font-size:20px;box-shadow:0 0 14px ${color}88;
      transition: all 0.5s ease;
    ">${avatar}</div>`,
    className: '',
    iconSize: [42, 42],
    iconAnchor: [21, 21]
  })
}

export default function LiveMap({ drivers }) {
  const center = [12.9716, 77.5946]

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {drivers.map(driver => (
          <Marker
            key={`${driver.id}-${driver.lat}-${driver.lng}`}
            position={[driver.lat, driver.lng]}
            icon={makeDriverIcon(driver.avatar, driver.status)}
          >
            <Popup>
              <div style={{ fontFamily: 'sans-serif', fontSize: 13, minWidth: 120 }}>
                <strong>{driver.name}</strong><br />
                {driver.status === 'delivering'
                  ? `📦 Delivering ${driver.orderId}`
                  : '✅ Available'}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}