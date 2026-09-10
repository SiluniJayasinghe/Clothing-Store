import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    phone: {
      type: String,
      default: ""
    },

    address: {
      addressLine1: {
        type: String,
        default: ""
      },

      addressLine2: {
        type: String,
        default: ""
      },

      city: {
        type: String,
        default: ""
      },

      district: {
        type: String,
        default: ""
      },

      postalCode: {
        type: String,
        default: ""
      },

      country: {
        type: String,
        default: "Sri Lanka"
      }
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;