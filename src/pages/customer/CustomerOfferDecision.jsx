import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Building2, CheckCircle2, AlertTriangle, ShieldCheck, FileText, 
  ArrowRight, Clock, Phone, Mail, User, Info, Check, RefreshCw, ChevronRight,
  Sparkles, Award, Lock, FileSignature, HelpCircle, HeartHandshake
} from 'lucide-react';
import { BankBrandLogo } from '../../components/BankBrandLogo';
import { getLenderDetails } from '../../constants/lenders';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

export default function CustomerOfferDecision() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [holdReason, setHoldReason] = useState('Comparing interest rate (ROI) with another bank');
  const [customHoldNote, setCustomHoldNote] = useState('');
  const [decisionCompleted, setDecisionCompleted] = useState(null); // 'Accepted' | 'HOLD'

  const fetchOfferDetails = async () => {
    try {
      setLoading(true);
      // Try public lead endpoint first, then direct fallback
      let res;
      try {
        res = await axios.get(`${API_BASE}/leads/public/${id}`);
      } catch (e) {
        // Fallback to direct lead fetch
        res = await axios.get(`${API_BASE}/leads/${id}`);
      }

      if (res.data) {
        const leadData = res.data.lead || res.data;
        setLead(leadData);
        if (leadData.workflowStage === 'Customer_Accepted') {
          setDecisionCompleted('Accepted');
        } else if (leadData.workflowStage === 'Customer_HOLD' || leadData.isHoldAlertActive) {
          setDecisionCompleted('HOLD');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not load loan sanction offer details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOfferDetails();
    }
  }, [id]);

  const handleAcceptOffer = async () => {
    try {
      setSubmitting(true);
      const res = await axios.put(`${API_BASE}/sales/${id}/customer-decision`, {
        action: 'Accept'
      });
      if (res.data.success) {
        toast.success('Congratulations! Loan Offer Accepted.');
        setDecisionCompleted('Accepted');
        fetchOfferDetails();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit acceptance');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHoldOffer = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const fullReason = customHoldNote.trim() 
        ? `${holdReason} - Note: ${customHoldNote}` 
        : holdReason;

      const res = await axios.put(`${API_BASE}/sales/${id}/customer-decision`, {
        action: 'Hold',
        reason: fullReason
      });
      if (res.data.success) {
        toast.error('Offer placed on HOLD. Our Senior Manager will contact you shortly.');
        setShowHoldModal(false);
        setDecisionCompleted('HOLD');
        fetchOfferDetails();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit hold status');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <RefreshCw size={36} className="animate-spin text-blue-400 mb-4" />
        <h2 className="text-xl font-bold tracking-tight">Loading Your Sanctioned Loan Offer...</h2>
        <p className="text-slate-400 text-xs mt-1">Connecting to partner bank credit desk</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <AlertTriangle size={48} className="text-amber-400 mb-3" />
        <h2 className="text-xl font-bold">Loan Application Not Found</h2>
        <p className="text-slate-400 text-xs mt-1">Please verify the link or contact your relationship manager.</p>
      </div>
    );
  }

  const lenderInfo = getLenderDetails(lead.dispatchedBankName || lead.lenderName);
  const sanctionedAmount = Number(lead.offerAmount || lead.expectedAmount || lead.loanAmount || 0);
  const roi = lead.roi || '10.5%';
  const tenure = lead.tenure || '36';
  const emiEstimated = Math.round((sanctionedAmount * (parseFloat(roi) / 1200) * Math.pow(1 + (parseFloat(roi) / 1200), parseInt(tenure))) / (Math.pow(1 + (parseFloat(roi) / 1200), parseInt(tenure)) - 1)) || Math.round(sanctionedAmount / parseInt(tenure) * 1.08);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white pb-16">
      {/* Top Brand Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-500/20">
              N
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                NUOG HOUSING PAYMENTS
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  Sanction Desk
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Customer Credit Sanction & Decision Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full">
            <ShieldCheck size={14} />
            <span>Bank Verified</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        {/* Status Notification Banner (if already decided) */}
        {decisionCompleted === 'Accepted' && (
          <div className="p-5 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-slate-900 border border-emerald-500/40 rounded-2xl shadow-lg flex items-start gap-4">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0 mt-0.5">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-emerald-200">
                Loan Sanction Offer Accepted!
              </h3>
              <p className="text-xs text-emerald-300/90 mt-1 leading-relaxed">
                Your loan agreement is being generated. Our operations team and Relationship Manager (<strong>{lead.rmName || 'Assigned RM'}</strong>) will coordinate your agreement signing and instant disbursal.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-700/50 px-3 py-1 rounded-lg">
                  Stage: Agreement Signing & Disbursal
                </span>
              </div>
            </div>
          </div>
        )}

        {decisionCompleted === 'HOLD' && (
          <div className="p-5 bg-gradient-to-r from-rose-950/80 via-rose-900/60 to-slate-900 border border-rose-500/40 rounded-2xl shadow-lg flex items-start gap-4">
            <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl shrink-0 mt-0.5">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-base font-black text-rose-200">
                Offer Currently on HOLD
              </h3>
              <p className="text-xs text-rose-300/90 mt-1 leading-relaxed">
                Reason recorded: <strong>"{lead.holdReason || holdReason}"</strong>. Your assigned Reporting Manager (<strong>{lead.rmName || 'RM'}</strong>) and Field Officer (<strong>{lead.reRoName || 'RO'}</strong>) have been alerted and will reach out to resolve any questions.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleAcceptOffer}
                  disabled={submitting}
                  className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl transition shadow-sm"
                >
                  {submitting ? 'Updating...' : 'Resume & Accept Offer Now'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Sanction Offer Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header row with bank logo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white p-1.5 border border-slate-700/80 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                <BankBrandLogo code={lead.dispatchedBankName || lead.lenderName} name={lead.dispatchedBankName || lead.lenderName} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Sanctioning Partner</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-mono">Ref: {lead.sanctionLetterNo || lead.leadId || 'SANCT-OFFER'}</span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                  {lenderInfo.shortName || lead.dispatchedBankName || 'Partner Bank Limited'}
                </h2>
              </div>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer Name</span>
              <span className="text-base font-extrabold text-slate-100">{lead.name}</span>
              <span className="text-xs text-slate-400">{lead.mobile}</span>
            </div>
          </div>

          {/* Key Loan Financial Terms Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-800/80 relative z-10">
            {/* Sanctioned Amount */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Sanctioned Loan Amount
              </span>
              <span className="text-2xl md:text-3xl font-black text-emerald-400 tracking-tight block">
                ₹{sanctionedAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-300/80 font-medium">100% Pre-Approved</span>
            </div>

            {/* Interest Rate (ROI) */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Interest Rate (ROI)
              </span>
              <span className="text-2xl md:text-3xl font-black text-white tracking-tight block">
                {roi}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Reducing Balance / p.a.</span>
            </div>

            {/* Repayment Tenure */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Tenure Period
              </span>
              <span className="text-2xl md:text-3xl font-black text-white tracking-tight block">
                {tenure} <span className="text-base font-bold text-slate-400">Months</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Flexible Pre-payment</span>
            </div>

            {/* Monthly EMI Estimate */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Estimated Monthly EMI
              </span>
              <span className="text-2xl md:text-3xl font-black text-blue-400 tracking-tight block">
                ₹{emiEstimated.toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-300/80 font-medium">Auto e-NACH Debit</span>
            </div>
          </div>

          {/* Additional Sanction Perks / Information */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Check size={14} />
              </div>
              <span>Zero Collateral Required</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Clock size={14} />
              </div>
              <span>Disbursal within 24–48 Business Hours</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Lock size={14} />
              </div>
              <span>Digital e-Agreement & e-Sign Facility</span>
            </div>
          </div>
        </div>

        {/* Support & Relationship Manager Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Assigned Team Contact</div>
              <div className="text-sm font-extrabold text-white">
                RM: {lead.rmName || 'Reporting Manager'} &bull; Field Officer: {lead.reRoName || 'Field RO'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Zone: {lead.zone || 'NORTH'} &bull; Ready to assist you with rate queries or document guidance
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${lead.mobile}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition"
            >
              <Phone size={13} /> Support Call
            </a>
          </div>
        </div>

        {/* DECISION ACTION BUTTONS (ACCEPT vs HOLD) */}
        {decisionCompleted !== 'Accepted' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <h3 className="text-lg font-black text-white tracking-tight">
                Choose Your Next Step
              </h3>
              <p className="text-xs text-slate-400">
                Accept this sanction to proceed directly to Agreement Signing and Disbursal, or put on Hold if you require further discussion with our team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* BUTTON 1: ACCEPT */}
              <button
                onClick={handleAcceptOffer}
                disabled={submitting}
                className="group p-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-emerald-600/20 flex flex-col items-center justify-center gap-1.5 border border-emerald-400/30 active:scale-[0.99]"
              >
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 size={20} className="text-emerald-200 group-hover:scale-110 transition" />
                  <span>ACCEPT OFFER & SIGN AGREEMENT</span>
                </div>
                <span className="text-[11px] font-normal text-emerald-100/90">
                  Locks in rate &bull; Advances to digital agreement & payout
                </span>
              </button>

              {/* BUTTON 2: HOLD */}
              <button
                onClick={() => setShowHoldModal(true)}
                disabled={submitting}
                className="group p-5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-2xl font-black text-sm transition-all border border-slate-700 hover:border-amber-500/50 flex flex-col items-center justify-center gap-1.5 active:scale-[0.99]"
              >
                <div className="flex items-center gap-2 text-base text-amber-300">
                  <AlertTriangle size={20} className="text-amber-400 group-hover:scale-110 transition" />
                  <span>PUT OFFER ON HOLD</span>
                </div>
                <span className="text-[11px] font-normal text-slate-400">
                  Request consultation with RM / Compare other options
                </span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* HOLD REASON MODAL */}
      {showHoldModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-5 text-slate-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Place Offer on Hold</h3>
                  <p className="text-xs text-slate-400">Tell us what needs attention so our team can resolve it</p>
                </div>
              </div>
              <button
                onClick={() => setShowHoldModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleHoldOffer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Reason for Hold *
                </label>
                <select
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Comparing interest rate (ROI) with another bank">Comparing interest rate (ROI) with another bank</option>
                  <option value="Negotiating lower processing fee & charges">Negotiating lower processing fee & charges</option>
                  <option value="Need higher sanctioned loan amount">Need higher sanctioned loan amount</option>
                  <option value="Need longer repayment tenure">Need longer repayment tenure</option>
                  <option value="Evaluating business timeline & cashflow requirements">Evaluating business timeline & cashflow requirements</option>
                  <option value="Need direct consultation with Senior Reporting Manager">Need direct consultation with Senior Reporting Manager</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Additional Notes / Specific Requirements (Optional)
                </label>
                <textarea
                  rows="3"
                  value={customHoldNote}
                  onChange={(e) => setCustomHoldNote(e.target.value)}
                  placeholder="e.g. 'Can we reduce interest rate from 10.5% to 9.75%? Contact me tomorrow morning.'"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div className="p-3.5 bg-amber-950/40 border border-amber-800/40 rounded-xl text-[11px] text-amber-200/90 leading-relaxed">
                When you put this on HOLD, an alert is broadcasted across the hierarchy (Regional RRM, ARM, RM, and Field RO) so our senior managers can immediately review your preferences.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHoldModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl transition shadow-lg shadow-rose-600/20 flex items-center gap-2"
                >
                  {submitting ? 'Submitting...' : 'Confirm HOLD Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
