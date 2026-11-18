<<<<<<< HEAD
# SAFEZONE – Emergency Contact & Live Location Sharing Platform
### Developed for CEC-HACKSTORM-2026

**SAFEZONE** is a high-reliability, real-time emergency safety dashboard and live GPS tracking application built for rapid distress signaling and proactive personal security.

---

## 🚀 Key Highlights & Features

1. **Prominent One-Tap SOS Emergency System (Highest Priority)**
   - 5-second countdown safeguard with synthesized audible ticks.
   - Immediate cancellation window if triggered accidentally.
   - Hardware Geolocation API integration to capture coordinates, accuracy, altitude, velocity, and timestamp.
   - Automatic Google Maps link generation: `https://www.google.com/maps?q={lat},{lng}`.
   - Instant emergency alert creation with notification tracking across all trusted contacts.
   - "Mark as Safe" resolution flow with audit note logging.

2. **Proactive Safe Timer**
   - Built for solo walks, transit commutes, and late-night campus departures.
   - Preset durations: 5, 10, 15, 30, and 60 minutes (with live progress tracking).
   - "I'm Safe" disarm check-in.
   - Audible warning alarm under 30 seconds.
   - **Automatic SOS Trigger**: If the timer expires without check-in, the full SOS emergency protocol is automatically initiated.

3. **Live GPS Stream & Interactive Telemetry**
   - High-precision continuous `watchPosition` GPS tracking.
   - Real interactive map with OpenStreetMap tiles (Leaflet) and Google Maps app link.
   - Dynamic accuracy radius indicator.
   - Reverse geocoding for physical landmarks and campus locations.

4. **Trusted Contacts Hierarchy**
   - Add, edit, and delete contacts.
   - Set contact priority levels and assign a Primary Contact.
   - Native one-click phone dialer (`tel:`) and emergency SMS alert templates (`sms:`).

5. **Incident History & Audit Trail**
   - Filterable timeline (All, Active, Resolved, Cancelled).
   - Historical GPS coordinates, timestamps, and resolution summaries.

6. **Shareable Emergency Tracking (`/#/track/:emergencyId`)**
   - Public responder tracking view for emergency contacts and campus security.
   - Minimalist privacy-safe display: live beacon status, GPS coordinates, interactive map, Google Maps button, and emergency hotline dialer.

7. **Zero-Cost DEMO MODE**
   - Full functionality runs out-of-the-box without paid third-party APIs.
   - Instant 1-Click Demo Login for hackathon judges and evaluators.
   - Pre-loaded with realistic sample contacts, safety records, and demo sessions.
   - Firebase Authentication & Firestore integration available when environment variables are supplied.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 5, JavaScript
- **Styling**: Tailwind CSS (Dark Navy `#0B132B`, Emergency Red `#DC2626`, Safe Green `#10B981`)
- **Icons**: Lucide React
- **Mapping**: Leaflet + React-Leaflet (OpenStreetMap) + Google Maps Navigation Links
- **Audio Synthesizer**: Native Web Audio API (zero external media assets required)
- **State & Storage**: React Context API, LocalStorage with Demo Mode fallback, Firebase Auth & Firestore

---

## 💻 Running Locally

### Development Mode:
```bash
npm install
npm run dev
```

### Production Build & Preview:
```bash
npm run build
npm run preview
```

---

## 🛡️ Hackathon Submission Details
- **Project**: SAFEZONE
- **Hackathon**: CEC-HACKSTORM-2026
- **Status**: Production Ready & Fully Tested
=======
# SOS-SYSTEM
SAFTEY WEB SITE
>>>>>>> 007f247186af32e48ebc0814ce94d701963aec5c
