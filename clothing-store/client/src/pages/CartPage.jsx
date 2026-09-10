import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import api from "../services/api";

function CartPage() {
  const [
    cart,
    setCart
  ] = useState({
    items: []
  });

  const [
    loading,
    setLoading
  ] = useState(true);

  const loadCart =
    async () => {
      try {
        const response =
          await api.get("/cart");

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

  const updateQuantity =
    async (
      itemId,
      quantity
    ) => {
      if (quantity < 1) return;

      try {
        const response =
          await api.put(
            `/cart/${itemId}`,
            {
              quantity
            }
          );

        setCart(response.data);
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Unable to update cart"
        );
      }
    };

  const removeItem =
    async (itemId) => {
      try {
        const response =
          await api.delete(
            `/cart/${itemId}`
          );

        setCart(response.data);
      } catch (error) {
        console.error(error);
      }
    };

  const subtotal =
    cart.items.reduce(
      (sum, item) =>
        sum +
        item.product.price *
          item.quantity,
      0
    );

  if (loading) {
    return (
      <div className="page-message">
        Loading cart...
      </div>
    );
  }

  return (
    <main className="container section">
      <div className="page-heading">
        <span className="eyebrow">
          SHOPPING BAG
        </span>

        <h1>Your Cart</h1>
      </div>

      {cart.items.length === 0 ? (
        <div className="empty-state">
          <h2>
            Your cart is empty
          </h2>

          <Link
            to="/products"
            className="btn btn-dark"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {cart.items.map(
              (item) => (
                <article
                  className="cart-item"
                  key={item._id}
                >
                  <img
                    src={
                      item.product
                        .image
                    }
                    alt={
                      item.product
                        .name
                    }
                  />

                  <div className="cart-item-info">
                    <h3>
                      {
                        item.product
                          .name
                      }
                    </h3>

                    <p>
                      Size:{" "}
                      {item.size}
                    </p>

                    <p>
                      Color:{" "}
                      {item.color}
                    </p>

                    <strong>
                      Rs.{" "}
                      {item.product.price.toLocaleString()}
                    </strong>
                  </div>

                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.quantity -
                            1
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.quantity +
                            1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() =>
                      removeItem(
                        item._id
                      )
                    }
                  >
                    Remove
                  </button>
                </article>
              )
            )}
          </div>

          <aside className="order-summary">
            <h2>
              Order Summary
            </h2>

            <div>
              <span>
                Subtotal
              </span>

              <strong>
                Rs.{" "}
                {subtotal.toLocaleString()}
              </strong>
            </div>

            <p>
              Shipping is calculated
              during checkout.
            </p>

            <Link
              to="/checkout"
              className="btn btn-dark full-width"
            >
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

export default CartPage;