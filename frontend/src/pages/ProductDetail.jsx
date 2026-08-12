import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../api';
import { useCart } from '../context/CartContext'; // will be implemented in Task 7
import { ChevronLeft, ShoppingBag, Plus, Minus, Tag, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Image index and quantity state
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotification, setAddedNotification] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsApi.getProduct(id);
        setProduct(data);
        setActiveImageIdx(0);
      } catch (err) {
        setError(err.message || 'Item details could not be retrieved.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQtyChange = (type) => {
    if (type === 'inc') {
      setQuantity(prev => prev + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedNotification(true);
    setTimeout(() => {
      setAddedNotification(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="text-center py-24 border-2 border-dashed border-ledgerInk/30 bg-paperWhite/50 rounded-sm">
        <span className="font-ledger font-bold animate-pulse text-lg">RETRIEVING SPECIFICATION RECORD...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 border-2 border-vintageRed bg-paperWhite p-8 rounded-sm">
        <h2 className="font-display text-2xl font-bold text-vintageRed mb-2 font-bold">RECORD NOT FOUND</h2>
        <p className="font-ledger text-sm text-ledgerInk-light mb-6">
          {error || `Product record #${id} does not exist in our inventories.`}
        </p>
        <button
          onClick={() => navigate('/')}
          className="border border-ledgerInk bg-paperWhite hover:bg-kraft text-xs font-ledger font-bold px-4 py-2 shadow-vintage-sm transition-all"
        >
          RETURN TO CATALOG
        </button>
      </div>
    );
  }

  // Get images list
  const images = product.images || [product.thumbnail];

  return (
    <div className="space-y-6">
      {/* Return to Catalog Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 font-ledger text-xs font-bold border border-ledgerInk bg-paperWhite hover:bg-kraft px-3 py-1.5 shadow-vintage-sm hover:shadow-none transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          BACK TO ARCHIVES
        </button>
      </div>

      {/* Detail Layout */}
      <div className="bg-paperWhite border-2 border-ledgerInk shadow-vintage p-6 md:p-8 flex flex-col lg:flex-row gap-8 rounded-sm">
        
        {/* Left Side: Images Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {/* Main Image Frame */}
          <div className="border border-ledgerInk bg-paperWhite-light flex items-center justify-center p-6 h-96 relative rounded-sm">
            <img
              src={images[activeImageIdx]}
              alt={product.title}
              className="object-contain max-h-full max-w-full mix-blend-multiply"
            />
            
            {/* Tag Overlay */}
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 text-[10px] font-ledger bg-paperWhite border border-ledgerInk px-2 py-1 shadow-vintage-sm">
              <Tag className="w-3 h-3 text-vintageRed" />
              RECORD CODE: #{product.id.toString().padStart(4, '0')}
            </span>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 p-1 border bg-paperWhite-light hover:bg-kraft-light transition-all rounded-sm ${
                    idx === activeImageIdx ? 'border-2 border-vintageRed' : 'border-ledgerInk/30'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="object-contain w-full h-full mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Ledger Record Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div>
            {/* Category / Rating */}
            <div className="flex justify-between items-center text-xs font-ledger border-b border-ledgerInk/20 pb-2 mb-4">
              <span className="uppercase text-vintageRed font-bold tracking-wider">{product.category}</span>
              <span className="text-ledgerInk-light">RATING: {product.rating} / 5.0</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold font-display text-ledgerInk mb-2 leading-tight">
              {product.title}
            </h1>
            
            {/* Brand / Stock status */}
            <div className="flex items-center gap-4 text-xs font-ledger text-ledgerInk-light mb-6">
              <span>BRAND: {product.brand || 'General Store Goods'}</span>
              <span>•</span>
              <span className={product.stock > 0 ? 'text-ledgerInk' : 'text-vintageRed font-bold'}>
                STOCK: {product.stock > 0 ? `${product.stock} units available` : 'OUT OF STOCK'}
              </span>
            </div>

            {/* Price Ledger display */}
            <div className="bg-kraft-light border border-ledgerInk p-4 mb-6 relative shadow-vintage-sm rounded-sm">
              <span className="text-[10px] font-ledger text-ledgerInk-light block uppercase tracking-wider">UNIT DEBIT PRICE</span>
              <span className="text-3xl font-bold font-ledger text-vintageRed">${product.price.toFixed(2)}</span>
            </div>

            {/* Description */}
            <div className="mb-6 font-body text-sm text-ledgerInk-light leading-relaxed">
              <p className="font-ledger font-bold text-xs text-ledgerInk mb-1">SPECIFICATION & UTILITY:</p>
              {product.description}
            </div>

            {/* Specifications Ledger details */}
            <div className="border border-ledgerInk/40 bg-paperWhite-light p-4 rounded-sm text-xs font-ledger space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-ledgerInk-light">SKU IDENTIFIER:</span>
                <span className="font-bold">{product.sku || 'N/A'}</span>
              </div>
              <div className="ledger-dotted-line h-px w-full"></div>
              <div className="flex justify-between">
                <span className="text-ledgerInk-light">WEIGHT RECORD:</span>
                <span className="font-bold">{product.weight ? `${product.weight}g` : 'N/A'}</span>
              </div>
              <div className="ledger-dotted-line h-px w-full"></div>
              <div className="flex justify-between">
                <span className="text-ledgerInk-light">DIMENSION WIDTH/HEIGHT:</span>
                <span className="font-bold">
                  {product.dimensions ? `${product.dimensions.width} x ${product.dimensions.height} cm` : 'Standard'}
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="border-t border-ledgerInk/20 pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
              
              {/* Quantity Selector */}
              <div className="flex items-center border border-ledgerInk bg-paperWhite-light shadow-vintage-sm rounded-sm">
                <button
                  type="button"
                  onClick={() => handleQtyChange('dec')}
                  className="px-3 py-2 text-ledgerInk hover:bg-kraft hover:text-vintageRed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-2 font-ledger font-bold text-center min-w-[3rem]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQtyChange('inc')}
                  className="px-3 py-2 text-ledgerInk hover:bg-kraft hover:text-vintageRed transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-grow flex items-center justify-center gap-2 border border-ledgerInk bg-vintageRed text-paperWhite hover:bg-vintageRed-dark disabled:bg-paperWhite-dark/50 disabled:text-ledgerInk-light/50 font-ledger font-bold py-2 px-6 shadow-vintage-sm hover:shadow-none transition-all rounded-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                ADD TO CART LEDGER
              </button>
            </div>

            {/* Added Confirmation Banner */}
            {addedNotification && (
              <div className="mt-4 flex items-center gap-2 text-xs font-ledger text-ledgerInk bg-ledgerGrid-light border border-ledgerInk p-2.5 animate-fadeIn rounded-sm">
                <CheckCircle2 className="w-4 h-4 text-ledgerInk" />
                <span>Added {quantity} unit(s) of "{product.title}" to cart ledger.</span>
              </div>
            )}

            {/* Security Guarantee label */}
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-ledger text-ledgerInk-light">
              <ShieldCheck className="w-3.5 h-3.5 text-ledgerGrid-dark" />
              <span>Catalog price certified by The General Store. Recalculated server-side at checkout.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
