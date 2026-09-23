# pc-store Frontend — Codex Instructions

## 1. Project Overview

This repository contains the frontend application for **pc-store**, an e-commerce application built as a learning project.

The backend already exists in a separate GitHub repository:

**Backend repository:** `MoiDiazD/pc-store`

The frontend must consume the existing backend API.

The main objective is to build a complete, functional and reasonably polished e-commerce frontend while keeping the implementation understandable, maintainable and appropriately simple.

This is a learning project. Avoid unnecessary enterprise-level architecture, excessive abstractions and over-engineering.

---

# 2. Important Rules

## Backend is the source of truth

The backend repository is authoritative regarding:

* available endpoints
* HTTP methods
* request bodies
* response structures
* authentication
* authorization
* roles
* validation
* business rules
* errors
* checkout flow
* orders
* payments

Before implementing an API integration, inspect the backend repository when necessary.

**Do not invent API endpoints.**

If the frontend requires functionality that the backend does not currently expose:

1. Do not modify the backend.
2. Do not invent a fake endpoint.
3. Document the limitation.
4. Continue implementing the rest of the frontend where possible.

---

# 3. Do Not Modify the Backend

The backend repository is a separate project.

Do not:

* modify backend code
* create backend endpoints
* change backend database models
* change backend business logic
* add frontend-specific endpoints
* create mock backend endpoints that pretend to exist

The frontend must adapt to the existing backend API.

If something appears to be missing from the backend, report it instead of silently changing the backend.

---

# 4. Development Philosophy

Prioritize:

1. Correct functionality
2. Clear code
3. Maintainability
4. Good UX
5. Reasonable accessibility
6. Basic frontend security practices
7. Performance where it matters

Avoid premature optimization.

Avoid unnecessary abstractions.

Avoid creating generic systems for functionality that is only used once.

Prefer straightforward code that another developer can easily understand.

---

# 5. Before Starting Development

First inspect the backend repository:

`MoiDiazD/pc-store`

Pay particular attention to:

* controllers
* DTOs
* response structures
* authentication flow
* roles
* cart endpoints
* order endpoints
* payment flow
* product endpoints
* brands
* categories
* users

Build an internal understanding of the API before implementing the corresponding frontend functionality.

Do not assume that the API behaves like a generic e-commerce API.

Use the actual implementation as the source of truth.

---

# 6. Frontend Technology

Choose a modern, stable frontend stack appropriate for this project.

Preferred characteristics:

* TypeScript
* React-based architecture
* modern component-based UI
* straightforward routing
* simple API client
* maintainable state management
* responsive design

Do not introduce a large number of dependencies unless there is a clear reason.

If there is a reasonable choice between multiple libraries, prefer the simpler solution.

---

# 7. Application Structure

The frontend should be organized around features rather than creating one enormous collection of generic components.

A reasonable structure is:

```text
src/
├── app/
├── components/
├── features/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   └── users/
├── pages/
├── services/
├── hooks/
├── types/
├── utils/
└── ...
```

The exact structure may differ if the chosen framework has a better conventional structure.

Do not force this exact structure if it makes the framework less idiomatic.

---

# 8. API Client

Create a centralized API layer.

Do not scatter raw `fetch()` or HTTP calls throughout UI components.

For example:

```text
services/
├── api-client
├── auth-api
├── products-api
├── cart-api
├── orders-api
└── ...
```

The exact filenames are flexible.

The important requirement is that API communication remains centralized and understandable.

The API base URL must come from environment configuration.

Do not hardcode environment-specific URLs throughout the application.

---

# 9. Authentication

The backend uses session-based authentication.

The frontend must respect the backend's authentication mechanism.

Do not replace it with a custom JWT system.

Do not store authentication credentials in localStorage unless the backend contract explicitly requires it.

The frontend should support:

* registration
* login
* logout
* retrieving the current authenticated user
* change password
* authenticated routes/views
* appropriate handling of expired/invalid sessions

The browser must correctly send credentials/cookies when required by the backend.

---

# 10. User Roles

The backend defines different user roles.

The frontend must respect the roles exposed by the backend.

Do not assume that every authenticated user has the same permissions.

At minimum, account for:

* customer
* worker
* manager

Role-based UI should improve the user experience, but **the frontend must never be considered the security boundary**.

The backend remains responsible for authorization.

Never hide a security-sensitive operation only because a button is not visible.

---

# 11. Main Functional Areas

Implement the application progressively.

## Authentication

Implement:

* registration
* login
* logout
* current user/session state
* change password
* authentication-aware navigation

---

## Product Catalog

Implement:

* product listing
* product details
* product information
* price
* stock information where appropriate
* brand
* categories
* navigation between products/categories

The implementation must follow the actual backend API.

---

## Cart

Implement:

* view cart
* add product
* change quantity
* remove product
* display subtotal/total where appropriate
* loading states
* error states
* empty cart state

The UI should clearly communicate when cart operations fail.

---

## Checkout

Implement the checkout flow supported by the backend.

The frontend should:

