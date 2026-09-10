import dotenv from "dotenv";

dotenv.config();

import connectDB from "./config/db.js";
import Product from "./models/Product.js";

const products = [
  {
    name: "Classic Black T-Shirt",

    description:
      "Comfortable cotton T-shirt suitable for casual everyday wear.",

    category: "T-Shirts",

    price: 2500,

    image:
      "https://placehold.co/600x750?text=Black+T-Shirt",

    featured: true,

    variants: [
      {
        size: "S",
        color: "Black",
        stock: 10
      },
      {
        size: "M",
        color: "Black",
        stock: 15
      },
      {
        size: "L",
        color: "Black",
        stock: 10
      }
    ]
  },

  {
    name: "Oversized White T-Shirt",

    description:
      "Relaxed oversized cotton T-shirt with a minimal design.",

    category: "T-Shirts",

    price: 2900,

    image:
      "https://placehold.co/600x750?text=White+T-Shirt",

    featured: true,

    variants: [
      {
        size: "S",
        color: "White",
        stock: 10
      },
      {
        size: "M",
        color: "White",
        stock: 12
      },
      {
        size: "L",
        color: "White",
        stock: 7
      }
    ]
  },

  {
    name: "Blue Denim Jeans",

    description:
      "Classic blue denim jeans designed for everyday comfort.",

    category: "Jeans",

    price: 5500,

    image:
      "https://placehold.co/600x750?text=Blue+Jeans",

    featured: true,

    variants: [
      {
        size: "30",
        color: "Blue",
        stock: 8
      },
      {
        size: "32",
        color: "Blue",
        stock: 12
      },
      {
        size: "34",
        color: "Blue",
        stock: 10
      }
    ]
  },

  {
    name: "Grey Hoodie",

    description:
      "Soft fleece hoodie ideal for casual and cool-weather outfits.",

    category: "Hoodies",

    price: 6500,

    image:
      "https://placehold.co/600x750?text=Grey+Hoodie",

    featured: true,

    variants: [
      {
        size: "S",
        color: "Grey",
        stock: 5
      },
      {
        size: "M",
        color: "Grey",
        stock: 9
      },
      {
        size: "L",
        color: "Grey",
        stock: 7
      }
    ]
  },

  {
    name: "Casual Checked Shirt",

    description:
      "Smart-casual checked shirt with a regular fit.",

    category: "Shirts",

    price: 3900,

    image:
      "https://placehold.co/600x750?text=Checked+Shirt",

    featured: false,

    variants: [
      {
        size: "S",
        color: "Blue",
        stock: 8
      },
      {
        size: "M",
        color: "Blue",
        stock: 11
      },
      {
        size: "L",
        color: "Blue",
        stock: 6
      }
    ]
  },

  {
    name: "Black Joggers",

    description:
      "Comfortable slim-fit joggers for casual wear.",

    category: "Pants",

    price: 4200,

    image:
      "https://placehold.co/600x750?text=Black+Joggers",

    featured: false,

    variants: [
      {
        size: "S",
        color: "Black",
        stock: 7
      },
      {
        size: "M",
        color: "Black",
        stock: 10
      },
      {
        size: "L",
        color: "Black",
        stock: 6
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    await Product.insertMany(
      products
    );

    console.log(
      "Products successfully seeded"
    );

    process.exit();
  } catch (error) {
    console.error(
      "Seed error:",
      error
    );

    process.exit(1);
  }
};

seedDatabase();