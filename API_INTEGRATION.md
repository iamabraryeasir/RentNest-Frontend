# RentNest API Documentation

## Metadata

- api_name: RentNest API
- base_url: {{base_url}}
- api_prefix: /api
- auth_scheme: JWT
- token_model:
  - access_token: required for authenticated requests
  - refresh_token: stored in HttpOnly cookie

## Roles

- Public
- TENANT
- LANDLORD
- ADMIN
- Stripe Webhook

## Status Values

- user_status: ACTIVE | BLOCKED
- property_status: AVAILABLE | RENTED | UNAVAILABLE
- rental_status: PENDING | APPROVED | REJECTED | ACTIVE
- payment_status: PENDING | PAID | FAILED

## Endpoint Index

### Auth

- POST /api/auth/register — Public — Registers a new user account as TENANT or LANDLORD.
- POST /api/auth/login — Public — Authenticates a user and returns tokens.
- POST /api/auth/refresh-token — Public — Refreshes expired authentication tokens.
- GET /api/auth/me — Authenticated — Fetches current user profile.
- POST /api/auth/logout — Authenticated — Logs out the authenticated user.

### Users

- PATCH /api/users/profile — Authenticated — Updates current user profile.
- GET /api/users — Restricted — Retrieves paginated list of all users.
- GET /api/users/:id — Restricted — Retrieves a single user by ID.
- PATCH /api/users/:id/status — Restricted — Updates user account status.
- DELETE /api/users/:id — Restricted — Deletes a user by ID.

### Categories

- POST /api/categories — Restricted — Creates a new category.
- GET /api/categories — Public — Retrieves all categories.
- PATCH /api/categories/:id — Restricted — Updates a category.
- DELETE /api/categories/:id — Restricted — Deletes a category.

### Properties

- GET /api/properties — Public — Fetches paginated, filterable properties.
- GET /api/properties/:id — Public — Retrieves property details by ID.
- POST /api/properties — Restricted — Creates a new property listing.
- GET /api/properties/my-properties — Restricted — Retrieves landlord-owned properties.
- PATCH /api/properties/:id — Restricted — Updates a property listing.
- PATCH /api/properties/:id/status — Restricted — Updates property status.
- DELETE /api/properties/:id — Restricted — Deletes a property listing.

### Rentals

- POST /api/rentals — Restricted — Creates a rental request.
- GET /api/rentals/my-requests — Restricted — Fetches tenant-owned rental requests.
- GET /api/rentals/:id — Restricted — Fetches a specific rental request.
- GET /api/rentals/incoming — Restricted — Fetches incoming rental requests for a landlord.
- PATCH /api/rentals/:id/status — Restricted — Approves or rejects a rental request.
- GET /api/rentals — Restricted — Retrieves all rental requests across the system.

### Reviews

- POST /api/reviews — Restricted — Submits a review for a property.
- GET /api/reviews/property/:propertyId — Public — Gets all reviews for a property.
- PATCH /api/reviews/:id — Restricted — Updates an existing review.
- DELETE /api/reviews/:id — Restricted — Deletes a review by ID.

### Payments (Stripe)

- POST /api/payments/checkout-session — Restricted — Generates a Stripe checkout session.
- POST /api/payments/webhook — System — Processes Stripe webhook events.
- GET /api/payments/history — Restricted — Fetches payment history for the authenticated tenant.
- GET /api/payments/:id — Restricted — Fetches payment details by ID.

## Endpoint Details

### Auth

#### POST /api/auth/register

- category: Auth
- method: POST
- path: /api/auth/register
- access: Public
- roles: [Public]
- path_params: []
- query_params: []
- body:
  - name: string
  - email: string
  - password: string
  - role: TENANT | LANDLORD
- description: Registers a new user account as either TENANT or LANDLORD.

#### POST /api/auth/login

- category: Auth
- method: POST
- path: /api/auth/login
- access: Public
- roles: [Public]
- path_params: []
- query_params: []
- body:
  - email: string
  - password: string
- description: Authenticates a user and returns authorization tokens.

#### POST /api/auth/refresh-token

- category: Auth
- method: POST
- path: /api/auth/refresh-token
- access: Public
- roles: [Public]
- path_params: []
- query_params: []
- body: null
- description: Refreshes expired authentication tokens.

#### GET /api/auth/me

- category: Auth
- method: GET
- path: /api/auth/me
- access: Authenticated
- roles: [TENANT, LANDLORD, ADMIN]
- path_params: []
- query_params: []
- body: null
- description: Fetches profile information of the currently authenticated user.

#### POST /api/auth/logout

- category: Auth
- method: POST
- path: /api/auth/logout
- access: Authenticated
- roles: [TENANT, LANDLORD, ADMIN]
- path_params: []
- query_params: []
- body: null
- description: Logs out the authenticated user and invalidates session tokens.

### Users

#### PATCH /api/users/profile

- category: Users
- method: PATCH
- path: /api/users/profile
- access: Authenticated
- roles: [TENANT, LANDLORD, ADMIN]
- path_params: []
- query_params: []
- body:
  - name: string (optional)
  - email: string (optional)
