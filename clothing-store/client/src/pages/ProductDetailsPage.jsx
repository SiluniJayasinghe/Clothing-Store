import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../services/api";

import {
  useAuth
} from "../context/AuthContext";

import {
  HeartIcon,
  ShieldIcon,
  TruckIcon
} from "../components/Icons";

function ProductDetailsPage() {
  const {
    id
  } = useParams();

  const navigate =
    useNavigate();

  const {
    user
  } = useAuth();

  const [
    product,
    setProduct
  ] = useState(null);

  const [
    selectedColor,
    setSelectedColor
  ] = useState("");

  const [
    selectedSize,
    setSelectedSize
  ] = useState("");

  const [
    quantity,
    setQuantity
  ] = useState(1);

  const [
    message,
    setMessage
  ] = useState("");

  const [
    messageType,
    setMessageType
  ] = useState(
    "success"
  );

  /*
  |--------------------------------------------------------------------------
  | Load product
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchProduct =
      async () => {
        try {
          const response =
            await api.get(
              `/products/${id}`
            );

          const data =
            response.data;

          setProduct(data);

          const firstAvailable =
            data.variants?.find(
              (variant) =>
                variant.stock >
                0
            ) ||
            data.variants?.[0];

          if (
            firstAvailable
          ) {
            setSelectedColor(
              firstAvailable.color
            );

            setSelectedSize(
              firstAvailable.size
            );
          }
        } catch (error) {
          console.error(
            error
          );
        }
      };

    fetchProduct();
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Get each colour once
  |--------------------------------------------------------------------------
  |
  | Each colour gets its representative image.
  |
  */

  const colorOptions =
    useMemo(() => {
      if (!product) {
        return [];
      }

      const map =
        new Map();

      product.variants.forEach(
        (variant) => {
          if (
            !map.has(
              variant.color
            )
          ) {
            map.set(
              variant.color,
              {
                color:
                  variant.color,

                image:
                  variant.image ||
                  product.image
              }
            );
          }
        }
      );

      return Array.from(
        map.values()
      );
    }, [product]);

  /*
  |--------------------------------------------------------------------------
  | Sizes available for selected colour
  |--------------------------------------------------------------------------
  */

  const sizes =
    useMemo(() => {
      if (!product) {
        return [];
      }

      return [
        ...new Set(
          product.variants
            .filter(
              (variant) =>
                variant.color ===
                selectedColor
            )
            .map(
              (variant) =>
                variant.size
            )
        )
      ];
    }, [
      product,
      selectedColor
    ]);

  /*
  |--------------------------------------------------------------------------
  | Exact selected variant
  |--------------------------------------------------------------------------
  */

  const selectedVariant =
    useMemo(() => {
      if (!product) {
        return null;
      }

      return (
        product.variants.find(
          (variant) =>
            variant.color ===
              selectedColor &&
            variant.size ===
              selectedSize
        ) ||
        null
      );
    }, [
      product,
      selectedColor,
      selectedSize
    ]);

  /*
  |--------------------------------------------------------------------------
  | Main displayed image
  |--------------------------------------------------------------------------
  */

  const selectedColorImage =
    useMemo(() => {
      const option =
        colorOptions.find(
          (item) =>
            item.color ===
            selectedColor
        );

      return (
        selectedVariant
          ?.image ||
        option?.image ||
        product?.image
      );
    }, [
      colorOptions,
      selectedColor,
      selectedVariant,
      product
    ]);

  /*
  |--------------------------------------------------------------------------
  | Colour click
  |--------------------------------------------------------------------------
  */

  const handleColorChange =
    (color) => {
      setSelectedColor(
        color
      );

      setQuantity(1);

      setMessage("");

      const availableForColor =
        product.variants.filter(
          (variant) =>
            variant.color ===
            color
        );

      const sameSize =
        availableForColor.find(
          (variant) =>
            variant.size ===
              selectedSize &&
            variant.stock >
              0
        );

      const firstAvailable =
        availableForColor.find(
          (variant) =>
            variant.stock >
            0
        );

      const fallback =
        availableForColor[0];

      setSelectedSize(
        sameSize?.size ||
        firstAvailable?.size ||
        fallback?.size ||
        ""
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Add to cart
  |--------------------------------------------------------------------------
  */

  const handleAddToCart =
    async () => {
      if (!user) {
        navigate(
          "/login"
        );

        return;
      }

      if (!selectedVariant) {
        setMessageType(
          "error"
        );

        setMessage(
          "Please choose a colour and size."
        );

        return;
      }

      if (
        selectedVariant.stock ===
        0
      ) {
        setMessageType(
          "error"
        );

        setMessage(
          "This option is currently sold out."
        );

        return;
      }

      try {
        await api.post(
          "/cart",
          {
            productId:
              product._id,

            variantId:
              selectedVariant._id,

            quantity
          }
        );

        setMessageType(
          "success"
        );

        setMessage(
          "Added to your shopping bag."
        );
      } catch (error) {
        setMessageType(
          "error"
        );

        setMessage(
          error.response
            ?.data
            ?.message ||
            "Unable to add this item."
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Wishlist
  |--------------------------------------------------------------------------
  */

  const handleWishlist =
    async () => {
      if (!user) {
        navigate(
          "/login"
        );

        return;
      }

      try {
        await api.post(
          `/wishlist/${product._id}`
        );

        setMessageType(
          "success"
        );

        setMessage(
          "Saved to your wishlist."
        );
      } catch (error) {
        setMessageType(
          "error"
        );

        setMessage(
          "Unable to update your wishlist."
        );
      }
    };

  if (!product) {
    return (
      <div className="page-message">
        Loading your style...
      </div>
    );
  }

  return (
    <main className="container product-page">
      <div className="breadcrumb">
        <Link to="/products">
          Shop
        </Link>

        <span>/</span>

        <span>
          {product.category}
        </span>
      </div>

      <div className="product-details">
        {/* PRODUCT IMAGE */}

        <div className="product-image-panel">
          {product.featured && (
            <span className="product-badge detail-badge">
              Featured
            </span>
          )}

          <img
            src={
              selectedColorImage
            }
            alt={
              `${product.name} ${selectedColor}`
            }
          />
        </div>

        {/* PRODUCT INFORMATION */}

        <div className="product-content">
          <span className="category">
            {product.category}
          </span>

          <h1>
            {product.name}
          </h1>

          <div className="detail-price">
            Rs.{" "}
            {Number(
              product.price
            ).toLocaleString()}
          </div>

          <p className="product-description">
            {product.description}
          </p>

          {/* COLOUR */}

          {colorOptions.length >
            1 && (
            <div className="option-group">
              <div className="option-label-row">
                <label>
                  Colour
                </label>

                <span>
                  {selectedColor}
                </span>
              </div>

              <div className="variant-image-options">
                {colorOptions.map(
                  (
                    option
                  ) => (
                    <button
                      type="button"
                      key={
                        option.color
                      }
                      className={
                        `color-image-option ${
                          selectedColor ===
                          option.color
                            ? "selected"
                            : ""
                        }`
                      }
                      onClick={() =>
                        handleColorChange(
                          option.color
                        )
                      }
                      title={
                        option.color
                      }
                    >
                      <div className="color-thumbnail">
                        <img
                          src={
                            option.image
                          }
                          alt={
                            `${product.name} ${option.color}`
                          }
                        />
                      </div>

                      <span>
                        {
                          option.color
                        }
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* SIZE */}

          <div className="option-group">
            <div className="option-label-row">
              <label>
                Size
              </label>

              <span>
                {selectedSize ||
                  "Choose a size"}
              </span>
            </div>

            <div className="size-buttons">
              {sizes.map(
                (size) => {
                  const variant =
                    product.variants.find(
                      (
                        item
                      ) =>
                        item.color ===
                          selectedColor &&
                        item.size ===
                          size
                    );

                  const soldOut =
                    !variant ||
                    variant.stock ===
                      0;

                  return (
                    <button
                      type="button"
                      key={
                        size
                      }
                      className={
                        selectedSize ===
                        size
                          ? "selected"
                          : ""
                      }
                      disabled={
                        soldOut
                      }
                      onClick={() => {
                        setSelectedSize(
                          size
                        );

                        setQuantity(
                          1
                        );

                        setMessage(
                          ""
                        );
                      }}
                    >
                      {size}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* STOCK */}

          <div className="stock-message">
            {selectedVariant?.stock >
              5 && (
              <span className="in-stock-dot">
                ● In stock
              </span>
            )}

            {selectedVariant?.stock >
              0 &&
              selectedVariant?.stock <=
                5 && (
                <span className="low-stock">
                  ● Only{" "}
                  {
                    selectedVariant.stock
                  }{" "}
                  left
                </span>
              )}

            {selectedVariant?.stock ===
              0 && (
              <span className="out-stock">
                ● Sold out
              </span>
            )}
          </div>

          {/* QUANTITY + CART */}

          <div className="purchase-row">
            <div className="detail-quantity">
              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (
                      current
                    ) =>
                      Math.max(
                        1,
                        current -
                          1
                      )
                  )
                }
              >
                −
              </button>

              <span>
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (
                      current
                    ) =>
                      Math.min(
                        selectedVariant
                          ?.stock ||
                          1,

                        current +
                          1
                      )
                  )
                }
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="btn btn-primary add-bag-button"
              onClick={
                handleAddToCart
              }
              disabled={
                !selectedVariant ||
                selectedVariant.stock ===
                  0
              }
            >
              Add to bag
            </button>

            <button
              type="button"
              className="detail-heart-button"
              onClick={
                handleWishlist
              }
              aria-label="Add to wishlist"
            >
              <HeartIcon />
            </button>
          </div>

          {message && (
            <div
              className={
                `inline-message ${messageType}`
              }
            >
              {message}
            </div>
          )}

          <div className="product-perks">
            <div>
              <TruckIcon />

              <span>
                Free delivery over Rs.
                10,000
              </span>
            </div>

            <div>
              <ShieldIcon />

              <span>
                Secure customer account
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailsPage;