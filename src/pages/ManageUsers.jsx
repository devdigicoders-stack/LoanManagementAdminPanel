import { useState } from "react";
import {
  ChevronRight,
  Users,
  UserCheck,
  UserMinus,
  ShieldAlert,
  ShieldCheck,
  UserX,
  Filter,
  Download,
  MoreVertical,
  AlertCircle,
   Mail,
  Phone,
  CreditCard,
  Calendar,
  MapPin,
  User,
  FileText,
  Bell,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Ban,
  Clock,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

// --- Mock Data ---
const mockUsers = [
  {
    id: "USR-10245",
    name: "Ravi Kumar",
    email: "ravi.kumar@gmail.com",
    phone: "+91 9876543210",
    kycStatus: "Verified",
    activeLoans: 1,
    closedLoans: 2,
    totalLoanAmount: "₹5,00,000",
    status: "Active",
    pan: "ABCDE1234F",
    aadhaar: "XXXX XXXX 1234",
    dob: "15 Aug 1990",
    gender: "Male",
    address: "123, Green Park, Lucknow, Uttar Pradesh - 226001",
    outstandingAmount: "₹3,20,000",
    totalApplications: 3,
    creditScore: 742,
    creditStatus: "Good",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "USR-10246",
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    phone: "+91 9876543211",
    kycStatus: "Verified",
    activeLoans: 2,
    closedLoans: 1,
    totalLoanAmount: "₹7,50,000",
    status: "Active",
    pan: "BWQPR9876M",
    aadhaar: "XXXX XXXX 5678",
    dob: "22 Jan 1988",
    gender: "Female",
    address: "45, Civil Lines, Kanpur, Uttar Pradesh - 208001",
    outstandingAmount: "₹4,10,000",
    totalApplications: 4,
    creditScore: 780,
    creditStatus: "Excellent",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: "USR-10247",
    name: "Amit Verma",
    email: "amit.verma@gmail.com",
    phone: "+91 9876543212",
    kycStatus: "Pending",
    activeLoans: 0,
    closedLoans: 0,
    totalLoanAmount: "₹0",
    status: "Active",
    pan: "Pending",
    aadhaar: "Pending",
    dob: "10 Nov 1995",
    gender: "Male",
    address: "12, MG Road, Agra, Uttar Pradesh - 282001",
    outstandingAmount: "₹0",
    totalApplications: 1,
    creditScore: 650,
    creditStatus: "Fair",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: "USR-10248",
    name: "Neha Singh",
    email: "neha.singh@gmail.com",
    phone: "+91 9876543213",
    kycStatus: "Verified",
    activeLoans: 1,
    closedLoans: 0,
    totalLoanAmount: "₹2,00,000",
    status: "Active",
    pan: "CXRTY4567L",
    aadhaar: "XXXX XXXX 9012",
    dob: "05 Mar 1992",
    gender: "Female",
    address: "88, Gomti Nagar, Lucknow, Uttar Pradesh - 226010",
    outstandingAmount: "₹1,80,000",
    totalApplications: 1,
    creditScore: 710,
    creditStatus: "Good",
    avatar: "https://i.pravatar.cc/150?u=4",
  },
  {
    id: "USR-10249",
    name: "Suresh Patel",
    email: "suresh.patel@gmail.com",
    phone: "+91 9876543214",
    kycStatus: "Pending",
    activeLoans: 0,
    closedLoans: 0,
    totalLoanAmount: "₹0",
    status: "Active",
    pan: "Pending",
    aadhaar: "Pending",
    dob: "18 Dec 1985",
    gender: "Male",
    address: "Sector 62, Noida, Uttar Pradesh - 201309",
    outstandingAmount: "₹0",
    totalApplications: 2,
    creditScore: 680,
    creditStatus: "Fair",
    avatar: "https://i.pravatar.cc/150?u=5",
  },
  {
    id: "USR-10250",
    name: "John Doe",
    email: "john.doe@gmail.com",
    phone: "+91 9876543215",
    kycStatus: "Verified",
    activeLoans: 3,
    closedLoans: 2,
    totalLoanAmount: "₹12,00,000",
    status: "Active",
    pan: "MZNXV1234P",
    aadhaar: "XXXX XXXX 3456",
    dob: "30 Sep 1980",
    gender: "Male",
    address: "DLF Phase 3, Gurgaon, Haryana - 122002",
    outstandingAmount: "₹6,50,000",
    totalApplications: 5,
    creditScore: 810,
    creditStatus: "Excellent",
    avatar: "https://i.pravatar.cc/150?u=6",
  },
  {
    id: "USR-10251",
    name: "Emily Davis",
    email: "emily.davis@gmail.com",
    phone: "+91 9876543216",
    kycStatus: "Verified",
    activeLoans: 1,
    closedLoans: 1,
    totalLoanAmount: "₹3,50,000",
    status: "Inactive",
    pan: "LKJHG0987K",
    aadhaar: "XXXX XXXX 7890",
    dob: "14 Feb 1993",
    gender: "Female",
    address: "Vasant Kunj, New Delhi - 110070",
    outstandingAmount: "₹0",
    totalApplications: 2,
    creditScore: 760,
    creditStatus: "Good",
    avatar: "https://i.pravatar.cc/150?u=7",
  },
  {
    id: "USR-10252",
    name: "Michael Brown",
    email: "michael.brown@gmail.com",
    phone: "+91 9876543217",
    kycStatus: "Blocked",
    activeLoans: 0,
    closedLoans: 1,
    totalLoanAmount: "₹0",
    status: "Blocked",
    pan: "POIUY5678R",
    aadhaar: "XXXX XXXX 2345",
    dob: "25 Jul 1982",
    gender: "Male",
    address: "Connaught Place, New Delhi - 110001",
    outstandingAmount: "₹0",
    totalApplications: 3,
    creditScore: 540,
    creditStatus: "Poor",
    avatar: "https://i.pravatar.cc/150?u=8",
  },
];

const topKpis = [
  {
    label: "Total Users",
    value: "2,547",
    change: "+12.5%",
    isUp: true,
    icon: Users,
    color: "text-[#489b0d]",
    bg: "bg-[#489b0d]/10",
  },
  {
    label: "Active Users",
    value: "2,187",
    change: "+9.8%",
    isUp: true,
    icon: UserCheck,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    label: "Inactive Users",
    value: "218",
    change: "-4.3%",
    isUp: false,
    icon: UserMinus,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    label: "KYC Pending",
    value: "142",
    change: "+8.2%",
    isUp: true,
    icon: ShieldAlert,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    label: "KYC Verified",
    value: "1,945",
    change: "+14.6%",
    isUp: true,
    icon: ShieldCheck,
    color: "text-[#489b0d]",
    bg: "bg-[#489b0d]/10",
  },
  {
    label: "Blocked Users",
    value: "56",
    change: "-2.1%",
    isUp: false,
    icon: UserX,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

export default function ManageUsers() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const selectedUser = selectedUserId
    ? mockUsers.find((u) => u.id === selectedUserId)
    : null;

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          User Management
        </h1>
        <div className="flex items-center text-[12px] font-medium text-slate-500">
          <Link to="/" className="hover:text-[#489b0d] transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={14} className="mx-1" />
          <span className="hover:text-[#489b0d] transition-colors cursor-pointer">
            User Management
          </span>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-[#489b0d] font-bold">Manage Users</span>
        </div>
      </div>

      {/* Top KPIs Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {topKpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-md border border-slate-100 p-4 shadow-sm flex flex-col justify-between min-h-[110px] hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-[12px] font-semibold text-slate-500 tracking-wide">
                {kpi.label}
              </p>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color}`}
              >
                <kpi.icon size={16} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 leading-none mb-2">
                {kpi.value}
              </h3>
              <p
                className={`text-[11px] font-medium flex items-center gap-1 ${kpi.isUp ? "text-[#489b0d]" : "text-red-500"}`}
              >
                {kpi.isUp ? (
                  <TrendingUp size={14} strokeWidth={2.5} />
                ) : (
                  <TrendingDown size={14} strokeWidth={2.5} />
                )}
                <span className="font-bold">{kpi.change}</span>
                <span className="text-slate-400 whitespace-nowrap">
                  vs last month
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* LEFT PANE: User Table */}
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center border-b border-slate-100 px-6 pt-4 gap-6 overflow-x-auto no-scrollbar">
            {[
              "All Users (2,547)",
              "Active (2,187)",
              "Inactive (218)",
              "KYC Pending (142)",
              "KYC Verified (1,945)",
              "Blocked (56)",
            ].map((tab, i) => (
              <button
                key={i}
                className={`pb-3 text-[12px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                  i === 0
                    ? "border-[#489b0d] text-[#489b0d]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filters & Actions */}
          <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
              <select className="px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d] min-w-[140px] shrink-0">
                <option>All Branches</option>
              </select>
              <select className="px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d] min-w-[140px] shrink-0">
                <option>All Roles</option>
              </select>
              <select className="px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d] min-w-[140px] shrink-0">
                <option>All Status</option>
              </select>
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-medium text-slate-600 cursor-pointer shrink-0">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                01 May 2025 - 18 May 2025
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-bold hover:bg-slate-50 transition-colors shrink-0 flex-1 md:flex-none">
                <Filter size={14} className="shrink-0" /> Filter
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#489b0d] text-white rounded-md text-[12px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm shrink-0 flex-1 md:flex-none">
                <Download size={14} className="shrink-0" /> Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-white">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]"
                    />
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-800 whitespace-nowrap">
                    User
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-800 whitespace-nowrap">
                    Contact Details
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-800 whitespace-nowrap">
                    KYC Status
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-800 whitespace-nowrap">
                    Loans
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-800 whitespace-nowrap">
                    Total Loan Amount
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-800 whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-3 px-4 text-[11px] font-bold text-slate-800 text-center whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`cursor-pointer transition-colors ${selectedUserId === user.id ? "bg-[#489b0d]/5 border-l-2 border-l-[#489b0d]" : "hover:bg-slate-50 border-l-2 border-l-transparent"}`}
                  >
                    <td
                      className="py-3 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-100"
                        />
                        <div>
                          <p className="text-[13px] font-bold text-slate-800 leading-none mb-1 whitespace-nowrap">
                            {user.name}
                          </p>
                          <p className="text-[11px] font-medium text-slate-500 leading-none whitespace-nowrap">
                            {user.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[12px] font-semibold text-slate-700 leading-none mb-1 whitespace-nowrap">
                        {user.email}
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 leading-none whitespace-nowrap">
                        {user.phone}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      {user.kycStatus === "Verified" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#489b0d] bg-[#489b0d]/10 px-2 py-0.5 rounded-md">
                          <ShieldCheck size={12} /> Verified
                        </span>
                      )}
                      {user.kycStatus === "Pending" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                      {user.kycStatus === "Blocked" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                          <Ban size={12} /> Blocked
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[11px] font-bold text-slate-700 leading-none mb-1 whitespace-nowrap">
                        <span className="text-slate-800">
                          {user.activeLoans}
                        </span>{" "}
                        Active
                      </p>
                      <p className="text-[11px] font-medium text-slate-500 leading-none whitespace-nowrap">
                        <span className="text-slate-600">
                          {user.closedLoans}
                        </span>{" "}
                        Closed
                      </p>
                    </td>
                    <td className="py-3 px-4 text-[13px] font-bold text-slate-800 whitespace-nowrap">
                      {user.totalLoanAmount}
                    </td>
                    <td className="py-3 px-4">
                      {user.status === "Active" && (
                        <span className="text-[11px] font-bold text-[#489b0d]">
                          Active
                        </span>
                      )}
                      {user.status === "Inactive" && (
                        <span className="text-[11px] font-bold text-orange-500">
                          Inactive
                        </span>
                      )}
                      {user.status === "Blocked" && (
                        <span className="text-[11px] font-bold text-red-500">
                          Blocked
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto bg-white">
            <p className="text-[12px] font-medium text-slate-500 text-center md:text-left w-full md:w-auto">
              Showing 1 to 8 of 2,547 entries
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5 w-full md:w-auto">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
                <ChevronRight size={14} className="rotate-180" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#489b0d] text-white font-bold text-[13px] shadow-sm">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">
                3
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">
                4
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">
                5
              </button>
              <span className="px-1 text-slate-400 text-[13px]">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">
                255
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: User Details Slide-over Drawer */}
        {selectedUser && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
              onClick={() => setSelectedUserId(null)}
            ></div>

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-screen w-full max-w-[600px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-100">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0 bg-white">
                <h3 className="text-lg font-bold text-slate-800">
                  User Details
                </h3>
                <button
                  onClick={() => setSelectedUserId(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Profile Header */}
              <div className="p-6 pb-0 flex items-start gap-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-50 shadow-sm shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-[18px] font-extrabold text-slate-800 leading-none">
                      {selectedUser.name}
                    </h2>
                    {selectedUser.status === "Active" && (
                      <span className="bg-[#489b0d]/10 text-[#489b0d] px-2 py-0.5 rounded-md text-[10px] font-bold">
                        Active
                      </span>
                    )}
                    {selectedUser.status === "Inactive" && (
                      <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                        Inactive
                      </span>
                    )}
                    {selectedUser.status === "Blocked" && (
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                        Blocked
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] font-medium text-slate-500 mb-2">
                    {selectedUser.id}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-md text-[10px] font-bold border border-green-100">
                      <ShieldCheck size={12} /> KYC Verified
                    </span>
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] font-bold border border-blue-100">
                      <User size={12} /> Loan Customer
                    </span>
                  </div>
                </div>
              </div>

              {/* Inner Tabs */}
              <div className="flex items-center gap-6 px-6 mt-6 border-b border-slate-100 overflow-x-auto no-scrollbar shrink-0">
                {[
                  { id: "Overview", icon: Eye },
                  { id: "Personal", icon: User },
                  { id: "KYC & Docs", icon: ShieldCheck },
                  { id: "Loans", icon: Briefcase },
                  { id: "Activity", icon: Clock },
                  { id: "Notes", icon: FileText },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1 pb-3 border-b-2 min-w-max transition-colors ${activeTab === tab.id ? "border-[#489b0d] text-[#489b0d]" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeTab === tab.id ? "bg-[#489b0d] text-white" : ""}`}
                    >
                      <tab.icon size={activeTab === tab.id ? 14 : 18} />
                    </div>
                    <span className="text-[10px] font-bold">{tab.id}</span>
                  </button>
                ))}
              </div>

              {/* Detail Content (Scrollable) */}
              <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
                {activeTab === "Overview" && (
                  <div className="space-y-4">
                    {/* Contact Box */}
                    <div className="border border-slate-100 rounded-md p-4 bg-slate-50/30 space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail
                          size={14}
                          className="text-slate-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                            Email
                          </p>
                          <p className="text-[12px] font-bold text-slate-800">
                            {selectedUser.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone
                          size={14}
                          className="text-slate-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                            Phone
                          </p>
                          <p className="text-[12px] font-bold text-slate-800">
                            {selectedUser.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CreditCard
                          size={14}
                          className="text-slate-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                            PAN Number
                          </p>
                          <p className="text-[12px] font-bold text-slate-800">
                            {selectedUser.pan}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CreditCard
                          size={14}
                          className="text-slate-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                            Aadhaar Number
                          </p>
                          <p className="text-[12px] font-bold text-slate-800">
                            {selectedUser.aadhaar}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar
                          size={14}
                          className="text-slate-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                            Date of Birth
                          </p>
                          <p className="text-[12px] font-bold text-slate-800">
                            {selectedUser.dob}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <User
                          size={14}
                          className="text-slate-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                            Gender
                          </p>
                          <p className="text-[12px] font-bold text-slate-800">
                            {selectedUser.gender}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin
                          size={14}
                          className="text-slate-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                            Address
                          </p>
                          <p className="text-[12px] font-bold text-slate-800 leading-relaxed">
                            {selectedUser.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Financial Stats Box */}
                    <div className="border border-slate-100 rounded-md p-4 bg-slate-50/30 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <Briefcase size={14} />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500">
                            Total Loan Amount
                          </p>
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedUser.totalLoanAmount}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <Bell size={14} />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500">
                            Outstanding Amount
                          </p>
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedUser.outstandingAmount}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <Calendar size={14} />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500">
                            Active Loans
                          </p>
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedUser.activeLoans}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <FileText size={14} />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500">
                            Closed Loans
                          </p>
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedUser.closedLoans}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <FileText size={14} />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500">
                            Total Applications
                          </p>
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedUser.totalApplications}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <div className="w-10 h-10 rounded-full border-4 border-[#489b0d] flex items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold text-[#489b0d]">
                            {selectedUser.creditScore}
                          </span>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500">
                            Credit Score
                          </p>
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedUser.creditStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Loans" && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-md border border-slate-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-green-50 text-[#489b0d] flex items-center justify-center shrink-0">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Total Applications
                          </p>
                          <h3 className="text-lg font-extrabold text-slate-800 leading-none mt-0.5">
                            3
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-md border border-slate-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Active Loans
                          </p>
                          <h3 className="text-lg font-extrabold text-slate-800 leading-none mt-0.5">
                            1
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-md border border-slate-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Total Disbursed
                          </p>
                          <h3 className="text-lg font-extrabold text-slate-800 leading-none mt-0.5">
                            ₹5,00,000
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-md border border-slate-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            EMI Due
                          </p>
                          <h3 className="text-lg font-extrabold text-slate-800 leading-none mt-0.5">
                            ₹12,500
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-md border border-slate-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Last Payment
                          </p>
                          <h3 className="text-lg font-extrabold text-slate-800 leading-none mt-0.5">
                            10 May 2025
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-md border border-slate-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                          <AlertCircle size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Next EMI Due
                          </p>
                          <h3 className="text-lg font-extrabold text-slate-800 leading-none mt-0.5">
                            10 Jun 2025
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab !== "Overview" && activeTab !== "Loans" && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
                    <p className="text-[13px] font-bold">
                      Section under construction
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 bg-white mt-auto">
                <button className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 bg-[#489b0d] text-white rounded-md text-[13px] font-bold shadow-sm hover:bg-[#3e850b] transition-colors">
                  <Eye size={16} className="shrink-0" /> <span className="whitespace-nowrap">View Full Profile</span>
                </button>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-0 sm:px-5 py-3 border border-[#489b0d]/20 bg-[#489b0d]/5 text-[#489b0d] rounded-md text-[13px] font-bold hover:bg-[#489b0d]/10 transition-colors">
                    <Edit size={16} className="shrink-0" /> <span className="whitespace-nowrap">Edit User</span>
                  </button>
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-0 sm:px-5 py-3 border border-red-200 bg-red-50 text-red-600 rounded-md text-[13px] font-bold hover:bg-red-100 transition-colors">
                    <Ban size={16} className="shrink-0" /> <span className="whitespace-nowrap">Block User</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
