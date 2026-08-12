import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, cartTotal, updateQuantity, removeFromCart, setRedirectAfterAuth } = useCart();
  const { user } = useAuth();

  const handleCheckoutAttempt = () => {
    if (user) {
      navigate('/checkout');
    } else {
      // Remember where to send them after successful login
      setRedirectAfterAuth('/checkout');
      navigate('/auth');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 border-2 border-dashed border-ledgerInk/30 bg-paperWhite p-8 rounded-sm">
        <h2 className="font-display text-2xl font-bold mb-4">YOUR CART LEDGER IS EMPTY</h2>
        <p className="font-ledger text-sm text-ledgerInk-light mb-8">
          You have not marked any catalog items for purchase yet. Browse our selection first.
        </p>
        <button
          onClick={() => navigate('/')}
          className="border border-ledgerInk bg-vintageRed text-paperWhite hover:bg-vintageRed-dark px-6 py-2.5 font-ledger text-xs font-bold shadow-vintage-sm hover:shadow-none transition-all rounded-sm"
        >
          RETURN TO CATALOG INDEX
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Left side: Wares list styled as string-tied price tags */}
      <section className="flex-grow space-y-6">
        <div className="border-b border-ledgerInk pb-2 mb-4">
          <h1 className="text-2xl font-bold font-display uppercase tracking-tight">SELECTED CATALOG ITEMS</h1>
          <p className="text-xs font-ledger text-ledgerInk-light mt-1">
            Review your order items before processing the final checkout.
          </p>
        </div>

        <div className="space-y-6">
          {cart.map((item) => {
            const itemTotal = item.price * item.quantity;
            return (
              <div
                key={item.productId}
                className="relative bg-paperWhite-light border-2 border-ledgerInk p-6 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-vintage rounded-sm overflow-hidden"
              >
                {/* Visual String-Tied Tag details */}
                {/* Left Cut-off Corner Tag design */}
                <div className="absolute top-0 bottom-0 left-0 w-3 bg-vintageRed border-r border-ledgerInk"></div>
                
                {/* Manila Tag Hole with String loop */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center">
                  {/* The Hole */}
                  <div className="w-4 h-4 rounded-full border border-ledgerInk bg-kraft-dark shadow-inner z-10"></div>
                  {/* The String (rendered as a thin line heading towards the left edge) */}
                  <svg className="absolute right-2 w-10 h-10 -top-3 overflow-visible pointer-events-none" stroke="#8E7355" strokeWidth="1.5" fill="none">
                    <path d="M 0,16 C -10,12 -20,20 -35,8" />
                  </svg>
                </div>

                {/* Left Side: Product Info */}
                <div className="pl-10 flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 object-contain border border-ledgerInk/20 bg-paperWhite p-1 rounded-sm flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-ledger text-ledgerInk-light block">CODE: #{item.productId.toString().padStart(4, '0')}</span>
                    <h3 className="font-display font-bold text-base leading-tight hover:text-vintageRed cursor-pointer"
                        onClick={() => navigate(`/product/${item.productId}`)}>
                      {item.title}
                    </h3>
                    <span className="text-xs font-ledger text-vintageRed mt-1 block">
                      Unit price: ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Right Side: Quantity Adjuster & Total Price */}
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-ledgerInk/10 pt-4 sm:pt-0">
                  {/* Quantity adjustment */}
                  <div className="flex items-center border border-ledgerInk bg-paperWhite shadow-vintage-sm rounded-sm">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 text-ledgerInk hover:bg-kraft hover:text-vintageRed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 font-ledger text-xs font-bold text-center min-w-[2.5rem]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 text-ledgerInk hover:bg-kraft hover:text-vintageRed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[5rem]">
                    <span className="text-[9px] font-ledger text-ledgerInk-light block uppercase leading-none">TOTAL DEBIT</span>
                    <span className="font-ledger font-bold text-sm text-ledgerInk">
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 border border-ledgerInk/20 hover:border-vintageRed hover:bg-vintageRed/10 text-ledgerInk-light hover:text-vintageRed transition-colors rounded-sm"
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Right side: Ledger Invoice Summary */}
      <aside className="w-full xl:w-96 flex-shrink-0">
        <div className="bg-paperWhite border-2 border-ledgerInk p-6 shadow-vintage rounded-sm sticky top-6">
          <h2 className="text-lg font-bold font-display border-b border-ledgerInk pb-2 mb-4 uppercase">
            LEDGER SUMMARY
          </h2>

          <div className="space-y-3 font-ledger text-xs">
            <div className="flex justify-between">
              <span className="text-ledgerInk-light">TOTAL DEBIT COUNT:</span>
              <span className="font-bold">{cart.reduce((s, i) => s + i.quantity, 0)} units</span>
            </div>
            
            <div className="ledger-dotted-line h-px w-full my-2"></div>
            
            <div className="flex justify-between">
              <span className="text-ledgerInk-light">SUBTOTAL BALANCE:</span>
              <span className="font-bold">${cartTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-ledgerInk-light">POSTAGE & FREIGHT:</span>
              <span className="font-bold text-ledgerGrid-dark uppercase">FREE TRANSIT</span>
            </div>

            <div className="ledger-dotted-line h-px w-full my-2"></div>

            <div className="bg-kraft-light border border-ledgerInk p-4 rounded-sm">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-xs uppercase">TOTAL DEBIT DUE:</span>
                <span className="text-2xl font-bold text-vintageRed">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleCheckoutAttempt}
              className="w-full flex items-center justify-center gap-2 border border-ledgerInk bg-vintageRed text-paperWhite hover:bg-vintageRed-dark font-ledger font-bold py-3 px-4 shadow-vintage-sm hover:shadow-none transition-all rounded-sm"
            >
              PROCEED TO CHECKOUT
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 border border-ledgerInk bg-paperWhite hover:bg-kraft text-xs font-ledger font-bold py-2 px-4 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              CONTINUE BROWSING
            </button>
          </div>

          {/* Secure disclaimer */}
          <p className="mt-4 text-[10px] font-ledger text-ledgerInk-light text-center">
            Checkout requires a signed ledger account. All catalog prices verified live by server.
          </p>
        </div>
      </aside>
    </div>
  );
}
