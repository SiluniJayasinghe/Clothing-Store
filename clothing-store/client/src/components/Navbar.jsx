import {
  Link,
  NavLink
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

function Navbar() {
  const {
    user,
    logout
  } = useAuth();

  return (
    <header className="navbar">
      <Link
        to="/"
        className="logo"
      >
        THREAD
      </Link>

      <nav>
        <NavLink to="/">
          Home
        </NavLink>

        <NavLink to="/products">
          Shop
        </NavLink>

        {user && (
          <>
            <NavLink to="/wishlist">
              Wishlist
            </NavLink>

            <NavLink to="/cart">
              Cart
            </NavLink>

            <NavLink to="/orders">
              Orders
            </NavLink>

            <NavLink to="/profile">
              Profile
            </NavLink>
          </>
        )}
      </nav>

      <div className="nav-auth">
        {user ? (
          <>
            <span>
              Hi, {user.firstName}
            </span>

            <button
              className="link-button"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-dark"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;