# EventVerse — HTML/CSS/JS + Node.js/MongoDB/Brevo

A pure HTML/CSS/JavaScript conversion of the EventVerse React app, backed by a
Node.js/Express API, MongoDB, and Brevo transactional email — ready for
deployment to Zevcloud or any Node host.

## What's inside

```
public/                  Static frontend — open these directly or serve them
  index.html              Home (hero slider, featured/hot events, stadium teaser, testimonials)
  events.html              Browse/search/filter all events
  event.html                Event detail — ticket picker + hotel add-on + cart
  stadium.html              Browse all 15 stadium matches
  stadium-detail.html        Seat tiers + booking + crypto/gift-card/card payment
  hotels.html                105+ hotels, filter by type/price/rating
  sell.html                  Official merch shop
  gift-cards.html            Celebrity gifts (rotate every 60s) + platform support
  cart.html                  Cart → checkout → crypto/gift-card/card/bank payment
  my-tickets.html            Downloadable PDF-ready tickets with QR codes
  favorites.html             Saved events
  help.html                  AI chat (promo codes kept admin-only) + FAQ
  vip.html                   Gold/Platinum/Diamond packages + inquiry form
  login.html                 Sign in / register / forgot password
  admin.html                 Full admin dashboard (protected)
  backdoor/index.html         Admin warning gate
  backdoor/login.html          Admin credential login (admin / admin123)
  404.html                    Custom not-found page
  css/main.css                 Complete dark-theme design system
  js/ev-core-data.js            Real event/hotel/match/product data (esbuild bundle
                                 of the original React data/*.ts files — 187 events,
                                 105 hotels, 15 matches, 6 products, all helpers)
  js/ev-extra-data.js           Testimonials, celebrities, hero slides, crypto wallets
                                 (verbatim from the original component files)
  js/store.js                   localStorage-backed state (replaces Zustand), calls
                                 the API when available and falls back gracefully
  js/components.js              Header/footer/event-card/toast/QR, injected via JS

server/                   Node.js + Express API
  index.js                  Entry point
  lib/db.js                  MongoDB connection
  lib/auth.js                 JWT helpers + admin key middleware
  lib/brevo.js                 Transactional email templates + sender
  lib/seed.js                   Seeds default promo codes + welcome notification
  models/*.js                    10 Mongoose models (User, Booking, StadiumBooking,
                                  MerchOrder, GiftRecord, PromoCode, Notification,
                                  AdminEvent, AdminMatch, Product)
  routes/*.js                     8 route files (auth, bookings, stadium-bookings,
                                   merch, gifts, promos, notifications, admin)
```

## Running locally

**Frontend only (no backend needed — everything works via localStorage):**
```bash
cd public
python3 -m http.server 3000
# open http://localhost:3000
```

**Full stack with MongoDB + email:**
```bash
copy server\.env.example server\.env   # fill in MONGO_URI, BREVO_API_KEY, etc. (optional)
npm install
npm run seed                # seeds promo codes + welcome notification
npm start                   # serves API on :3001 AND the public/ folder
# open http://localhost:3001
```

Run these commands from the project root (the folder containing this README).
The root npm workspace installs the server dependencies and forwards `start`,
`dev`, and `seed` to the server package.

Without a `.env`, the server still boots — it just runs in "local-storage-only"
mode (console warns, nothing crashes) and the frontend transparently falls
back to client-side state, so the whole app is fully usable either way.

## Admin access

Visit `/backdoor` → warning page → `/backdoor/login.html`.
Default credentials: **admin / admin123** (set `ADMIN_USERNAME`/`ADMIN_PASSWORD`
in `server/.env` to change them). Two failed attempts locks the form.

## Default promo codes

`FULL100` (100% off) · `HALF50` (50% off) · `SAVE25` (25% off) · `VIP10` (10% off)

## Payment methods

- **Crypto** (BTC/ETH/USDT/BNB/SOL) — wallet copy-to-clipboard, forces a
  transaction ID + screenshot upload before submission.
- **Gift card** (Amazon/Apple/Steam/Google Play/Razer Gold) — forces a code +
  photo upload before submission.
- **Card** — collects details, always ends in a simulated network-failure
  message (per the original spec), saved to admin either way.
- **Bank transfer** — shows a maintenance message.

## Deploying to Zevcloud

Point Zevcloud at `server/index.js` as the Node entry point; it serves the
`public/` folder itself, so no separate static host is needed. Set the same
environment variables as `server/.env.example` in the Zevcloud dashboard.

## Notes on data fidelity

`ev-core-data.js` is generated directly from the original project's
`src/data/events.ts`, `src/data/stadiums.ts`, `src/data/hotels.ts`,
`src/data/shop.ts`, and `src/lib/dates.ts` via esbuild — it is not
hand-transcribed, so all 187 events, 105 hotels, 15 matches and 6 products
are byte-identical to the source React app, including the dynamic
(always-future) event dates. `ev-extra-data.js` carries the testimonials,
celebrity list, hero carousel slides, and crypto wallet addresses that lived
in component files rather than the data folder, copied verbatim.
