import { useState, useEffect } from 'react'
import { socket } from '../socket'

export default function DriverView({ orders, drivers }) {
  const [selectedDriver, setSelectedDriver] = useState('d1')

  const driver = drivers.find(d => d.id === selectedDriver)
  const myOrder = driver?.orderId ? orders.find(o => o.id === driver.orderId) : null

  useEffect(() => {
    if (!driver || driver.status !== 'delivering') return
    const interval = setInterval(() => {
      socket.emit('driver:location', {
        driverId: selectedDriver,
        lat: driver.lat + (Math.random() - 0.5) * 0.001,
        lng: driver.lng + (Math.random() - 0.5) * 0.001,
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [selectedDriver, driver])

  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 40 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>You are</p>
          <select value={selectedDriver} onChange={e => setSelectedDriver(e.target.value)}
            style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: 16, fontWeight: 600, outline: 'none' }}>
            {drivers.map(d => <option key={d.id} value={d.id}>{d.avatar} {d.name}</option>)}
          </select>
        </div>

        {driver && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 40 }}>{driver.avatar}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{driver.name}</div>
                <div style={{ fontSize: 13, color: driver.status === 'available' ? 'var(--green)' : 'var(--accent)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--mono)', fontSize: 11 }}>
                  {driver.status}
                </div>
              </div>
            </div>

            {myOrder ? (
              <div>
                <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Current delivery</p>
                <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: 16, border: '1px solid rgba(255,107,53,0.2)' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{myOrder.item}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>For {myOrder.customer}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>📍 Drop: {myOrder.to}</div>
                  <div style={{ marginTop: 16, fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>{myOrder.eta} min left</div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, textAlign: 'center' }}>📡 Your location is being broadcast live</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>No active delivery</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>Waiting for dispatcher to assign an order</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}