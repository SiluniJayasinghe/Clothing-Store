import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id
    }).populate("items.product");

    if (!cart) {
      return res.json({
        items: []
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const {
      productId,
      variantId,
      quantity = 1
    } = req.body;

    const product =
      await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const variant =
      product.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({
        message:
          "Product variant not found"
      });
    }

    if (variant.stock < quantity) {
      return res.status(400).json({
        message:
          "Requested quantity is unavailable"
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
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
        existingItem.quantity +
        Number(quantity);

      if (newQuantity > variant.stock) {
        return res.status(400).json({
          message:
            "Not enough stock available"
        });
      }

      existingItem.quantity =
        newQuantity;
    } else {
      cart.items.push({
        product: product._id,
        variantId: variant._id,
        size: variant.size,
        color: variant.color,
        quantity
      });
    }

    await cart.save();

    cart = await cart.populate(
      "items.product"
    );

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateCartItem = async (
  req,
  res
) => {
  try {
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        message:
          "Quantity must be at least 1"
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id
    });

    const item =
      cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found"
      });
    }

    const product =
      await Product.findById(
        item.product
      );

    const variant =
      product.variants.id(
        item.variantId
      );

    if (quantity > variant.stock) {
      return res.status(400).json({
        message:
          "Not enough stock available"
      });
    }

    item.quantity = quantity;

    await cart.save();

    await cart.populate(
      "items.product"
    );

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const removeCartItem = async (
  req,
  res
) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id
    });

    cart.items.pull(req.params.itemId);

    await cart.save();

    await cart.populate(
      "items.product"
    );

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
};