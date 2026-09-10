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
} from "../context/AuthContext";

function LoginPage() {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [
    email,
    setEmail
  ] = useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const [
    error,
    setError
  ] = useState("");

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

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
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Login failed"
        );
      }
    };

  return (
    <main className="auth-page">
      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >
        <span className="eyebrow">
          WELCOME BACK
        </span>

        <h1>Login</h1>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          required
        />

        <button className="btn btn-dark">
          Login
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;