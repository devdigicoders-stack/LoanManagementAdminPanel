import { useState } from "react";
import { Search, Filter, Printer, Download } from "lucide-react";
import { mockPayments, statusColors } from "./accountantData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function Receipts() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockPayments.filter(p => p.status === "Completed").filter(p => 
    p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Payment Receipts</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Generate, view and manage customer payment receipts.</p>
        </div>
      </div>

      <div className="rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="relative max-w-sm w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
          <input 
            type="text" placeholder="Search Receipt Number or Customer..." 
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
                {["Receipt Number", "Payment ID", "Customer", "Amount", "Method", "Date", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((pay, i) => {
                const sc = statusColors["Completed"];
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.text }}>RCPT-{pay.id.split("-")[1]}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: tc.blue }}>{pay.id}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.text }}>{pay.customerName}</td>
                    <td className="px-4 py-3 font-extrabold" style={{ color: tc.text }}>₹{Number(pay.amount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.muted }}>{pay.method}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{pay.date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: sc.bg, color: sc.text }}>Generated</span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: tc.blue }} title="Print">
                        <Printer size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-green-600" title="Download PDF">
                        <Download size={14} />
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
