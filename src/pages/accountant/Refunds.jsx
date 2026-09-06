import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function Refunds() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/transactions?type=Refund`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRefunds(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load refunds");
    } finally {
      setLoading(false);
    }
  };

  const totalRefunded = refunds.reduce((acc, r) => acc + (r.amount || 0), 0);

  const filtered = refunds.filter(r => 
    (r.customerName && r.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.transactionId && r.transactionId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.reference && r.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Refunds & Security Releases</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>
            Live tracking of customer security and fee refunds from MongoDB.
          </p>
        </div>
        <Link to="/accountant/refunds/request" className="px-4 py-2 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90 shadow-sm" style={{ background: tc.blue }}>
          + Process Refund
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Refunded", val: `₹${totalRefunded.toLocaleString('en-IN')}`, col: tc.text },
          { label: "Total Claims", val: refunds.length.toString(), col: tc.blue },
          { label: "Processing", val: refunds.filter(r => r.status === "Processing" || r.status === "Pending").length.toString(), col: "#D97706" },
          { label: "Completed", val: refunds.filter(r => r.status === "Completed").length.toString(), col: "#15803D" }
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-2xl flex flex-col items-center justify-center text-center" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <p className="text-[12px] font-bold mb-1" style={{ color: tc.muted }}>{s.label}</p>
            <p className="text-[20px] font-black" style={{ color: s.col }}>{loading ? "..." : s.val}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="relative max-w-sm w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
          <input 
            type="text" placeholder="Search Refund ID, Customer or Ref..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl text-[13px] outline-none transition-all" 
            style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} 
          />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Refund ID", "Customer Name", "Reason / Category", "Amount", "Method", "Date", "Status", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2 text-[#1e7ba8]" />
                    Loading refunds...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No refunds recorded.
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r._id} className="hover:bg-slate-50/50 transition-colors" style={{ borderBottom: `1px solid ${tc.border}` }}>
                    <td className="px-4 py-3 font-bold" style={{ color: tc.blue }}>{r.transactionId}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.text }}>{r.customerName}</td>
                    <td className="px-4 py-3" style={{ color: tc.muted }}>{r.reason || r.category || 'Refund'}</td>
                    <td className="px-4 py-3 font-extrabold text-amber-700">
                      ₹{Number(r.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3" style={{ color: tc.muted }}>{r.method}</td>
                    <td className="px-4 py-3" style={{ color: tc.muted }}>
                      {r.date ? new Date(r.date).toLocaleDateString('en-IN') : 'Recent'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        r.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/accountant/transactions/${r._id}`} className="p-1 hover:text-[#1e7ba8] inline-block" style={{ color: tc.muted }}>
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
