import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createReview,
  deleteReview,
  getProductReviews,
  updateReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.get(
  "/product/:productId",
  getProductReviews
);

router.post(
  "/",
  protect,
  createReview
);

router.put(
  "/:reviewId",
  protect,
  updateReview
);

router.delete(
  "/:reviewId",
  protect,
  deleteReview
);

export default router;
