# Agent Guide for RentNest Frontend

This file provides implementation guidance for future agents working on this project.

## Project Context

This repository is the frontend for the RentNest rental marketplace assignment. The app should support a role-based experience for tenants, landlords, and admins.

## Mandatory Stack

- Next.js 16
- shadcn/ui for all UI work
- Tailwind CSS
- Native fetch API for API calls
- Zustand for shared client-side state
- React Hook Form + Zod for forms and validation
- Toast notifications for async feedback

## Mandatory Development Rules

1. Use shadcn/ui components for all new UI elements.
2. Use the native fetch API for backend communication.
3. Use Zustand for shared state across components.
4. Use React Hook Form with Zod for form state and validation.
5. For action-based submissions, use the useActionState hook.
6. Explicitly handle pending, success, and error states.
7. Show toast messages for important outcomes.
8. Protect routes by role using Next.js middleware.
9. Keep the implementation modular, reusable, and aligned with the assignment requirements.

## Assignment Expectations

### Public Experience

- Build a responsive property listing page with filters and search.
- Create a property details page with request-to-rent CTA.
- Handle loading and error states gracefully.

### Tenant Flow

- Implement authentication pages for register and login.
- Allow tenants to submit rental requests with Zod validation.
- Show request status visually with badges.
- Provide a payment flow that leads to success/cancel pages.
- Allow review submission after payment completion.

### Landlord Flow

- Build a landlord dashboard with property overview and request views.
- Create forms to add or edit property listings.
- Support request approval or rejection actions.
- Show toast feedback for action results.

### Admin Flow

- Create an admin dashboard for platform stats and user management.
- Add moderation views for listings and rental requests.

## Route Implementation Guide

Implement these routes in the app router:

- /
- /properties
- /properties/[id]
- /auth/register
- /auth/login
- /dashboard/tenant
- /dashboard/tenant/requests/[id]/pay
- /payment/success
- /payment/cancel
- /dashboard/landlord
- /dashboard/landlord/properties/new
- /dashboard/landlord/requests
- /dashboard/admin

## Form and Action Pattern

Use this pattern for submit flows:

```tsx
const [state, formAction, pending] = useActionState(createProperty, initialState)
```

For each form:

- validate with Zod
- show inline errors
- show a pending state
- show toast success/error feedback

## UI Expectations

- Prioritize a polished, responsive, and accessible experience.
- Use consistent spacing, typography, and component patterns.
- Use clear badges and status treatment for rental requests.

## References

- Backend integration details: [API_INTEGRATION.md](API_INTEGRATION.md)
- Project overview: [README.md](README.md)
