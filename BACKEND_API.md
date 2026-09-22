# pc-store Backend API Contract

> Source of truth: `MoiDiazD/pc-store` `master` branch.
>
> This document was generated from the current backend implementation on 2026-09-23 because the Codex Web environment cannot mount the backend repository directly.
>
> **Important:** do not invent endpoints, request bodies, response fields, or authentication mechanisms that are not described here. If the frontend needs something not supported by this contract, document the limitation instead of changing the backend or creating fake API behavior.

## 1. Backend

- Repository: `MoiDiazD/pc-store`
- Framework: NestJS 11 + Fastify
- API base URL in local development: `http://localhost:3000`
- Database: PostgreSQL
- Authentication: server-side sessions stored in the backend database
- Session cookie name: `session`
- Session duration: 7 days

The backend currently does **not** configure CORS in `src/main.ts`. If the frontend runs on another origin, browser requests may require either a frontend development proxy or a future backend CORS configuration. Do not modify the backend just for this unless explicitly requested.

---

# 2. Authentication

Authentication is cookie/session based.

The frontend must send cookies with API requests:

```ts
fetch(url, {
  credentials: 'include',
});
```

Do not replace this with JWT authentication.

The backend sets an HTTP-only cookie named:

```text
session
```

The frontend must never read the session token directly.

## Public endpoints

The following endpoints explicitly bypass the global authentication guard:

- `POST /auth/register`
- `POST /auth/login`
- `GET /products`
- `GET /products/:id`
- `GET /brands`
- `GET /brands/:id`
- `GET /categories`
- `GET /categories/:id`
- `GET /categories/:id/products`
- `POST /payments/webhook`

All other application endpoints are protected by the global authentication guard unless noted otherwise.

## Authenticated roles

The backend defines:

- `customer`
- `worker`
- `manager`

Authorization is enforced by the backend. Frontend role checks are only for UI/UX and must never be treated as security controls.

---

# 3. Common response/error behavior

The backend uses normal HTTP status codes and NestJS exception responses.

Relevant statuses include:

- `400 Bad Request` — invalid input or business rule violation
- `401 Unauthorized` — missing/invalid/expired session or invalid credentials
- `403 Forbidden` — authenticated user lacks required role
- `404 Not Found` — requested resource does not exist
- `409 Conflict` — business/resource conflict
- `204 No Content` — successful operations without a response body
- `500 Internal Server Error` — unexpected server error

Some PostgreSQL errors are translated by the backend to:

- `23503` → `404` with `Referenced resource does not exist.`
- `23505` → `409` with `Resource already exists.`
- `23514` → `400` with `Constraint validation failed.`
- `22003` → `400` with `Numeric value is out of range.`
- other unexpected errors → `500` with `Internal server error.`

Do not expose raw backend exceptions or stack traces in the UI.

---

# 4. Auth API

## POST /auth/register

Public.

### Request body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Validation:

- `name`: string, 2–200 characters
- `email`: valid email, max 200 characters
- `password`: string, 8–128 characters

New users are always created with role `customer`.

### Successful response

Returns:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "createdAt": "2026-09-23T00:00:00.000Z",
  "updatedAt": "2026-09-23T00:00:00.000Z"
}
```

### Relevant errors

- `409` if the email already exists

---

## POST /auth/login

Public.

### Request body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Validation:

- `email`: valid email, max 200 characters
- `password`: string, 1–128 characters

### Successful response

The backend sets the `session` HTTP-only cookie.

Response body:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer"
}
```

The raw session token must not be expected by the frontend.

### Relevant errors

- `401` — `Invalid credentials.`

---

## POST /auth/logout

Authenticated.

### Request body

None.

The backend revokes the current session and clears the `session` cookie.

Successful response:

- `204 No Content` / empty response body

---

## GET /auth/me

Authenticated.

### Request body

None.

### Successful response

Returns the authenticated user object from the current session.

