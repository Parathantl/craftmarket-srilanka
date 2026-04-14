# CraftMarket - Sri Lankan Handcrafts E-Commerce Platform

## Project Overview

CraftMarket is a full-stack e-commerce platform purpose-built to connect Sri Lankan artisans with customers who value authentic, handcrafted products. The platform serves three distinct user roles — customers, creators (sellers), and administrators — each with tailored dashboards and capabilities. The application handles the complete commerce lifecycle: product discovery, cart management, secure checkout with a local payment gateway (PayHere), order tracking, and post-purchase reviews.

The platform was built to address a real gap in the Sri Lankan market — most local artisans lack the technical resources to sell online. CraftMarket provides them with a low-barrier storefront where they can list products with multiple images, manage inventory, and track sales, while customers get a modern shopping experience with wishlist functionality, verified reviews, and secure payments.

---

## Key Features

### Authentication & Security
- **Email-verified registration** with role selection (Customer or Creator) — accounts remain inactive until email confirmation via tokenized links
- **JWT-based authentication** with secure token management and automatic session validation on app load
- **Password management** — forgot password flow with time-limited reset tokens sent via email, in-app password change with current password verification
- **Role-based access control** — three tiers (user, creator, admin) enforced at both route middleware and frontend route guard levels
- **Security hardening** — Helmet for HTTP headers, bcrypt (12 rounds) for password hashing, express-rate-limit to prevent brute force, CORS restricted to configured origins only in production

### Product Management
- **Multi-image upload** — creators can upload up to 5 product images (5MB each) via Multer, served as static assets with cross-origin headers
- **Rich filtering** — customers can search by keyword (title + description), filter by category and price range, and sort by price, name, or date
- **Paginated browsing** — server-side pagination (12 items/page) with total count for seamless navigation
- **Inventory control** — real-time stock tracking, automatic stock deduction on order placement, stock restoration on cancellation
- **Product lifecycle** — creators can activate/deactivate listings; admins can override from the admin dashboard

### Shopping Experience
- **Persistent cart** — cart state stored in localStorage with real-time total calculation, survives browser refresh and session changes
- **Quantity stepper** — intuitive +/- buttons (replacing traditional dropdowns) with stock-aware limits on both product detail and cart pages
- **Wishlist/Favorites** — heart icon overlay on product cards (appears on hover), dedicated wishlist page, toggle from product detail; backed by user model's favorites array
- **Image gallery** — product detail page shows clickable thumbnail strip for multi-image browsing with active state highlighting
- **Breadcrumb navigation** — contextual breadcrumbs on product detail (Home > Products > Category > Product Name)

### Checkout & Payments
- **PayHere integration** — Sri Lanka's leading payment gateway, with MD5 signature verification for webhook security, sandbox/production mode toggle via environment variables
- **Server-side hash generation** — payment hash computed on the backend to prevent client-side tampering of amount or order details
- **Guest + authenticated checkout** — guest orders collect customer info inline; authenticated users get pre-filled forms from their profile
- **Inline form validation** — real-time field validation on blur with red borders, error messages below inputs, and required field asterisks
- **Order lifecycle** — status progression (pending → confirmed → shipped → delivered) with cancellation support and automatic stock restoration

### Reviews & Ratings
- **Purchase-verified reviews** — only customers with a delivered/confirmed/shipped order for a product can leave a review, preventing fake reviews
- **Star ratings** — interactive 5-star rating component with click-to-select, used for both submission and display
- **Aggregate statistics** — average rating and review count calculated via MongoDB aggregation, displayed on the product detail page
- **Review management** — users can delete their own reviews; admins can delete any review

### Creator Dashboard
- **Sales overview** — stat cards showing total orders, revenue, active products, and pending orders
- **Product CRUD** — add products with drag-and-drop multi-image upload, edit details, toggle active/inactive status, delete with confirmation
- **Order management** — view orders containing the creator's products, delete unpaid pending orders with automatic stock restoration
- **Category-aware forms** — product forms dynamically load available categories from the database

