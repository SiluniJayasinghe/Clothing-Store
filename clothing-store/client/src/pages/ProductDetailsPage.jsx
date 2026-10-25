import {
  useEffect,
  useMemo,
  useRef,
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
} from "../context/AuthContextValue";

import {
  EditIcon,
  HeartIcon,
  ShieldIcon,
  TrashIcon,
  TruckIcon
} from "../components/Icons";

import {
  getColorThumbnailScale,
  getProductImageSizeClass
} from "../utils/productImageSizing";

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
    reviews,
    setReviews
  ] = useState([]);

  const [
    reviewsLoading,
    setReviewsLoading
  ] = useState(true);

  const [
    reviewForm,
    setReviewForm
  ] = useState({
    rating: "5",
    comment: ""
  });

  const [
    editingReviewId,
    setEditingReviewId
  ] = useState("");

  const [
    reviewError,
    setReviewError
  ] = useState("");

  const [
    reviewMessage,
    setReviewMessage
  ] = useState("");

  const [
    reviewSaving,
    setReviewSaving
  ] = useState(false);

  const reviewFormRef = useRef(null);
  const reviewCommentRef = useRef(null);

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

  useEffect(() => {
    let isActive = true;

    const fetchReviews = async () => {
      setReviews([]);
      setReviewsLoading(true);
      setReviewError("");
      setReviewMessage("");
      setEditingReviewId("");
      setReviewForm({
        rating: "5",
        comment: ""
      });

      try {
        const response = await api.get(
          `/reviews/product/${id}`
        );

        if (isActive) {
          setReviews(response.data);
        }
      } catch (error) {
        if (isActive) {
          setReviewError(
            error.response?.data?.message ||
              "Unable to load customer reviews."
          );
        }
      } finally {
        if (isActive) {
          setReviewsLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      isActive = false;
    };
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
      } catch {
        setMessageType(
          "error"
        );

        setMessage(
          "Unable to update your wishlist."
        );
      }
    };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewError("");
    setReviewMessage("");

    if (!reviewForm.comment.trim()) {
      setReviewError("Please write a comment for your review.");
      return;
    }

    setReviewSaving(true);

    try {
      const reviewData = {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim()
      };

      if (editingReviewId) {
        const response = await api.put(
          `/reviews/${editingReviewId}`,
          reviewData
        );

        setReviews((currentReviews) =>
          currentReviews.map((review) =>
            review._id === editingReviewId
              ? response.data
              : review
          )
        );

        setReviewMessage("Your review has been updated.");
      } else {
        const response = await api.post(
          "/reviews",
          {
            ...reviewData,
            productId: product._id
          }
        );

        setReviews((currentReviews) => [
          response.data,
          ...currentReviews
        ]);

        setReviewMessage("Thank you for sharing your review.");
      }

      setReviewForm({
        rating: "5",
        comment: ""
      });
      setEditingReviewId("");
    } catch (error) {
      setReviewError(
        error.response?.data?.message ||
          "Unable to save your review. Please try again."
      );
    } finally {
      setReviewSaving(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setReviewForm({
      rating: String(review.rating),
      comment: review.comment
    });
    setReviewError("");
    setReviewMessage("");
    reviewFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    reviewCommentRef.current?.focus({
      preventScroll: true
    });
  };

  const handleCancelReviewEdit = () => {
    setEditingReviewId("");
    setReviewForm({
      rating: "5",
      comment: ""
    });
    setReviewError("");
    setReviewMessage("");
  };

  const handleDeleteReview = async (reviewId) => {
    setReviewError("");
    setReviewMessage("");

    try {
      await api.delete(`/reviews/${reviewId}`);

      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) => review._id !== reviewId
        )
      );

      if (editingReviewId === reviewId) {
        handleCancelReviewEdit();
      }

      setReviewMessage("Your review has been deleted.");
    } catch (error) {
      setReviewError(
        error.response?.data?.message ||
          "Unable to delete your review. Please try again."
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
            className={
              getProductImageSizeClass(product.name)
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
                          style={{
                            scale: getColorThumbnailScale(
                              option.image
                            )
                          }}
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

      <section
        className="customer-reviews"
        aria-labelledby="customer-reviews-heading"
      >
        <div className="reviews-heading">
          <span className="eyebrow">
            Customer feedback
          </span>

          <h2 id="customer-reviews-heading">
            Customer Reviews
          </h2>

          <p>
            See what our customers think about this piece.
          </p>
        </div>

        {user ? (
          <form
            className="review-form"
            ref={reviewFormRef}
            onSubmit={handleReviewSubmit}
          >
            <h3>
              {editingReviewId
                ? "Edit your review"
                : "Share your experience"}
            </h3>

            <label htmlFor="review-rating">
              Your rating
            </label>
            <select
              id="review-rating"
              value={reviewForm.rating}
              onChange={(event) =>
                setReviewForm((currentForm) => ({
                  ...currentForm,
                  rating: event.target.value
                }))
              }
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} {rating === 1 ? "star" : "stars"}
                </option>
              ))}
            </select>

            <label htmlFor="review-comment">
              Your comment
            </label>
            <textarea
              id="review-comment"
              ref={reviewCommentRef}
              value={reviewForm.comment}
              onChange={(event) =>
                setReviewForm((currentForm) => ({
                  ...currentForm,
                  comment: event.target.value
                }))
              }
              placeholder="Tell us what you loved about it..."
              rows="4"
              maxLength="1000"
              required
            />

            <div className="review-form-footer">
              <span>
                {reviewForm.comment.length}/1000
              </span>

              <div className="review-form-actions">
                {editingReviewId && (
                  <button
                    type="button"
                    className="review-cancel-button"
                    onClick={handleCancelReviewEdit}
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={reviewSaving}
                >
                  {reviewSaving
                    ? "Saving..."
                    : editingReviewId
                      ? "Save changes"
                      : "Post review"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="review-login-prompt">
            <p>
              Sign in to share your experience with this product.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Sign in to review
            </button>
          </div>
        )}

        {reviewError && (
          <p className="review-notice error" role="alert">
            {reviewError}
          </p>
        )}

        {reviewMessage && (
          <p className="review-notice success" role="status">
            {reviewMessage}
          </p>
        )}

        <div className="review-list" aria-live="polite">
          {reviewsLoading ? (
            <p className="reviews-empty">
              Loading customer reviews...
            </p>
          ) : reviews.length === 0 ? (
            <p className="reviews-empty">
              Be the first to review this product.
            </p>
          ) : (
            reviews.map((review) => {
              const isOwnReview =
                user &&
                review.user?._id?.toString() ===
                  user._id?.toString();

              const reviewerName =
                [review.user?.firstName, review.user?.lastName]
                  .filter(Boolean)
                  .join(" ") || "Customer";

              return (
                <article
                  className="review-card"
                  key={review._id}
                >
                  <div className="review-card-header">
                    <div>
                      <h3>{reviewerName}</h3>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          }
                        )}
                      </span>
                    </div>

                    <span
                      className="review-rating"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {"★".repeat(review.rating)}
                      <span className="review-rating-muted">
                        {"★".repeat(5 - review.rating)}
                      </span>
                      <span className="review-rating-number">
                        {review.rating}/5
                      </span>
                    </span>
                  </div>

                  <p className="review-comment">
                    {review.comment}
                  </p>

                  {isOwnReview && (
                    <div className="review-card-actions">
                      <button
                        type="button"
                        className="review-action-button edit"
                        aria-label="Edit your review"
                        title="Edit review"
                        onClick={() => handleEditReview(review)}
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        type="button"
                        className="review-action-button delete"
                        aria-label="Delete your review"
                        title="Delete review"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

export default ProductDetailsPage;