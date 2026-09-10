import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import {
  notFound,
  errorHandler
} from "./middleware/errorMiddleware.js";

const app = express();

const clientUrl = process.env.CLIENT_URL;

if (!clientUrl) {
  throw new Error(
    "CLIENT_URL is not defined in the environment variables"
  );
}

app.use(
  cors({
    origin: clientUrl,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

app.get("/", (req, res) => {
  res.json({
    message:
      "Clothing Store API is running"
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/wishlist",
  wishlistRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(notFound);

app.use(errorHandler);

export default app;