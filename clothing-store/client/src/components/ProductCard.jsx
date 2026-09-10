import {
  Link
} from "react-router-dom";

function ProductCard({
  product
}) {
  return (
    <article className="product-card">
      <Link
        to={`/products/${product._id}`}
      >
        <img
          src={product.image}
          alt={product.name}
        />

        <div className="product-info">
          <span className="category">
            {product.category}
          </span>

          <h3>
            {product.name}
          </h3>

          <strong>
            Rs.{" "}
            {product.price.toLocaleString()}
          </strong>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;