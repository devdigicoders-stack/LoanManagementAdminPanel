import { useState } from "react";
import {
  ChevronRight,
  Filter,
  Plus,
  Eye,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  Download,
  AlertCircle,
  Calendar,
  Briefcase,
  Check,
} from "lucide-react";

// Mock Data
const mockApplications = [
  {
    id: "APP-2025-1250",
    customer: "Rohit Kumar",
    email: "rohit.kumar@gmail.com",
    mobile: "+91 9876543210",
    address: "123, Green Park, Lucknow, Uttar Pradesh - 226001",
    loanType: "Personal Loan",
    amount: "₹2,50,000",
    status: "Pending",
    appliedOn: "18 May 2025",
    assignedTo: "Ravi Kumar",
    pan: "ABCDE1234F",
    aadhar: "XXXX XXXX 1234",
    avatar: "https://i.pravatar.cc/150?u=rohit",
  },
  {
    id: "APP-2025-1249",
    customer: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    mobile: "+91 9876543211",
    address: "45, Civil Lines, Kanpur, UP",
    loanType: "Home Loan",
    amount: "₹12,00,000",
    status: "Approved",
    appliedOn: "18 May 2025",
    assignedTo: "Neha Singh",
    pan: "FGHIJ5678K",
    aadhar: "XXXX XXXX 5678",
    avatar: "https://i.pravatar.cc/150?u=priya",
  },
  {
    id: "APP-2025-1248",
    customer: "Amit Verma",
    email: "amit.verma@gmail.com",
    mobile: "+91 9876543212",
    address: "89, Gomti Nagar, Lucknow",
    loanType: "Business Loan",
    amount: "₹5,00,000",
    status: "Under Review",
    appliedOn: "17 May 2025",
    assignedTo: "Suresh Patel",
    pan: "KLMNO9012P",
    aadhar: "XXXX XXXX 9012",
    avatar: "https://i.pravatar.cc/150?u=amit",
  },
  {
    id: "APP-2025-1247",
    customer: "Neha Singh",
    email: "neha.singh@gmail.com",
    mobile: "+91 9876543213",
    address: "12, Indira Nagar, Lucknow",
    loanType: "Education Loan",
    amount: "₹8,00,000",
    status: "Pending",
    appliedOn: "17 May 2025",
    assignedTo: "John Doe",
    pan: "PQRST3456U",
    aadhar: "XXXX XXXX 3456",
    avatar: "https://i.pravatar.cc/150?u=neha",
  },
  {
    id: "APP-2025-1246",
    customer: "Suresh Patel",
    email: "suresh.patel@gmail.com",
    mobile: "+91 9876543214",
    address: "76, Aliganj, Lucknow",
    loanType: "Personal Loan",
    amount: "₹1,00,000",
    status: "Rejected",
    appliedOn: "17 May 2025",
    assignedTo: "Emily Davis",
    pan: "UVWXY7890Z",
    aadhar: "XXXX XXXX 7890",
    avatar: "https://i.pravatar.cc/150?u=suresh",
  },
];

