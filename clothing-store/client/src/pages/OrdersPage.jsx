import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useSearchParams
} from "react-router-dom";

import api from "../services/api";

import {
  CheckIcon,
  PackageIcon
} from "../components/Icons";

function OrdersPage() {
  const [
    orders,
    setOrders
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    searchParams
  ] = useSearchParams();

  const success =
    searchParams.get(
      "success"
    );

  useEffect(() => {
    const loadOrders =
      async () => {
        try {
          const response =
            await api.get(
              "/orders"
            );

          setOrders(
            response.data ||
            []
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="page-message">
        Loading your orders...
      </div>
    );
  }

  return (
    <main className="container section orders-page">
      <div className="page-heading">
        <span className="eyebrow">
          YOUR PURCHASES
        </span>

        <h1>
          My Orders
        </h1>

        <p className="heading-copy">
          Everything you have ordered,
          all in one place.
        </p>
      </div>

      {success && (
        <div className="order-success-banner">
          <span className="success-icon">
            <CheckIcon />
          </span>

          <div>
            <strong>
              Order placed successfully!
            </strong>

            <p>
              Thank you for shopping with
              Blush & Bloom.
            </p>
          </div>
        </div>
      )}

      {orders.length ===
      0 ? (
        <div className="empty-state soft-empty">
          <span className="empty-icon-circle">
            <PackageIcon
              size={30}
            />
          </span>

          <h2>
            No orders yet
          </h2>

          <p>
            When you place your first
            order, you will find it here.
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(
            (order) => (
              <article
                key={
                  order._id
                }
                className="order-card"
              >
                <div className="order-card-header">
                  <div>
                    <span>
                      Order number
                    </span>

                    <strong>
                      #
                      {order._id
                        .slice(
                          -8
                        )
                        .toUpperCase()}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Placed on
                    </span>

                    <strong>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Total
                    </span>

                    <strong>
                      Rs.{" "}
                      {Number(
                        order.total
                      ).toLocaleString()}
                    </strong>
                  </div>

                  <span
                    className={
                      `status status-${order.orderStatus}`
                    }
                  >
                    {
                      order.orderStatus
                    }
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map(
                    (item) => (
                      <div
                        className="order-product"
                        key={
                          item._id
                        }
                      >
                        <div className="order-product-image">
                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.productName
                            }
                          />
                        </div>

                        <div className="order-product-copy">
                          <strong>
                            {
                              item.productName
                            }
                          </strong>

                          <span>
                            {
                              item.size
                            }{" "}
                            /{" "}
                            {
                              item.color
                            }
                          </span>

                          <span>
                            Quantity:{" "}
                            {
                              item.quantity
                            }
                          </span>
                        </div>

                        <strong className="order-item-price">
                          Rs.{" "}
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString()}
                        </strong>
                      </div>
                    )
                  )}
                </div>

                <div className="order-card-footer">
                  <span>
                    Payment:{" "}
                    {order.paymentMethod ===
                    "cash_on_delivery"
                      ? "Cash on Delivery"
                      : "Demo Card"}
                  </span>

                  <span className="payment-status">
                    {
                      order.paymentStatus
                    }
                  </span>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </main>
  );
}

export default OrdersPage;