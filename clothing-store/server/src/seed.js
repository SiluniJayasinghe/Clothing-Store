import "dotenv/config";

import fs from "fs";
import path from "path";

import {
  fileURLToPath
} from "url";

import connectDB from "./config/db.js";

import Product from "./models/Product.js";
import Cart from "./models/Cart.js";
import Wishlist from "./models/Wishlist.js";

import {
  CATEGORY_CONFIG,
  FEATURED_PRODUCTS,
  SKIP_FOLDERS
} from "./data/catalogConfig.js";

/*
|--------------------------------------------------------------------------
| Current file locations
|--------------------------------------------------------------------------
*/

const __filename =
  fileURLToPath(
    import.meta.url
  );

const __dirname =
  path.dirname(
    __filename
  );

/*
|--------------------------------------------------------------------------
| products folder
|--------------------------------------------------------------------------
|
| server/src/seed.js
|        ↓
| go up two levels
|        ↓
| clothing-store/
|        ↓
| client/public/products
|
*/

const PRODUCTS_DIRECTORY =
  path.resolve(
    __dirname,
    "../../client/public/products"
  );

/*
|--------------------------------------------------------------------------
| Utility functions
|--------------------------------------------------------------------------
*/

const normalizeKey = (
  value
) =>
  value
    .trim()
    .toLowerCase()
    .replace(
      /[_\s]+/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    );

const titleCase = (
  value
) =>
  value
    .replace(
      /-/g,
      " "
    )
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );

const createProductName = (
  value
) => {
  let name =
    titleCase(value);

  name = name.replace(
    /\bT Shirt\b/g,
    "T-Shirt"
  );

  name = name.replace(
    /\bV Neck\b/g,
    "V-Neck"
  );

  name = name.replace(
    /\bOff Shoulder\b/g,
    "Off-Shoulder"
  );

  name = name.replace(
    /\bHigh Neck\b/g,
    "High-Neck"
  );

  return name;
};

const createColorName = (
  descriptor,
  number,
  totalImages
) => {
  if (descriptor) {
    return titleCase(
      descriptor
    );
  }

  if (totalImages === 1) {
    return "Default";
  }

  return `Shade ${number}`;
};

/*
|--------------------------------------------------------------------------
| Parse image filename
|--------------------------------------------------------------------------
|
| Example:
|
| bell-sleeve-dress 1.png
|
| becomes:
|
| groupName = bell-sleeve-dress
| order = 1
|
|
| Example:
|
| slim-fit-stripe-t-shirt 1 - LIGHT-BLUE.png
|
| becomes:
|
| groupName = slim-fit-stripe-t-shirt
| order = 1
| descriptor = LIGHT-BLUE
|
*/

const parseFileName = (
  fileName
) => {
  const extension =
    path.extname(
      fileName
    );

  const name =
    fileName
      .slice(
        0,
        -extension.length
      )
      .trim();

  const match =
    name.match(
      /^(.*?)(?:\s+(\d+))(?:\s*-\s*(.+))?$/
    );

  if (match) {
    return {
      groupName:
        match[1].trim(),

      order:
        Number(
          match[2]
        ),

      descriptor:
        match[3]
          ?.trim() ||
        ""
    };
  }

  return {
    groupName:
      name,

    order: 1,

    descriptor: ""
  };
};

/*
|--------------------------------------------------------------------------
| Convert local filename into browser URL
|--------------------------------------------------------------------------
*/

const createPublicImageUrl = (
  categoryFolder,
  fileName
) => {
  const categoryPart =
    encodeURIComponent(
      categoryFolder
    );

  const filePart =
    encodeURIComponent(
      fileName
    );

  return (
    `/products/${categoryPart}/${filePart}`
  );
};

/*
|--------------------------------------------------------------------------
| Create description
|--------------------------------------------------------------------------
*/

const createDescription = (
  name,
  categoryName
) =>
  `${name} from our ${categoryName.toLowerCase()} collection. A feminine and versatile style designed for comfortable everyday wear and effortless styling.`;

/*
|--------------------------------------------------------------------------
| Read products from folders
|--------------------------------------------------------------------------
*/