export default function ManageApplications() {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  const selectedApp = selectedAppId
    ? applications.find((a) => a.id === selectedAppId)
    : null;

  const handleStatusChange = (newStatus) => {
    if (!selectedApp) return;
    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApp.id ? { ...app, status: newStatus } : app
      )
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="text-orange-500 bg-orange-50 px-2.5 py-1 rounded-md text-[11px] font-bold">
            Pending
          </span>
        );
      case "Approved":
        return (
          <span className="text-[#489b0d] bg-[#489b0d]/10 px-2.5 py-1 rounded-md text-[11px] font-bold">
            Approved
          </span>
        );
      case "Under Review":
        return (
          <span className="text-blue-500 bg-blue-50 px-2.5 py-1 rounded-md text-[11px] font-bold">
            Under Review
          </span>
        );
      case "Rejected":
        return (
          <span className="text-red-500 bg-red-50 px-2.5 py-1 rounded-md text-[11px] font-bold">
            Rejected
          </span>
        );
      case "Disbursed":
        return (
          <span className="text-purple-500 bg-purple-50 px-2.5 py-1 rounded-md text-[11px] font-bold">
            Disbursed
          </span>
        );
      default:
        return (
          <span className="text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md text-[11px] font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
        <div className="shrink-0 mt-1">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Loan Applications
          </h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500 whitespace-nowrap">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Loan Management
            </span>
            <ChevronRight size={14} className="mx-1 shrink-0" />
            <span className="text-[#489b0d] font-bold">All Applications</span>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white flex-1 sm:flex-none min-w-[120px]">
            <option>All Branches</option>
          </select>
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white flex-1 sm:flex-none min-w-[120px]">
            <option>All Loan Types</option>
          </select>
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white flex-1 sm:flex-none min-w-[120px]">
            <option>All Status</option>
          </select>
          <div className="h-10 px-3 flex items-center justify-between rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 bg-white flex-1 sm:flex-none min-w-[190px]">
            <span className="truncate">01 May 2025 - 18 May 2025</span>
            <Calendar size={14} className="text-slate-400 shrink-0 ml-2" />
          </div>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm flex-1 sm:flex-none whitespace-nowrap">
            <Filter size={14} /> Filter
          </button>
          <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm flex-1 sm:flex-none whitespace-nowrap shrink-0">
            <Plus size={16} /> New Application
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[40px]">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]"
                  />
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Application ID
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Loan Type
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Applied On
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${selectedAppId === app.id ? "bg-[#489b0d]/5" : ""}`}
                  onClick={() => setSelectedAppId(app.id)}
                >
                  <td
                    className="py-4 px-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]"
                    />
                  </td>
                  <td className="py-4 px-4 text-[12px] font-bold text-slate-600">
                    {app.id}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-[13px] font-bold text-slate-800">
                      {app.customer}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[12px] font-semibold text-slate-600">
                    {app.loanType}
                  </td>
                  <td className="py-4 px-4 text-[13px] font-extrabold text-slate-700">
                    {app.amount}
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(app.status)}</td>
                  <td className="py-4 px-4 text-[12px] font-medium text-slate-500 whitespace-nowrap">
                    {app.appliedOn}
                  </td>
                  <td className="py-4 px-4 text-[12px] font-semibold text-slate-700">
                    {app.assignedTo}
                  </td>
                  <td
                    className="py-4 px-6 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedAppId(app.id)}
                      className="p-1.5 text-slate-400 hover:text-[#489b0d] hover:bg-[#489b0d]/10 rounded-md transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <p className="text-[12px] font-medium text-slate-500">
            Showing 1 to 5 of 1,248 entries
          </p>
          <div className="flex items-center gap-1">
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
            <span className="px-1 text-slate-400 text-[13px]">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium text-[13px]">
              125
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Application Details Slide-over Drawer */}
      {selectedApp && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedAppId(null)}
          ></div>

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-screen w-full max-w-[850px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-100 animate-slide-in-right">
            {/* Drawer Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 p-4 sm:p-6 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">
                  Application Details
                </h3>
                <div className="flex flex-wrap items-center gap-y-1 text-[11px] font-semibold text-slate-400 mt-1">
                  <span className="whitespace-nowrap">Loan Management</span> <ChevronRight size={12} className="mx-1 shrink-0" />{" "}
                  <span className="whitespace-nowrap">Loan Applications</span> <ChevronRight size={12} className="mx-1 shrink-0" />{" "}
                  <span className="text-[#489b0d] font-bold whitespace-nowrap">Application Details</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppId(null)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto shrink-0"
              >
                <ArrowRight size={14} className="shrink-0" /> Back to List
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left/Main Content (3 cols) */}
                <div className="md:col-span-3 w-full min-w-0">
                  {/* Top Profile Summary */}
                  <div className="flex items-center sm:items-start gap-4 sm:gap-5 w-full min-w-0">
                    <img
                      src={selectedApp.avatar}
                      alt={selectedApp.customer}
                      className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-full object-cover border-2 sm:border-4 border-slate-50 shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-none mb-2 sm:mb-2 truncate">
                        {selectedApp.customer}
                      </h2>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-400 mb-0.5">
                            Application ID
                          </p>
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedApp.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-400 mb-0.5">
                            Applied On
                          </p>
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedApp.appliedOn}
                          </p>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <p className="text-[11px] font-semibold text-slate-400 mb-0.5">
                            Assigned To
                          </p>
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedApp.assignedTo}
                          </p>
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex items-end">
                          {getStatusBadge(selectedApp.status)}
                        </div>
                      </div>

                      {/* Inner Tabs */}
                      <div className="flex items-center gap-6 sm:gap-8 border-b border-slate-100 overflow-x-auto no-scrollbar pb-1">
                        {[
                          "Overview",
                          "Verification",
                          "Approval",
                          "Disbursement",
                        ].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? "border-[#489b0d] text-[#489b0d]" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tab Content Area */}
                  <div className="py-6">
                    {activeTab === "Overview" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Contact Information */}
                        <div className="space-y-5">
                          <h4 className="text-[14px] font-extrabold text-slate-800 pb-2 border-b border-slate-100">
                            Contact Information
                          </h4>

                          <div className="flex items-start gap-3">
                            <Mail
                              size={16}
                              className="text-slate-400 shrink-0 mt-0.5"
                            />
                            <div>
                              <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                                Email
                              </p>
                              <p className="text-[13px] font-bold text-slate-800">
                                {selectedApp.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Phone
                              size={16}
                              className="text-slate-400 shrink-0 mt-0.5"
                            />
                            <div>
                              <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                                Phone
                              </p>
                              <p className="text-[13px] font-bold text-slate-800">
                                {selectedApp.mobile}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <MapPin
                              size={16}
                              className="text-slate-400 shrink-0 mt-0.5"
                            />
                            <div>
                              <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                                Address
                              </p>
                              <p className="text-[13px] font-bold text-slate-800 leading-relaxed">
                                {selectedApp.address}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Quick Loan Info */}
                        <div className="space-y-5">
                          <h4 className="text-[14px] font-extrabold text-slate-800 pb-2 border-b border-slate-100">
                            Loan Overview
                          </h4>

                          <div className="grid grid-cols-2 gap-5">
                            <div>
                              <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                                Loan Type
                              </p>
                              <p className="text-[13px] font-bold text-slate-800">
                                {selectedApp.loanType}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                                Loan Amount
                              </p>
                              <p className="text-[15px] font-extrabold text-[#489b0d]">
                                {selectedApp.amount}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                                PAN Number
                              </p>
                              <p className="text-[13px] font-bold text-slate-800">
                                {selectedApp.pan}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                                Aadhar Number
                              </p>
                              <p className="text-[13px] font-bold text-slate-800">
                                {selectedApp.aadhar}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                                  {activeTab === "Verification" && (
                      <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Verification Checklists */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-[14px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">Document Details</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 rounded-md border border-slate-100 bg-slate-50/50">
                                <span className="text-[12px] font-bold text-slate-600 flex items-center gap-2"><CheckCircle2 size={14} className="text-[#489b0d]"/> PAN Card</span>
                                <span className="text-[11px] font-extrabold text-[#489b0d] bg-[#489b0d]/10 px-2 py-1 rounded">Verified</span>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-md border border-slate-100 bg-slate-50/50">
                                <span className="text-[12px] font-bold text-slate-600 flex items-center gap-2"><CheckCircle2 size={14} className="text-[#489b0d]"/> Aadhaar Card</span>
                                <span className="text-[11px] font-extrabold text-[#489b0d] bg-[#489b0d]/10 px-2 py-1 rounded">Verified</span>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-md border border-orange-100 bg-orange-50/50">
                                <span className="text-[12px] font-bold text-slate-600 flex items-center gap-2"><AlertCircle size={14} className="text-orange-500"/> Income Proof</span>
                                <span className="text-[11px] font-extrabold text-orange-500 bg-orange-100 px-2 py-1 rounded">Pending Upload</span>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-md border border-slate-100 bg-slate-50/50">
                                <span className="text-[12px] font-bold text-slate-600 flex items-center gap-2"><CheckCircle2 size={14} className="text-[#489b0d]"/> Bank Statement</span>
                                <span className="text-[11px] font-extrabold text-[#489b0d] bg-[#489b0d]/10 px-2 py-1 rounded">Verified</span>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-md border border-slate-100 bg-slate-50/50">
                                <span className="text-[12px] font-bold text-slate-600 flex items-center gap-2"><CheckCircle2 size={14} className="text-[#489b0d]"/> Address Proof</span>
                                <span className="text-[11px] font-extrabold text-[#489b0d] bg-[#489b0d]/10 px-2 py-1 rounded">Verified</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[14px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">Verification Checklist</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 rounded-md border border-slate-100">
                                <span className="text-[12px] font-bold text-slate-600 flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-[#489b0d] flex items-center justify-center"><div className="w-2 h-2 bg-[#489b0d] rounded-full"></div></div> Identity Verified</span>
                                <Check size={16} className="text-[#489b0d]"/>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-md border border-slate-100">
                                <span className="text-[12px] font-bold text-slate-600 flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-[#489b0d] flex items-center justify-center"><div className="w-2 h-2 bg-[#489b0d] rounded-full"></div></div> Address Verified</span>
                                <Check size={16} className="text-[#489b0d]"/>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-md border border-slate-100">
                                <span className="text-[12px] font-bold text-slate-600 flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-[#489b0d] flex items-center justify-center"><div className="w-2 h-2 bg-[#489b0d] rounded-full"></div></div> Bank Verified</span>
                                <Check size={16} className="text-[#489b0d]"/>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-md border border-slate-100">
                                <span className="text-[12px] font-bold text-slate-600 flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-[#489b0d] flex items-center justify-center"><div className="w-2 h-2 bg-[#489b0d] rounded-full"></div></div> CIBIL Score: 768 (Good)</span>
                                <Check size={16} className="text-[#489b0d]"/>
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6">
                              <button 
                                onClick={() => handleStatusChange("Rejected")}
                                className="h-10 px-6 rounded-md border border-red-200 text-red-500 font-bold text-[13px] hover:bg-red-50 transition-colors">
                                Reject
                              </button>
                              <button 
                                onClick={() => { handleStatusChange("Under Review"); setActiveTab("Approval"); }}
                                className="h-10 px-6 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
                                Approve & Next
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "Approval" && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-md border border-slate-100">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sanction Amount</p>
                            <p className="text-[16px] font-extrabold text-[#489b0d]">{selectedApp.amount}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Interest Rate</p>
                            <p className="text-[16px] font-extrabold text-slate-800">11.25%</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Processing Fee</p>
                            <p className="text-[16px] font-extrabold text-slate-800">₹1,500</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Requested Tenure</p>
                            <p className="text-[16px] font-extrabold text-slate-800">24 Months</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-[14px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">Approval Details</h4>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-[11px] font-semibold text-slate-500 mb-1">Sanction Date</p>
                                <div className="h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-800 bg-white flex items-center">
                                  18 May 2025
                                </div>
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-slate-500 mb-1">EMI Amount</p>
                                <div className="h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-800 bg-white flex items-center">
                                  ₹ 45,600
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-slate-500 mb-1">Approver Remarks</p>
                              <textarea className="w-full p-3 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-800 bg-white resize-none h-20" defaultValue="Application meets criteria. Approved."></textarea>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[14px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">Conditions</h4>
                            <div className="space-y-3 mb-6">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" />
                                <span className="text-[13px] font-bold text-slate-700">All documents verified</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" />
                                <span className="text-[13px] font-bold text-slate-700">Income stable</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" />
                                <span className="text-[13px] font-bold text-slate-700">Credit score good</span>
                              </label>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" />
                                <span className="text-[13px] font-bold text-slate-700">No overdue</span>
                              </label>
                            </div>
                            
                            <div className="mb-4">
                              <p className="text-[11px] font-semibold text-slate-500 mb-1">Sanction Letter</p>
                              <button className="h-9 px-4 rounded-lg border border-slate-200 text-[#489b0d] font-bold text-[12px] hover:bg-slate-50 transition-colors flex items-center gap-2">
                                <Download size={14} /> Download PDF
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                          <button 
                            onClick={() => handleStatusChange("Rejected")}
                            className="h-10 px-6 rounded-md border border-red-200 text-red-500 font-bold text-[13px] hover:bg-red-50 transition-colors">
                            Reject
                          </button>
                          <button 
                            onClick={() => { handleStatusChange("Pending"); setActiveTab("Verification"); }}
                            className="h-10 px-6 rounded-md border border-orange-200 text-orange-500 font-bold text-[13px] hover:bg-orange-50 transition-colors">
                            Send Back
                          </button>
                          <button 
                            onClick={() => { handleStatusChange("Approved"); setActiveTab("Disbursement"); }}
                            className="h-10 px-6 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
                            Send for Disbursement
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === "Disbursement" && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-[14px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">Disbursement Summary</h4>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-[12px] font-bold text-slate-500">Loan ID</span>
                                <span className="text-[13px] font-extrabold text-slate-800">{selectedApp.id}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[12px] font-bold text-slate-500">Applicant</span>
                                <span className="text-[13px] font-extrabold text-slate-800">{selectedApp.customer}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[12px] font-bold text-slate-500">Loan Amount</span>
                                <span className="text-[14px] font-extrabold text-slate-800">{selectedApp.amount}</span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                <span className="text-[12px] font-bold text-[#489b0d]">Net Disbursement</span>
                                <span className="text-[16px] font-extrabold text-[#489b0d]">₹ 9,90,500</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[12px] font-bold text-slate-500">Disbursement Date</span>
                                <span className="text-[13px] font-extrabold text-slate-800">19 May 2025</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[12px] font-bold text-slate-500">Bank</span>
                                <span className="text-[13px] font-extrabold text-slate-800">HDFC Bank - 1234</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[14px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">Bank Transfer</h4>
                            <div className="space-y-4 mb-6">
                              <div>
                                <p className="text-[11px] font-semibold text-slate-500 mb-1">Account Number</p>
                                <div className="h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 bg-slate-50 flex items-center">
                                  XXXX XXXX 1234
                                </div>
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-slate-500 mb-1">IFSC Code</p>
                                <div className="h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 bg-slate-50 flex items-center">
                                  HDFC0001234
                                </div>
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-slate-500 mb-1">Transfer Mode</p>
                                <select className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 bg-white focus:outline-none focus:border-[#489b0d]">
                                  <option>NEFT</option>
                                  <option>RTGS</option>
                                  <option>IMPS</option>
                                </select>
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-slate-500 mb-1">UTR Number</p>
                                <input type="text" placeholder="Enter UTR Number" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 bg-white focus:outline-none focus:border-[#489b0d]" />
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2 p-3 bg-[#489b0d]/5 rounded-lg border border-[#489b0d]/20 mb-6">
                              <CheckCircle2 size={16} className="text-[#489b0d] shrink-0 mt-0.5" />
                              <p className="text-[11px] font-bold text-[#489b0d]">Ready for disbursement. Account details verified.</p>
                            </div>

                            <button 
                              onClick={() => { handleStatusChange("Disbursed"); setSelectedAppId(null); }}
                              className="w-full h-11 flex items-center justify-center rounded-md bg-[#489b0d] text-white font-bold text-[14px] hover:bg-[#3e850b] transition-colors shadow-sm">
                              Confirm Disbursement
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column (Actions) */}
                <div className="bg-slate-50/80 rounded-md p-5 border border-slate-100 flex flex-col gap-2 h-fit">
                  <h4 className="text-[12px] font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    Actions
                  </h4>

                  <button className="flex items-center gap-2 text-[12px] font-bold text-slate-600 hover:text-[#489b0d] py-1.5 transition-colors">
                    <CheckCircle2 size={15} /> Verify Application
                  </button>
                  <button className="flex items-center gap-2 text-[12px] font-bold text-slate-600 hover:text-[#489b0d] py-1.5 transition-colors">
                    <UserCheck size={15} /> Assign To
                  </button>
                  <button className="flex items-center gap-2 text-[12px] font-bold text-slate-600 hover:text-[#489b0d] py-1.5 transition-colors">
                    <Briefcase size={15} /> Disburse Loan
                  </button>

                  <div className="my-2 border-t border-slate-200"></div>

                  <button 
                    onClick={() => handleStatusChange("Approved")}
                    className="flex items-center gap-2 text-[12px] font-bold text-[#489b0d] py-1.5 transition-colors">
                    <CheckCircle2 size={15} /> Approve Application
                  </button>
                  <button 
                    onClick={() => handleStatusChange("Rejected")}
                    className="flex items-center gap-2 text-[12px] font-bold text-red-500 py-1.5 transition-colors">
                    <XCircle size={15} /> Reject Application
                  </button>

                  <div className="my-2 border-t border-slate-200"></div>

                  <button className="flex items-center gap-2 text-[12px] font-bold text-slate-600 hover:text-blue-500 py-1.5 transition-colors">
                    <FileText size={15} /> View Documents
                  </button>
                  <button className="flex items-center justify-center gap-2 mt-4 w-full py-2.5 border border-[#489b0d]/20 bg-[#489b0d]/5 text-[#489b0d] rounded-lg text-[12px] font-bold hover:bg-[#489b0d]/10 transition-colors">
                    <Download size={14} /> Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
