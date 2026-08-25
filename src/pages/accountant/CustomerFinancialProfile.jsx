import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Receipt, Download, Banknote, List } from "lucide-react";
import { mockCustomers, mockPayments, statusColors } from "./accountantData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function CustomerFinancialProfile() {
  const { id } = useParams();
  const cust = mockCustomers.find(c => c.id === id) || mockCustomers[0];
  const history = mockPayments.filter(p => p.customerName === cust.name);

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/accountant/customers" className="p-2 rounded-xl transition-all hover:opacity-80" style={{ background: tc.sky, color: tc.blue }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Customer Financial Profile</h1>
            <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Detailed financial summary for <strong style={{ color: tc.blue }}>{cust.name}</strong></p>
          </div>
        </div>
        <Link to="/accountant/payments/add" className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90 shadow-sm" style={{ background: tc.blue }}>
          Record Payment
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl p-6 space-y-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: tc.border }}>
              <div>
                <h2 className="text-[16px] font-extrabold" style={{ color: tc.text }}>{cust.name}</h2>
                <p className="text-[12px] font-bold mt-1" style={{ color: tc.muted }}>{cust.id}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${cust.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {cust.status}
              </span>
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-[13px]"><span className="font-bold" style={{ color: tc.muted }}>Mobile</span><span className="font-extrabold" style={{ color: tc.text }}>{cust.mobile}</span></div>
              <div className="flex justify-between text-[13px]"><span className="font-bold" style={{ color: tc.muted }}>Loan / App ID</span><span className="font-extrabold" style={{ color: tc.blue }}>{cust.loanId}</span></div>
              <div className="flex justify-between text-[13px]"><span className="font-bold" style={{ color: tc.muted }}>Loan Type</span><span className="font-extrabold" style={{ color: tc.text }}>Personal Loan</span></div>
            </div>
          </div>

          <div className="rounded-2xl p-6 space-y-4" style={{ background: tc.cream, border: `1px solid ${tc.border}` }}>
            <h2 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}><Banknote size={16} /> Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-[13px]"><span className="font-bold" style={{ color: tc.muted }}>Total Payable</span><span className="font-extrabold" style={{ color: tc.text }}>₹{cust.amount.toLocaleString()}</span></div>
              <div className="flex justify-between text-[13px]"><span className="font-bold" style={{ color: tc.muted }}>Total Paid</span><span className="font-extrabold text-green-700">₹{cust.paid.toLocaleString()}</span></div>
              <div className="pt-2 mt-2 border-t flex justify-between text-[14px]" style={{ borderColor: tc.border }}>
                <span className="font-extrabold" style={{ color: tc.text }}>Outstanding</span><span className="font-black text-red-600">₹{cust.outstanding.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl w-full h-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${tc.border}` }}>
              <h2 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}><List size={16} /> Payment History</h2>
            </div>
            <div className="overflow-x-auto w-full p-2">
              <table className="w-full text-[12px]">
                <thead>
                  <tr style={{ background: tc.sky }}>
                    {["Payment ID", "Date", "Amount", "Method", "Reference", "Status", "Receipt"].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((pay, i) => {
                    const sc = statusColors[pay.status] || { bg: "#F1F5F9", text: "#64748B" };
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                        <td className="px-4 py-3 font-bold" style={{ color: tc.blue }}>{pay.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{pay.date}</td>
                        <td className="px-4 py-3 font-extrabold" style={{ color: tc.text }}>₹{Number(pay.amount).toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3 font-semibold" style={{ color: tc.muted }}>{pay.method}</td>
                        <td className="px-4 py-3 font-mono text-[11px]" style={{ color: tc.muted }}>{pay.reference}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: sc.bg, color: sc.text }}>{pay.status}</span>
                        </td>
                        <td className="px-4 py-3 flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: tc.blue }} title="View Receipt">
                            <Receipt size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-[13px] font-bold" style={{ color: tc.muted }}>No payment history found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