Expected public user fields:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "createdAt": "2026-09-23T00:00:00.000Z",
  "updatedAt": "2026-09-23T00:00:00.000Z"
}
```

Do not expect `passwordHash`.

### Relevant errors

- `401` — authentication required / invalid or expired session / user unavailable

---

## PATCH /auth/change-password

Authenticated.

### Request body

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

Validation:

- `currentPassword`: string, 1–128 characters
- `newPassword`: string, 8–128 characters

### Successful response

- `204 No Content`

Changing the password revokes all sessions for the user. The frontend should therefore treat the current session as invalid after a successful password change and require login again.

### Relevant errors

- `401` — current password incorrect / user unavailable

---

# 5. Products API

Products are publicly readable.

## GET /products

Public.

Returns an array of active product records.

Example shape:

```json
[
  {
    "id": 1,
    "name": "RTX 5070",
    "model": "RTX 5070",
    "description": "Product description",
    "price": "649.99",
    "stock": 10,
    "brandId": 1,
    "createdAt": "2026-09-23T00:00:00.000Z",
    "updatedAt": "2026-09-23T00:00:00.000Z",
    "deletedAt": null
  }
]
```

The backend filters out soft-deleted products.

Important:

- `price` is returned as a decimal string.
- `stock` is an integer.
- There is no server-side search/filter/pagination endpoint currently exposed.

---

## GET /products/:id

Public.

### Path parameter

- `id`: numeric product ID

### Successful response

Single product with the same shape as above.

### Errors

- `404` — `Product with id {id} not found`

---

## POST /products

Roles:

- `worker`
- `manager`

### Request body

```json
{
  "name": "RTX 5070",
  "model": "RTX 5070",
  "description": "Product description",
  "price": "649.99",
  "stock": 10,
  "brandId": 1
}
```

Validation:

- `name`: string, max 200
- `model`: string, max 150
- `description`: optional string
- `price`: numeric string
- `stock`: integer >= 0
- `brandId`: integer >= 1

Returns the created product.

---

## PATCH /products/:id

Roles:

- `worker`
- `manager`

All body fields are optional:

```json
{
  "name": "RTX 5070 OC",
  "model": "RTX 5070 OC",
  "description": "Updated description",
  "price": "699.99",
  "stock": 8,
  "brandId": 1
}
```

Returns the updated product.

---

## DELETE /products/:id

Roles:

- `worker`
- `manager`

Soft-deletes the product.

Returns the updated product record.

---

## PATCH /products/:id/restore

Role:

- `manager`

Restores a soft-deleted product.

Returns the restored product record.

---

# 6. Brands API

Public reads.

Manager-only writes.

## GET /brands

Public.

Returns an array:

```json
[
  {
    "id": 1,
    "name": "NVIDIA",
    "createdAt": "2026-09-23T00:00:00.000Z",
    "updatedAt": "2026-09-23T00:00:00.000Z",
    "deletedAt": null
  }
]
```

Only active brands are returned.

## GET /brands/:id

Public.

Returns one brand.

## POST /brands

Role: `manager`

Request:

```json
{
  "name": "NVIDIA"
}
```

Validation: string, 1–100 characters.

Returns created brand.

## PATCH /brands/:id

Role: `manager`

Request:

```json
{
  "name": "NVIDIA"
}
```

All fields optional.

Returns updated brand.

## DELETE /brands/:id

Role: `manager`

Soft-deletes the brand.

Returns the updated brand.

## PATCH /brands/:id/restore

Role: `manager`

Restores a soft-deleted brand.

Returns the restored brand.

---

# 7. Categories API

Public reads.

Manager-only category management.

Worker/manager product association management.

## GET /categories

Public.

Returns active categories.

## GET /categories/:id

Public.

Returns one active category.

## GET /categories/:id/products

Public.

Returns products associated with the category.

Product shape:

```json
[
  {
    "id": 1,
    "name": "RTX 5070",
    "model": "RTX 5070",
    "description": "Product description",
    "price": "649.99",
    "stock": 10,
    "brandId": 1,
    "createdAt": "2026-09-23T00:00:00.000Z",
    "updatedAt": "2026-09-23T00:00:00.000Z"
  }
]
```

## POST /categories

Role: `manager`

Request:

```json
{
  "name": "Graphics Cards"
}
```

Validation: string, 1–100 characters.

## PATCH /categories/:id

Role: `manager`

Request:

```json
{
  "name": "Graphics Cards"
}
```

All fields optional.

## DELETE /categories/:id

Role: `manager`

Soft-deletes the category.

## PATCH /categories/:id/restore

Role: `manager`

Restores the category.

## POST /categories/:id/products/:productId

Roles:

- `worker`
- `manager`

Associates a product with a category.

No request body.

## DELETE /categories/:id/products/:productId

Roles:

- `worker`
- `manager`

Removes the product/category association.

No request body.

---

# 8. Cart API

All cart endpoints require authentication.

A cart belongs to the authenticated user. The frontend does not send a user ID.

## GET /cart

Authenticated.

Returns:

```json
{
  "id": 1,
  "items": [
    {
      "product": {
        "id": 1,
        "name": "RTX 5070",
        "model": "RTX 5070",
        "description": "Product description",
        "price": "649.99",
        "stock": 10
      },
      "quantity": 2
    }
  ],
  "createdAt": "2026-09-23T00:00:00.000Z",
  "updatedAt": "2026-09-23T00:00:00.000Z"
}
```

If the user does not have a cart yet, the backend creates one.

---

## POST /cart/items

Authenticated.

### Request body

```json
{
  "productId": 1,
  "quantity": 2
}
```

Validation:

- `productId`: integer >= 1
- `quantity`: integer >= 1

If the product is already in the cart, the requested quantity is added to the existing quantity.

### Errors

- `404` — product not found
- `400` — insufficient stock
- `409` — cart locked by pending checkout

Successful response is the created/updated cart item:

```json
{
  "id": 1,
  "cartId": 1,
  "productId": 1,
  "quantity": 2
}
```

---

## PATCH /cart/items/:productId

Authenticated.

### Request body

```json
{
  "quantity": 3
}
```

Validation:

- `quantity`: integer >= 1

Sets the cart item quantity to the requested value.

### Errors

- `404` — product not found / product not in cart
- `400` — insufficient stock
- `409` — cart locked by pending checkout

Returns the updated cart item.

---

## DELETE /cart/items/:productId

Authenticated.

No request body.

Removes the product from the user's cart.

Successful response:

- `204 No Content` / empty response body

### Errors

- `404` — product is not in cart
- `409` — cart locked by pending checkout

---

# 9. Checkout and Payments

Checkout is part of the Orders API.

There is no public frontend endpoint for creating a PaymentIntent directly.

The frontend starts checkout through:

```text
POST /orders/checkout
```

The backend creates the Stripe PaymentIntent and returns its client secret.

The frontend must never receive or use the Stripe secret key.

---

# 10. Orders API

All order endpoints require authentication.

Orders belong to the authenticated user.

## POST /orders/checkout

Authenticated.

No request body.

The backend:

1. Reads the authenticated user's cart.
2. Locks the cart.
3. Verifies stock.
4. Decrements stock.
5. Creates a pending order.
6. Creates order item snapshots.
7. Creates a Stripe PaymentIntent.
8. Stores the pending payment.
9. Returns the Stripe client secret.

### Successful response

```json
{
  "orderId": 123,
  "paymentId": 456,
  "provider": "stripe",
  "clientSecret": "pi_..._secret_..."
}
```

The payment amount is represented internally in cents.

The checkout currency is `EUR`.

The pending checkout expires after approximately 30 minutes.

### Relevant errors

- `400` — cart empty
- `400` — insufficient stock
- `409` — cart already locked
- `409` — user already has a pending checkout

The frontend must not display a successful order simply because this endpoint returned successfully. The payment still needs to complete successfully.

---

## GET /orders

Authenticated.

Returns the authenticated user's orders, newest first.

Each order contains its order items.

Example:

```json
[
  {
    "id": 123,
    "userId": 1,
    "status": "confirmed",
    "total": "649.99",
    "createdAt": "2026-09-23T00:00:00.000Z",
    "updatedAt": "2026-09-23T00:00:00.000Z",
    "expiresAt": null,
    "items": [
      {
        "id": 1,
        "orderId": 123,
        "productId": 1,
        "productName": "RTX 5070",
        "productModel": "RTX 5070",
        "quantity": 1,
        "unitPrice": "649.99"
      }
    ]
  }
]
```

Order status values:

- `pending`
- `confirmed`
- `cancelled`

---

## GET /orders/:id

Authenticated.

Returns the requested order only if it belongs to the authenticated user.

Response shape is the same as an individual element of `GET /orders`.

### Errors

- `404` — `Order not found.`

---

# 11. Stripe Webhook

## POST /payments/webhook

Public.

This endpoint is for Stripe server-to-server webhooks, not for normal frontend API calls.

The frontend must **not** call this endpoint.

The backend validates the `stripe-signature` header and raw request body.

Handled Stripe events include:

- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`

