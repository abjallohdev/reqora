# Reqora — Service Request & Tracking System

> A full-stack internal service request platform built with **Next.js 16**, **Prisma**, **Redux Toolkit**, and **Shadcn UI**. Users submit and track requests; admins triage, update status, and leave internal notes.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Seed Data & Test Credentials](#seed-data--test-credentials)
- [Architecture Overview](#architecture-overview)
  - [API Routes](#api-routes)
  - [State Management](#state-management)
  - [Authentication](#authentication)
- [User Roles](#user-roles)
- [Data Model](#data-model)
- [Scripts Reference](#scripts-reference)
- [Known Issues](#known-issues)

---

## Features

### For All Users
- 🔐 Credential-based login with hashed passwords (bcrypt)
- 📋 Submit new service requests with title, description, department, type, and priority
- 📊 View personal request dashboard with real-time status updates
- 🔍 Filter requests by status, department, and type
- ↕️ Sort and paginate requests

### For Admins
- 👁️ View **all requests** from every user across the organisation
- ✏️ Update request status (`PENDING` → `IN_PROGRESS` → `COMPLETED`)
- 💬 Add **internal-only comments** (visible to admins only, flagged with a badge)
- 🗑️ Delete comments on any request
- 🏷️ See submitter information in the request table

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16.2.1](https://nextjs.org/) (App Router + Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Shadcn UI |
| ORM | [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| Database | PostgreSQL |
| Auth | [NextAuth v5](https://authjs.dev/) (credentials provider) |
| State | [Redux Toolkit](https://redux-toolkit.js.org/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Tables | [TanStack Table v8](https://tanstack.com/table) |
| Package Manager | [pnpm](https://pnpm.io/) |

---

## Project Structure

```
reqora/
├── prisma/
│   ├── schema.prisma       # Database models & enums
│   └── seed.ts             # Seed script with test users & requests
├── src/
│   ├── app/
│   │   ├── (auth)/         # Login & Register pages
│   │   ├── api/            # REST API route handlers
│   │   │   └── requests/
│   │   │       ├── route.ts              # GET all, POST new
│   │   │       └── [id]/
│   │   │           ├── route.ts          # GET, PATCH, DELETE single request
│   │   │           └── comments/
│   │   │               ├── route.ts      # POST comment
│   │   │               └── [commentId]/
│   │   │                   └── route.ts  # DELETE comment
│   │   └── dashboard/
│   │       ├── layout.tsx  # Auth guard + header wrapper
│   │       └── page.tsx    # Main dashboard page
│   ├── components/
│   │   ├── auth/           # AuthGuard client component
│   │   ├── ui/             # Shadcn UI primitives
│   │   ├── columns.tsx     # TanStack Table column definitions
│   │   ├── data-table.tsx  # Full data table with filters & pagination
│   │   ├── RequestDetail.tsx  # Request detail modal (view/edit/comment)
│   │   └── SubmitForm.tsx     # New request form dialog
│   ├── lib/
│   │   ├── features/
│   │   │   └── requests/
│   │   │       └── requestsSlice.ts  # Redux slice with async thunks
│   │   ├── store.ts        # Redux store
│   │   ├── hooks.ts        # Typed useAppDispatch / useAppSelector
│   │   ├── types.ts        # Shared TypeScript types
│   │   ├── enums.ts        # Mirrors of Prisma enums (client-safe)
│   │   └── constant.ts     # Shared UI class strings, badge config
│   ├── actions/
│   │   └── signup.ts       # Server action for user registration
│   └── auth.ts             # NextAuth configuration
├── components.json         # Shadcn component config
├── next.config.ts
├── prisma.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** v20+
- **pnpm** v9+ — `npm install -g pnpm`
- A running **PostgreSQL** instance (local or hosted, e.g. Supabase, Neon)

### Installation

```bash
# Clone the repository
git clone <your-repo-url> reqora
cd reqora

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the project root. Use `.env.example` as a template if available, or create from scratch:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/reqora"

# NextAuth
AUTH_SECRET="your-secret-here"   # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

> **Tip:** Generate a strong `AUTH_SECRET` with:
> ```bash
> openssl rand -base64 32
> ```

### Database Setup

```bash
# 1. Generate Prisma client
pnpm prisma generate

# 2. Push the schema to your database (creates tables)
pnpm prisma db push

# 3. Seed the database with demo users and requests
pnpm prisma db seed
```

### Running the App

```bash
# Development server (with Turbopack)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Seed Data & Test Credentials

After running `pnpm prisma db seed`, the database is populated with:
- **2 admin accounts**
- **6 regular user accounts**
- **10 sample service requests** across all statuses and departments
- **Sample comments** (both public and internal) on several requests

### Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@company.com` | `admin1234` |
| **Admin** | `ops.admin@company.com` | `admin1234` |
| **User** | `jane.doe@company.com` | `password123` |
| **User** | `mark.lane@company.com` | `password123` |
| **User** | `sara.kim@company.com` | `password123` |
| **User** | `tom.brooks@company.com` | `password123` |
| **User** | `nina.patel@company.com` | `password123` |
| **User** | `carlos.reyes@company.com` | `password123` |

---

## Architecture Overview

### API Routes

All routes are protected — unauthenticated requests receive `401 Unauthorized`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/requests` | User / Admin | Returns own requests (users) or all requests (admins) |
| `POST` | `/api/requests` | User / Admin | Create a new service request |
| `GET` | `/api/requests/:id` | Owner / Admin | Get a single request with comments |
| `PATCH` | `/api/requests/:id` | Owner / Admin | Update request fields (status, etc.) |
| `DELETE` | `/api/requests/:id` | Owner / Admin | Permanently delete a request |
| `POST` | `/api/requests/:id/comments` | Admin only | Add an internal comment |
| `DELETE` | `/api/requests/:id/comments/:commentId` | Admin only | Remove a comment |

### State Management

Reqora uses **Redux Toolkit** with `createAsyncThunk` for all API communication:

```
Redux Store
└── requests slice
    ├── items[]       ← All loaded ServiceRequest objects (with comments)
    ├── status        ← 'idle' | 'loading' | 'succeeded' | 'failed'
    └── Thunks
        ├── fetchRequests      → GET /api/requests
        ├── createRequest      → POST /api/requests
        ├── updateRequest      → PATCH /api/requests/:id
        ├── deleteRequest      → DELETE /api/requests/:id
        ├── addCommentRequest  → POST /api/requests/:id/comments
        └── deleteCommentRequest → DELETE /api/requests/:id/comments/:commentId
```

The dashboard dispatches `fetchRequests` on load (gated behind session `'authenticated'` status) and renders a loading spinner until data is available to prevent content flash.

### Authentication

Authentication uses **NextAuth v5** with a credentials provider:
1. Login form submits to `signIn('credentials', ...)` from `next-auth/react`
2. NextAuth validates credentials against bcrypt-hashed passwords in the database
3. A session is created and the `user.role` (`USER` | `ADMIN`) is embedded in the JWT
4. All API routes call `auth()` from `@/auth` to verify and read the session server-side
5. The `AuthGuard` client component redirects unauthenticated users to `/login`

---

## User Roles

### `USER`
- Can only see their own submitted requests
- Can submit new requests
- Can view request details

### `ADMIN`
- Can see **all users'** requests
- Can update request status
- Can add/delete internal comments
- Sees "Submitted By" column in the requests table
- Has access to the Admin Actions panel inside each request detail

---

## Data Model

```
User ─────────────┐
  id              │  one-to-many
  email           │
  name            ├─── ServiceRequest ─────────┐
  department      │      id                     │
  role (USER|ADMIN)│     ticketId               │  one-to-many
  password        │     title                   ├─── Comment
                  │     description             │      id
                  │     department              │      body
                  │     type                    │      isInternal
                  │     priority                │      author → User
                  │     status                  │      createdAt
                  │     submittedBy → User      │
                  │     assignedTo  → User?     ├─── StatusLog
                  │     comments[]              │      fromStatus
                  │     statusLogs[]            │      toStatus
                  │     createdAt               │      note
                  │                             │      changedBy → User
Account           │
Session           │ (managed by NextAuth v5)
```

**Enums available:**
- `Department`: `ENGINEERING`, `HumanResources`, `FINANCE`, `OPERATIONS`, `MARKETING`, `LEGAL`, `IT_SUPPORT`, `FACILITIES`
- `RequestType`: `SOFTWARE_ACCESS`, `HARDWARE_REQUEST`, `ONBOARDING`, `EXPENSE_REIMBURSEMENT`, `POLICY_CLARIFICATION`, `MAINTENANCE`, `TRAINING`, `OTHER`
- `Priority`: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- `RequestStatus`: `PENDING`, `IN_PROGRESS`, `COMPLETED`

---

## Scripts Reference

```bash
pnpm dev              # Start development server
pnpm build            # Generate Prisma client + Next.js production build
pnpm start            # Start production server
pnpm lint             # Run ESLint

pnpm prisma generate  # Regenerate Prisma client after schema changes
pnpm prisma db push   # Sync schema to database
pnpm prisma db seed   # Seed demo data
pnpm prisma studio    # Open Prisma Studio (visual database editor)
```

---

## Known Issues

| Issue | Status | Notes |
|---|---|---|
| `next/navigation` unavailable at runtime | ⚠️ Workaround applied | Next.js 16.2.1 doesn't ship `next/link`, `next/navigation`, or `next/dynamic` as resolvable subpath modules. Navigation uses `window.location` in client components. Server actions use return values instead of `redirect()`. |
| TanStack Table compiler warning | ℹ️ Cosmetic | `useReactTable()` returns functions that the React Compiler can't memoize safely. This is a known upstream limitation and does not affect functionality. |
| `next/link` in login page | ⚠️ Monitoring | The same module resolution issue affects `next/link` imports — fallback to `<a href>` if this causes a runtime build failure. |
