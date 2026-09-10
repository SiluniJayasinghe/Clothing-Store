import {
  useEffect,
  useState
} from "react";

import {
  useSearchParams
} from "react-router-dom";

import api from "../services/api";

function OrdersPage() {
  const [
    orders,
    setOrders
  ] = useState([]);

  const [
    searchParams
  ] = useSearchParams();

  const success =
    searchParams.get("success");

  useEffect(() => {
    const loadOrders =
      async () => {
        try {
          const response =
            await api.get(
              "/orders"
            );

          setOrders(
            response.data
          );
        } catch (error) {
          console.error(error);
        }
      };

    loadOrders();
  }, []);

  return (
    <main className="container section">
      <div className="page-heading">
        <span className="eyebrow">
          YOUR PURCHASES
        </span>

        <h1>My Orders</h1>
      </div>

      {success && (
        <div className="success">
          ✓ Your order was placed
          successfully.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="empty-state">
          You haven't placed any
          orders yet.
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(
            (order) => (
              <article
                key={order._id}
                className="order-card"
              >
                <div className="order-card-header">
                  <div>
                    <span>
                      Order
                    </span>

                    <strong>
                      #
                      {order._id
                        .slice(-8)
                        .toUpperCase()}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Date
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
                      {order.total.toLocaleString()}
                    </strong>
                  </div>

                  <span className="status">
                    {
                      order.orderStatus
                    }
                  </span>
                </div>

                {order.items.map(
                  (item) => (
                    <div
                      className="order-product"
                      key={item._id}
                    >
                      <img
                        src={
                          item.image
                        }
                        alt={
                          item.productName
                        }
                      />

                      <div>
                        <strong>
                          {
                            item.productName
                          }
                        </strong>

                        <p>
                          {item.size} /{" "}
                          {item.color}
                        </p>

                        <p>
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>
                      </div>
                    </div>
                  )
                )}
              </article>
            )
          )}
        </div>
      )}
    </main>
  );
}

export default OrdersPage;