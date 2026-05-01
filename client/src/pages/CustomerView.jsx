import { useState } from 'react'

const STEPS = ['Order placed', 'Restaurant preparing', 'Driver picked up', 'On the way', 'Delivered']
const STATUS_STEP = { preparing: 1, picked_up: 3, delivered: 4 }

export default function CustomerView({ orders }) {
  const [orderId, setOrderId] = useState('')
  const order = orders.find(o => o.id === orderId.toUpperCase())
  const step = order ? (STATUS_STEP[order.status] ?? 0) : -1

  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 40 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Track your order</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Enter your order ID to see real-time updates</p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          <input
            value={orderId} onChange={e => setOrderId(e.target.value)}
            placeholder="e.g. ORD-001"
            style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 14, outline: 'none' }}
          />
        </div>

        {order ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{order.item}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>From {order.from}</div>
            </div>

            {/* Progress steps */}
            <div style={{ position: 'relative', paddingLeft: 24 }}>
              <div style={{ position: 'absolute', left: 7, top: 12, bottom: 12, width: 2, background: 'var(--border)' }} />
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: i < STEPS.length - 1 ? 24 : 0, position: 'relative' }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                    background: i <= step ? 'var(--accent)' : 'var(--surface2)',
                    border: `2px solid ${i <= step ? 'var(--accent)' : 'var(--border)'}`,
                    boxShadow: i === step ? '0 0 10px rgba(255,107,53,0.6)' : 'none',
                    transition: 'all 0.3s',
                    marginLeft: -8
                  }} />
                  <span style={{ fontSize: 14, color: i <= step ? 'var(--text)' : 'var(--muted)', fontWeight: i === step ? 600 : 400, transition: 'all 0.3s' }}>
                    {s} {i === step && step !== STEPS.length - 1 && <span style={{ fontSize: 12, color: 'var(--accent)' }}>← now</span>}
                  </span>
                </div>
              ))}
            </div>

            {order.status !== 'delivered' && (
              <div style={{ marginTop: 24, padding: '16px 20px', background: 'rgba(255,107,53,0.06)', borderRadius: 10, border: '1px solid rgba(255,107,53,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Estimated arrival</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{order.eta} min</span>
              </div>
            )}

            {order.status === 'delivered' && (
              <div style={{ marginTop: 24, textAlign: 'center', padding: 20 }}>
                <div style={{ fontSize: 48 }}>🎉</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>Delivered!</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Enjoy your meal</div>
              </div>
            )}
          </div>
        ) : orderId ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
            Order not found. Try ORD-001, ORD-002, or ORD-003
          </div>
        ) : null}
      </div>
    </div>
  )
}