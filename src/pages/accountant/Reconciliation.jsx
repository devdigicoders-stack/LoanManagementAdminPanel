import { useState } from "react";
import { Search, Filter, CheckCircle, AlertTriangle } from "lucide-react";
import { mockTransactions, statusColors } from "./accountantData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function Reconciliation() {
  const [searchTerm, setSearchTerm] = useState("");

  const reconData = mockTransactions.map(t => ({
    ...t,
    actualAmount: t.id === "TRX-89238" ? 0 : t.amount,
    diff: t.id === "TRX-89238" ? t.amount : 0,
    reconStatus: t.id === "TRX-89238" ? "Unmatched" : "Matched"
  }));

  const filtered = reconData.filter(t => 
    t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Payment Reconciliation</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Match recorded transactions with actual bank, UPI or payment records.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Total Trans.", val: "1,245", col: tc.text },
          { label: "Matched", val: "1,200", col: "#15803D" },
          { label: "Unmatched", val: "15", col: "#DC2626" },
          { label: "Pending", val: "30", col: "#D97706" },
          { label: "Difference", val: "₹18.5K", col: tc.blue }
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-2xl flex flex-col items-center justify-center text-center" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <p className="text-[12px] font-bold mb-1" style={{ color: tc.muted }}>{s.label}</p>
            <p className="text-[20px] font-black" style={{ color: s.col }}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="relative max-w-sm w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
          <input 
            type="text" placeholder="Search Ref Number or Trans. ID..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl text-[13px] outline-none transition-all" 
            style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} 
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all hover:opacity-80" style={{ background: tc.sky, color: tc.blue }}>
          <Filter size={14} /> Filters
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Transaction ID", "Reference Number", "System Amt", "Actual Amt", "Difference", "Date", "Status", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((trx, i) => {
                const sc = statusColors[trx.reconStatus] || { bg: "#F1F5F9", text: "#64748B" };
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-bold" style={{ color: tc.blue }}>{trx.id}</td>
                    <td className="px-4 py-3 font-mono text-[11px]" style={{ color: tc.text }}>{trx.reference}</td>
                    <td className="px-4 py-3 font-extrabold" style={{ color: tc.text }}>₹{Number(trx.amount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-extrabold" style={{ color: trx.actualAmount === 0 ? "#DC2626" : "#15803D" }}>₹{Number(trx.actualAmount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-black" style={{ color: trx.diff > 0 ? "#DC2626" : tc.muted }}>₹{Number(trx.diff).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{trx.date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: sc.bg, color: sc.text }}>{trx.reconStatus}</span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      {trx.reconStatus === "Matched" ? (
                        <button className="flex items-center justify-center p-1.5 rounded-lg opacity-50 cursor-not-allowed" style={{ background: tc.bg, color: tc.muted }} disabled>
                          <CheckCircle size={14} />
                        </button>
                      ) : (
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all" style={{ background: tc.sky, color: tc.blue }}>
                          Match
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
