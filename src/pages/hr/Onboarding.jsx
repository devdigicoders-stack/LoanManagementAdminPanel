import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck, UserCheck, FileText, CheckCircle2, Clock, Search,
  Link2, RefreshCw, ChevronDown, ChevronUp, AlertCircle,
  Users, Eye, Shield, CheckSquare, Phone, X, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const API = `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}`;

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

function EmployeeTableRow({ emp, token, onRefresh, onOpenAssignChaser }) {
  const [expanded, setExpanded] = useState(false);
  const [updatingDoc, setUpdatingDoc] = useState(null);
  const [markingDone, setMarkingDone] = useState(false);
  const step = calcStep(emp);
  const completion = Math.round((step / 4) * 100);

  const copyLink = () => {
    const link = `${window.location.origin.replace('5173', '5173')}/onboarding/${emp._id}`;
    navigator.clipboard.writeText(link).then(() => toast.success('Onboarding link copied!')).catch(() => {
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
    <React.Fragment>
      <tr className="hover:bg-blue-50/30 transition-colors border-b border-gray-100">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {emp.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-900">{emp.name}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{emp.designation} &middot; {emp.division || 'General'}</p>
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

        <td className="px-4 py-3 align-top space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-500 w-12">HR:</span>
            {emp.assignedHRName ? (
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                {emp.assignedHRName.split(' ')[0]}
              </span>
            ) : (
              <span className="text-[11px] text-gray-400 italic">Unassigned</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-500 w-12">Chaser:</span>
            {emp.assignedTelecallerName ? (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100" title={emp.telecallerChaserNotes || ''}>
                <Phone size={10} /> {emp.assignedTelecallerName.split(' ')[0]}
              </div>
            ) : (
              <span className="text-[11px] text-gray-400 italic">Unassigned</span>
            )}
          </div>
        </td>

        <td className="px-4 py-3 align-top">
          <div className="flex flex-wrap items-center gap-1.5 max-w-[220px]">
            {emp.onboardingStatus !== 'Done' && (
              <button onClick={() => onOpenAssignChaser(emp)} className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-700 border border-indigo-200 bg-indigo-50 rounded hover:bg-indigo-100">
                <Phone size={10} /> {emp.assignedTelecallerName ? 'Reassign' : 'Assign Chaser'}
              </button>
            )}
            {emp.onboardingStatus === 'Pending' && (
              <button onClick={async () => {
                toast.loading('Sending reminder...', { id: 'remind' });
                try {
                  const res = await fetch(`${API}/api/employees/${emp._id}/remind-employee`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
                  if (res.ok) toast.success('Reminder email sent!', { id: 'remind' });
                  else toast.error('Failed to send reminder', { id: 'remind' });
                } catch { toast.error('Server error', { id: 'remind' }); }
              }} className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-orange-600 border border-orange-200 bg-orange-50 rounded hover:bg-orange-100">
                <AlertCircle size={10} /> Reminder
              </button>
            )}
            <button onClick={copyLink} className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-600 border border-blue-200 bg-blue-50 rounded hover:bg-blue-100">
              <Link2 size={10} /> Link
            </button>
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gray-600 border border-gray-200 bg-gray-50 rounded hover:bg-gray-100">
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />} {expanded ? 'Hide Docs' : 'View Docs'}
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Row */}
      {expanded && (
        <tr className="bg-blue-50/20 border-b border-gray-100">
          <td colSpan={4} className="p-0">
            <div className="p-4 border-l-[3px] border-blue-400 pl-5 ml-4 my-2 mr-4 bg-white rounded-r-lg shadow-sm">
              <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText size={12} className="text-gray-400" /> Submitted Documents
              </h4>

              {emp.documents && emp.documents.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {emp.documents.map(doc => (
                    <div key={doc._id} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md px-3 py-2 gap-2 max-w-2xl">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText size={12} className="text-blue-400 shrink-0" />
                        <span className="text-[11px] font-semibold text-gray-800 truncate">{DOC_LABEL[doc.key] || doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {doc.fileUrl && (
                          <a href={`${API}/${doc.fileUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 text-[10px] font-bold flex items-center gap-1">
                            <Eye size={10} /> View
                          </a>
                        )}
                        <DocStatusBadge status={doc.status} />
                        {doc.status !== 'Verified' && (
                          <button disabled={updatingDoc === doc._id} onClick={() => handleDocStatus(doc._id, 'Verified')} className="text-[10px] font-bold text-green-700 bg-green-100 hover:bg-green-200 px-2 py-0.5 rounded disabled:opacity-50">
                            Verify
                          </button>
                        )}
                        {doc.status !== 'Rejected' && doc.status !== 'Verified' && (
                          <button disabled={updatingDoc === doc._id} onClick={() => handleDocStatus(doc._id, 'Rejected')} className="text-[10px] font-bold text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded disabled:opacity-50">
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 italic mb-3">No documents uploaded yet.</p>
              )}

              {emp.onboardingStatus !== 'Done' && (
                <button
                  onClick={markComplete}
                  disabled={markingDone || step < 3}
                  className="w-full max-w-2xl flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <CheckSquare size={13} />
                  {markingDone ? 'Saving...' : 'Mark Onboarding as Complete'}
                </button>
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
  const [tab, setTab] = useState('active');
  const [search, setSearch] = useState('');
  const [telecallers, setTelecallers] = useState([]);
  const [chaserModal, setChaserModal] = useState({ isOpen: false, employee: null, selectedTelecallerId: '', notes: '' });
  const [isSubmittingChaser, setIsSubmittingChaser] = useState(false);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, staffRes] = await Promise.all([
        fetch(`${API}/api/employees`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/employees/assignable-staff`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (empRes.ok) {
        const data = await empRes.json();
        if (Array.isArray(data)) setEmployees(data);
      } else {
        toast.error('Failed to fetch onboarding data');
      }

      if (staffRes.ok) {
        const staff = await staffRes.json();
        setTelecallers(staff.telecallers || []);
      }
    } catch {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveChaser = async () => {
    if (!chaserModal.employee) return;
    setIsSubmittingChaser(true);
    try {
      const selectedObj = telecallers.find(t => t._id === chaserModal.selectedTelecallerId);
      const res = await fetch(`${API}/api/employees/${chaserModal.employee._id}/assign-onboarding-chaser`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          telecallerId: chaserModal.selectedTelecallerId || null,
          telecallerName: selectedObj ? selectedObj.name : null,
          notes: chaserModal.notes
        })
      });

      if (res.ok) {
        toast.success(selectedObj ? `Assigned to Telecaller ${selectedObj.name}` : 'Chaser unassigned');
        fetchData();
        setChaserModal({ isOpen: false, employee: null, selectedTelecallerId: '', notes: '' });
      } else {
        toast.error('Failed to assign telecaller');
      }
    } catch {
      toast.error('Server error');
    } finally {
      setIsSubmittingChaser(false);
    }
  };

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
            Manage document verification, delegate pending candidates to telecallers, and track completion.
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
          <p className="font-semibold">No {tab === 'active' ? 'active' : 'completed'} onboardings found.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status & Progress</th>
                  <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Assignments</th>
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
                    onOpenAssignChaser={(candidate) => setChaserModal({
                      isOpen: true,
                      employee: candidate,
                      selectedTelecallerId: candidate.assignedTelecallerId || '',
                      notes: candidate.telecallerChaserNotes || ''
                    })}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Assign Telecaller Chaser */}
      {chaserModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Phone size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Assign Onboarding Chaser</h3>
                  <p className="text-[11px] text-gray-500">Delegate document follow-up to a telecaller</p>
                </div>
              </div>
              <button 
                onClick={() => setChaserModal({ isOpen: false, employee: null, selectedTelecallerId: '', notes: '' })}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/70">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-900">{chaserModal.employee?.name}</p>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {chaserModal.employee?.onboardingStatus}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 font-mono mt-0.5">Mobile: {chaserModal.employee?.mobile || 'N/A'}</p>
                <p className="text-[11px] text-gray-400">{chaserModal.employee?.email}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Telecaller
                </label>
                <select
                  value={chaserModal.selectedTelecallerId}
                  onChange={(e) => setChaserModal(prev => ({ ...prev, selectedTelecallerId: e.target.value }))}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:border-indigo-400 font-medium"
                >
                  <option value="">-- Select Telecaller (Or Unassign) --</option>
                  {telecallers.map(t => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.role || 'Telecaller'}{t.mobile ? ` - ${t.mobile}` : ''})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Follow-up Instructions / Notes
                </label>
                <textarea
                  rows={3}
                  value={chaserModal.notes}
                  onChange={(e) => setChaserModal(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Call candidate to submit Aadhaar & cancelled cheque by 5 PM."
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:border-indigo-400 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setChaserModal({ isOpen: false, employee: null, selectedTelecallerId: '', notes: '' })}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                disabled={isSubmittingChaser}
                onClick={handleSaveChaser}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow transition-colors disabled:opacity-50"
              >
                {isSubmittingChaser ? 'Saving...' : 'Assign Telecaller'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

