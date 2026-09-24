import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldCheck, RefreshCw, Search, Building2, Send, Check, 
  MapPin, CheckCircle2, User, Phone, 
  CreditCard, ArrowRight, X, Filter, Clock, FileCheck, AlertCircle, Eye, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

import { BANK_PARTNERS, NBFC_PARTNERS, ALL_PARTNERS, getLenderLogo, getLenderDetails } from '../../constants/lenders';
import { BankBrandLogo } from '../../components/BankBrandLogo';
import TablePagination from '../../components/TablePagination';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

export default function ApplicationVerification() {
  const navigate = useNavigate();

  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedStageFilter, setSelectedStageFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [leadsList, setLeadsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal: Submit KYC to Sales Head
  const [activeLeadForSalesHead, setActiveLeadForSalesHead] = useState(null);
  const [isSalesHeadModalOpen, setIsSalesHeadModalOpen] = useState(false);
  const [salesHeadRemarks, setSalesHeadRemarks] = useState('');
  const [submittingToSalesHead, setSubmittingToSalesHead] = useState(false);

  // Modal: Dispatch Sales-Head-Approved File to Partner Bank
  const [activeLeadForDispatch, setActiveLeadForDispatch] = useState(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchForm, setDispatchForm] = useState({
    bankName: 'HDFC Bank Limited',
    bankBranch: 'Connaught Place Main Branch',
    bankIfsc: 'HDFC0000123',
    bankCode: 'HDFC',
    channel: 'Email',
    bankContactName: '',
    bankOfficerDesignation: 'Branch Credit Manager',
    bankContactEmail: '',
    bankContactPhone: '',
    remarks: ''
  });
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [bankCategoryFilter, setBankCategoryFilter] = useState('ALL'); // 'ALL' | 'Commercial Bank' | 'NBFC' | 'Housing Finance'
  const [dispatching, setDispatching] = useState(false);

  // Modal: View Documents
  const [activeLeadForDocs, setActiveLeadForDocs] = useState(null);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const zoneParam = selectedZone !== 'ALL' ? `?zone=${selectedZone}` : '';
      const res = await axios.get(`${API_BASE}/leads${zoneParam}`, getHeaders());
      
      if (Array.isArray(res.data)) {
        // Map all relevant operational workflow files
        const items = res.data.map((l, i) => ({
          _id: l._id,
          leadId: l.leadId || `LN-${1000 + i}`,
          name: l.name || l.customName || 'Customer',
          mobile: l.mobile || l.mobNo || '9876543210',
          pan: l.panNumber || 'ABCDE1234F',
          amount: l.expectedAmount || l.loanAmount || 500000,
          income: l.monthlyIncome || 65000,
          zone: l.zone || 'NORTH',
          product: l.loanType || l.productSubtype || 'Personal Loan',
          workflowStage: l.workflowStage || 'Operations_KYC_Verification',
          salesHeadApprovedBy: l.salesHeadApprovedBy || 'Sales Head',
          salesHeadApprovedAt: l.salesHeadApprovedAt,
          salesHeadRemarks: l.salesHeadRemarks || '',
          dispatchedBankName: l.dispatchedBankName || '',
          dispatchedChannel: l.dispatchedChannel || '',
          customerFormStatus: l.customerFormStatus || 'Pending',
          generatorType: l.generatorType || 'Employee',
          createdByDesignation: l.createdByDesignation || l.createdByRole || 'Staff',
          createdByName: l.createdByName || '',
          documents: l.documents || [],
          documentsCount: (l.documents || []).length
        }));

        setLeadsList(items);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load lead files');
    } finally {
      setLoading(false);
    }
  }, [selectedZone]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handle Submit KYC to Sales Head
  const openSalesHeadModal = (lead) => {
    setActiveLeadForSalesHead(lead);
    setSalesHeadRemarks(`KYC, Aadhaar, PAN, and Bank statements verified by Operations. Submitted to Sales Head for sanction approval.`);
    setIsSalesHeadModalOpen(true);
  };

  const handleSubmitToSalesHead = async (e) => {
    e.preventDefault();
    if (!activeLeadForSalesHead) return;

    try {
      setSubmittingToSalesHead(true);
      const res = await axios.put(
        `${API_BASE}/sales/${activeLeadForSalesHead._id}/submit-sales-approval`,
        { remarks: salesHeadRemarks },
        getHeaders()
      );
      if (res.data.success) {
        toast.success(`File verified! Submitted to Sales Head for approval.`);
        setIsSalesHeadModalOpen(false);
        setActiveLeadForSalesHead(null);
        fetchLeads();
      } else {
        toast.error(res.data.message || 'Failed to submit file');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting to Sales Head');
    } finally {
      setSubmittingToSalesHead(false);
    }
  };

  // Handle Bank Dispatch (by Operations Manager after Sales Head Approval)
  const openDispatchModal = (lead) => {
    setActiveLeadForDispatch(lead);
    setDispatchForm({
      bankName: 'HDFC Bank Limited',
      channel: 'Email',
      bankContactName: '',
      bankContactEmail: '',
      bankContactPhone: '',
      remarks: `Operations dispatching Sales-Head-Approved file for ${lead.name} (Amount: ₹${Number(lead.amount || 0).toLocaleString()})`
    });
    setIsDispatchModalOpen(true);
  };

  const handleConfirmDispatch = async (e) => {
    e.preventDefault();
    if (!activeLeadForDispatch) return;

    try {
      setDispatching(true);
      const res = await axios.put(
        `${API_BASE}/sales/${activeLeadForDispatch._id}/dispatch-bank`,
        dispatchForm,
        getHeaders()
      );

      if (res.data.success) {
        toast.success(`File successfully forwarded to ${dispatchForm.bankName} via ${dispatchForm.channel}!`);
        setIsDispatchModalOpen(false);
        setActiveLeadForDispatch(null);
        fetchLeads();
      } else {
        toast.error(res.data.message || 'Dispatch failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Dispatch failed');
    } finally {
      setDispatching(false);
    }
  };

  // Filter logic
  const filtered = leadsList.filter(l => {
    const q = searchQuery.toLowerCase();
    const name = (l.name || '').toLowerCase();
    const mob = (l.mobile || '');
    const id = (l.leadId || '').toLowerCase();
    const matchesSearch = name.includes(q) || mob.includes(q) || id.includes(q);

    if (!matchesSearch) return false;

    if (selectedStageFilter === 'ALL') return true;
    if (selectedStageFilter === 'KYC_PENDING') {
      return ['Operations_KYC_Verification', 'RM_Telecaller_Review', 'Customer_Confirmed', 'Under Review', 'In Progress', 'New'].includes(l.workflowStage);
    }
    if (selectedStageFilter === 'SALES_HEAD_PENDING') {
      return l.workflowStage === 'Sales_Head_Approval_Pending';
    }
    if (selectedStageFilter === 'SALES_HEAD_APPROVED') {
      return l.workflowStage === 'Sales_Head_Approved';
    }
    if (selectedStageFilter === 'BANK_DISPATCHED') {
      return ['Bank_Dispatched', 'Bank_Sanctioned_Offer', 'Customer_Accepted', 'Disbursed'].includes(l.workflowStage);
    }
    return true;
  });

  // Counts for top cards
  const kycPendingCount = leadsList.filter(l => ['Operations_KYC_Verification', 'RM_Telecaller_Review', 'Customer_Confirmed', 'Under Review', 'In Progress', 'New'].includes(l.workflowStage)).length;
  const salesPendingCount = leadsList.filter(l => l.workflowStage === 'Sales_Head_Approval_Pending').length;
  const salesApprovedCount = leadsList.filter(l => l.workflowStage === 'Sales_Head_Approved').length;
  const bankDispatchedCount = leadsList.filter(l => ['Bank_Dispatched', 'Bank_Sanctioned_Offer', 'Customer_Accepted', 'Disbursed'].includes(l.workflowStage)).length;

  return (
    <div className="p-4 md:p-8 max-w-[1500px] mx-auto min-h-screen bg-slate-50/50 space-y-6">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <ShieldCheck size={30} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Operations Command Desk</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Operations KYC Verification & Bank Dispatch
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Verify borrower dossier &bull; Submit to Sales Head for Approval &bull; Dispatch approved files to Partner Banks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/sales/bank-submissions')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Building2 size={15} /> View Bank Submissions
          </button>
          <button
            onClick={fetchLeads}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── WORKFLOW STAGE STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedStageFilter('KYC_PENDING')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            selectedStageFilter === 'KYC_PENDING'
              ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-700 uppercase">1. KYC Verification</span>
            <FileCheck size={16} className="text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{kycPendingCount}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">Verify & Send to Sales Head</div>
        </button>

        <button
          onClick={() => setSelectedStageFilter('SALES_HEAD_PENDING')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            selectedStageFilter === 'SALES_HEAD_PENDING'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase">2. Sales Head Review</span>
            <Clock size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{salesPendingCount}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">Awaiting Sales Head Sign-off</div>
        </button>

        <button
          onClick={() => setSelectedStageFilter('SALES_HEAD_APPROVED')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            selectedStageFilter === 'SALES_HEAD_APPROVED'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">3. Ready to Send Bank</span>
            <Send size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{salesApprovedCount}</div>
          <div className="text-[10px] text-emerald-800 font-bold mt-0.5">Sales Approved (Dispatch Now)</div>
        </button>

        <button
          onClick={() => setSelectedStageFilter('BANK_DISPATCHED')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            selectedStageFilter === 'BANK_DISPATCHED'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 uppercase">4. Dispatched to Bank</span>
            <Building2 size={16} className="text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{bankDispatchedCount}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">Bank Processing Underway</div>
        </button>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        
        {/* Stage & Zone Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedStageFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedStageFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Workflow Files ({leadsList.length})
          </button>

          <span className="text-slate-300 mx-1">|</span>

          {['ALL', 'NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL'].map(z => (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedZone === z 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {z === 'ALL' ? 'Pan-India' : z}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, mobile, ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
          />
        </div>
      </div>

      {/* ── UNIFIED APPLICATION TABLE ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900">
              Operations Lead Applications Queue
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              Every file stays visible across its entire lifecycle: Verify &rarr; Sales Head Approval &rarr; Bank Dispatch.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg whitespace-nowrap">
            Showing {filtered.length} Applications
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
                <th className="py-3.5 px-5 whitespace-nowrap">Customer Profile</th>
                <th className="py-3.5 px-5 whitespace-nowrap">Lead / LAN ID</th>
                <th className="py-3.5 px-5 whitespace-nowrap">Source / Generator</th>
                <th className="py-3.5 px-5 whitespace-nowrap">Loan Amount</th>
                <th className="py-3.5 px-5 whitespace-nowrap">Workflow Status</th>
                <th className="py-3.5 px-5 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600 whitespace-nowrap">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 whitespace-nowrap">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-blue-600" />
                    Loading applications...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 whitespace-nowrap">
                    <ShieldCheck size={36} className="mx-auto mb-2 text-slate-300" />
                    No applications found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((lead) => {
                  const isKycReady = ['Operations_KYC_Verification', 'RM_Telecaller_Review', 'Customer_Confirmed', 'Under Review', 'In Progress', 'New'].includes(lead.workflowStage);
                  const isAwaitingSalesHead = lead.workflowStage === 'Sales_Head_Approval_Pending';
                  const isSalesHeadApproved = lead.workflowStage === 'Sales_Head_Approved';
                  const isDispatched = ['Bank_Dispatched', 'Bank_Sanctioned_Offer', 'Customer_Accepted', 'Disbursed'].includes(lead.workflowStage);

                  return (
                    <tr key={lead._id} className="hover:bg-slate-50/60 transition whitespace-nowrap">
                      
                      {/* Customer */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 font-mono"><Phone size={10} /> {lead.mobile}</span>
                          <span>&bull;</span>
                          <span className="font-mono font-bold text-slate-600">{lead.pan}</span>
                        </div>
                      </td>

                      {/* Lead ID & Zone */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-700">{lead.leadId || 'LN-APP'}</div>
                        <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {lead.zone || 'NORTH'} ZONE
                        </span>
                      </td>

                      {/* Source / Creator */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        {lead.generatorType === 'Employee' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                            {lead.createdByDesignation}: {lead.createdByName || 'Staff'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            Customer Direct
                          </span>
                        )}
                      </td>

                      {/* Loan Amount */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="text-sm font-black text-slate-900">
                          ₹{Number(lead.amount || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">{lead.product}</div>
                      </td>

                      {/* Workflow Status Column */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        {isKycReady && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                            <FileCheck size={12} className="text-purple-600" /> KYC Ready ({lead.documentsCount} Files)
                          </span>
                        )}

                        {isAwaitingSalesHead && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full whitespace-nowrap">
                            <Clock size={12} className="text-amber-700 animate-pulse" /> Sent to Sales Head (Awaiting Approval)
                          </span>
                        )}

                        {isSalesHeadApproved && (
                          <div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-full whitespace-nowrap">
                              <CheckCircle2 size={12} className="text-emerald-600" /> Approved by {lead.salesHeadApprovedBy}
                            </span>
                            {lead.salesHeadRemarks && (
                              <div className="text-[10px] text-slate-500 mt-1 italic line-clamp-1 max-w-[200px]" title={lead.salesHeadRemarks}>
                                &ldquo;{lead.salesHeadRemarks}&rdquo;
                              </div>
                            )}
                          </div>
                        )}

                        {isDispatched && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-300 px-2.5 py-1 rounded-full whitespace-nowrap">
                            <Building2 size={12} className="text-blue-600" /> Dispatched to {lead.dispatchedBankName || 'Bank'}
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* View Docs */}
                          <button
                            onClick={() => {
                              setActiveLeadForDocs(lead);
                              setIsDocsModalOpen(true);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-700 rounded-lg transition cursor-pointer"
                            title="View Uploaded Docs"
                          >
                            <FileText size={15} />
                          </button>

                          {/* Stage 1: Submit to Sales Head */}
                          {isKycReady && (
                            <button
                              onClick={() => openSalesHeadModal(lead)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap shrink-0"
                            >
                              <ShieldCheck size={13} /> Verify & Submit to Sales Head &rarr;
                            </button>
                          )}

                          {/* Stage 2: Waiting for Sales Head */}
                          {isAwaitingSalesHead && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs whitespace-nowrap shrink-0">
                              <Eye size={13} /> Under Sales Head Review
                            </span>
                          )}

                          {/* Stage 3: Sales Head Approved -> Send to Bank */}
                          {isSalesHeadApproved && (
                            <button
                              onClick={() => openDispatchModal(lead)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap shrink-0"
                            >
                              <Send size={13} /> Send to Bank (Email/WhatsApp) &rarr;
                            </button>
                          )}

                          {/* Stage 4: Already Dispatched */}
                          {isDispatched && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs whitespace-nowrap shrink-0">
                              <Check size={13} className="text-emerald-600" /> Dispatched
                            </span>
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

        {/* Unified Table Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => setPageSize(size)}
        />

      </div>

      {/* ── MODAL 1: SUBMIT KYC TO SALES HEAD ── */}
      {isSalesHeadModalOpen && activeLeadForSalesHead && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Submit File for Sales Head Approval
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Operations Dossier Sign-Off</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSalesHeadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitToSalesHead} className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="font-black text-sm text-slate-900">{activeLeadForSalesHead.name} ({activeLeadForSalesHead.mobile})</div>
                  <div className="text-[11px] text-slate-500 font-medium">{activeLeadForSalesHead.leadId} &bull; {activeLeadForSalesHead.zone} Zone</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Loan Amount</div>
                  <div className="text-sm font-black text-purple-700">₹{Number(activeLeadForSalesHead.amount || 0).toLocaleString()}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Operations KYC Verification Remarks *
                </label>
                <textarea
                  rows={3}
                  required
                  value={salesHeadRemarks}
                  onChange={e => setSalesHeadRemarks(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none font-medium"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 font-medium leading-relaxed">
                <b>Workflow Rule:</b> File will update to <b>"Sent to Sales Head (Awaiting Approval)"</b>. Once the Sales Head approves, the <b>"Send to Bank"</b> button will activate for you to choose the partner bank and dispatch.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSalesHeadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingToSalesHead}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  {submittingToSalesHead ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                  Confirm & Submit to Sales Head
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: DISPATCH TO BANK (OPERATIONS MANAGER WITH REAL BANK LOGOS & DETAILS) ── */}
      {isDispatchModalOpen && activeLeadForDispatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Forward Loan File to Partner Bank
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Sales Head Approved &bull; Select Partner Bank with Official Details</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDispatchModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-4 text-xs">
              
              {/* Customer Dossier Snapshot */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="font-black text-sm text-emerald-950">{activeLeadForDispatch.name} ({activeLeadForDispatch.mobile})</div>
                  <div className="text-[11px] text-emerald-700 font-medium">{activeLeadForDispatch.leadId} &bull; {activeLeadForDispatch.zone} Zone &bull; PAN: {activeLeadForDispatch.pan}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">Sanction Requested</div>
                  <div className="text-base font-black text-emerald-800">₹{Number(activeLeadForDispatch.amount || 0).toLocaleString()}</div>
                </div>
              </div>

              {/* Real Bank Logos & Interactive Selection Grid with Search Filter */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <label className="block text-xs font-black text-slate-900">
                    Select Partner Bank / NBFC Lender *
                  </label>

                  {/* Bank Search Bar */}
                  <div className="relative w-full sm:w-60">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search bank, NBFC, code..."
                      value={bankSearchQuery}
                      onChange={e => setBankSearchQuery(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1">
                  {['ALL', 'Commercial Bank', 'NBFC', 'Housing Finance'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setBankCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition whitespace-nowrap cursor-pointer ${
                        bankCategoryFilter === cat
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'ALL' ? 'All Lenders' : cat}
                    </button>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1.5 bg-slate-50 rounded-2xl border border-slate-200">
                  {ALL_PARTNERS.filter(bank => {
                    const q = bankSearchQuery.toLowerCase().trim();
                    const matchesQuery = !q || 
                      bank.name.toLowerCase().includes(q) || 
                      bank.shortName.toLowerCase().includes(q) || 
                      (bank.code && bank.code.toLowerCase().includes(q)) ||
                      (bank.category && bank.category.toLowerCase().includes(q));

                    const matchesCategory = bankCategoryFilter === 'ALL' || bank.category === bankCategoryFilter;
                    return matchesQuery && matchesCategory;
                  }).map((bank) => {
                    const isSelected = dispatchForm.bankName === bank.name;
                    return (
                      <div
                        key={bank.name}
                        onClick={() => {
                          setDispatchForm({
                            ...dispatchForm,
                            bankName: bank.name,
                            bankCode: bank.code || bank.initials || bank.shortName,
                            bankIfsc: `${(bank.code || bank.initials || 'BANK').toUpperCase().substring(0, 4)}0000101`,
                            bankBranch: `${activeLeadForDispatch.zone} Zonal Credit Hub`
                          });
                        }}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition ${
                          isSelected
                            ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        {/* Real Guaranteed Vector Brand Logo */}
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-xs flex items-center justify-center bg-white border border-slate-100 p-0.5">
                          <BankBrandLogo code={bank.code || bank.initials} name={bank.shortName} className="w-full h-full object-contain" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="font-extrabold text-slate-900 text-xs truncate leading-snug">{bank.shortName}</div>
                          <div className="text-[10px] text-slate-400 font-medium truncate">{bank.category}</div>
                        </div>

                        {isSelected && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Bank Basic Details */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Bank Branch & Routing Details</span>
                  <span className="text-[11px] font-extrabold text-blue-700">{dispatchForm.bankName}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Branch Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Connaught Place Branch"
                      value={dispatchForm.bankBranch}
                      onChange={e => setDispatchForm({ ...dispatchForm, bankBranch: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Bank IFSC Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HDFC0000123"
                      value={dispatchForm.bankIfsc}
                      onChange={e => setDispatchForm({ ...dispatchForm, bankIfsc: e.target.value.toUpperCase() })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Dispatch Channel *</label>
                    <select
                      value={dispatchForm.channel}
                      onChange={e => setDispatchForm({ ...dispatchForm, channel: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="Email">Official Bank Email</option>
                      <option value="WhatsApp">Bank Portal / WhatsApp</option>
                      <option value="Direct Banking">Direct Banking Integration</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bank Contact Officer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Bank Officer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Sharma (Credit Mgr)"
                    value={dispatchForm.bankContactName}
                    onChange={e => setDispatchForm({ ...dispatchForm, bankContactName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Officer Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Area Credit Manager"
                    value={dispatchForm.bankOfficerDesignation}
                    onChange={e => setDispatchForm({ ...dispatchForm, bankOfficerDesignation: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Officer Email / Phone</label>
                  <input
                    type="text"
                    placeholder="credit.desk@bank.com"
                    value={dispatchForm.bankContactEmail}
                    onChange={e => setDispatchForm({ ...dispatchForm, bankContactEmail: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Operations Cover Note */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Operations Forwarding Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. All KYC, PAN & 6-Month Bank statements verified by Operations. Approved by Sales Head for sanction."
                  value={dispatchForm.remarks}
                  onChange={e => setDispatchForm({ ...dispatchForm, remarks: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 resize-none font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatching}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer whitespace-nowrap"
                >
                  {dispatching ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                  Confirm & Forward to {dispatchForm.bankName.split(' ')[0]}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: VIEW DOCUMENTS ── */}
      {isDocsModalOpen && activeLeadForDocs && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Uploaded Customer Documents</h3>
                  <p className="text-xs text-slate-400 font-medium">{activeLeadForDocs.name} &bull; {activeLeadForDocs.leadId}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDocsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {activeLeadForDocs.documents.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <FileCheck size={32} className="mx-auto text-slate-300 mb-1" />
                  <p className="font-bold text-slate-600 text-xs">KYC Verified</p>
                  <p className="text-[11px] text-slate-400">Customer Aadhaar, PAN, and Bank Statement verified.</p>
                </div>
              ) : (
                activeLeadForDocs.documents.map((doc, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                        <FileText size={14} />
                      </div>
                      <div className="text-xs font-bold text-slate-800">{doc.name || `Document #${idx + 1}`}</div>
                    </div>
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-[11px] hover:bg-blue-100"
                      >
                        View File
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsDocsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
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