const createProductsFromImages =
  () => {
    if (
      !fs.existsSync(
        PRODUCTS_DIRECTORY
      )
    ) {
      throw new Error(
        `Products image folder was not found:

${PRODUCTS_DIRECTORY}

Make sure your images are inside:
client/public/products/`
      );
    }

    const categoryFolders =
      fs
        .readdirSync(
          PRODUCTS_DIRECTORY,
          {
            withFileTypes:
              true
          }
        )
        .filter(
          (entry) =>
            entry.isDirectory()
        );

    const products = [];

    for (
      const categoryFolder
      of categoryFolders
    ) {
      const originalFolderName =
        categoryFolder.name;

      const categoryKey =
        normalizeKey(
          originalFolderName
        );

      if (
        SKIP_FOLDERS.includes(
          categoryKey
        )
      ) {
        console.log(
          `Skipping folder: ${originalFolderName}`
        );

        continue;
      }

      const categoryConfig =
        CATEGORY_CONFIG[
          categoryKey
        ];

      if (!categoryConfig) {
        console.warn(
          `No category configuration found for "${originalFolderName}". Folder skipped.`
        );

        continue;
      }

      const categoryPath =
        path.join(
          PRODUCTS_DIRECTORY,
          originalFolderName
        );

      const imageFiles =
        fs
          .readdirSync(
            categoryPath,
            {
              withFileTypes:
                true
            }
          )
          .filter(
            (entry) =>
              entry.isFile() &&
              /\.(png|jpg|jpeg|webp)$/i.test(
                entry.name
              )
          )
          .map(
            (entry) =>
              entry.name
          );

      /*
      |--------------------------------------------------------------------------
      | Group multiple colours under one product
      |--------------------------------------------------------------------------
      */

      const groups =
        new Map();

      for (
        const fileName
        of imageFiles
      ) {
        const parsed =
          parseFileName(
            fileName
          );

        const groupKey =
          parsed.groupName;

        if (
          !groups.has(
            groupKey
          )
        ) {
          groups.set(
            groupKey,
            []
          );
        }

        groups
          .get(groupKey)
          .push({
            ...parsed,
            fileName
          });
      }

      const productGroups =
        Array.from(
          groups.entries()
        );

      productGroups.forEach(
        (
          [
            groupName,
            images
          ],
          productIndex
        ) => {
          images.sort(
            (
              first,
              second
            ) =>
              first.order -
              second.order
          );

          const productName =
            createProductName(
              groupName
            );

          const price =
            categoryConfig
              .basePrice +
            (
              productIndex %
              5
            ) *
              categoryConfig
                .priceStep;

          const variants =
            [];

          images.forEach(
            (
              image,
              imageIndex
            ) => {
              const color =
                createColorName(
                  image.descriptor,
                  image.order,
                  images.length
                );

              const imageUrl =
                createPublicImageUrl(
                  originalFolderName,
                  image.fileName
                );

              categoryConfig
                .sizes
                .forEach(
                  (
                    size,
                    sizeIndex
                  ) => {
                    /*
                    |--------------------------------------------------------------------------
                    | Demo stock
                    |--------------------------------------------------------------------------
                    |
                    | This gives a slightly different stock value for each
                    | size/colour combination.
                    |
                    */

                    const stock =
                      6 +
                      (
                        imageIndex +
                        sizeIndex
                      ) %
                        7;

                    variants.push({
                      size,
                      color,
                      image:
                        imageUrl,
                      stock
                    });
                  }
                );
            }
          );

          const firstImageUrl =
            createPublicImageUrl(
              originalFolderName,
              images[0]
                .fileName
            );

          const featured =
            FEATURED_PRODUCTS.includes(
              groupName
                .toLowerCase()
            );

          products.push({
            name:
              productName,

            description:
              createDescription(
                productName,
                categoryConfig
                  .displayName
              ),

            category:
              categoryConfig
                .displayName,

            price,

            image:
              firstImageUrl,

            featured,

            variants
          });
        }
      );
    }

    return products;
  };

/*
|--------------------------------------------------------------------------
| Seed database
|--------------------------------------------------------------------------
*/

const seedDatabase =
  async () => {
    try {
      await connectDB();

      const products =
        createProductsFromImages();

      console.log(
        `Found ${products.length} product styles.`
      );

      /*
      |--------------------------------------------------------------------------
      | Remove old products
      |--------------------------------------------------------------------------
      */

      await Product.deleteMany(
        {}
      );

      /*
      |--------------------------------------------------------------------------
      | Insert new women's clothing catalogue
      |--------------------------------------------------------------------------
      */

      await Product.insertMany(
        products
      );

      /*
      |--------------------------------------------------------------------------
      | Clear old cart references
      |--------------------------------------------------------------------------
      |
      | Your old cart items point to old product ObjectIds.
      | Therefore we clear cart items when reseeding.
      |
      */

      await Cart.updateMany(
        {},
        {
          $set: {
            items: []
          }
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Clear old wishlist references
      |--------------------------------------------------------------------------
      */

      await Wishlist.updateMany(
        {},
        {
          $set: {
            products: []
          }
        }
      );

      console.log(
        "--------------------------------"
      );

      console.log(
        "Women's clothing catalogue seeded successfully."
      );

      console.log(
        `Products created: ${products.length}`
      );

      console.log(
        "Old cart items cleared."
      );

      console.log(
        "Old wishlist items cleared."
      );

      console.log(
        "--------------------------------"
      );

      process.exit(0);
    } catch (error) {
      console.error(
        "Seed error:",
        error
      );

      process.exit(1);
    }
  };

seedDatabase();