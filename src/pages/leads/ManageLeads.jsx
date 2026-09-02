import React, { useState, useEffect } from "react";
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
  Users
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
  const [leadsList, setLeadsList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assign Modal State
  const [selectedLeadForAssign, setSelectedLeadForAssign] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [employee, setEmployee] = useState("");
  const [team, setTeam] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [leadsRes, empRes] = await Promise.all([
          fetch('http://localhost:5000/api/leads', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/employees', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (leadsRes.ok) {
          const data = await leadsRes.json();
          const mappedData = data.map(lead => ({
            ...lead,
            id: lead._id,
            createdOn: new Date(lead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(lead.name)}&background=random`
          }));
          setLeadsList(mappedData);
        } else {
          toast.error('Failed to fetch leads');
        }

        if (empRes.ok) {
          setEmployees(await empRes.json());
        }
      } catch (error) {
        toast.error('Server error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [filterSource, setFilterSource] = useState("All Sources");
  const [filterStatus, setFilterStatus] = useState("All Status");

  const filteredLeads = leadsList.filter(lead => {
    const matchSource = filterSource === "All Sources" || lead.source === filterSource;
    const matchStatus = filterStatus === "All Status" || lead.status === filterStatus;
    return matchSource && matchStatus;
  });

  const updateLeadStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/leads/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeadsList(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
        toast.success(`Lead status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };

  const openAssignModal = (lead) => {
    setSelectedLeadForAssign(lead);
    setEmployee("");
    setTeam("");
    setPriority("Medium");
    setRemarks("");
  };

  const closeAssignModal = () => {
    setSelectedLeadForAssign(null);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!employee && !team) {
      toast.error("Please select an employee or a team to assign the lead.");
      return;
    }

    const selectedEmp = employees.find(emp => emp._id === employee);
    const assignData = {
      assignedTo: selectedEmp ? selectedEmp.name : null,
      assignedToId: employee || null,
      assignedTeam: team || null,
      priority,
      assignmentRemarks: remarks
    };

    setIsAssigning(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/leads/${selectedLeadForAssign.id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(assignData)
      });
      
      if (res.ok) {
        setLeadsList(prev => prev.map(l => l.id === selectedLeadForAssign.id ? { ...l, status: 'Assigned', assignedTo: assignData.assignedTo } : l));
        toast.success("Lead assigned successfully!");
        closeAssignModal();
      } else {
        toast.error("Failed to assign lead");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setIsAssigning(false);
    }
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
      case "Assigned":
        return (
          <span className="text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded text-[11px] font-bold">
            Assigned
          </span>
        );
      case "Rejected":
        return (
          <span className="text-rose-500 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-bold">
            Rejected
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
            <option>Assigned</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Converted</option>
            <option>Rejected</option>
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
                  <td className="py-4 px-6"><span className="text-[13px] font-bold text-slate-700">{lead.leadId}</span></td>
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
                      {(lead.status === 'New' || lead.status === 'Unassigned' || lead.status === 'Rejected') && (
                        <button 
                          onClick={() => openAssignModal(lead)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors tooltip-trigger" 
                          title="Assign Lead"
                        >
                          <UserCheck size={16} strokeWidth={2.5} />
                        </button>
                      )}
                      <Link to={`/leads/${lead.id}`} className="p-1.5 text-slate-400 hover:text-[#489b0d] hover:bg-[#489b0d]/10 rounded transition-colors tooltip-trigger" title="View Details">
                        <Eye size={16} strokeWidth={2.5} />
                      </Link>
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

      {/* Assign Modal */}
      {selectedLeadForAssign && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-extrabold text-slate-800 text-[16px] flex items-center gap-2">
                  <UserCheck size={18} className="text-[#489b0d]"/> Assign Lead
                </h3>
                <p className="text-[12px] text-slate-500 font-medium mt-0.5">Assigning {selectedLeadForAssign.name} ({selectedLeadForAssign.leadId})</p>
              </div>
              <button onClick={closeAssignModal} className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-slate-200/50 rounded-full hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="assign-form" onSubmit={handleAssign} className="space-y-5">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                    Select Employee <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                      value={employee}
                      onChange={(e) => { setEmployee(e.target.value); setTeam(""); }}
                      className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#489b0d] bg-white appearance-none"
                    >
                      <option value="">Select individual employee</option>
                      {employees.map(emp => (
                        <option key={emp._id} value={emp._id}>{emp.name} ({emp.designation})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-2">
                    Lead Priority
                  </label>
                  <div className="flex gap-3">
                    {['Low', 'Medium', 'High'].map(p => (
                      <div 
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 h-10 flex items-center justify-center gap-2 rounded border-2 cursor-pointer transition-all ${priority === p ? (p === 'High' ? 'border-red-500 bg-red-50 text-red-600' : p === 'Medium' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-[#489b0d] bg-[#489b0d]/10 text-[#489b0d]') : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                      >
                        {priority === p && <CheckCircle2 size={14} />}
                        <span className="font-bold text-[12px]">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                    Assignment Remarks (Optional)
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add instructions or notes..."
                    rows="3"
                    className="w-full p-3 rounded-md border border-slate-200 text-[13px] text-slate-700 focus:outline-none focus:border-[#489b0d] bg-white resize-none"
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={closeAssignModal}
                className="h-10 px-5 rounded-md border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="assign-form"
                disabled={isAssigning}
                className="h-10 px-6 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
              >
                {isAssigning ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Processing...</>
                ) : (
                  <><UserCheck size={16}/> Confirm Assignment</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
