import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api';
import { ChevronLeft, Calendar, FileText, ShieldAlert } from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Guard authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const data = await ordersApi.getOrder(id);
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Error loading transaction records.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id, user]);

  if (authLoading || (loading && !order)) {
    return (
      <div className="text-center py-24 border-2 border-dashed border-ledgerInk/30 bg-paperWhite/50 rounded-sm">
        <span className="font-ledger font-bold animate-pulse text-lg">RETRIEVING TRANSACTION ENTRY...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 border-2 border-vintageRed bg-paperWhite p-8 rounded-sm">
        <ShieldAlert className="w-12 h-12 text-vintageRed mx-auto mb-3" />
        <h2 className="font-display text-2xl font-bold text-vintageRed mb-2 font-bold">ACCESS DENIED OR NOT FOUND</h2>
        <p className="font-ledger text-sm text-ledgerInk-light mb-6">
          {error || 'This order does not exist or you do not have permission to view this ledger entry.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/orders')}
            className="border border-ledgerInk bg-paperWhite hover:bg-kraft text-xs font-ledger font-bold px-4 py-2 shadow-vintage-sm transition-all"
          >
            RETURN TO JOURNAL
          </button>
          <button
            onClick={() => navigate('/')}
            className="border border-ledgerInk bg-vintageRed text-paperWhite hover:bg-vintageRed-dark text-xs font-ledger font-bold px-4 py-2 shadow-vintage-sm hover:shadow-none transition-all"
          >
            CATALOG INDEX
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-6">
      {/* Return to Journal */}
      <div>
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-1.5 font-ledger text-xs font-bold border border-ledgerInk bg-paperWhite hover:bg-kraft px-3 py-1.5 shadow-vintage-sm hover:shadow-none transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          RETURN TO JOURNAL INDEX
        </button>
      </div>

      {/* Invoice Details Card */}
      <div className="bg-paperWhite border-2 border-ledgerInk p-8 shadow-vintage max-w-3xl mx-auto rounded-sm relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-vintageRed"></div>
        
        {/* Receipt header */}
        <div className="text-center mb-8 border-b-2 border-ledgerInk pb-6">
          <FileText className="w-12 h-12 text-vintageRed mx-auto mb-3" />
          <h1 className="text-3xl font-bold font-display uppercase tracking-wider text-ledgerInk">TRANSACTION REPORT</h1>
          <p className="text-xs font-ledger text-ledgerInk-light mt-1">THE GENERAL STORE • ARCHIVE JOURNAL COPY</p>
        </div>

        {/* Ledger info summary */}
        <div className="space-y-6 font-ledger text-xs">
          {/* Metadata details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-kraft-light border border-ledgerInk p-4 rounded-sm">
            <div>
              <span className="text-ledgerInk-light block">TRANSACTION REF ID:</span>
              <span className="font-bold font-ledger text-sm break-all">{order._id}</span>
            </div>
            <div>
              <span className="text-ledgerInk-light block">JOURNAL RECORDED DATE:</span>
              <span className="font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Account owner */}
          <div className="border border-ledgerInk/30 p-4 bg-paperWhite-light">
            <span className="font-bold block mb-1 uppercase text-ledgerInk-light border-b border-ledgerInk/10 pb-1">CLIENT REGISTRATION JOURNAL LOG</span>
            <p className="font-bold">CLIENT NAME: {user?.username.toUpperCase()}</p>
            <p>EMAIL ACCOUNT: {user?.email}</p>
            <p className="mt-2">ORDER STATUS: <span className="px-2 py-0.5 border border-ledgerGrid-dark text-ledgerInk bg-[#E5ECE5] font-bold uppercase">{order.status}</span></p>
          </div>

          {/* Table Items details */}
          <div>
            <span className="font-bold block mb-2 uppercase text-ledgerInk-light">ITEMIZED DUPLICATE LIST</span>
            <div className="border border-ledgerInk rounded-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-paperWhite-dark border-b border-ledgerInk text-[10px] font-bold">
                    <th className="p-2 border-r border-ledgerInk">ITEM</th>
                    <th className="p-2 border-r border-ledgerInk text-center">QTY</th>
                    <th className="p-2 text-right">PRICE (SNAPSHOT)</th>
                    <th className="p-2 text-right">DEBIT SUB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ledgerInk/20">
                  {order.items.map((item) => (
                    <tr key={item.productId} className="bg-paperWhite-light">
                      <td className="p-2 border-r border-ledgerInk">
                        <span className="font-bold block">{item.title}</span>
                        <span className="text-[9px] text-ledgerInk-light">CODE: #{item.productId}</span>
                      </td>
                      <td className="p-2 border-r border-ledgerInk text-center font-bold">{item.quantity}</td>
                      <td className="p-2 border-r border-ledgerInk text-right font-bold">${item.price.toFixed(2)}</td>
                      <td className="p-2 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total display */}
          <div className="border-t-2 border-dashed border-ledgerInk pt-4">
            <div className="flex justify-between items-baseline text-sm font-bold">
              <span className="font-display">TOTAL LEDGER ACCOUNT DEBIT:</span>
              <span className="text-xl font-ledger text-vintageRed">${order.total.toFixed(2)}</span>
            </div>
            <p className="text-[9px] text-ledgerInk-light mt-1 text-right italic">
              * Recalculated and certified from live external API databases at checkout.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
