# Puddle - Real-Time Wage Streaming Platform

## Prerequisites

- **Node.js 18+** — download from https://nodejs.org
- This is a Next.js app. It will NOT work with VS Code Live Server.

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/lakotafox/puddle-app.git
cd puddle-app

# 2. Install dependencies
npm install

# 3. Create your env file
cp .env.example .env.local

# 4. Edit .env.local — add the Clerk keys (ask the team for these)

# 5. Start the app
npm run dev
```

Then open **http://localhost:3000** in your browser.

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ASK_TEAM
CLERK_SECRET_KEY=sk_test_ASK_TEAM

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

## What's In Here

- **Landing page** — Puddle branding, dark theme
- **Auth** — Clerk (sign up / sign in)
- **Banking dashboard** — Unit white-label app (sandbox demo data)
- **Wage streaming** — real-time clock in/out with live wage counter

## Stack

- Next.js 15 + React 19
- Tailwind CSS + shadcn/ui
- Clerk (auth)
- Unit (banking-as-a-service)

## Backend

The backend lives in a separate repo on Bitbucket (`puddl3_app/puddl3_backend`). FastAPI (Python) handles company/employee accounts with the same Clerk auth.
