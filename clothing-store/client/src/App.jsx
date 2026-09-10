import {
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <div className="app">
      <Navbar />

      <div className="content">
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/products"
            element={
              <ProductsPage />
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProductDetailsPage />
            }
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={
              <RegisterPage />
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="page-message">
                Page not found
              </div>
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;