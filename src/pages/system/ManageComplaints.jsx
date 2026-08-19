import React, { useState } from "react";
import { 
  Search, Filter, Download, MessageSquare, AlertCircle, CheckCircle2,
  Clock, MoreVertical, Eye, Trash2, ShieldAlert, ArrowUpRight, CheckSquare, X
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const initialComplaints = [
  { id: "CMP-001", customer: "Ramesh Tiwari", phone: "+91 9876543210", subject: "EMI Payment not reflected", date: "18 May 2025", status: "Pending", priority: "High" },
  { id: "CMP-002", customer: "Sunita Devi", phone: "+91 8765432109", subject: "Delay in loan disbursement", date: "17 May 2025", status: "In Progress", priority: "High" },
  { id: "CMP-003", customer: "Mohd. Ali", phone: "+91 7654321098", subject: "Update registered mobile number", date: "16 May 2025", status: "Resolved", priority: "Low" },
  { id: "CMP-004", customer: "Kavita Sharma", phone: "+91 6543210987", subject: "Foreclosure charges query", date: "16 May 2025", status: "Resolved", priority: "Medium" },
  { id: "CMP-005", customer: "Vikram Singh", phone: "+91 5432109876", subject: "Harassment by collection agent", date: "15 May 2025", status: "Escalated", priority: "Critical" },
];

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLogComplaintOpen, setIsLogComplaintOpen] = useState(false);

  // Filter States
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // New Complaint Form State
  const [newComplaint, setNewComplaint] = useState({
    customer: "",
    phone: "",
    subject: "",
    priority: "Low"
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="px-2.5 py-1 bg-orange-50 text-orange-600 border border-orange-100 text-[11px] font-extrabold rounded-md flex items-center gap-1 w-max"><Clock size={12} /> Pending</span>;
      case "In Progress":
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 text-[11px] font-extrabold rounded-md flex items-center gap-1 w-max"><Clock size={12} /> In Progress</span>;
      case "Resolved":
        return <span className="px-2.5 py-1 bg-[#489b0d]/10 text-[#489b0d] border border-[#489b0d]/20 text-[11px] font-extrabold rounded-md flex items-center gap-1 w-max"><CheckCircle2 size={12} /> Resolved</span>;
      case "Escalated":
        return <span className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 text-[11px] font-extrabold rounded-md flex items-center gap-1 w-max"><AlertCircle size={12} /> Escalated</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-extrabold rounded-md w-max">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Critical":
        return <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-md w-max">{priority}</span>;
      case "High":
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-wider rounded-md w-max">{priority}</span>;
      case "Medium":
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-md w-max">{priority}</span>;
      case "Low":
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-md w-max">{priority}</span>;
      default:
        return null;
    }
  }

  const handleExport = () => {
    Swal.fire({
      title: 'Export Complaints?',
      text: "You are about to export all current complaints data to CSV.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#489b0d',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, Export Data'
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Data exported successfully!");
      }
    });
  };

  const handleLogComplaint = (e) => {
    e.preventDefault();
    if(!newComplaint.customer || !newComplaint.subject) {
      toast.error("Please fill required fields.");
      return;
    }
    const newEntry = {
      id: `CMP-00${complaints.length + 1}`,
      customer: newComplaint.customer,
      phone: newComplaint.phone || "+91 0000000000",
      subject: newComplaint.subject,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: "Pending",
      priority: newComplaint.priority
    };
    setComplaints([newEntry, ...complaints]);
    setIsLogComplaintOpen(false);
    setNewComplaint({ customer: "", phone: "", subject: "", priority: "Low" });
    toast.success("Complaint logged successfully!");
  };

  const handleResolve = (id) => {
    Swal.fire({
      title: 'Resolve Complaint?',
      text: "Mark this complaint as successfully resolved?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#489b0d',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, Resolve it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setComplaints(complaints.map(c => c.id === id ? { ...c, status: "Resolved" } : c));
        toast.success("Complaint resolved successfully.");
      }
    });
  };

  const handleView = (complaint) => {
    Swal.fire({
      title: `Complaint Details`,
      html: `
        <div class="text-left space-y-3 mt-4">
          <p><strong>ID:</strong> ${complaint.id}</p>
          <p><strong>Customer:</strong> ${complaint.customer} (${complaint.phone})</p>
          <p><strong>Subject:</strong> ${complaint.subject}</p>
          <p><strong>Status:</strong> ${complaint.status}</p>
          <p><strong>Priority:</strong> ${complaint.priority}</p>
          <p><strong>Date Logged:</strong> ${complaint.date}</p>
        </div>
      `,
      confirmButtonColor: '#489b0d',
      confirmButtonText: 'Close'
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Complaint?',
      text: "Are you sure you want to permanently delete this complaint?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setComplaints(complaints.filter(c => c.id !== id));
        toast.success("Complaint deleted successfully.");
      }
    });
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "All" || c.priority === filterPriority;
    const matchesStatus = filterStatus === "All" || c.status === filterStatus;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Complaint Management</h1>
          <p className="text-[12px] font-medium text-slate-500">Track, escalate, and resolve customer grievances efficiently.</p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Name or Subject..." 
              className="h-10 pl-9 pr-4 rounded-lg border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-full sm:w-[280px] shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Filter size={14} /> Filter
          </button>
          <button 
            onClick={handleExport}
            className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={14} /> Export Data
          </button>
          <button 
            onClick={() => setIsLogComplaintOpen(true)}
            className="h-10 px-5 flex items-center justify-center gap-2 rounded-lg bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm"
          >
            <MessageSquare size={16} /> Log Complaint
          </button>
        </div>
      </div>

      {/* KPI Cards (Premium Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center relative z-10">
              <MessageSquare size={20} />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Total Active</p>
            <h3 className="text-3xl font-black text-slate-800">42</h3>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center relative z-10">
              <Clock size={20} />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
              Needs Attention
            </span>
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Pending Resolution</p>
            <h3 className="text-3xl font-black text-slate-800">14</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center relative z-10">
              <ShieldAlert size={20} />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Escalated Cases</p>
            <h3 className="text-3xl font-black text-slate-800">3</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#489b0d]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#489b0d]/10 text-[#489b0d] flex items-center justify-center relative z-10">
              <CheckSquare size={20} />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#489b0d] bg-[#489b0d]/10 px-2 py-0.5 rounded text-[#489b0d]">
              <ArrowUpRight size={12}/> +5.2%
            </span>
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Resolution Rate</p>
            <h3 className="text-3xl font-black text-slate-800">92%</h3>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-slate-800 text-[15px]">Complaint Registry</h3>
            <p className="text-[12px] font-medium text-slate-500 mt-0.5">Showing {filteredComplaints.length} tickets</p>
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Complaint ID</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Customer Details</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Subject & Priority</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Date Logged</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length > 0 ? filteredComplaints.map(complaint => (
                <tr key={complaint.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="text-[13px] font-bold text-slate-700">{complaint.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] font-bold text-slate-800">{complaint.customer}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{complaint.phone}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] font-semibold text-slate-700 mb-1 line-clamp-1">{complaint.subject}</p>
                    {getPriorityBadge(complaint.priority)}
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(complaint.status)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[13px] font-semibold text-slate-600">{complaint.date}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      {complaint.status !== 'Resolved' && (
                        <button 
                          onClick={() => handleResolve(complaint.id)}
                          className="h-8 px-3 inline-flex items-center gap-1.5 text-white bg-slate-800 hover:bg-black font-bold text-[11px] rounded transition-colors shadow-sm"
                        >
                          Resolve
                        </button>
                      )}
                      <button 
                        onClick={() => handleView(complaint)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Eye size={14} strokeWidth={2.5}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(complaint.id)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={14} strokeWidth={2.5}/>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                    No complaints found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
                <Filter size={16} className="text-[#489b0d]" /> Filter Complaints
              </h3>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 bg-slate-200/50 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Priority Level</label>
                <select 
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]"
                >
                  <option value="All">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Complaint Status</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Escalated">Escalated</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => {
                    setFilterPriority("All");
                    setFilterStatus("All");
                    setIsFilterOpen(false);
                  }}
                  className="flex-1 h-10 rounded-lg border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors"
                >
                  Clear Filters
                </button>
                <button 
                  onClick={() => {
                    setIsFilterOpen(false);
                    toast.success("Filters applied.");
                  }}
                  className="flex-1 h-10 rounded-lg bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Complaint Modal */}
      {isLogComplaintOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
                <MessageSquare size={16} className="text-[#489b0d]" /> Log New Complaint
              </h3>
              <button 
                onClick={() => setIsLogComplaintOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 bg-slate-200/50 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleLogComplaint} className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Customer Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={newComplaint.customer}
                  onChange={(e) => setNewComplaint({...newComplaint, customer: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]" 
                  placeholder="e.g. Ramesh Tiwari"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Phone Number</label>
                <input 
                  type="text" 
                  value={newComplaint.phone}
                  onChange={(e) => setNewComplaint({...newComplaint, phone: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]" 
                  placeholder="e.g. +91 9876543210"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Complaint Subject <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={newComplaint.subject}
                  onChange={(e) => setNewComplaint({...newComplaint, subject: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]" 
                  placeholder="Brief description of the issue"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Priority Level</label>
                <select 
                  value={newComplaint.priority}
                  onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsLogComplaintOpen(false)}
                  className="flex-1 h-10 rounded-lg border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 h-10 rounded-lg bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm"
                >
                  Log Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
