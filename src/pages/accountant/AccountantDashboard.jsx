import { Link } from "react-router-dom";
import {
  CreditCard, Banknote, List, RefreshCcw, FileMinus, TrendingUp, PieChart, ChevronRight, Eye, AlertTriangle
} from "lucide-react";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { mockTransactions, statusColors } from "./accountantData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

const summaryCards = [
  { label: "Total Collection",       value: "₹25.5L", sub: "Total amount collected",             icon: Banknote,     color: "#DFF3FF", iconColor: "#1e7ba8" },
  { label: "Today's Collection",     value: "₹45.0K", sub: "Amount collected today",             icon: TrendingUp,   color: "#DCFCE7", iconColor: "#15803D" },
  { label: "Pending Payments",       value: "12",     sub: "Payments awaiting confirmation",     icon: AlertTriangle,color: "#FFF8E7", iconColor: "#D97706" },
  { label: "Outstanding Amount",     value: "₹18.2L", sub: "Total outstanding amount",           icon: CreditCard,   color: "#FEE2E2", iconColor: "#DC2626" },
  { label: "Total Transactions",     value: "1,245",  sub: "Total recorded transactions",        icon: List,         color: "#F3E8FF", iconColor: "#7E22CE" },
  { label: "Refunds",                value: "₹12.5K", sub: "Total refunded amount",              icon: RefreshCcw,   color: "#FEF9C3", iconColor: "#CA8A04" },
  { label: "Expenses",               value: "₹85.0K", sub: "Total recorded expenses",            icon: FileMinus,    color: "#EEF2FF", iconColor: "#4338CA" },
  { label: "Net Collection",         value: "₹24.5L", sub: "Collection - refunds & expenses",    icon: PieChart,     color: "#D1FAE5", iconColor: "#059669" },
];

const quickActions = [
  { label: "Record Payment",    path: "/accountant/payments/add", bg: "#DFF3FF",  col: "#1e7ba8" },
  { label: "View Transactions", path: "/accountant/transactions", bg: "#EEF2FF",  col: "#4338CA" },
  { label: "Add Expense",       path: "/accountant/expenses/add", bg: "#FEF9C3",  col: "#CA8A04" },
  { label: "Reconciliation",    path: "/accountant/reconciliation", bg: "#FFF8E7",  col: "#D97706" },
];

export default function AccountantDashboard() {
  const name = localStorage.getItem(`adminName_${localStorage.getItem("userRole")}`) || "Accountant Admin";

  const chartOptions = {
    chart: { type: 'areaspline', backgroundColor: 'transparent', height: 280 },
    title: { text: '' },
    xAxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], lineColor: tc.border },
    yAxis: { title: { text: '' }, gridLineColor: tc.border },
    series: [
      { name: 'Collections', data: [15000, 45000, 32000, 50000, 10000, 5000, 25000], color: tc.primary, fillOpacity: 0.3 },
      { name: 'Expenses', data: [2000, 1500, 500, 8000, 1000, 0, 500], color: '#DC2626', fillOpacity: 0.1 }
    ],
    credits: { enabled: false },
    legend: { itemStyle: { color: tc.text } }
  };

  return (
    <div className="space-y-6 w-full" style={{ color: tc.text }}>
      
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Accounts Dashboard</h1>
        <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>
          Welcome back, <strong>{name}</strong> — Monitor payments, collections, outstanding amounts and financial activities.
        </p>
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
                <span className="text-[20px] font-extrabold" style={{ color: tc.text }}>{card.value}</span>
              </div>
              <div>
                <p className="text-[13px] font-bold" style={{ color: tc.text }}>{card.label}</p>
                <p className="text-[11px]" style={{ color: tc.muted }}>{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        {/* Charts */}
        <div className="xl:col-span-2 rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <h2 className="text-[15px] font-extrabold mb-4" style={{ color: tc.text }}>Weekly Cash Flow</h2>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>

        {/* Quick Actions & Today's Info */}
        <div className="space-y-5">
          
          <div className="rounded-2xl p-5" style={{ background: tc.cream, border: `1px solid ${tc.border}` }}>
            <h2 className="text-[15px] font-extrabold mb-4" style={{ color: tc.text }}>Quick Actions</h2>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((a, i) => (
                <Link key={i} to={a.path}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl transition-all hover:opacity-90"
                  style={{ background: a.bg, border: `1px solid ${tc.border}` }}>
                  <span className="text-[13px] font-bold" style={{ color: a.col }}>{a.label}</span>
                  <ChevronRight size={15} style={{ color: a.col }} />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <h2 className="text-[15px] font-extrabold mb-3" style={{ color: tc.text }}>Today's Collection</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-[13px]"><span className="font-bold" style={{ color: tc.muted }}>Total Payments</span><span className="font-extrabold text-[#15803D]">12</span></div>
              <div className="flex justify-between text-[13px]"><span className="font-bold" style={{ color: tc.muted }}>Cash</span><span className="font-extrabold" style={{ color: tc.text }}>₹15,000</span></div>
              <div className="flex justify-between text-[13px]"><span className="font-bold" style={{ color: tc.muted }}>UPI</span><span className="font-extrabold" style={{ color: tc.text }}>₹25,000</span></div>
              <div className="flex justify-between text-[13px]"><span className="font-bold" style={{ color: tc.muted }}>Bank</span><span className="font-extrabold" style={{ color: tc.text }}>₹5,000</span></div>
              <div className="pt-2 mt-2 border-t flex justify-between text-[14px]" style={{ borderColor: tc.border }}>
                <span className="font-extrabold" style={{ color: tc.text }}>Total</span><span className="font-black text-[#1e7ba8]">₹45,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl w-full" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${tc.border}` }}>
          <h2 className="text-[15px] font-extrabold" style={{ color: tc.text }}>Recent Transactions</h2>
          <Link to="/accountant/transactions" className="text-[12px] font-bold flex items-center gap-1" style={{ color: tc.blue }}>
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ background: tc.sky }}>
                {["Transaction ID", "Customer", "Type", "Amount", "Method", "Status", "Date", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold whitespace-nowrap" style={{ color: tc.blue }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTransactions.slice(0, 5).map((trx, i) => {
                const sc = statusColors[trx.status] || { bg: "#F1F5F9", text: "#64748B" };
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${tc.border}` }} className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="px-4 py-3 font-bold" style={{ color: tc.blue }}>{trx.id}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.text }}>{trx.customerName}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: tc.muted }}>{trx.type}</td>
                    <td className="px-4 py-3 font-extrabold" style={{ color: tc.text }}>₹{Number(trx.amount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: tc.muted }}>{trx.method}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: sc.bg, color: sc.text }}>{trx.status}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: tc.muted }}>{trx.date}</td>
                    <td className="px-4 py-3">
                      <Link to={`/accountant/transactions/${trx.id}`}
                        className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
                        style={{ background: tc.sky, color: tc.blue }}>
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
