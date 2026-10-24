import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import api from "../services/api";

import ProductCard from "../components/ProductCard";

function WishlistPage() {
  const [
    products,
    setProducts
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const loadWishlist =
    async () => {
      try {
        const response =
          await api.get(
            "/wishlist"
          );

        setProducts(
          response.data
            .products ||
            []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeProduct =
    async (productId) => {
      try {
        const response =
          await api.delete(
            `/wishlist/${productId}`
          );

        setProducts(
          response.data
            .products ||
            []
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <main className="container section">
      <div className="page-heading split-heading">
        <div>
          <span className="eyebrow">
            SAVED FOR LATER
          </span>

          <h1>
            My Wishlist
          </h1>
        </div>

        <span className="item-count">
          {products.length}{" "}
          {products.length ===
          1
            ? "favourite"
            : "favourites"}
        </span>
      </div>

      {loading ? (
        <div className="product-grid">
          {[
            1,
            2,
            3,
            4
          ].map(
            (item) => (
              <div
                className="product-skeleton"
                key={item}
              />
            )
          )}
        </div>
      ) : products.length ===
        0 ? (
        <div className="empty-state soft-empty">
          <span className="empty-symbol">
            ♡
          </span>

          <h2>
            No favourites yet
          </h2>

          <p>
            Save the pieces you love so
            they are easy to find later.
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Explore the collection
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(
            (product) => (
              <div
                className="wishlist-card-wrap"
                key={
                  product._id
                }
              >
                <ProductCard
                  product={
                    product
                  }
                />

                <button
                  type="button"
                  className="wishlist-remove"
                  onClick={() =>
                    removeProduct(
                      product._id
                    )
                  }
                >
                  Remove from wishlist
                </button>
              </div>
            )
          )}
        </div>
      )}
    </main>
  );
}

export default WishlistPage;