- description: Updates profile information of the authenticated user.

#### GET /api/users

- category: Users
- method: GET
- path: /api/users
- access: Restricted
- roles: [ADMIN]
- path_params: []
- query_params:
  - page (number)
  - limit (number)
  - search (string)
  - role (string)
  - status (ACTIVE | BLOCKED)
  - sortBy (string)
  - sortOrder (asc | desc)
- body: null
- description: Retrieves a paginated list of all system users.

#### GET /api/users/:id

- category: Users
- method: GET
- path: /api/users/:id
- access: Restricted
- roles: [ADMIN]
- path_params:
  - id: UUID string
- query_params: []
- body: null
- description: Retrieves detailed information of a single user by ID.

#### PATCH /api/users/:id/status

- category: Users
- method: PATCH
- path: /api/users/:id/status
- access: Restricted
- roles: [ADMIN]
- path_params:
  - id: UUID string
- query_params: []
- body:
  - status: ACTIVE | BLOCKED
- description: Updates account status (ACTIVE or BLOCKED) for a user.

#### DELETE /api/users/:id

- category: Users
- method: DELETE
- path: /api/users/:id
- access: Restricted
- roles: [ADMIN]
- path_params:
  - id: UUID string
- query_params: []
- body: null
- description: Deletes a specific user by ID.

### Categories

#### POST /api/categories

- category: Categories
- method: POST
- path: /api/categories
- access: Restricted
- roles: [ADMIN]
- path_params: []
- query_params: []
- body:
  - name: string
  - slug: string
- description: Creates a new property category.

#### GET /api/categories

- category: Categories
- method: GET
- path: /api/categories
- access: Public
- roles: [Public]
- path_params: []
- query_params: []
- body: null
- description: Retrieves all property categories.

#### PATCH /api/categories/:id

- category: Categories
- method: PATCH
- path: /api/categories/:id
- access: Restricted
- roles: [ADMIN]
- path_params:
  - id: UUID string
- query_params: []
- body:
  - name: string (optional)
  - slug: string (optional)
- description: Updates an existing category by ID.

#### DELETE /api/categories/:id

- category: Categories
- method: DELETE
- path: /api/categories/:id
- access: Restricted
- roles: [ADMIN]
- path_params:
  - id: UUID string
- query_params: []
- body: null
- description: Deletes a category by ID.

### Properties

#### GET /api/properties

- category: Properties
- method: GET
- path: /api/properties
- access: Public
- roles: [Public]
- path_params: []
- query_params:
  - page (number)
  - limit (number)
  - search (string)
  - city (string)
  - categoryId (UUID string)
  - minPrice (number)
  - maxPrice (number)
  - bedrooms (number)
  - bathrooms (number)
  - status (AVAILABLE | RENTED | UNAVAILABLE)
  - sortBy (string)
  - sortOrder (asc | desc)
- body: null
- description: Fetches a paginated, filterable list of properties.

#### GET /api/properties/:id

- category: Properties
- method: GET
- path: /api/properties/:id
- access: Public
- roles: [Public]
- path_params:
  - id: UUID string
- query_params: []
- body: null
- description: Retrieves single property details by ID.

#### POST /api/properties

- category: Properties
- method: POST
- path: /api/properties
- access: Restricted
- roles: [LANDLORD]
- path_params: []
- query_params: []
- body:
  - title: string
  - description: string
  - address: string
  - city: string
  - area: string
  - postalCode: string
  - rentAmount: number
  - bedrooms: number
  - bathrooms: number
  - propertySize: number
  - amenities: array of strings
  - categoryId: UUID string
- description: Creates a new property listing.

#### GET /api/properties/my-properties

- category: Properties
- method: GET
- path: /api/properties/my-properties
- access: Restricted
- roles: [LANDLORD]
- path_params: []
- query_params:
  - page (number)
  - limit (number)
  - status (string)
  - search (string)
  - sortBy (string)
  - sortOrder (asc | desc)
- body: null
- description: Retrieves all properties owned by the authenticated Landlord.

#### PATCH /api/properties/:id

- category: Properties
- method: PATCH
- path: /api/properties/:id
- access: Restricted
- roles: [LANDLORD]
- path_params:
  - id: UUID string
- query_params: []
- body:
  - title: string (optional)
  - description: string (optional)
  - address: string (optional)
  - city: string (optional)
  - area: string (optional)
  - postalCode: string (optional)
  - rentAmount: number (optional)
  - bedrooms: number (optional)
  - bathrooms: number (optional)
  - propertySize: number (optional)
  - amenities: array of strings (optional)
  - categoryId: UUID string (optional)
- description: Updates an existing property listing.

#### PATCH /api/properties/:id/status

- category: Properties
- method: PATCH
- path: /api/properties/:id/status
- access: Restricted
- roles: [LANDLORD]
- path_params:
  - id: UUID string
- query_params: []
- body:
  - status: AVAILABLE | RENTED | UNAVAILABLE
- description: Updates property status.