1. Validate the cart state.
2. Start checkout.
3. Handle the payment flow returned by the backend.
4. Display appropriate payment states.
5. Handle success.
6. Handle failure.
7. Avoid showing a successful purchase when payment has not actually succeeded.

Do not invent payment behavior.

Follow the backend's actual Stripe/payment integration.

---

## Orders

Implement:

* order history
* order details
* order status
* order items
* prices
* quantities
* appropriate empty/loading/error states

---

## User Account

Implement:

* account information
* change password
* logout
* relevant user information

Only expose functionality supported by the backend.

---

# 12. UI / UX

The application should look like a real e-commerce site rather than a collection of technical demo screens.

Aim for:

* clean navigation
* responsive layout
* clear hierarchy
* good spacing
* readable typography
* consistent components
* useful feedback
* sensible empty states
* useful loading states
* useful error messages
* mobile-friendly behavior

The design does not need to be extremely elaborate.

Prioritize usability over visual complexity.

---

# 13. Responsive Design

The application must work on:

* desktop
* tablet
* mobile

Do not treat mobile as an afterthought.

Pay particular attention to:

* navigation
* product grids
* product details
* cart
* checkout
* forms
* order history

---

# 14. Loading / Error / Empty States

Every API-driven screen should consider at least:

### Loading

Show an appropriate loading indicator or skeleton.

### Success

Display the requested information clearly.

### Error

Display a useful user-facing message.

Do not expose raw backend errors, stack traces or internal implementation details to users.

### Empty

Examples:

* no products
* empty cart
* no orders
* no search results

Empty states should be intentional UI rather than blank screens.

---

# 15. Forms

Forms should provide:

* client-side validation where useful
* clear labels
* validation messages
* disabled/loading submit states
* useful error handling
* accessible inputs

Client-side validation is for UX.

The backend remains responsible for authoritative validation.

Do not duplicate complicated backend business rules unnecessarily.

---

# 16. API Errors

Handle HTTP errors consistently.

At minimum consider:

* `400`
* `401`
* `403`
* `404`
* `409`
* `422`
* `500`

The exact handling must reflect the actual backend behavior.

Examples:

### 401

The user's session may have expired.

The frontend should update authentication state appropriately.

### 403

The user is authenticated but does not have permission.

Show a suitable message or access-denied state.

### 404

The requested resource does not exist.

### 409

A business conflict occurred.

Show the relevant user-facing explanation where possible.

### 500

Show a generic error.

Never expose internal server details.

---

# 17. Security Principles

This project will eventually be used for beginner penetration-testing exercises.

Therefore, do not deliberately introduce vulnerabilities.

At the same time, do not turn the frontend into an over-engineered security project.

Follow normal good practices.

Examples:

* do not hardcode secrets
* do not commit API keys
* do not expose Stripe secret keys
* do not store passwords
* do not trust frontend authorization
* do not use `dangerouslySetInnerHTML` unless genuinely necessary
* do not insert untrusted HTML
* do not expose internal backend errors
* do not disable browser security mechanisms unnecessarily
* do not implement custom cryptography
* do not invent authentication mechanisms

Important:

The goal is **not** to make the application artificially vulnerable.

The goal is to build the application normally and later test what vulnerabilities or security oversights remain.

---

# 18. Environment Configuration

Use environment variables for environment-specific configuration.

At minimum, expect an API base URL configuration.

Example:

```env
VITE_API_URL=http://localhost:3000
```

The actual variable name may be changed if the selected framework uses a different convention.

Do not commit `.env` files containing secrets.

Provide an `.env.example` file when appropriate.

---

# 19. Backend Integration

The backend is expected to run separately.

Example conceptual setup:

```text
Frontend
http://localhost:5173

        │
        │ HTTP
        ▼

Backend
http://localhost:3000

        │
        ▼

PostgreSQL
```

The frontend should not access PostgreSQL directly.

All application data must go through the backend API.

---

# 20. Development Order

Implement the application in this approximate order:

### Phase 1 — Foundation

* project setup
* routing
* global styles/theme
* API client
* environment configuration
* basic layout
* navigation

### Phase 2 — Authentication

* register
* login
* logout
* current user
* protected UI
* account page

### Phase 3 — Products

* catalog
* product details
* categories
* brands
* product navigation

### Phase 4 — Cart

* cart page
* add to cart
* update quantity
* remove items
* cart totals

### Phase 5 — Checkout

* checkout page
* payment integration
* success state
* failure state

### Phase 6 — Orders

* order history
* order details
* order statuses

### Phase 7 — Polish

* responsive behavior
* loading states
* error states
* empty states
* accessibility improvements
* visual consistency
* performance improvements where justified

---

# 21. Testing

Add appropriate frontend tests where practical.

Prioritize testing important behavior rather than chasing arbitrary coverage percentages.

Important areas include:

* authentication state
* API error handling
* cart operations
* checkout states
* order rendering
* protected routes
* role-based UI

Do not create hundreds of low-value tests.

---

# 22. Code Quality

Keep the codebase clean.

Prefer:

```text
small components
clear names
simple data flow
typed API responses
feature-oriented organization
```

Avoid:

```text
huge components
deep abstraction layers
unnecessary generic utilities
duplicated API logic
magic strings everywhere
dead code
unused dependencies
```

