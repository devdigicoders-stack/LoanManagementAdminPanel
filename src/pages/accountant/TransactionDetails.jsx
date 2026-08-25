import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, History, AlertCircle } from "lucide-react";
import { mockTransactions } from "./accountantData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function TransactionDetails() {
  const { id } = useParams();
  const trx = mockTransactions.find(t => t.id === id) || mockTransactions[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/accountant/transactions" className="p-2 rounded-xl transition-all hover:opacity-80" style={{ background: tc.sky, color: tc.blue }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Transaction Details</h1>
            <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Viewing audit log for <strong style={{ color: tc.blue }}>{trx.id}</strong></p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4 flex items-center gap-3 bg-amber-50" style={{ border: `1px solid #fcd34d`, color: "#b45309" }}>
        <AlertCircle size={20} />
        <p className="text-[13px] font-bold">Financial transactions cannot be permanently deleted. For corrections, process a reversal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 space-y-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <h2 className="text-[15px] font-extrabold mb-2" style={{ color: tc.text }}>Transaction Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Transaction ID</p><p className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{trx.id}</p></div>
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Type</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>{trx.type}</p></div>
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Amount</p><p className="text-[15px] font-black text-[#15803D]">₹{trx.amount.toLocaleString()}</p></div>
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Method</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>{trx.method}</p></div>
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Date</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>{trx.date}</p></div>
            <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Reference</p><p className="text-[13px] font-extrabold font-mono" style={{ color: tc.text }}>{trx.reference}</p></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl p-6 space-y-4" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <h2 className="text-[15px] font-extrabold mb-2 flex items-center gap-2" style={{ color: tc.text }}><History size={16}/> Audit Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Created By</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>Accountant Admin</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Created Date</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>{trx.date} 14:30:21</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Last Updated By</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>System</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Update Date</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>{trx.date} 15:00:00</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
