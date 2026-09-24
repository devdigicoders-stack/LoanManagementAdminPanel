import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, CheckCircle2, ShieldCheck, XCircle, Clock, 
  RefreshCw, Search, Send, User, Phone, Check, 
  MapPin, AlertCircle, FileCheck, X, Eye, FileText, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import TablePagination from '../../components/TablePagination';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

export default function FileApprovalsDesk() {
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Approval Modal (Sales Head approves so Operations can dispatch)
  const [selectedLeadForApproval, setSelectedLeadForApproval] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState('');

  // Query / Return Modal
  const [selectedLeadForQuery, setSelectedLeadForQuery] = useState(null);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [queryRemarks, setQueryRemarks] = useState('');

  // Document Viewer Modal
  const [selectedLeadForDocs, setSelectedLeadForDocs] = useState(null);
  const [showDocsModal, setShowDocsModal] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const isReadOnlyAdmin = ['superadmin', 'admin'].includes(user?.role?.toLowerCase()) && !['saleshead', 'sales head'].includes(user?.role?.toLowerCase());

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const zoneParam = selectedZone !== 'ALL' ? `?zone=${selectedZone}` : '';
      const res = await axios.get(`${API_BASE}/sales/pending-approvals${zoneParam}`, authHeader);
      if (res.data.success) {
        setPendingApprovals(res.data.files || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load pending approval files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [selectedZone]);

  const handleOpenApprovalModal = (file) => {
    setSelectedLeadForApproval(file);
    setApprovalRemarks(`File verified & approved by Sales Head. Eligible for Operations to dispatch to partner banks.`);
    setShowApprovalModal(true);
  };

  const handleConfirmApproval = async (e) => {
    e.preventDefault();
    if (!selectedLeadForApproval) return;

    try {
      setActionLoading(true);
      const res = await axios.put(
        `${API_BASE}/sales/${selectedLeadForApproval._id}/approve-file`,
        { remarks: approvalRemarks },
        authHeader
      );

      if (res.data.success) {
        toast.success(`File successfully approved! Operation Manager can now dispatch to partner bank.`);
        setShowApprovalModal(false);
        setSelectedLeadForApproval(null);
        fetchApprovals();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectFile = async () => {
    if (!selectedLeadForQuery || !queryRemarks.trim()) {
      toast.error('Please enter query/feedback remarks');
      return;
    }
    try {
      setActionLoading(true);
      const res = await axios.put(`${API_BASE}/sales/${selectedLeadForQuery._id}/reject-file`, {
        remarks: queryRemarks
      }, authHeader);

      if (res.data.success) {
        toast.success('File returned to Operations with query remarks.');
        setShowQueryModal(false);
        setSelectedLeadForQuery(null);
        setQueryRemarks('');
        fetchApprovals();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredFiles = pendingApprovals.filter(file => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (file.name && file.name.toLowerCase().includes(q)) ||
      (file.mobile && file.mobile.includes(q)) ||
      (file.leadId && file.leadId.toLowerCase().includes(q)) ||
      (file.productSubtype && file.productSubtype.toLowerCase().includes(q)) ||
      (file.zone && file.zone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 md:p-8 max-w-[1500px] mx-auto min-h-screen bg-slate-50/50 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
            <ShieldCheck size={16} /> Sales Head Verification Desk
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sales Head File Approval Desk
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Review completed KYC dossiers from Operations. Once approved by you, the Operation Manager will forward the file to partner banks.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchApprovals}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Awaiting Your Approval</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{pendingApprovals.length}</div>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Workflow Next Step</div>
            <div className="text-sm font-black text-slate-800 mt-1">Operation Manager Dispatch</div>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
            <Send size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role Authority</div>
            <div className="text-sm font-black text-emerald-700 mt-1">Sales Head Official Sign-Off</div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Zone Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1 shrink-0">
            <MapPin size={14} className="text-blue-800" /> Filter Zone:
          </span>
          {['ALL', 'NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL'].map(zone => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedZone === zone
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {zone === 'ALL' ? 'Pan-India (All)' : `${zone} Zone`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search borrower, mobile, lead ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
          />
        </div>
      </div>

      {/* Approvals Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">Pending Dossiers for Sales Head Sanction Approval</h2>
            <p className="text-xs text-slate-400 font-medium">Verify credit readiness & approve for bank dispatch by Operations</p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            {filteredFiles.length} Files Pending
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                <th className="py-3.5 px-5">Borrower Profile</th>
                <th className="py-3.5 px-4">Loan Amount</th>
                <th className="py-3.5 px-4">Zone & Ownership</th>
                <th className="py-3.5 px-4">Customer KYC</th>
                <th className="py-3.5 px-4">Stage Status</th>
                <th className="py-3.5 px-5 text-right">Approval Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 whitespace-nowrap">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-amber-500" />
                    Loading files...
                  </td>
                </tr>
              ) : filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 whitespace-nowrap">
                    <FileCheck size={40} className="mx-auto text-emerald-500 mb-2" />
                    <div className="text-sm font-bold text-slate-800">All files approved!</div>
                    <p className="text-xs text-slate-500 mt-1">No pending loan files requiring Sales Head approval at this time.</p>
                  </td>
                </tr>
              ) : (
                filteredFiles.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((file) => (
                  <tr key={file._id} className="hover:bg-slate-50/80 transition group whitespace-nowrap">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{file.name}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Phone size={11} className="text-slate-400 shrink-0" /> {file.mobile}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {file.leadId || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{file.productSubtype || file.productCategory || 'Personal Loan'}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-emerald-600 font-extrabold">
                          ₹{Number(file.expectedAmount || file.loanAmount || 0).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-black px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-[11px]">
                          {file.zone || 'NORTH'} ZONE
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 text-[11px]">
                          RM: <strong className="text-slate-700">{file.rmName || 'Assigned'}</strong>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                      <button
                        onClick={() => {
                          setSelectedLeadForDocs(file);
                          setShowDocsModal(true);
                        }}
                        className="text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-md font-bold border border-purple-200 inline-flex items-center gap-1 whitespace-nowrap cursor-pointer transition"
                      >
                        <FileText size={12} /> View Uploaded Docs ({(file.documents || []).length})
                      </button>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">
                        Awaiting Sales Head Approval
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {isReadOnlyAdmin ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
                          <Eye size={13} /> Monitored by Admin
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={actionLoading}
                            onClick={() => handleOpenApprovalModal(file)}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <CheckCircle2 size={13} /> Approve File &rarr;
                          </button>
                          <button
                            disabled={actionLoading}
                            onClick={() => {
                              setSelectedLeadForQuery(file);
                              setShowQueryModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 text-rose-600 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <X size={14} /> Raise Query
                          </button>
                        </div>
                      )}
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
          totalItems={filteredFiles.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        />

      </div>

      {/* Modal 1: Approve File (Sales Head Official Approval) */}
      {showApprovalModal && selectedLeadForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Approve Loan File</h3>
                  <p className="text-xs text-slate-500">Official Sales Head Sign-Off</p>
                </div>
              </div>
              <button onClick={() => setShowApprovalModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmApproval} className="space-y-4 text-xs">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="font-black text-sm text-emerald-950">{selectedLeadForApproval.name} ({selectedLeadForApproval.mobile})</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">{selectedLeadForApproval.leadId} &bull; {selectedLeadForApproval.zone} Zone</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">Amount</div>
                  <div className="text-sm font-black text-emerald-800">₹{Number(selectedLeadForApproval.expectedAmount || selectedLeadForApproval.loanAmount || 0).toLocaleString()}</div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sales Head Sanction Remarks *</label>
                <textarea
                  rows="3"
                  required
                  value={approvalRemarks}
                  onChange={(e) => setApprovalRemarks(e.target.value)}
                  placeholder="e.g. KYC & Banking documents verified. Fit for immediate bank dispatch by Operations..."
                  className="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 font-medium text-xs resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 font-medium leading-relaxed">
                <b>Workflow Next Step:</b> Upon approval, this file will become immediately available on the <b>Operations Desk (Stage 2: Ready to Send to Bank)</b>, where the Operation Manager will select the partner bank and dispatch via Email/WhatsApp.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Confirm Sales Head Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Query / Return Modal */}
      {showQueryModal && selectedLeadForQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Raise Query on File</h3>
                <p className="text-xs text-slate-500">File returned to Operations team with feedback</p>
              </div>
              <button onClick={() => setShowQueryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div className="font-bold text-amber-900">{selectedLeadForQuery.name} ({selectedLeadForQuery.mobile})</div>
                <div className="text-amber-700 mt-0.5">Amount: ₹{Number(selectedLeadForQuery.expectedAmount || 0).toLocaleString()}</div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Query / Reason for Return</label>
                <textarea
                  rows="4"
                  value={queryRemarks}
                  onChange={(e) => setQueryRemarks(e.target.value)}
                  placeholder="e.g. Bank statement 6 months missing, please re-verify customer ITR..."
                  className="w-full border rounded-xl p-2.5 bg-slate-50 font-medium text-xs resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowQueryModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleRejectFile}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow cursor-pointer"
                >
                  {actionLoading ? 'Returning...' : 'Return File to Operations'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: View Customer Uploaded Documents */}
      {showDocsModal && selectedLeadForDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Customer Uploaded Documents</h3>
                  <p className="text-xs text-slate-500">{selectedLeadForDocs.name} &bull; {selectedLeadForDocs.leadId}</p>
                </div>
              </div>
              <button onClick={() => setShowDocsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {(!selectedLeadForDocs.documents || selectedLeadForDocs.documents.length === 0) ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <FileCheck size={36} className="mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-600">Digital KYC Verified</p>
                  <p className="text-xs text-slate-400 mt-1">Aadhaar (Front + Back), PAN Card, and 6-Month Bank Statement verified by Operations Desk.</p>
                </div>
              ) : (
                selectedLeadForDocs.documents.map((doc, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                        <FileText size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{doc.name || `Document #${idx + 1}`}</div>
                        <div className="text-[10px] text-slate-400">{doc.type || 'KYC / Income Proof'}</div>
                      </div>
                    </div>
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold"
                      >
                        View File
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setShowDocsModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
