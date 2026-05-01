import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function makeDriverIcon(avatar) {
  return L.divIcon({
    html: `<div style="
      width:40px;height:40px;border-radius:50%;
      background:#13131a;border:2px solid #ff6b35;
      display:flex;align-items:center;justify-content:center;
      font-size:20px;box-shadow:0 0 12px rgba(255,107,53,0.5);
      animation:driverPulse 2s infinite;
    ">${avatar}</div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  })
}

export default function LiveMap({ drivers, orders, selected }) {
  const center = [12.9716, 77.5946] // Bengaluru

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {drivers.map(driver => (
          <Marker key={driver.id} position={[driver.lat, driver.lng]} icon={makeDriverIcon(driver.avatar)}>
            <Popup>
              <div style={{ fontFamily: 'sans-serif', fontSize: 13 }}>
                <strong>{driver.name}</strong><br />
                {driver.status === 'delivering' ? `📦 ${driver.orderId}` : '✅ Available'}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <style>{`
        @keyframes driverPulse {
          0%,100%{ box-shadow: 0 0 0 0 rgba(255,107,53,0.6); }
          50%{ box-shadow: 0 0 0 10px rgba(255,107,53,0); }
        }
      `}</style>
    </div>
  )
}