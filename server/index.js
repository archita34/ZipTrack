import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
});

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ── In-memory store ──
const orders = new Map();
const drivers = new Map();

function seedData() {
  const demoDrivers = [
    { id: 'd1', name: 'Ravi Kumar',  avatar: '🛵', lat: 12.9716, lng: 77.5946, status: 'available', orderId: null },
    { id: 'd2', name: 'Priya Singh', avatar: '🚴', lat: 12.9750, lng: 77.6000, status: 'available', orderId: null },
    { id: 'd3', name: 'Arjun Mehta', avatar: '🛺', lat: 12.9680, lng: 77.5900, status: 'available', orderId: null },
  ];
  demoDrivers.forEach(d => drivers.set(d.id, d));

  const demoOrders = [
    { id: 'PPT-001', customer: 'Sneha Patel', item: '🍕 Margherita Pizza',   from: 'Dominos, Koramangala',     to: '4th Block, HSR Layout', status: 'preparing', driverId: null, eta: 25, createdAt: Date.now() },
    { id: 'PPT-002', customer: 'Karan Bose',  item: '🍔 Smash Burger Combo', from: "McDonald's, Indiranagar",  to: 'Whitefield Main Rd',    status: 'preparing', driverId: null, eta: 35, createdAt: Date.now() },
    { id: 'PPT-003', customer: 'Meera Joshi', item: '🥗 Poke Bowl',          from: 'Sattvik, Jayanagar',       to: 'JP Nagar 6th Phase',    status: 'preparing', driverId: null, eta: 20, createdAt: Date.now() },
  ];
  demoOrders.forEach(o => orders.set(o.id, o));
}
seedData();

// ── REST Routes ──
app.get('/api/orders', (req, res) => {
  res.json([...orders.values()]);
});

app.get('/api/drivers', (req, res) => {
  res.json([...drivers.values()]);
});

app.post('/api/orders', (req, res) => {
  const order = {
    id: 'PPT-' + String(orders.size + 1).padStart(3, '0'),
    ...req.body,
    status: 'preparing',
    driverId: null,
    eta: Math.floor(Math.random() * 20) + 15,
    createdAt: Date.now()
  };
  orders.set(order.id, order);
  io.emit('order:new', order);
  res.json(order);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  order.status = req.body.status;
  orders.set(order.id, order);
  io.emit('order:updated', order);
  res.json(order);
});

app.post('/api/orders/:id/assign', (req, res) => {
  const order = orders.get(req.params.id);
  const driver = drivers.get(req.body.driverId);
  if (!order || !driver) return res.status(404).json({ error: 'Not found' });

  order.driverId = driver.id;
  order.status = 'picked_up';
  driver.status = 'delivering';
  driver.orderId = order.id;

  orders.set(order.id, order);
  drivers.set(driver.id, driver);

  io.emit('order:updated', order);
  io.emit('driver:updated', driver);
  res.json({ order, driver });
});

// ── Socket.IO ──
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.emit('init', {
    orders: [...orders.values()],
    drivers: [...drivers.values()]
  });

  socket.on('driver:location', ({ driverId, lat, lng }) => {
    const driver = drivers.get(driverId);
    if (!driver) return;
    driver.lat = lat;
    driver.lng = lng;
    drivers.set(driverId, driver);
    io.emit('driver:moved', { driverId, lat, lng });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// ── Simulate driver movement ──
setInterval(() => {
  drivers.forEach(driver => {
    if (driver.status === 'delivering') {
      driver.lat += (Math.random() - 0.5) * 0.002;
      driver.lng += (Math.random() - 0.5) * 0.002;
      drivers.set(driver.id, driver);
      io.emit('driver:moved', { driverId: driver.id, lat: driver.lat, lng: driver.lng });

      if (Math.random() < 0.008) {
        const order = orders.get(driver.orderId);
        if (order) {
          order.status = 'delivered';
          orders.set(order.id, order);
          io.emit('order:updated', order);
        }
        driver.status = 'available';
        driver.orderId = null;
        drivers.set(driver.id, driver);
        io.emit('driver:updated', driver);
      }
    }
  });
}, 2000);

httpServer.listen(3001, () => console.log('🚀 ParcelPilot server running on http://localhost:3001'));