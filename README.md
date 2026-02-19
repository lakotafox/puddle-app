# Puddle - Real-Time Wage Streaming Platform

## Quick Start

```bash
# Clone the repo
git clone https://github.com/lakotafox/puddle-app.git
cd puddle-app

# Install dependencies
npm install

# Copy env template and add your keys
cp .env.example .env.local
# Edit .env.local with your Clerk keys (see below)

# Run it
npm run dev
```

Open http://localhost:3000

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
CLERK_SECRET_KEY=sk_test_YOUR_KEY

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

Get your Clerk keys at https://dashboard.clerk.com → API Keys

## What's In Here

- **Landing page** — puddle2pool.com branding, dark theme
- **Auth** — Clerk (sign up / sign in)
- **Banking dashboard** — Unit white-label app (sandbox demo data)
- **Wage streaming** — real-time clock in/out with live wage counter

## Stack

- Next.js 15 + React 19
- Tailwind CSS + shadcn/ui
- Clerk (auth)
- Unit (banking-as-a-service)

## Backend

The backend lives in a separate repo on Bitbucket (`puddl3_app/puddl3_backend`). It's a FastAPI (Python) app that handles company/employee accounts and connects to the same Clerk auth.
