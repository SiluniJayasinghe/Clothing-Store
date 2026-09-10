import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must contain at least 6 characters"
      });
    }

    const existingUser =
      await User.findOne({
        email: email.toLowerCase()
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "An account with this email already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await Cart.create({
      user: user._id,
      items: []
    });

    await Wishlist.create({
      user: user._id,
      products: []
    });

    const token =
      generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password"
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        message:
          "Invalid email or password"
      });
    }

    const token =
      generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getCurrentUser = async (
  req,
  res
) => {
  res.json(req.user);
};

export {
  register,
  login,
  getCurrentUser
};