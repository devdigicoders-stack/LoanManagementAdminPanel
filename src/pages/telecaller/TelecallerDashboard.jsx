import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Hourglass, CheckSquare, XSquare, Search, Phone, Mail, 
  FileText, CheckCircle2, XCircle, Target, FolderOpen, Loader2, UserCheck, 
  ExternalLink, Copy, Check
} from 'lucide-react';
import SupervisorStaffFilter from '../../components/SupervisorStaffFilter';
import toast from 'react-hot-toast';

export default function TelecallerDashboard() {
  const [activeFilter, setActiveFilter] = useState('All Records');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [leads, setLeads] = useState([]);
  const [pendingOnboardings, setPendingOnboardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  const [stats, setStats] = useState({
    totalCreatedLeads: 0,
    totalAssigned: 0,
    assignedLeadsCount: 0,
    assignedLoansCount: 0,
    convertedLeads: 0,
    followUpsToday: 0
  });

  const name = localStorage.getItem(`adminName_${localStorage.getItem("userRole")}`) || "Telecaller Agent";

  useEffect(() => {
    fetchStats();
    fetchLiveLeads();
    fetchPendingOnboardings();
  }, [selectedStaff]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = selectedStaff && selectedStaff !== 'all'
        ? `${import.meta.env.VITE_API_BASE_URL}/employees/telecaller-dashboard-stats?employeeId=${selectedStaff}`
        : `${import.meta.env.VITE_API_BASE_URL}/employees/telecaller-dashboard-stats`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLiveLeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = `${import.meta.env.VITE_API_BASE_URL}/leads?unassigned=false`;
      if (selectedStaff && selectedStaff !== 'all') {
        url += `&assignedToId=${selectedStaff}`;
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customer leads");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingOnboardings = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = `${import.meta.env.VITE_API_BASE_URL}/employees/pending-onboarding?unassigned=false`;
      if (selectedStaff && selectedStaff !== 'all') {
        url += `&assignedTelecallerId=${selectedStaff}`;
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingOnboardings(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, isInterested) => {
    const newStatus = isInterested ? "Qualified" : "Lost";
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setLeads(prev => prev.map(lead => 
          lead._id === id ? { ...lead, status: newStatus } : lead
        ));
        toast.success(`Lead marked as ${newStatus} in Database`);
      } else {
        toast.error("Failed to update lead status");
      }
    } catch (err) {
      toast.error("Network error updating status");
    }
  };

  const handleCopyOnboardingLink = (empId) => {
    const link = `${window.location.origin}/onboarding/${empId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(empId);
    toast.success("Candidate onboarding link copied! Share via WhatsApp or SMS.");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredLeads = leads.filter(lead => {
    if (activeFilter === 'Interested' && lead.status !== 'Qualified' && lead.status !== 'Converted') return false;
    if (activeFilter === 'Not Interested' && lead.status !== 'Lost' && lead.status !== 'Rejected') return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (lead.name && lead.name.toLowerCase().includes(q)) || 
             (lead.mobile && lead.mobile.includes(q)) || 
             (lead.loanPurpose && lead.loanPurpose.toLowerCase().includes(q));
    }
    return true;
  });

  const filteredOnboardings = pendingOnboardings.filter(emp => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (emp.name && emp.name.toLowerCase().includes(q)) ||
             (emp.mobile && emp.mobile.includes(q)) ||
             (emp.email && emp.email.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Telecaller Calling Portal</h1>
          <p className="text-[14px] text-gray-500 mt-1">Live customer calling & candidate onboarding chasers from MongoDB</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SupervisorStaffFilter onSelectStaff={setSelectedStaff} role="tele" />
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg font-medium text-[13px] shadow-sm">
            <CheckCircle2 size={16} className="text-green-600" />
            Active: {name}
          </div>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Total Leads</p>
            <p className="text-2xl font-bold text-blue-600">{leads.length}</p>
          </div>
          <div className="text-gray-400 bg-gray-50 p-2 rounded-lg">
            <FolderOpen size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Qualified Leads</p>
            <p className="text-2xl font-bold text-purple-600">
              {leads.filter(l => l.status === 'Qualified').length}
            </p>
          </div>
          <div className="text-gray-400 bg-gray-50 p-2 rounded-lg">
            <Target size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Converted Loans</p>
            <p className="text-2xl font-bold text-green-600">
              {leads.filter(l => l.status === 'Converted').length}
            </p>
          </div>
          <div className="text-gray-400 bg-gray-50 p-2 rounded-lg">
            <CheckSquare size={22} />
          </div>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm bg-amber-50/20">
          <div>
            <p className="text-[12px] font-bold text-amber-700 mb-1">Onboarding Chasers</p>
            <p className="text-2xl font-bold text-amber-600">
              {pendingOnboardings.filter(e => e.onboardingStatus !== 'Done').length}
            </p>
          </div>
          <div className="text-amber-600 bg-amber-100 p-2 rounded-lg">
            <UserCheck size={22} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setActiveFilter('All Records')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors shadow-sm ${activeFilter === 'All Records' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
        >
          <ClipboardList size={14} /> Customer Leads ({leads.length})
        </button>
        <button 
          onClick={() => setActiveFilter('Interested')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors shadow-sm ${activeFilter === 'Interested' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
        >
          <CheckSquare size={14} className={activeFilter === 'Interested' ? 'text-white' : 'text-green-500'} /> Interested Leads
        </button>
        <button 
          onClick={() => setActiveFilter('Not Interested')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors shadow-sm ${activeFilter === 'Not Interested' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
        >
          <XSquare size={14} className={activeFilter === 'Not Interested' ? 'text-white' : 'text-gray-400'} /> Lost / Dropped
        </button>
        <button 
          onClick={() => setActiveFilter('Onboardings')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors shadow-sm ${activeFilter === 'Onboardings' ? 'bg-amber-600 text-white' : 'bg-amber-50 border border-amber-300 text-amber-800'}`}
        >
          <UserCheck size={14} className={activeFilter === 'Onboardings' ? 'text-white' : 'text-amber-600'} /> 
          Candidate Onboarding Chasers ({pendingOnboardings.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder={activeFilter === 'Onboardings' ? "Search candidate name, phone or email..." : "Search customer name, phone, loan purpose..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 shadow-sm"
        />
      </div>

      {/* Table: Conditional based on active tab */}
      {activeFilter === 'Onboardings' ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-amber-50/50 border-b border-amber-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-amber-900">Hired Candidates Pending Onboarding Form</h3>
              <p className="text-xs text-amber-700">Call candidates to guide them in submitting their KYC & Bank details.</p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              {pendingOnboardings.filter(e => e.onboardingStatus !== 'Done').length} Pending Action
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-[12px] font-bold text-gray-500 uppercase">
                  <th className="py-4 px-6">Candidate Name</th>
                  <th className="py-4 px-6">Designation / Role</th>
                  <th className="py-4 px-6">Contact Number</th>
                  <th className="py-4 px-6">Onboarding Status</th>
                  <th className="py-4 px-6 text-center">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOnboardings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                      No pending candidate onboardings assigned.
                    </td>
                  </tr>
                ) : (
                  filteredOnboardings.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900 text-sm">{emp.name}</div>
                        <div className="text-xs text-gray-400">{emp.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-800 text-sm">{emp.designation}</span>
                        <div className="text-xs text-gray-400">{emp.division || 'Operations'}</div>
                      </td>
                      <td className="py-4 px-6">
                        <a href={`tel:${emp.mobile}`} className="font-mono text-sm text-blue-600 hover:underline flex items-center gap-1.5 font-bold">
                          <Phone size={13} /> {emp.mobile || 'No phone'}
                        </a>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          emp.onboardingStatus === 'Done' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {emp.onboardingStatus === 'Done' ? '✓ Completed' : 'Pending Submission'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleCopyOnboardingLink(emp._id)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                            title="Copy Form Link to WhatsApp/SMS"
                          >
                            {copiedId === emp._id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                            {copiedId === emp._id ? 'Copied Link' : 'Copy Form Link'}
                          </button>
                          <a
                            href={`/onboarding/${emp._id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
                            title="Open Form"
                          >
                            <ExternalLink size={15} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-[12px] font-bold text-gray-500 uppercase">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Loan Purpose</th>
                  <th className="py-4 px-6">Expected Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Interest Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <Loader2 size={24} className="animate-spin mx-auto mb-2 text-blue-600" />
                      Loading live leads...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                      No leads match your filter.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900 text-sm">{lead.name}</div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <a href={`tel:${lead.mobile}`} className="flex items-center gap-1 hover:text-blue-600">
                            <Phone size={12} /> {lead.mobile}
                          </a>
                          {lead.email && (
                            <span className="flex items-center gap-1">
                              <Mail size={12} /> {lead.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-800 text-sm">{lead.loanPurpose}</span>
                        <div className="text-xs text-gray-400 mt-0.5">{lead.source}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900 text-sm">
                          {lead.expectedAmount || '₹10,00,000'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          lead.status === 'Qualified' || lead.status === 'Converted' ? 'bg-green-100 text-green-700' :
                          lead.status === 'Lost' || lead.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleStatusChange(lead._id, true)}
                            className={`p-2 rounded-lg border transition-all ${
                              lead.status === 'Qualified'
                                ? 'bg-green-600 text-white border-green-600 shadow-sm'
                                : 'border-gray-200 text-gray-400 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title="Interested / Qualified"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(lead._id, false)}
                            className={`p-2 rounded-lg border transition-all ${
                              lead.status === 'Lost'
                                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                                : 'border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title="Not Interested / Lost"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
