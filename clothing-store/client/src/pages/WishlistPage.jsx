import {
  useEffect,
  useState
} from "react";

import api from "../services/api";
import ProductCard from "../components/ProductCard";

function WishlistPage() {
  const [
    products,
    setProducts
  ] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist =
    async () => {
      const response =
        await api.get(
          "/wishlist"
        );

      setProducts(
        response.data.products
      );
    };

  const removeProduct =
    async (productId) => {
      const response =
        await api.delete(
          `/wishlist/${productId}`
        );

      setProducts(
        response.data.products
      );
    };

  return (
    <main className="container section">
      <div className="page-heading">
        <span className="eyebrow">
          SAVED ITEMS
        </span>

        <h1>Wishlist</h1>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="product-grid">
          {products.map(
            (product) => (
              <div
                key={product._id}
              >
                <ProductCard
                  product={product}
                />

                <button
                  className="remove-button"
                  onClick={() =>
                    removeProduct(
                      product._id
                    )
                  }
                >
                  Remove
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