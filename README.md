# FOVEA — Precision Spectacles Finder & Optical Companion
**Full MERN Stack • B.Tech 3rd Year • Engineering Design Project (EDP) • Frontend Mid-Term**

FOVEA is an intelligent spectacle tracking and optical management web platform built on the **MERN** stack (**M**ongoDB, **E**xpress.js, **R**eact.js, **N**ode.js).

Designed specifically for the everyday reality of individuals with corrective eyewear: *when you misplace your glasses, searching for them is nearly impossible without your vision*.

---

## 🌟 MERN Stack Architecture

```
                    ┌────────────────────────────────────────┐
                    │          React 18 + Vite (SPA)         │
                    │  - OpeningScene (Defocus-to-Focus)     │
                    │  - RadarHUD (360° Sonar Tracker)       │
                    │  - FrameFinder (AI Face Recommender)   │
                    │  - Web Audio API (Piezoelectric chirp) │
                    └───────────────────▲────────────────────┘
                                        │ REST API (JSON)
                                        │ Proxied in dev / Unified in prod
                    ┌───────────────────▼────────────────────┐
                    │         Express.js / Node.js           │
                    │  - /api/devices (Sonar Telemetry)      │
                    │  - /api/frames (Face Match Catalog)    │
                    │  - /api/health (System Diagnostics)    │
                    └───────────────────▲────────────────────┘
                                        │ Mongoose ODM
                    ┌───────────────────▼────────────────────┐
                    │                MongoDB                 │
                    │  - Devices Collection                  │
                    │  - Frames Collection                   │
                    │  - TelemetryAudit Logs                 │
                    │  (Auto-Failover in-memory fallback)    │
                    └────────────────────────────────────────┘
```

---

## 🌟 Core Features & Modules

### 1. 🎬 Cinematic Opening Scene (Defocus-to-Focus Reveal)
- **Optical Defocus Simulation**: Begins in a simulated blurred optical field mimicking uncorrected eyesight (-4.75 D).
- **Calibration Reticle & Lens Sweep**: An animated diopter calibration crosshair sweeping across the viewport.
- **Brand Reveal**: The **FOVEA** logo (featuring the custom magnifying glass finder lens motif) emerges smoothly into crystal-clear 0.00 D focus with an optical snap chime.
- **Full Control**: Includes **"Enter FOVEA System"**, **"Skip Intro"**, and a persistent **"Replay Opening"** button in the header bar.

### 2. 📡 Interactive Live Radar Finder (Simulation Demo)
- **360° Sonar Sweep HUD**: Visualizes circular radar sweeps with real-time compass bearings (N, S, E, W).
- **Live MongoDB Sync**: Room target switches immediately update the device position in MongoDB.
  - *Living Room Sofa* (0.4m, -42 dBm RSSI)
  - *Study Desk Bookstack* (1.8m, -64 dBm RSSI)
  - *Coat Rack Pocket* (3.2m, -78 dBm RSSI)
  - *Car Console* (6.8m, -89 dBm RSSI)
- **Interactive Hardware Remote Actions**:
  - **Chirp Spectacles**: Emits an authentic 85 dB piezoelectric chirp sequence via Web Audio API.
  - **Flash LED**: Activates high-frequency temple strobe beacon.
  - **Proximity Ping**: Dynamic Geiger-style sound loop that beeps faster as you get closer to the frames.
  - **Geofence Check**: Safe boundary verification.

### 3. 🔬 EDP Hardware Architecture Showcase
- **0.8g Micro-Transponder**: Exploded engineering breakdown of the micro-transponder integrated directly into the spectacle hinge.
- **Dual-Band UWB + BLE 5.3**: IEEE 802.15.4z sub-centimeter time-of-flight ranging.
- **Resonant Piezoelectric Cavity**: Miniaturized 3.2mm ceramic transducer (85.4 dB SPL @ 10cm).
- **Energy Harvesting**: Upper-rim micro-photovoltaic ribbon with 14-month autonomous standby.

