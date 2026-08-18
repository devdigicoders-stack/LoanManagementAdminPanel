import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Filter,
  MoreVertical,
  Eye,
  Plus,
  ArrowRight,
  X,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  FileText,
  User,
  Briefcase,
  UserCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-react";

// --- Mock Data ---
const mockLeads = [
  {
    id: "LID-2025-1268",
    name: "Rohit Kumar",
    mobile: "+91 9876543210",
    email: "rohit.kumar@gmail.com",
    source: "Website",
    assignedTo: "Ravi Kumar",
    status: "New",
    createdOn: "18 May 2025",
    nextFollowUp: "20 May 2025",
    expectedAmount: "₹5,00,000",
    loanPurpose: "Home Loan",
    address: "123, Green Park, Lucknow, Uttar Pradesh - 226001",
    avatar: "https://i.pravatar.cc/150?u=rohit",
  },
  {
    id: "LID-2025-1267",
    name: "Priya Sharma",
    mobile: "+91 9876543211",
    email: "priya.sharma@gmail.com",
    source: "Referral",
    assignedTo: "Neha Singh",
    status: "Contacted",
    createdOn: "17 May 2025",
    nextFollowUp: "19 May 2025",
    expectedAmount: "₹7,50,000",
    loanPurpose: "Personal Loan",
    address: "45, Civil Lines, Kanpur, Uttar Pradesh - 208001",
    avatar: "https://i.pravatar.cc/150?u=priya",
  },
  {
    id: "LID-2025-1266",
    name: "Amit Verma",
    mobile: "+91 9876543212",
    email: "amit.verma@gmail.com",
    source: "Walk-in",
    assignedTo: "Suresh Patel",
    status: "Qualified",
    createdOn: "17 May 2025",
    nextFollowUp: "21 May 2025",
    expectedAmount: "₹10,00,000",
    loanPurpose: "Business Loan",
    address: "89, Gomti Nagar, Lucknow, Uttar Pradesh - 226010",
    avatar: "https://i.pravatar.cc/150?u=amit",
  },
  {
    id: "LID-2025-1265",
    name: "Neha Singh",
    mobile: "+91 9876543213",
    email: "neha.singh@gmail.com",
    source: "Tele Calling",
    assignedTo: "John Doe",
    status: "Converted",
    createdOn: "16 May 2025",
    nextFollowUp: "19 May 2025",
    expectedAmount: "₹2,00,000",
    loanPurpose: "Education Loan",
    address: "12, Indira Nagar, Lucknow, Uttar Pradesh - 226016",
    avatar: "https://i.pravatar.cc/150?u=neha",
  },
  {
    id: "LID-2025-1264",
    name: "Suresh Patel",
    mobile: "+91 9876543214",
    email: "suresh.patel@gmail.com",
    source: "Website",
    assignedTo: "Emily Davis",
    status: "New",
    createdOn: "16 May 2025",
    nextFollowUp: "20 May 2025",
    expectedAmount: "₹15,00,000",
    loanPurpose: "Home Loan",
    address: "76, Aliganj, Lucknow, Uttar Pradesh - 226024",
    avatar: "https://i.pravatar.cc/150?u=suresh",
  },
  {
    id: "LID-2025-1263",
    name: "Karan Gupta",
    mobile: "+91 9876543215",
    email: "karan.gupta@gmail.com",
    source: "Website",
    assignedTo: "Ravi Kumar",
    status: "Contacted",
    createdOn: "16 May 2025",
    nextFollowUp: "18 May 2025",
    expectedAmount: "₹3,50,000",
    loanPurpose: "Personal Loan",
    address: "34, Hazratganj, Lucknow, Uttar Pradesh - 226001",
    avatar: "https://i.pravatar.cc/150?u=karan",
  },
  {
    id: "LID-2025-1262",
    name: "Pooja Mehta",
    mobile: "+91 9876543216",
    email: "pooja.mehta@gmail.com",
    source: "Walk-in",
    assignedTo: "Neha Singh",
    status: "Lost",
    createdOn: "15 May 2025",
    nextFollowUp: "-",
    expectedAmount: "₹5,00,000",
    loanPurpose: "Home Loan",
    address: "90, Mahanagar, Lucknow, Uttar Pradesh - 226006",
    avatar: "https://i.pravatar.cc/150?u=pooja",
  },
  {
    id: "LID-2025-1261",
    name: "Deepak Yadav",
    mobile: "+91 9876543217",
    email: "deepak.yadav@gmail.com",
    source: "Tele Calling",
    assignedTo: "Suresh Patel",
    status: "Converted",
    createdOn: "15 May 2025",
    nextFollowUp: "19 May 2025",
    expectedAmount: "₹8,00,000",
    loanPurpose: "Business Loan",
    address: "21, Ashiyana, Lucknow, Uttar Pradesh - 226012",
    avatar: "https://i.pravatar.cc/150?u=deepak",
  },
];

