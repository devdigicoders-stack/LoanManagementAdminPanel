import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, FileMinus, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function AddExpense() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Office Expense");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return toast.error("Please enter a valid amount.");

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName: "Branch Office Operations",
          customerId: "ORG-EXPENSE",
          loanId: "",
          type: "Expense",
          amount: Number(amount),
          method,
          category,
          status: "Approved",
          action: "Matched",
          remarks: remarks || `Expense for ${category}`
        })
      });

      if (res.ok) {
        toast.success("Operating expense recorded and saved to MongoDB!");
        navigate("/accountant/expenses");
      } else {
        toast.error("Failed to record expense");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error recording expense");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link to="/accountant/expenses" className="p-2 rounded-xl transition-all hover:opacity-80" style={{ background: tc.sky, color: tc.blue }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Add Expense</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Record a new operational expense in MongoDB.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <h2 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
          <FileMinus size={16} /> Expense Details
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Expense Category <span className="text-red-500">*</span></label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" 
              style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }}
            >
              <option>Office Expense</option>
              <option>Travel & Field Fuel</option>
              <option>Marketing</option>
              <option>Utilities</option>
              <option>Software</option>
              <option>Stationery</option>
              <option>Communication</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Amount (₹) <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              required 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" 
              style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} 
              placeholder="e.g. 1500" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Payment Mode <span className="text-red-500">*</span></label>
            <select 
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" 
              style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }}
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold" style={{ color: tc.text }}>Expense Date</label>
            <input 
              type="date" 
              defaultValue={new Date().toISOString().split('T')[0]} 
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" 
              style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-bold" style={{ color: tc.text }}>Description / Remarks</label>
          <textarea 
            rows={3} 
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-4 rounded-xl text-[13px] outline-none transition-all" 
            style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} 
            placeholder="e.g. Printer cartridges and visiting cards for branch agents." 
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: tc.border }}>
          <Link to="/accountant/expenses" className="px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all hover:opacity-80" style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.text }}>
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-white flex items-center gap-2 transition-all hover:opacity-90 shadow-sm disabled:opacity-50" 
            style={{ background: tc.blue }}
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Expense Voucher
          </button>
        </div>
      </form>
    </div>
  );
}
