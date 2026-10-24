import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import api from "../services/api";

import {
  useAuth
} from "../context/AuthContext";

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

  const navigate =
    useNavigate();

  const [
    saved,
    setSaved
  ] = useState(false);

  const [
    saving,
    setSaving
  ] = useState(false);

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
        saving
      ) {
        return;
      }

      try {
        setSaving(true);

        await api.post(
          `/wishlist/${product._id}`
        );

        setSaved(true);
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
            aria-label="Add to wishlist"
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