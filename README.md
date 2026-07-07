# GK Ice Cube Co. — Full-Stack App

A storefront + admin dashboard for an ice supply business: customers browse and order cube/crushed/block/dry ice for delivery; staff manage products, inventory, and order fulfillment.

- **Frontend**: React (Vite) + Tailwind CSS + React Router
- **Backend**: Node.js + Express + PostgreSQL (via Prisma)
- **Auth**: Email/password with JWT (customer and admin roles)
- **Payments**: Cash on Delivery by default; optional Stripe Checkout for card payments

## Quick start

Open two terminals.

**Terminal 1 — backend**
```bash
cd backend
npm install
cp .env.example .env      # then set DATABASE_URL and JWT_SECRET
npm run prisma:migrate
npm run seed               # creates an admin account + sample products
npm run dev                 # http://localhost:4000
```

**Terminal 2 — frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173
```

Then open `http://localhost:5173` for the storefront, or `http://localhost:5173/admin/login` for the staff console (default seeded login: `admin@gkicecube.com` / `ChangeMe123!` — change this in production).

Full details, including the API route table and how Stripe is wired up, are in `backend/README.md` and `frontend/README.md`.

## What's included

**Customer storefront**
- Product catalog with category filters, stock status
- Product detail pages with quantity selection
- Cart (persisted in the browser) and checkout with delivery address + Cash on Delivery or card
- Order history and a live order-status tracker (Ordered → Confirmed → Packed → Out for delivery → Delivered)

**Admin dashboard** (`/admin`)
- Snapshot: today's orders, today's revenue, pending orders, low-stock alerts
- Product management: add, edit, hide/show, delete
- Inventory: stock levels with manual adjustments (restocks, damage, corrections), all logged
- Order management: filter by status, update status as orders move through fulfillment

**Backend safeguards**
- Placing an order checks and deducts stock inside a single database transaction, so concurrent orders can't oversell inventory
- Admin-only routes are protected by role-based middleware; the public API never exposes an admin sign-up path
- Structured with Prisma so the schema (`backend/prisma/schema.prisma`) is the single source of truth for the database

## Where to take it next

- Swap the flat delivery fee for zone- or distance-based pricing
- Add email/SMS notifications when order status changes
- Add customer-saved addresses (the `Address` model exists in the schema but isn't wired into the UI yet)
- Deploy: e.g. backend on Render/Railway with a managed Postgres, frontend on Vercel/Netlify (set `VITE_API_URL` to your deployed API)
