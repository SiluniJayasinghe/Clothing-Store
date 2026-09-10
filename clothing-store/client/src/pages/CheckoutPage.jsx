import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import api from "../services/api";

function CheckoutPage() {
  const navigate =
    useNavigate();

  const [
    cart,
    setCart
  ] = useState({
    items: []
  });

  const [
    paymentMethod,
    setPaymentMethod
  ] = useState(
    "cash_on_delivery"
  );

  const [
    form,
    setForm
  ] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    postalCode: "",
    country: "Sri Lanka"
  });

  const [
    error,
    setError
  ] = useState("");

  useEffect(() => {
    const loadData =
      async () => {
        try {
          const [
            cartResponse,
            profileResponse
          ] =
            await Promise.all([
              api.get("/cart"),
              api.get(
                "/users/profile"
              )
            ]);

          setCart(
            cartResponse.data
          );

          const user =
            profileResponse.data;

          setForm({
            fullName:
              `${user.firstName} ${user.lastName}`,
            phone:
              user.phone || "",
            addressLine1:
              user.address
                ?.addressLine1 ||
              "",
            addressLine2:
              user.address
                ?.addressLine2 ||
              "",
            city:
              user.address?.city ||
              "",
            district:
              user.address
                ?.district || "",
            postalCode:
              user.address
                ?.postalCode || "",
            country:
              user.address
                ?.country ||
              "Sri Lanka"
          });
        } catch (error) {
          console.error(error);
        }
      };

    loadData();
  }, []);

  const handleChange =
    (event) => {
      setForm({
        ...form,
        [event.target.name]:
          event.target.value
      });
    };

  const submitOrder =
    async (event) => {
      event.preventDefault();

      setError("");

      try {
        const response =
          await api.post(
            "/orders",
            {
              shippingAddress:
                form,
              paymentMethod
            }
          );

        navigate(
          `/orders?success=${response.data._id}`
        );
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Order could not be placed"
        );
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

  const shipping =
    subtotal >= 10000
      ? 0
      : 500;

  return (
    <main className="container section">
      <div className="page-heading">
        <span className="eyebrow">
          FINAL STEP
        </span>

        <h1>Checkout</h1>
      </div>

      <form
        onSubmit={submitOrder}
        className="checkout-layout"
      >
        <div className="checkout-form">
          <h2>
            Delivery information
          </h2>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {Object.entries(form).map(
            ([key, value]) => (
              <input
                key={key}
                name={key}
                value={value}
                placeholder={
                  key
                    .replace(
                      /([A-Z])/g,
                      " $1"
                    )
                    .replace(
                      /^./,
                      (str) =>
                        str.toUpperCase()
                    )
                }
                onChange={
                  handleChange
                }
                required={[
                  "fullName",
                  "phone",
                  "addressLine1",
                  "city",
                  "district",
                  "country"
                ].includes(key)}
              />
            )
          )}

          <h2>Payment</h2>

          <label className="radio-option">
            <input
              type="radio"
              name="payment"
              value="cash_on_delivery"
              checked={
                paymentMethod ===
                "cash_on_delivery"
              }
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            />

            Cash on Delivery
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="payment"
              value="card_demo"
              checked={
                paymentMethod ===
                "card_demo"
              }
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            />

            Demo Card Payment
          </label>
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

          <div>
            <span>
              Shipping
            </span>

            <strong>
              {shipping === 0
                ? "Free"
                : `Rs. ${shipping.toLocaleString()}`}
            </strong>
          </div>

          <hr />

          <div>
            <span>Total</span>

            <strong>
              Rs.{" "}
              {(
                subtotal +
                shipping
              ).toLocaleString()}
            </strong>
          </div>

          <button
            type="submit"
            className="btn btn-dark full-width"
          >
            Place Order
          </button>
        </aside>
      </form>
    </main>
  );
}

export default CheckoutPage;