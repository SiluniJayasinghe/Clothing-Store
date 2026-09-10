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

function RegisterPage() {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

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
    error,
    setError
  ] = useState("");

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
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Registration failed"
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
          CREATE ACCOUNT
        </span>

        <h1>Join THREAD</h1>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <input
          name="firstName"
          placeholder="First name"
          value={form.firstName}
          onChange={handleChange}
          required
        />

        <input
          name="lastName"
          placeholder="Last name"
          value={form.lastName}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          minLength="6"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className="btn btn-dark">
          Register
        </button>

        <p>
          Already registered?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}

export default RegisterPage;