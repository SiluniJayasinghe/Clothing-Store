# Blush & Bloom

Blush & Bloom is a full-stack fashion e-commerce web application for a customer-facing clothing store. The project was built as a Web Application Development assignment and uses a React frontend, Express API, and MongoDB database.

The app allows users to browse products, search and filter listings, view product details, add items to a cart or wishlist, checkout, manage orders, and update their profile. It is designed as a polished storefront experience for women’s fashion with a modern UI and protected customer routes.

---

## Project Overview

This repository contains a complete storefront application organized into two main parts:

- `clothing-store/client` – React + Vite frontend
- `clothing-store/server` – Node.js + Express API and MongoDB integration

The frontend communicates with the backend through REST endpoints, while the server handles authentication, product queries, cart operations, wishlist actions, order creation, and user profile management.

---

## Features

### Customer authentication

- User registration
- Login and logout
- JWT-based protected routes
- Password hashing with `bcryptjs`
- Current user retrieval via authenticated API requests

### Product catalog and browsing

- Product listing page
- Search by product name
- Filter by category
- Sorting by newest or price
- Featured product sections on the homepage
- Category highlights and curated styling cards

### Product details and variants

- Individual product detail pages
- Product description, price, category, and inventory information
- Size and colour variants
- Variant-specific images and stock handling

### Shopping experience

- Add items to shopping cart
- Update item quantity
- Remove products from cart
- Free-delivery progress indicator
- Checkout flow with order summary

### Wishlist and orders

- Save favourite products to a wishlist
- View and manage wishlist items
- Place orders from the cart
- View order history and current user orders
- User profile page with saved account details

### Store branding and UX

- Responsive storefront layout
- Mobile-friendly navigation drawer
- Hero banner and curated “shop the look” pages
- “Fresh styles for every mood” storefront branding

---

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS custom styling
- JavaScript

### Backend

- Node.js
- Express.js
- Mongoose
- JWT
- bcryptjs
- CORS
- Helmet
- Morgan
- dotenv

### Database

- MongoDB

### Development tools

- Git
- GitHub
- Visual Studio Code
- npm

---

## Project Structure

```text
WAD project test/
├── README.md
└── clothing-store/
    ├── client/
    │   ├── public/
    │   ├── src/
    │   ├── index.html
    │   ├── package.json
    │   └── vite.config.*
    └── server/
        ├── src/
        ├── .env.example
        └── package.json
```

### Client app

The frontend is under `clothing-store/client/src` and includes pages such as:

- Home
- Shop products
- Product details
- Cart
- Wishlist
- Checkout
- Orders
- Profile
- Login/Register

### Server app

The backend is under `clothing-store/server/src` and includes:

- `app.js` – Express app configuration
- `server.js` – server startup and database connection
- `config/db.js` – MongoDB connection setup
- `controllers/` – auth, product, cart, wishlist, order, and user logic
- `routes/` – API route definitions
- `models/` – Mongoose schemas
- `middleware/` – auth and error handling
- `seed.js` – product data seeding script

---

## Setup and Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd "WAD project test"
```

### 2. Install frontend dependencies

```bash
cd clothing-store/client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside `clothing-store/server` based on `.env.example`.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
```

### 5. Seed the database

```bash
npm run seed
```

This loads clothing product data from the public product assets into MongoDB.

### 6. Run the app

Start the backend:

```bash
cd clothing-store/server
npm run dev
```

Start the frontend in a second terminal:

```bash
cd clothing-store/client
npm run dev
```

Then open the app in the browser at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
npm run dev
npm run start
npm run seed
```

---

## Current Scope

This project focuses on customer-side e-commerce functionality and intentionally does not include an admin dashboard or back-office management system. The primary goal is to provide a complete shopping experience for customers with a clean storefront, product discovery flow, and order management.

---

## Notes

- The app brand name is **Blush & Bloom**.
- Product images are stored in the frontend public assets and are used to seed the MongoDB catalog.
- The app uses JWT protection on authenticated routes such as cart, wishlist, profile, orders, and checkout-related actions.

---

## License

This project is for academic learning and coursework purposes unless otherwise specified by the repository owner.
