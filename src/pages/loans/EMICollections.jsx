import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Search,
  IndianRupee,
  Calendar,
  FileText,
  CreditCard,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";

export default function EMICollections() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Payment Form State
  const [collectionAmount, setCollectionAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [txnRef, setTxnRef] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLoans(data);
        if (data.length > 0) {
          const first = data.find(l => l.status === "Disbursed") || data[0];
          selectLoanRecord(first);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching loan accounts");
    } finally {
      setLoading(false);
    }
  };

  const selectLoanRecord = (loan) => {
    setSelectedLoan(loan);
    const numAmt = parseFloat((loan.amount || "0").toString().replace(/[^\d.-]/g, "")) || 0;
    const emi = loan.emiAmount || Math.round(numAmt * 0.022);
    setCollectionAmount(emi.toString());
    setTxnRef(`UPI-${Date.now().toString().slice(-6)}`);
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
      selectLoanRecord(found);
      toast.success(`Account found: ${found.customer}`);
    } else {
      toast.error("No account matching that ID or Mobile");
    }
  };

  const handleRecordCollection = async (e) => {
    e.preventDefault();
    if (!selectedLoan) return toast.error("Please select a loan account");
    if (!collectionAmount || Number(collectionAmount) <= 0) {
      return toast.error("Please enter a valid collection amount");
    }

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
          customerName: selectedLoan.customer,
          customerId: selectedLoan.mobile || selectedLoan.applicationId,
          loanId: selectedLoan.applicationId || `APP-${selectedLoan._id.toString().slice(-4)}`,
          type: "Collection",
          amount: Number(collectionAmount),
          method: paymentMode,
          reference: txnRef || `RCPT-${Math.floor(100000 + Math.random() * 900000)}`,
          status: "Completed",
          action: "Matched",
          category: "EMI Collection",
          remarks: remarks || `EMI payment collected via ${paymentMode}`
        })
      });

      if (res.ok) {
        toast.success(`₹${Number(collectionAmount).toLocaleString('en-IN')} EMI Payment Collected & Saved to Database!`);
        setRemarks("");
        setTxnRef(`UPI-${Date.now().toString().slice(-6)}`);
      } else {
        toast.error("Failed to record collection in database");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error recording payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            EMI Collection Portal
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/loans" className="hover:text-[#489b0d] transition-colors">
              Loan Management
            </Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Live EMI Collection</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Search & Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search Card */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h3 className="text-[14px] font-extrabold text-slate-800 mb-4">
              Find Live Loan Account
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                  Enter Loan ID, Customer Name, or Mobile
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="e.g. LN-2025-1001 or Priya"
                    className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Quick Select dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Or pick directly from database:
                </label>
                <select
                  value={selectedLoan?._id || ""}
                  onChange={(e) => {
                    const l = loans.find(x => x._id === e.target.value);
                    if (l) selectLoanRecord(l);
                  }}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                >
                  {loans.map(l => (
                    <option key={l._id} value={l._id}>
                      {l.applicationId || `APP-${l._id.slice(-4)}`} - {l.customer} ({l.loanType})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm"
              >
                Search Account
              </button>
            </div>
          </div>

          {/* Account Details */}
          {selectedLoan && (
            <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-[14px] font-extrabold text-slate-800">
                  Account Summary
                </h3>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-600">
                  {selectedLoan.status}
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                      Customer Name
                    </p>
                    <p className="text-[14px] font-bold text-slate-800">
                      {selectedLoan.customer}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {selectedLoan.mobile} • {selectedLoan.loanType}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                      Sanctioned Amount
                    </p>
                    <p className="text-[13px] font-bold text-slate-800">
                      {selectedLoan.amount?.toString().startsWith('₹') ? selectedLoan.amount : `₹${Number(selectedLoan.amount).toLocaleString('en-IN')}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                      Tenure / Rate
                    </p>
                    <p className="text-[13px] font-bold text-slate-800">
                      {selectedLoan.tenure || '24 Months'} ({selectedLoan.interestRate || '10.5%'})
                    </p>
                  </div>
                </div>

                <div className="bg-[#489b0d]/5 rounded-md p-4 border border-[#489b0d]/10 mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-[#489b0d] uppercase tracking-wider mb-1">
                      Monthly EMI
                    </p>
                    <p className="text-[20px] font-extrabold text-[#489b0d] leading-none">
                      ₹{Number(collectionAmount || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Next Due Date
                    </p>
                    <p className="text-[13px] font-bold text-slate-700">
                      {selectedLoan.nextEmiDate || '10 Sep 2026'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Collect Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h3 className="text-[16px] font-extrabold text-slate-800 mb-2">
              Collect & Record Payment
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Payments recorded here are saved directly to the MongoDB `transactions` collection and automatically reflected in Accountant reports.
            </p>

            <form onSubmit={handleRecordCollection} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Amount Received (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      value={collectionAmount}
                      onChange={(e) => setCollectionAmount(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full h-11 pl-8 pr-4 rounded-md border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#489b0d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Payment Mode *
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#489b0d]"
                  >
                    <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                    <option value="Cash">Cash Receipt</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT / IMPS / RTGS)</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Transaction / UTR Reference No.
                  </label>
                  <input
                    type="text"
                    value={txnRef}
                    onChange={(e) => setTxnRef(e.target.value)}
                    placeholder="e.g. UPI-9823749823"
                    className="w-full h-11 px-4 rounded-md border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#489b0d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Collection Date
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full h-11 px-4 rounded-md border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#489b0d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Remarks / Notes
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Regular monthly installment received on time."
                  className="w-full p-3 rounded-md border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-[#489b0d]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={submitting || !selectedLoan}
                  className="px-6 h-11 bg-[#489b0d] hover:bg-[#3e850b] text-white font-bold text-sm rounded-md transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving to Database...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Confirm & Save EMI Collection
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
