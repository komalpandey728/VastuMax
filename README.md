# Vastu — Premium Vehicle Marketplace

A production-quality vehicle marketplace web application built with modern technologies, inspired by Cars24, CarWale, Spinny, and Autotrader.

## Tech Stack

### Frontend
- React 19 + Vite
- React Router, Tailwind CSS v4, Framer Motion
- Axios, React Hook Form, React Hot Toast, Lucide React

### Backend
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication with Role-Based Access
- Cloudinary (images/360/video)
- Google Maps API

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account (for media uploads)
- Google Maps API key

### Installation

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Environment Setup

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your credentials

# Client
cp client/.env.example client/.env
# Edit client/.env with your API URL and Google Maps key
```

### Development

```bash
# Run both client and server concurrently
npm run dev

# Or run separately:
npm run dev:client   # http://localhost:5173
npm run dev:server   # http://localhost:5000
```

## Project Structure

```
VastuWebsite/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route pages
│       ├── layouts/        # Layout wrappers
│       ├── hooks/          # Custom React hooks
│       ├── services/       # API service layer
│       ├── context/        # React context providers
│       ├── utils/          # Utility functions
│       ├── constants/      # App constants
│       └── routes/         # Route definitions
├── server/                 # Express backend
│   └── src/
│       ├── config/         # App configuration
│       ├── models/         # Mongoose models
│       ├── controllers/    # Route controllers
│       ├── routes/         # API routes
│       ├── middleware/     # Express middleware
│       ├── utils/          # Utility functions
│       └── constants/      # Server constants
└── package.json            # Root scripts
```

## Roles

| Role     | Access                                    |
|----------|-------------------------------------------|
| Admin    | Full platform management, analytics       |
| Vendor   | Vehicle listings, onboarding, dashboard   |
| Customer | Browse, wishlist, test drives, compare    |
| Guest    | Browse and search only                    |

## Modules Built

- [x] **Module 1**: Project scaffolding, theme, layouts, homepage
- [x] **Module 2**: Authentication (JWT, roles, protected routes)
- [x] **Module 3**: Vehicle models, CRUD, search & filters
- [x] **Module 4**: Vehicle details, compare, 360 viewer
- [x] **Module 5**: Vendor onboarding & dashboard
- [x] **Module 6**: Customer dashboard, wishlist, test drives
- [x] **Module 7**: Admin dashboard & analytics
- [x] **Module 8**: Maps, location, Q&A system

## License

Private — All rights reserved.