import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true
  },

  color: {
    type: String,
    required: true
  },

  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    image: {
      type: String,
      required: true
    },

    featured: {
      type: Boolean,
      default: false
    },

    variants: [variantSchema]
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;