import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Printer, Download, Eye } from "lucide-react";
import { mockPayments } from "./accountantData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function PaymentDetails() {
  const { id } = useParams();
  const payment = mockPayments.find(p => p.id === id) || mockPayments[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/accountant/payments" className="p-2 rounded-xl transition-all hover:opacity-80" style={{ background: tc.sky, color: tc.blue }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Payment Details</h1>
            <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Viewing details for <strong style={{ color: tc.blue }}>{payment.id}</strong></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90 shadow-sm" style={{ background: tc.blue }}>
            <Download size={14} /> Download Receipt
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all hover:opacity-90" style={{ background: tc.sky, color: tc.blue }}>
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 space-y-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <h2 className="text-[15px] font-extrabold mb-2" style={{ color: tc.text }}>Payment Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Payment ID</p><p className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{payment.id}</p></div>
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Transaction ID</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>TRX-89234</p></div>
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Amount</p><p className="text-[15px] font-black text-[#15803D]">₹{payment.amount.toLocaleString()}</p></div>
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Date</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>{payment.date}</p></div>
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Method</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>{payment.method}</p></div>
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Reference</p><p className="text-[13px] font-extrabold font-mono" style={{ color: tc.text }}>{payment.reference}</p></div>
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Purpose</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>EMI</p></div>
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Status</p><p className="text-[13px] font-extrabold text-[#15803D]">{payment.status}</p></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl p-6 space-y-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <h2 className="text-[15px] font-extrabold mb-2" style={{ color: tc.text }}>Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Customer Name</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>{payment.customerName}</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Customer ID</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>CUST-104</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Mobile</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>+91 9876543210</p></div>
            </div>
          </div>

          <div className="rounded-2xl p-6 space-y-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <h2 className="text-[15px] font-extrabold mb-2" style={{ color: tc.text }}>Loan Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Loan / App ID</p><p className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{payment.loanId}</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Loan Type</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>Home Loan</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