export default function ManageLeads() {
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  const selectedLead = selectedLeadId
    ? mockLeads.find((l) => l.id === selectedLeadId)
    : null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return (
          <span className="text-[#489b0d] bg-[#489b0d]/10 px-2 py-0.5 rounded text-[11px] font-bold">
            New
          </span>
        );
      case "Contacted":
        return (
          <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded text-[11px] font-bold">
            Contacted
          </span>
        );
      case "Qualified":
        return (
          <span className="text-purple-500 bg-purple-50 px-2 py-0.5 rounded text-[11px] font-bold">
            Qualified
          </span>
        );
      case "Converted":
        return (
          <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-[11px] font-bold">
            Converted
          </span>
        );
      case "Lost":
        return (
          <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded text-[11px] font-bold">
            Lost
          </span>
        );
      default:
        return (
          <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Top Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">All Leads</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500 whitespace-nowrap">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">
              Lead & Work Management
            </span>
            <ChevronRight size={14} className="mx-1 shrink-0" />
            <span className="text-[#489b0d] font-bold">All Leads</span>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap xl:flex-nowrap items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white flex-1 xl:flex-none min-w-[120px]">
            <option>All Branches</option>
          </select>
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white flex-1 xl:flex-none min-w-[120px]">
            <option>All Sources</option>
          </select>
          <select className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white flex-1 xl:flex-none min-w-[120px]">
            <option>All Status</option>
          </select>
          <div className="h-10 px-3 flex items-center justify-between rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 bg-white flex-1 xl:flex-none min-w-[190px]">
            <span className="truncate">01 May 2025 - 18 May 2025</span>
            <Calendar size={14} className="text-slate-400 shrink-0 ml-2" />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm flex-1 sm:flex-none">
              <Filter size={14} /> Filter
            </button>
            <Link to="/leads/add" className="flex-1 sm:flex-none">
              <button className="h-10 w-full px-4 flex items-center justify-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
                <Plus size={16} /> Add Lead
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Leads Table */}
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
                  Lead ID
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Created On
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Next Follow Up
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockLeads.map((lead, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${selectedLeadId === lead.id ? "bg-[#489b0d]/5" : ""}`}
                  onClick={() => setSelectedLeadId(lead.id)}
                >
                  <td
                    className="py-3 px-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]"
                    />
                  </td>
                  <td className="py-3 px-4 text-[12px] font-semibold text-slate-600">
                    {lead.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-[13px] font-bold text-slate-800">
                      {lead.name}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-600 whitespace-nowrap">
                    {lead.mobile}
                  </td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-600">
                    {lead.source}
                  </td>
                  <td className="py-3 px-4 text-[12px] font-semibold text-slate-700">
                    {lead.assignedTo}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(lead.status)}</td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-500 whitespace-nowrap">
                    {lead.createdOn}
                  </td>
                  <td className="py-3 px-4 text-[12px] font-medium text-slate-500 whitespace-nowrap">
                    {lead.nextFollowUp}
                  </td>
                  <td
                    className="py-3 px-6 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedLeadId(lead.id)}
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
            Showing 1 to 8 of 1,248 entries
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

      {/* Lead Details Slide-over Drawer */}
      {selectedLead && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedLeadId(null)}
          ></div>

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-screen w-full max-w-[800px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-100 animate-slide-in-right">
            {/* Drawer Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 p-4 sm:p-6 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">
                  Lead Details
                </h3>
                <div className="flex flex-wrap items-center gap-y-1 text-[11px] font-semibold text-slate-400 mt-1">
                  <span className="whitespace-nowrap">Lead & Work Management</span>
                  <ChevronRight size={12} className="mx-1 shrink-0" /> <span className="whitespace-nowrap">All Leads</span>
                  <ChevronRight size={12} className="mx-1 shrink-0" /> <span className="text-[#489b0d] font-bold whitespace-nowrap">Lead Details</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLeadId(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shrink-0 w-full sm:w-auto justify-center"
              >
                <ArrowRight size={14} className="shrink-0" /> Back to Leads
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
              {/* Profile Header & Actions Grid */}
              <div className="p-6 pb-0 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Profile Info */}
                <div className="md:col-span-2 w-full min-w-0">
                  <div className="flex items-center sm:items-start gap-4 sm:gap-5 w-full min-w-0">
                    <img
                      src={selectedLead.avatar}
                      alt={selectedLead.name}
                      className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-full object-cover border-2 sm:border-4 border-slate-50 shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-none mb-2 sm:mb-1.5 truncate">
                        {selectedLead.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 sm:gap-4 text-[11px] sm:text-[12px] font-medium text-slate-500 mb-2 sm:mb-4">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <span className="text-slate-400">Lead ID:</span>{" "}
                          <span className="font-bold text-slate-700">
                            {selectedLead.id}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <span className="text-slate-400">Source:</span>{" "}
                          <span className="font-bold text-slate-700">
                            {selectedLead.source}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <span className="text-slate-400">Assigned To:</span>{" "}
                          <span className="font-bold text-slate-700">
                            {selectedLead.assignedTo}
                          </span>
                        </span>
                      </div>

                      {/* Inner Tabs */}
                      <div className="flex items-center gap-6 sm:gap-8 border-b border-slate-100 mt-6 overflow-x-auto no-scrollbar pb-1">
                        {[
                          "Overview",
                          "Activity",
                          "Follow Ups",
                          "Notes",
                          "Documents",
                          "Applications",
                        ].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-[12px] font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? "border-[#489b0d] text-[#489b0d]" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="bg-slate-50/50 rounded-md p-5 border border-slate-100 flex flex-col gap-2">
                  <h4 className="text-[12px] font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                    Actions
                  </h4>
                  <button className="flex items-center gap-2 text-[12px] font-bold text-slate-600 hover:text-[#489b0d] py-1 transition-colors">
                    <User size={14} /> Edit Lead
                  </button>
                  <button className="flex items-center gap-2 text-[12px] font-bold text-slate-600 hover:text-[#489b0d] py-1 transition-colors">
                    <UserCheck size={14} /> Assign Lead
                  </button>
                  <button className="flex items-center gap-2 text-[12px] font-bold text-slate-600 hover:text-[#489b0d] py-1 transition-colors">
                    <Calendar size={14} /> Schedule Follow-up
                  </button>
                  <button className="flex items-center gap-2 text-[12px] font-bold text-slate-600 hover:text-[#489b0d] py-1 transition-colors">
                    <Briefcase size={14} /> Convert to Application
                  </button>
                  <button className="flex items-center gap-2 text-[12px] font-bold text-[#489b0d] py-1 transition-colors mt-2 border-t border-slate-200 pt-3">
                    <CheckCircle2 size={14} /> Mark as Qualified
                  </button>
                  <button className="flex items-center gap-2 text-[12px] font-bold text-red-500 py-1 transition-colors">
                    <XCircle size={14} /> Mark as Lost
                  </button>
                  <button className="flex items-center justify-center gap-2 mt-auto w-full py-2.5 border border-[#489b0d]/20 bg-[#489b0d]/5 text-[#489b0d] rounded-lg text-[12px] font-bold hover:bg-[#489b0d]/10 transition-colors">
                    <MessageSquare size={14} /> Add Note
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "Overview" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="text-[13px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                        Contact Information
                      </h4>

                      <div className="flex items-start gap-3">
                        <Mail
                          size={14}
                          className="text-slate-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                            Email
                          </p>
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedLead.email}
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
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedLead.mobile}
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
                          <p className="text-[13px] font-bold text-slate-800 leading-relaxed">
                            {selectedLead.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status & Loan Info */}
                    <div className="space-y-4">
                      <h4 className="text-[13px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                        Status
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-1">
                            Created On
                          </p>
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedLead.createdOn}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-1">
                            Next Follow Up
                          </p>
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedLead.nextFollowUp}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-1">
                            Expected Loan Amount
                          </p>
                          <p className="text-[14px] font-extrabold text-[#489b0d]">
                            {selectedLead.expectedAmount}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-1">
                            Loan Purpose
                          </p>
                          <p className="text-[13px] font-bold text-slate-800">
                            {selectedLead.loanPurpose}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab !== "Overview" && (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                    <p className="text-[13px] font-bold">
                      Section under construction
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
