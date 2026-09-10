import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../services/api";
import {
  useAuth
} from "../context/AuthContext";

function ProductDetailsPage() {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const { user } =
    useAuth();

  const [
    product,
    setProduct
  ] = useState(null);

  const [
    selectedVariant,
    setSelectedVariant
  ] = useState("");

  const [
    quantity,
    setQuantity
  ] = useState(1);

  const [
    message,
    setMessage
  ] = useState("");

  useEffect(() => {
    const fetchProduct =
      async () => {
        try {
          const response =
            await api.get(
              `/products/${id}`
            );

          setProduct(
            response.data
          );

          if (
            response.data
              .variants.length > 0
          ) {
            setSelectedVariant(
              response.data
                .variants[0]._id
            );
          }
        } catch (error) {
          console.error(error);
        }
      };

    fetchProduct();
  }, [id]);

  const handleAddToCart =
    async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        await api.post(
          "/cart",
          {
            productId: product._id,
            variantId:
              selectedVariant,
            quantity
          }
        );

        setMessage(
          "Product added to cart."
        );
      } catch (error) {
        setMessage(
          error.response?.data
            ?.message ||
            "Unable to add product"
        );
      }
    };

  const handleWishlist =
    async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        await api.post(
          `/wishlist/${product._id}`
        );

        setMessage(
          "Added to wishlist."
        );
      } catch (error) {
        setMessage(
          "Unable to update wishlist."
        );
      }
    };

  if (!product) {
    return (
      <div className="page-message">
        Loading product...
      </div>
    );
  }

  const variant =
    product.variants.find(
      (item) =>
        item._id ===
        selectedVariant
    );

  return (
    <main className="container section">
      <div className="product-details">
        <div className="product-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="product-content">
          <span className="category">
            {product.category}
          </span>

          <h1>
            {product.name}
          </h1>

          <h2>
            Rs.{" "}
            {product.price.toLocaleString()}
          </h2>

          <p>
            {product.description}
          </p>

          <label>
            Select variant
          </label>

          <select
            value={selectedVariant}
            onChange={(e) =>
              setSelectedVariant(
                e.target.value
              )
            }
          >
            {product.variants.map(
              (item) => (
                <option
                  key={item._id}
                  value={item._id}
                  disabled={
                    item.stock === 0
                  }
                >
                  {item.size} /{" "}
                  {item.color} —{" "}
                  {item.stock} available
                </option>
              )
            )}
          </select>

          <label>Quantity</label>

          <input
            type="number"
            min="1"
            max={
              variant?.stock || 1
            }
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Number(
                  e.target.value
                )
              )
            }
          />

          {message && (
            <p className="message">
              {message}
            </p>
          )}

          <div className="button-row">
            <button
              className="btn btn-dark"
              onClick={
                handleAddToCart
              }
              disabled={
                variant?.stock === 0
              }
            >
              Add to Cart
            </button>

            <button
              className="btn btn-outline"
              onClick={
                handleWishlist
              }
            >
              ♡ Wishlist
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailsPage;