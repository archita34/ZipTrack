import { useState, useEffect } from 'react'
import { socket } from './socket'
import Dashboard from './pages/Dashboard'
import DriverView from './pages/DriverView'
import CustomerView from './pages/CustomerView'

export default function App() {
  const [view, setView] = useState('dashboard')
  const [orders, setOrders] = useState([])
  const [drivers, setDrivers] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('init', ({ orders, drivers }) => {
      setOrders(orders)
      setDrivers(drivers)
    })
    socket.on('order:new', (order) => setOrders(p => [...p, order]))
    socket.on('order:updated', (updated) =>
      setOrders(p => p.map(o => o.id === updated.id ? updated : o))
    )
    socket.on('driver:updated', (updated) =>
      setDrivers(p => p.map(d => d.id === updated.id ? updated : d))
    )
    socket.on('driver:moved', ({ driverId, lat, lng }) =>
      setDrivers(p => p.map(d => d.id === driverId ? { ...d, lat, lng } : d))
    )
    return () => socket.removeAllListeners()
  }, [])

  return (
    <div style={{ display: 'grid', gridTemplateRows: '56px 1fr', height: '100vh' }}>
      {/* HEADER */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,107,53,0.08) 0%, transparent 40%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 0 0 rgba(255,107,53,0.6)', animation: 'pulse 2s infinite' }} />
          ZIPTRACK
        </div>

        <nav style={{ display: 'flex', gap: 4 }}>
          {[['dashboard','Dispatcher'],['driver','Driver'],['customer','Customer']].map(([key, label]) => (
            <button key={key} onClick={() => setView(key)} style={{
              fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500,
              padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
              background: view === key ? 'var(--surface2)' : 'transparent',
              border: view === key ? '1px solid var(--border)' : '1px solid transparent',
              color: view === key ? 'var(--text)' : 'var(--muted)', transition: 'all 0.2s'
            }}>{label}</button>
          ))}
        </nav>

        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em',
          background: connected ? 'rgba(6,214,160,0.12)' : 'rgba(255,107,53,0.12)',
          color: connected ? 'var(--green)' : 'var(--accent)',
          border: `1px solid ${connected ? 'rgba(6,214,160,0.3)' : 'rgba(255,107,53,0.3)'}`,
          padding: '3px 10px', borderRadius: 3
        }}>
          {connected ? '● LIVE' : '○ CONNECTING'}
        </div>
      </header>

      {/* VIEWS */}
      <main style={{ overflow: 'hidden' }}>
        {view === 'dashboard' && <Dashboard orders={orders} drivers={drivers} />}
        {view === 'driver'    && <DriverView orders={orders} drivers={drivers} />}
        {view === 'customer'  && <CustomerView orders={orders} />}
      </main>

      <style>{`
        @keyframes pulse { 0%,100%{ box-shadow: 0 0 0 0 rgba(255,107,53,0.6); } 50%{ box-shadow: 0 0 0 8px rgba(255,107,53,0); } }
      `}</style>
    </div>
  )
}