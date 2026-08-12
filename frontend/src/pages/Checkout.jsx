import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api';
import { CheckCircle2, AlertTriangle, FileText, ArrowRight, NotebookPen, Calendar } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  // Form inputs
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingZip, setShippingZip] = useState('');

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // 1. Guard check: Redirect to auth if not authenticated, redirect to cart if empty
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (cart.length === 0 && !confirmedOrder) {
        navigate('/cart');
      }
    }
  }, [user, cart, authLoading, navigate, confirmedOrder]);

  // Set default shipping name to username if available
  useEffect(() => {
    if (user) {
      setShippingName(user.username.toUpperCase());
    }
  }, [user]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Payload input validation
    if (!shippingName || !shippingAddress || !shippingCity || !shippingZip) {
      setError('Please provide complete shipping ledger records.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Map cart to expected body: array of { productId, quantity }
      const itemsPayload = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      // Call API
      const resultOrder = await ordersApi.placeOrder(itemsPayload);
      
      // Order placed successfully!
      setConfirmedOrder(resultOrder);
      clearCart(); // clear client-side cart
    } catch (err) {
      setError(err.message || 'Order placement failed. Check connection or stock details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="text-center py-24 border-2 border-dashed border-ledgerInk/30 bg-paperWhite/50">
        <span className="font-ledger font-bold animate-pulse text-lg">VERIFYING LEDGER CLIENT...</span>
      </div>
    );
  }

  // Render Confirmation Screen if order was placed in this session
  if (confirmedOrder) {
    const formattedDate = new Date(confirmedOrder.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <div className="max-w-2xl mx-auto">
        {/* Receipt Ledger Graphic */}
        <div className="bg-paperWhite border-2 border-ledgerInk p-8 shadow-vintage rounded-sm relative">
          {/* Jagged paper top border aesthetic */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-vintageRed"></div>
          
          <div className="text-center mb-8 border-b-2 border-ledgerInk pb-6">
            <CheckCircle2 className="w-12 h-12 text-ledgerGrid-dark mx-auto mb-3" />
            <h1 className="text-3xl font-bold font-display uppercase tracking-wider text-ledgerInk">ORDER CERTIFIED</h1>
            <p className="text-xs font-ledger text-ledgerInk-light mt-1">THE GENERAL STORE • OFFICIAL TRANSACTION RECEIPT</p>
          </div>

          <div className="space-y-6 font-ledger text-xs">
            {/* Meta details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-kraft-light border border-ledgerInk p-4 rounded-sm">
              <div>
                <span className="text-ledgerInk-light block">TRANSACTION REF ID:</span>
                <span className="font-bold font-ledger text-sm break-all">{confirmedOrder._id}</span>
              </div>
              <div>
                <span className="text-ledgerInk-light block">CERTIFICATION DATE:</span>
                <span className="font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="border border-ledgerInk/30 p-4 bg-paperWhite-light">
              <span className="font-bold block mb-1 uppercase text-ledgerInk-light border-b border-ledgerInk/10 pb-1">SHIPPING LEDGER LOG</span>
              <p className="font-bold">{shippingName}</p>
              <p>{shippingAddress}</p>
              <p>{shippingCity.toUpperCase()}, {shippingZip}</p>
              <p className="text-[10px] text-ledgerGrid-dark font-bold mt-2">TRANSIT METHOD: REGISTERED MAIL CO.</p>
            </div>

            {/* Items table */}
            <div>
              <span className="font-bold block mb-2 uppercase text-ledgerInk-light">ITEMIZED LEDGER DUPLICATE</span>
              <div className="border border-ledgerInk rounded-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-paperWhite-dark border-b border-ledgerInk text-[10px] font-bold">
                      <th className="p-2 border-r border-ledgerInk">ITEM</th>
                      <th className="p-2 border-r border-ledgerInk text-center">QTY</th>
                      <th className="p-2 text-right">DEBIT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ledgerInk/20">
                    {confirmedOrder.items.map((item) => (
                      <tr key={item.productId} className="bg-paperWhite-light">
                        <td className="p-2 border-r border-ledgerInk">
                          <span className="font-bold block">{item.title}</span>
                          <span className="text-[9px] text-ledgerInk-light">CODE: #{item.productId} @ ${item.price.toFixed(2)} ea</span>
                        </td>
                        <td className="p-2 border-r border-ledgerInk text-center font-bold">{item.quantity}</td>
                        <td className="p-2 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total summary */}
            <div className="border-t-2 border-dashed border-ledgerInk pt-4">
              <div className="flex justify-between items-baseline text-sm font-bold">
                <span className="font-display">TOTAL ACCOUNT DEBIT:</span>
                <span className="text-xl font-ledger text-vintageRed">${confirmedOrder.total.toFixed(2)}</span>
              </div>
              <p className="text-[9px] text-ledgerInk-light mt-1 text-right italic">
                * Prices checked live from database catalogs. Invoice certified by Mongoose Server.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 border-t border-ledgerInk pt-6">
            <button
              onClick={() => navigate('/orders')}
              className="flex-grow flex items-center justify-center gap-2 border border-ledgerInk bg-vintageRed text-paperWhite hover:bg-vintageRed-dark py-2.5 font-ledger font-bold text-xs shadow-vintage-sm hover:shadow-none transition-all rounded-sm"
            >
              <FileText className="w-4 h-4" />
              VIEW HISTORICAL LEDGERS
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-grow flex items-center justify-center gap-2 border border-ledgerInk bg-paperWhite hover:bg-kraft py-2.5 font-ledger font-bold text-xs transition-colors rounded-sm"
            >
              CONTINUE BROWSING CATALOG
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left side: Checkout forms */}
      <section className="flex-grow">
        <div className="bg-paperWhite border-2 border-ledgerInk p-6 md:p-8 shadow-vintage rounded-sm">
          <h1 className="text-2xl font-bold font-display border-b border-ledgerInk pb-2 mb-6 uppercase flex items-center gap-2">
            <NotebookPen className="w-6 h-6 text-vintageRed" />
            SHIPPING & DISPATCH LEDGER
          </h1>

          {error && (
            <div className="mb-6 border border-vintageRed bg-paperWhite-light text-vintageRed p-3 font-ledger text-xs font-bold flex items-center gap-2 rounded-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-4 font-ledger text-xs">
            {/* Dispatch Name */}
            <div>
              <label htmlFor="chk-name" className="block font-bold mb-1 uppercase text-ledgerInk-light">Dispatch Consignee Name</label>
              <input
                id="chk-name"
                type="text"
                required
                className="w-full bg-paperWhite-light border border-ledgerInk px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-vintageRed font-bold"
                placeholder="e.g. JOHN DOE"
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="chk-address" className="block font-bold mb-1 uppercase text-ledgerInk-light">Delivery Street Address</label>
              <input
                id="chk-address"
                type="text"
                required
                className="w-full bg-paperWhite-light border border-ledgerInk px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-vintageRed"
                placeholder="e.g. 123 General Store Lane"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </div>

            {/* City & Zip Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chk-city" className="block font-bold mb-1 uppercase text-ledgerInk-light">City / Municipality</label>
                <input
                  id="chk-city"
                  type="text"
                  required
                  className="w-full bg-paperWhite-light border border-ledgerInk px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-vintageRed"
                  placeholder="e.g. Boston"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="chk-zip" className="block font-bold mb-1 uppercase text-ledgerInk-light">Postal / Zip Index Code</label>
                <input
                  id="chk-zip"
                  type="text"
                  required
                  className="w-full bg-paperWhite-light border border-ledgerInk px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-vintageRed"
                  placeholder="e.g. 02108"
                  value={shippingZip}
                  onChange={(e) => setShippingZip(e.target.value)}
                />
              </div>
            </div>

            {/* Submit checkout */}
            <div className="pt-6 border-t border-ledgerInk/15 mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full border border-ledgerInk bg-vintageRed text-paperWhite hover:bg-vintageRed-dark disabled:bg-paperWhite-dark/60 font-bold py-3 text-sm tracking-wider shadow-vintage-sm hover:shadow-none transition-all flex items-center justify-center gap-2 rounded-sm"
              >
                {isSubmitting ? 'CERTIFYING PURCHASE LEDGER...' : 'CONFIRM & COMPOSE ORDER'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Right side: Invoice item review */}
      <aside className="w-full lg:w-96 flex-shrink-0">
        <div className="bg-paperWhite border-2 border-ledgerInk p-6 shadow-vintage rounded-sm">
          <h2 className="text-lg font-bold font-display border-b border-ledgerInk pb-2 mb-4 uppercase">
            ITEMS UNDER REVIEW
          </h2>

          <ul className="divide-y divide-ledgerInk/10 text-xs font-ledger mb-6 max-h-80 overflow-y-auto pr-2">
            {cart.map((item) => (
              <li key={item.productId} className="py-3 flex justify-between gap-4">
                <div>
                  <span className="font-bold block leading-tight">{item.title}</span>
                  <span className="text-[10px] text-ledgerInk-light">Qty: {item.quantity} • ${item.price.toFixed(2)} ea</span>
                </div>
                <span className="font-bold text-ledgerInk flex-shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 font-ledger text-xs border-t border-ledgerInk pt-4">
            <div className="flex justify-between">
              <span className="text-ledgerInk-light">SUBTOTAL BALANCE:</span>
              <span className="font-bold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ledgerInk-light">DELIVERY TARIFF:</span>
              <span className="font-bold text-ledgerGrid-dark uppercase">FREE TARIFF</span>
            </div>
            
            <div className="ledger-dotted-line h-px w-full my-2"></div>
            
            <div className="bg-kraft-light border border-ledgerInk p-3 rounded-sm">
              <div className="flex justify-between items-baseline">
                <span className="font-bold uppercase">LEDGER BALANCE DUE:</span>
                <span className="text-xl font-bold text-vintageRed">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
