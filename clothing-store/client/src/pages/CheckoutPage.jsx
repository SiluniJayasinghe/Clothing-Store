import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

function CheckoutPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState({
    items: [],
  });

  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    postalCode: "",
    country: "Sri Lanka",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cartResponse, profileResponse] = await Promise.all([
          api.get("/cart"),

          api.get("/users/profile"),
        ]);

        setCart(cartResponse.data);

        const user = profileResponse.data;

        setForm({
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),

          phone: user.phone || "",

          addressLine1: user.address?.addressLine1 || "",

          addressLine2: user.address?.addressLine2 || "",

          city: user.address?.city || "",

          district: user.address?.district || "",

          postalCode: user.address?.postalCode || "",

          country: user.address?.country || "Sri Lanka",
        });
      } catch (loadError) {
        console.error(loadError);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,

      [event.target.name]: event.target.value,
    });
  };

  const submitOrder = async (event) => {
    event.preventDefault();

    setError("");

    setSubmitting(true);

    try {
      const response = await api.post("/orders", {
        shippingAddress: form,

        paymentMethod,
      });

      navigate(`/orders?success=${response.data._id}`);
    } catch (submitError) {
      setError(
        submitError.response?.data?.message || "Order could not be placed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const shipping = subtotal >= 10000 ? 0 : 500;

  if (loading) {
    return <div className="page-message">Preparing checkout...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <main className="container section">
        <div className="empty-state soft-empty">
          <span className="empty-symbol">♡</span>

          <h2>Your bag is empty</h2>

          <p>Add something you love before heading to checkout.</p>

          <Link to="/products" className="btn btn-primary">
            Shop now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container section checkout-page">
      <div className="page-heading">
        <span className="eyebrow">ALMOST YOURS</span>

        <h1>Checkout</h1>

        <p className="heading-copy">
          Add your delivery details and review your order.
        </p>
      </div>

      <form onSubmit={submitOrder} className="checkout-layout">
        <div className="checkout-main">
          {error && <div className="error">{error}</div>}

          <section className="checkout-card">
            <div className="checkout-card-heading">
              <span>01</span>

              <div>
                <h2>Delivery details</h2>

                <p>Where should we send your order?</p>
              </div>
            </div>

            <div className="form-grid">
              <label className="field full-span">
                <span>Full name</span>

                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </label>

              <label className="field full-span">
                <span>Phone number</span>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="07X XXX XXXX"
                  required
                />
              </label>

              <label className="field full-span">
                <span>Address line 1</span>

                <input
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleChange}
                  placeholder="House number and street"
                  required
                />
              </label>

              <label className="field full-span">
                <span>
                  Address line 2 <small>(optional)</small>
                </span>

                <input
                  name="addressLine2"
                  value={form.addressLine2}
                  onChange={handleChange}
                  placeholder="Apartment, landmark or area"
                />
              </label>

              <label className="field">
                <span>City</span>

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="field">
                <span>District</span>

                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="field">
                <span>Postal code</span>

                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                />
              </label>

              <label className="field">
                <span>Country</span>

                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </section>

          <section className="checkout-card">
            <div className="checkout-card-heading">
              <span>02</span>

              <div>
                <h2>Payment</h2>

                <p>Choose how you would like to pay.</p>
              </div>
            </div>

            <div className="payment-options">
              <label
                className={`payment-card ${
                  paymentMethod === "cash_on_delivery" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash_on_delivery"
                  checked={paymentMethod === "cash_on_delivery"}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />

                <div>
                  <strong>Cash on Delivery</strong>

                  <span>Pay when your order reaches you.</span>
                </div>
              </label>

              <label
                className={`payment-card ${
                  paymentMethod === "card_demo" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card_demo"
                  checked={paymentMethod === "card_demo"}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />

                <div>
                  <strong>Demo Card Payment</strong>

                  <span>Academic demo only — no real card is charged.</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        <aside className="order-summary sticky-summary checkout-summary">
          <span className="eyebrow">YOUR ORDER</span>

          <h2>Review</h2>

          <div className="checkout-mini-items">
            {cart.items.map((item) => (
              <div className="checkout-mini-item" key={item._id}>
                <img
                  src={item.image || item.product.image}
                  alt={`${item.product.name} ${item.color}`}
                />

                <div>
                  <strong>{item.product.name}</strong>

                  <span>
                    {item.size} / {item.color} × {item.quantity}
                  </span>
                </div>

                <strong>
                  Rs. {(item.product.price * item.quantity).toLocaleString()}
                </strong>
              </div>
            ))}
          </div>

          <div className="summary-divider" />

          <div className="summary-row">
            <span>Subtotal</span>

            <strong>Rs. {subtotal.toLocaleString()}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>

            <strong>
              {shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString()}`}
            </strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-row total-row">
            <span>Total</span>

            <strong>Rs. {(subtotal + shipping).toLocaleString()}</strong>
          </div>

          <button
            type="submit"
            className="btn btn-primary full-width"
            disabled={submitting}
          >
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </aside>
      </form>
    </main>
  );
}

export default CheckoutPage;
