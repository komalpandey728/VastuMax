# Backend Migration Guide - Vastu Vehicle Marketplace

This guide outlines how to migrate Vastu from the sandbox browser database (LocalStorage + IndexedDB) to the full production-ready MongoDB + Express.js backend.

---

## 1. Existing Backend Architecture
The backend is already fully implemented, seeded, and operational inside the `/server` directory:
- **Express Entry**: [app.js](file:///C:/Users/komal/OneDrive/Desktop/VastuWebsite/server/src/app.js) and [server.js](file:///C:/Users/komal/OneDrive/Desktop/VastuWebsite/server/src/server.js).
- **Mongoose Models**:
  - `User.js` (accounts & auth)
  - `VendorProfile.js` (KYC details)
  - `Vehicle.js` (listing specs & locations)
  - `Question.js` (vehicle inquiry logs)
  - `Booking.js` (test drive schedules)
  - `Notification.js` (real-time alerts)
  - `Brand.js`, `Category.js`, `City.js` (system metadata)
- **Controllers & Routes**: Comprehensive controllers handling search range matching, GeoJSON proximity, uploads parsing, approvals, and Q&A threads.

---

## 2. Launching the Production Backend

### Step A: Configure Environment Variables
Verify or edit the [server/.env](file:///C:/Users/komal/OneDrive/Desktop/VastuWebsite/server/.env) file:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vastu
JWT_SECRET=your_super_secret_jwt_key_here
```
*(If you want to use MongoDB Atlas, replace `127.0.0.1:27017` with your cloud cluster URL).*

### Step B: Seed Database
Open a shell in `/server` and seed default collections (adds approved dealers, cars, and FAQs):
```bash
npm run seed
```

### Step C: Start Express Server
Start the development server running nodemon:
```bash
npm run dev
```
*(Output will log: `MongoDB connected: localhost` and `Vastu server running on port 5000`)*.

---

## 3. Connecting the React Frontend to the Backend

To point the frontend to the backend rather than using local browser storage, edit [client/src/services/config.js](file:///C:/Users/komal/OneDrive/Desktop/VastuWebsite/client/src/services/config.js):

```javascript
// Change from true to false:
export const USE_LOCAL_STORAGE = false;
```

Vite is pre-configured with a reverse proxy inside [client/vite.config.js](file:///C:/Users/komal/OneDrive/Desktop/VastuWebsite/client/vite.config.js):
```javascript
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
```
So all frontend calls to `/api/*` will route to the Express backend automatically.
All login and register endpoints, file uploads, specs tables, and maps will pull from MongoDB.
