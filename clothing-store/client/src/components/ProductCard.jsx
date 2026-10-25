import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContextValue";
import {
  useWishlist
} from "../context/WishlistContextValue";

import {
  HeartIcon
} from "./Icons";

import {
  getProductImageSizeClass
} from "../utils/productImageSizing";

function ProductCard({
  product
}) {
  const {
    user
  } = useAuth();

  const {
    productIds,
    loading: wishlistLoading,
    addProduct
  } = useWishlist();

  const navigate =
    useNavigate();

  const [
    saving,
    setSaving
  ] = useState(false);

  const saved =
    productIds.includes(product._id);

  const addToWishlist =
    async (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!user) {
        navigate("/login");
        return;
      }

      if (
        saved ||
        saving ||
        wishlistLoading
      ) {
        return;
      }

      try {
        setSaving(true);
        await addProduct(product._id);
      } catch (error) {
        console.error(error);
      } finally {
        setSaving(false);
      }
    };

  return (
    <article className="product-card">
      <Link
        to={`/products/${product._id}`}
        className="product-card-link"
      >
        <div className="product-card-image-wrap">
          <button
            type="button"
            className={
              `wishlist-button ${
                saved
                  ? "saved"
                  : ""
              }`
            }
            onClick={addToWishlist}
            aria-label={
              saved
                ? "Already in wishlist"
                : "Add to wishlist"
            }
            aria-pressed={saved}
            disabled={
              wishlistLoading ||
              saving
            }
          >
            <HeartIcon size={19} />
          </button>

          <img
            src={product.image}
            alt={product.name}
            className={`product-card-image ${getProductImageSizeClass(product.name)}`}
          />
        </div>

        <div className="product-info">
          <span className="category">
            {product.category}
          </span>

          <h3>
            {product.name}
          </h3>

          <div className="product-price-row">
            <strong>
              Rs.{" "}
              {Number(
                product.price
              ).toLocaleString()}
            </strong>

            <span>
              View style →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;