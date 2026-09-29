import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck, UserCheck, FileText, CheckCircle2, Clock, Search,
  Link2, RefreshCw, ChevronDown, ChevronUp, AlertCircle,
  Users, Eye, Shield, CheckSquare, Phone, X, Check, Crown, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://loan-management-backend-wu4y.onrender.com/api';
const API = API_BASE.replace('/api', '');

const DOC_LABEL = {
  aadhar: 'Aadhaar Card',
  pan: 'PAN Card',
  degree: 'Degree/Marksheet',
  photo: 'Passport Photo',
  bankPassbook: 'Bank Passbook / Cancelled Cheque',
  offerLetter: 'Offer Letter',
  experienceLetter: 'Experience Letter',
};

const STEPS = [
  { key: 'preboarding', label: 'Pre-Boarding', icon: <UserCheck size={14} /> },
  { key: 'formFill',    label: 'Form Fill',    icon: <ClipboardCheck size={14} /> },
  { key: 'docUpload',   label: 'Docs Uploaded', icon: <FileText size={14} /> },
  { key: 'docVerified', label: 'Docs Verified', icon: <Shield size={14} /> },
  { key: 'done',        label: 'Completed',    icon: <CheckCircle2 size={14} /> },
];

function isDepartmentHead(emp) {
  const text = `${emp.designation || ''} ${emp.role || ''} ${emp.division || ''}`.toLowerCase();
  return text.includes('head') || text.includes('rrm') || text.includes('director') || text.includes('vp') || text.includes('chief');
}

function calcStep(emp) {
  if (emp.onboardingStatus === 'Done') return 4;
  const hasDocs = emp.documents && emp.documents.length > 0;
  const allVerified = hasDocs && emp.documents.every(d => d.status === 'Verified');
  if (allVerified) return 3;
  if (hasDocs) return 2;
  if (emp.onboardingStatus === 'Submitted' || emp.onboardingStatus === 'Pending') return 1;
  return 0;
}

