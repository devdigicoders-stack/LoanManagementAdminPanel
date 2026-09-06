import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Search, User, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function RecordPayment() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customer, setCustomer] = useState(null);

  // Form Fields
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");
  const [reference, setReference] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLoans(data);
        if (data.length > 0) {
          selectCustomer(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectCustomer = (l) => {
    const numAmt = parseFloat((l.amount || '0').toString().replace(/[^\d.-]/g, '')) || 0;
    setCustomer({
      name: l.customer,
      id: l.mobile || `CUST-${l._id.slice(-4)}`,
      loanId: l.applicationId || `APP-${l._id.slice(-4)}`,
      type: l.loanType,
      approved: numAmt,
      outstanding: l.outstandingAmount || Math.round(numAmt * 0.9)
    });
    setReference(`REF-${Date.now().toString().slice(-6)}`);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    const found = loans.find(l => 
      (l.applicationId && l.applicationId.toLowerCase().includes(q)) ||
      (l.customer && l.customer.toLowerCase().includes(q)) ||
      (l.mobile && l.mobile.includes(q))
    );
    if (found) {
      selectCustomer(found);
      toast.success(`Found live loan for ${found.customer}`);
    } else {
      toast.error("No account matching that search");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer) return toast.error("Please select a customer first.");
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
          customerName: customer.name,
          customerId: customer.id,
          loanId: customer.loanId,
          type: "Payment",
          amount: Number(amount),
          method,
          reference: reference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          status: "Completed",
          action: "Matched",
          category: "Loan Repayment",
          remarks: remarks || `Payment recorded via ${method}`
        })
      });

      if (res.ok) {
        toast.success("Payment recorded and saved to MongoDB!");
        navigate("/accountant/payments");
      } else {
        toast.error("Failed to save transaction");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link to="/accountant/payments" className="p-2 rounded-xl transition-all hover:opacity-80" style={{ background: tc.sky, color: tc.blue }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Record Payment</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>
            Search live loan accounts from MongoDB and register payment vouchers.
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <h2 className="text-[15px] font-extrabold flex items-center gap-2 mb-4" style={{ color: tc.text }}>
          <Search size={16} /> Customer Loan Account Search
        </h2>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search customer name, loan ID or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 h-11 px-4 rounded-xl text-[13px] outline-none transition-all" 
            style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} 
          />
          <button 
            type="button" 
            onClick={handleSearch} 
            className="px-6 rounded-xl font-bold text-[13px] text-white transition-all hover:opacity-90 shadow-sm" 
            style={{ background: tc.blue }}
          >
            Search
          </button>
        </div>

        {customer && (
          <div className="mt-4 p-4 rounded-xl flex items-center gap-4" style={{ background: tc.sky, border: `1px solid ${tc.border}` }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white">
              <User size={20} style={{ color: tc.blue }} />
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Customer</p><p className="text-[13px] font-extrabold" style={{ color: tc.text }}>{customer.name}</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Loan ID</p><p className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{customer.loanId}</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Sanctioned</p><p className="text-[13px] font-extrabold text-[#15803D]">₹{customer.approved.toLocaleString()}</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Outstanding</p><p className="text-[13px] font-extrabold text-[#DC2626]">₹{customer.outstanding.toLocaleString()}</p></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl p-6 space-y-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <h2 className="text-[15px] font-extrabold" style={{ color: tc.text }}>Payment Voucher Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold mb-1" style={{ color: tc.text }}>Amount Paid (₹) *</label>
            <input 
              type="number" 
              required
              placeholder="e.g. 15000" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none" 
              style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} 
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold mb-1" style={{ color: tc.text }}>Payment Mode *</label>
            <select 
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none" 
              style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }}
            >
              <option value="UPI">UPI (PhonePe, GPay, Paytm)</option>
              <option value="Bank Transfer">Bank Transfer (IMPS / NEFT)</option>
              <option value="Cash">Cash Receipt</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-bold mb-1" style={{ color: tc.text }}>Bank Reference / UTR No. *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. UTR-9823749823" 
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none" 
              style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} 
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold mb-1" style={{ color: tc.text }}>Voucher Date</label>
            <input 
              type="date" 
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full h-11 px-4 rounded-xl text-[13px] outline-none" 
              style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} 
            />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-bold mb-1" style={{ color: tc.text }}>Remarks / Notes</label>
          <textarea 
            rows={3} 
            placeholder="e.g. Monthly instalment credited to bank account." 
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-4 rounded-xl text-[13px] outline-none" 
            style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} 
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/accountant/payments" className="px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all hover:opacity-80" style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.text }}>
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-white flex items-center gap-2 transition-all hover:opacity-90 shadow-sm disabled:opacity-50" 
            style={{ background: tc.blue }}
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Record & Post Voucher
          </button>
        </div>
      </form>
    </div>
  );
}
