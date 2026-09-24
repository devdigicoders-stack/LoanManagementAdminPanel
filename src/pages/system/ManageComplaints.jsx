import React, { useState, useEffect } from "react";
import { 
  Search, Filter, Download, MessageSquare, AlertCircle, CheckCircle2,
  Clock, MoreVertical, Eye, Trash2, ShieldAlert, ArrowUpRight, CheckSquare, X,
  UserCheck, UserPlus, Users, ArrowRight, ShieldCheck, Phone, Mail, HelpCircle
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLogComplaintOpen, setIsLogComplaintOpen] = useState(false);

  // Staff and Assignment states
  const [staffList, setStaffList] = useState([]);
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [assignModal, setAssignModal] = useState({ open: false, complaint: null, isBulk: false });
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Filter States
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAssignee, setFilterAssignee] = useState("All");

  // New Complaint Form State
  const [newComplaint, setNewComplaint] = useState({
    customer: "",
    phone: "",
    email: "",
    subject: "",
    category: "General Support",
    description: "",
    priority: "Medium"
  });

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      // Try assignable staff endpoint first
      let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/assignable-staff`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const list = data.allStaff || data.hrs || data.telecallers || [];
        if (list.length > 0) {
          setStaffList(list);
          return;
        }
      }

      // Fallback to all active employees
      res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees?status=Active`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const empData = await res.json();
        const list = Array.isArray(empData) ? empData : (empData.employees || []);
        setStaffList(list.map(e => ({
          _id: e._id || e.id,
          name: e.name || `${e.firstName || ''} ${e.lastName || ''}`.trim() || 'Employee',
          role: e.designation || e.role || 'Support Staff',
          email: e.email || '',
          mobile: e.mobile || e.phone || ''
        })));
      }
    } catch (err) {
      console.error('Error fetching staff list:', err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/complaints`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map(c => ({
          ...c,
          id: c.complaintId || `TKT-${c._id.slice(-4)}`,
          date: new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        }));
        setComplaints(formattedData);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchStaff();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-extrabold rounded-md flex items-center gap-1 w-max"><Clock size={12} /> Pending</span>;
      case "In Progress":
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-extrabold rounded-md flex items-center gap-1 w-max"><Clock size={12} /> In Progress</span>;
      case "Resolved":
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold rounded-md flex items-center gap-1 w-max"><CheckCircle2 size={12} /> Resolved</span>;
      case "Escalated":
        return <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 text-[11px] font-extrabold rounded-md flex items-center gap-1 w-max"><AlertCircle size={12} /> Escalated</span>;
      case "Closed":
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-extrabold rounded-md flex items-center gap-1 w-max"><ShieldCheck size={12} /> Closed</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-extrabold rounded-md w-max">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Critical":
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider rounded-md w-max">Critical</span>;
      case "High":
        return <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider rounded-md w-max">High</span>;
      case "Medium":
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-md w-max">Medium</span>;
      case "Low":
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-md w-max">Low</span>;
      default:
        return null;
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedComplaints(filteredComplaints.map(c => c._id));
    } else {
      setSelectedComplaints([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedComplaints(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const openAssignModal = (complaint = null, isBulk = false) => {
    setAssignModal({ open: true, complaint, isBulk });
    setSelectedStaffId(complaint?.assignedToId || "");
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaffId) {
      toast.error("Please select an employee to assign.");
      return;
    }

    const staff = staffList.find(s => (s._id || s.id) === selectedStaffId);
    const assignedTo = staff ? (staff.name || staff.email) : "Staff";
    const assignedToId = selectedStaffId;

    setIsAssigning(true);
    try {
      const token = localStorage.getItem('token');
      if (assignModal.isBulk) {
        // Bulk assign: try /bulk-assign, fallback to per-item /status
        let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/complaints/bulk-assign`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            complaintIds: selectedComplaints,
            assignedTo,
            assignedToId
          })
        });

        if (!res.ok && res.status === 404) {
          // Fallback to updating each complaint directly via status endpoint
          await Promise.all(
            selectedComplaints.map(id => 
              fetch(`${import.meta.env.VITE_API_BASE_URL}/complaints/${id}/status`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ assignedTo, assignedToId })
              })
            )
          );
          toast.success(`${selectedComplaints.length} enquiries assigned to ${assignedTo}!`);
          setSelectedComplaints([]);
          setAssignModal({ open: false, complaint: null, isBulk: false });
          fetchComplaints();
          return;
        }

        if (res.ok) {
          toast.success(`${selectedComplaints.length} enquiries assigned to ${assignedTo}!`);
          setSelectedComplaints([]);
          setAssignModal({ open: false, complaint: null, isBulk: false });
          fetchComplaints();
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.message || "Failed to bulk assign");
        }
      } else {
        // Single assign: try /:id/assign, fallback to /:id/status
        const complaintId = assignModal.complaint._id;
        let res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/complaints/${complaintId}/assign`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            assignedTo,
            assignedToId
          })
        });

        if (!res.ok && res.status === 404) {
          res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/complaints/${complaintId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              assignedTo,
              assignedToId
            })
          });
        }

        if (res.ok) {
          toast.success(`Enquiry assigned to ${assignedTo}!`);
          setAssignModal({ open: false, complaint: null, isBulk: false });
          fetchComplaints();
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.message || "Failed to assign enquiry");
        }
      }
    } catch (err) {
      toast.error("Network error while assigning");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleExport = () => {
    Swal.fire({
      title: 'Export Enquiries & Complaints?',
      text: "You are about to export current complaints & enquiries data to CSV.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#489b0d',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, Export Data'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!complaints.length) {
          toast.error("No data to export.");
          return;
        }
        const headers = ["Ticket ID", "Customer", "Phone", "Email", "Category", "Subject", "Priority", "Status", "Assigned To", "Date Logged"];
        const rows = complaints.map(c => [
          `"${c.id || c.complaintId || ''}"`,
          `"${c.customer || ''}"`,
          `"${c.phone || ''}"`,
          `"${c.email || ''}"`,
          `"${c.category || ''}"`,
          `"${(c.subject || '').replace(/"/g, '""')}"`,
          `"${c.priority || ''}"`,
          `"${c.status || ''}"`,
          `"${c.assignedTo || 'Unassigned'}"`,
          `"${c.date || ''}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `enquiries_export_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("CSV file downloaded successfully!");
      }
    });
  };

  const handleLogComplaint = async (e) => {
    e.preventDefault();
    if(!newComplaint.customer || !newComplaint.subject || !newComplaint.phone) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newComplaint)
      });

      if (response.ok) {
        toast.success("Complaint logged successfully!");
        setIsLogComplaintOpen(false);
        setNewComplaint({ customer: "", phone: "", email: "", subject: "", category: "General Support", description: "", priority: "Medium" });
        fetchComplaints();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to log complaint");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleResolve = (id, dbId) => {
    Swal.fire({
      title: 'Resolve Complaint?',
      text: "Mark this complaint as successfully resolved?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#489b0d',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, Resolve it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/complaints/${dbId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'Resolved' })
          });
          if (response.ok) {
            toast.success("Complaint resolved successfully.");
            fetchComplaints();
          } else {
            toast.error("Failed to resolve");
          }
        } catch (error) {
          toast.error("Network error");
        }
      }
    });
  };

  const handleView = (complaint) => {
    Swal.fire({
      title: `<span class="text-lg font-bold text-slate-800">Ticket Details: ${complaint.id || complaint.complaintId}</span>`,
      html: `
        <div class="text-left space-y-3 mt-4 text-[13px] text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div><span class="font-bold text-slate-900">Customer:</span> ${complaint.customer} (${complaint.phone || 'N/A'})</div>
          ${complaint.email ? `<div><span class="font-bold text-slate-900">Email:</span> ${complaint.email}</div>` : ''}
          <div><span class="font-bold text-slate-900">Category:</span> <span class="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-semibold">${complaint.category || 'General Support'}</span></div>
          <div><span class="font-bold text-slate-900">Subject:</span> ${complaint.subject}</div>
          <div class="mt-2"><span class="font-bold text-slate-900">Description:</span>
            <div class="p-2.5 mt-1 bg-white border border-slate-200 rounded-lg text-slate-600">${complaint.description || 'No additional description provided.'}</div>
          </div>
          <div class="mt-2 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100">
            <span class="font-bold text-emerald-800">Assigned To:</span> 
            <span class="font-semibold text-slate-800 ml-1">${complaint.assignedTo ? complaint.assignedTo : 'Unassigned (General Queue)'}</span>
            ${complaint.assignedBy ? `<span class="text-xs text-slate-500 block mt-0.5">Assigned by ${complaint.assignedBy}</span>` : ''}
          </div>
          ${complaint.adminReply ? `<div class="mt-2"><span class="font-bold text-emerald-700">Staff / Admin Reply:</span>
            <div class="p-2.5 mt-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-medium">${complaint.adminReply}</div>
          </div>` : ''}
          <div class="pt-2 flex justify-between text-xs text-slate-500 border-t border-slate-200">
            <span><strong>Status:</strong> ${complaint.status}</span>
            <span><strong>Logged:</strong> ${complaint.date}</span>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#489b0d',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Reply & Update Status',
      cancelButtonText: 'Close'
    }).then((res) => {
      if (res.isConfirmed) {
        handleReplyModal(complaint);
      }
    });
  };

  const handleReplyModal = (complaint) => {
    Swal.fire({
      title: 'Respond to Enquiry / Ticket',
      html: `
        <div class="text-left space-y-3 text-[13px]">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Status</label>
            <select id="swal-status" class="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-700">
              <option value="Pending" ${complaint.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="In Progress" ${complaint.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Escalated" ${complaint.status === 'Escalated' ? 'selected' : ''}>Escalated</option>
              <option value="Resolved" ${complaint.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
              <option value="Closed" ${complaint.status === 'Closed' ? 'selected' : ''}>Closed</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Reply to Customer (Visible in Customer App)</label>
            <textarea id="swal-reply" rows="3" class="w-full p-2 border border-slate-300 rounded-lg text-slate-700 font-normal" placeholder="Enter resolution explanation or answer to customer query...">${complaint.adminReply || ''}</textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#489b0d',
      confirmButtonText: 'Save Response',
      preConfirm: () => {
        const status = document.getElementById('swal-status').value;
        const adminReply = document.getElementById('swal-reply').value;
        return { status, adminReply };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/complaints/${complaint._id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(result.value)
          });
          if (response.ok) {
            toast.success("Enquiry response updated successfully!");
            fetchComplaints();
          } else {
            toast.error("Failed to update enquiry");
          }
        } catch (error) {
          toast.error("Network error");
        }
      }
    });
  };

  const handleDelete = (id, dbId) => {
    Swal.fire({
      title: 'Delete Complaint?',
      text: "Are you sure you want to permanently delete this complaint?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/complaints/${dbId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            toast.success("Complaint deleted successfully.");
            fetchComplaints();
          } else {
            toast.error("Failed to delete");
          }
        } catch (error) {
          toast.error("Network error");
        }
      }
    });
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = (c.id || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.assignedTo || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "All" || c.priority === filterPriority;
    const matchesStatus = filterStatus === "All" || c.status === filterStatus;
    const matchesAssignee = filterAssignee === "All" 
      ? true 
      : filterAssignee === "Unassigned" 
        ? !c.assignedTo || c.assignedTo === "Unassigned"
        : c.assignedToId === filterAssignee || c.assignedTo === filterAssignee;
    
    return matchesSearch && matchesPriority && matchesStatus && matchesAssignee;
  });

  const totalActive = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const unassignedCount = complaints.filter(c => !c.assignedTo || c.assignedTo === 'Unassigned').length;
  const pendingResolution = complaints.filter(c => c.status === 'Pending' || c.status === 'In Progress').length;
  const escalatedCases = complaints.filter(c => c.status === 'Escalated').length;
  const resolutionRate = complaints.length > 0 
    ? Math.round((complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length / complaints.length) * 100) 
    : 0;

  return (
    <div className="w-full h-full flex flex-col space-y-4 pb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800 mb-0.5">Enquiry & Complaint Management</h1>
          <p className="text-[11px] font-medium text-slate-500">Assign customer queries to support executives, track resolutions, and reply seamlessly.</p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {selectedComplaints.length > 0 && (
            <button 
              onClick={() => openAssignModal(null, true)}
              className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white font-bold text-[13px] hover:bg-indigo-700 transition-all shadow-md animate-pulse"
            >
              <UserPlus size={16} /> Assign Selected ({selectedComplaints.length})
            </button>
          )}

          <div className="relative w-full sm:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Name, Subject, Staff..." 
              className="h-10 pl-9 pr-4 rounded-lg border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-full sm:w-[280px] shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className={`h-10 px-4 flex items-center justify-center gap-2 rounded-lg border text-[13px] font-bold transition-colors shadow-sm ${
              filterPriority !== "All" || filterStatus !== "All" || filterAssignee !== "All"
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter size={14} /> Filter
          </button>
          <button 
            onClick={handleExport}
            className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={() => setIsLogComplaintOpen(true)}
            className="h-10 px-5 flex items-center justify-center gap-2 rounded-lg bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm"
          >
            <MessageSquare size={16} /> Log Enquiry
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center relative z-10">
              <MessageSquare size={16} />
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Active Tickets</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Total Active</p>
            <h3 className="text-2xl font-black text-slate-800">{totalActive}</h3>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center relative z-10">
              <Users size={16} />
            </div>
            {unassignedCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded animate-pulse">
                Needs Assignment
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Unassigned Enquiries</p>
            <h3 className="text-2xl font-black text-slate-800">{unassignedCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center relative z-10">
              <ShieldAlert size={16} />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Escalated Cases</p>
            <h3 className="text-2xl font-black text-slate-800">{escalatedCases}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#489b0d]/5 rounded-bl-full -mr-2 -mt-2 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#489b0d]/10 text-[#489b0d] flex items-center justify-center relative z-10">
              <CheckSquare size={16} />
            </div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#489b0d] bg-[#489b0d]/10 px-2 py-0.5 rounded">
              <ArrowUpRight size={10}/> Solved
            </span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Resolution Rate</p>
            <h3 className="text-2xl font-black text-slate-800">{resolutionRate}%</h3>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-2">
          <div>
            <h3 className="font-extrabold text-slate-800 text-[15px]">Enquiries & Grievances Registry</h3>
            <p className="text-[12px] font-medium text-slate-500 mt-0.5">
              Showing {filteredComplaints.length} tickets {selectedComplaints.length > 0 && `(${selectedComplaints.length} selected)`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="h-8 px-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#489b0d]"
            >
              <option value="All">All Staff / Assignees</option>
              <option value="Unassigned">Unassigned Only</option>
              {staffList.map(s => (
                <option key={s._id || s.id} value={s._id || s.id}>{s.name} ({s.role || 'Staff'})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={filteredComplaints.length > 0 && selectedComplaints.length === filteredComplaints.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-[#489b0d] border-slate-300 focus:ring-[#489b0d] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Complaint ID</th>
                <th className="py-3 px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Customer Details</th>
                <th className="py-3 px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Subject & Category</th>
                <th className="py-3 px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Assigned Staff</th>
                <th className="py-3 px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Date Logged</th>
                <th className="py-3 px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length > 0 ? filteredComplaints.map(complaint => (
                <tr key={complaint._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={selectedComplaints.includes(complaint._id)}
                      onChange={() => handleToggleSelect(complaint._id)}
                      className="w-4 h-4 rounded text-[#489b0d] border-slate-300 focus:ring-[#489b0d] cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[13px] font-bold text-slate-700">{complaint.id}</span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-[13px] font-bold text-slate-800">{complaint.customer}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{complaint.phone}</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-[13px] font-semibold text-slate-700 line-clamp-1">{complaint.subject}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {complaint.category || 'General Support'}
                      </span>
                      {getPriorityBadge(complaint.priority)}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    {complaint.assignedTo && complaint.assignedTo !== "Unassigned" ? (
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                          {complaint.assignedTo.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-[12px] font-bold text-slate-800 leading-tight">{complaint.assignedTo}</p>
                          <button
                            onClick={() => openAssignModal(complaint, false)}
                            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium underline"
                          >
                            Reassign
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => openAssignModal(complaint, false)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1"
                      >
                        <UserPlus size={12} /> Assign Executive
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {getStatusBadge(complaint.status)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[12px] font-semibold text-slate-600">{complaint.date}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => handleView(complaint)}
                        title="View Details & Reply"
                        className="h-8 px-2.5 inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors"
                      >
                        <Eye size={13}/> Reply
                      </button>
                      <button 
                        onClick={() => handleDelete(complaint.id, complaint._id)}
                        title="Delete Ticket"
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} strokeWidth={2.5}/>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500 font-medium">
                    No complaints found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Staff Modal */}
      {assignModal.open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-[15px]">
                    {assignModal.isBulk ? `Bulk Assign ${selectedComplaints.length} Enquiries` : `Assign Ticket ${assignModal.complaint?.id}`}
                  </h3>
                  <p className="text-xs text-slate-500">Allocate enquiry to an executive for resolution</p>
                </div>
              </div>
              <button 
                onClick={() => setAssignModal({ open: false, complaint: null, isBulk: false })}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
              {!assignModal.isBulk && assignModal.complaint && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div><strong>Customer:</strong> {assignModal.complaint.customer} ({assignModal.complaint.phone})</div>
                  <div><strong>Subject:</strong> {assignModal.complaint.subject}</div>
                  <div><strong>Currently:</strong> {assignModal.complaint.assignedTo || 'Unassigned'}</div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Employee / Support Staff <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  required
                >
                  <option value="">-- Choose Staff Member --</option>
                  {staffList.map(s => (
                    <option key={s._id || s.id} value={s._id || s.id}>
                      {s.name} ({s.role || 'Support Staff'}) {s.mobile ? `- ${s.mobile}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setAssignModal({ open: false, complaint: null, isBulk: false })}
                  className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isAssigning}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  {isAssigning ? "Assigning..." : "Confirm Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
                <Filter size={16} className="text-[#489b0d]" /> Filter Enquiries
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
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Assigned Employee</label>
                <select 
                  value={filterAssignee}
                  onChange={(e) => setFilterAssignee(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]"
                >
                  <option value="All">All Staff / Assignees</option>
                  <option value="Unassigned">Unassigned Only</option>
                  {staffList.map(s => (
                    <option key={s._id || s.id} value={s._id || s.id}>{s.name} ({s.role || 'Staff'})</option>
                  ))}
                </select>
              </div>
              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => {
                    setFilterPriority("All");
                    setFilterStatus("All");
                    setFilterAssignee("All");
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
                <MessageSquare size={16} className="text-[#489b0d]" /> Log New Enquiry / Complaint
              </h3>
              <button 
                onClick={() => setIsLogComplaintOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 bg-slate-200/50 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleLogComplaint} className="p-5 space-y-3.5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Customer Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={newComplaint.customer}
                  onChange={(e) => setNewComplaint({...newComplaint, customer: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]" 
                  placeholder="e.g. Ramesh Tiwari"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={newComplaint.phone}
                    onChange={(e) => setNewComplaint({...newComplaint, phone: e.target.value})}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]" 
                    placeholder="e.g. 9876543210"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Category</label>
                  <select 
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]"
                  >
                    <option value="General Support">General Support</option>
                    <option value="Loan Application">Loan Application</option>
                    <option value="Disbursement & EMI">Disbursement & EMI</option>
                    <option value="KYC & Documents">KYC & Documents</option>
                    <option value="Account & Login">Account & Login</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Subject / Issue Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={newComplaint.subject}
                  onChange={(e) => setNewComplaint({...newComplaint, subject: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]" 
                  placeholder="Brief description of the grievance"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea 
                  rows="2"
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 focus:outline-none focus:border-[#489b0d]" 
                  placeholder="Additional details provided by customer..."
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1">Priority Level</label>
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
                  Log Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
