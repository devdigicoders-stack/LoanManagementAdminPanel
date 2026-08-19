import React, { useState } from "react";
import toast from 'react-hot-toast';
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
  Edit,
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
  const [leadsList, setLeadsList] = useState(mockLeads);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  
  const [filterSource, setFilterSource] = useState("All Sources");
  const [filterStatus, setFilterStatus] = useState("All Status");

  const filteredLeads = leadsList.filter(lead => {
    const matchSource = filterSource === "All Sources" || lead.source === filterSource;
    const matchStatus = filterStatus === "All Status" || lead.status === filterStatus;
    return matchSource && matchStatus;
  });

  const selectedLead = selectedLeadId
    ? leadsList.find((l) => l.id === selectedLeadId)
    : null;

  const updateLeadStatus = (id, newStatus) => {
    setLeadsList(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    toast.success(`Lead status updated to ${newStatus}`);
  };

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
            <option>Mumbai Branch</option>
            <option>Delhi Branch</option>
            <option>Bangalore Branch</option>
          </select>
          <select 
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white flex-1 xl:flex-none min-w-[120px]"
          >
            <option>All Sources</option>
            <option>Website</option>
            <option>Referral</option>
            <option>Walk-in</option>
            <option>Tele Calling</option>
          </select>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white flex-1 xl:flex-none min-w-[120px]"
          >
            <option>All Status</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Converted</option>
            <option>Lost</option>
          </select>

          <Link to="/leads/add" className="h-10 px-4 flex items-center gap-2 bg-[#489b0d] hover:bg-[#3e850b] text-white rounded-md text-[13px] font-bold transition-colors shadow-sm flex-1 xl:flex-none justify-center">
            <Plus size={16} /> Add Lead
          </Link>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Lead ID</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Source</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Created</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6"><span className="text-[13px] font-bold text-slate-700">{lead.id}</span></td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={lead.avatar} alt={lead.name} className="w-8 h-8 rounded-full border border-slate-200" />
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">{lead.name}</p>
                        <p className="text-[11px] font-medium text-slate-500">{lead.mobile}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] font-bold text-slate-700">{lead.source}</p>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[12px] font-semibold text-slate-600">{lead.createdOn}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      <button onClick={() => setSelectedLeadId(lead.id)} className="p-1.5 text-slate-400 hover:text-[#489b0d] hover:bg-[#489b0d]/10 rounded transition-colors tooltip-trigger" title="View Details">
                        <Eye size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-500 font-medium text-[13px]">No leads found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Slide-over for Lead Details */}
      {selectedLead && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedLeadId(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-[600px] bg-slate-50 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-[16px] font-extrabold text-slate-800">Lead Details</h2>
              <button onClick={() => setSelectedLeadId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-md transition-colors">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex">
              {/* Sidebar Actions */}
              <div className="w-[180px] bg-white border-r border-slate-100 p-4 shrink-0 flex flex-col gap-1">
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Update Status</p>
                  <div className="space-y-1">
                    <button onClick={() => updateLeadStatus(selectedLead.id, 'New')} className="flex items-center gap-2 text-[12px] font-bold text-slate-600 py-1.5 px-2 w-full rounded hover:bg-slate-50 transition-colors cursor-pointer text-left">
                      <CheckCircle2 size={14} className="text-[#489b0d]" /> New
                    </button>
                    <button onClick={() => updateLeadStatus(selectedLead.id, 'Contacted')} className="flex items-center gap-2 text-[12px] font-bold text-slate-600 py-1.5 px-2 w-full rounded hover:bg-slate-50 transition-colors cursor-pointer text-left">
                      <CheckCircle2 size={14} className="text-blue-500" /> Contacted
                    </button>
                    <button onClick={() => updateLeadStatus(selectedLead.id, 'Qualified')} className="flex items-center gap-2 text-[12px] font-bold text-slate-600 py-1.5 px-2 w-full rounded hover:bg-slate-50 transition-colors cursor-pointer text-left">
                      <CheckCircle2 size={14} className="text-purple-500" /> Qualified
                    </button>
                    <button onClick={() => updateLeadStatus(selectedLead.id, 'Converted')} className="flex items-center gap-2 text-[12px] font-bold text-slate-600 py-1.5 px-2 w-full rounded hover:bg-slate-50 transition-colors cursor-pointer text-left">
                      <CheckCircle2 size={14} className="text-green-600" /> Converted
                    </button>
                  </div>
                </div>

                <div className="mt-2 pt-4 border-t border-slate-100">
                  <button onClick={() => updateLeadStatus(selectedLead.id, 'Lost')} className="flex items-center gap-2 text-[12px] font-bold text-red-500 py-1 transition-colors cursor-pointer w-full text-left">
                    <XCircle size={14} /> Mark as Lost
                  </button>
                  <button onClick={() => setActiveTab('Notes')} className="flex items-center justify-center gap-2 mt-auto w-full py-2.5 border border-[#489b0d]/20 bg-[#489b0d]/5 text-[#489b0d] rounded-lg text-[12px] font-bold hover:bg-[#489b0d]/10 transition-colors cursor-pointer">
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

                {activeTab === "Activity" && (
                  <div className="space-y-4">
                    <h4 className="text-[13px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">Activity Log</h4>
                    <div className="pl-2 border-l-2 border-slate-100 space-y-4 relative">
                      <div className="relative">
                        <div className="absolute w-2 h-2 bg-[#489b0d] rounded-full -left-[13px] top-1.5 ring-4 ring-white"></div>
                        <p className="text-[12px] font-bold text-slate-800">Lead assigned to {selectedLead.assignedTo}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{selectedLead.createdOn}</p>
                      </div>
                      <div className="relative">
                        <div className="absolute w-2 h-2 bg-slate-300 rounded-full -left-[13px] top-1.5 ring-4 ring-white"></div>
                        <p className="text-[12px] font-bold text-slate-800">Lead created from {selectedLead.source}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{selectedLead.createdOn}</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "Notes" && (
                  <div className="space-y-4">
                    <h4 className="text-[13px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">Notes & Comments</h4>
                    <textarea rows="3" placeholder="Type a note here..." className="w-full border border-slate-200 rounded p-3 text-[12px] text-slate-700 focus:outline-none focus:border-[#489b0d] resize-none"></textarea>
                    <button onClick={() => toast.success('Note saved!')} className="px-4 py-2 bg-[#489b0d] text-white rounded font-bold text-[11px] hover:bg-[#3d830b] transition-colors cursor-pointer">Save Note</button>
                  </div>
                )}
                {activeTab === "Follow Ups" && (
                  <div className="space-y-4">
                    <h4 className="text-[13px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">Follow Ups</h4>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                      <p className="text-[12px] font-bold text-blue-800 mb-1">Upcoming Follow-up</p>
                      <p className="text-[11px] text-blue-600">Scheduled for: {selectedLead.nextFollowUp}</p>
                    </div>
                  </div>
                )}
                {["Documents", "Applications"].includes(activeTab) && (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                    <p className="text-[13px] font-bold">No data available for {activeTab}</p>
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
