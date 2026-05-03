const STATUS_CONFIG = {
  preparing: { label: 'Preparing',  bg: 'rgba(255,190,11,0.12)', color: '#ffbe0b', bar: '#ffbe0b' },
  picked_up: { label: 'On the way', bg: 'rgba(255,107,53,0.12)', color: '#ff6b35', bar: '#ff6b35' },
  delivered: { label: 'Delivered',  bg: 'rgba(6,214,160,0.12)',  color: '#06d6a0', bar: '#06d6a0' },
}

export default function OrderCard({ order, active, onClick, drivers = [], onAssign }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.preparing
  const availableDrivers = drivers.filter(d => d.status === 'available')

  console.log('OrderCard:', order.id, 'status:', order.status, 'availableDrivers:', availableDrivers.length)

  return (
    <div
      onClick={onClick}
      style={{
        background: active ? 'rgba(255,107,53,0.06)' : 'var(--surface2)',
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 10,
        padding: 14,
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Left color bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: cfg.bar, borderRadius: '10px 0 0 10px' }} />

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingLeft: 8 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>{order.id}</span>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 3, background: cfg.bg, color: cfg.color }}>
          {cfg.label}
        </span>
      </div>

      {/* Item */}
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3, paddingLeft: 8 }}>{order.item}</div>

      {/* Customer */}
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, paddingLeft: 8 }}>
        {order.customer} · {order.from}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)', paddingLeft: 8 }}>

        {/* ETA */}
        <div style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
          {order.status === 'delivered'
            ? <span style={{ color: 'var(--green)' }}>✓ Delivered</span>
            : <>ETA <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{order.eta} min</span></>
          }
        </div>

        {/* Assign dropdown */}
        {order.status === 'preparing' && (
          availableDrivers.length > 0 ? (
            <select
              onClick={e => e.stopPropagation()}
              onChange={e => {
                if (e.target.value) {
                  onAssign(e.target.value)
                }
              }}
              defaultValue=""
              style={{
                fontFamily: 'var(--font)',
                fontSize: 12,
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: '#ff6b35',
                color: '#fff',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="" disabled>Assign driver</option>
              {availableDrivers.map(d => (
                <option key={d.id} value={d.id}>{d.avatar} {d.name}</option>
              ))}
            </select>
          ) : (
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>No drivers available</span>
          )
        )}

        {/* Assigned driver name */}
        {order.status === 'picked_up' && (
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {drivers.find(d => d.id === order.driverId)?.avatar}{' '}
            {drivers.find(d => d.id === order.driverId)?.name}
          </div>
        )}
      </div>
    </div>
  )
}