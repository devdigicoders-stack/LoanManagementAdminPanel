import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  AlertTriangle, Phone, Clock, MessageSquare, CheckCircle2, 
  XCircle, User, Building, IndianRupee, RefreshCw, Filter, ArrowLeft, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TablePagination from '../../components/TablePagination';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

export default function HoldEscalationDesk() {
  const navigate = useNavigate();
  const rawRole = (localStorage.getItem('userRole') || '').trim().toLowerCase();
  const cleanRole = rawRole.replace(/[^a-z0-9]/g, '');

  const [selectedZone, setSelectedZone] = useState('ALL');
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchEscalations = async () => {
    try {
      setLoading(true);
      const zoneParam = selectedZone !== 'ALL' ? `?zone=${selectedZone}` : '';
      const res = await axios.get(`${API_BASE}/sales/hold-escalations${zoneParam}`, authHeader);
      if (res.data.success) {
        setEscalations(res.data.escalations || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load HOLD escalations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalations();
  }, [selectedZone]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700 text-white p-6 rounded-2xl shadow-sm border border-rose-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 rounded-xl">
              <AlertTriangle className="text-amber-200" size={22} />
            </span>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-rose-900/60 rounded-full border border-rose-400 text-rose-100">
              Hold Cases Live Radar
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-2">
            Customer Hold Tracking Desk
          </h1>
          <p className="text-sm text-rose-100 max-w-2xl mt-1">
            Real-time tracking of loan offers held by customers. Assigned Reporting Managers (RM) and Field Officers (RO/RE) manage customer communication directly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/sales/dashboard')}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition backdrop-blur-sm"
          >
            <ArrowLeft size={16} /> Sales Dashboard
          </button>
          <button
            onClick={fetchEscalations}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filter, View Toggle and Counter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Select Zone:</span>
          {['ALL', 'NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL'].map(z => (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                selectedZone === z
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {z}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                viewMode === 'table' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                viewMode === 'cards' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Card View
            </button>
          </div>
          <div className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 whitespace-nowrap">
            Total {escalations.length} Active Hold Case(s)
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[11px]">
                <tr className="whitespace-nowrap">
                  <th className="px-5 py-3.5 whitespace-nowrap">Customer & Contact</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Product & Loan Amount</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Zone & Managing RM / RO</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Hold Reason Selected in App</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Hold Trigger Date</th>
                  <th className="px-5 py-3.5 text-right whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400 whitespace-nowrap">
                      <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-rose-500" />
                      Loading hold cases...
                    </td>
                  </tr>
                ) : escalations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400 whitespace-nowrap">
                      <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-2" />
                      <div className="text-sm font-bold text-slate-800">No cases on Hold!</div>
                      <p className="text-xs text-slate-500 mt-1">All loan files are moving smoothly through the pipeline.</p>
                    </td>
                  </tr>
                ) : (
                  escalations.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((esc) => (
                    <tr key={esc._id} className="hover:bg-rose-50/30 transition whitespace-nowrap">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{esc.customerName}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone size={11} className="text-slate-400 shrink-0" /> {esc.mobile}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{esc.product || 'Personal Loan'}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-rose-600 font-extrabold">
                            ₹{Number(esc.loanAmount || 0).toLocaleString()}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-black px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-[11px]">
                            {esc.zone} ZONE
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 text-[11px]">Managing RM: <strong className="text-slate-900">{esc.rmName || 'Assigned RM'}</strong></span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 text-[11px]">Field RO: <strong className="text-slate-900">{esc.reRoName || 'Field Officer'}</strong></span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold" title={esc.holdReason}>
                          {esc.holdReason}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-[11px] text-slate-500 font-mono">
                        {esc.holdAt ? new Date(esc.holdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-rose-700 bg-rose-100 border border-rose-300 px-3 py-1.5 rounded-lg animate-pulse whitespace-nowrap">
                          <AlertTriangle size={13} className="text-rose-600" />
                          <span>RM / RO Re-engaging Customer</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <TablePagination
            currentPage={currentPage}
            totalItems={escalations.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => setPageSize(size)}
          />

        </div>
      ) : (
        /* CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {escalations.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
              <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-3" />
              <div className="text-base font-bold text-slate-800">No cases on Hold!</div>
              <p className="text-xs text-slate-500 mt-1">All loan files are moving smoothly through the pipeline.</p>
            </div>
          ) : (
            escalations.map((esc) => (
              <div
                key={esc._id}
                className="bg-white rounded-2xl border border-rose-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-4 bg-rose-50/60 border-b border-rose-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                    <span className="text-xs font-bold text-rose-900 uppercase">
                      {esc.zone} Zone
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    Hold Date: {new Date(esc.holdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <div className="text-base font-bold text-slate-900">{esc.customerName}</div>
                    <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone size={12} /> {esc.mobile} • <span className="font-semibold text-slate-700">{esc.product}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="text-[10px] font-bold uppercase text-amber-800">Customer Hold Reason</div>
                    <div className="font-semibold text-amber-950 mt-0.5">{esc.holdReason}</div>
                  </div>

                  {/* Responsible Hierarchy Box */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Assigned Team Managing Case:</div>
                    <div className="text-slate-700"><strong>Regional Manager (RRM):</strong> {esc.rrmName || 'Not Assigned'}</div>
                    <div className="text-slate-700"><strong>Area Manager (ARM):</strong> {esc.armName || 'Not Assigned'}</div>
                    <div className="text-slate-700"><strong>Reporting Manager (RM):</strong> {esc.rmName || 'Not Assigned'}</div>
                    <div className="text-slate-900 font-bold"><strong>Field Officer (RO/RE):</strong> {esc.reRoName || 'Not Assigned'}</div>
                  </div>
                </div>

                {/* Status Footer */}
                <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Amount: <strong className="text-slate-900">₹{Number(esc.loanAmount || 0).toLocaleString()}</strong></span>
                  <span className="text-xs font-bold text-rose-700">Under RM / RO Follow-up</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
