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

function LoginPage() {
  const navigate =
    useNavigate();

  const {
    login
  } = useAuth();

  const [
    email,
    setEmail
  ] = useState("");

  const [
    password,
    setPassword
  ] = useState("");

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
            "/auth/login",
            {
              email,
              password
            }
          );

        login(
          response.data.token,
          response.data.user
        );

        navigate("/");
      } catch (
        loginError
      ) {
        setError(
          loginError
            .response
            ?.data
            ?.message ||
            "Login failed"
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
        <div className="auth-promo">
          <span className="auth-promo-label">
            BLUSH & BLOOM
          </span>

          <div>
            <p className="eyebrow">
              YOUR STYLE SPACE
            </p>

            <h1>
              Your wardrobe missed you.
            </h1>

            <p>
              Sign in to revisit your
              favourites, shopping bag and
              latest orders.
            </p>
          </div>

          <div className="auth-promo-note">
            soft looks • bold moods • your way
          </div>
        </div>

        <form
          className="auth-card"
          onSubmit={
            handleSubmit
          }
        >
          <span className="eyebrow">
            WELCOME BACK
          </span>

          <h2>
            Sign in
          </h2>

          <p className="auth-intro">
            Continue your Blush & Bloom
            shopping journey.
          </p>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <label className="field">
            <span>
              Email address
            </span>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(
                event
              ) =>
                setEmail(
                  event.target
                    .value
                )
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
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={
                  password
                }
                onChange={(
                  event
                ) =>
                  setPassword(
                    event.target
                      .value
                  )
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
              ? "Signing in..."
              : "Sign in"}
          </button>

          <p className="auth-switch">
            New here?{" "}

            <Link to="/register">
              Create an account
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;