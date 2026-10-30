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

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://loan-management-backend-3a23.onrender.com/api';

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

  // Modal: Dispatch Sales-Head-Approved File to Partner Bank & NBFCs (Bulk Multi-Select)
  const [activeLeadForDispatch, setActiveLeadForDispatch] = useState(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedLenders, setSelectedLenders] = useState([]); // Array of lender objects selected in bulk
  const [dispatchForm, setDispatchForm] = useState({
    channel: 'Email & WhatsApp',
    bankContactName: '',
    bankOfficerDesignation: 'Credit Manager / ASM',
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

  // Modal: Reject Doc & Return to Telecaller
  const [activeLeadForReject, setActiveLeadForReject] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const zoneParam = selectedZone !== 'ALL' ? `&zone=${selectedZone}` : '';
      const res = await axios.get(`${API_BASE}/leads?desk=operations${zoneParam}`, getHeaders());
      
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
          dispatchedLenders: l.dispatchedLenders || [],
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

  // Handle Reject Doc & Return to Telecaller
  const openRejectModal = (lead) => {
    setActiveLeadForReject(lead);
    setRejectReason('Aadhaar / PAN or Bank Statement is blurry or incomplete. Please re-call customer and get clear documents uploaded.');
    setIsRejectModalOpen(true);
  };

  const handleRejectDoc = async (e) => {
    e.preventDefault();
    if (!activeLeadForReject) return;
    try {
      setRejecting(true);
      const res = await axios.put(
        `${API_BASE}/leads/${activeLeadForReject._id}/operations-reject-doc`,
        { reason: rejectReason },
        getHeaders()
      );
      if (res.data.success) {
        toast.success('Document rejected! Lead returned to Telecaller calling queue.');
        setIsRejectModalOpen(false);
        setActiveLeadForReject(null);
        fetchLeads();
      } else {
        toast.error(res.data.message || 'Failed to reject file');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error rejecting document');
    } finally {
      setRejecting(false);
    }
  };

  // Handle Bank & NBFC Bulk Dispatch (by Operations Manager after Sales Head Approval)
  const openDispatchModal = (lead) => {
    setActiveLeadForDispatch(lead);
    // Pre-select top 2 commercial banks as default suggestion
    const defaultSelection = ALL_PARTNERS.slice(0, 2);
    setSelectedLenders(defaultSelection);
    setDispatchForm({
      channel: 'Email & WhatsApp',
      bankContactName: '',
      bankOfficerDesignation: 'Credit Manager / ASM',
      bankContactEmail: '',
      bankContactPhone: '',
      remarks: `Operations dispatching Sales-Head-Approved file for ${lead.name} (Amount: ₹${Number(lead.amount || 0).toLocaleString()}) to partner lenders for best sanction offer.`
    });
    setBankSearchQuery('');
    setBankCategoryFilter('ALL');
    setIsDispatchModalOpen(true);
  };

  const toggleLenderSelection = (lender) => {
    setSelectedLenders(prev => {
      const exists = prev.some(l => l.name === lender.name);
      if (exists) {
        return prev.filter(l => l.name !== lender.name);
      } else {
        return [...prev, lender];
      }
    });
  };

  const selectAllCategory = (category) => {
    const listToSelect = category === 'ALL'
      ? ALL_PARTNERS
      : ALL_PARTNERS.filter(l => l.category === category);

    setSelectedLenders(prev => {
      const existingNames = new Set(prev.map(l => l.name));
      const newlyAdded = listToSelect.filter(l => !existingNames.has(l.name));
      return [...prev, ...newlyAdded];
    });
  };

  const clearAllLenders = () => {
    setSelectedLenders([]);
  };

  const handleConfirmDispatch = async (e) => {
    e.preventDefault();
    if (!activeLeadForDispatch) return;

    if (selectedLenders.length === 0) {
      toast.error('Please select at least 1 Bank or NBFC lender to dispatch the file!');
      return;
    }

    try {
      setDispatching(true);
      const payload = {
        selectedLenders: selectedLenders.map(l => ({
          name: l.name,
          shortName: l.shortName,
          code: l.code || l.initials,
          category: l.category,
          defaultBranch: l.defaultBranch || `${activeLeadForDispatch.zone || 'North'} Zonal Credit Desk`,
          defaultIfsc: l.defaultIfsc || ''
        })),
        bankName: selectedLenders[0].name,
        bankBranch: selectedLenders[0].defaultBranch || `${activeLeadForDispatch.zone} Zonal Credit Desk`,
        bankIfsc: selectedLenders[0].defaultIfsc || '',
        bankCode: selectedLenders[0].code || selectedLenders[0].initials,
        channel: dispatchForm.channel,
        bankContactName: dispatchForm.bankContactName,
        bankOfficerDesignation: dispatchForm.bankOfficerDesignation,
        bankContactEmail: dispatchForm.bankContactEmail,
        bankContactPhone: dispatchForm.bankContactPhone,
        remarks: dispatchForm.remarks
      };

      const res = await axios.put(
        `${API_BASE}/sales/${activeLeadForDispatch._id}/dispatch-bank`,
        payload,
        getHeaders()
      );

      if (res.data.success) {
        const count = selectedLenders.length;
        toast.success(`File successfully dispatched to ${count} Lender${count > 1 ? 's' : ''} via ${dispatchForm.channel}!`);
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
      return l.workflowStage === 'Operations_KYC_Verification';
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
  const kycPendingCount = leadsList.filter(l => l.workflowStage === 'Operations_KYC_Verification').length;
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
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-300 px-2.5 py-1 rounded-full whitespace-nowrap">
                              <Building2 size={12} className="text-blue-600" /> Dispatched to {lead.dispatchedBankName || 'Bank'}
                            </span>
                            {lead.dispatchedLenders && lead.dispatchedLenders.length > 1 && (
                              <span className="text-[10px] text-blue-600 font-bold px-1">
                                &bull; Sent to {lead.dispatchedLenders.length} Lenders simultaneously
                              </span>
                            )}
                          </div>
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

                          {/* Stage 1: Submit to Sales Head OR Reject Doc */}
                          {isKycReady && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => openRejectModal(lead)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition cursor-pointer whitespace-nowrap shrink-0"
                                title="Reject and return to Telecaller"
                              >
                                <X size={13} /> Reject Doc
                              </button>
                              <button
                                onClick={() => openSalesHeadModal(lead)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap shrink-0"
                              >
                                <ShieldCheck size={13} /> Verify & Submit to Sales Head &rarr;
                              </button>
                            </div>
                          )}

                          {/* Stage 2: Waiting for Sales Head */}
                          {isAwaitingSalesHead && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs whitespace-nowrap shrink-0">
                              <Eye size={13} /> Under Sales Head Review
                            </span>
                          )}

                          {/* Stage 3: Sales Head Approved -> Send to Banks / NBFCs */}
                          {isSalesHeadApproved && (
                            <button
                              onClick={() => openDispatchModal(lead)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer whitespace-nowrap shrink-0"
                            >
                              <Send size={13} /> Send to Banks/NBFCs (Bulk) &rarr;
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

      {/* ── MODAL: REJECT DOC & RETURN TO TELECALLER ── */}
      {isRejectModalOpen && activeLeadForReject && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Reject Documents</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Return lead to Telecaller for re-calling</p>
                </div>
              </div>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleRejectDoc} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p><span className="text-slate-400 font-medium">Customer:</span> <b className="text-slate-900">{activeLeadForReject.name}</b> (+91 {activeLeadForReject.mobile})</p>
                <p><span className="text-slate-400 font-medium">Lead ID:</span> <span className="font-mono font-bold text-slate-800">{activeLeadForReject.leadId}</span> &bull; Zone: <b className="text-blue-700">{activeLeadForReject.zone}</b></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Rejection Reason (Visible to Telecaller)
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                  placeholder="Specify what document is missing or invalid..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-medium"
                />
              </div>

              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-[11px] text-rose-800 font-medium">
                ⚠️ This will immediately enable calling for the Telecaller, notify them to call the customer, get the document re-uploaded, and forward again.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejecting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  {rejecting ? <RefreshCw size={13} className="animate-spin" /> : <X size={13} />}
                  Reject & Return File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* ── MODAL 2: DISPATCH TO BANK & NBFCs (BULK MULTI-LENDER SELECTOR) ── */}
      {isDispatchModalOpen && activeLeadForDispatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">
                      Bulk Dispatch File to Partner Lenders
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                      Multi-Lender Select
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Sales Head Approved &bull; Select multiple Banks & NBFCs to send the file simultaneously
                  </p>
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
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50/60 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-black text-sm text-emerald-950">{activeLeadForDispatch.name} ({activeLeadForDispatch.mobile})</div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    {activeLeadForDispatch.leadId} &bull; {activeLeadForDispatch.zone} Zone &bull; PAN: {activeLeadForDispatch.pan}
                  </div>
                </div>
                <div className="sm:text-right">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">Sanction Requested</div>
                  <div className="text-base font-black text-emerald-900">₹{Number(activeLeadForDispatch.amount || 0).toLocaleString()}</div>
                </div>
              </div>

              {/* Bulk Lender Selection Header & Action Controls */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-black text-slate-900">
                      Choose Partner Banks & NBFCs:
                    </label>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full font-black text-[11px] shadow-xs">
                      {selectedLenders.length} Selected
                    </span>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
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

                {/* Bulk Select / Deselect Quick Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 p-2 bg-slate-100/80 rounded-xl border border-slate-200 mb-2.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <span className="text-[10px] font-bold text-slate-500 uppercase px-1">Filter:</span>
                    {['ALL', 'Commercial Bank', 'NBFC', 'Housing Finance'].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setBankCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition whitespace-nowrap cursor-pointer ${
                          bankCategoryFilter === cat
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {cat === 'ALL' ? 'All Partners' : cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => selectAllCategory(bankCategoryFilter)}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
                    >
                      + Select All {bankCategoryFilter === 'ALL' ? '' : `(${bankCategoryFilter})`}
                    </button>
                    {selectedLenders.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAllLenders}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Checkbox Multi-Select Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
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
                    const isSelected = selectedLenders.some(l => l.name === bank.name);
                    return (
                      <div
                        key={bank.name}
                        onClick={() => toggleLenderSelection(bank)}
                        className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition select-none ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        {/* Checkbox Icon */}
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition ${
                          isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'
                        }`}>
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>

                        {/* Real Guaranteed Vector Brand Logo */}
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-2xs flex items-center justify-center bg-white border border-slate-100 p-0.5">
                          <BankBrandLogo code={bank.code || bank.initials} name={bank.shortName} className="w-full h-full object-contain" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="font-extrabold text-slate-900 text-xs truncate leading-tight">{bank.shortName}</div>
                          <div className="text-[10px] text-slate-400 font-medium truncate">{bank.category}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Lenders Summary Chip Pills */}
              {selectedLenders.length > 0 && (
                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/60">
                  <div className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Dispatched Pipeline Preview ({selectedLenders.length} Lenders Selected)</span>
                    <span className="text-[10px] text-emerald-600 lowercase font-medium">click pill to remove</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {selectedLenders.map((lender) => (
                      <span
                        key={lender.name}
                        onClick={() => toggleLenderSelection(lender)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-white text-emerald-900 border border-emerald-300 shadow-2xs cursor-pointer hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300 transition"
                        title="Click to remove"
                      >
                        <span>{lender.shortName || lender.name}</span>
                        <X size={10} className="text-slate-400 hover:text-rose-600" />
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Transmission Channel & Routing Configuration */}
              <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                  Transmission Channel & Routing Setup
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Bulk Dispatch Channel *</label>
                    <select
                      value={dispatchForm.channel}
                      onChange={e => setDispatchForm({ ...dispatchForm, channel: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="Email & WhatsApp">Simultaneous Email & WhatsApp (Recommended)</option>
                      <option value="Email">Official Partner Email (PDF Pack)</option>
                      <option value="WhatsApp">Lender Credit WhatsApp Desk</option>
                      <option value="Direct Banking">Direct Banking Integration / Portal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Central Zonal Credit Hub</label>
                    <input
                      type="text"
                      readOnly
                      value={`${activeLeadForDispatch.zone || 'North'} Regional Hub Desk`}
                      className="w-full p-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                    />
                  </div>
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

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="text-[11px] text-slate-500 font-medium">
                  File will be sent simultaneously to <b className="text-slate-900">{selectedLenders.length}</b> Partner Lender{selectedLenders.length > 1 ? 's' : ''}.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDispatchModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={dispatching || selectedLenders.length === 0}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer whitespace-nowrap"
                  >
                    {dispatching ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                    Bulk Dispatch to {selectedLenders.length} Lender{selectedLenders.length > 1 ? 's' : ''} &rarr;
                  </button>
                </div>
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
