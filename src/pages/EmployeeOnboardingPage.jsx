import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User, Mail, Phone, Home, CreditCard, Briefcase, GraduationCap,
  Building2, FileText, CheckCircle2, Upload, Shield, ArrowLeft, Loader2,
  BadgeCheck, Landmark, Users2, ChevronDown, Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000';

// â”€â”€â”€ Small helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-base font-semibold text-slate-700 mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ label, required, placeholder, type = 'text', value, onChange, name }) => (
  <Field label={label} required={required}>
    <input
      required={required}
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-5 py-4 border border-gray-200 rounded-xl text-base bg-white outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all"
    />
  </Field>
);

const Select = ({ label, required, value, onChange, name, options }) => (
  <Field label={label} required={required}>
    <div className="relative">
      <select
        required={required}
        name={name}
        value={value || ''}
        onChange={onChange}
        className="w-full px-5 py-4 border border-gray-200 rounded-xl text-base bg-white outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all appearance-none pr-8"
      >
        <option value="">Selectâ€¦</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </Field>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-5 pb-2 border-b border-gray-100">
    <div className="w-8 h-8 bg-[#0EA5E9]/10 rounded-lg flex items-center justify-center">
      <Icon size={16} className="text-[#0EA5E9]" />
    </div>
    <h2 className="text-base font-bold text-slate-900">{title}</h2>
  </div>
);

const QUALIFICATIONS = ['10th', '12th', 'Diploma', 'Graduate', 'Post Graduate', 'Other'];
const MARITAL_STATUS = ['Single', 'Married', 'Divorced', 'Widowed'];

