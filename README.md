# Clothing Store E-Commerce Web Application

A full-stack customer-facing e-commerce web application developed using the **MERN stack** as part of the Web Application Development module.

The application allows customers to create accounts, browse clothing products, search and filter products, select product variants, manage a shopping cart and wishlist, place orders, and manage their profile.

Administrative functionality is intentionally excluded from the current project scope. Product data is populated into MongoDB using a database seed script.

---

## Project Overview

The Clothing Store application is designed to provide customers with a simple and responsive online shopping experience.

The system consists of:

- A React.js frontend
- A Node.js and Express.js REST API
- A MongoDB database
- JWT-based authentication
- Persistent carts, wishlists and orders

The application follows a client-server architecture where the React frontend communicates with the Express backend through REST API endpoints.

---

## Technology Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- React Context API
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- Mongoose
- JSON Web Tokens
- bcryptjs
- CORS
- Helmet
- Morgan
- dotenv

### Database

- MongoDB
- MongoDB Compass

### Development Tools

- Visual Studio Code
- Git
- GitHub
- npm

---

## Main Features

### User Authentication

Users can:

- Register a new customer account
- Login using email and password
- Logout from the application
- Stay authenticated using JSON Web Tokens
- Access protected customer pages after authentication

Passwords are hashed using `bcryptjs` before being stored in MongoDB.

---

### Product Catalogue

Customers can:

- View all available clothing products
- Browse different product categories
- Search products by name
- Filter products by category
- Sort products by price
- Sort products by newest products
- View featured products on the home page

---

### Product Details

Each product has a dedicated product details page.

Customers can view:

- Product name
- Description
- Category
- Price
- Product image
- Available sizes
- Available colours
- Available stock

Customers must select a product variant before adding the product to the shopping cart.

---

### Clothing Variants

Products support different variations based on:

- Size
- Colour
- Stock quantity

Example:

```text
Classic Black T-Shirt
│
├── Small / Black
├── Medium / Black
└── Large / Black
