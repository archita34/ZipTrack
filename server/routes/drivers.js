import express from 'express'

export default function driversRouter(drivers, io) {
  const router = express.Router()

  // Get all drivers
  router.get('/', (req, res) => {
    res.json([...drivers.values()])
  })

  // Get single driver
  router.get('/:id', (req, res) => {
    const driver = drivers.get(req.params.id)
    if (!driver) return res.status(404).json({ error: 'Driver not found' })
    res.json(driver)
  })

  // Update driver location
  router.patch('/:id/location', (req, res) => {
    const driver = drivers.get(req.params.id)
    if (!driver) return res.status(404).json({ error: 'Driver not found' })

    const { lat, lng } = req.body
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'lat and lng are required' })
    }

    driver.lat = lat
    driver.lng = lng
    drivers.set(driver.id, driver)

    io.emit('driver:moved', { driverId: driver.id, lat, lng })
    res.json(driver)
  })

  // Update driver status
  router.patch('/:id/status', (req, res) => {
    const driver = drivers.get(req.params.id)
    if (!driver) return res.status(404).json({ error: 'Driver not found' })

    const { status } = req.body
    const validStatuses = ['available', 'delivering']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` })
    }

    driver.status = status
    drivers.set(driver.id, driver)
    io.emit('driver:updated', driver)
    res.json(driver)
  })

  return router
}