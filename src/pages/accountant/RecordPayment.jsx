import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Search, User, CreditCard, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function RecordPayment() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  const handleSearch = () => {
    // Mock customer found
    setCustomer({ name: "Rahul Sharma", id: "CUST-104", loanId: "APP-9021", type: "Home Loan", approved: 500000, outstanding: 485000 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customer) return toast.error("Please select a customer first.");
    toast.success("Payment recorded successfully!");
    navigate("/accountant/payments");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link to="/accountant/payments" className="p-2 rounded-xl transition-all hover:opacity-80" style={{ background: tc.sky, color: tc.blue }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Record Payment</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Record a customer payment against the applicable loan or account.</p>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <h2 className="text-[15px] font-extrabold flex items-center gap-2 mb-4" style={{ color: tc.text }}><Search size={16} /> Customer Search</h2>
        <div className="flex gap-4">
          <input type="text" placeholder="Search by name, mobile or loan ID..." className="flex-1 h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} />
          <button type="button" onClick={handleSearch} className="px-6 rounded-xl font-bold text-[13px] text-white transition-all hover:opacity-90 shadow-sm" style={{ background: tc.blue }}>Search</button>
        </div>

        {customer && (
          <div className="mt-4 p-4 rounded-xl flex items-center gap-4" style={{ background: tc.sky, border: `1px solid ${tc.border}` }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white"><User size={20} style={{ color: tc.blue }} /></div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Customer</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>{customer.name}</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Loan ID</p><p className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{customer.loanId}</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Approved Amt.</p><p className="text-[13px] font-extrabold text-[#15803D]">₹{customer.approved.toLocaleString()}</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Outstanding</p><p className="text-[13px] font-extrabold text-[#DC2626]">₹{customer.outstanding.toLocaleString()}</p></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <h2 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}><CreditCard size={16} /> Payment Details</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Payment Amount <span className="text-red-500">*</span></label>
            <input type="number" required className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} placeholder="e.g. 15000" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Payment Date <span className="text-red-500">*</span></label>
            <input type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Payment Method <span className="text-red-500">*</span></label>
            <select required className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }}>
              <option value="">Select Method</option>
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
              <option>Cheque</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Reference Number <span className="text-[10px] text-gray-400">(Required for Online)</span></label>
            <input type="text" className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} placeholder="e.g. UPI98237..." />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Payment Purpose <span className="text-red-500">*</span></label>
            <select required className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }}>
              <option value="">Select Purpose</option>
              <option>EMI</option>
              <option>Processing Fee</option>
              <option>Loan Repayment</option>
              <option>Documentation Fee</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Remarks</label>
            <textarea className="w-full p-4 rounded-xl text-[13px] outline-none transition-all resize-none h-24" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} placeholder="Optional notes..."></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4" style={{ borderTop: `1px solid ${tc.border}` }}>
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all hover:bg-gray-100" style={{ color: tc.muted }}>Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all text-white hover:opacity-90 shadow-sm" style={{ background: tc.blue }}><Save size={16} /> Save Payment</button>
          <button type="button" onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all" style={{ background: tc.sky, color: tc.blue, border: `1px solid ${tc.blue}` }}><CheckCircle size={16} /> Save & Generate Receipt</button>
        </div>
      </form>
    </div>
  );
}
