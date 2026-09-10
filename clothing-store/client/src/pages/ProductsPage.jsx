import {
  useEffect,
  useState
} from "react";

import api from "../services/api";
import ProductCard from "../components/ProductCard";

function ProductsPage() {
  const [
    products,
    setProducts
  ] = useState([]);

  const [
    search,
    setSearch
  ] = useState("");

  const [
    category,
    setCategory
  ] = useState("");

  const [
    sort,
    setSort
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(true);

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
            response.data
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

  return (
    <main className="container section">
      <div className="page-heading">
        <p className="eyebrow">
          COLLECTION
        </p>

        <h1>Shop</h1>
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        >
          <option value="">
            All Categories
          </option>

          <option value="T-Shirts">
            T-Shirts
          </option>

          <option value="Shirts">
            Shirts
          </option>

          <option value="Jeans">
            Jeans
          </option>

          <option value="Hoodies">
            Hoodies
          </option>

          <option value="Pants">
            Pants
          </option>
        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(
              e.target.value
            )
          }
        >
          <option value="">
            Sort by
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

      {loading ? (
        <div className="page-message">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="page-message">
          No products found.
        </div>
      ) : (
        <div className="product-grid">
          {products.map(
            (product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            )
          )}
        </div>
      )}
    </main>
  );
}

export default ProductsPage;