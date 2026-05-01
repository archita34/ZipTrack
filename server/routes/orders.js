import express from 'express'

export default function ordersRouter(orders, drivers, io) {
  const router = express.Router()

  // Get all orders
  router.get('/', (req, res) => {
    res.json([...orders.values()])
  })

  // Get single order
  router.get('/:id', (req, res) => {
    const order = orders.get(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  })

  // Create new order
  router.post('/', (req, res) => {
    const { customer, item, from, to } = req.body
    if (!customer || !item || !from || !to) {
      return res.status(400).json({ error: 'customer, item, from and to are required' })
    }
    const order = {
      id:        'PPT-' + String(orders.size + 1).padStart(3, '0'),
      customer,
      item,
      from,
      to,
      status:    'preparing',
      driverId:  null,
      eta:       Math.floor(Math.random() * 20) + 15,
      createdAt: Date.now()
    }
    orders.set(order.id, order)
    io.emit('order:new', order)
    res.status(201).json(order)
  })

  // Update order status
  router.patch('/:id/status', (req, res) => {
    const order = orders.get(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })

    const { status } = req.body
    const validStatuses = ['preparing', 'picked_up', 'delivered']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` })
    }

    order.status = status
    orders.set(order.id, order)
    io.emit('order:updated', order)
    res.json(order)
  })

  // Assign driver to order
  router.post('/:id/assign', (req, res) => {
    const order = orders.get(req.params.id)
    const driver = drivers.get(req.body.driverId)

    if (!order)  return res.status(404).json({ error: 'Order not found' })
    if (!driver) return res.status(404).json({ error: 'Driver not found' })
    if (driver.status === 'delivering') {
      return res.status(400).json({ error: 'Driver is already on a delivery' })
    }

    order.driverId  = driver.id
    order.status    = 'picked_up'
    driver.status   = 'delivering'
    driver.orderId  = order.id

    orders.set(order.id, order)
    drivers.set(driver.id, driver)

    io.emit('order:updated', order)
    io.emit('driver:updated', driver)
    res.json({ order, driver })
  })

  return router
}