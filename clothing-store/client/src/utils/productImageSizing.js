const REDUCED_PRODUCT_IMAGES = new Set([
  "bell sleeve dress",
  "floral tube top",
  "one shoulder top",
  "tie front flare top",
  "pleated midi skirt",
]);

const MORE_REDUCED_PRODUCT_IMAGES = new Set([
  "short sleeve knit sweater",
]);

const FURTHER_REDUCED_PRODUCT_IMAGES = new Set([
  "high-neck frill top",
  "single drape top",
]);

const MOST_REDUCED_PRODUCT_IMAGES = new Set([
  "quilted tank top",
  "textured tank top",
]);

const REDUCED_GRAPHIC_TEE_IMAGES = new Set([
  "graphic t-shirt",
]);

const SLIGHTLY_REDUCED_PRODUCT_IMAGES = new Set([
  "off-shoulder tiered dress",
  "flow cape dress",
  "halter flare dress",
  "elegant wrap blouse",
  "collared wrap top",
  "scarf neck top",
  "double bow skirt",
  "high waist split denim skirt",
]);

const COLOR_THUMBNAIL_SCALES = {
  "/products/casual-dresses/bell-sleeve-dress 2.png": 1.0422,
  "/products/casual-dresses/classic-long-dress 2.png": 1.051,
  "/products/casual-dresses/twist-shoulder-dress 3.png": 1.0322,
  "/products/casual-dresses/v-neck-halter-dress 3.png": 0.9668,
  "/products/office trousers/high-waist-trouser 2.png": 1.0393,
  "/products/party-dresses/off-shoulder-tiered-dress 2.png": 0.9357,
  "/products/party-dresses/off-shoulder-tiered-dress 3.png": 0.9272,
  "/products/shorts/chino-shorts 2.png": 0.9743,
  "/products/shorts/printed-shorts 3.png": 0.9241,
  "/products/shorts/printed-shorts 4.png": 1.0498,
  "/products/skirts/double-bow-skirt 2.png": 1.0357,
  "/products/skirts/frill-swirl-skirt 2.png": 1.0287,
  "/products/tops/bow-tie-ruched-top 2.png": 1.1011,
  "/products/tops/bow-tie-ruched-top 3.png": 1.0612,
  "/products/tops/bow-tie-ruched-top 4.png": 1.1511,
  "/products/tops/elegant-wrap-blouse 2.png": 0.9668,
  "/products/tops/elegant-wrap-blouse 3.png": 0.9469,
  "/products/tops/elegant-wrap-blouse 4.png": 0.9434,
  "/products/tops/elegant-wrap-blouse 5.png": 0.9548,
  "/products/tops/floral-tube-top 2.png": 1.0406,
  "/products/tops/graphic-t-Shirt 2 - BROWN-RABITS.png": 1.0488,
  "/products/tops/graphic-t-Shirt 3 - PINK-BOWS.png": 1.0786,
  "/products/tops/graphic-t-Shirt 6 - RED-CHERRY.png": 1.0759,
  "/products/tops/graphic-t-Shirt 7 - ROSE-BALLS.png": 1.0374,
  "/products/tops/graphic-t-Shirt 8 - ROSE-CHERRY.png": 1.1102,
  "/products/tops/graphic-t-Shirt 9 - SUNFLOWER-MOON.png": 1.1401,
  "/products/tops/graphic-t-Shirt 10 - TAN-SHEEP.png": 1.1177,
  "/products/tops/graphic-t-Shirt 11 - YELLOW-BEES.png": 1.0853,
  "/products/tops/relaxed-v-neck-blouse 2.png": 1.0844,
  "/products/tops/satin-wrap-blouse 2.png": 0.9677,
  "/products/tops/single-drape-top 2.png": 0.9183,
  "/products/tops/single-drape-top 3.png": 0.8871,
  "/products/tops/single-drape-top 4.png": 0.9742,
  "/products/tops/single-drape-top 5.png": 0.9028,
  "/products/tops/single-drape-top 7.png": 0.9164,
  "/products/tops/slim-fit-stripe-t-shirt 3 - PINK.png": 0.9602,
  "/products/tops/slim-fit-stripe-t-shirt 4 - CREAM.png": 0.9602,
  "/products/tops/slim-fit-stripe-t-shirt 5 - GRAY.png": 1.0616,
  "/products/tops/slim-fit-stripe-t-shirt 8 - ROSE.png": 0.9582,
  "/products/tops/slim-fit-stripe-t-shirt 9 - YELLOW.png": 1.0308,
  "/products/tops/textured-high-neck-top 6.png": 1.0348,
  "/products/tops/v-neck-collar-top 2.png": 0.9679,
  "/products/tops/v-neck-collar-top 3.png": 0.9696,
};

export const getColorThumbnailScale = (imageUrl) =>
  COLOR_THUMBNAIL_SCALES[
    decodeURIComponent(imageUrl.split("?")[0])
  ];

export const getProductImageSizeClass = (productName) => {
  const normalizedName = productName.trim().toLowerCase();

  if (MOST_REDUCED_PRODUCT_IMAGES.has(normalizedName)) {
    return "product-image--most-reduced";
  }

  if (REDUCED_GRAPHIC_TEE_IMAGES.has(normalizedName)) {
    return "product-image--graphic-tee-reduced";
  }

  if (FURTHER_REDUCED_PRODUCT_IMAGES.has(normalizedName)) {
    return "product-image--further-reduced";
  }

  if (MORE_REDUCED_PRODUCT_IMAGES.has(normalizedName)) {
    return "product-image--more-reduced";
  }

  if (normalizedName === "relaxed collar shirt") {
    return "product-image--almost-full-size";
  }

  if (SLIGHTLY_REDUCED_PRODUCT_IMAGES.has(normalizedName)) {
    return "product-image--slightly-reduced";
  }

  return REDUCED_PRODUCT_IMAGES.has(normalizedName)
    ? "product-image--reduced"
    : "";
};
