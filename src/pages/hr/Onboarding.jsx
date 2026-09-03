import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck, UserCheck, FileText, CheckCircle2, Clock, Search,
  Link2, RefreshCw, ChevronDown, ChevronUp, AlertCircle,
  Users, Eye, Shield, CheckSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000';

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

function StepBar({ step }) {
  return (
    <div className="flex items-center gap-0 mt-3">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {i < step ? <CheckCircle2 size={14} /> : s.icon}
            </div>
            <span className={`text-[9px] font-semibold whitespace-nowrap ${i <= step ? 'text-gray-700' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mb-3 mx-0.5 transition-all ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function EmployeeCard({ emp, token, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [updatingDoc, setUpdatingDoc] = useState(null);
  const [markingDone, setMarkingDone] = useState(false);
  const step = calcStep(emp);
  const completion = Math.round((step / 4) * 100);

  const copyLink = () => {
    const link = `${window.location.origin.replace('5173', '5173')}/onboarding/${emp._id}`;
    navigator.clipboard.writeText(link).then(() => toast.success('Onboarding link copied!')).catch(() => {
      // fallback
      const el = document.createElement('textarea');
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      toast.success('Link copied!');
    });
  };

  const handleDocStatus = async (docId, newStatus) => {
    setUpdatingDoc(docId);
    try {
      const res = await fetch(`${API}/api/employees/${emp._id}/documents/${docId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) { toast.success(`Document marked as ${newStatus}`); onRefresh(); }
      else toast.error('Failed to update document status');
    } catch { toast.error('Server error'); }
    finally { setUpdatingDoc(null); }
  };

  const markComplete = async () => {
    setMarkingDone(true);
    try {
      const res = await fetch(`${API}/api/employees/${emp._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ onboardingStatus: 'Done' }),
      });
      if (res.ok) { toast.success('Onboarding marked as complete!'); onRefresh(); }
      else toast.error('Failed to complete onboarding');
    } catch { toast.error('Server error'); }
    finally { setMarkingDone(false); }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {emp.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gray-900 text-sm">{emp.name}</h3>
                <StatusBadge status={emp.onboardingStatus} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{emp.designation} Ã‚Â· {emp.division}</p>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">{emp.empId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
                  } catch { toast.error('Server error', { id: 'remind' }); }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <AlertCircle size={12} /> Send Reminder
              </button>
            )}
            <button
              onClick={copyLink}
              title="Copy onboarding link"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Link2 size={12} /> Share Link
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 border border-gray-200 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
            <span>Onboarding Progress</span>
            <span className={completion === 100 ? 'text-green-600' : 'text-blue-600'}>{completion}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${completion === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${completion}%` }}
            />
          </div>
          <StepBar step={step} />
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-5">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FileText size={13} className="text-gray-400" /> Submitted Documents
          </h4>

          {emp.documents && emp.documents.length > 0 ? (
            <div className="space-y-2 mb-4">
              {emp.documents.map(doc => (
                <div key={doc._id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={13} className="text-blue-400 shrink-0" />
                    <span className="text-xs font-semibold text-gray-800 truncate">{DOC_LABEL[doc.key] || doc.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {doc.fileUrl && (
                      <a href={`${API}/${doc.fileUrl}`} target="_blank" rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-1">
                        <Eye size={11} /> View
                      </a>
                    )}
                    <DocStatusBadge status={doc.status} />
                    {doc.status !== 'Verified' && (
                      <button
                        disabled={updatingDoc === doc._id}
                        onClick={() => handleDocStatus(doc._id, 'Verified')}
                        className="text-[11px] font-bold text-green-700 bg-green-100 hover:bg-green-200 px-2 py-0.5 rounded transition-colors disabled:opacity-50"
                      >
                        {updatingDoc === doc._id ? 'Ã¢â‚¬Â¦' : 'Verify'}
                      </button>
                    )}
                    {doc.status !== 'Rejected' && doc.status !== 'Verified' && (
                      <button
                        disabled={updatingDoc === doc._id}
                        onClick={() => handleDocStatus(doc._id, 'Rejected')}
                        className="text-[11px] font-bold text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    )}
                    {doc.status === 'Verified' && <CheckCircle2 size={14} className="text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic mb-4">No documents uploaded yet. Share the link to notify the employee.</p>
          )}

          {emp.onboardingStatus !== 'Done' && (
            <button
              onClick={markComplete}
              disabled={markingDone || step < 3}
              title={step < 3 ? 'Verify all documents to complete onboarding' : 'Mark as complete'}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <CheckSquare size={15} />
              {markingDone ? 'Saving...' : 'Mark Onboarding as Complete'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Onboarding() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const filtered = employees.filter(emp => {
    const matchTab = tab === 'active'
      ? emp.onboardingStatus !== 'Done'
      : emp.onboardingStatus === 'Done';
    const q = search.toLowerCase();
    const matchSearch = !search
      || emp.name?.toLowerCase().includes(q)
      || emp.empId?.toLowerCase().includes(q)
      || emp.designation?.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const pendingCount    = employees.filter(e => e.onboardingStatus !== 'Done').length;
  const completedCount  = employees.filter(e => e.onboardingStatus === 'Done').length;
  const docPendingCount = employees.filter(e => e.documents?.some(d => d.status === 'Pending')).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Onboarding</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage document verification, share onboarding links, and track completion.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: <Clock size={20} className="text-orange-600" />, bg: 'bg-orange-100', label: 'Active Onboardings', value: pendingCount },
          { icon: <AlertCircle size={20} className="text-yellow-600" />, bg: 'bg-yellow-100', label: 'Docs Pending Review', value: docPendingCount },
          { icon: <CheckCircle2 size={20} className="text-green-600" />, bg: 'bg-green-100', label: 'Completed', value: completedCount },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 ${s.bg} rounded-full flex items-center justify-center shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">{s.label}</p>
              <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 p-3 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Active ({pendingCount})
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Completed ({completedCount})
          </button>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID or roleÃ¢â‚¬Â¦"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-500 font-semibold">Loading onboarding dataÃ¢â‚¬Â¦</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No {tab === 'active' ? 'active' : 'completed'} onboardings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(emp => (
            <EmployeeCard key={emp._id} emp={emp} token={token} onRefresh={fetchData} />
          ))}
        </div>
      )}
    </div>
  );
}

