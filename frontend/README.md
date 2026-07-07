# GK Ice Cube Co. — Frontend

React (Vite) + Tailwind CSS. Customer storefront and admin dashboard in one app.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Make sure the backend is running first (see `../backend/README.md`), then:

```bash
npm run dev
```

App runs at `http://localhost:5173`.

## Structure

- `src/pages/` — customer-facing pages (catalog, product detail, cart, checkout, login, order history)
- `src/pages/admin/` — staff console (dashboard, orders, products, inventory), all under `/admin`
- `src/context/` — `AuthContext` (login/session) and `CartContext` (shopping cart, persisted to localStorage)
- `src/api/client.js` — Axios instance that attaches the JWT and normalizes error messages

## Signing in

- **Customers**: register at `/register`, or sign in at `/login`.
- **Staff**: sign in at `/admin/login` using the admin account created by the backend's `npm run seed` (defaults to `admin@gkicecube.com` / `ChangeMe123!` unless you changed it in the backend's `.env`).

## Design notes

The visual identity leans into the subject: an icy blue palette (Glacier Blue, Chill Cyan, Arctic Navy), Space Grotesk for headings, Inter for body text, and IBM Plex Mono for prices and order numbers. The signature "ice tile" card treatment (a frosted card with an inner cool-toned glow) appears throughout — product cards, order summaries, dashboard stats — to keep the storefront feeling distinctly like an ice business rather than a generic template.
