# GUNA PHARMA - E-commerce Website

## Project Overview
Production-quality, mobile-first e-commerce website for cosmetic/skincare products and general (OTC) medicines and wellness products.

## Brand & Theme
- **Brand Name**: GUNA PHARMA (configurable in `lib/config.ts`)
- **Theme**: Clean WHITE and BLUE
- **Design Tokens**:
  - Primary Blue: `#2563EB` (hover: `#1D4ED8`)
  - Deep Navy: `#0B1F4B` (headings)
  - Soft Blue Tint: `#EFF6FF` (section backgrounds)
  - Border: `#DBEAFE`
  - White: `#FFFFFF` (surfaces)
  - Semantic: Green (in stock/success), Amber (low stock), Red (errors/out of stock)
- **Typography**: Inter via `next/font`
- **Light mode only**, WCAG AA contrast

## Tech Stack
- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: lucide-react
- **Database/Auth/Storage**: Supabase (Postgres, Auth, Storage)
- **State Management**: Zustand (cart) persisted in localStorage
- **Forms/Validation**: React Hook Form + Zod
- **PWA**: next-pwa (manifest, icons, offline fallback)
- **Environment**: .env.example for all keys

## Folder Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/           # Public route group
│   │   ├── page.tsx        # Home page
│   │   ├── catalog/        # Catalog listing
│   │   ├── product/[id]/   # Product detail
│   │   ├── cart/           # Cart page
│   │   ├── checkout/       # Checkout flow
│   │   ├── account/        # Account pages
│   │   ├── blog/           # Health blog
│   │   └── content/        # Static pages (About, Contact, FAQ, Policies)
│   ├── (admin)/            # Admin route group (protected)
│   │   └── admin/          # Admin dashboard
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Header, Footer, BottomTabBar
│   ├── home/               # Home page sections
│   ├── catalog/            # Catalog components
│   ├── product/            # Product page components
│   ├── cart/               # Cart components
│   ├── checkout/           # Checkout components
│   ├── account/            # Account components
│   ├── admin/              # Admin components
│   └── common/             # Shared components
├── lib/
│   ├── config.ts           # Brand/config constants
│   ├── supabase/           # Supabase clients (client & server)
│   ├── utils.ts            # Utility functions
│   ├── validations/        # Zod schemas
│   └── hooks/              # Custom React hooks
├── store/                  # Zustand stores
├── types/                  # TypeScript types
├── styles/                 # Global styles
└── middleware.ts           # Auth middleware

supabase/
├── migrations/             # SQL migrations
└── seed.sql               # Seed script
```

## Commands
```bash
# Development
npm run dev                 # Start dev server

# Build
npm run build              # Production build
npm run start              # Start production server

# Database
npm run db:push            # Push migrations to Supabase
npm run db:seed            # Run seed script

# Linting
npm run lint               # ESLint
npm run typecheck          # TypeScript check

# PWA
npm run build && npm run start  # Test PWA in production mode
```

## Environment Variables
See `.env.example` for all required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_APP_URL`

## Compliance Requirements
- Drug licence number, GST number, registered pharmacist details in footer/checkout
- Prescription-only drugs require admin-approved prescription upload
- Medical disclaimer on medicine pages and footer
- Cookie consent banner
- Private Supabase bucket for prescriptions (signed URLs)