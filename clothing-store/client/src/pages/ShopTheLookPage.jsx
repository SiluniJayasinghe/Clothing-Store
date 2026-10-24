import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../services/api";

import {
  TRENDING_LOOKS
} from "../data/trendingLooks";

import {
  useAuth
} from "../context/AuthContext";

import {
  ArrowRightIcon,
  HeartIcon,
  SparklesIcon
} from "../components/Icons";

function ShopTheLookPage() {
  const {
    lookId
  } = useParams();

  const navigate =
    useNavigate();

  const {
    user
  } = useAuth();

  const [
    products,
    setProducts
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    savedPieces,
    setSavedPieces
  ] = useState({
    top: false,
    bottom: false
  });

  const [
    wishlistMessage,
    setWishlistMessage
  ] = useState("");

  const look =
    TRENDING_LOOKS.find(
      (item) =>
        item.id === lookId
    );

  useEffect(() => {
    const loadProducts =
      async () => {
        try {
          const response =
            await api.get(
              "/products"
            );

          setProducts(
            response.data ||
            []
          );
        } catch (error) {
          console.error(
            "Unable to load products:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    loadProducts();
  }, []);

  if (!look) {
    return (
      <main className="container section page-message">
        <div>
          <span className="eyebrow">
            LOOK NOT FOUND
          </span>

          <h1>
            This look is unavailable.
          </h1>

          <Link
            to="/"
            className="btn btn-primary"
          >
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  const findProduct =
    (productName) =>
      products.find(
        (product) =>
          product.name
            .trim()
            .toLowerCase() ===
          productName
            .trim()
            .toLowerCase()
      );

  const topProduct =
    findProduct(
      look.top.productName
    );

  const bottomProduct =
    findProduct(
      look.bottom.productName
    );

  const getVariantImage = (
    product,
    color
  ) => {
    if (!product) {
      return "";
    }

    const variant =
      product.variants?.find(
        (item) =>
          item.color === color
      );

    return (
      variant?.image ||
      product.image
    );
  };

  const topImage =
    getVariantImage(
      topProduct,
      look.top.color
    );

  const bottomImage =
    getVariantImage(
      bottomProduct,
      look.bottom.color
    );

  /*
  |--------------------------------------------------------------------------
  | Save one piece to wishlist
  |--------------------------------------------------------------------------
  */

  const saveToWishlist =
    async (
      product,
      pieceName
    ) => {
      if (!user) {
        navigate("/login");
        return;
      }

      if (!product) {
        return;
      }

      try {
        await api.post(
          `/wishlist/${product._id}`
        );

        setSavedPieces(
          (current) => ({
            ...current,
            [pieceName]:
              true
          })
        );

        setWishlistMessage(
          `${product.name} saved to your wishlist.`
        );
      } catch (error) {
        console.error(
          error
        );

        setWishlistMessage(
          "Unable to update your wishlist."
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Save entire look
  |--------------------------------------------------------------------------
  */

  const saveWholeLook =
    async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      if (
        !topProduct ||
        !bottomProduct
      ) {
        setWishlistMessage(
          "Some pieces from this look are unavailable."
        );

        return;
      }

      try {
        await Promise.all([
          api.post(
            `/wishlist/${topProduct._id}`
          ),

          api.post(
            `/wishlist/${bottomProduct._id}`
          )
        ]);

        setSavedPieces({
          top: true,
          bottom: true
        });

        setWishlistMessage(
          "Both pieces have been saved to your wishlist."
        );
      } catch (error) {
        console.error(
          error
        );

        setWishlistMessage(
          "Unable to save the complete look."
        );
      }
    };

  if (loading) {
    return (
      <div className="page-message">
        Preparing your look...
      </div>
    );
  }

  return (
    <main className="container shop-look-page">
      <div className="look-breadcrumb">
        <Link to="/">
          Home
        </Link>

        <span>/</span>

        <span>
          Shop the Look
        </span>

        <span>/</span>

        <span>
          {look.title}
        </span>
      </div>

      {/* =====================================
          LOOK HERO
      ====================================== */}

      <section className="look-hero">
        <div className="look-main-image-panel">
          <span className="look-image-badge">
            Complete Look
          </span>

          <img
            src={look.image}
            alt={look.title}
          />
        </div>

        <div className="look-intro">
          <span className="eyebrow">
            SHOP THE LOOK
          </span>

          <h1>
            {look.title}
          </h1>

          <p>
            {look.subtitle}
          </p>

          <div className="look-highlight">
            <SparklesIcon
              size={20}
            />

            <span>
              Two pieces styled together
              by Blush & Bloom.
            </span>
          </div>

          <div className="look-piece-count">
            <strong>
              2
            </strong>

            <span>
              pieces complete this look
            </span>
          </div>

          <a
            href="#look-products"
            className="btn btn-primary"
          >
            Shop the pieces

            <ArrowRightIcon
              size={18}
            />
          </a>
        </div>
      </section>

      {/* =====================================
          LOOK PRODUCTS
      ====================================== */}

      <section
        id="look-products"
        className="look-products-section"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              COMPLETE THE OUTFIT
            </span>

            <h2>
              Shop each piece
            </h2>
          </div>
        </div>

        <div className="look-products-grid">

          {/* =====================================
              TOP
          ====================================== */}

          {topProduct ? (
            <article className="look-product-card">
              <div className="look-product-image">
                <span className="look-piece-label">
                  TOP
                </span>

                <img
                  src={topImage}
                  alt={
                    topProduct.name
                  }
                />
              </div>

              <div className="look-product-info">
                <span className="category">
                  {
                    topProduct.category
                  }
                </span>

                <h3>
                  {
                    topProduct.name
                  }
                </h3>

                <div className="look-selected-color">
                  <span>
                    Look colour
                  </span>

                  <strong>
                    {
                      look.top
                        .displayColor
                    }
                  </strong>
                </div>

                <div className="look-product-price">
                  Rs.{" "}
                  {Number(
                    topProduct.price
                  ).toLocaleString()}
                </div>

                <p>
                  Choose your preferred
                  colour and size on the
                  product page.
                </p>

                <div className="look-product-actions">
                  <Link
                    to={
                      `/products/${topProduct._id}`
                    }
                    className="btn btn-primary full-width"
                  >
                    Shop this top

                    <ArrowRightIcon
                      size={18}
                    />
                  </Link>

                  <button
                    type="button"
                    className={
                      `btn look-wishlist-button full-width ${
                        savedPieces.top
                          ? "saved"
                          : ""
                      }`
                    }
                    onClick={() =>
                      saveToWishlist(
                        topProduct,
                        "top"
                      )
                    }
                  >
                    <HeartIcon
                      size={18}
                    />

                    {savedPieces.top
                      ? "Saved to wishlist"
                      : "Save top to wishlist"}
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="look-product-missing">
              Top product could not be
              found.
            </div>
          )}

          {/* =====================================
              BOTTOM
          ====================================== */}

          {bottomProduct ? (
            <article className="look-product-card">
              <div className="look-product-image">
                <span className="look-piece-label">
                  BOTTOM
                </span>

                <img
                  src={
                    bottomImage
                  }
                  alt={
                    bottomProduct.name
                  }
                />
              </div>

              <div className="look-product-info">
                <span className="category">
                  {
                    bottomProduct.category
                  }
                </span>

                <h3>
                  {
                    bottomProduct.name
                  }
                </h3>

                <div className="look-selected-color">
                  <span>
                    Look colour
                  </span>

                  <strong>
                    {
                      look.bottom
                        .displayColor
                    }
                  </strong>
                </div>

                <div className="look-product-price">
                  Rs.{" "}
                  {Number(
                    bottomProduct.price
                  ).toLocaleString()}
                </div>

                <p>
                  Choose your preferred
                  colour and size on the
                  product page.
                </p>

                <div className="look-product-actions">
                  <Link
                    to={
                      `/products/${bottomProduct._id}`
                    }
                    className="btn btn-primary full-width"
                  >
                    Shop this bottom

                    <ArrowRightIcon
                      size={18}
                    />
                  </Link>

                  <button
                    type="button"
                    className={
                      `btn look-wishlist-button full-width ${
                        savedPieces.bottom
                          ? "saved"
                          : ""
                      }`
                    }
                    onClick={() =>
                      saveToWishlist(
                        bottomProduct,
                        "bottom"
                      )
                    }
                  >
                    <HeartIcon
                      size={18}
                    />

                    {savedPieces.bottom
                      ? "Saved to wishlist"
                      : "Save bottom to wishlist"}
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="look-product-missing">
              Bottom product could not be
              found.
            </div>
          )}
        </div>
      </section>

      {/* =====================================
          SAVE COMPLETE LOOK
      ====================================== */}

      <section className="look-bottom-banner">
        <HeartIcon
          size={25}
        />

        <div>
          <strong>
            Love the combination?
          </strong>

          <p>
            Save both pieces to your
            wishlist and choose your
            preferred colour and size
            later.
          </p>
        </div>

        <button
          type="button"
          className={
            `btn look-save-all-button ${
              savedPieces.top &&
              savedPieces.bottom
                ? "saved"
                : ""
            }`
          }
          onClick={
            saveWholeLook
          }
        >
          <HeartIcon
            size={18}
          />

          {savedPieces.top &&
          savedPieces.bottom
            ? "Look saved"
            : "Save both to wishlist"}
        </button>
      </section>

      {wishlistMessage && (
        <div className="look-wishlist-message">
          {wishlistMessage}
        </div>
      )}
    </main>
  );
}

export default ShopTheLookPage;