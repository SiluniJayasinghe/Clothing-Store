import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

const getWishlist = async (
  req,
  res
) => {
  try {
    let wishlist =
      await Wishlist.findOne({
        user: req.user._id
      }).populate("products");

    if (!wishlist) {
      wishlist =
        await Wishlist.create({
          user: req.user._id,
          products: []
        });
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const addToWishlist = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.productId
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    let wishlist =
      await Wishlist.findOne({
        user: req.user._id
      });

    if (!wishlist) {
      wishlist =
        await Wishlist.create({
          user: req.user._id,
          products: []
        });
    }

    const alreadyExists =
      wishlist.products.some(
        (id) =>
          id.toString() ===
          product._id.toString()
      );

    if (!alreadyExists) {
      wishlist.products.push(
        product._id
      );

      await wishlist.save();
    }

    await wishlist.populate(
      "products"
    );

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const removeFromWishlist = async (
  req,
  res
) => {
  try {
    const wishlist =
      await Wishlist.findOne({
        user: req.user._id
      });

    wishlist.products =
      wishlist.products.filter(
        (id) =>
          id.toString() !==
          req.params.productId
      );

    await wishlist.save();

    await wishlist.populate(
      "products"
    );

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};