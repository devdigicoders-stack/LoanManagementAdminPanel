import { useState, useEffect } from "react";
import { Search, Filter, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function Reconciliation() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load transactions for reconciliation");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMatch = async (id, currentAction) => {
    const nextAction = currentAction === "Matched" ? "Unmatched" : "Matched";
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: nextAction })
      });
      if (res.ok) {
        setTransactions(prev => prev.map(t => t._id === id ? { ...t, action: nextAction } : t));
        toast.success(`Transaction marked as ${nextAction}`);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const matchedCount = transactions.filter(t => t.action === "Matched").length;
  const unmatchedCount = transactions.filter(t => t.action === "Unmatched" || t.action === "Pending").length;

  const filtered = transactions.filter(t => 
    (t.reference && t.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.transactionId && t.transactionId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.customerName && t.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Payment Reconciliation</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>
            Match recorded MongoDB transactions with bank statement UTR numbers in realtime.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Recorded", val: transactions.length.toString(), col: tc.text },
          { label: "Matched", val: matchedCount.toString(), col: "#15803D" },
          { label: "Unmatched / Pending", val: unmatchedCount.toString(), col: "#DC2626" },
          { label: "Match Rate", val: transactions.length ? `${Math.round((matchedCount / transactions.length) * 100)}%` : "100%", col: tc.blue }
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
            type="text" placeholder="Search Ref Number, Trans. ID or Customer..." 
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
                {["Transaction ID", "Customer / Entity", "Method", "Reference", "Voucher Amount", "Status", "Reconciliation", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2 text-[#1e7ba8]" />
                    Loading reconciliation data...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No transactions matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t._id} className="hover:bg-slate-50/50 transition-colors" style={{ borderBottom: `1px solid ${tc.border}` }}>
                    <td className="px-4 py-3 font-bold" style={{ color: tc.blue }}>{t.transactionId}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.text }}>{t.customerName}</td>
                    <td className="px-4 py-3" style={{ color: tc.muted }}>{t.method}</td>
                    <td className="px-4 py-3 font-mono text-[11px]" style={{ color: tc.text }}>{t.reference}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: tc.text }}>
                      ₹{Number(t.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700">
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        t.action === "Matched" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {t.action || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleToggleMatch(t._id, t.action)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          t.action === "Matched" 
                            ? "bg-rose-50 text-rose-600 hover:bg-rose-100" 
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {t.action === "Matched" ? "Unmatch" : "Match UTR"}
                      </button>
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
