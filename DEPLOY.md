# Deployment Guide

## Environment Variables
Ensure the following variables are set in your deployment environment (e.g., Vercel, Railway, Docker):

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:port/postgres"

# Authentication (Admin)
ADMIN_SECRET_KEY="your-secure-secret-key-32-chars-min"

# Optional: Push Notifications
# PUSHER_APP_ID=...
# PUSHER_KEY=...
```

## Build & Run
The application is a standard Next.js app.

```bash
# Install dependencies
npm ci

# Generate Prisma Client
npx prisma generate

# Build application
npm run build

# Start server
npm start
```

## Database Migration
We use Prisma for database management.

**Safe Deploy (Production):**
```bash
npx prisma migrate deploy
```

**Prototyping / Reset:**
```bash
npx prisma db push
```

## Health Checks
-   **App**: `/` (Home page)
-   **Admin**: `/admin/login`
-   **API**: `/api/health` (Not yet implemented, check logs)
