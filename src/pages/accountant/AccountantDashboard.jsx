import { Link } from "react-router-dom";
import {
  CreditCard, Banknote, List, RefreshCcw, FileMinus, TrendingUp, PieChart, ChevronRight, Eye, AlertTriangle, Loader2
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReactPkg from "highcharts-react-official";
const HighchartsReact = HighchartsReactPkg.default || HighchartsReactPkg.HighchartsReact || HighchartsReactPkg;
import { statusColors } from "./accountantData";
import toast from "react-hot-toast";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#1e7ba8", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function AccountantDashboard() {
  const rawRole = (localStorage.getItem('userRole') || '').trim().toLowerCase();
  const cleanRole = rawRole.replace(/[^a-z0-9]/g, '');
  const isReadOnlyAdmin = ['superadmin', 'admin', 'administrator', 'super_admin'].includes(cleanRole) || rawRole.includes('super admin') || rawRole === 'admin';

  const name = localStorage.getItem(`adminName_${localStorage.getItem("userRole")}`) || "Accountant Admin";
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountantData();
  }, []);

  const fetchAccountantData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const [statsRes, txRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/transactions/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/transactions?limit=6`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (txRes.ok) {
        const txData = await txRes.json();
        setRecentTransactions(txData);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch live accountant stats");
    } finally {
      setLoading(false);
    }
  };

  const formatRupee = (val) => {
    if (!val && val !== 0) return "₹0";
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const summaryCards = [
    { 
      label: "Total Collection",       
      value: formatRupee(stats?.totalCollection), 
      sub: "Live collection from loans",             
      icon: Banknote,     
      color: "#DFF3FF", 
      iconColor: "#1e7ba8" 
    },
    { 
      label: "Today's Collection",     
      value: formatRupee(stats?.todayCollection), 
      sub: "Amount collected today",             
      icon: TrendingUp,   
      color: "#DCFCE7", 
      iconColor: "#15803D" 
    },
    { 
      label: "Pending Recon",       
      value: (stats?.pendingRecon || 0).toString(),     
      sub: "Awaiting bank statement match",     
      icon: AlertTriangle,
      color: "#FFF8E7", 
      iconColor: "#D97706" 
    },
    { 
      label: "Outstanding Loan Bal",     
      value: formatRupee(stats?.totalOutstanding), 
      sub: "Total live loan receivables",           
      icon: CreditCard,   
      color: "#FEE2E2", 
      iconColor: "#DC2626" 
    },
    { 
      label: "Total Transactions",     
      value: (stats?.totalCount || 0).toString(),  
      sub: "Live vouchers recorded",        
      icon: List,         
      color: "#F3E8FF", 
      iconColor: "#7E22CE" 
    },
    { 
      label: "Refunds",                
      value: formatRupee(stats?.totalRefunds), 
      sub: "Security / fee refunded",              
      icon: RefreshCcw,   
      color: "#FEF9C3", 
      iconColor: "#CA8A04" 
    },
    { 
      label: "Expenses",               
      value: formatRupee(stats?.totalExpenses), 
      sub: "Branch operating expenses",            
      icon: FileMinus,    
      color: "#EEF2FF", 
      iconColor: "#4338CA" 
    },
    { 
      label: "Net Balance",         
      value: formatRupee((stats?.totalCollection || 0) - (stats?.totalExpenses || 0) - (stats?.totalRefunds || 0)), 
      sub: "Net liquid recovery",    
      icon: PieChart,     
      color: "#D1FAE5", 
      iconColor: "#059669" 
    },
  ];

  const quickActions = [
    { label: "Record Payment",    path: "/accountant/payments/add", bg: "#DFF3FF",  col: "#1e7ba8" },
    { label: "View Transactions", path: "/accountant/transactions", bg: "#EEF2FF",  col: "#4338CA" },
    { label: "Add Expense",       path: "/accountant/expenses/add", bg: "#FEF9C3",  col: "#CA8A04" },
    { label: "Reconciliation",    path: "/accountant/reconciliation", bg: "#FFF8E7",  col: "#D97706" },
  ];

  const chartOptions = {
    chart: { type: 'areaspline', backgroundColor: 'transparent', height: 280 },
    title: { text: '' },
    xAxis: { categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], lineColor: tc.border },
    yAxis: { title: { text: '' }, gridLineColor: tc.border },
    series: [
      { 
        name: 'Collections (₹)', 
        data: stats?.weeklyData || [15000, 45000, 32000, 50000, 10000, 5000, 25000], 
        color: tc.primary, 
        fillOpacity: 0.25 
      }
    ],
    credits: { enabled: false },
    legend: { itemStyle: { color: tc.text } }
  };

  return (
    <div className="space-y-6 w-full" style={{ color: tc.text }}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-black" style={{ color: tc.text }}>Finance, Disbursals & Collections</h1>
            {isReadOnlyAdmin && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                Track & Monitor Only
              </span>
            )}
          </div>
          <p className="text-[12px] mt-0.5" style={{ color: tc.muted }}>
            {isReadOnlyAdmin
              ? "Live financial tracking of company collections, active EMI repayments, branch expenditures and reconciliation records."
              : `Welcome back, ${name} — Live MongoDB tracking of collections, loans outstanding, expenses and reconciliations.`}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="rounded-2xl p-4 flex flex-col gap-2"
              style={{ background: tc.card, border: `1px solid ${tc.border}`, boxShadow: "0 1px 6px rgba(142,211,244,0.08)" }}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: card.color }}>
                  <Icon size={17} style={{ color: card.iconColor }} />
                </div>
                <span className="text-[20px] font-extrabold" style={{ color: tc.text }}>
                  {loading ? "..." : card.value}
                </span>
              </div>
              <div>
                <p className="text-[13px] font-bold" style={{ color: tc.text }}>{card.label}</p>
                <p className="text-[11px]" style={{ color: tc.muted }}>{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions (only for finance executive/accountant, not read-only admin) */}
      {!isReadOnlyAdmin && (
        <div className="flex flex-wrap gap-3">
          {quickActions.map((qa, i) => (
            <Link key={i} to={qa.path}
              className="px-4 py-2.5 rounded-xl font-bold text-[13px] flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ background: qa.bg, color: qa.col }}>
              {qa.label} <ChevronRight size={14} />
            </Link>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <h2 className="text-[15px] font-extrabold mb-3" style={{ color: tc.text }}>Live Weekly Collections Curve (₹)</h2>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>

      {/* Recent Transactions Table */}
      <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-extrabold" style={{ color: tc.text }}>Recent Live Transactions from Database</h2>
          <Link to="/accountant/transactions" className="text-[12px] font-bold hover:underline" style={{ color: tc.blue }}>
            View All ({stats?.totalCount || 0})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr style={{ borderBottom: `1px solid ${tc.border}`, color: tc.muted }} className="text-[11px] font-bold uppercase text-left">
                <th className="pb-2.5">TXN ID</th>
                <th className="pb-2.5">Customer / Entity</th>
                <th className="pb-2.5">Type</th>
                <th className="pb-2.5">Amount</th>
                <th className="pb-2.5">Method</th>
                <th className="pb-2.5">Reference</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5">Recon</th>
                <th className="pb-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2 text-[#1e7ba8]" />
                    Loading live vouchers...
                  </td>
                </tr>
              ) : recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-slate-400 text-xs">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((t, idx) => (
                  <tr key={t._id || idx} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-slate-50/50">
                    <td className="py-3 font-bold" style={{ color: tc.blue }}>{t.transactionId}</td>
                    <td className="py-3 font-semibold">{t.customerName}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        t.type === 'Collection' || t.type === 'Payment' ? 'bg-green-100 text-green-700' :
                        t.type === 'Expense' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 font-extrabold text-slate-800">
                      ₹{Number(t.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 font-medium text-slate-500">{t.method}</td>
                    <td className="py-3 font-mono text-[11px] text-slate-400">{t.reference}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        t.action === 'Matched' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {t.action}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link to={`/accountant/transactions/${t._id}`} className="p-1.5 inline-block text-slate-400 hover:text-[#1e7ba8]">
                        <Eye size={15} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