### 4. 👓 AI Frame Finder & Face Shape Recommender
- Dynamic face shape filtering: *Oval, Round, Square, and Heart*.
- Interactive 3D Parallax Tilt cards for 6 precision frame styles fetched via `/api/frames`.
- Integrated **"Test Locator"** bench modal simulating live tracking telemetry for each individual frame.

### 5. 🗺️ 2D Apartment Blueprint & Spatial Triangulation
- Interactive floor plan showing Living Room, Study/Lab, Bedroom, and Hallway with pinpoint coordinate mapping.

### 6. 📊 Engineering Data Sheet
- Comprehensive verification table detailing carrier frequencies, radial error tolerances, ISO biocompatibility, and IP68 waterproof ratings.

---

## 🚀 How to Run the Project

### Option 1: 1-Click Windows Launcher (Recommended)
Double-click `start-mern.bat` in the project root folder.
It automatically launches the server and opens `http://localhost:5000` in your browser.

### Option 2: Via Terminal
```bash
# In the project root:
npm start
```
Then visit: `http://localhost:5000`

### Option 3: Separate Frontend Dev with Hot Reloading
```bash
# Terminal 1 (Backend API):
cd backend
npm start

# Terminal 2 (React Vite Dev Server):
cd frontend
npm run dev
```
Vite will run on `http://localhost:3000` with hot module replacement (HMR) and automatically proxy API calls to port 5000.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System diagnostics & MongoDB connection status |
| `GET` | `/api/devices` | Get paired spectacles transponders |
| `GET` | `/api/devices/:id` | Get single device telemetry |
| `POST` | `/api/devices/chirp/:id` | Trigger acoustic 85dB chirp pulse |
| `POST` | `/api/devices/led/:id` | Toggle LED strobe beacon state |
| `POST` | `/api/devices/location/:id` | Update simulated room coordinates |
| `GET` | `/api/frames` | Query frames catalog (supports `?faceShape=oval`) |
| `GET` | `/api/frames/:id` | Get details for single frame |

---

## 📂 Project Directory Structure

```
Frontend_Mid_Term/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & failover
│   ├── controllers/
│   │   ├── deviceController.js   # Telemetry, ping & room switcher
│   │   └── frameController.js    # Frames query & filter
│   ├── data/
│   │   └── seedData.js           # Seed data & room presets
│   ├── models/
│   │   ├── Device.js             # Mongoose Device schema
│   │   ├── Frame.js              # Mongoose Frame schema
│   │   └── TelemetryLog.js       # Audit logs
│   ├── routes/
│   │   ├── deviceRoutes.js       # /api/devices
│   │   └── frameRoutes.js        # /api/frames
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server & static React host
│
├── frontend/
│   ├── public/
│   │   └── assets/images/        # FOVEA logos (PNG + SVG)
│   ├── src/
│   │   ├── components/
│   │   │   ├── OpeningScene.jsx  # Blur-to-focus cinematic intro
│   │   │   ├── Navbar.jsx        # Navigation & sound toggle
│   │   │   ├── HeroSection.jsx   # Hero banner & hologram
│   │   │   ├── RadarHUD.jsx      # Sonar radar & remote actions
│   │   │   ├── HardwareSpecs.jsx # EDP micro-transponder specs
│   │   │   ├── FrameFinder.jsx   # Face shape frame recommender
│   │   │   ├── BlueprintMap.jsx  # 2D apartment coordinate map
│   │   │   ├── DataSheet.jsx     # Engineering technical table
│   │   │   ├── LocatorModal.jsx  # Test bench modal
│   │   │   └── Footer.jsx        # Project credits & status
│   │   ├── services/
│   │   │   └── api.js            # Fetch API client
│   │   ├── utils/
│   │   │   └── audioEngine.js    # Web Audio API sound synthesizer
│   │   ├── App.jsx               # Main React orchestration
│   │   ├── main.jsx              # React DOM render
│   │   └── index.css             # Unified CSS design system
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite config with API proxy
│
├── package.json                  # Root runner script
├── start-mern.bat                # 1-Click Windows launcher
└── README.md                     # Documentation & evaluation guide
```
