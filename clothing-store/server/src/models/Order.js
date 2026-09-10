import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  productName: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  size: {
    type: String,
    required: true
  },

  color: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  price: {
    type: Number,
    required: true
  }
});

const shippingAddressSchema =
  new mongoose.Schema(
    {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      district: String,
      postalCode: String,
      country: String
    },
    {
      _id: false
    }
  );

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [orderItemSchema],

    shippingAddress: shippingAddressSchema,

    subtotal: {
      type: Number,
      required: true
    },

    shippingFee: {
      type: Number,
      default: 0
    },

    total: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "card_demo"],
      default: "cash_on_delivery"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;