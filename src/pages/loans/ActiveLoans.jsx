import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Filter, Download, Eye, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ActiveLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  const fetchActiveLoans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Disbursed or Approved loans qualify as active
        const active = data.filter(l => l.status === "Disbursed" || l.status === "Approved");
        setLoans(active);
      } else {
        toast.error("Failed to load active loans");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error loading loans");
    } finally {
      setLoading(false);
    }
  };

  const filtered = loans.filter(l => {
    const q = search.toLowerCase();
    const matchesSearch = 
      (l.applicationId && l.applicationId.toLowerCase().includes(q)) ||
      (l.customer && l.customer.toLowerCase().includes(q)) ||
      (l.mobile && l.mobile.includes(q));
    const matchesType = selectedType === "All" || l.loanType === selectedType;
    return matchesSearch && matchesType;
  });

  const exportCSV = () => {
    if (filtered.length === 0) return toast.error("No loans to export");
    const headers = "Loan ID,Customer Name,Loan Type,Amount,Status,Mobile,Date\n";
    const rows = filtered.map(l => 
      `"${l.applicationId || l._id}","${l.customer}","${l.loanType}","${l.amount}","${l.status}","${l.mobile || ''}","${l.createdAt || ''}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `active-loans-${Date.now()}.csv`;
    a.click();
    toast.success("Active loans exported");
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Active Loans
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/loans" className="hover:text-[#489b0d] transition-colors">
              Loan Management
            </Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Active Loans ({loans.length})</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, name, mobile..."
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-[230px]"
            />
          </div>

          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white min-w-[140px]"
          >
            <option value="All">All Loan Types</option>
            <option value="Home Loan">Home Loan</option>
            <option value="Personal Loan">Personal Loan</option>
            <option value="Business Loan">Business Loan</option>
            <option value="Education Loan">Education Loan</option>
          </select>

          <button 
            onClick={exportCSV}
            className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Loan ID
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Loan Type
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Disbursed Amount
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Tenure / Rate
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Est. EMI
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Next Due Date
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#489b0d]" />
                    Loading live active loans...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 text-[13px]">
                    No active loans matching your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((loan, idx) => {
                  const numAmt = parseFloat((loan.amount || '0').toString().replace(/[^\d.-]/g, '')) || 0;
                  const emiDisplay = loan.emiAmount 
                    ? `₹${loan.emiAmount.toLocaleString('en-IN')}` 
                    : `₹${Math.round(numAmt * 0.022).toLocaleString('en-IN')}`;
                  
                  return (
                    <tr
                      key={loan._id || idx}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-6 text-[12px] font-bold text-slate-700">
                        {loan.applicationId || `APP-${loan._id.toString().slice(-4)}`}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[13px] font-bold text-slate-800">{loan.customer}</div>
                        <div className="text-[11px] text-slate-400">{loan.mobile}</div>
                      </td>
                      <td className="py-3 px-4 text-[12px] font-medium text-slate-600">
                        {loan.loanType}
                      </td>
                      <td className="py-3 px-4 text-[13px] font-bold text-[#489b0d]">
                        {loan.amount?.toString().startsWith('₹') ? loan.amount : `₹${Number(loan.amount).toLocaleString('en-IN')}`}
                      </td>
                      <td className="py-3 px-4 text-[12px] font-medium text-slate-600">
                        {loan.tenure || '24 Months'} @ {loan.interestRate || '10.5%'}
                      </td>
                      <td className="py-3 px-4 text-[12px] font-semibold text-slate-700">
                        {emiDisplay}
                      </td>
                      <td className="py-3 px-4 text-[12px] font-medium text-slate-500">
                        {loan.nextEmiDate || '10th of Month'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          loan.status === 'Disbursed' 
                            ? 'text-[#489b0d] bg-[#489b0d]/10' 
                            : 'text-blue-600 bg-blue-50'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <Link 
                          to={`/loans/manage?id=${loan._id}`}
                          className="p-1.5 inline-block text-slate-400 hover:text-[#489b0d] hover:bg-[#489b0d]/10 rounded-md transition-colors"
                        >
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <p className="text-[12px] font-medium text-slate-500">
            Showing {filtered.length} of {loans.length} live active accounts from Database
          </p>
        </div>
      </div>
    </div>
  );
}