Use TypeScript properly.

Avoid `any` unless there is a specific justified reason.

Do not silence TypeScript or lint errors simply to make the build pass.

---

# 23. Git Workflow

Work in small, logical commits.

Use descriptive commit messages.

Examples:

```text
feat: add authentication flow
feat: add product catalog
feat: add shopping cart
feat: add checkout flow
feat: add order history
fix: handle expired sessions
refactor: simplify API client
```

Do not create enormous commits containing unrelated changes.

Before considering a feature complete:

1. Build the application.
2. Run lint.
3. Run tests if available.
4. Check the relevant UI manually where possible.
5. Fix obvious issues.
6. Commit the work.

---

# 24. Autonomous Work

Codex is expected to work autonomously for substantial periods.

When a task is clear, continue through the necessary implementation steps instead of stopping after every small decision.

If several small implementation decisions are required, choose the simplest reasonable option and continue.

Do not repeatedly ask for permission for routine implementation details.

However, stop and report when a decision genuinely requires changing the backend or contradicts the documented API.

---

# 25. Backend Contract Problems

If you discover something such as:

```text
Frontend requires X
Backend only provides Y
```

do not silently work around it with fake data.

Instead:

1. Confirm the backend behavior.
2. Document the mismatch.
3. Implement everything that can be implemented correctly.
4. Report the backend limitation clearly.

Example:

```text
BACKEND LIMITATION

The current backend does not expose product filtering by brand.

The frontend therefore provides category navigation but does not implement
server-side brand filtering.
```

---

# 26. No Fake Functionality

Do not leave UI controls that pretend to work when they do not.

Avoid:

```text
<button>Pay now</button>
```

with no real payment implementation.

If functionality is not supported yet:

* implement it correctly later, or
* leave a clear non-functional state during development.

Do not simulate successful API responses in production application code.

Mocks may be used only for tests.

---

# 27. Definition of Done

A feature is considered complete when:

* it uses the real backend API
* TypeScript compiles
* lint passes
* relevant tests pass
* loading states exist
* error states exist
* empty states exist where relevant
* the UI works on reasonable desktop/mobile sizes
* no obvious console errors remain
* no secrets are committed
* code is reasonably clean

---

# 28. Final Objective

The finished application should be a complete working e-commerce frontend connected to the existing `pc-store` backend.

The final project should allow a user to:

```text
Register
   ↓
Login
   ↓
Browse products
   ↓
View product
   ↓
Add to cart
   ↓
Modify cart
   ↓
Checkout
   ↓
Pay
   ↓
View order
   ↓
Manage account
```
# 29. Implementation Must Continue When Verification Is Blocked

A development environment may prevent dependency installation, application
execution, browser testing or external-service verification.

These are verification limitations, not necessarily implementation
limitations.

If implementation is possible without runtime verification:

1. Continue implementing the feature.
2. Add required dependencies to package.json.
3. Add required environment variables to .env.example.
4. Add appropriate tests.
5. Update documentation.
6. Do not replace real functionality with fake behavior.
7. Clearly document what could not be executed.

Never leave an implementable feature unfinished solely because the current
environment cannot execute or verify it.

A feature is not "blocked" merely because npm, Vite, Stripe, the browser,
or another external service cannot currently be executed.

The application should feel like a coherent product rather than a collection of disconnected frontend exercises.

After the frontend is complete, the project will undergo a separate security/pentesting phase.
---
**Do not intentionally introduce vulnerabilities for that phase.**

The security testing should evaluate what vulnerabilities naturally remain after normal development and good engineering practices.


# 29. Implementation vs Verification

A feature that cannot currently be executed or verified is not necessarily a feature that cannot be implemented.

If npm, the network, Vite, a browser or an external service prevents verification:

1. Continue implementing all source code that can be implemented.
2. Add required dependencies to package.json.
3. Add environment variables to .env.example.
4. Add meaningful tests.
5. Update documentation.
6. Do not replace real functionality with fake behavior.
7. Report execution limitations separately from implementation status.

A 403 from npm is a verification/environment limitation, not a reason to leave implementable application code unfinished.

# 30. Production Code Must Match Tests

Tests do not prove that a feature is implemented. Before considering a feature complete, inspect the production implementation and confirm that it actually provides the behavior covered by its tests.

The following must remain consistent:

production code -> real API contract -> real UI -> tests

Do not create tests for functionality that is absent from production code merely to make coverage look complete. Do not mark a feature complete only because its test file exists.

# 31. Autonomous Completion

When a task asks for the frontend to be completed, continue through all implementable features and the final consistency audit without stopping after one sub-feature.

Known backend limitations such as missing PaymentIntent query/retry endpoints, missing soft-deleted listings, or production CORS configuration must be documented but must not block unrelated frontend implementation.

Before finishing, inspect the repository for:

- unfinished production features
- placeholder pages
- tests that describe behavior missing from production code
- stale documentation
- dead code and unused dependencies
- loading/error/empty states
- role-based behavior
- responsive behavior

Only stop implementation when all implementable work is complete or a genuine backend contract limitation prevents it.
