# WorkNex – Working Commands

## Install

```bash
# Root (mobile app)
npm install

# Backend
cd backend && npm install

# Web dashboard
cd web-dashboard && npm install
```

## Run

```bash
# Backend (from project root)
cd backend && npm start

# Backend with auto-reload
cd backend && npm run dev

# Mobile app (from project root)
npm start

# Web dashboard (from project root)
cd web-dashboard && npm start
```

## Build

```bash
# Web dashboard (for Vercel / static host)
cd web-dashboard && npm run build

# Android APK (Expo EAS)
eas build --platform android --profile preview
```

## Env

- **Backend:** `backend/.env` – `PORT`, `MONGODB_URI`, `JWT_SECRET`
- **Web dashboard:** `REACT_APP_API_BASE_URL` (e.g. `https://village-work.onrender.com`)
- **Mobile:** `utils/api.js` – `LOCAL_IP` or `EXPO_PUBLIC_API_BASE_URL` for device

## Vercel

- Root Directory: **web-dashboard**
- Build: `npm run build` | Output: **build**
