# MahaDiagno Partner Portal

Web portal for partner hospitals. Replaces the `MahaDiagno-Partner` React Native app and uses the same backend APIs.

## Stack
Vite + React 19, Tailwind CSS 4, React Router 7, axios, react-toastify, lucide-react, Leaflet (OpenStreetMap) for maps, socket.io-client for live tracking, Razorpay Checkout for subscriptions (the key id is returned by the backend's create-order API).

## Setup
```bash
npm install
cp .env.example .env   # optional, defaults point to production
npm run dev
```

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_SERVER_URL` | `https://api.mahadiagno.com` | Backend root (API is `${VITE_SERVER_URL}/api/v1`) |

## Features (mobile app → web)
| Mobile screen | Web route |
| --- | --- |
| Login / Signup (3 steps) / Forgot Password | `/login`, `/register`, `/forgot-password` |
| Home | `/dashboard` (stats, recent appointments, subscription status) |
| Services / Add Service | `/services` |
| Appointments (+ report upload) | `/appointments` |
| Subscription (Razorpay) | `/subscription` |
| My Subscription / Add Service Boy | `/my-subscriptions` |
| Service Boys / Track Location | `/service-boys`, `/service-boys/:id/track` |
| Wallet / Payment Method | `/wallet`, `/payment-method` |
| Profile / Details / Banner | `/profile` |
| Help, Terms, Privacy | `/help`, `/terms`, `/privacy` |

## Deploy
`vercel.json` rewrites all routes to `index.html` for client-side routing. `npm run build` outputs to `dist/`.
