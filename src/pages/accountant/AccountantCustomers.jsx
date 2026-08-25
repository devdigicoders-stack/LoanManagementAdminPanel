import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye, Phone } from "lucide-react";
import { mockCustomers, statusColors } from "./accountantData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function AccountantCustomers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockCustomers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.loanId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Customers</h1>
        <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>View customer financial information and payment history.</p>
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
                {["Customer ID", "Customer Name", "Mobile", "Loan/App ID", "Loan Amount", "Paid", "Outstanding", "Status", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((cust, i) => {
                const sc = cust.status === "Active" ? { bg: "#DCFCE7", text: "#15803D" } : { bg: "#FEE2E2", text: "#DC2626" };
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.muted }}>{cust.id}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: tc.text }}>{cust.name}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.muted }}>{cust.mobile}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.blue }}>{cust.loanId}</td>
                    <td className="px-4 py-3 font-extrabold" style={{ color: tc.text }}>₹{Number(cust.amount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-semibold text-green-700">₹{Number(cust.paid).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-black text-red-600">₹{Number(cust.outstanding).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: sc.bg, color: sc.text }}>{cust.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/accountant/customers/${cust.id}`} className="flex items-center gap-1 text-[12px] font-bold transition-all hover:opacity-80" style={{ color: tc.blue }}>
                        <Eye size={14} /> View Profile
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
