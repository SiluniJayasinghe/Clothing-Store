import mongoose from "mongoose";

import Product from "../models/Product.js";
import Review from "../models/Review.js";

const validateReviewInput = (rating, comment) => {
  const numericRating = Number(rating);

  if (
    rating === undefined ||
    rating === null ||
    rating === "" ||
    (typeof rating !== "number" &&
      typeof rating !== "string") ||
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    return {
      error: "Rating must be a whole number from 1 to 5"
    };
  }

  if (
    typeof comment !== "string" ||
    !comment.trim()
  ) {
    return {
      error: "Comment is required"
    };
  }

  if (comment.trim().length > 1000) {
    return {
      error: "Comment must be 1000 characters or fewer"
    };
  }

  return {
    rating: numericRating,
    comment: comment.trim()
  };
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const reviews = await Review.find({
      product: productId
    })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });

    return res.json(reviews);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (
      typeof productId !== "string" ||
      !mongoose.isValidObjectId(productId)
    ) {
      return res.status(400).json({
        message: "A valid product ID is required"
      });
    }

    const input = validateReviewInput(rating, comment);

    if (input.error) {
      return res.status(400).json({
        message: input.error
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: input.rating,
      comment: input.comment
    });

    await review.populate("user", "firstName lastName");

    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({
        message: "Invalid review ID"
      });
    }

    const input = validateReviewInput(
      req.body.rating,
      req.body.comment
    );

    if (input.error) {
      return res.status(400).json({
        message: input.error
      });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only edit your own reviews"
      });
    }

    review.rating = input.rating;
    review.comment = input.comment;

    await review.save();
    await review.populate("user", "firstName lastName");

    return res.json(review);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({
        message: "Invalid review ID"
      });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own reviews"
      });
    }

    await review.deleteOne();

    return res.json({
      message: "Review deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

export {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
};
