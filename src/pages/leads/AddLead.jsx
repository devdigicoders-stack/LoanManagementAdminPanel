import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChevronRight, MapPin, Building2, Home, CheckCircle2, 
  AlertCircle, Loader2, Sparkles, Navigation, User, Phone, 
  Mail, IndianRupee, FileText, Check
} from "lucide-react";
import toast from 'react-hot-toast';

export default function AddLead() {
  const navigate = useNavigate();

  // Role detection: Sales users cannot add leads
  useEffect(() => {
    const rawRole = (localStorage.getItem('userRole') || '').toLowerCase().trim();
    const rawZonal = (localStorage.getItem('zonalRole') || '').toLowerCase().trim();
    const cleanRole = rawRole.replace(/[^a-z0-9]/g, '');
    const cleanZonal = rawZonal.replace(/[^a-z0-9]/g, '');
    const isSalesRole = ['sales head', 'sales_head', 'saleshead', 'rrm', 'arm', 'rm', 'ro', 're', 'sales'].some(r => 
      rawRole.includes(r) || cleanRole.includes(r) || rawZonal.includes(r) || cleanZonal.includes(r)
    );

    if (isSalesRole) {
      toast.error('Sales users cannot add new leads. Leads are view-only.');
      navigate('/leads', { replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: '', 
    mobile: '', 
    altMobile: '', 
    email: '', 
    source: '', 
    expectedAmount: '', 
    loanPurpose: '', 
    preferredBranch: '', 
    
    // Detailed Address Fields
    pincode: '',
    state: '',
    city: '',
    district: '',
    area: '',
    houseNo: '',
    streetAddress: '',
    landmark: '',
    address: '',
    
    remarks: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [localities, setLocalities] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Live Auto PIN Code Fetcher
  const handlePincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, pincode: pin }));

    if (pin.length === 6) {
      setIsFetchingPincode(true);
      setPincodeStatus(null);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const offices = data[0].PostOffice;
          const primary = offices[0];
          const district = primary.District || primary.Block || '';
          const state = primary.State || '';
          const localityList = Array.from(new Set(offices.map(o => o.Name).filter(Boolean)));

          setLocalities(localityList);
          setFormData(prev => ({
            ...prev,
            state: state,
            city: district,
            district: district,
            area: localityList[0] || prev.area
          }));
          
          setPincodeStatus({
            success: true,
            message: `${district}, ${state}`
          });
          toast.success(`PIN verified: ${district}, ${state}`);
        } else {
          setPincodeStatus({
            success: false,
            message: 'Invalid PIN Code or location not found'
          });
          toast.error('Invalid PIN Code. Please check or enter manually.');
        }
      } catch (err) {
        console.error('Error fetching PIN code:', err);
        setPincodeStatus({
          success: false,
          message: 'Unable to auto-fetch PIN code. Enter address manually.'
        });
      } finally {
        setIsFetchingPincode(false);
      }
    } else {
      setPincodeStatus(null);
      setLocalities([]);
    }
  };

  // Compute formatted address on the fly
  const getFormattedAddress = () => {
    const parts = [
      formData.houseNo ? formData.houseNo.trim() : '',
      formData.streetAddress ? formData.streetAddress.trim() : '',
      formData.landmark ? `Near ${formData.landmark.trim()}` : '',
      formData.area ? formData.area.trim() : '',
      formData.city ? formData.city.trim() : '',
      formData.state ? formData.state.trim() : '',
      formData.pincode ? `- ${formData.pincode.trim()}` : ''
    ].filter(Boolean);
    return parts.join(', ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.source || !formData.loanPurpose || !formData.expectedAmount || !formData.preferredBranch) {
      toast.error('Please fill all required fields');
      return;
    }

    const fullAddress = getFormattedAddress();

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          address: fullAddress || formData.address
        })
      });

      if (res.ok) {
        toast.success('Lead added successfully!');
        navigate('/leads');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to add lead');
      }
    } catch (error) {
      toast.error('Server connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewAddress = getFormattedAddress();

  return (
    <div className="w-full max-w-[1280px] space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Add New Lead</h1>
        <div className="flex items-center text-[12px] font-semibold text-slate-500">
          <span className="hover:text-blue-600 transition-colors">
            Lead Management
          </span>
          <ChevronRight size={14} className="mx-1.5 text-slate-400" />
          <Link to="/leads" className="hover:text-blue-600 transition-colors">
            All Leads
          </Link>
          <ChevronRight size={14} className="mx-1.5 text-slate-400" />
          <span className="text-blue-600 font-bold">Create New Lead</span>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Top 2-Column Section: Personal Details + Loan Sourcing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Personal Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <User size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Personal Information</h3>
                <p className="text-[11px] text-slate-400 font-medium">Customer contact details</p>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Amit Kumar Sharma"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">+91</span>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    maxLength="10"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full h-10 pl-11 pr-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                  Alternate Mobile
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">+91</span>
                  <input
                    type="tel"
                    name="altMobile"
                    maxLength="10"
                    value={formData.altMobile}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full h-10 pl-11 pr-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. amit.sharma@example.com"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Card 2: Loan & Sourcing Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FileText size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Loan & Sourcing Details</h3>
                <p className="text-[11px] text-slate-400 font-medium">Requirement & acquisition channel</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                  Lead Source <span className="text-rose-500">*</span>
                </label>
                <select 
                  name="source" 
                  required
                  value={formData.source} 
                  onChange={handleChange} 
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="" disabled>Select source</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Tele Calling">Tele Calling</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                  Loan Purpose <span className="text-rose-500">*</span>
                </label>
                <select 
                  name="loanPurpose" 
                  required
                  value={formData.loanPurpose} 
                  onChange={handleChange} 
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="" disabled>Select loan purpose</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Education Loan">Education Loan</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                  Expected Loan Amount <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="text"
                    name="expectedAmount"
                    required
                    value={formData.expectedAmount}
                    onChange={handleChange}
                    placeholder="e.g. 5,00,000"
                    className="w-full h-10 pl-8 pr-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                  Preferred Branch <span className="text-rose-500">*</span>
                </label>
                <select 
                  name="preferredBranch" 
                  required
                  value={formData.preferredBranch} 
                  onChange={handleChange} 
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="" disabled>Select branch</option>
                  <option value="Lucknow Main Branch">Lucknow Main Branch</option>
                  <option value="Gomti Nagar Branch">Gomti Nagar Branch</option>
                  <option value="Aliganj Branch">Aliganj Branch</option>
                  <option value="Hazratganj Branch">Hazratganj Branch</option>
                  <option value="Kanpur Central Branch">Kanpur Central Branch</option>
                  <option value="Varanasi Branch">Varanasi Branch</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                Remarks & Customer Notes
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Add any specific customer preferences or requirements..."
                rows="2"
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all resize-none"
              ></textarea>
            </div>
          </div>

        </div>

        {/* Full Comprehensive Address Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-xs">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Comprehensive Address Details</h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Enter 6-digit PIN code to auto-populate State, City & Locality
                </p>
              </div>
            </div>

            {/* Status indicator */}
            {pincodeStatus && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                pincodeStatus.success 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {pincodeStatus.success ? <CheckCircle2 size={13} className="text-emerald-500" /> : <AlertCircle size={13} className="text-rose-500" />}
                <span>{pincodeStatus.message}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* PIN Code with Auto-fetch */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-bold text-slate-700">
                  PIN Code <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-blue-600 font-extrabold flex items-center gap-1">
                  <Sparkles size={11} /> Auto Fetch
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="pincode"
                  maxLength="6"
                  value={formData.pincode}
                  onChange={handlePincodeChange}
                  placeholder="e.g. 226001"
                  className="w-full h-11 px-3.5 pr-10 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 bg-purple-50/20 focus:bg-white transition-all font-mono tracking-wider"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {isFetchingPincode ? (
                    <Loader2 size={16} className="text-purple-600 animate-spin" />
                  ) : pincodeStatus?.success ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <Navigation size={15} className="text-slate-400" />
                  )}
                </div>
              </div>
              <p className="text-[10.5px] text-slate-400 mt-1">
                Type 6 digits to automatically detect State & City
              </p>
            </div>

            {/* State */}
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Auto-detected or enter state"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>

            {/* City / District */}
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                City / District <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Auto-detected or enter city"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>

            {/* Area / Locality / Post Office */}
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                Area / Locality / Sub-district
              </label>
              {localities.length > 0 ? (
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 bg-slate-50/50 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="">Select locality</option>
                  {localities.map((loc, idx) => (
                    <option key={idx} value={loc}>{loc}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. Hazratganj, Gomti Nagar"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 bg-slate-50/50 focus:bg-white transition-all"
                />
              )}
            </div>

            {/* House / Flat / Plot No. */}
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                House / Flat / Shop / Plot No.
              </label>
              <input
                type="text"
                name="houseNo"
                value={formData.houseNo}
                onChange={handleChange}
                placeholder="e.g. Flat 402, Block C"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>

            {/* Street / Road / Colony */}
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                Street / Road / Colony / Sector
              </label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                placeholder="e.g. Park Road, Sector 5"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>

            {/* Landmark */}
            <div className="lg:col-span-3">
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                Landmark (Optional)
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="e.g. Near GPO or Opposite Civil Hospital"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>

          </div>

          {/* Formatted Address Live Preview Card */}
          {previewAddress && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                <Check size={14} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Full Formatted Address (Auto-Generated)
                </p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 leading-relaxed">
                  {previewAddress}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
          <Link to="/leads">
            <button 
              type="button" 
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving Lead...
              </>
            ) : (
              'Save & Register Lead'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
