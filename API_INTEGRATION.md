# API Integration Guide for RentNest

This document is intended for future frontend and AI-assisted development work. It summarizes the backend API contract, authentication flow, endpoint behavior, and integration expectations so agents can work effectively without needing to inspect the backend code repeatedly.

---

## 1. Backend Overview

The backend service powers the RentNest real-estate rental platform with the following capabilities:

- User authentication and authorization
- Property management for landlords
- Rental request workflow for tenants and landlords
- Stripe-based checkout and payment webhooks
- Review and rating system
- Admin controls for moderation and platform management

### Base API URL

- Local development: http://localhost:5000
- Production: https://rent-nest-backend-mu.vercel.app

### API Prefix

All routes are prefixed with:

- /api

---

## 2. Authentication Model

The backend uses JWT-based authentication with two token types:

- Access token: used for authenticated requests
- Refresh token: stored in an HttpOnly cookie

### Important Notes

- Access token should be sent in the request body or headers depending on the backend implementation.
- Refresh token should never be exposed to the frontend JavaScript runtime.
- Logout should clear the refresh cookie and invalidate the session.

### Auth Endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | /api/auth/register | Public | Register a tenant or landlord |
| POST | /api/auth/login | Public | Login and receive auth tokens |
| POST | /api/auth/refresh-token | Public | Refresh access token using refresh cookie |
| GET | /api/auth/me | Authenticated | Get current authenticated user |
| POST | /api/auth/logout | Authenticated | Logout and clear session |

### Suggested Frontend Handling

- Store the access token in memory or a secure client-side storage strategy.
- Do not rely on storing the refresh token in localStorage.
- On app startup, attempt to restore auth state by calling /api/auth/me or /api/auth/refresh-token if needed.

---

## 3. Core Resources

### 3.1 Users

Base path: /api/users

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| PATCH | /api/users/profile | Authenticated | Update current user profile |
| GET | /api/users | ADMIN | Get all users |
| GET | /api/users/:id | ADMIN | Get a single user |
| PATCH | /api/users/:id/status | ADMIN | Activate or block a user |
| DELETE | /api/users/:id | ADMIN | Delete a user |

### 3.2 Categories

Base path: /api/categories

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | /api/categories | Public | List all categories |
| POST | /api/categories | ADMIN | Create a category |
| PATCH | /api/categories/:id | ADMIN | Update a category |
| DELETE | /api/categories/:id | ADMIN | Delete a category |

### 3.3 Properties

Base path: /api/properties

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | /api/properties | Public | List properties with filters, search, sorting |
| GET | /api/properties/my-properties | LANDLORD | List landlord-owned properties |
| GET | /api/properties/:id | Public | Get property details |
| POST | /api/properties | LANDLORD | Create a property |
| PATCH | /api/properties/:id | LANDLORD | Update a property |
| PATCH | /api/properties/:id/status | LANDLORD | Change property status |
| DELETE | /api/properties/:id | LANDLORD | Delete a property |

### Common Property Filters

The listing endpoint supports query parameters such as:

- page
- limit
- search
- sortBy
- sortOrder
- city
- categoryId

Example:

- /api/properties?page=1&limit=10
- /api/properties?search=apartment&city=Dhaka
- /api/properties?sortBy=rentAmount&sortOrder=desc

### 3.4 Rental Requests

Base path: /api/rentals

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | /api/rentals | TENANT | Submit a rental request |
| GET | /api/rentals | ADMIN | View all rental requests |
| GET | /api/rentals/my-requests | TENANT | View tenant’s own requests |
| GET | /api/rentals/incoming | LANDLORD | View requests for landlord properties |
| GET | /api/rentals/:id | ADMIN, TENANT | Get a specific request |
| PATCH | /api/rentals/:id/status | ADMIN, LANDLORD | Approve or reject a request |

### Rental Flow

1. Tenant submits a rental request.
2. Landlord approves or rejects it.
3. Once approved, the request can proceed to payment.
4. After successful payment, the rental status becomes active.

### 3.5 Reviews

Base path: /api/reviews

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | /api/reviews | TENANT | Submit a property review |
| GET | /api/reviews/property/:propertyId | Public | Get all reviews for a property |
| PATCH | /api/reviews/:id | TENANT | Update a review |
| DELETE | /api/reviews/:id | TENANT, ADMIN | Delete a review |

### 3.6 Payments

Base path: /api/payments

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | /api/payments/checkout-session | TENANT | Create Stripe checkout session |
| GET | /api/payments/history | TENANT | Get payment/payment history |
| GET | /api/payments/:id | ADMIN, TENANT, LANDLORD | Get payment details |
| POST | /api/payments/webhook | Public | Stripe webhook endpoint |

---

## 4. Data & Status Expectations

### User Roles

The backend expects these role values:

- TENANT
- LANDLORD
- ADMIN

### Property Statuses

Possible property status values include:

- AVAILABLE
- RENTED
- UNAVAILABLE

### Rental Request Statuses

Typical flow:

- PENDING
- APPROVED
- REJECTED
- ACTIVE

### Payment Statuses

Typical payment states:

- PENDING
- PAID
- FAILED

---

## 5. Recommended Frontend Integration Patterns

### API Communication Rules

- Use JSON request bodies for POST/PATCH requests.
- Expect JSON responses unless otherwise noted.
- Handle errors via the backend’s error payloads and show user-friendly messages.
- Use pagination-aware UI components for listing endpoints.

### Authentication Handling

- Keep the user session state in a centralized auth layer.
- Refresh expired tokens silently when possible.
- Ensure protected routes redirect unauthenticated users.

### File Upload / Media Notes

Properties support multiple images. If the frontend uses multipart uploads, the backend contract should be checked before implementation. The README indicates multi-image support, but the precise upload mechanism should be validated from the backend implementation.

---

## 6. Environment Variables (Backend)

The backend expects the following environment variables:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:rentnest123@localhost:5432/rentnest?schema=public"
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET="super-secret-jwt-access-signature-token-key-2026"
JWT_ACCESS_EXPIRES_IN="1d"
JWT_REFRESH_SECRET="super-secret-jwt-refresh-signature-token-key-2026"
JWT_REFRESH_EXPIRES_IN="7d"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## 7. Local Development Notes

### Start Backend Locally

```bash
npm install
npx prisma db push
npx prisma generate
npm run dev
```

### Stripe Webhook Testing

For local Stripe testing:

```bash
stripe login
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Use the generated webhook secret in the backend environment variables.

---

## 8. Summary for Agents

When integrating with this API:

- Assume all routes are under /api.
- Prefer the role-based auth flow and treat admin-only routes as restricted.
- Use the property, rental, and payment endpoints as the core business flow.
- For rental requests, expect a multi-step workflow that includes approval and payment completion.
- Treat Stripe as part of the checkout and payment lifecycle, not a simple one-off payment endpoint.

This guide should be used as the primary reference for frontend integration and agent-assisted development work.
