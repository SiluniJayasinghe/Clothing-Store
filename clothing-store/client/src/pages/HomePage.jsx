import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import api from "../services/api";

import { TRENDING_LOOKS } from "../data/trendingLooks";

import {
  ArrowRightIcon,
  ShieldIcon,
  SparklesIcon,
  TruckIcon,
} from "../components/Icons";

import {
  getProductImageSizeClass
} from "../utils/productImageSizing";

function HomePage() {
  const [allProducts, setAllProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHome = async () => {
      try {
        const response = await api.get("/products");

        setAllProducts(response.data || []);
      } catch (error) {
        console.error("Unable to load home products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const categoryCards = useMemo(() => {
    const byCategory = new Map();

    allProducts.forEach((product) => {
      if (!byCategory.has(product.category)) {
        byCategory.set(product.category, product);
      }
    });

    return Array.from(byCategory.entries())
      .slice(0, 4)
      .map(([name, product]) => ({
        name,
        product,
      }));
  }, [allProducts]);

  /*
  |--------------------------------------------------------------------------
  | Find a product by MongoDB product name
  |--------------------------------------------------------------------------
  */

  const findProduct = (name) =>
    allProducts.find(
      (product) =>
        product.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );

  /*
  |--------------------------------------------------------------------------
  | HERO ITEM 1
  | Off-Shoulder Tiered Dress - Shade 2
  |--------------------------------------------------------------------------
  */

  const offShoulderDress = findProduct("Off-Shoulder Tiered Dress");

  const offShoulderVariant = offShoulderDress?.variants?.find(
    (variant) => variant.color === "Shade 2",
  );

  /*
  |--------------------------------------------------------------------------
  | HERO ITEM 2
  | Sweet Picnic complete outfit
  |--------------------------------------------------------------------------
  */

  const sweetPicnic = TRENDING_LOOKS.find((look) => look.id === "sweet-picnic");

  /*
  |--------------------------------------------------------------------------
  | HERO ITEM 3
  | V-Neck Halter Dress - Shade 1
  |--------------------------------------------------------------------------
  */

  const halterDress = findProduct("V-Neck Halter Dress");

  const halterVariant = halterDress?.variants?.find(
    (variant) => variant.color === "Shade 1",
  );

  /*
  |--------------------------------------------------------------------------
  | Final custom hero cards
  |--------------------------------------------------------------------------
  */

  const heroItems = [
    {
      id: "off-shoulder-tiered-dress",

      title: "Off-Shoulder Tiered Dress",

      image:
        offShoulderVariant?.image ||
        "/products/party-dresses/off-shoulder-tiered-dress%202.png",

      to: offShoulderDress ? `/products/${offShoulderDress._id}` : "/products",

      type: "product",
    },

    {
      id: "sweet-picnic",

      title: "Sweet Picnic",

      image:
        sweetPicnic?.image || "/products/trending-best-matches/match%201.png",

      to: "/looks/sweet-picnic",

      type: "look",
    },

    {
      id: "v-neck-halter-dress",

      title: "V-Neck Halter Dress",

      image:
        halterVariant?.image ||
        "/products/casual-dresses/v-neck-halter-dress%201.png",

      to: halterDress ? `/products/${halterDress._id}` : "/products",

      type: "product",
    },
  ];

  return (
    <>
      {/* =====================================
          HERO
      ====================================== */}

      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <span className="eyebrow">YOUR EVERYDAY STYLE EDIT</span>

            <h1>
              Wear what makes
              <em> you feel good.</em>
            </h1>

            <p>
              Fresh, feminine pieces for campus days, coffee dates, celebrations
              and every little moment in between.
            </p>

            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">
                Shop the collection
                <ArrowRightIcon size={18} />
              </Link>

              <Link to="/products?sort=newest" className="text-link">
                See what's new
              </Link>
            </div>

            <div className="hero-mini-note">
              <SparklesIcon size={18} />

              <span>Curated for women who like effortless, pretty style.</span>
            </div>
          </div>

          {/* CUSTOM 3 HERO IMAGES */}

          <div className="hero-collage" aria-label="Featured clothing">
            {!loading &&
              heroItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`hero-product-card hero-product-${index + 1} ${
                    item.type === "look" ? "hero-look-card" : ""
                  }`}
                >
                  {item.type === "look" && (
                    <div className="hero-look-badge">SHOP THE LOOK</div>
                  )}

                  <img
                    src={item.image}
                    alt={item.title}
                    className="hero-card-image"
                  />

                  <div className="hero-product-name">{item.title}</div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* =====================================
          BENEFITS
      ====================================== */}

      <section className="benefit-strip">
        <div className="container benefit-grid">
          <div className="benefit-item">
            <TruckIcon />

            <div>
              <strong>Free delivery</strong>

              <span>On orders over Rs. 10,000</span>
            </div>
          </div>

          <div className="benefit-item">
            <ShieldIcon />

            <div>
              <strong>Secure shopping</strong>

              <span>Your account stays protected</span>
            </div>
          </div>

          <div className="benefit-item">
            <SparklesIcon />

            <div>
              <strong>Fresh styles</strong>

              <span>Easy pieces for every mood</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          SHOP BY CATEGORY
      ====================================== */}

      {categoryCards.length > 0 && (
        <section className="container section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORE COLLECTIONS</span>

              <h2>Shop by Category</h2>
            </div>

            <Link to="/products" className="text-link">
              Shop all
              <ArrowRightIcon size={17} />
            </Link>
          </div>

          <div className="category-grid">
            {categoryCards.map(({ name, product }) => (
              <Link
                key={name}
                to={`/products?category=${encodeURIComponent(name)}`}
                className="category-card"
              >
                <div className="category-image-wrap">
                  <img
                    src={product.image}
                    alt={name}
                    className={getProductImageSizeClass(product.name)}
                  />
                </div>

                <div className="category-card-copy">
                  <span>Explore</span>

                  <h3>{name}</h3>

                  <ArrowRightIcon size={19} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* =====================================
          TRENDING BEST MATCHES
      ====================================== */}

      <section className="trending-looks-section">
        <div className="container section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">STYLED FOR YOU</span>

              <h2>Trending Best Matches</h2>

              <p className="trending-section-description">
                Complete outfit ideas using pieces from our collection.
              </p>
            </div>
          </div>

          <div className="trending-looks-grid">
            {TRENDING_LOOKS.map((look, index) => (
              <Link
                key={look.id}
                to={`/looks/${look.id}`}
                className="trending-look-card"
              >
                <div className="trending-look-image-wrap">
                  <span className="trending-look-number">0{index + 1}</span>

                  <img src={look.image} alt={look.title} />

                  <span className="shop-look-pill">Shop the look</span>
                </div>

                <div className="trending-look-copy">
                  <div>
                    <span>Complete Outfit</span>

                    <h3>{look.title}</h3>
                  </div>

                  <ArrowRightIcon size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}

      {/*<section className="container section featured-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              THE EDIT
            </span>

            <h2>
              Trending right now
            </h2>
          </div>

          <Link
            to="/products"
            className="text-link"
          >
            View all

            <ArrowRightIcon
              size={17}
            />
          </Link>
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
                  key={
                    item
                  }
                />
              )
            )}
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts
              .slice(
                0,
                4
              )
              .map(
                (
                  product
                ) => (
                  <ProductCard
                    key={
                      product._id
                    }
                    product={
                      product
                    }
                  />
                )
              )}
          </div>
        )}
      </section>*/}

      {/* =====================================
          BRAND BANNER
      ====================================== */}

      <section className="container section">
        <div className="editorial-banner">
          <div className="editorial-copy">
            <span className="eyebrow">BLUSH & BLOOM</span>

            <h2>Style should feel like you.</h2>

            <p>
              Build a wardrobe that is playful, comfortable and easy to make
              your own.
            </p>

            <Link to="/products" className="btn btn-light">
              Discover your style
              <ArrowRightIcon size={18} />
            </Link>
          </div>

          <div className="editorial-quote">
            <span>soft looks</span>

            <span>bold moods</span>

            <span>your way</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
