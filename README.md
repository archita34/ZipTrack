# 📦 ParcelPilot — Real-Time Delivery Tracking Platform

🔴 **Live Demo → [https://willowy-moxie-52422e.netlify.app](https://willowy-moxie-52422e.netlify.app)**

---

## What is ParcelPilot?

ParcelPilot is a full-stack real-time delivery tracking platform that supports 3 concurrent user roles — Dispatcher, Driver, and Customer — with live location updates powered by WebSockets.

---

## Features

- 📍 **Live driver location tracking** on an interactive map
- 📦 **Dispatcher dashboard** — create orders, assign drivers, monitor all deliveries in real time
- 🛵 **Driver view** — see active delivery details and broadcast live location
- 👤 **Customer tracking** — track parcel status through a live timeline using order ID
- 🔴 **Live connection indicator** — shows real-time server connection status
- 📡 **Automated driver simulation** — drivers move on the map automatically
- 📋 **Live ticker** — scrolling feed of all active order updates

---

## Tech Stack

| Frontend | Backend |
|---|---|
| React 18 | Node.js + Express |
| Vite | Socket.io |
| React Leaflet (Maps) | In-memory data store |
| Socket.io Client | REST API |
| CSS Variables | CORS |

---

## How to Run Locally

**Clone the repo**
```bash
git clone https://github.com/archita34/ZipTrack.git
cd ZipTrack
```

**Start the backend**
```bash
cd server
npm install
npm run dev
```

**Start the frontend** (new terminal)
```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**

---

## How to Use

1. **Dispatcher tab** — You'll see 3 demo orders and 3 drivers
2. Click any order → select a driver from the **Assign driver** dropdown
3. Watch the driver pin appear and move on the map in real time
4. **Driver tab** — Select a driver to see their active delivery
5. **Customer tab** — Type `PPT-001`, `PPT-002` or `PPT-003` to track a parcel

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | Netlify |
| Backend | Railway |

---

## Built By

**Archita** — Full Stack Developer  
GitHub: [@archita34](https://github.com/archita34)