### Admin Dashboard
- **Platform analytics** — aggregated stats (users, products, orders, revenue) with monthly revenue breakdown and recent activity feeds
- **User management** — searchable user table with role filtering, activate/deactivate accounts, delete users (blocked if they have products/orders)
- **Product oversight** — search and toggle product status across all creators
- **Order management** — view all orders with status filter, update order status via inline dropdown
- **Category CRUD** — create, edit, delete categories (deletion blocked if products exist in category)
- **Contact messages** — inbox-style view of contact form submissions with read/unread tracking, message detail panel, delete capability

### Contact System
- **Dual delivery** — contact form submissions are both stored in MongoDB (for admin dashboard viewing) and forwarded via email to the configured admin address
- **HTML email formatting** — admin receives a formatted email with sender details, subject, and message body

### UI/UX Polish
- **Global transitions** — CSS-level transition rule applied to all interactive elements for smooth hover/focus effects across the entire app
- **Product card hover effects** — shadow elevation, image zoom (scale 1.05), dark overlay, and heart icon fade-in on hover
- **Reusable components** — StatusBadge (consistent color-coded badges for 15+ status types) and Modal (backdrop + panel + close) extracted to reduce duplication
- **Responsive design** — mobile-first with Tailwind CSS breakpoints; mobile nav includes cart badge count and wishlist link
- **Empty states** — SVG illustrations with descriptive text and action buttons for empty cart, no search results, and product not found
- **Toast notifications** — non-blocking success/error feedback via react-hot-toast for all user actions

---

## Technical Architecture

### Frontend Architecture
The frontend follows a **Context + Reducer** pattern for state management, avoiding external state libraries:
- **AuthContext** — manages JWT token lifecycle, user session, login/logout/register flows with automatic token refresh on app load
- **ProductContext** — handles product CRUD operations, filtering, pagination, and category fetching with optimistic UI updates
- **CartContext** — manages cart state with localStorage persistence, supporting add/remove/update/clear operations

Routing uses **React Router v7** with nested route guards:
- `PrivateRoute` — redirects unauthenticated users to login
- `CreatorRoute` — restricts access to creator-role users
- `AdminRoute` — restricts access to admin-role users; the admin dashboard uses nested `<Routes>` for tab-based navigation (Overview, Users, Products, Orders, Categories, Messages)

### Backend Architecture
The Express.js backend follows a **modular route + middleware** pattern:
- **7 Mongoose models** — User, Product, Order, Payment, Category, Review, Contact, Token
- **7 route modules** — auth (+ favorites), products, orders, payments, admin, reviews, contact
- **Middleware chain** — Helmet → CORS → rate limiter → body parser → route-level JWT auth → role authorization
- **File handling** — Multer processes multipart uploads, stores files to disk, and serves them via Express static middleware with CORS headers

### Database Design
MongoDB with Mongoose ODM, featuring:
- **Reference-based relationships** — products reference creators and categories; orders reference users and products; reviews reference users and products
- **Embedded sub-documents** — order products (product + quantity), customer info for guest orders, tracking info
- **Indexes** — Token model uses TTL index for automatic expiry cleanup of verification/reset tokens
- **Aggregation pipelines** — used for revenue calculations, average rating computation, and monthly sales reports

---

## Challenges & Solutions

### Challenge 1: PayHere Payment Security
**Problem:** PayHere requires MD5 signature verification for webhook callbacks to prevent payment tampering. The hash computation involves the merchant secret, which must never be exposed to the client.

**Solution:** Implemented a server-side hash generation endpoint (`/api/payments/payhere-hash`) that computes the MD5 signature on the backend. The frontend requests the hash before initiating payment, and the webhook handler independently verifies the callback signature against the stored secret. This keeps the merchant secret entirely server-side while maintaining PayHere's security requirements.

### Challenge 2: Purchase-Verified Reviews
**Problem:** Allowing any user to review any product would undermine trust. Needed to ensure only customers who actually purchased and received a product can leave reviews, while preventing duplicate reviews.

