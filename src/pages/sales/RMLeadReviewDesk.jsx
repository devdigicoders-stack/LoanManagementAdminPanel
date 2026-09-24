import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Clock,
  CheckCircle,
  X,
  Send,
  RefreshCw,
  Search,
  PhoneCall,
  User,
  ShieldCheck,
  FileText,
  AlertCircle,
  Filter,
  Check,
  Eye,
  MapPin,
  CreditCard,
  Building,
  Phone,
  Mail,
  Calendar,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import TablePagination from '../../components/TablePagination';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

export default function RMLeadReviewDesk() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterZone, setFilterZone] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals State
  const [selectedLead, setSelectedLead] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState('Approved');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchPendingLeads = useCallback(async () => {
    try {
      setLoading(true);
      const url = filterZone !== 'ALL' 
        ? `${API_BASE}/sales/rm-leads?stage=pending&zone=${filterZone}&limit=100`
        : `${API_BASE}/sales/rm-leads?stage=pending&limit=100`;
      const res = await axios.get(url, getHeaders());
      if (res.data.success) {
        let fetchedLeads = res.data.leads || [];
        // If pending leads are 0, try fetching active leads from /api/sales/rm-leads?stage=all or /api/leads
        if (fetchedLeads.length === 0) {
          try {
            const fallbackUrl = filterZone !== 'ALL'
              ? `${API_BASE}/sales/rm-leads?stage=all&zone=${filterZone}&limit=100`
              : `${API_BASE}/sales/rm-leads?stage=all&limit=100`;
            const fbRes = await axios.get(fallbackUrl, getHeaders());
            if (fbRes.data.success && fbRes.data.leads?.length > 0) {
              fetchedLeads = fbRes.data.leads;
            } else {
              // Direct fallback to /api/leads
              const leadsUrl = filterZone !== 'ALL' ? `${API_BASE}/leads?zone=${filterZone}` : `${API_BASE}/leads`;
              const directRes = await axios.get(leadsUrl, getHeaders());
              if (Array.isArray(directRes.data) && directRes.data.length > 0) {
                fetchedLeads = directRes.data.map(l => ({
                  ...l,
                  name: l.name || l.customName || 'Customer',
                  mobile: l.mobile || l.mobNo || '',
                  expectedAmount: l.expectedAmount || l.loanAmount || 0,
                  zone: l.zone || 'NORTH'
                }));
              }
            }
          } catch (e) {
            console.log('Fallback query info:', e);
          }
        }
        setLeads(fetchedLeads);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load pending leads');
    } finally {
      setLoading(false);
    }
  }, [filterZone]);

  useEffect(() => {
    fetchPendingLeads();
  }, [fetchPendingLeads]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLead) return;
    try {
      setSubmitting(true);
      const res = await axios.put(
        `${API_BASE}/sales/${selectedLead._id}/rm-review`,
        { action: reviewAction, remarks: reviewRemarks },
        getHeaders()
      );
      if (res.data.success) {
        toast.success(res.data.message || 'Lead review updated!');
        setReviewModalOpen(false);
        setSelectedLead(null);
        setReviewRemarks('');
        fetchPendingLeads();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.mobile && l.mobile.includes(q)) ||
      (l.leadId && l.leadId.toLowerCase().includes(q)) ||
      (l.entityName && l.entityName.toLowerCase().includes(q)) ||
      (l.city && l.city.toLowerCase().includes(q)) ||
      (l.panNumber && l.panNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Zone-Wise Lead Review Desk</h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Review full customer profile &bull; Verify loan requirements &bull; Forward approved files to Telecaller
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPendingLeads}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs md:text-sm transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Leads
          </button>
        </div>
      </div>

      {/* ── STAT SUMMARY BAR ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting RM Review ({filterZone})</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-3xl font-black text-blue-600">{filteredLeads.length}</p>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Action Required
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Zonal Coverage</p>
          <p className="text-base font-black text-slate-800 mt-2">{filterZone === 'ALL' ? 'All Active Zones' : `${filterZone} Zone`}</p>
          <p className="text-xs text-slate-500 mt-0.5">Leads routed according to territory hierarchy</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Step on Approval</p>
          <p className="text-base font-black text-indigo-600 mt-2 flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4" /> Telecaller Calling Desk
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Forwarded immediately for customer verification</p>
        </div>
      </div>

      {/* ── FILTER & SEARCH ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lead ID, customer, phone, PAN, city..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs md:text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* Zone Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <span className="text-xs font-bold text-slate-500 pl-1">Zone:</span>
              <select
                value={filterZone}
                onChange={(e) => setFilterZone(e.target.value)}
                className="bg-transparent text-slate-800 text-xs md:text-sm font-bold focus:outline-none cursor-pointer py-1.5 pr-2"
              >
                <option value="ALL">All Zones</option>
                <option value="NORTH">NORTH Zone</option>
                <option value="SOUTH">SOUTH Zone</option>
                <option value="EAST">EAST Zone</option>
                <option value="WEST">WEST Zone</option>
                <option value="CENTRAL">CENTRAL Zone</option>
              </select>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-500">
            Showing <span className="text-blue-600 font-black">{filteredLeads.length}</span> leads in queue
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-5">Lead ID & Customer</th>
                <th className="py-3.5 px-4">Contact & Location</th>
                <th className="py-3.5 px-4">Loan Requirement</th>
                <th className="py-3.5 px-4">Product / Program</th>
                <th className="py-3.5 px-4">Zone & Source</th>
                <th className="py-3.5 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading review queue...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500/70" />
                    Great job! No pending leads for {filterZone === 'ALL' ? 'any zone' : `${filterZone} zone`}.
                  </td>
                </tr>
              ) : (
                filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/70 transition">
                    {/* Customer */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-800">{lead.name || 'Unnamed'}</div>
                      <div className="text-[11px] font-mono text-blue-600 font-bold">{lead.leadId || 'N/A'}</div>
                      {lead.panNumber && (
                        <div className="text-[10px] text-slate-400 font-mono">PAN: {lead.panNumber}</div>
                      )}
                    </td>

                    {/* Contact & Location */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-700">{lead.mobile || 'N/A'}</div>
                      <div className="text-[11px] text-slate-500">{lead.entityName || 'Individual'}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {lead.city ? `${lead.city}, ${lead.state || ''}` : lead.zone || 'NORTH'}
                      </div>
                    </td>

                    {/* Requirement */}
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-slate-800">
                        ₹{Number(lead.expectedAmount || lead.loanAmount || 0).toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-500">{lead.facilityType || 'Term Loan'}</div>
                    </td>

                    {/* Product & Program */}
                    <td className="py-4 px-4">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[11px] rounded">
                        {lead.productSubtype || lead.productCategory || 'Personal Loan'}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{lead.programType || 'FRESH'}</div>
                    </td>

                    {/* Zone & Source */}
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-[11px] rounded-md border border-blue-100">
                        {lead.zone || 'NORTH'}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">{lead.source || 'Field'}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setDetailModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                          title="View Full Customer Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setReviewAction('Approved');
                            setReviewRemarks('');
                            setReviewModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Review & Forward
                        </button>
                      </div>
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
          totalItems={filteredLeads.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        />

      </div>

      {/* ── MODAL 1: FULL CUSTOMER DETAILS MODAL ── */}
      {detailModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">{selectedLead.name}</h3>
                  <p className="text-xs text-blue-600 font-mono font-bold">ID: {selectedLead.leadId || 'N/A'}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* Section 1: Loan & Financial Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" /> Loan & Financial Request
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Expected Amount</span>
                    <span className="font-extrabold text-slate-800 text-sm">
                      ₹{Number(selectedLead.expectedAmount || selectedLead.loanAmount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Product Type</span>
                    <span className="font-bold text-slate-800">{selectedLead.productSubtype || 'Loan'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Category</span>
                    <span className="font-bold text-slate-800">{selectedLead.productCategory || 'Unsecured'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Program Type</span>
                    <span className="font-bold text-slate-800">{selectedLead.programType || 'FRESH'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Facility Type</span>
                    <span className="font-bold text-slate-800">{selectedLead.facilityType || 'Term Loan'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Constitution</span>
                    <span className="font-bold text-slate-800">{selectedLead.constitutionType || 'Individual'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Identity Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" /> Customer Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Primary Mobile</span>
                    <span className="font-bold text-slate-800">{selectedLead.mobile || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Alt Mobile</span>
                    <span className="font-bold text-slate-800">{selectedLead.altMobile || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Email</span>
                    <span className="font-bold text-slate-800">{selectedLead.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">PAN Number</span>
                    <span className="font-mono font-bold text-slate-800">{selectedLead.panNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Entity Name</span>
                    <span className="font-bold text-slate-800">{selectedLead.entityName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Source / Branch</span>
                    <span className="font-bold text-slate-800">{selectedLead.source || 'Field'} ({selectedLead.branch || 'Main'})</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Territory & Zonal Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" /> Location & Zone Hierarchy
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Assigned Zone</span>
                    <span className="font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded inline-block">
                      {selectedLead.zone || 'NORTH'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">City / District</span>
                    <span className="font-bold text-slate-800">{selectedLead.city || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">State / Pincode</span>
                    <span className="font-bold text-slate-800">{selectedLead.state || ''} {selectedLead.pincode || ''}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDetailModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDetailModalOpen(false);
                    setReviewAction('Approved');
                    setReviewRemarks('');
                    setReviewModalOpen(true);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Review & Forward Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: RM REVIEW DECISION ── */}
      {reviewModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                RM Lead Review & Forward Desk
              </h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600 border border-slate-100">
                <p><strong className="text-slate-800">Customer:</strong> {selectedLead.name} ({selectedLead.mobile})</p>
                <p><strong className="text-slate-800">Requirement:</strong> ₹{Number(selectedLead.expectedAmount || 0).toLocaleString()} &bull; {selectedLead.productSubtype || 'Loan'}</p>
                <p><strong className="text-slate-800">Entity:</strong> {selectedLead.entityName || 'Individual'} &bull; Zone: {selectedLead.zone || 'NORTH'}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Review Decision</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewAction('Approved')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      reviewAction === 'Approved'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Approve & Forward to Telecaller
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewAction('Rejected')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      reviewAction === 'Rejected'
                        ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <X className="w-4 h-4 text-rose-600" />
                    Reject Lead
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">RM Review Remarks / Notes</label>
                <textarea
                  rows="3"
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder="Instructions for Telecaller or justification for decision..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {reviewAction === 'Approved' ? 'Forward to Telecaller' : 'Reject Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
