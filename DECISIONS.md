# Architectural Decisions Log - Vastu Marketplace

This document details key decisions and design choices made during development:

---

### 1. Unified Sandbox & API Services Toggle
- **Decision**: Implemented `USE_LOCAL_STORAGE` switcher in `client/src/services/config.js`.
- **Rationale**: Allowed client-side execution to run standalone in the browser, while keeping the full Express/MongoDB server configuration functional and ready. Swapping between them requires changing only a single line of code.

### 2. Multi-image 360° Sequence Viewer
- **Decision**: Developed `ThreeSixtyViewer.jsx` using sequential mouse drag and touch swipe events rather than complex WebGL/Three.js pipelines.
- **Rationale**: Multi-image frames sequence is highly responsive on mobile, loads faster, and doesn't require compiling heavy shaders, satisfying both 3D visualization and local storage constraints.

### 3. File Uploads Sandbox (IndexedDB)
- **Decision**: Utilized browser `IndexedDB` to store file uploads (business registrations, car images, video blobs) in base64 format, while saving metadata JSON in `localStorage`.
- **Rationale**: LocalStorage has a strict 5MB quota, which would crash with a single image. IndexedDB has virtually unlimited allocations (up to hundreds of MBs in modern browsers), making mock listings stable.

### 4. Location Proximity (Haversine Formula)
- **Decision**: Calculated vehicle distances manually on the frontend/mock-backend using the Haversine formula (evaluating earth sphere distance from browser GPS latitude and longitude).
- **Rationale**: Satisfies the distance-based filtering requirement when running fully in local storage mode without access to database geo-queries.

### 5. Google Maps Embed Proxy
- **Decision**: Set up Leaflet/Google standard lat/lng maps embed frames.
- **Rationale**: Provides interactive dealer coordinates on detail sheets out-of-the-box without requiring API keys.
