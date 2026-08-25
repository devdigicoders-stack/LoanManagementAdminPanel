import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function RequestRefund() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Refund request submitted successfully for approval.");
    navigate("/accountant/refunds");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link to="/accountant/refunds" className="p-2 rounded-xl transition-all hover:opacity-80" style={{ background: tc.sky, color: tc.blue }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Request Refund</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Submit a refund request for an existing payment.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <h2 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}><RefreshCcw size={16} /> Refund Details</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Original Payment ID <span className="text-red-500">*</span></label>
            <input type="text" required className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} placeholder="e.g. PAY-1001" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Customer Name <span className="text-red-500">*</span></label>
            <input type="text" required className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} placeholder="e.g. Rahul Sharma" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Original Amount <span className="text-red-500">*</span></label>
            <input type="number" required className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} placeholder="e.g. 15000" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Refund Amount <span className="text-red-500">*</span></label>
            <input type="number" required className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} placeholder="e.g. 2500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Reason for Refund <span className="text-red-500">*</span></label>
            <select required className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }}>
              <option value="">Select Reason</option>
              <option>Duplicate Payment</option>
              <option>Loan Cancellation</option>
              <option>Excess Fee Charged</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Additional Remarks <span className="text-red-500">*</span></label>
            <textarea required className="w-full p-4 rounded-xl text-[13px] outline-none transition-all resize-none h-24" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} placeholder="Explain why this refund is being requested..."></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4" style={{ borderTop: `1px solid ${tc.border}` }}>
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all hover:bg-gray-100" style={{ color: tc.muted }}>Cancel</button>
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all text-white hover:opacity-90 shadow-sm" style={{ background: tc.blue }}><Save size={16} /> Submit Refund Request</button>
        </div>
      </form>
    </div>
  );
}
