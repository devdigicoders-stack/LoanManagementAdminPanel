import { useState } from "react";
import toast from "react-hot-toast";
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
  X,
  MessageSquare
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

  const [filterLoanType, setFilterLoanType] = useState("All Loan Types");
  const [filterStatus, setFilterStatus] = useState("All Status");

  const filteredApps = applications.filter(app => {
    const matchType = filterLoanType === "All Loan Types" || app.loanType === filterLoanType;
    const matchStatus = filterStatus === "All Status" || app.status === filterStatus;
    return matchType && matchStatus;
  });

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
          <select 
            value={filterLoanType}
            onChange={(e) => setFilterLoanType(e.target.value)}
            className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white flex-1 sm:flex-none min-w-[140px]"
          >
            <option value="All Loan Types">All Loan Types</option>
            <option value="Personal Loan">Personal Loan</option>
            <option value="Home Loan">Home Loan</option>
            <option value="Business Loan">Business Loan</option>
            <option value="Education Loan">Education Loan</option>
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-600 focus:outline-none focus:border-[#489b0d] bg-white flex-1 sm:flex-none min-w-[120px]"
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Disbursed">Disbursed</option>
          </select>

          <button className="h-10 px-4 flex items-center gap-2 bg-[#489b0d] hover:bg-[#3e850b] text-white rounded-md text-[13px] font-bold transition-colors shadow-sm flex-1 sm:flex-none justify-center">
            <Plus size={16} /> New Application
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Application ID</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Loan Details</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Applied On</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="text-[13px] font-bold text-slate-700">{app.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={app.avatar} alt={app.customer} className="w-8 h-8 rounded-full border border-slate-200" />
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">{app.customer}</p>
                        <p className="text-[11px] font-medium text-slate-500">{app.mobile}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] font-bold text-slate-700">{app.loanType}</p>
                    <p className="text-[12px] font-bold text-[#489b0d]">{app.amount}</p>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[12px] font-semibold text-slate-600">{app.appliedOn}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      <button onClick={() => {
                        setSelectedAppId(app.id);
                        toast.success("Viewing " + app.id);
                      }} className="p-1.5 text-slate-400 hover:text-[#489b0d] hover:bg-[#489b0d]/10 rounded transition-colors tooltip-trigger" title="View Details">
                        <Eye size={16} strokeWidth={2.5} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors tooltip-trigger" title="Edit">
                        <Filter size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApps.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-500 font-medium text-[13px]">No applications found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Slide-over for Application Details */}
      {selectedApp && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedAppId(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-[600px] bg-slate-50 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-[16px] font-extrabold text-slate-800">Application Details</h2>
              <button onClick={() => setSelectedAppId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-md transition-colors">
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
                    <button onClick={() => { handleStatusChange('Pending'); toast.success('Status updated to Pending'); }} className="flex items-center gap-2 text-[12px] font-bold text-slate-600 py-1.5 px-2 w-full rounded hover:bg-slate-50 transition-colors cursor-pointer text-left">
                      <CheckCircle2 size={14} className="text-orange-500" /> Pending
                    </button>
                    <button onClick={() => { handleStatusChange('Under Review'); toast.success('Status updated to Under Review'); }} className="flex items-center gap-2 text-[12px] font-bold text-slate-600 py-1.5 px-2 w-full rounded hover:bg-slate-50 transition-colors cursor-pointer text-left">
                      <CheckCircle2 size={14} className="text-blue-500" /> Under Review
                    </button>
                    <button onClick={() => { handleStatusChange('Approved'); toast.success('Status updated to Approved'); }} className="flex items-center gap-2 text-[12px] font-bold text-slate-600 py-1.5 px-2 w-full rounded hover:bg-slate-50 transition-colors cursor-pointer text-left">
                      <CheckCircle2 size={14} className="text-[#489b0d]" /> Approved
                    </button>
                    <button onClick={() => { handleStatusChange('Disbursed'); toast.success('Status updated to Disbursed'); }} className="flex items-center gap-2 text-[12px] font-bold text-slate-600 py-1.5 px-2 w-full rounded hover:bg-slate-50 transition-colors cursor-pointer text-left">
                      <CheckCircle2 size={14} className="text-purple-500" /> Disbursed
                    </button>
                  </div>
                </div>

                <div className="mt-2 pt-4 border-t border-slate-100">
                  <button onClick={() => { handleStatusChange('Rejected'); toast.success('Status updated to Rejected'); }} className="flex items-center gap-2 text-[12px] font-bold text-red-500 py-1 transition-colors cursor-pointer w-full text-left">
                    <XCircle size={14} /> Mark as Rejected
                  </button>
                  <button onClick={() => setActiveTab('Notes')} className="flex items-center justify-center gap-2 mt-auto w-full py-2.5 border border-[#489b0d]/20 bg-[#489b0d]/5 text-[#489b0d] rounded-lg text-[12px] font-bold hover:bg-[#489b0d]/10 transition-colors cursor-pointer">
                    <MessageSquare size={14} /> Add Note
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6 w-full">
                {/* Horizontal Navigation */}
                <div className="flex gap-4 border-b border-slate-200 mb-6 pb-2">
                  {['Overview', 'Documents', 'Notes'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[13px] font-bold pb-2 border-b-2 transition-colors ${activeTab === tab ? 'border-[#489b0d] text-[#489b0d]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeTab === "Overview" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="text-[13px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                        Applicant Information
                      </h4>

                      <div className="flex items-start gap-3">
                        <UserCheck size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">Name</p>
                          <p className="text-[13px] font-bold text-slate-800">{selectedApp.customer}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">Email</p>
                          <p className="text-[13px] font-bold text-slate-800">{selectedApp.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">Phone</p>
                          <p className="text-[13px] font-bold text-slate-800">{selectedApp.mobile}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">Address</p>
                          <p className="text-[13px] font-bold text-slate-800 leading-relaxed">{selectedApp.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status & Loan Info */}
                    <div className="space-y-4">
                      <h4 className="text-[13px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                        Loan Request
                      </h4>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-1">Applied On</p>
                          <p className="text-[13px] font-bold text-slate-800">{selectedApp.appliedOn}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-1">Loan Amount</p>
                          <p className="text-[14px] font-extrabold text-[#489b0d]">{selectedApp.amount}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-1">Loan Type</p>
                          <p className="text-[13px] font-bold text-slate-800">{selectedApp.loanType}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-1">Assigned Agent</p>
                          <p className="text-[13px] font-bold text-slate-800">{selectedApp.assignedTo}</p>
                        </div>
                        <div className="mt-2 border-t border-slate-100 pt-3">
                          <p className="text-[11px] font-semibold text-slate-500 mb-1">Current Status</p>
                          <div className="mt-1">{getStatusBadge(selectedApp.status)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Documents" && (
                  <div className="space-y-4">
                    <h4 className="text-[13px] font-extrabold text-slate-800 mb-4 pb-2 border-b border-slate-100">Submitted Documents</h4>
                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-[#489b0d] transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded text-slate-500 group-hover:text-[#489b0d] transition-colors">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-slate-800">PAN Card</p>
                          <p className="text-[10px] text-slate-500">{selectedApp.pan}</p>
                        </div>
                      </div>
                      <button onClick={() => toast.success('Downloading document...')} className="text-slate-400 hover:text-[#489b0d] transition-colors p-1"><Download size={14} /></button>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-[#489b0d] transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded text-slate-500 group-hover:text-[#489b0d] transition-colors">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-slate-800">Aadhar Card</p>
                          <p className="text-[10px] text-slate-500">{selectedApp.aadhar}</p>
                        </div>
                      </div>
                      <button onClick={() => toast.success('Downloading document...')} className="text-slate-400 hover:text-[#489b0d] transition-colors p-1"><Download size={14} /></button>
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
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
