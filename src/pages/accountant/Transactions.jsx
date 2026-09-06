import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye, Loader2, Download } from "lucide-react";
import { statusColors } from "./accountantData";
import toast from "react-hot-toast";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = typeFilter === "All" 
        ? `${import.meta.env.VITE_API_BASE_URL}/transactions`
        : `${import.meta.env.VITE_API_BASE_URL}/transactions?type=${typeFilter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(t => {
    const q = searchTerm.toLowerCase();
    return (
      (t.customerName && t.customerName.toLowerCase().includes(q)) ||
      (t.transactionId && t.transactionId.toLowerCase().includes(q)) ||
      (t.reference && t.reference.toLowerCase().includes(q)) ||
      (t.loanId && t.loanId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>
            Live Transactions Register
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>
            View and manage all financial vouchers synced directly from MongoDB.
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="relative max-w-sm w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
          <input 
            type="text" 
            placeholder="Search Trans. ID, Customer or Ref..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl text-[13px] outline-none transition-all" 
            style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} 
          />
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 rounded-xl text-[13px] outline-none" 
            style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }}
          >
            <option value="All">All Types</option>
            <option value="Collection">Collection</option>
            <option value="Payment">Payment</option>
            <option value="Refund">Refund</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Transaction ID", "Customer / Entity", "Type", "Amount", "Method", "Reference", "Date", "Status", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2 text-[#1e7ba8]" />
                    Loading live vouchers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No transactions matching your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t._id} className="hover:bg-slate-50/50 transition-colors" style={{ borderBottom: `1px solid ${tc.border}` }}>
                    <td className="px-4 py-3 font-bold" style={{ color: tc.blue }}>{t.transactionId}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.text }}>{t.customerName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        t.type === 'Collection' || t.type === 'Payment' ? 'bg-green-100 text-green-700' :
                        t.type === 'Expense' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold" style={{ color: tc.text }}>
                      ₹{Number(t.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3" style={{ color: tc.muted }}>{t.method}</td>
                    <td className="px-4 py-3 font-mono text-[11px]" style={{ color: tc.muted }}>{t.reference}</td>
                    <td className="px-4 py-3" style={{ color: tc.muted }}>
                      {t.date ? new Date(t.date).toLocaleDateString('en-IN') : 'Recent'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700">
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/accountant/transactions/${t._id}`} className="p-1 hover:text-[#1e7ba8] inline-block" style={{ color: tc.muted }}>
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
