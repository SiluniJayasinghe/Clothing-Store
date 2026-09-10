import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import api from "../services/api";
import ProductCard from "../components/ProductCard";

function HomePage() {
  const [
    featuredProducts,
    setFeaturedProducts
  ] = useState([]);

  useEffect(() => {
    const fetchFeatured =
      async () => {
        try {
          const response =
            await api.get(
              "/products/featured"
            );

          setFeaturedProducts(
            response.data
          );
        } catch (error) {
          console.error(error);
        }
      };

    fetchFeatured();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">
            NEW COLLECTION
          </p>

          <h1>
            Everyday style.
            <br />
            Made simple.
          </h1>

          <p>
            Discover modern essentials
            designed for comfort,
            confidence and everyday wear.
          </p>

          <Link
            to="/products"
            className="btn btn-dark"
          >
            Shop collection
          </Link>
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              OUR PICKS
            </span>

            <h2>
              Featured Products
            </h2>
          </div>

          <Link to="/products">
            View all →
          </Link>
        </div>

        <div className="product-grid">
          {featuredProducts.map(
            (product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            )
          )}
        </div>
      </section>
    </>
  );
}

export default HomePage;