#### DELETE /api/properties/:id

- category: Properties
- method: DELETE
- path: /api/properties/:id
- access: Restricted
- roles: [LANDLORD]
- path_params:
  - id: UUID string
- query_params: []
- body: null
- description: Deletes a property listing by ID.

### Rentals

#### POST /api/rentals

- category: Rentals
- method: POST
- path: /api/rentals
- access: Restricted
- roles: [TENANT]
- path_params: []
- query_params: []
- body:
  - propertyId: UUID string
  - requestedMoveIn: ISO 8601 DateTime string
  - message: string
- description: Creates a rental request for a property.

#### GET /api/rentals/my-requests

- category: Rentals
- method: GET
- path: /api/rentals/my-requests
- access: Restricted
- roles: [TENANT]
- path_params: []
- query_params:
  - page (number)
  - limit (number)
  - status (string)
  - sortBy (string)
  - sortOrder (asc | desc)
- body: null
- description: Fetches rental requests submitted by the authenticated Tenant.

#### GET /api/rentals/:id

- category: Rentals
- method: GET
- path: /api/rentals/:id
- access: Restricted
- roles: [TENANT]
- path_params:
  - id: UUID string
- query_params: []
- body: null
- description: Fetches details of a specific rental request.

#### GET /api/rentals/incoming

- category: Rentals
- method: GET
- path: /api/rentals/incoming
- access: Restricted
- roles: [LANDLORD]
- path_params: []
- query_params:
  - page (number)
  - limit (number)
  - status (string)
  - propertyId (UUID string)
  - sortBy (string)
  - sortOrder (asc | desc)
- body: null
- description: Fetches incoming rental requests submitted for Landlord's properties.

#### PATCH /api/rentals/:id/status

- category: Rentals
- method: PATCH
- path: /api/rentals/:id/status
- access: Restricted
- roles: [LANDLORD]
- path_params:
  - id: UUID string
- query_params: []
- body:
  - status: APPROVED | REJECTED
- description: Approves or rejects a tenant's rental request.

#### GET /api/rentals

- category: Rentals
- method: GET
- path: /api/rentals
- access: Restricted
- roles: [ADMIN]
- path_params: []
- query_params:
  - page (number)
  - limit (number)
  - status (string)
  - tenantId (UUID string)
  - landlordId (UUID string)
  - propertyId (UUID string)
  - sortBy (string)
  - sortOrder (asc | desc)
- body: null
- description: Retrieves all rental requests across the entire system.

### Reviews

#### POST /api/reviews

- category: Reviews
- method: POST
- path: /api/reviews
- access: Restricted
- roles: [TENANT]
- path_params: []
- query_params: []
- body:
  - propertyId: UUID string
  - rating: number (1-5)
  - comment: string
- description: Submits a review and rating for a property.

#### GET /api/reviews/property/:propertyId

- category: Reviews
- method: GET
- path: /api/reviews/property/:propertyId
- access: Public
- roles: [Public]
- path_params:
  - propertyId: UUID string
- query_params:
  - page (number)
  - limit (number)
  - sortBy (string)
  - sortOrder (asc | desc)
- body: null
- description: Gets all reviews for a specific property.

#### PATCH /api/reviews/:id

- category: Reviews
- method: PATCH
- path: /api/reviews/:id
- access: Restricted
- roles: [TENANT]
- path_params:
  - id: UUID string
- query_params: []
- body:
  - rating: number (optional)
  - comment: string (optional)
- description: Updates an existing review.

#### DELETE /api/reviews/:id

- category: Reviews
- method: DELETE
- path: /api/reviews/:id
- access: Restricted
- roles: [TENANT]
- path_params:
  - id: UUID string
- query_params: []
- body: null
- description: Deletes a review by ID.

### Payments (Stripe)

#### POST /api/payments/checkout-session

- category: Payments (Stripe)
- method: POST
- path: /api/payments/checkout-session
- access: Restricted
- roles: [TENANT]
- path_params: []
- query_params: []
- body:
  - rentalRequestId: UUID string
- description: Generates a Stripe checkout session for an approved rental request.

#### POST /api/payments/webhook

- category: Payments (Stripe)
- method: POST
- path: /api/payments/webhook
- access: System
- roles: [Stripe Webhook]
- path_params: []
- query_params: []
- body: Raw Stripe Webhook Payload
- description: Webhook endpoint to process Stripe payment events.

#### GET /api/payments/history

- category: Payments (Stripe)
- method: GET
- path: /api/payments/history
- access: Restricted
- roles: [TENANT]
- path_params: []
- query_params:
  - page (number)
  - limit (number)
  - status (string)
  - sortBy (string)
  - sortOrder (asc | desc)
- body: null
- description: Fetches payment history for the authenticated Tenant.

#### GET /api/payments/:id

- category: Payments (Stripe)
- method: GET
- path: /api/payments/:id
- access: Restricted
- roles: [TENANT]
- path_params:
  - id: UUID string
- query_params: []
- body: null
- description: Fetches details of a specific payment transaction.
