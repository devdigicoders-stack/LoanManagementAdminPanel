import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  UserCheck, Users, Clock, CheckCircle2, AlertCircle, RefreshCw, 
  Search, Filter, ChevronRight, Building2, MapPin, Eye, Info,
  UserPlus, X
} from 'lucide-react';
import TablePagination from '../../components/TablePagination';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

export default function HiringRequestsTracking() {
  const rawRole = (localStorage.getItem('userRole') || '').trim().toLowerCase();
  const cleanRole = rawRole.replace(/[^a-z0-9]/g, '');
  const isReadOnlyAdmin = ['superadmin', 'admin', 'administrator', 'super_admin'].includes(cleanRole) || rawRole.includes('super admin') || rawRole === 'admin';

  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Hiring Request Modal State
  const [showHiringModal, setShowHiringModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [hiringForm, setHiringForm] = useState({
    zone: 'NORTH',
    role: 'RO',
    requiredCount: 5,
    notes: '',
    priority: 'High'
  });

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const handleSendHiringRequest = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await axios.post(`${API_BASE}/sales/hiring-request`, hiringForm, authHeader);
      if (res.data.success) {
        toast.success(res.data.message);
        setShowHiringModal(false);
        setHiringForm({
          zone: 'NORTH',
          role: 'RO',
          requiredCount: 5,
          notes: '',
          priority: 'High'
        });
        fetchRequisitions();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit hiring requisition');
    } finally {
      setActionLoading(false);
    }
  };

  const fetchRequisitions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedZone !== 'ALL') params.append('zone', selectedZone);
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);

      const res = await axios.get(`${API_BASE}/sales/hiring-requests?${params.toString()}`, authHeader);
      if (res.data.success) {
        setRequisitions(res.data.requisitions || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load hiring requests data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisitions();
  }, [selectedZone, selectedStatus]);

  const filteredList = requisitions.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.role && item.role.toLowerCase().includes(q)) ||
      (item.zone && item.zone.toLowerCase().includes(q)) ||
      (item.reqId && item.reqId.toLowerCase().includes(q)) ||
      (item.status && item.status.toLowerCase().includes(q))
    );
  });

  // Calculate totals
  const totalDemanded = requisitions.reduce((acc, curr) => acc + (curr.requiredCount || 0), 0);
  const totalHired = requisitions.reduce((acc, curr) => acc + (curr.liveHiredCount || curr.hiredCount || 0), 0);
  const pendingCount = requisitions.filter(r => r.status === 'Pending').length;
  const inProcessCount = requisitions.filter(r => r.status === 'In-Process').length;

  const getStatusBadge = (status, requiredCount, hiredCount) => {
    const isComplete = hiredCount >= requiredCount && requiredCount > 0;
    if (isComplete || status === 'Fulfilled') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
          <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
          Fulfilled ({hiredCount}/{requiredCount})
        </span>
      );
    }
    if (status === 'In-Process' || (hiredCount > 0 && hiredCount < requiredCount)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
          <Clock size={13} className="shrink-0 text-blue-600" />
          In-Process ({hiredCount}/{requiredCount})
        </span>
      );
    }
    if (status === 'Closed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
          Closed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
        <Clock size={13} className="shrink-0 text-amber-600" />
        Pending HR ({hiredCount}/{requiredCount})
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">Urgent</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-700 border border-amber-200">High</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">{priority || 'Normal'}</span>;
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">
              Staff Hiring Status
            </span>
            <span className="text-xs text-slate-500 font-medium">HR Hiring Tracking Panel</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Zonal Staff Hiring Demands
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track hiring requisitions submitted to HR across all zones, monitoring headcount requirements and onboarding progress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isReadOnlyAdmin && (
            <button
              onClick={() => setShowHiringModal(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <UserPlus size={15} />
              Request Staff Hiring
            </button>
          )}
          <button
            onClick={fetchRequisitions}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Requests</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><UserCheck size={18} /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{requisitions.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Total demand posts submitted</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Requirement</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Users size={18} /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalDemanded}</div>
          <div className="text-[11px] text-slate-400 mt-1">Total headcount demanded</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase">Positions Fulfilled</span>
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl"><CheckCircle2 size={18} /></span>
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-2">{totalHired}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Onboarded by HR</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase">Open / In-Process</span>
            <span className="p-2 bg-amber-100 text-amber-700 rounded-xl"><Clock size={18} /></span>
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2">{pendingCount + inProcessCount}</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">Recruitment in progress</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Role, Zone, ID..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600 bg-slate-50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Zone Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-600 pl-2">Zone:</span>
            {['ALL', 'NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL'].map((z) => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedZone === z
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {z}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In-Process">In-Process</option>
            <option value="Fulfilled">Fulfilled</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-700">
              Total {filteredList.length} Hiring Demand Entries
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Note: HR Department conducts screening and finalizes onboarding
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[11px]">
              <tr className="whitespace-nowrap">
                <th className="px-5 py-3.5 whitespace-nowrap">Req ID</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Zone</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Designation / Role</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Priority</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Required</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Hired</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Hiring Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Request Date</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Remarks / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400 whitespace-nowrap">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading hiring requests...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-slate-400 whitespace-nowrap">
                    <UserCheck size={32} className="mx-auto mb-2 text-slate-300" />
                    No hiring requisitions found for this selection.
                  </td>
                </tr>
              ) : (
                filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => {
                  const hired = item.liveHiredCount || item.hiredCount || 0;
                  const reqCount = item.requiredCount || 1;
                  const percentage = Math.min(100, Math.round((hired / reqCount) * 100));

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition group whitespace-nowrap">
                      <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {item.reqId || `REQ-${item._id?.slice(-5)}`}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md font-black bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] whitespace-nowrap">
                          {item.zone}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-sm whitespace-nowrap">{item.role}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getPriorityBadge(item.priority)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-extrabold text-slate-900 text-sm whitespace-nowrap">
                          {reqCount}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className={`font-black text-sm ${hired >= reqCount ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {hired}
                          </span>
                          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden shrink-0">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                hired >= reqCount ? 'bg-emerald-500' : 'bg-indigo-600'
                              }`} 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400">{percentage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getStatusBadge(item.status, reqCount, hired)}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-[11px] whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate whitespace-nowrap" title={item.notes}>
                        {item.notes || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalItems={filteredList.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        />

      </div>

      {/* Request Staff Hiring Modal */}
      {showHiringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <UserPlus size={20} />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Request Staff Hiring</h3>
                  <p className="text-xs text-slate-500">Submit new headcount requirement to HR Department</p>
                </div>
              </div>
              <button onClick={() => setShowHiringModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendHiringRequest} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Zone</label>
                  <select
                    value={hiringForm.zone}
                    onChange={(e) => setHiringForm({ ...hiringForm, zone: e.target.value })}
                    className="w-full border rounded-xl p-2.5 bg-slate-50 font-medium"
                  >
                    {['NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL'].map(z => (
                      <option key={z} value={z}>{z} Zone</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={hiringForm.priority}
                    onChange={(e) => setHiringForm({ ...hiringForm, priority: e.target.value })}
                    className="w-full border rounded-xl p-2.5 bg-slate-50 font-medium"
                  >
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent (Immediate)</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role / Designation</label>
                  <select
                    value={hiringForm.role}
                    onChange={(e) => setHiringForm({ ...hiringForm, role: e.target.value })}
                    className="w-full border rounded-xl p-2.5 bg-slate-50 font-medium"
                  >
                    <option value="RO">RO (Relationship Officer)</option>
                    <option value="RE">RE (Relationship Executive)</option>
                    <option value="Telecaller">Telecaller / Calling Agent</option>
                    <option value="RM">RM (Reporting Manager)</option>
                    <option value="ARM">ARM (Area Manager)</option>
                    <option value="RRM">RRM (Regional Manager)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Required Count</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={hiringForm.requiredCount}
                    onChange={(e) => setHiringForm({ ...hiringForm, requiredCount: parseInt(e.target.value) || 1 })}
                    className="w-full border rounded-xl p-2.5 bg-slate-50 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location Details & Notes for HR</label>
                <textarea
                  rows="3"
                  value={hiringForm.notes}
                  onChange={(e) => setHiringForm({ ...hiringForm, notes: e.target.value })}
                  placeholder="e.g. Need 5 ROs for Lucknow & Kanpur branch field collection & sourcing..."
                  className="w-full border rounded-xl p-2.5 bg-slate-50 font-medium"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowHiringModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow"
                >
                  {actionLoading ? 'Submitting...' : 'Post Requisition to HR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
