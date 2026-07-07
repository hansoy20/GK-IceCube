# GK Ice Cube Co. — Backend API

Node.js + Express + PostgreSQL (via Prisma). Powers the customer storefront and the admin dashboard.

## 1. Prerequisites

- Node.js 18+
- A PostgreSQL database (local install, or a free hosted one from [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))

## 2. Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set `DATABASE_URL` to your PostgreSQL connection string, and change `JWT_SECRET` to a random string.

## 3. Create the database tables

```bash
npm run prisma:migrate
```

This reads `prisma/schema.prisma` and creates all tables (users, products, inventory, orders, etc.) in your database.

## 4. Seed sample data

```bash
npm run seed
```

This creates:
- An admin account (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from your `.env`, defaults to `admin@gkicecube.com` / `ChangeMe123!`)
- Six sample ice products (cube, crushed, block, dry ice) with starting stock

## 5. Run the server

```bash
npm run dev
```

API runs at `http://localhost:4000`. Health check: `GET /api/health`.

## API overview

| Area | Route | Notes |
|---|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` | JWT-based |
| Catalog (public) | `GET /api/products`, `GET /api/products/:slug` | Only active products |
| Orders (customer) | `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id` | Requires login |
| Payments | `POST /api/payments/checkout-session/:orderId` | Optional — needs `STRIPE_SECRET_KEY` |
| Admin dashboard | `GET /api/admin/dashboard` | Requires admin role |
| Admin products | `GET/POST /api/admin/products`, `PUT/PATCH/DELETE /api/admin/products/:id` | Requires admin role |
| Admin inventory | `GET /api/admin/inventory`, `POST /api/admin/inventory/:productId/adjust` | Requires admin role |
| Admin orders | `GET /api/admin/orders`, `PATCH /api/admin/orders/:id/status` | Requires admin role |

## Notes

- **Payments**: Card payments via Stripe Checkout are optional. Leave `STRIPE_SECRET_KEY` blank in `.env` and the storefront will only offer Cash on Delivery. To enable cards, add your Stripe test secret key and (for production) a webhook secret.
- **Stock**: Placing an order decrements inventory inside a database transaction, so stock can't go negative even with concurrent orders.
- **Roles**: New signups via `/api/auth/register` are always `CUSTOMER`. Promote a user to `ADMIN` directly in the database (or via Prisma Studio: `npm run prisma:studio`) — there's deliberately no public "become admin" endpoint.
