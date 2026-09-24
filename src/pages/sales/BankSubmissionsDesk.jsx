import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Building2, CheckCircle2, AlertTriangle, Clock, RefreshCw, 
  ArrowLeft, Search, Filter, Phone, Mail, FileText, Send, X, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ALL_PARTNERS, ALL_LENDERS, LENDER_BANK_LIST, LENDER_NBFC_LIST, getLenderLogo, getLenderDetails } from '../../constants/lenders';
import TablePagination from '../../components/TablePagination';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

const ALL_PARTNER_LENDERS = [
  ...LENDER_BANK_LIST,
  ...LENDER_NBFC_LIST
];

export default function BankSubmissionsDesk() {
  const navigate = useNavigate();
  const [selectedBank, setSelectedBank] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // 'ALL' | 'BANK' | 'NBFC'
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedZone !== 'ALL') params.append('zone', selectedZone);
      if (selectedBank !== 'ALL') params.append('bank', selectedBank);
      if (selectedStage !== 'ALL') params.append('stage', selectedStage);

      const res = await axios.get(`${API_BASE}/sales/bank-submissions?${params.toString()}`, authHeader);
      if (res.data.success) {
        setSubmissions(res.data.submissions || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load bank submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [selectedBank, selectedZone, selectedStage]);

  const filtered = submissions.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.mobile && item.mobile.includes(q)) ||
      (item.leadId && item.leadId.toLowerCase().includes(q)) ||
      (item.dispatchedBankName && item.dispatchedBankName.toLowerCase().includes(q))
    );
  });

  const getStageBadge = (stage, isHold) => {
    if (isHold || stage === 'Customer_HOLD') {
      return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-full font-extrabold text-[10px] animate-pulse">CUSTOMER HOLD</span>;
    }
    switch (stage) {
      case 'Bank_Dispatched':
        return <span className="px-2.5 py-1 bg-sky-100 text-sky-800 border border-sky-300 rounded-full font-bold text-[10px]">Bank Reviewing</span>;
      case 'Bank_Sanctioned_Offer':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full font-bold text-[10px]">Offer Generated</span>;
      case 'Customer_Accepted':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-[10px]">Offer Accepted</span>;
      case 'Disbursed':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-full font-bold text-[10px]">Disbursed</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full font-bold text-[10px]">{stage}</span>;
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-lg shrink-0">
            <Building2 size={32} className="text-blue-300" strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-500/20 rounded-full border border-blue-400 text-blue-200">
                Partner Banks Pipeline Desk
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-1.5">
              Bank Submissions & Decision Hub
            </h1>
            <p className="text-sm text-blue-200 max-w-2xl mt-1">
              Track files dispatched across 21 Partner Banks and NBFCs, record bank sanction offers, and manage customer acceptance/hold responses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/sales/dashboard')}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition backdrop-blur-sm"
          >
            <ArrowLeft size={16} /> Sales Dashboard
          </button>
          <button
            onClick={fetchSubmissions}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Category Toggle (All / Banks / NBFC) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Lender Category:</span>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedCategory === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Lenders (21)
          </button>
          <button
            onClick={() => setSelectedCategory('BANK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedCategory === 'BANK' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Partner Banks ({LENDER_BANK_LIST.length})
          </button>
          <button
            onClick={() => setSelectedCategory('NBFC')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedCategory === 'NBFC' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            NBFCs ({LENDER_NBFC_LIST.length})
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{selectedBank === 'ALL' ? 'All Partner Lenders' : selectedBank}</span>
        </div>
      </div>

      {/* Partner Lenders Filter Badges */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedBank('ALL')}
          className={`px-4 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition shrink-0 ${
            selectedBank === 'ALL'
              ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
          }`}
        >
          All Lenders ({submissions.length})
        </button>

        {(selectedCategory === 'NBFC' ? ALL_PARTNERS.filter(p => LENDER_NBFC_LIST.includes(p.name)) : selectedCategory === 'BANK' ? ALL_PARTNERS.filter(p => LENDER_BANK_LIST.includes(p.name)) : ALL_PARTNERS).map((partner) => {
          const count = submissions.filter(s => s.dispatchedBankName === partner.name).length;
          const isSelected = selectedBank === partner.name;
          return (
            <button
              key={partner.name}
              onClick={() => setSelectedBank(partner.name)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition flex items-center gap-2.5 shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-white p-0.5 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.shortName}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div 
                  className={`w-full h-full rounded flex items-center justify-center text-[9px] font-black uppercase text-white ${partner.logo ? 'hidden' : 'flex'}`}
                  style={{ backgroundColor: partner.iconColor || '#2563EB' }}
                >
                  {partner.initials?.substring(0, 3) || 'LND'}
                </div>
              </div>
              <span className="truncate max-w-[170px]" title={partner.name}>{partner.shortName}</span>
              {count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Zone:</span>
          {['ALL', 'NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL'].map(z => (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                selectedZone === z
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {z}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, mobile..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-blue-600" />
            <span className="text-xs font-bold text-slate-800">
              Total {filtered.length} File(s) in Bank Pipeline
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Click 'Bank Decision' to record offer details or 'Customer Response' to log Accept/Hold
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[11px]">
              <tr className="whitespace-nowrap">
                <th className="px-5 py-3.5 whitespace-nowrap">Customer & Lead ID</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Dispatched Bank</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Amount & Product</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Bank Offer / Sanction</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Pipeline Stage</th>
                <th className="px-5 py-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 whitespace-nowrap">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-blue-500" />
                    Loading submissions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 whitespace-nowrap">
                    <Building2 size={40} className="mx-auto text-slate-300 mb-2" />
                    <div className="text-sm font-bold text-slate-700">No submissions found</div>
                    <p className="text-xs text-slate-400 mt-1">Files approved by Sales Head will appear here once sent to partner banks.</p>
                  </td>
                </tr>
              ) : (
                filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => {
                  const lenderInfo = getLenderDetails(item.dispatchedBankName);
                  return (
                    <tr key={item._id} className="hover:bg-blue-50/40 transition whitespace-nowrap">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone size={11} className="text-slate-400 shrink-0" /> {item.mobile}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {item.leadId || 'N/A'}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-[10px] font-bold">
                            {item.zone || 'NORTH'}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-white p-1 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                            {lenderInfo.logo ? (
                              <img
                                src={lenderInfo.logo}
                                alt={lenderInfo.shortName}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  if (e.target.nextElementSibling) {
                                    e.target.nextElementSibling.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div 
                              className={`w-full h-full rounded flex items-center justify-center text-[10px] font-black uppercase text-white ${lenderInfo.logo ? 'hidden' : 'flex'}`}
                              style={{ backgroundColor: lenderInfo.iconColor || '#2563EB' }}
                            >
                              {lenderInfo.initials?.substring(0, 3) || 'LND'}
                            </div>
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 text-xs block">
                              {lenderInfo.shortName || item.dispatchedBankName || 'Partner Lender'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Via {item.dispatchedChannel || 'Email'}
                            </span>
                          </div>
                          {item.dispatchedAt && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(item.dispatchedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{item.productSubtype || item.productCategory || 'Personal Loan'}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-emerald-600 font-extrabold">
                            ₹{Number(item.expectedAmount || item.loanAmount || 0).toLocaleString()}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {item.offerAmount ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-emerald-700">₹{Number(item.offerAmount).toLocaleString()}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[11px] text-slate-500">ROI: <strong className="text-slate-700">{item.roi || '10.5%'}</strong> ({item.tenure || '36'}m)</span>
                            {item.sanctionLetterNo && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-[10px] text-slate-400">Ref: {item.sanctionLetterNo}</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Pending Bank Offer</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStageBadge(item.workflowStage, item.isHoldAlertActive)}
                          {item.isHoldAlertActive && item.holdReason && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-[11px] text-rose-700 font-bold" title={item.holdReason}>
                                {item.holdReason}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.workflowStage === 'Bank_Sanctioned_Offer' && (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold whitespace-nowrap">
                                <Clock size={13} className="text-amber-600" />
                                <span>Awaiting Customer Action in App</span>
                              </span>
                              <a
                                href={`/customer/offer/${item._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition whitespace-nowrap"
                              >
                                <ExternalLink size={12} /> App Preview
                              </a>
                            </div>
                          )}

                          {(item.isHoldAlertActive || item.workflowStage === 'Customer_HOLD') && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate('/sales/hold-escalations')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 rounded-lg text-xs font-black animate-pulse whitespace-nowrap"
                              >
                                <AlertTriangle size={13} className="text-rose-600" />
                                <span>HOLD ESCALATION RADAR</span>
                              </button>
                            </div>
                          )}

                          {item.workflowStage === 'Customer_Accepted' && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-black whitespace-nowrap">
                              <CheckCircle2 size={13} className="text-emerald-600" />
                              <span>CUSTOMER ACCEPTED IN APP</span>
                            </div>
                          )}

                          {item.workflowStage === 'Bank_Dispatched' && !item.offerAmount && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg text-xs font-semibold whitespace-nowrap">
                              <Clock size={13} className="text-sky-500" />
                              <span>Under Bank Underwriting</span>
                            </div>
                          )}

                          {item.workflowStage === 'Disbursed' && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 border border-purple-300 rounded-lg text-xs font-black whitespace-nowrap">
                              <CheckCircle2 size={13} className="text-purple-600" />
                              <span>Disbursed & Closed</span>
                            </div>
                          )}
                        </div>
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
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        />

      </div>
    </div>
  );
}

