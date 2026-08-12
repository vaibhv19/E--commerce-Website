import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api';
import { BookText, Eye, AlertCircle, ShoppingBag } from 'lucide-react';

export default function OrderHistory() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authenticate guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const data = await ordersApi.getOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Failed to retrieve historical ledgers.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (authLoading || (loading && orders.length === 0)) {
    return (
      <div className="text-center py-24 border-2 border-dashed border-ledgerInk/30 bg-paperWhite/50 rounded-sm">
        <span className="font-ledger font-bold animate-pulse text-lg">CONSULTING HISTORICAL JOURNAL...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 border-2 border-vintageRed bg-paperWhite p-8 rounded-sm">
        <h2 className="font-display text-2xl font-bold text-vintageRed mb-2 font-bold flex items-center justify-center gap-2">
          <AlertCircle className="w-6 h-6" />
          JOURNAL LOAD FAILURE
        </h2>
        <p className="font-ledger text-sm text-ledgerInk-light mb-6">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="border border-ledgerInk bg-paperWhite hover:bg-kraft text-xs font-ledger font-bold px-4 py-2 shadow-vintage-sm transition-all"
        >
          RETRY REQUEST
        </button>
      </div>
    );
  }

  return (
    <div className="bg-paperWhite border-2 border-ledgerInk shadow-vintage p-6 md:p-8 rounded-sm">
      {/* Header */}
      <div className="border-b-2 border-ledgerInk pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display uppercase tracking-tight flex items-center gap-2">
            <BookText className="w-6 h-6 text-vintageRed" />
            HISTORICAL TRANSACTION JOURNAL
          </h1>
          <p className="text-xs font-ledger text-ledgerInk-light mt-1">
            Registered accounts records of purchases for client {user?.username.toUpperCase()}
          </p>
        </div>
        <div className="bg-paperWhite-dark border border-ledgerInk px-3 py-1.5 font-ledger text-xs font-bold">
          TOTAL ENTRIES: {orders.length}
        </div>
      </div>

      {/* Table Ledger view */}
      {orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-ledgerInk/20 bg-paperWhite-light p-8 rounded-sm">
          <h3 className="font-display text-xl font-bold mb-2">NO JOURNAL RECORDS FOUND</h3>
          <p className="font-ledger text-xs text-ledgerInk-light mb-6">
            You do not have any transaction entries recorded in this ledger.
          </p>
          <button
            onClick={() => navigate('/')}
            className="border border-ledgerInk bg-vintageRed text-paperWhite hover:bg-vintageRed-dark px-4 py-2 font-ledger text-xs font-bold shadow-vintage-sm hover:shadow-none transition-all rounded-sm flex items-center gap-2 mx-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            SHOP CATALOG
          </button>
        </div>
      ) : (
        <div className="border border-ledgerInk rounded-sm overflow-hidden shadow-vintage-sm">
          {/* Scrollable table on smaller mobile viewports */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-ledger text-xs">
              <thead>
                <tr className="bg-[#E2DDD3] border-b-2 border-ledgerInk text-[10px] font-bold">
                  <th className="p-3 border-r border-ledgerInk">DATE</th>
                  <th className="p-3 border-r border-ledgerInk">LEDGER ID CODE</th>
                  <th className="p-3 border-r border-ledgerInk">ITEMS SUMMARY</th>
                  <th className="p-3 border-r border-ledgerInk text-right">DEBIT ACCOUNT</th>
                  <th className="p-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ledgerInk/30 bg-paperWhite-light">
                {orders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  });

                  // Create description summary
                  const descSummary = order.items.map(item => `${item.title} (x${item.quantity})`).join(', ');

                  return (
                    <tr key={order._id} className="hover:bg-kraft-light/30 transition-colors">
                      {/* Date */}
                      <td className="p-3 border-r border-ledgerInk whitespace-nowrap font-bold text-ledgerInk-light">
                        {dateStr}
                      </td>

                      {/* ID */}
                      <td className="p-3 border-r border-ledgerInk whitespace-nowrap text-[10px] font-bold tracking-tight">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>

                      {/* Description summary */}
                      <td className="p-3 border-r border-ledgerInk max-w-xs md:max-w-md truncate">
                        {descSummary}
                      </td>

                      {/* Total */}
                      <td className="p-3 border-r border-ledgerInk text-right whitespace-nowrap font-bold text-vintageRed text-sm">
                        ${order.total.toFixed(2)}
                      </td>

                      {/* Action */}
                      <td className="p-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/orders/${order._id}`)}
                          className="inline-flex items-center gap-1 border border-ledgerInk bg-paperWhite hover:bg-kraft px-2.5 py-1 text-[10px] font-bold shadow-vintage-sm hover:shadow-none transition-all rounded-sm"
                          aria-label={`View order details for code #${order._id.substring(order._id.length - 8).toUpperCase()}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          VIEW ENTRY
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