Successful webhook response:

```json
{
  "received": true
}
```

Do not implement frontend logic around manually calling this endpoint.

---

# 12. Users API

Authenticated by default.

## GET /users/me

Authenticated.

Returns the authenticated user's public profile.

Expected fields:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "createdAt": "2026-09-23T00:00:00.000Z",
  "updatedAt": "2026-09-23T00:00:00.000Z",
  "deletedAt": null
}
```

The service removes `passwordHash` and `deletedAt` before returning the user, so in normal responses `deletedAt` should not be expected here.

## PATCH /users/me

Authenticated.

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

Both fields are optional.

Validation:

- `name`: string, 2–200 characters
- `email`: valid email, max 200 characters

Returns the updated public user.

---

## GET /users/:id

Role: `manager`

Returns the public user profile.

---

## PATCH /users/:id

Role: `manager`

Request body has optional:

- `name`
- `email`

Returns the updated public user.

---

## DELETE /users/:id

Role: `manager`

Soft-deletes the user.

Returns the deleted user record from the repository.

---

## PATCH /users/:id/role

Role: `manager`

Request:

```json
{
  "role": "worker"
}
```

Allowed roles:

- `customer`
- `worker`
- `manager`

Returns the updated public user.

---

# 13. Frontend API implementation rules

## Credentials

All requests should use:

```ts
credentials: 'include'
```

especially authenticated requests.

## Do not send user IDs for user-owned resources

For:

- cart
- orders
- current user

the backend identifies the user from the session cookie.

Do not create frontend endpoints such as:

```text
/cart/user/123
/orders/user/123
```

They do not exist.

## Prices

Backend decimal values are represented as strings.

Do not assume product/order prices are JavaScript numbers.

Example:

```text
"649.99"
```

## IDs

Entity IDs are numeric integers.

## Dates

Dates are returned as ISO date-time strings by the JSON API.

## Soft deletion

Products, brands and categories use soft deletion.

The normal public listing endpoints already filter deleted entities.

The frontend should not invent a deleted-resource API.

---

# 14. Functionality that does NOT currently exist

Do not invent or implement fake backend calls for these unless the backend is later changed:

- product search endpoint
- product pagination endpoint
- product filtering endpoint
- product sorting endpoint
- product image endpoint
- product reviews
- favorites/wishlist
- coupons/discount codes
- shipping address management
- shipping calculation
- order cancellation endpoint for customers
- order payment retry endpoint
- public user listing
- frontend endpoint for creating PaymentIntents
- frontend endpoint for Stripe webhooks

The frontend may still provide useful client-side UX where appropriate, but it must not pretend these capabilities exist on the backend.

---

# 15. Known integration limitation: CORS

The current backend `src/main.ts` does not configure CORS.

The backend listens on:

```text
0.0.0.0:3000
```

A Vite frontend will normally run on a different origin, for example:

```text
http://localhost:5173
```

For local development, prefer a Vite development proxy if appropriate rather than modifying the backend solely for development.

For a production deployment on a different origin, CORS configuration may eventually need to be added to the backend. Document this rather than silently inventing a workaround.

---

# 16. Source files used to derive this contract

The contract was derived from the current backend implementation, especially:

- `src/main.ts`
- `src/auth/auth.controller.ts`
- `src/auth/auth.guard.ts`
- `src/auth/roles.guard.ts`
- `src/auth/auth.constants.ts`
- `src/products/products.controller.ts`
- `src/products/products.service.ts`
- `src/products/dto/*`
- `src/brands/brands.controller.ts`
- `src/brands/brands.service.ts`
- `src/brands/dto/*`
- `src/categories/categories.controller.ts`
- `src/categories/categories.service.ts`
- `src/categories/dto/*`
- `src/cart/cart.controller.ts`
- `src/cart/cart.service.ts`
- `src/cart/dto/*`
- `src/orders/orders.controller.ts`
- `src/orders/orders.service.ts`
- `src/users/users.controller.ts`
- `src/users/users.service.ts`
- `src/users/dto/*`
- `src/payments/stripe-webhook.controller.ts`
- relevant database schemas/repositories

If this document conflicts with the actual backend implementation in a future version, the backend implementation wins and this document must be updated.
