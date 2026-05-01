import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import ordersRouter  from './routes/orders.js'   
import driversRouter from './routes/drivers.js'

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
});

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ── In-memory store (replace with PostgreSQL later) ──
const orders = new Map();
const drivers = new Map();

// Seed some demo data
function seedData() {
  const demoDrivers = [
    { id: 'd1', name: 'Ravi Kumar',   avatar: '🛵', lat: 12.9716, lng: 77.5946, status: 'available', orderId: null },
    { id: 'd2', name: 'Priya Singh',  avatar: '🚴', lat: 12.9750, lng: 77.6000, status: 'available', orderId: null },
    { id: 'd3', name: 'Arjun Mehta',  avatar: '🛺', lat: 12.9680, lng: 77.5900, status: 'available', orderId: null },
  ];
  demoDrivers.forEach(d => drivers.set(d.id, d));

  const demoOrders = [
    { id: 'ORD-001', customer: 'Sneha Patel',  item: '🍕 Margherita Pizza',   from: 'Dominos, Koramangala', to: '4th Block, HSR Layout',  status: 'preparing',  driverId: null, eta: 25, createdAt: Date.now() },
    { id: 'ORD-002', customer: 'Karan Bose',   item: '🍔 Smash Burger Combo', from: "McDonald's, Indiranagar", to: 'Whitefield Main Rd',     status: 'preparing',  driverId: null, eta: 35, createdAt: Date.now() },
    { id: 'ORD-003', customer: 'Meera Joshi',  item: '🥗 Poke Bowl',          from: 'Sattvik, Jayanagar',   to: 'JP Nagar 6th Phase',      status: 'preparing',  driverId: null, eta: 20, createdAt: Date.now() },
  ];
  demoOrders.forEach(o => orders.set(o.id, o));
}
seedData();

// ── REST Routes ──
app.use('/api/orders',  ordersRouter(orders, drivers, io))
app.use('/api/drivers', driversRouter(drivers, io))

// ── Socket.IO ──
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Send current state on connect
  socket.emit('init', {
    orders: [...orders.values()],
    drivers: [...drivers.values()]
  });

  // Driver location update
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

      // Randomly complete delivery
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

httpServer.listen(3001, () => console.log('🚀 Server running on http://localhost:3001'));