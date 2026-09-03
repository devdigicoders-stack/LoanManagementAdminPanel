import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  MessageSquare,
  FolderOpen,
  ShieldCheck,
  UserPlus
} from "lucide-react";

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [appToAssign, setAppToAssign] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState("");

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.message || 'Failed to load applications');
        setLoading(false);
        return;
      }

      // Map MongoDB _id to id for frontend compatibility
      const mappedData = data.map(app => ({
        ...app,
        id: app.applicationId,
        _id: app._id,
        appliedOn: new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        avatar: app.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.customer)}&background=random`
      }));
      setApplications(mappedData);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchEmployees();
  }, []);

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

  const handleStatusChange = async (newStatus) => {
    if (!selectedApp) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans/${selectedApp._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === selectedApp.id ? { ...app, status: newStatus } : app
          )
        );
        toast.success("Status updated to " + newStatus);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const handleAssignSubmit = async () => {
    if (!appToAssign || !selectedEmp) {
      toast.error("Please select an employee");
      return;
    }
    const employee = employees.find(e => e._id === selectedEmp);
    if (!employee) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/loans/${appToAssign._id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: employee.name, assignedToId: employee._id })
      });
      if (res.ok) {
        const updatedApp = await res.json();
        setApplications(prev => prev.map(a => a._id === updatedApp._id ? { ...a, status: 'Assigned', assignedTo: employee.name } : a));
        toast.success(`Assigned to ${employee.name}`);
        setAssignModalOpen(false);
        setAppToAssign(null);
        setSelectedEmp("");
      } else {
        toast.error("Failed to assign employee");
      }
    } catch (error) {
      toast.error("Error assigning employee");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="text-orange-500 bg-orange-50 px-2.5 py-1 rounded-md text-[11px] font-bold">
            Pending
          </span>
        );
      case "Assigned":
        return (
          <span className="text-blue-500 bg-blue-50 px-2.5 py-1 rounded-md text-[11px] font-bold">
            Assigned
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
            <option value="Assigned">Assigned</option>
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-500 font-medium text-[13px]">
                    Loading applications...
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-500 font-medium text-[13px]">
                    No applications found.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group">
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
                      <Link 
                        to={`/loans/${app._id}`}
                        className="p-1.5 text-slate-400 hover:text-[#489b0d] hover:bg-[#489b0d]/10 rounded transition-colors tooltip-trigger" 
                        title="View Details"
                      >
                        <Eye size={16} strokeWidth={2.5} />
                      </Link>
                      <button 
                        onClick={() => {
                          setAppToAssign(app);
                          setAssignModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors tooltip-trigger" 
                        title="Assign Employee"
                      >
                        <UserPlus size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {assignModalOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={() => setAssignModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-[16px] font-extrabold text-slate-800 flex items-center gap-2">
                <UserPlus size={18} className="text-[#489b0d]" /> Assign Application
              </h2>
              <button onClick={() => setAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[13px] text-slate-600 mb-4 font-medium">Select an employee to handle the application for <strong>{appToAssign?.customer}</strong>.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Assign To</label>
                  <select 
                    value={selectedEmp}
                    onChange={(e) => setSelectedEmp(e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#489b0d] bg-white"
                  >
                    <option value="" disabled>-- Select Employee --</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={handleAssignSubmit}
                  className="w-full h-11 flex items-center justify-center gap-2 bg-[#489b0d] hover:bg-[#3e850b] text-white rounded-md text-[14px] font-bold transition-colors shadow-sm mt-4"
                >
                  <Check size={18} /> Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
