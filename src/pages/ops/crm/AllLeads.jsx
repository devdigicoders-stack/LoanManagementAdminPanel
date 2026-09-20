import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, Eye, Edit, UserPlus, PhoneCall, 
  MessageCircle, MessageSquare, ArrowRightLeft, XOctagon, MoreVertical, Loader2,
  CheckCircle2, ShieldCheck, CheckSquare, ArrowUpRight, X, AlertCircle, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function AllLeads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('all');

  // Escalation Modal state
  const [selectedLead, setSelectedLead] = useState(null);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [nextStage, setNextStage] = useState('');
  const [stageRemarks, setStageRemarks] = useState('');
  const [submittingStage, setSubmittingStage] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, zoneFilter, stageFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (zoneFilter !== 'ALL') params.append('zone', zoneFilter);
      if (stageFilter !== 'all') params.append('approvalStage', stageFilter);

      const url = `${import.meta.env.VITE_API_BASE_URL}/leads?${params.toString()}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leads from database");
    } finally {
      setLoading(false);
    }
  };

  const handleEscalateStage = async (e) => {
    e.preventDefault();
    if (!selectedLead || !nextStage) return;

    try {
      setSubmittingStage(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${selectedLead._id}/approval-stage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          stage: nextStage,
          remarks: stageRemarks
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || `Lead escalated to ${nextStage}`);
        setShowEscalateModal(false);
        setStageRemarks('');
        setSelectedLead(null);
        fetchLeads();
      } else {
        toast.error(data.message || 'Failed to update approval stage');
      }
    } catch (err) {
      toast.error('Network error escalating lead');
    } finally {
      setSubmittingStage(false);
    }
  };

  const openEscalateModal = (lead) => {
    setSelectedLead(lead);
    // Auto suggest next stage based on current
    const current = lead.approvalStage || 'LEAD_SUBMITTED';
    if (current === 'LEAD_SUBMITTED') setNextStage('TL_VERIFIED');
    else if (current === 'TL_VERIFIED') setNextStage('CREDIT_APPROVED');
    else if (current === 'CREDIT_APPROVED') setNextStage('SANCTIONED');
    else if (current === 'SANCTIONED') setNextStage('DISBURSED');
    else setNextStage('TL_VERIFIED');
    setStageRemarks('');
    setShowEscalateModal(true);
  };

  const filtered = leads.filter(l => {
    const q = searchTerm.toLowerCase();
    return (
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.leadId && l.leadId.toLowerCase().includes(q)) ||
      (l.mobile && l.mobile.includes(q)) ||
      (l.state && l.state.toLowerCase().includes(q)) ||
      (l.zone && l.zone.toLowerCase().includes(q))
    );
  });

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'LEAD_SUBMITTED':
        return <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-slate-200">1. Lead Submitted</span>;
      case 'TL_VERIFIED':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-amber-200">2. TL Verified</span>;
      case 'CREDIT_APPROVED':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-purple-200">3. Credit Approved</span>;
      case 'SANCTIONED':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-blue-200">4. Sanctioned</span>;
      case 'DISBURSED':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-200">5. Disbursed</span>;
      case 'REJECTED':
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-rose-200">Rejected</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-md">1. Lead Submitted</span>;
    }
  };

  const getZoneColor = (zone) => {
    switch (zone) {
      case 'NORTH': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'SOUTH': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'EAST': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'WEST': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'CENTRAL': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zonal Pipeline & Loan Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Multi-tier field verification, credit desk underwriting & zonal sanction flow.</p>
        </div>
        <button 
          onClick={() => navigate('/telecaller/leads/add')}
          className="flex items-center gap-2 bg-[#489b0d] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-[#3e850b] transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Add New Lead
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by Lead ID, Customer, Mobile, State..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#489b0d]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Zone Selector */}
        <select 
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          className="border border-gray-300 rounded-lg text-xs font-bold px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#489b0d] bg-white cursor-pointer"
        >
          <option value="ALL">🌐 All 5 Zones</option>
          <option value="NORTH">📍 North Zone (UP, PB, HR, UK, JK, HP)</option>
          <option value="SOUTH">📍 South Zone (AP, KA, KL, TN, TS, PY)</option>
          <option value="EAST">📍 East Zone (BR, JH, OD, CG, WB, AS)</option>
          <option value="WEST">📍 West Zone (MH, GJ, MP, RJ, GA)</option>
          <option value="CENTRAL">📍 Central Zone (DL, CH)</option>
        </select>
        
        {/* Multi-Tier Approval Stage Selector */}
        <select 
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="border border-gray-300 rounded-lg text-xs font-bold px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#489b0d] bg-white cursor-pointer"
        >
          <option value="all">⚡ All Approval Stages</option>
          <option value="LEAD_SUBMITTED">1. Lead Submitted</option>
          <option value="TL_VERIFIED">2. TL Verified</option>
          <option value="CREDIT_APPROVED">3. Credit Approved</option>
          <option value="SANCTIONED">4. Sanctioned</option>
          <option value="DISBURSED">5. Disbursed</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg text-xs font-semibold px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#489b0d] bg-white cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Lead ID</th>
                <th className="py-3.5 px-4">Customer & Phone</th>
                <th className="py-3.5 px-4">Zone & State</th>
                <th className="py-3.5 px-4">Product & Amount</th>
                <th className="py-3.5 px-4">Hierarchy Stage</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Escalate / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[#489b0d]" />
                    Loading live zonal leads...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-sm">
                    No leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {lead.leadId || `LD-${lead._id.slice(-4)}`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 text-sm">{lead.name}</div>
                      <div className="text-xs text-gray-500 font-medium">{lead.mobile}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${getZoneColor(lead.zone)}`}>
                        <MapPin size={10} /> {lead.zone || 'NORTH'}
                      </span>
                      <div className="text-[11px] text-gray-500 mt-0.5 font-medium truncate max-w-[130px]">
                        {lead.state || lead.city || 'State Unmapped'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-bold text-gray-800">{lead.loanPurpose || lead.productCategory || 'Business Loan'}</div>
                      <div className="text-xs font-extrabold text-[#489b0d]">
                        {lead.expectedAmount ? (lead.expectedAmount.startsWith('₹') ? lead.expectedAmount : `₹${lead.expectedAmount}`) : '₹10,00,000'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStageBadge(lead.approvalStage)}
                      {lead.approvalRemarks && (
                        <p className="text-[10px] text-gray-500 italic mt-1 truncate max-w-[150px]">"{lead.approvalRemarks}"</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        lead.status === 'Qualified' || lead.status === 'Converted' ? 'bg-emerald-100 text-emerald-700' :
                        lead.status === 'Lost' || lead.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEscalateModal(lead)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-[#489b0d] hover:bg-[#3e850b] text-white text-[11px] font-bold rounded shadow-sm transition-all cursor-pointer"
                          title="Progress Approval Stage"
                        >
                          <ArrowUpRight size={13} /> Escalate
                        </button>
                        <a 
                          href={`tel:${lead.mobile}`}
                          className="p-1.5 text-gray-400 hover:text-[#489b0d] hover:bg-slate-100 rounded-md transition-colors"
                          title="Call Lead"
                        >
                          <PhoneCall size={14} />
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

      {/* Escalation Stage Progression Modal */}
      {showEscalateModal && selectedLead && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#489b0d]" /> Escalate Approval Hierarchy
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">Lead: {selectedLead.leadId} • {selectedLead.name} ({selectedLead.zone} Zone)</p>
              </div>
              <button onClick={() => setShowEscalateModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEscalateStage} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Current Stage:</span>
                  <div className="mt-1">{getStageBadge(selectedLead.approvalStage)}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-medium">Zone & Amount:</span>
                  <div className="font-bold text-slate-800 mt-1">{selectedLead.zone} • {selectedLead.expectedAmount || '₹10,00,000'}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Next Approval Action *</label>
                <select 
                  value={nextStage}
                  onChange={(e) => setNextStage(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-[#489b0d] focus:border-[#489b0d]"
                  required
                >
                  <option value="TL_VERIFIED">Stage 2: TL Verified (Forward to Credit Desk)</option>
                  <option value="CREDIT_APPROVED">Stage 3: Credit Approved (Forward for Sanction)</option>
                  <option value="SANCTIONED">Stage 4: Sanctioned (Send to Finance / Accounts)</option>
                  <option value="DISBURSED">Stage 5: Disbursed (Payment Released to Customer)</option>
                  <option value="REJECTED">Reject Application (With remarks)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Verification Notes / Remarks</label>
                <textarea 
                  rows={3}
                  value={stageRemarks}
                  onChange={(e) => setStageRemarks(e.target.value)}
                  placeholder="E.g. Ground address verified. CIBIL score is 780. Approved for sanction up to 10 Lakhs..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-700 focus:ring-2 focus:ring-[#489b0d] focus:border-[#489b0d]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEscalateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingStage}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#489b0d] hover:bg-[#3e850b] rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submittingStage ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Confirm Stage Transition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
