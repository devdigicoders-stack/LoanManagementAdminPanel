import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye } from "lucide-react";
import { mockTransactions, statusColors } from "./accountantData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockTransactions.filter(t => 
    t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Transactions</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>View and manage all financial transactions.</p>
        </div>
      </div>

      <div className="rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="relative max-w-sm w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
          <input 
            type="text" placeholder="Search Trans. ID, Customer or Ref..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl text-[13px] outline-none transition-all" 
            style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} 
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="h-10 px-3 rounded-xl text-[13px] outline-none" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }}>
            <option>All Types</option>
            <option>Payment</option>
            <option>Refund</option>
            <option>Expense</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all hover:opacity-80" style={{ background: tc.sky, color: tc.blue }}>
            <Filter size={14} /> Filters
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Transaction ID", "Customer", "Type", "Amount", "Method", "Reference", "Date", "Status", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((trx, i) => {
                const sc = statusColors[trx.status] || { bg: "#F1F5F9", text: "#64748B" };
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-bold" style={{ color: tc.blue }}>{trx.id}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.text }}>{trx.customerName}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: tc.muted }}>{trx.type}</td>
                    <td className="px-4 py-3 font-extrabold" style={{ color: tc.text }}>₹{Number(trx.amount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.muted }}>{trx.method}</td>
                    <td className="px-4 py-3 font-mono text-[11px]" style={{ color: tc.muted }}>{trx.reference}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{trx.date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: sc.bg, color: sc.text }}>{trx.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/accountant/transactions/${trx.id}`} className="flex items-center gap-1 text-[12px] font-bold transition-all hover:opacity-80" style={{ color: tc.blue }}>
                        <Eye size={14} /> View
                      </Link>
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
