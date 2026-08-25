import { useState } from "react";
import { Search, Filter, Eye, Phone } from "lucide-react";
import { mockOutstanding, statusColors } from "./accountantData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function OutstandingPayments() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockOutstanding.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.loanId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Outstanding Payments</h1>
        <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Track pending and overdue customer payments.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Total Outstanding", val: "₹18.2L", col: tc.text },
          { label: "Due Today", val: "₹45.0K", col: "#D97706" },
          { label: "Due This Week", val: "₹1.5L", col: tc.blue },
          { label: "Overdue", val: "₹3.2L", col: "#DC2626" },
          { label: "Partially Paid", val: "₹2.1L", col: "#CA8A04" }
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
            type="text" placeholder="Search Customer, ID or Loan..." 
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
                {["Customer", "Cust. ID", "Loan ID", "Total Due", "Paid Amount", "Outstanding", "Due Date", "Days Overdue", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((out, i) => {
                const sc = statusColors[out.status] || { bg: "#F1F5F9", text: "#64748B" };
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-bold" style={{ color: tc.text }}>{out.customerName}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.muted }}>{out.customerId}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.blue }}>{out.loanId}</td>
                    <td className="px-4 py-3 font-extrabold" style={{ color: tc.text }}>₹{Number(out.totalDue).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-semibold text-green-700">₹{Number(out.paid).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-black text-red-600">₹{Number(out.outstanding).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{out.dueDate}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: out.overdueDays > 0 ? "#DC2626" : tc.muted }}>
                      {out.overdueDays > 0 ? `${out.overdueDays} Days` : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: sc.bg, color: sc.text }}>{out.status}</span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: tc.blue }} title="View Profile">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: "#15803D" }} title="Call Customer">
                        <Phone size={14} />
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
