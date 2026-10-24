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
]);

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
