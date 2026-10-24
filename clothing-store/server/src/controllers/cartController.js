import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const getCart =
  async (
    req,
    res
  ) => {
    try {
      const cart =
        await Cart.findOne({
          user:
            req.user._id
        }).populate(
          "items.product"
        );

      if (!cart) {
        return res.json({
          items: []
        });
      }

      res.json(cart);
    } catch (error) {
      res.status(500).json({
        message:
          error.message
      });
    }
  };

const addToCart =
  async (
    req,
    res
  ) => {
    try {
      const {
        productId,
        variantId,
        quantity = 1
      } = req.body;

      const numericQuantity =
        Number(quantity);

      if (
        !productId ||
        !variantId
      ) {
        return res
          .status(400)
          .json({
            message:
              "Product and variant are required."
          });
      }

      if (
        !Number.isInteger(
          numericQuantity
        ) ||
        numericQuantity <
          1
      ) {
        return res
          .status(400)
          .json({
            message:
              "Quantity must be at least 1."
          });
      }

      const product =
        await Product.findById(
          productId
        );

      if (!product) {
        return res
          .status(404)
          .json({
            message:
              "Product not found"
          });
      }

      const variant =
        product.variants.id(
          variantId
        );

      if (!variant) {
        return res
          .status(404)
          .json({
            message:
              "Product option not found"
          });
      }

      if (
        variant.stock <
        numericQuantity
      ) {
        return res
          .status(400)
          .json({
            message:
              "Requested quantity is unavailable."
          });
      }

      let cart =
        await Cart.findOne({
          user:
            req.user._id
        });

      if (!cart) {
        cart =
          await Cart.create({
            user:
              req.user._id,

            items: []
          });
      }

      const existingItem =
        cart.items.find(
          (item) =>
            item.product.toString() ===
              productId &&
            item.variantId.toString() ===
              variantId
        );

      if (existingItem) {
        const newQuantity =
          existingItem
            .quantity +
          numericQuantity;

        if (
          newQuantity >
          variant.stock
        ) {
          return res
            .status(400)
            .json({
              message:
                "Not enough stock available."
            });
        }

        existingItem.quantity =
          newQuantity;

        /*
        | Update image too in case catalogue changed.
        */

        existingItem.image =
          variant.image ||
          product.image;
      } else {
        cart.items.push({
          product:
            product._id,

          variantId:
            variant._id,

          size:
            variant.size,

          color:
            variant.color,

          image:
            variant.image ||
            product.image,

          quantity:
            numericQuantity
        });
      }

      await cart.save();

      await cart.populate(
        "items.product"
      );

      res.json(cart);
    } catch (error) {
      res.status(500).json({
        message:
          error.message
      });
    }
  };

const updateCartItem =
  async (
    req,
    res
  ) => {
    try {
      const quantity =
        Number(
          req.body.quantity
        );

      if (
        !Number.isInteger(
          quantity
        ) ||
        quantity <
          1
      ) {
        return res
          .status(400)
          .json({
            message:
              "Quantity must be at least 1."
          });
      }

      const cart =
        await Cart.findOne({
          user:
            req.user._id
        });

      if (!cart) {
        return res
          .status(404)
          .json({
            message:
              "Cart not found"
          });
      }

      const item =
        cart.items.id(
          req.params.itemId
        );

      if (!item) {
        return res
          .status(404)
          .json({
            message:
              "Cart item not found"
          });
      }

      const product =
        await Product.findById(
          item.product
        );

      if (!product) {
        return res
          .status(404)
          .json({
            message:
              "Product no longer exists"
          });
      }

      const variant =
        product.variants.id(
          item.variantId
        );

      if (!variant) {
        return res
          .status(404)
          .json({
            message:
              "Selected product option no longer exists"
          });
      }

      if (
        quantity >
        variant.stock
      ) {
        return res
          .status(400)
          .json({
            message:
              "Not enough stock available"
          });
      }

      item.quantity =
        quantity;

      item.image =
        variant.image ||
        product.image;

      await cart.save();

      await cart.populate(
        "items.product"
      );

      res.json(cart);
    } catch (error) {
      res.status(500).json({
        message:
          error.message
      });
    }
  };

const removeCartItem =
  async (
    req,
    res
  ) => {
    try {
      const cart =
        await Cart.findOne({
          user:
            req.user._id
        });

      if (!cart) {
        return res
          .status(404)
          .json({
            message:
              "Cart not found"
          });
      }

      cart.items.pull(
        req.params.itemId
      );

      await cart.save();

      await cart.populate(
        "items.product"
      );

      res.json(cart);
    } catch (error) {
      res.status(500).json({
        message:
          error.message
      });
    }
  };

export {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
};