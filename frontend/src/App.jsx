import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import Auth from './pages/Auth';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-kraft text-ledgerInk">
        {/* Navigation Header */}
        <header className="border-b-2 border-ledgerInk bg-paperWhite px-6 py-4 flex justify-between items-center shadow-vintage-sm">
          <div>
            <a href="/" className="font-display text-2xl font-bold tracking-wide text-vintageRed hover:text-vintageRed-dark transition-colors">
              THE GENERAL STORE
            </a>
            <p className="text-xs font-ledger text-ledgerInk-light mt-0.5">EST. 2026 • LEDGER CATALOG</p>
          </div>
          <nav className="flex space-x-6 font-ledger text-sm font-bold">
            <a href="/" className="hover:text-vintageRed transition-colors">CATALOG</a>
            <a href="/cart" className="hover:text-vintageRed transition-colors">CART</a>
            <a href="/orders" className="hover:text-vintageRed transition-colors">ORDERS</a>
            <a href="/auth" className="hover:text-vintageRed transition-colors">ACCOUNT</a>
          </nav>
        </header>

        {/* Main Content Area */}
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
    </Router>
  );
}
