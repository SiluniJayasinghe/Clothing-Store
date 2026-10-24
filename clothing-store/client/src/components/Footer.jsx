import {
  Link
} from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-block">
          <Link
            to="/"
            className="footer-brand"
          >
            BLUSH & BLOOM
          </Link>

          <p>
            Fresh, feminine fashion made for
            everyday confidence — from casual
            days to your favourite nights out.
          </p>
        </div>

        <div>
          <h4>Shop</h4>

          <Link to="/products">
            All styles
          </Link>

          <Link to="/products?sort=newest">
            New in
          </Link>

          <Link to="/wishlist">
            Wishlist
          </Link>
        </div>

        <div>
          <h4>My account</h4>

          <Link to="/profile">
            Profile
          </Link>

          <Link to="/orders">
            Orders
          </Link>

          <Link to="/cart">
            Shopping bag
          </Link>
        </div>

        <div>
          <h4>Our promise</h4>

          <p>Easy browsing</p>
          <p>Secure account access</p>
          <p>Simple checkout</p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Blush & Bloom
        </span>

        <span>
          Women's fashion • Sri Lanka
        </span>
      </div>
    </footer>
  );
}

export default Footer;