const DOC_LIST = [
  { key: 'aadhar',           label: 'Aadhaar Card',                     required: true },
  { key: 'pan',              label: 'PAN Card',                          required: true },
  { key: 'photo',            label: 'Passport-size Photo',               required: true },
  { key: 'bankPassbook',     label: 'Bank Passbook / Cancelled Cheque',  required: true },
  { key: 'degree',           label: 'Degree / Marksheet',                required: false },
  { key: 'offerLetter',      label: 'Previous Offer Letter',             required: false },
  { key: 'experienceLetter', label: 'Experience Letter',                 required: false },
];

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function EmployeeOnboardingPage() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fathersName: '', mothersName: '', fathersMobile: '',
    maritalStatus: '', drivingLicence: '', vehicleNumber: '',
    presentAddress: '', permanentAddress: '', landmark: '',
    mobile: '', pan: '', aadhar: '',
    bankAccType: '', bankAccName: '', bankName: '', bankBranch: '',
    bankAccNum: '', bankAccNumConfirm: '', bankIfsc: '',
    qual1Type: '', qual1Inst: '', qual1Dist: '', qual1Year: '', qual1Perc: '',
    expCompany: '', expPosition: '', expPhone: '', expStart: '', expEnd: '',
    expGross: '', expMonthly: '', expReason: '', expAddress: '',
    expRmName: '', expRmDesig: '', expRmMobile: '', expRmEmail: '', expRmBranch: '',
    ref1Rel: '', ref1Name: '', ref1Mobile: '', ref1Address: '',
    ref2Rel: '', ref2Name: '', ref2Mobile: '', ref2Address: '',
  });

  const [files, setFiles] = useState({});  // { key: File }
  const [pincodeInfo, setPincodeInfo] = useState({ state: '', district: '', city: '' });
  const [fetchingPin, setFetchingPin] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API}/api/employees/onboarding/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.message) { setLoading(false); return; }
        setEmployee(data);
        if (data.onboardingStatus === 'Submitted' || data.onboardingStatus === 'Done') {
          setSubmitted(true);
        }
        // Pre-fill editable info from existing data
        setForm(f => ({
          ...f,
          mobile: data.mobile || '',
          pan: data.pan || '',
          aadhar: data.aadhar || '',
          fathersName: data.fathersName || '',
          mothersName: data.mothersName || '',
          fathersMobile: data.fathersMobile || '',
          maritalStatus: data.maritalStatus || '',
          drivingLicence: data.drivingLicence || '',
          vehicleNumber: data.vehicleNumber || '',
          presentAddress: data.presentAddress || '',
          permanentAddress: data.permanentAddress || '',
          landmark: data.landmark || '',
          bankAccType: data.bankAccType || '',
          bankAccName: data.bankAccName || '',
          bankName: data.bankName || '',
          bankBranch: data.bankBranch || '',
          bankAccNum: data.bankAccNum || '',
          bankIfsc: data.bankIfsc || '',
          qual1Type: data.qual1Type || '',
          qual1Inst: data.qual1Inst || '',
          qual1Dist: data.qual1Dist || '',
          qual1Year: data.qual1Year || '',
          qual1Perc: data.qual1Perc || '',
          expCompany: data.expCompany || '',
          expPosition: data.expPosition || '',
          expPhone: data.expPhone || '',
          expStart: data.expStart || '',
          expEnd: data.expEnd || '',
          expGross: data.expGross || '',
          expMonthly: data.expMonthly || '',
          expReason: data.expReason || '',
          expAddress: data.expAddress || '',
          expRmName: data.expRmName || '',
          expRmDesig: data.expRmDesig || '',
          expRmMobile: data.expRmMobile || '',
          expRmEmail: data.expRmEmail || '',
          expRmBranch: data.expRmBranch || '',
          ref1Rel: data.ref1Rel || '',
          ref1Name: data.ref1Name || '',
          ref1Mobile: data.ref1Mobile || '',
          ref1Address: data.ref1Address || '',
          ref2Rel: data.ref2Rel || '',
          ref2Name: data.ref2Name || '',
          ref2Mobile: data.ref2Mobile || '',
          ref2Address: data.ref2Address || '',
        }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const fetchPincode = async (pincode) => {
    if (pincode?.length !== 6) return;
    setFetchingPin(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data[0]?.Status === 'Success') {
        const info = data[0].PostOffice[0];
        setPincodeInfo({ state: info.State, district: info.District, city: info.Name });
        setForm(f => ({
          ...f,
          presentAddress: f.presentAddress || `${info.Name}, ${info.District}, ${info.State} - ${pincode}`
        }));
        toast.success(`ðŸ“ ${info.Name}, ${info.District}, ${info.State}`);
      }
    } catch { /* ignore */ }
    finally { setFetchingPin(false); }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    toast.loading('Fetching locationâ€¦');
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await res.json();
        const addr = data.address;
        const formatted = [addr.road, addr.suburb, addr.city || addr.town || addr.village, addr.state_district, addr.state, addr.postcode].filter(Boolean).join(', ');
        setForm(f => ({ ...f, presentAddress: formatted }));
        toast.dismiss();
        toast.success('Location fetched!');
      } catch { toast.dismiss(); toast.error('Could not fetch address'); }
    }, () => { toast.dismiss(); toast.error('Location access denied'); });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.bankAccNum !== form.bankAccNumConfirm) {
      toast.error('Bank account numbers do not match!');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();

      // Append all text fields
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      // Add pincode info
      if (pincodeInfo.state) {
        fd.append('state', pincodeInfo.state);
        fd.append('district', pincodeInfo.district);
        fd.append('city', pincodeInfo.city);
      }

      // Append files
      const docsMeta = [];
      DOC_LIST.forEach(doc => {
        if (files[doc.key]) {
          fd.append(doc.key, files[doc.key]);
          docsMeta.push({ key: doc.key, name: doc.label });
        }
      });
      fd.append('documents', JSON.stringify(docsMeta));

      const res = await fetch(`${API}/api/employees/onboarding/${id}`, {
        method: 'POST',
        body: fd,
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success('Onboarding submitted successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const err = await res.json();
        toast.error(err.message || 'Submission failed');
      }
    } catch (err) {
      toast.error('Server error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // â”€â”€â”€ Loading / Error / Success states â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 size={32} className="animate-spin text-[#0EA5E9]" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] text-center px-6">
        <Shield size={48} className="text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Link</h1>
        <p className="text-gray-500 mb-6">This onboarding link is invalid or has expired. Please contact HR.</p>
        <Link to="/" className="bg-[#0EA5E9] text-white font-bold px-6 py-3 rounded-full hover:bg-[#0284C7] transition-colors">
          Go to Home
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] text-center px-6 pt-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <BadgeCheck size={40} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Onboarding Submitted!</h1>
        <p className="text-gray-500 max-w-md mb-2">
          Thank you <strong>{employee.name}</strong>! Your onboarding form has been submitted successfully.
        </p>
        <p className="text-gray-400 text-sm mb-8">HR will review your documents and reach out to you shortly.</p>
        <Link to="/" className="bg-[#0EA5E9] text-white font-bold px-8 py-3 rounded-full hover:bg-[#0284C7] transition-colors shadow-md">
          Back to Home
        </Link>
      </div>
    );
  }

  // â”€â”€â”€ Main Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] rounded-2xl p-6 mb-8 text-white shadow-lg">
          <p className="text-sm font-semibold opacity-80 mb-1">Welcome to HAUS Nuo-Pay</p>
          <h1 className="text-2xl font-extrabold mb-1">{employee.name}</h1>
          <p className="text-sm opacity-80">{employee.designation} Â· {employee.division}</p>
          <p className="text-xs mt-3 opacity-60">Employee ID: {employee.empId}</p>
          <div className="mt-4 bg-white/10 rounded-xl p-3 text-sm">
            <p>ðŸ“‹ Please fill this form carefully. All the information you submit will be verified by HR.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={User} title="Personal Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Father's Name" required name="fathersName" value={form.fathersName} onChange={handleChange} placeholder="Enter father's full name" />
              <Input label="Father's Mobile" name="fathersMobile" value={form.fathersMobile} onChange={handleChange} placeholder="Father's mobile number" type="tel" />
              <Input label="Mother's Name" name="mothersName" value={form.mothersName} onChange={handleChange} placeholder="Enter mother's full name" />
              <Select label="Marital Status" required name="maritalStatus" value={form.maritalStatus} onChange={handleChange} options={MARITAL_STATUS} />
              <Input label="Mobile Number" required name="mobile" value={form.mobile} onChange={handleChange} placeholder="Your contact number" type="tel" />
              <Input label="Driving Licence No." name="drivingLicence" value={form.drivingLicence} onChange={handleChange} placeholder="DL number (if any)" />
              <Input label="Vehicle Number" name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} placeholder="Vehicle number (if any)" />
            </div>
          </div>

          {/* Identity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={CreditCard} title="Identity Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="PAN Number" required name="pan" value={form.pan} onChange={handleChange} placeholder="ABCDE1234F" />
              <Input label="Aadhaar Number" required name="aadhar" value={form.aadhar} onChange={handleChange} placeholder="12-digit Aadhaar" />
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={Home} title="Address Details" />

            {/* Pincode row */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <Input label="Pincode" name="pincode" value={form.pincode || ''} onChange={e => { handleChange(e); if (e.target.value.length === 6) fetchPincode(e.target.value); }} placeholder="6-digit pincode" />
              </div>
              <button type="button" onClick={getCurrentLocation}
                className="mt-7 flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#0EA5E9] border border-[#0EA5E9] rounded-xl hover:bg-[#0EA5E9]/10 transition-colors whitespace-nowrap">
                <Navigation size={13} /> Use My Location
              </button>
            </div>

            {pincodeInfo.state && (
              <div className="flex gap-3 mb-4 bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
                <span className="font-semibold">{pincodeInfo.city}</span> Â·
                <span>{pincodeInfo.district}</span> Â·
                <span>{pincodeInfo.state}</span>
                {fetchingPin && <Loader2 size={12} className="animate-spin ml-auto" />}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Present Address" required>
                <textarea required name="presentAddress" value={form.presentAddress} onChange={handleChange} rows={3}
                  placeholder="Current full address"
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl text-base bg-white outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all resize-none" />
              </Field>
              <Field label="Permanent Address" required>
                <textarea required name="permanentAddress" value={form.permanentAddress} onChange={handleChange} rows={3}
                  placeholder="Permanent/home address"
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl text-base bg-white outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all resize-none" />
              </Field>
              <Input label="Landmark" name="landmark" value={form.landmark} onChange={handleChange} placeholder="Nearby landmark (optional)" />
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={Landmark} title="Bank Account Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Account Type" required name="bankAccType" value={form.bankAccType} onChange={handleChange} options={['Savings', 'Current']} />
              <Input label="Account Holder Name" required name="bankAccName" value={form.bankAccName} onChange={handleChange} placeholder="As per bank records" />
              <Input label="Bank Name" required name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. SBI, HDFC" />
              <Input label="Branch Name" required name="bankBranch" value={form.bankBranch} onChange={handleChange} placeholder="Branch name" />
              <Input label="Account Number" required name="bankAccNum" value={form.bankAccNum} onChange={handleChange} placeholder="Account number" type="password" />
              <Input label="Confirm Account Number" required name="bankAccNumConfirm" value={form.bankAccNumConfirm} onChange={handleChange} placeholder="Re-enter account number" />
              <Input label="IFSC Code" required name="bankIfsc" value={form.bankIfsc} onChange={handleChange} placeholder="e.g. SBIN0001234" />
            </div>
          </div>

          {/* Qualification */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={GraduationCap} title="Highest Qualification" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Qualification" required name="qual1Type" value={form.qual1Type} onChange={handleChange} options={QUALIFICATIONS} />
              <Input label="Institution / College" required name="qual1Inst" value={form.qual1Inst} onChange={handleChange} placeholder="Name of institution" />
              <Input label="District" name="qual1Dist" value={form.qual1Dist} onChange={handleChange} placeholder="District of institution" />
              <Input label="Passing Year" name="qual1Year" value={form.qual1Year} onChange={handleChange} placeholder="e.g. 2020" type="number" />
              <Input label="Percentage / CGPA" name="qual1Perc" value={form.qual1Perc} onChange={handleChange} placeholder="e.g. 75% or 7.5 CGPA" />
            </div>
          </div>

          {/* Previous Experience */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={Briefcase} title="Previous Work Experience" />
            <p className="text-xs text-gray-400 mb-4">Fill only if you have prior work experience.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Company Name" name="expCompany" value={form.expCompany} onChange={handleChange} placeholder="Previous employer" />
              <Input label="Position / Designation" name="expPosition" value={form.expPosition} onChange={handleChange} placeholder="Your role" />
              <Input label="Company Phone" name="expPhone" value={form.expPhone} onChange={handleChange} placeholder="Company contact number" type="tel" />
              <Input label="From Date" name="expStart" value={form.expStart} onChange={handleChange} type="date" />
              <Input label="To Date" name="expEnd" value={form.expEnd} onChange={handleChange} type="date" />
              <Input label="Gross Salary (â‚¹)" name="expGross" value={form.expGross} onChange={handleChange} placeholder="Yearly gross" type="number" />
              <Input label="Monthly In-Hand (â‚¹)" name="expMonthly" value={form.expMonthly} onChange={handleChange} placeholder="Monthly net" type="number" />
              <Input label="Reason for Leaving" name="expReason" value={form.expReason} onChange={handleChange} placeholder="Why did you leave?" />
              <div className="sm:col-span-2">
                <Input label="Company Address" name="expAddress" value={form.expAddress} onChange={handleChange} placeholder="Full company address" />
              </div>
              <Input label="Reporting Manager Name" name="expRmName" value={form.expRmName} onChange={handleChange} placeholder="Manager's name" />
              <Input label="Manager Designation" name="expRmDesig" value={form.expRmDesig} onChange={handleChange} placeholder="Manager's designation" />
              <Input label="Manager Mobile" name="expRmMobile" value={form.expRmMobile} onChange={handleChange} placeholder="Manager's phone" type="tel" />
              <Input label="Manager Email" name="expRmEmail" value={form.expRmEmail} onChange={handleChange} placeholder="Manager's email" type="email" />
              <Input label="Manager Branch" name="expRmBranch" value={form.expRmBranch} onChange={handleChange} placeholder="Branch/Office" />
            </div>
          </div>

          {/* References */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={Users2} title="Personal References" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Input label="Ref 1 â€“ Relationship" required name="ref1Rel" value={form.ref1Rel} onChange={handleChange} placeholder="e.g. Friend, Teacher" />
              <Input label="Ref 1 â€“ Name" required name="ref1Name" value={form.ref1Name} onChange={handleChange} placeholder="Full name" />
              <Input label="Ref 1 â€“ Mobile" required name="ref1Mobile" value={form.ref1Mobile} onChange={handleChange} placeholder="Mobile number" type="tel" />
              <Input label="Ref 1 â€“ Address" name="ref1Address" value={form.ref1Address} onChange={handleChange} placeholder="Address" />
            </div>
            <div className="border-t border-gray-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Ref 2 â€“ Relationship" name="ref2Rel" value={form.ref2Rel} onChange={handleChange} placeholder="e.g. Colleague" />
              <Input label="Ref 2 â€“ Name" name="ref2Name" value={form.ref2Name} onChange={handleChange} placeholder="Full name" />
              <Input label="Ref 2 â€“ Mobile" name="ref2Mobile" value={form.ref2Mobile} onChange={handleChange} placeholder="Mobile number" type="tel" />
              <Input label="Ref 2 â€“ Address" name="ref2Address" value={form.ref2Address} onChange={handleChange} placeholder="Address" />
            </div>
          </div>

          {/* Documents Upload */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={FileText} title="Upload Documents" />
            <div className="space-y-3">
              {DOC_LIST.map(doc => (
                <div key={doc.key} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-base font-semibold text-slate-800">{doc.label}</p>
                    {doc.required && <p className="text-xs text-red-500">Required</p>}
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) setFiles(prev => ({ ...prev, [doc.key]: file }));
                      }}
                    />
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors border
                      ${files[doc.key]
                        ? 'bg-green-100 border-green-300 text-green-700'
                        : 'bg-[#0EA5E9]/10 border-[#0EA5E9]/30 text-[#0EA5E9] hover:bg-[#0EA5E9]/20'}`}>
                      {files[doc.key] ? <CheckCircle2 size={13} /> : <Upload size={13} />}
                      {files[doc.key] ? files[doc.key].name.slice(0, 18) + 'â€¦' : 'Upload'}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
            {submitting ? 'Submittingâ€¦' : 'Submit Onboarding Form'}
          </button>

          <p className="text-center text-xs text-gray-400 pb-4">
            All information is confidential and will be used only for employment verification purposes.
          </p>
        </form>
      </div>
    </div>
  );
}

