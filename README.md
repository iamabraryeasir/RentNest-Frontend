# RentNest Frontend

This project is the frontend application for the RentNest rental marketplace. It is built with Next.js 16 and follows a modern, role-based, component-driven approach for tenants, landlords, and admins.

## Assignment 5 Overview

RentNest is a responsive property marketplace where:

- Tenants can browse listings, submit rental requests, pay for approved requests, and leave reviews.
- Landlords can list and manage properties and approve or reject incoming requests.
- Admins can manage users and oversee platform content.

> This is a frontend-only assignment. The frontend must consume the backend API from the previous assignment.

## Required Tech Stack

- Framework: Next.js 16
- UI Library: shadcn/ui (must use for new UI work)
- Styling: Tailwind CSS
- Data fetching: native fetch API
- Toasts: shadcn-style toast system
- State management: Zustand
- Forms and validation: React Hook Form + Zod

## Core Development Principles

- Use shadcn/ui components for all new interface work.
- Use the native fetch API for backend communication.
- Use Zustand for shared client-side state.
- Use React Hook Form + Zod for all forms and validation.
- For action-based submissions, use the useActionState hook and explicitly manage pending, success, and error states.
- Use toast notifications for successful and failed async outcomes.
- Protect routes based on role using Next.js middleware.

## Role-Based Features

### Tenant

- Register and log in
- Browse public properties
- View property details
- Submit rental requests
- See request status and payment flow
- Leave reviews after payment completion

### Landlord

- Access a protected dashboard
- Create, edit, and delete property listings
- View incoming rental requests
- Approve or reject requests
- Monitor property-related activity

### Admin

- Access an admin dashboard
- View platform statistics
- Manage users
- Moderate listings and requests

## Route Expectations

The frontend should implement routes aligned with the assignment requirements:

- / for the home page
- /properties for browsing and filtering listings
- /properties/[id] for property details
- /auth/register and /auth/login for authentication
- /dashboard/tenant for tenant dashboard views
- /dashboard/tenant/requests/[id]/pay for payment flow
- /payment/success and /payment/cancel for payment result pages
- /dashboard/landlord for landlord overview
- /dashboard/landlord/properties/new for property creation
- /dashboard/landlord/requests for request management
- /dashboard/admin for admin overview and management

## API Integration Expectations

The frontend should map these UI flows to backend endpoints such as:

- GET /api/properties
- GET /api/properties/:id
- GET /api/categories
- POST /api/auth/register
- POST /api/auth/login
- GET /api/rentals
- POST /api/payments/checkout-session
- PATCH /api/rentals/:id/status

## Form and UI Requirements

- Use Zod validation for forms with inline error messaging.
- Show loading spinners or pending states while submitting forms.
- Use toast notifications for submission success and failure.
- Use status badges for rental request states:
  - PENDING: yellow/orange
  - APPROVED: blue
  - REJECTED: red
  - ACTIVE: green
  - COMPLETED: gray

## Local Development

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 in the browser.

## Backend Reference

For backend API details and integration expectations, see [API_INTEGRATION.md](API_INTEGRATION.md).
