import Product from "../models/Product.js";

const getProducts = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      sort = ""
    } = req.query;

    const filter = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i"
      };
    }

    if (category) {
      filter.category = category;
    }

    let query = Product.find(filter);

    if (sort === "price-low") {
      query = query.sort({
        price: 1
      });
    }

    if (sort === "price-high") {
      query = query.sort({
        price: -1
      });
    }

    if (sort === "newest") {
      query = query.sort({
        createdAt: -1
      });
    }

    const products = await query;

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getProductById = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getFeaturedProducts = async (
  req,
  res
) => {
  try {
    const products =
      await Product.find({
        featured: true
      }).limit(4);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export {
  getProducts,
  getProductById,
  getFeaturedProducts
};