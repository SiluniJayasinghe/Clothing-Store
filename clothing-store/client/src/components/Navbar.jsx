import { useEffect, useState } from "react";

import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { BagIcon, CloseIcon, HeartIcon, MenuIcon, UserIcon } from "./Icons";

function Navbar() {
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const [accountOpen, setAccountOpen] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    logout();

    setMenuOpen(false);
    setAccountOpen(false);

    navigate("/");
  };

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <>
      <div className="announcement-bar">
        <span>Free islandwide delivery on orders over Rs. 10,000</span>

        <span className="announcement-dot">•</span>

        <span>Fresh styles for every mood</span>
      </div>

      <header className="navbar">
        <button
          className="icon-button mobile-menu-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon size={23} />
        </button>

        <Link to="/" className="brand" aria-label="Blush and Bloom home">
          <span className="brand-main">BLUSH</span>

          <span className="brand-mark">&</span>

          <span className="brand-main">BLOOM</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navClass}>
            Shop
          </NavLink>

          <Link to="/products?sort=newest" className="nav-link">
            New In
          </Link>

          {user && (
            <NavLink to="/orders" className={navClass}>
              My Orders
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <div className="account-menu-wrap">
                <button
                  className="icon-button"
                  onClick={() => setAccountOpen((current) => !current)}
                  aria-label="Account menu"
                >
                  <UserIcon />
                </button>

                {accountOpen && (
                  <div className="account-dropdown">
                    <div className="account-dropdown-header">
                      <strong>Hi, {user.firstName}</strong>

                      <span>{user.email}</span>
                    </div>

                    <Link to="/profile" onClick={() => setAccountOpen(false)}>
                      My Profile
                    </Link>

                    <Link to="/orders" onClick={() => setAccountOpen(false)}>
                      My Orders
                    </Link>

                    <div className="account-dropdown-divider" />

                    <button
                      type="button"
                      className="account-logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <Link
                className="icon-button"
                to="/wishlist"
                aria-label="Wishlist"
              >
                <HeartIcon />
              </Link>

              <Link
                className="icon-button"
                to="/cart"
                aria-label="Shopping bag"
              >
                <BagIcon />
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-login" to="/login">
                Login
              </Link>

              <Link className="btn btn-primary nav-register" to="/register">
                Join us
              </Link>
            </>
          )}
        </div>
      </header>

      <div
        className={`mobile-drawer-backdrop ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <aside className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-top">
          <div className="mobile-brand">BLUSH & BLOOM</div>

          <button
            className="icon-button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {user && (
          <div className="mobile-greeting">
            <span>Hi, {user.firstName}</span>

            <small>Welcome back to your wardrobe.</small>
          </div>
        )}

        <nav className="mobile-nav">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navClass}>
            Shop all
          </NavLink>

          <Link to="/products?sort=newest" className="nav-link">
            New in
          </Link>

          {user && (
            <>
              <NavLink to="/wishlist" className={navClass}>
                Wishlist
              </NavLink>

              <NavLink to="/cart" className={navClass}>
                Shopping bag
              </NavLink>

              <NavLink to="/orders" className={navClass}>
                My orders
              </NavLink>

              <NavLink to="/profile" className={navClass}>
                My profile
              </NavLink>

              <button className="mobile-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          {!user && (
            <div className="mobile-auth-actions">
              <Link to="/login" className="btn btn-outline full-width">
                Login
              </Link>

              <Link to="/register" className="btn btn-primary full-width">
                Create account
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}

export default Navbar;
