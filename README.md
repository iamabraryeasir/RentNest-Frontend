# 🏡 RentNest Frontend

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://rent-nest-frontend-abrar.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, full-featured property rental marketplace frontend built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. RentNest connects tenants, landlords, and administrators in a seamless ecosystem featuring role-based dashboards, interactive listing discovery, rental request workflows, automated JWT token management, and secure Stripe online payments.

🌐 **Live Application**: [https://rent-nest-frontend-abrar.vercel.app](https://rent-nest-frontend-abrar.vercel.app)

---

## 🚀 Project Overview

RentNest simplifies property management and rental discovery by offering targeted portals for three primary user roles:

- **Tenants**: Discover rental properties with advanced filtering, submit rental requests, process secure Stripe payments upon landlord approval, track booking history, and post verified property reviews.
- **Landlords**: List and manage properties, track occupancy statuses, evaluate incoming tenant requests with instant approval/rejection workflows, and view real-time rental analytics.
- **Admins**: Supervise overall platform activity, manage user accounts (role assignment, status updates, blocking/unblocking), control property categories, and oversee system-wide listings and requests.

---

## 🛠️ Tech Stack

| Domain                    | Technologies                                                                                           |
| :------------------------ | :----------------------------------------------------------------------------------------------------- |
| **Core Framework**        | [Next.js 16](https://nextjs.org/) (App Router, Server Components & Server Actions)                     |
| **Library & Language**    | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)                        |
| **Styling & Icons**       | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)                 |
| **UI Components & Toast** | [shadcn/ui](https://ui.shadcn.com/), `tw-animate-css`, [react-hot-toast](https://react-hot-toast.com/) |
| **Forms & Validation**    | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)                               |
| **State & Auth**          | Custom `apiFetch` HTTP Client, `useActionState`, Cookie-based JWT Auth & Refresh Tokens                |
| **Payments**              | [Stripe Payment Gateway](https://stripe.com/) Checkout Integration                                     |

---

## ✨ Key Features & Capabilities

### 🌐 Public & Discovery

- **Property Catalog**: Browse active listings with dynamic pagination and sort options.
- **Multi-Criteria Search & Filtering**: Filter listings by city, category, price range (`minPrice` / `maxPrice`), bedrooms, and bathrooms.
- **Property Details**: View comprehensive property specs, location details, landlord info, amenities, and tenant reviews.
- **Responsive Layout**: Optimized for desktop, tablet, and mobile views with dedicated navigation bars and footer elements.

### 👤 Tenant Portal

- **Authentication**: User registration and secure login.
- **Rental Request Workflow**: Submit custom move-in dates and messages for preferred properties.
- **Request Tracking**: Monitor status updates (`PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`).
- **Stripe Checkout**: One-click redirection to Stripe's hosted checkout sessions for approved rental requests.
- **Payment & Booking History**: View past transactions and active rental contracts.
- **Review System**: Submit and manage ratings (1–5 stars) and feedback for rented properties.

### 🏠 Landlord Portal

- **Property Management**: Create, edit, update listing details, and manage availability (`AVAILABLE`, `RENTED`, `UNAVAILABLE`).
- **Incoming Request Center**: Review tenant rental applications and approve or reject them in real time.
- **My Properties Dashboard**: Detailed grid view of owned properties with quick actions for updates or deletion.
- **Tenant Interaction**: View tenant details attached to rental requests.

### 🛡️ Admin Control Panel

- **System Metrics Overview**: Platform analytics dashboard displaying total users, active listings, pending requests, and system throughput.
- **User Management**: Search and filter all users, toggle user status (`ACTIVE` / `BLOCKED`), adjust user roles, or remove accounts.
- **Category Control**: Create, edit, and remove property categories and slugs.
- **Content Supervision**: Oversight across all global properties and rental requests.

---

## 🏗️ Core Architecture & Developer Features

### 🔄 Self-Healing API Client (`lib/api-client.ts`)

- **Server & Client Fetch Utility**: Unified `apiFetch` helper that automatically injects `Authorization: Bearer <token>` headers from HTTP cookies.
- **Automatic 401 Token Refresh**: Intercepts unauthorized server-side responses, issues a background refresh token request to `/api/auth/refresh-token`, updates secure cookies, and transparently retries original API requests.

### 🛡️ Middleware Proxy & Route Protection (`proxy.ts`)

- **Edge Route Guards**: Protects `/dashboard/*` and `/payment/*` subpaths against unauthenticated access.
- **Role Verification**: Restricts access based on JWT payload roles (`tenant`, `landlord`, `admin`), automatically redirecting users to their role-appropriate dashboard if they navigate to unauthorized paths.
- **Cookie Synchronization**: Syncs refreshed access and refresh tokens across browser sessions.

### 📋 Form Handling & Server Actions

- **Zod Schema Validation**: Form fields validated with inline error states and strongly-typed payloads.
- **`useActionState` Integration**: Explicit management of asynchronous form states (`pending`, `success`, `error`) with user feedback powered by toast notifications.

---

## 🔌 API Integration Reference

All backend API requests, authentication headers, data models, query parameters, status codes, and endpoint paths are documented in detail in the standalone API reference:

📄 **[API Integration Guide](API_INTEGRATION.md)**

> **Note**: For endpoint definitions (e.g. Auth, Users, Properties, Categories, Rentals, Reviews, Payments), refer directly to `API_INTEGRATION.md`.

---

## 💻 Localhost Setup & Running

Follow these steps to run **RentNest Frontend** locally:

### 1. Prerequisites

Ensure you have the following installed:

- **Node.js** (v18.x or later recommended)
- **pnpm** (or `npm` / `yarn`)

### 2. Clone the Repository

```bash
git clone https://github.com/iamabraryeasir/RentNest-Frontend.git
cd RentNest-Frontend
```

### 3. Configure Environment Variables

Create a `.env` file in the project root directory and define the backend API URL:

```env
API_BASE_URL="http://localhost:5000"
```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 6. Production Build & Execution

To test the production build locally:

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

---

## 📂 Project Structure

```
rent_nest_frontend/
├── app/                      # Next.js App Router routes & pages
│   ├── (public)/             # Public pages (Home, Properties, About)
│   ├── auth/                 # Authentication pages (Login, Register)
│   ├── dashboard/            # Protected Dashboard portals
│   │   ├── admin/            # Admin management pages
│   │   ├── landlord/         # Landlord property & request management
│   │   ├── profile/          # User profile settings
│   │   └── tenant/           # Tenant request tracking & payment
│   ├── payment/              # Stripe checkout success & cancel routes
│   ├── globals.css           # Global Tailwind CSS styles
│   └── layout.tsx            # Root layout component
├── components/               # Reusable UI & layout components
│   ├── ui/                   # Primitive shadcn/ui components
│   ├── navbar.tsx            # Global Navigation Bar
│   ├── property-card.tsx     # Property card component
│   ├── status-badge.tsx      # Rental & property status indicators
│   └── user-dropdown.tsx     # Authenticated user menu
├── lib/                      # Core helpers & utilities
│   ├── api-client.ts         # Production-grade fetch client with auto refresh
│   ├── auth-helper.ts        # Cookie & JWT token utilities
│   ├── auth.ts               # Base API URL & token decoder
│   └── utils.ts              # Class name mergers (clsx + tailwind-merge)
├── proxy.ts                  # Next.js Middleware route guard & token rotator
├── API_INTEGRATION.md        # Complete backend API endpoint reference
├── package.json              # Project dependencies & scripts
└── README.md                 # Project README
```