**Solution:** The review creation endpoint performs two database queries before allowing a review: (1) checks for an order containing the product with a qualifying status (delivered, confirmed, or shipped) linked to the requesting user, and (2) checks for an existing review by the same user on the same product. This ensures review authenticity without requiring manual moderation.

### Challenge 3: Guest vs. Authenticated Checkout
**Problem:** The platform needed to support both guest checkout (for conversion) and authenticated checkout (for order history), using the same order model and payment flow.

**Solution:** The order model uses an optional `user` reference — when present, the order is linked to an account; when absent, a `customerInfo` embedded document stores guest details (name, email, phone). The `optionalAuthenticate` middleware attempts JWT verification but doesn't block the request if no token is provided, allowing the same endpoint to serve both flows.

### Challenge 4: Real-Time Stock Management
**Problem:** Multiple users could potentially purchase the last item simultaneously, leading to overselling. Stock needed to be decremented atomically on order creation and restored on cancellation.

**Solution:** Stock validation happens at order creation time with individual product checks before any modifications. Stock is decremented using MongoDB's `$inc: { stock: -quantity }` atomic operator immediately after order creation. On cancellation, stock is restored using the same atomic operation. While not a distributed lock, this approach prevents negative stock in typical usage patterns.

### Challenge 5: Environment-Specific Configuration
**Problem:** The application needed to work seamlessly across local development, staging, and production environments without code changes or hardcoded URLs.

**Solution:** All environment-specific values (API URLs, payment gateway credentials, email config, CORS origins, database URI) are externalized to environment variables. The frontend uses Vite's `import.meta.env.VITE_*` pattern with localhost fallbacks for development. The backend CORS configuration dynamically includes local dev origins only when `NODE_ENV` is not `production`, and supports additional origins via the `CORS_ORIGINS` comma-separated variable.

### Challenge 6: Consistent UI Across 17 Pages
**Problem:** With 17 page components and multiple shared patterns (status badges, modals, product cards), maintaining visual consistency became increasingly difficult as features were added.

**Solution:** Implemented a layered approach: (1) global CSS transition rules in `index.css` that apply to all interactive elements automatically, (2) extracted `StatusBadge` component with a centralized color map for 15+ status types, replacing 27 inline badge implementations, (3) extracted `Modal` component for consistent overlay behavior, and (4) standardized product card markup across Home, Products, and Wishlist pages with identical hover effects and layout.

---

## Technology Choices & Rationale

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend framework | React 19 | Component-based architecture, large ecosystem, hooks for state management |
| Build tool | Vite 7 | Fast HMR, native ESM support, significantly faster builds than CRA/Webpack |
| Styling | Tailwind CSS 4 | Utility-first approach enables rapid UI development without CSS file proliferation |
| State management | React Context + useReducer | Sufficient for this app's complexity; avoids Redux boilerplate for 3 global stores |
| Backend | Express.js | Minimal, unopinionated, well-suited for REST APIs with middleware composition |
| Database | MongoDB + Mongoose | Flexible document model fits e-commerce's varied product schemas; Mongoose provides schema validation |
| Authentication | JWT | Stateless auth suitable for SPA architecture; no server-side session storage needed |
| Payment gateway | PayHere | Sri Lanka's most widely adopted payment processor; supports card, bank transfer, and mobile payments |
| Email | Nodemailer + Gmail | Zero-cost for development/MVP; swappable to SendGrid/SES for production scale |
| File uploads | Multer | Standard Express middleware for multipart/form-data; stores to disk for simplicity |

---

## Future Enhancements
- Creator replies to customer reviews
- Real-time order notifications via WebSocket
- Advanced analytics dashboard with charts (Chart.js/Recharts)
- Multi-language support (Sinhala, Tamil, English)
- Product variant support (size, color)
- Shipping cost calculation based on delivery zone
- Integration with Sri Lanka Post tracking API
