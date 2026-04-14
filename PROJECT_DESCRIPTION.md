# CraftMarket - Key Features

A full-stack e-commerce platform connecting Sri Lankan artisans with customers. Built with React 19, Express.js, MongoDB, and Tailwind CSS.

## Features

- **User Authentication** — Email-verified registration, JWT sessions, password reset, role-based access (customer/creator/admin)
- **Product Browsing** — Search, category & price filters, sorting, pagination, image gallery with thumbnails
- **Shopping Cart** — Persistent cart with +/- quantity stepper, real-time totals
- **Wishlist** — Heart icon on product cards, dedicated wishlist page
- **Checkout & Payments** — PayHere payment gateway (Sri Lankan), guest + authenticated checkout, inline form validation
- **Order Management** — Order tracking with status updates, cancellation with stock restoration
- **Reviews & Ratings** — Purchase-verified star ratings and comments
- **Creator Dashboard** — Product CRUD with multi-image upload, sales stats, order management
- **Admin Dashboard** — User/product/order/category management, contact message inbox, platform analytics
- **Contact Form** — Stored in database and emailed to admin
- **Responsive UI** — Mobile-first design, smooth transitions, hover effects, reusable components (StatusBadge, Modal)
- **Security** — Helmet, rate limiting, bcrypt hashing, CORS, environment-driven configuration
