import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";
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
  Unlock,
  Clock,
  X,
  Search,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// --- Mock Data ---
export const mockUsers = [
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
    // Expanded Fields
    maritalStatus: "Married",
    nationality: "Indian",
    alternatePhone: "+91 9123456789",
    currentAddress: "123, Green Park Society, Sector 45, Gurugram, Haryana - 122003",
    permanentAddress: "Vill. Rampur, Post - Bazar, District - Patna, Bihar - 800001",
    preferredCommunication: "Email",
    source: "Google Ads",
    occupation: "Salaried",
    annualIncome: "₹ 12,00,000",
    education: "B.Tech (Computer Science)",
    gstRegistered: "No",
    registeredOn: "12 May 2025, 10:30 AM",
    lastLogin: "31 May 2025, 04:45 PM",
    approvedApplications: 1,
    underReviewApplications: 1,
    rejectedApplications: 1,
    totalUploadedDocuments: 12,
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
    maritalStatus: "Single",
    nationality: "Indian",
    alternatePhone: "+91 9123456711",
    currentAddress: "45, Civil Lines, Kanpur, Uttar Pradesh - 208001",
    permanentAddress: "45, Civil Lines, Kanpur, Uttar Pradesh - 208001",
    preferredCommunication: "WhatsApp",
    source: "Referral",
    occupation: "Self-Employed",
    annualIncome: "₹ 15,50,000",
    education: "MBA",
    gstRegistered: "Yes",
    registeredOn: "01 Feb 2025, 11:15 AM",
    lastLogin: "18 May 2025, 09:20 AM",
    approvedApplications: 2,
    underReviewApplications: 1,
    rejectedApplications: 1,
    totalUploadedDocuments: 8,
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
    maritalStatus: "Single",
    nationality: "Indian",
    alternatePhone: "N/A",
    currentAddress: "12, MG Road, Agra, Uttar Pradesh - 282001",
    permanentAddress: "12, MG Road, Agra, Uttar Pradesh - 282001",
    preferredCommunication: "SMS",
    source: "Organic Search",
    occupation: "Salaried",
    annualIncome: "₹ 5,00,000",
    education: "B.Sc",
    gstRegistered: "No",
    registeredOn: "15 May 2025, 02:30 PM",
    lastLogin: "16 May 2025, 10:10 AM",
    approvedApplications: 0,
    underReviewApplications: 1,
    rejectedApplications: 0,
    totalUploadedDocuments: 2,
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
    maritalStatus: "Married",
    nationality: "Indian",
    alternatePhone: "+91 9876543299",
    currentAddress: "88, Gomti Nagar, Lucknow, Uttar Pradesh - 226010",
    permanentAddress: "Varanasi, Uttar Pradesh",
    preferredCommunication: "Email",
    source: "Facebook Ads",
    occupation: "Salaried",
    annualIncome: "₹ 8,50,000",
    education: "B.Com",
    gstRegistered: "No",
    registeredOn: "20 Mar 2025, 04:00 PM",
    lastLogin: "18 May 2025, 12:45 PM",
    approvedApplications: 1,
    underReviewApplications: 0,
    rejectedApplications: 0,
    totalUploadedDocuments: 5,
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
    maritalStatus: "Married",
    nationality: "Indian",
    alternatePhone: "+91 9876543288",
    currentAddress: "Sector 62, Noida, Uttar Pradesh - 201309",
    permanentAddress: "Surat, Gujarat",
    preferredCommunication: "Phone Call",
    source: "Direct",
    occupation: "Business",
    annualIncome: "₹ 20,00,000",
    education: "12th Pass",
    gstRegistered: "Yes",
    registeredOn: "10 Apr 2025, 09:30 AM",
    lastLogin: "17 May 2025, 03:20 PM",
    approvedApplications: 0,
    underReviewApplications: 2,
    rejectedApplications: 0,
    totalUploadedDocuments: 3,
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
    maritalStatus: "Single",
    nationality: "NRI",
    alternatePhone: "+1 555 1234567",
    currentAddress: "DLF Phase 3, Gurgaon, Haryana - 122002",
    permanentAddress: "California, USA",
    preferredCommunication: "Email",
    source: "LinkedIn",
    occupation: "Salaried",
    annualIncome: "₹ 45,00,000",
    education: "MS Computer Science",
    gstRegistered: "No",
    registeredOn: "15 Jan 2024, 08:00 AM",
    lastLogin: "19 May 2025, 08:30 AM",
    approvedApplications: 5,
    underReviewApplications: 0,
    rejectedApplications: 0,
    totalUploadedDocuments: 15,
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
    maritalStatus: "Married",
    nationality: "Indian",
    alternatePhone: "N/A",
    currentAddress: "Vasant Kunj, New Delhi - 110070",
    permanentAddress: "Vasant Kunj, New Delhi - 110070",
    preferredCommunication: "WhatsApp",
    source: "Referral",
    occupation: "Freelancer",
    annualIncome: "₹ 9,00,000",
    education: "BFA",
    gstRegistered: "No",
    registeredOn: "22 Aug 2024, 11:45 AM",
    lastLogin: "01 Mar 2025, 02:15 PM",
    approvedApplications: 2,
    underReviewApplications: 0,
    rejectedApplications: 0,
    totalUploadedDocuments: 6,
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
    maritalStatus: "Divorced",
    nationality: "Indian",
    alternatePhone: "+91 9876543211",
    currentAddress: "Connaught Place, New Delhi - 110001",
    permanentAddress: "Mumbai, Maharashtra",
    preferredCommunication: "Email",
    source: "Google Ads",
    occupation: "Unemployed",
    annualIncome: "₹ 2,00,000",
    education: "B.A",
    gstRegistered: "No",
    registeredOn: "05 Jun 2024, 01:20 PM",
    lastLogin: "10 Feb 2025, 10:00 AM",
    approvedApplications: 1,
    underReviewApplications: 0,
    rejectedApplications: 2,
    totalUploadedDocuments: 4,
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
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [kycFilter, setKycFilter] = useState("All KYC Status");
  const [selectedListTab, setSelectedListTab] = useState("All Users"); // Main table tabs
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter;
      const matchesKyc = kycFilter === 'All KYC Status' || user.kycStatus === kycFilter;
      const matchesTab = selectedListTab === "All Users" ||
                         (selectedListTab === "Active" && user.status === "Active") ||
                         (selectedListTab === "Inactive" && user.status === "Inactive") ||
                         (selectedListTab === "KYC Pending" && user.kycStatus === "Pending") ||
                         (selectedListTab === "KYC Verified" && user.kycStatus === "Verified") ||
                         (selectedListTab === "Blocked" && user.status === "Blocked");
      
      return matchesSearch && matchesStatus && matchesKyc && matchesTab;
    });
  }, [users, searchTerm, statusFilter, kycFilter, selectedListTab]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentItems = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Dynamic KPIs
  const activeCount = users.filter(u => u.status === 'Active').length;
  const inactiveCount = users.filter(u => u.status === 'Inactive').length;
  const kycPendingCount = users.filter(u => u.kycStatus === 'Pending').length;
  const kycVerifiedCount = users.filter(u => u.kycStatus === 'Verified').length;
  const blockedCount = users.filter(u => u.status === 'Blocked').length;

  const dynamicTopKpis = [
    { label: "Total Users", value: users.length, change: "+12.5%", isUp: true, icon: Users, color: "text-[#489b0d]", bg: "bg-[#489b0d]/10" },
    { label: "Active Users", value: activeCount, change: "+9.8%", isUp: true, icon: UserCheck, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Inactive Users", value: inactiveCount, change: "-4.3%", isUp: false, icon: UserMinus, color: "text-red-500", bg: "bg-red-50" },
    { label: "KYC Pending", value: kycPendingCount, change: "+8.2%", isUp: true, icon: ShieldAlert, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "KYC Verified", value: kycVerifiedCount, change: "+14.6%", isUp: true, icon: ShieldCheck, color: "text-[#489b0d]", bg: "bg-[#489b0d]/10" },
    { label: "Blocked Users", value: blockedCount, change: "-2.1%", isUp: false, icon: UserX, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  const handleDelete = (e, id) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = users.filter(u => u.id !== id);
        setUsers(updated);
        const newTotalPages = Math.ceil(updated.length / itemsPerPage) || 1;
        if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      }
    });
  };

  const handleToggleBlock = (e, id, currentStatus) => {
    e.stopPropagation();
    const newStatus = currentStatus === "Blocked" ? "Active" : "Blocked";
    const confirmMsg = currentStatus === "Blocked" ? "Are you sure you want to unblock this user?" : "Are you sure you want to block this user?";
    Swal.fire({
      title: 'Confirmation',
      text: confirmMsg,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#489b0d',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
        Swal.fire('Updated!', `User status changed to ${newStatus}.`, 'success');
      }
    });
  };

  // Reset page when filters change
  useMemo(() => { setCurrentPage(1); }, [searchTerm, statusFilter, kycFilter, selectedListTab]);

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search users, email, phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-16 py-2.5 bg-white border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-80">
            <span className="text-[10px] font-bold text-slate-400">Ctrl + K</span>
          </div>
        </div>
      </div>

      {/* Top KPIs Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {dynamicTopKpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-md border border-slate-100 p-4 shadow-sm flex flex-col justify-between min-h-[110px] hover:shadow-md transition-shadow cursor-pointer"
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
              { id: "All Users", count: users.length },
              { id: "Active", count: activeCount },
              { id: "Inactive", count: inactiveCount },
              { id: "KYC Pending", count: kycPendingCount },
              { id: "KYC Verified", count: kycVerifiedCount },
              { id: "Blocked", count: blockedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedListTab(tab.id)}
                className={`cursor-pointer pb-3 text-[12px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                  selectedListTab === tab.id
                    ? "border-[#489b0d] text-[#489b0d]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.id} ({tab.count})
              </button>
            ))}
          </div>

          {/* Filters & Actions */}
          <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
              <select value={kycFilter} onChange={(e) => setKycFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d] min-w-[140px] shrink-0 cursor-pointer">
                <option value="All KYC Status">All KYC Status</option>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Blocked">Blocked</option>
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d] min-w-[140px] shrink-0 cursor-pointer">
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Blocked">Blocked</option>
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
                {currentItems.length > 0 ? currentItems.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/user-profile/${user.id}`)}
                    className="cursor-pointer transition-colors hover:bg-slate-50 border-l-2 border-l-transparent"
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
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => handleToggleBlock(e, user.id, user.status)}
                          className={`p-1.5 rounded-md transition-colors ${
                            user.status === "Blocked" 
                              ? "text-orange-500 hover:text-orange-600 hover:bg-orange-50" 
                              : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                          }`}
                          title={user.status === "Blocked" ? "Unblock User" : "Block User"}
                        >
                          {user.status === "Blocked" ? <Unlock size={16} /> : <Ban size={16} />}
                        </button>
                        <Link 
                          to={`/user-profile/${user.id}`} 
                          className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          title="View Profile"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={(e) => handleDelete(e, user.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-500 text-sm">
                      No users found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto bg-white">
            <p className="text-[12px] font-medium text-slate-500 text-center md:text-left w-full md:w-auto">
              Showing {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5 w-full md:w-auto">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <ChevronRight size={14} className="rotate-180" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium text-[13px] transition-colors ${
                    currentPage === page 
                      ? 'bg-[#489b0d] text-white shadow-sm' 
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
