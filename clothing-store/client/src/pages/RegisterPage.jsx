import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import api from "../services/api";

import {
  useAuth
} from "../context/AuthContextValue";

function RegisterPage() {
  const navigate =
    useNavigate();

  const {
    login
  } = useAuth();

  const [
    form,
    setForm
  ] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [
    showPassword,
    setShowPassword
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  const [
    submitting,
    setSubmitting
  ] = useState(false);

  const handleChange =
    (event) => {
      setForm({
        ...form,

        [event.target.name]:
          event.target.value
      });
    };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      setSubmitting(
        true
      );

      try {
        const response =
          await api.post(
            "/auth/register",
            form
          );

        login(
          response.data.token,
          response.data.user
        );

        navigate("/");
      } catch (
        registerError
      ) {
        setError(
          registerError
            .response
            ?.data
            ?.message ||
            "Registration failed"
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-promo register-promo">
          <span className="auth-promo-label">
            BLUSH & BLOOM
          </span>

          <div>
            <p className="eyebrow">
              JOIN THE COMMUNITY
            </p>

            <h1>
              Save the styles you love.
            </h1>

            <p>
              Create your account to keep
              a wishlist, build your bag
              and see every order in one
              place.
            </p>
          </div>

          <div className="auth-promo-note">
            made for everyday confidence ♡
          </div>
        </div>

        <form
          className="auth-card"
          onSubmit={
            handleSubmit
          }
        >
          <span className="eyebrow">
            CREATE ACCOUNT
          </span>

          <h2>
            Join Blush & Bloom
          </h2>

          <p className="auth-intro">
            A few details and your account
            is ready.
          </p>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <div className="two-field-row">
            <label className="field">
              <span>
                First name
              </span>

              <input
                name="firstName"
                placeholder="First name"
                value={
                  form.firstName
                }
                onChange={
                  handleChange
                }
                required
              />
            </label>

            <label className="field">
              <span>
                Last name
              </span>

              <input
                name="lastName"
                placeholder="Last name"
                value={
                  form.lastName
                }
                onChange={
                  handleChange
                }
                required
              />
            </label>
          </div>

          <label className="field">
            <span>
              Email address
            </span>

            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={
                form.email
              }
              onChange={
                handleChange
              }
              required
            />
          </label>

          <label className="field password-field">
            <span>
              Password
            </span>

            <div className="password-input-wrap">
              <input
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="At least 6 characters"
                minLength="6"
                value={
                  form.password
                }
                onChange={
                  handleChange
                }
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (
                      current
                    ) =>
                      !current
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>
          </label>

          <button
            className="btn btn-primary full-width auth-submit"
            disabled={
              submitting
            }
          >
            {submitting
              ? "Creating account..."
              : "Create account"}
          </button>

          <p className="auth-switch">
            Already a member?{" "}

            <Link to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default RegisterPage;