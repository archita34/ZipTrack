import { useState } from 'react'
import LiveMap from '../components/LiveMap'
import OrderCard from '../components/OrderCard'

const API = 'http://localhost:3001/api'

export default function Dashboard({ orders, drivers }) {
  const [selected, setSelected] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ customer: '', item: '', from: '', to: '' })

  const active = orders.filter(o => o.status !== 'delivered').length
  const delivering = orders.filter(o => o.status === 'picked_up').length
  const avgEta = orders.length
    ? Math.round(orders.reduce((s, o) => s + (o.eta || 0), 0) / orders.length)
    : 0

  async function createOrder(e) {
    e.preventDefault()
    await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setShowNew(false)
    setForm({ customer: '', item: '', from: '', to: '' })
  }

  async function assignDriver(orderId, driverId) {
    await fetch(`${API}/orders/${orderId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driverId })
    })
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', height: '100%', overflow: 'hidden' }}>

      {/* LEFT PANEL */}
      <div style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', borderBottom: '1px solid var(--border)' }}>
          {[
            { val: active,       label: 'Active',     color: 'var(--accent2)' },
            { val: delivering,   label: 'Delivering', color: 'var(--green)'   },
            { val: `${avgEta}m`, label: 'Avg ETA',   color: 'var(--blue)'    },
          ].map(({ val, label, color }) => (
            <div key={label} style={{ background: 'var(--surface)', padding: '14px 16px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700, color }}>{val}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Orders header */}
        <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>Live Orders</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', background: 'rgba(255,107,53,0.1)', padding: '2px 8px', borderRadius: 3 }}>{orders.length} total</span>
        </div>

        {/* Order list */}
        <div style={{ overflowY: 'auto', flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              active={selected?.id === order.id}
              drivers={drivers}
              onClick={() => setSelected(order)}
              onAssign={(driverId) => assignDriver(order.id, driverId)}
            />
          ))}
        </div>

        {/* Drivers header */}
        <div style={{ padding: '12px 20px 10px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>Drivers</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--green)', background: 'rgba(6,214,160,0.1)', padding: '2px 8px', borderRadius: 3 }}>{drivers.length} online</span>
        </div>

        {/* Driver list */}
        <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {drivers.map(driver => (
            <div key={driver.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 20, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>{driver.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{driver.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  {driver.status === 'delivering' ? `Delivering · ${driver.orderId}` : 'Available'}
                </div>
              </div>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: driver.status === 'available' ? 'var(--green)' : 'var(--accent)',
                boxShadow: `0 0 6px ${driver.status === 'available' ? 'var(--green)' : 'var(--accent)'}`
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: MAP */}
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <LiveMap drivers={drivers} orders={orders} selected={selected} />

        {/* Bottom bar */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)' }}>
          <button
            onClick={() => setShowNew(true)}
            style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--accent)', color: '#fff', whiteSpace: 'nowrap' }}
          >
            + New Order
          </button>
          <div style={{ flex: 1, overflow: 'hidden', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
            <div style={{ animation: 'ticker 20s linear infinite', display: 'inline-block', whiteSpace: 'nowrap' }}>
              {orders.map(o => `${o.id} · ${o.item} · ${o.status === 'delivered' ? '✓ Done' : o.eta + ' min ETA'}`).join('  ·  ')}&nbsp;&nbsp;&nbsp;
              {orders.map(o => `${o.id} · ${o.item} · ${o.status === 'delivered' ? '✓ Done' : o.eta + ' min ETA'}`).join('  ·  ')}
            </div>
          </div>
        </div>
      </div>

      {/* NEW ORDER MODAL */}
      {showNew && (
        <div
          onClick={() => setShowNew(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: 420 }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>New Delivery Order</h3>
            <form onSubmit={createOrder} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['customer', 'Customer name'],
                ['item',     'Item (e.g. 🍕 Margherita Pizza)'],
                ['from',     'Pickup location'],
                ['to',       'Delivery address'],
              ].map(([key, placeholder]) => (
                <input
                  key={key}
                  required
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: 14, outline: 'none' }}
                />
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowNew(false)}
                  style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font)' }}
                >Cancel</button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: 10, borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600 }}
                >Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ticker { 0%{ transform: translateX(0); } 100%{ transform: translateX(-50%); } }
      `}</style>
    </div>
  )
}