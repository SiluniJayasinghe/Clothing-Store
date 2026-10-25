import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useSearchParams
} from "react-router-dom";

import api from "../services/api";

import ProductCard from "../components/ProductCard";

import {
  SearchIcon
} from "../components/Icons";

function ProductsPage() {
  const [
    searchParams,
    setSearchParams
  ] = useSearchParams();

  const category =
    searchParams.get(
      "category"
    ) || "";

  const sort =
    searchParams.get(
      "sort"
    ) || "";

  const [
    products,
    setProducts
  ] = useState([]);

  const [
    allProducts,
    setAllProducts
  ] = useState([]);

  const [
    search,
    setSearch
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(true);

  const updateFilterParam = (
    parameter,
    value
  ) => {
    setSearchParams(
      (currentParams) => {
        const nextParams =
          new URLSearchParams(
            currentParams
          );

        if (value) {
          nextParams.set(
            parameter,
            value
          );
        } else {
          nextParams.delete(
            parameter
          );
        }

        return nextParams;
      },
      {
        replace: true
      }
    );
  };

  useEffect(() => {
    const loadAllProducts =
      async () => {
        try {
          const response =
            await api.get(
              "/products"
            );

          setAllProducts(
            response.data ||
            []
          );
        } catch (error) {
          console.error(error);
        }
      };

    loadAllProducts();
  }, []);

  useEffect(() => {
    const fetchProducts =
      async () => {
        setLoading(true);

        try {
          const response =
            await api.get(
              "/products",
              {
                params: {
                  search,
                  category,
                  sort
                }
              }
            );

          setProducts(
            response.data ||
            []
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, [
    search,
    category,
    sort
  ]);

  const categories =
    useMemo(
      () => [
        ...new Set(
          allProducts
            .map(
              (product) =>
                product.category
            )
            .filter(Boolean)
        )
      ],
      [allProducts]
    );

  return (
    <main>
      <section className="shop-header">
        <div className="container shop-header-inner">
          <span className="eyebrow">
            BLUSH & BLOOM COLLECTION
          </span>

          <h1>
            Find your look
          </h1>

          <p>
            Easy, feminine styles made
            for wherever your day takes
            you.
          </p>
        </div>
      </section>

      <section
        id="shop-products"
        className="container shop-section"
      >
        <div className="filter-bar">
          <label className="search-field">
            <SearchIcon
              size={19}
            />

            <input
              type="search"
              placeholder="Search by product name..."
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
            />
          </label>

          <select
            value={category}
            onChange={(
              event
            ) =>
              updateFilterParam(
                "category",
                event.target
                  .value
              )
            }
          >
            <option value="">
              All categories
            </option>

            {categories.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}
          </select>

          <select
            value={sort}
            onChange={(
              event
            ) =>
              updateFilterParam(
                "sort",
                event.target
                  .value
              )
            }
          >
            <option value="">
              Recommended
            </option>

            <option value="newest">
              Newest
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>
          </select>
        </div>

        {categories.length >
          0 && (
          <div className="category-chips">
            <button
              className={
                !category
                  ? "active"
                  : ""
              }
              onClick={() =>
                updateFilterParam(
                  "category",
                  ""
                )
              }
            >
              All
            </button>

            {categories.map(
              (item) => (
                <button
                  key={item}
                  className={
                    category ===
                    item
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    updateFilterParam(
                      "category",
                      item
                    )
                  }
                >
                  {item}
                </button>
              )
            )}
          </div>
        )}

        <div className="shop-results-row">
          <p>
            <strong>
              {products.length}
            </strong>{" "}
            {products.length ===
            1
              ? "style"
              : "styles"}
          </p>

          {(search ||
            category ||
            sort) && (
            <button
              className="clear-filters"
              onClick={() => {
                setSearch("");
                setSearchParams(
                  new URLSearchParams(),
                  {
                    replace: true
                  }
                );
              }}
            >
              Clear filters
            </button>
          )}
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
              No styles found
            </h2>

            <p>
              Try another search or clear
              your filters.
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(
              (product) => (
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
      </section>
    </main>
  );
}

export default ProductsPage;