function StatusBadge({ status }) {
  const map = {
    'Done':      'bg-green-100 text-green-700',
    'Submitted': 'bg-blue-100 text-blue-700',
    'Pending':   'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function DocStatusBadge({ status }) {
  const map = {
    'Verified':           'bg-green-100 text-green-700',
    'Pending':            'bg-yellow-100 text-yellow-700',
    'Rejected':           'bg-red-100 text-red-700',
    'Re-upload Required': 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function EmployeeTableRow({ emp, token, onRefresh }) {
  const navigate = useNavigate();
  const rawRole = (localStorage.getItem('userRole') || '').trim().toLowerCase();
  const cleanRole = rawRole.replace(/[^a-z0-9]/g, '');
  const isSuperOrAdmin = ['superadmin', 'admin', 'administrator', 'super_admin'].includes(cleanRole) || rawRole.includes('super admin') || rawRole === 'admin';
  const isHeadCandidate = isDepartmentHead(emp);

  const [expanded, setExpanded] = useState(false);
  const [updatingDoc, setUpdatingDoc] = useState(null);
  const [markingDone, setMarkingDone] = useState(false);
  const step = calcStep(emp);
  const completion = Math.round((step / 4) * 100);

  const copyLink = () => {
    const link = `${window.location.origin}/onboarding/${emp._id}`;
    navigator.clipboard.writeText(link);
    toast.success('Onboarding link copied!');
  };

  const verifyDoc = async (docId, newStatus) => {
    setUpdatingDoc(docId);
    try {
      const res = await fetch(`${API}/api/employees/${emp._id}/documents/${docId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) { 
        toast.success(`Document marked as ${newStatus}`); 
        onRefresh(); 
      } else {
        toast.error('Failed to update document status');
      }
    } catch { 
      toast.error('Server error'); 
    } finally { 
      setUpdatingDoc(null); 
    }
  };

  const markComplete = async () => {
    setMarkingDone(true);
    try {
      const res = await fetch(`${API}/api/employees/${emp._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ onboardingStatus: 'Done' }),
      });
      if (res.ok) { 
        toast.success('Onboarding marked as complete!'); 
        onRefresh(); 
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || 'Failed to complete onboarding. All documents must be verified first.');
      }
    } catch { 
      toast.error('Server error'); 
    } finally { 
      setMarkingDone(false); 
    }
  };

  return (
    <React.Fragment>
      <tr className="hover:bg-blue-50/30 transition-colors border-b border-gray-100">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {(() => {
              const photoDoc = (emp.documents || []).find(d => 
                (d.key && (d.key.toLowerCase().includes('photo') || d.key === 'Passport Photo')) ||
                (d.name && d.name.toLowerCase().includes('photo'))
              );
              const avatarPath = emp.avatar || photoDoc?.fileUrl;
              if (avatarPath) {
                const fullSrc = (avatarPath.startsWith('http') || avatarPath.startsWith('data:')) ? avatarPath : `${API}/${avatarPath.startsWith('/') ? avatarPath.slice(1) : avatarPath}`;
                return (
                  <img
                    src={fullSrc}
                    alt={emp.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 shadow-xs"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                );
              }
              return (
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm ${isHeadCandidate ? 'bg-gradient-to-br from-amber-500 to-amber-700 ring-2 ring-amber-300' : 'bg-gradient-to-br from-blue-500 to-blue-700'}`}>
                  {isHeadCandidate ? <Crown size={15} /> : (emp.name?.charAt(0).toUpperCase() || 'E')}
                </div>
              );
            })()}
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-bold text-gray-900">{emp.name}</p>
                {isHeadCandidate && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
                    <Crown size={10} className="text-amber-700" /> Dept Head
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{emp.designation} &middot; {emp.division || 'General'}</p>
              <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{emp.empId} {emp.mobile ? `| ${emp.mobile}` : ''}</p>
            </div>
          </div>
        </td>

        <td className="px-4 py-3 align-top">
          <div className="mb-2 mt-1"><StatusBadge status={emp.onboardingStatus} /></div>
          <div className="flex items-center gap-2 mb-1 w-32">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div className={`h-1.5 rounded-full ${completion === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${completion}%` }} />
            </div>
            <span className="text-[10px] font-bold text-gray-500">{completion}%</span>
          </div>
          <p className="text-[10px] text-gray-400 font-semibold">{STEPS[step]?.label || 'Completed'}</p>
        </td>

        <td className="px-4 py-3 align-top">
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {emp.onboardingStatus === 'Pending' && (
              <button 
                onClick={async () => {
                  toast.loading('Sending reminder...', { id: 'remind' });
                  try {
                    const res = await fetch(`${API}/api/employees/${emp._id}/remind-employee`, { 
                      method: 'POST', 
                      headers: { Authorization: `Bearer ${token}` } 
                    });
                    if (res.ok) toast.success('Reminder email sent!', { id: 'remind' });
                    else toast.error('Failed to send reminder', { id: 'remind' });
                  } catch { 
                    toast.error('Server error', { id: 'remind' }); 
                  }
                }} 
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded hover:bg-orange-100"
              >
                <AlertCircle size={10} /> Reminder
              </button>
            )}

            <button 
              onClick={() => navigate(`/hr/onboarding/${emp._id}`)} 
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-700 border border-blue-200 bg-blue-50 rounded hover:bg-blue-100 transition-colors shadow-2xs"
              title="Open full candidate form details & docs review page"
            >
              <Eye size={12} /> View Full Form
            </button>

            {emp.onboardingStatus === 'Done' ? (
              <span 
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-gray-400 border border-gray-200 bg-gray-100/70 rounded cursor-not-allowed opacity-60"
                title="Onboarding completed - Link disabled"
              >
                <Link2 size={10} /> Link (Done)
              </span>
            ) : (
              <button 
                onClick={copyLink} 
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-gray-600 border border-gray-200 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                title="Copy Candidate Onboarding Link"
              >
                <Link2 size={10} /> Link
              </button>
            )}

            <button 
              onClick={() => setExpanded(!expanded)} 
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gray-700 border border-gray-200 bg-white rounded hover:bg-gray-50 transition-colors"
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />} {expanded ? 'Hide Quick Docs' : 'Quick Docs'}
            </button>

            {emp.onboardingStatus !== 'Done' && (
              <button
                disabled={markingDone}
                onClick={markComplete}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-green-700 border border-green-300 bg-green-50 rounded hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                <Check size={12} /> {markingDone ? 'Completing...' : 'Mark Done'}
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Quick Docs Dropdown */}
      {expanded && (
        <tr className="bg-gray-50/60 border-b border-gray-100">
          <td colSpan={3} className="px-6 py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Uploaded Documents ({emp.documents?.length || 0})</p>
                <button 
                  onClick={() => navigate(`/hr/onboarding/${emp._id}`)} 
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Go to full review page <ExternalLink size={11} />
                </button>
              </div>

              {!emp.documents || emp.documents.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">No documents uploaded yet by the candidate.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {emp.documents.map((doc) => {
                    const isUpdating = updatingDoc === doc._id;
                    const docName = DOC_LABEL[doc.name] || doc.name;
                    return (
                      <div key={doc._id} className="p-3 bg-white border border-gray-200/80 rounded-lg shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-gray-800 truncate" title={docName}>{docName}</p>
                          <DocStatusBadge status={doc.status} />
                        </div>
                        {doc.url && (
                          <a
                            href={doc.url.startsWith('http') ? doc.url : `${API}/${doc.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <FileText size={11} /> View Uploaded File
                          </a>
                        )}
                        <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
                          <button
                            disabled={isUpdating || doc.status === 'Verified'}
                            onClick={() => verifyDoc(doc._id, 'Verified')}
                            className="flex-1 py-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 disabled:opacity-40"
                          >
                            Verify
                          </button>
                          <button
                            disabled={isUpdating || doc.status === 'Rejected'}
                            onClick={() => verifyDoc(doc._id, 'Rejected')}
                            className="flex-1 py-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 disabled:opacity-40"
                          >
                            Reject
                          </button>
                          <button
                            disabled={isUpdating || doc.status === 'Re-upload Required'}
                            onClick={() => verifyDoc(doc._id, 'Re-upload Required')}
                            className="flex-1 py-1 text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 disabled:opacity-40"
                          >
                            Re-upload
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

export default function Onboarding() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active'); // 'active' | 'heads' | 'completed' | 'all'
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/employees`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setEmployees(data);
      } else {
        toast.error('Failed to fetch onboarding data');
      }
    } catch {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const headsCount = employees.filter(e => isDepartmentHead(e)).length;
  const activeCount = employees.filter(e => !isDepartmentHead(e) && e.onboardingStatus !== 'Done').length;
  const completedCount = employees.filter(e => e.onboardingStatus === 'Done').length;

  const filtered = employees.filter(e => {
    const isHead = isDepartmentHead(e);
    if (tab === 'heads' && !isHead) return false;
    if (tab === 'active' && (isHead || e.onboardingStatus === 'Done')) return false;
    if (tab === 'completed' && e.onboardingStatus !== 'Done') return false;

    if (search) {
      const q = search.toLowerCase();
      const matchName = e.name?.toLowerCase().includes(q);
      const matchEmpId = e.empId?.toLowerCase().includes(q);
      const matchDesig = e.designation?.toLowerCase().includes(q);
      const matchMobile = e.mobile?.toLowerCase().includes(q);
      if (!matchName && !matchEmpId && !matchDesig && !matchMobile) return false;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="text-blue-600" size={24} /> Employee Onboarding
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track document submissions, verify identity proofs, and finalize candidate joining.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs self-start"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
            <Crown size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Dept Heads</p>
            <p className="text-lg font-black text-amber-900">{headsCount}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">In Progress</p>
            <p className="text-lg font-black text-blue-900">{activeCount}</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200/80 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center font-bold">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-green-800 uppercase tracking-wider">Completed</p>
            <p className="text-lg font-black text-green-900">{completedCount}</p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-700 text-white flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Total Staff</p>
            <p className="text-lg font-black text-gray-900">{employees.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
              tab === 'active'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            In Progress ({activeCount})
          </button>
          <button
            onClick={() => setTab('heads')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
              tab === 'heads'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Crown size={13} /> Dept Heads ({headsCount})
          </button>
          <button
            onClick={() => setTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
              tab === 'all'
                ? 'bg-gray-800 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            All ({employees.length})
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
              tab === 'completed'
                ? 'bg-green-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-500 font-semibold">Loading onboarding data...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No onboardings found in this view.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Employee / Head</th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status & Progress</th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => (
                  <EmployeeTableRow 
                    key={emp._id} 
                    emp={emp} 
                    token={token} 
                    onRefresh={fetchData} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
