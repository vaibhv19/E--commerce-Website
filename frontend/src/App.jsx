import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import Auth from './pages/Auth';
import { ShoppingBag, LogOut, User } from 'lucide-react';

function Header() {
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();

  return (
    <header className="border-b-2 border-ledgerInk bg-paperWhite px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-vintage-sm">
      <div className="flex justify-between items-center w-full md:w-auto">
        <Link to="/" className="block">
          <span className="font-display text-2xl font-bold tracking-wide text-vintageRed hover:text-vintageRed-dark transition-colors">
            THE GENERAL STORE
          </span>
          <span className="text-[10px] font-ledger text-ledgerInk-light block mt-0.5 uppercase">EST. 2026 • GENERAL mail-order ledger</span>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-6 font-ledger text-xs font-bold w-full md:w-auto justify-between md:justify-end">
        {/* Navigation links */}
        <nav className="flex space-x-6">
          <Link to="/" className="hover:text-vintageRed transition-colors">CATALOG</Link>
          <Link to="/orders" className="hover:text-vintageRed transition-colors">JOURNAL</Link>
        </nav>

        {/* User Session Info / Quick Access */}
        <div className="flex items-center gap-4 border-l border-ledgerInk/20 pl-4">
          {/* Cart Indicator */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1.5 border border-ledgerInk bg-paperWhite hover:bg-kraft px-2.5 py-1.5 shadow-vintage-sm hover:shadow-none transition-all"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-vintageRed" />
            <span>CART</span>
            {cartItemCount > 0 && (
              <span className="bg-vintageRed text-paperWhite text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-0.5">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Account Indicator */}
          {user ? (
            <div className="flex items-center gap-2 text-ledgerInk">
              <span className="font-ledger text-ledgerInk-light hidden sm:inline flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {user.username.toUpperCase()}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1 border border-ledgerInk bg-paperWhite-dark hover:bg-kraft text-ledgerInk-light hover:text-vintageRed px-2 py-1.5 transition-colors"
                title="Log out from ledger"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">LOG OUT</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1 border border-ledgerInk bg-paperWhite-dark hover:bg-kraft px-2.5 py-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>SIGN IN</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-kraft text-ledgerInk">
      <Header />
      
      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-ledgerInk-light bg-paperWhite-dark/30 px-6 py-6 text-center text-xs font-ledger text-ledgerInk-light">
        <p>© 2026 THE GENERAL STORE CO. • ALL RIGHTS RESERVED</p>
        <p className="mt-1">IBM FULL STACK WEB DEVELOPMENT • PORTFOLIO PROJECT MODULE V</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainLayout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
