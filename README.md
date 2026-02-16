# WorkNex – Working Commands

## Install

```bash
# Root (mobile app)
npm install

# Backend
cd backend && npm install

# Web dashboard (separate repo: https://github.com/22A91A1289/worknex-dashboard)
git clone https://github.com/22A91A1289/worknex-dashboard.git
cd worknex-dashboard && npm install
```

## Run

```bash
# Backend (from project root)
cd backend && npm start

# Backend with auto-reload
cd backend && npm run dev

# Mobile app (from project root)
npm start

# Web dashboard (from worknex-dashboard repo folder)
cd worknex-dashboard && npm start
```

## Build

```bash
# Web dashboard (from worknex-dashboard repo folder)
cd worknex-dashboard && npm run build

# Android APK (Expo EAS)
eas build --platform android --profile preview
```

## Env

- **Backend:** `backend/.env` – `PORT`, `MONGODB_URI`, `JWT_SECRET`
- **Web dashboard:** `REACT_APP_API_BASE_URL` (e.g. `https://village-work.vercel.app`)
- **Mobile:** `utils/api.js` – `LOCAL_IP` or `EXPO_PUBLIC_API_BASE_URL` for device

## Vercel (web dashboard)

- Repo: **https://github.com/22A91A1289/worknex-dashboard** (separate repo)
- Build: `npm run build` | Output: **build**
