import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const createOrder = async (
  req,
  res
) => {
  try {
    const {
      shippingAddress,
      paymentMethod
    } = req.body;

    const cart =
      await Cart.findOne({
        user: req.user._id
      }).populate("items.product");

    if (
      !cart ||
      cart.items.length === 0
    ) {
      return res.status(400).json({
        message: "Your cart is empty"
      });
    }

    const orderItems = [];

    let subtotal = 0;

    for (const item of cart.items) {
      const product =
        await Product.findById(
          item.product._id
        );

      const variant =
        product.variants.id(
          item.variantId
        );

      if (!variant) {
        return res.status(400).json({
          message:
            `Variant unavailable for ${product.name}`
        });
      }

      if (
        variant.stock <
        item.quantity
      ) {
        return res.status(400).json({
          message:
            `Insufficient stock for ${product.name}`
        });
      }

      subtotal +=
        product.price *
        item.quantity;

      orderItems.push({
        product: product._id,
        productName: product.name,
        image: product.image,
        size: variant.size,
        color: variant.color,
        quantity: item.quantity,
        price: product.price
      });
    }

    const shippingFee =
      subtotal >= 10000 ? 0 : 500;

    const total =
      subtotal + shippingFee;

    const order =
      await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        subtotal,
        shippingFee,
        total,
        paymentMethod:
          paymentMethod ||
          "cash_on_delivery",
        paymentStatus:
          paymentMethod === "card_demo"
            ? "paid"
            : "pending"
      });

    for (const item of cart.items) {
      const product =
        await Product.findById(
          item.product._id
        );

      const variant =
        product.variants.id(
          item.variantId
        );

      variant.stock -=
        item.quantity;

      await product.save();
    }

    cart.items = [];

    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find({
        user: req.user._id
      }).sort({
        createdAt: -1
      });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getOrderById = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findOne({
        _id: req.params.id,
        user: req.user._id
      });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export {
  createOrder,
  getMyOrders,
  getOrderById
};