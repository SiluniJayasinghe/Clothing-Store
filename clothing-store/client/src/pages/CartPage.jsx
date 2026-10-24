import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import api from "../services/api";

import { TrashIcon } from "../components/Icons";

function CartPage() {
  const [cart, setCart] = useState({
    items: [],
  });

  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const response = await api.get("/cart");

      setCart(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      const response = await api.put(`/cart/${itemId}`, {
        quantity,
      });

      setCart(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update your bag.");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);

      setCart(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const freeDeliveryTarget = 10000;

  const amountLeft = Math.max(freeDeliveryTarget - subtotal, 0);

  const progress = Math.min((subtotal / freeDeliveryTarget) * 100, 100);

  const shipping = subtotal >= freeDeliveryTarget ? 0 : 500;

  if (loading) {
    return <div className="page-message">Opening your shopping bag...</div>;
  }

  return (
    <main className="container section cart-page">
      <div className="page-heading split-heading">
        <div>
          <span className="eyebrow">YOUR PICKS</span>

          <h1>Shopping Bag</h1>
        </div>

        <span className="item-count">
          {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {cart.items.length === 0 ? (
        <div className="empty-state soft-empty">
          <span className="empty-symbol">♡</span>

          <h2>Your bag is waiting for something pretty.</h2>

          <p>Browse the collection and add a few favourites.</p>

          <Link to="/products" className="btn btn-primary">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-panel">
            <div className="delivery-progress-card">
              <div className="delivery-progress-copy">
                {amountLeft > 0 ? (
                  <span>
                    Add <strong>Rs. {amountLeft.toLocaleString()}</strong> more
                    for free delivery
                  </span>
                ) : (
                  <span>
                    <strong>You unlocked free delivery ♡</strong>
                  </span>
                )}

                <span>Rs. 10,000</span>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            {cart.items.map((item) => (
              <article className="cart-item" key={item._id}>
                <Link
                  to={`/products/${item.product._id}`}
                  className="cart-item-image-wrap"
                >
                  <img
                    src={item.image || item.product.image}
                    alt={`${item.product.name} ${item.color}`}
                  />
                </Link>

                <div className="cart-item-info">
                  <span className="category">{item.product.category}</span>

                  <h3>{item.product.name}</h3>

                  <div className="cart-variant-line">
                    <span>Size: {item.size}</span>

                    <span>Colour: {item.color}</span>
                  </div>

                  <strong>
                    Rs. {Number(item.product.price).toLocaleString()}
                  </strong>
                </div>

                <div className="cart-item-controls">
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <strong className="line-total">
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </strong>

                  <button
                    type="button"
                    className="remove-icon-button"
                    onClick={() => removeItem(item._id)}
                    aria-label="Remove item"
                  >
                    <TrashIcon size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="order-summary sticky-summary">
            <span className="eyebrow">SUMMARY</span>

            <h2>Order total</h2>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>Rs. {subtotal.toLocaleString()}</strong>
            </div>

            <div className="summary-row">
              <span>Estimated delivery</span>

              <strong>
                {shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString()}`}
              </strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total-row">
              <span>Total</span>

              <strong>Rs. {(subtotal + shipping).toLocaleString()}</strong>
            </div>

            <Link
              to="/checkout"
              className="btn btn-primary full-width summary-checkout"
            >
              Continue to checkout
            </Link>

            <Link to="/products" className="continue-shopping">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

export default CartPage;
