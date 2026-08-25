import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye } from "lucide-react";
import { mockRefunds, statusColors } from "./accountantData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function Refunds() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockRefunds.filter(r => 
    r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Refund Management</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Track and manage eligible customer refunds.</p>
        </div>
        <Link to="/accountant/refunds/request" className="px-4 py-2 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90 shadow-sm" style={{ background: tc.blue }}>
          + Request Refund
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Refunds", val: "₹12.5K", col: tc.text },
          { label: "Pending", val: "4", col: "#D97706" },
          { label: "Completed", val: "15", col: "#15803D" },
          { label: "Cancelled", val: "2", col: "#DC2626" }
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
            type="text" placeholder="Search Refund ID or Customer..." 
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
                {["Refund ID", "Customer", "Payment ID", "Refund Amount", "Reason", "Request Date", "Status", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ref, i) => {
                const sc = statusColors[ref.status] || { bg: "#F1F5F9", text: "#64748B" };
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-bold" style={{ color: tc.blue }}>{ref.id}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.text }}>{ref.customerName}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.blue }}>{ref.paymentId}</td>
                    <td className="px-4 py-3 font-extrabold" style={{ color: tc.text }}>₹{Number(ref.amount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.muted }}>{ref.reason}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{ref.date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: sc.bg, color: sc.text }}>{ref.status}</span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: tc.blue }} title="View">
                        <Eye size={14} />
                      </button>
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
