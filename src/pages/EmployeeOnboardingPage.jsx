import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User, Mail, Phone, Home, CreditCard, Briefcase, GraduationCap,
  Building2, FileText, CheckCircle2, Upload, Shield, ArrowLeft, Loader2,
  BadgeCheck, Landmark, Users2, ChevronDown, Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';
import { sanitize, validate } from '../utils/validation';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://loan-management-backend-wu4y.onrender.com/api';
const API = API_BASE.replace('/api', '');

// ── Small helpers ─────────────────────────────────────────────────────────────

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-base font-semibold text-slate-700 mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ label, required, placeholder, type = 'text', value, onChange, name, readOnly, disabled }) => (
  <Field label={label} required={required}>
    <input
      required={required}
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={disabled}
      className={`w-full px-5 py-4 border border-gray-200 rounded-xl text-base bg-white outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all ${readOnly || disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200' : ''}`}
    />
  </Field>
);

const Select = ({ label, required, value, onChange, name, options = [], readOnly, disabled }) => {
  // Ensure the current value is always visible even if not in the default options array
  const hasValue = value && String(value).trim() !== '';
  const isValueInOptions = hasValue && options.some(o => String(o).toLowerCase() === String(value).toLowerCase());

  return (
    <Field label={label} required={required}>
      <div className="relative">
        <select
          required={required}
          name={name}
          value={value || ''}
          onChange={onChange}
          disabled={disabled || readOnly}
          className={`w-full px-5 py-4 border border-gray-200 rounded-xl text-base bg-white outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all appearance-none pr-8 ${readOnly || disabled ? 'bg-slate-100 text-slate-700 cursor-not-allowed border-slate-200 pointer-events-none font-medium' : ''}`}
        >
          <option value="">Select...</option>
          {hasValue && !isValueInOptions && (
            <option value={value}>{value}</option>
          )}
          {options.map(o => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </Field>
  );
};

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-5 pb-2 border-b border-gray-100">
    <div className="w-8 h-8 bg-[#0EA5E9]/10 rounded-lg flex items-center justify-center">
      <Icon size={16} className="text-[#0EA5E9]" />
    </div>
    <h2 className="text-base font-bold text-slate-900">{title}</h2>
  </div>
);

const QUALIFICATIONS = ['10th', '12th', 'Diploma', 'Graduate', 'Graduation', 'Post Graduate', 'Post Graduation', 'Doctorate / PhD', 'Other'];
const MARITAL_STATUS = ['Single', 'Married', 'Divorced', 'Widowed'];

const DOC_LIST = [
  { key: 'aadhar', label: 'Aadhaar Card', required: true },
  { key: 'pan', label: 'PAN Card', required: true },
  { key: 'photo', label: 'Passport-size Photo', required: true },
  { key: 'bankPassbook', label: 'Bank Passbook / Cancelled Cheque', required: true },
  { key: 'degree', label: 'Degree / Marksheet', required: false },
  { key: 'offerLetter', label: 'Previous Offer Letter', required: false },
  { key: 'experienceLetter', label: 'Experience Letter', required: false },
];

// ── Main Component ────────────────────────────────────────────────────────────

export default function EmployeeOnboardingPage() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    email: '', mobile: '', pan: '', aadhar: '',
    fathersName: '', mothersName: '', fathersMobile: '',
    maritalStatus: '', spouseName: '', drivingLicence: '', vehicleNumber: '',
    pincode: '', area: '', district: '', state: '', presentAddress: '', landmark: '',
    permAddress: '', permArea: '', permPincode: '', permDistrict: '', permState: '',
    bankAccType: '', bankAccName: '', bankName: '', bankBranch: '',
    bankAccNum: '', bankAccNumConfirm: '', bankIfsc: '',
    qual1Type: '', qual1Inst: '', qual1Dist: '', qual1Year: '', qual1Perc: '',
    expCompany: '', expPosition: '', expPhone: '', expStart: '', expEnd: '',
    expGross: '', expMonthly: '', expReason: '', expAddress: '',
    expRmName: '', expRmDesig: '', expRmMobile: '', expRmEmail: '', expRmBranch: '',
    ref1Rel: '', ref1Name: '', ref1Mobile: '', ref1Address: '',
    ref2Rel: '', ref2Name: '', ref2Mobile: '', ref2Address: '',
  });

  const [files, setFiles] = useState({}); // { key: File }
  const [pincodeInfo, setPincodeInfo] = useState({ state: '', district: '', city: '' });
  const [fetchingPin, setFetchingPin] = useState(false);
  const [fetchingPermPin, setFetchingPermPin] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [prefilledFields, setPrefilledFields] = useState({});

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
        if (data.state || data.district || data.city) {
          setPincodeInfo({
            state: data.state || '',
            district: data.district || '',
            city: data.city || ''
          });
        }

        // Track which fields were already filled before onboarding
        const prefilled = {};
        [
          'email', 'mobile', 'pan', 'aadhar', 'fathersName', 'mothersName',
          'fathersMobile', 'maritalStatus', 'spouseName', 'drivingLicence', 'vehicleNumber',
          'pincode', 'presentAddress', 'landmark', 'permAddress', 'permPincode',
          'bankAccType', 'bankAccName', 'bankName', 'bankBranch', 'bankIfsc',
          'qual1Type', 'qual1Inst', 'qual1Dist', 'qual1Year', 'qual1Perc',
          'expCompany', 'expPosition', 'expPhone', 'expStart', 'expEnd',
          'expGross', 'expMonthly', 'expReason', 'expAddress',
          'expRmName', 'expRmDesig', 'expRmMobile', 'expRmEmail', 'expRmBranch',
          'ref1Rel', 'ref1Name', 'ref1Mobile', 'ref1Address',
          'ref2Rel', 'ref2Name', 'ref2Mobile', 'ref2Address'
        ].forEach(k => {
          if (data[k] !== undefined && data[k] !== null && String(data[k]).trim() !== '') {
            prefilled[k] = true;
          }
        });
        setPrefilledFields(prefilled);

        // Pre-fill editable info from existing data
        setForm(f => ({
          ...f,
          email: data.email || '',
          mobile: data.mobile || '',
          pan: data.pan || '',
          aadhar: data.aadhar || '',
          fathersName: data.fathersName || '',
          mothersName: data.mothersName || '',
          fathersMobile: data.fathersMobile || '',
          maritalStatus: data.maritalStatus || 'Single',
          spouseName: data.spouseName || '',
          drivingLicence: data.drivingLicence || '',
          vehicleNumber: data.vehicleNumber || '',
          pincode: data.pincode || '',
          area: data.city || data.area || '',
          district: data.district || '',
          state: data.state || '',
          presentAddress: data.presentAddress || '',
          landmark: data.landmark || '',
          permAddress: data.permAddress || data.permanentAddress || '',
          permArea: data.permArea || '',
          permPincode: data.permPincode || '',
          permDistrict: data.permDistrict || '',
          permState: data.permState || '',
          bankAccType: data.bankAccType || 'Savings',
          bankAccName: data.bankAccName || data.name || '',
          bankName: data.bankName || '',
          bankBranch: data.bankBranch || '',
          bankAccNum: data.bankAccNum || '',
          bankAccNumConfirm: data.bankAccNum || '',
          bankIfsc: data.bankIfsc || '',
          qual1Type: data.qual1Type || 'Graduate',
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
    let finalValue = value;
    if (['mobile', 'fathersMobile', 'expPhone', 'expRmMobile', 'ref1Mobile', 'ref2Mobile'].includes(name)) {
      finalValue = sanitize.mobile(value);
    } else if (name === 'pan') {
      finalValue = sanitize.pan(value);
    } else if (name === 'aadhar') {
      finalValue = sanitize.aadhaar(value);
    } else if (name === 'pincode' || name === 'permPincode') {
      finalValue = sanitize.pincode(value);
    } else if (name === 'bankIfsc') {
      finalValue = sanitize.ifsc(value);
    } else if (name === 'bankAccNum' || name === 'bankAccNumConfirm') {
      finalValue = sanitize.bankAccount(value);
    }
    setForm(f => ({ ...f, [name]: finalValue }));
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
          area: f.area || info.Name,
          district: info.District,
          state: info.State,
          presentAddress: f.presentAddress || `${info.Name}, ${info.District}, ${info.State} - ${pincode}`
        }));
        toast.success(`📍 ${info.Name}, ${info.District}, ${info.State}`);
      }
    } catch { /* ignore */ }
    finally { setFetchingPin(false); }
  };

  const fetchPermPincode = async (pincode) => {
    if (pincode?.length !== 6) return;
    setFetchingPermPin(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data[0]?.Status === 'Success') {
        const info = data[0].PostOffice[0];
        setForm(f => ({
          ...f,
          permArea: f.permArea || info.Name,
          permDistrict: info.District,
          permState: info.State,
          permAddress: f.permAddress || `${info.Name}, ${info.District}, ${info.State} - ${pincode}`
        }));
        toast.success(`📍 ${info.Name}, ${info.District}, ${info.State}`);
      }
    } catch { /* ignore */ }
    finally { setFetchingPermPin(false); }
  };

  const handleSameAddress = (checked) => {
    setSameAddress(checked);
    if (checked) {
      setForm(f => ({
        ...f,
        permAddress: f.presentAddress,
        permArea: f.area,
        permPincode: f.pincode,
        permDistrict: f.district,
        permState: f.state,
      }));
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    toast.loading('Fetching location...');
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

    // Validations (Non-invasive, only checks format if provided or already required)
    if (form.mobile && !validate.mobile(form.mobile)) {
      toast.error('Mobile Number must be a valid 10-digit number starting with 6-9');
      return;
    }
    if (form.pan && !validate.pan(form.pan)) {
      toast.error('Invalid PAN format (e.g. ABCDE1234F)');
      return;
    }
    if (form.aadhar && !validate.aadhaar(form.aadhar)) {
      toast.error('Aadhaar Number must be exactly 12 digits');
      return;
    }
    if (form.pincode && !validate.pincode(form.pincode)) {
      toast.error('Pincode must be exactly 6 digits');
      return;
    }

    // Bank Details Validations
    if (!form.bankAccType) {
      toast.error('Please select Bank Account Type (Savings / Current)');
      return;
    }
    if (!form.bankAccName || form.bankAccName.trim().length < 2) {
      toast.error('Please enter valid Account Holder Name');
      return;
    }
    if (!form.bankName || form.bankName.trim().length < 2) {
      toast.error('Please enter valid Bank Name');
      return;
    }
    if (!form.bankBranch || form.bankBranch.trim().length < 2) {
      toast.error('Please enter Branch Name');
      return;
    }
    if (!form.bankAccNum || !validate.bankAccount(form.bankAccNum)) {
      toast.error('Account Number must be 9 to 18 digits');
      return;
    }
    if (!form.bankAccNumConfirm) {
      toast.error('Please confirm your Bank Account Number');
      return;
    }
    if (form.bankAccNum !== form.bankAccNumConfirm) {
      toast.error('Bank account numbers do not match!');
      return;
    }
    if (!form.bankIfsc || !validate.ifsc(form.bankIfsc)) {
      toast.error('Invalid IFSC Code format (e.g. SBIN0001234 - 4 letters, 0, 6 characters)');
      return;
    }

    if (form.fathersMobile && !validate.mobile(form.fathersMobile)) {
      toast.error("Father's Mobile must be 10 digits");
      return;
    }
    if (form.ref1Mobile && !validate.mobile(form.ref1Mobile)) {
      toast.error('Reference 1 Mobile must be 10 digits');
      return;
    }
    if (form.ref2Mobile && !validate.mobile(form.ref2Mobile)) {
      toast.error('Reference 2 Mobile must be 10 digits');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();

      // Append all text fields
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          // If it is city/area, send to city
          if (k === 'area') {
            fd.append('city', v);
          } else {
            fd.append(k, v);
          }
        }
      });

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

  // ── Loading / Error / Success states ──────────────────────────────────────────

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

  // ── Main Form ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] rounded-2xl p-6 mb-8 text-white shadow-lg">
          <p className="text-sm font-semibold opacity-80 mb-1">Welcome to HAUS Nuo-Pay</p>
          <h1 className="text-2xl font-extrabold mb-1">{employee.name}</h1>
          <p className="text-sm opacity-90">{employee.designation} · {employee.division}</p>
          <p className="text-xs mt-1 opacity-90 font-medium">{employee.email}</p>
          <p className="text-xs mt-1 opacity-70">Employee ID: {employee.empId}</p>
          <div className="mt-4 bg-white/10 rounded-xl p-3 text-sm">
            <p>Please fill this form carefully. All the information you submit will be verified by HR.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={User} title="Personal Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="Email Address" 
                required 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="Your email address" 
                type="email" 
                readOnly={prefilledFields.email}
                disabled={prefilledFields.email}
              />
              <Input 
                label="Mobile Number" 
                required 
                name="mobile" 
                value={form.mobile} 
                onChange={handleChange} 
                placeholder="Your contact number" 
                type="tel" 
                readOnly={prefilledFields.mobile}
                disabled={prefilledFields.mobile}
              />
              <Input 
                label="Father's Name" 
                required 
                name="fathersName" 
                value={form.fathersName} 
                onChange={handleChange} 
                placeholder="Enter father's full name" 
                readOnly={prefilledFields.fathersName}
                disabled={prefilledFields.fathersName}
              />
              <Input 
                label="Father's Mobile" 
                name="fathersMobile" 
                value={form.fathersMobile} 
                onChange={handleChange} 
                placeholder="Father's mobile number" 
                type="tel" 
                readOnly={prefilledFields.fathersMobile}
                disabled={prefilledFields.fathersMobile}
              />
              <Input 
                label="Mother's Name" 
                name="mothersName" 
                value={form.mothersName} 
                onChange={handleChange} 
                placeholder="Enter mother's full name" 
                readOnly={prefilledFields.mothersName}
                disabled={prefilledFields.mothersName}
              />
              <Select 
                label="Marital Status" 
                required 
                name="maritalStatus" 
                value={form.maritalStatus} 
                onChange={handleChange} 
                options={MARITAL_STATUS} 
                readOnly={prefilledFields.maritalStatus}
                disabled={prefilledFields.maritalStatus}
              />
              {form.maritalStatus === 'Married' && (
                <Input
                  label="Spouse Name"
                  name="spouseName"
                  value={form.spouseName}
                  onChange={handleChange}
                  placeholder="Enter spouse's full name"
                  readOnly={prefilledFields.spouseName}
                  disabled={prefilledFields.spouseName}
                />
              )}
              <Input 
                label="Driving Licence No." 
                name="drivingLicence" 
                value={form.drivingLicence} 
                onChange={handleChange} 
                placeholder="DL number (if any)" 
                readOnly={prefilledFields.drivingLicence}
                disabled={prefilledFields.drivingLicence}
              />
              <Input 
                label="Vehicle Number" 
                name="vehicleNumber" 
                value={form.vehicleNumber} 
                onChange={handleChange} 
                placeholder="Vehicle number (if any)" 
                readOnly={prefilledFields.vehicleNumber}
                disabled={prefilledFields.vehicleNumber}
              />
            </div>
          </div>

          {/* Identity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={CreditCard} title="Identity Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="PAN Number" 
                required 
                name="pan" 
                value={form.pan} 
                onChange={handleChange} 
                placeholder="ABCDE1234F" 
                readOnly={prefilledFields.pan}
                disabled={prefilledFields.pan}
              />
              <Input 
                label="Aadhaar Number" 
                required 
                name="aadhar" 
                value={form.aadhar} 
                onChange={handleChange} 
                placeholder="12-digit Aadhaar" 
                readOnly={prefilledFields.aadhar}
                disabled={prefilledFields.aadhar}
              />
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={Home} title="Address Details" />

            {/* ── Present Address ────────────────────────────────── */}
            <p className="text-xs font-bold text-[#0EA5E9] uppercase tracking-widest mb-3">Present / Current Address</p>

            {/* Pincode + Location Button */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <Input
                  label="Pincode"
                  name="pincode"
                  value={form.pincode || ''}
                  onChange={e => { handleChange(e); if (e.target.value.length === 6) fetchPincode(e.target.value); }}
                  placeholder="6-digit pincode"
                />
              </div>
              <button type="button" onClick={getCurrentLocation}
                className="mt-7 flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#0EA5E9] border border-[#0EA5E9] rounded-xl hover:bg-[#0EA5E9]/10 transition-colors whitespace-nowrap">
                <Navigation size={13} /> Use My Location
              </button>
            </div>

            {/* Area / District / State */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <Input
                label="Area / Locality"
                name="area"
                value={form.area || ''}
                onChange={handleChange}
                placeholder="e.g. Amaon / Colony"
              />
              <Input
                label="District"
                name="district"
                value={form.district || pincodeInfo.district || ''}
                placeholder="Auto-filled from pincode"
                readOnly
                disabled
              />
              <Input
                label="State"
                name="state"
                value={form.state || pincodeInfo.state || ''}
                placeholder="Auto-filled from pincode"
                readOnly
                disabled
              />
            </div>

            {/* Present Address textarea + Landmark */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Field label="Street / House No." required>
                <textarea required name="presentAddress" value={form.presentAddress} onChange={handleChange} rows={3}
                  placeholder="House No., Street, Colony..."
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl text-base bg-white outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all resize-none" />
              </Field>
              <Input label="Landmark" name="landmark" value={form.landmark} onChange={handleChange} placeholder="Nearby landmark (optional)" />
            </div>

            {/* ── Permanent Address ──────────────────────────────── */}
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Permanent / Residential Address</p>
                {/* Same as Present Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <div
                    onClick={() => handleSameAddress(!sameAddress)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      sameAddress ? 'bg-[#0EA5E9] border-[#0EA5E9]' : 'border-gray-300 bg-white group-hover:border-[#0EA5E9]'
                    }`}>
                    {sameAddress && (
                      <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
                        <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Same as Present Address</span>
                </label>
              </div>

              {/* Perm Pincode */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <Input
                    label="Pincode"
                    name="permPincode"
                    value={form.permPincode || ''}
                    onChange={e => { handleChange(e); if (e.target.value.length === 6) fetchPermPincode(e.target.value); }}
                    placeholder="6-digit pincode"
                    disabled={sameAddress}
                    readOnly={sameAddress}
                  />
                </div>
                {fetchingPermPin && <div className="mt-7 flex items-center text-xs text-gray-400 gap-1"><Loader2 size={14} className="animate-spin" /> Fetching...</div>}
              </div>

              {/* Perm Area / District / State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <Input
                  label="Area / Locality"
                  name="permArea"
                  value={form.permArea || ''}
                  onChange={handleChange}
                  placeholder="e.g. Amaon / Colony"
                  disabled={sameAddress}
                  readOnly={sameAddress}
                />
                <Input
                  label="District"
                  name="permDistrict"
                  value={form.permDistrict || ''}
                  placeholder="Auto-filled from pincode"
                  readOnly
                  disabled
                />
                <Input
                  label="State"
                  name="permState"
                  value={form.permState || ''}
                  placeholder="Auto-filled from pincode"
                  readOnly
                  disabled
                />
              </div>

              {/* Perm Address textarea */}
              <Field label="Street / House No." required>
                <textarea
                  required
                  name="permAddress"
                  value={form.permAddress || ''}
                  onChange={handleChange}
                  rows={3}
                  disabled={sameAddress}
                  placeholder="House No., Street, Colony..."
                  className={`w-full px-5 py-4 border border-gray-200 rounded-xl text-base outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/10 transition-all resize-none ${
                    sameAddress ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white'
                  }`} />
              </Field>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={Landmark} title="Bank Account Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Account Type" required name="bankAccType" value={form.bankAccType} onChange={handleChange} options={['Savings', 'Current']} readOnly={prefilledFields.bankAccType} disabled={prefilledFields.bankAccType} />
              <Input label="Account Holder Name" required name="bankAccName" value={form.bankAccName} onChange={handleChange} placeholder="As per bank records" readOnly={prefilledFields.bankAccName} disabled={prefilledFields.bankAccName} />
              <Input label="Bank Name" required name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. SBI, HDFC" readOnly={prefilledFields.bankName} disabled={prefilledFields.bankName} />
              <Input label="Branch Name" required name="bankBranch" value={form.bankBranch} onChange={handleChange} placeholder="Branch name" readOnly={prefilledFields.bankBranch} disabled={prefilledFields.bankBranch} />
              <Input label="Account Number" required name="bankAccNum" value={form.bankAccNum} onChange={handleChange} placeholder="Account number" type="password" />
              <Input label="Confirm Account Number" required name="bankAccNumConfirm" value={form.bankAccNumConfirm} onChange={handleChange} placeholder="Re-enter account number" />
              <Input label="IFSC Code" required name="bankIfsc" value={form.bankIfsc} onChange={handleChange} placeholder="e.g. SBIN0001234" readOnly={prefilledFields.bankIfsc} disabled={prefilledFields.bankIfsc} />
            </div>
          </div>

          {/* Qualification */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={GraduationCap} title="Highest Qualification" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Qualification" required name="qual1Type" value={form.qual1Type} onChange={handleChange} options={QUALIFICATIONS} readOnly={prefilledFields.qual1Type} disabled={prefilledFields.qual1Type} />
              <Input label="Institution / College" required name="qual1Inst" value={form.qual1Inst} onChange={handleChange} placeholder="Name of institution" readOnly={prefilledFields.qual1Inst} disabled={prefilledFields.qual1Inst} />
              <Input label="District" name="qual1Dist" value={form.qual1Dist} onChange={handleChange} placeholder="District of institution" readOnly={prefilledFields.qual1Dist} disabled={prefilledFields.qual1Dist} />
              <Input label="Passing Year" name="qual1Year" value={form.qual1Year} onChange={handleChange} placeholder="e.g. 2020" type="number" readOnly={prefilledFields.qual1Year} disabled={prefilledFields.qual1Year} />
              <Input label="Percentage / CGPA" name="qual1Perc" value={form.qual1Perc} onChange={handleChange} placeholder="e.g. 75% or 7.5 CGPA" readOnly={prefilledFields.qual1Perc} disabled={prefilledFields.qual1Perc} />
            </div>
          </div>

          {/* Previous Experience */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={Briefcase} title="Previous Work Experience" />
            <p className="text-xs text-gray-400 mb-4">Fill only if you have prior work experience.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Company Name" name="expCompany" value={form.expCompany} onChange={handleChange} placeholder="Previous employer" readOnly={prefilledFields.expCompany} disabled={prefilledFields.expCompany} />
              <Input label="Position / Designation" name="expPosition" value={form.expPosition} onChange={handleChange} placeholder="Your role" readOnly={prefilledFields.expPosition} disabled={prefilledFields.expPosition} />
              <Input label="Company Phone" name="expPhone" value={form.expPhone} onChange={handleChange} placeholder="Company contact number" type="tel" readOnly={prefilledFields.expPhone} disabled={prefilledFields.expPhone} />
              <Input label="From Date" name="expStart" value={form.expStart} onChange={handleChange} type="date" readOnly={prefilledFields.expStart} disabled={prefilledFields.expStart} />
              <Input label="To Date" name="expEnd" value={form.expEnd} onChange={handleChange} type="date" readOnly={prefilledFields.expEnd} disabled={prefilledFields.expEnd} />
              <Input label="Gross Salary (₹)" name="expGross" value={form.expGross} onChange={handleChange} placeholder="Yearly gross" type="number" readOnly={prefilledFields.expGross} disabled={prefilledFields.expGross} />
              <Input label="Monthly In-Hand (₹)" name="expMonthly" value={form.expMonthly} onChange={handleChange} placeholder="Monthly net" type="number" readOnly={prefilledFields.expMonthly} disabled={prefilledFields.expMonthly} />
              <Input label="Reason for Leaving" name="expReason" value={form.expReason} onChange={handleChange} placeholder="Why did you leave?" readOnly={prefilledFields.expReason} disabled={prefilledFields.expReason} />
              <div className="sm:col-span-2">
                <Input label="Company Address" name="expAddress" value={form.expAddress} onChange={handleChange} placeholder="Full company address" readOnly={prefilledFields.expAddress} disabled={prefilledFields.expAddress} />
              </div>
              <Input label="Reporting Manager Name" name="expRmName" value={form.expRmName} onChange={handleChange} placeholder="Manager's name" readOnly={prefilledFields.expRmName} disabled={prefilledFields.expRmName} />
              <Input label="Manager Designation" name="expRmDesig" value={form.expRmDesig} onChange={handleChange} placeholder="Manager's designation" readOnly={prefilledFields.expRmDesig} disabled={prefilledFields.expRmDesig} />
              <Input label="Manager Mobile" name="expRmMobile" value={form.expRmMobile} onChange={handleChange} placeholder="Manager's phone" type="tel" readOnly={prefilledFields.expRmMobile} disabled={prefilledFields.expRmMobile} />
              <Input label="Manager Email" name="expRmEmail" value={form.expRmEmail} onChange={handleChange} placeholder="Manager's email" type="email" readOnly={prefilledFields.expRmEmail} disabled={prefilledFields.expRmEmail} />
              <Input label="Manager Branch" name="expRmBranch" value={form.expRmBranch} onChange={handleChange} placeholder="Branch/Office" readOnly={prefilledFields.expRmBranch} disabled={prefilledFields.expRmBranch} />
            </div>
          </div>

          {/* References */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader icon={Users2} title="Personal References" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Input label="Ref 1 - Relationship" required name="ref1Rel" value={form.ref1Rel} onChange={handleChange} placeholder="e.g. Friend, Teacher" />
              <Input label="Ref 1 - Name" required name="ref1Name" value={form.ref1Name} onChange={handleChange} placeholder="Full name" />
              <Input label="Ref 1 - Mobile" required name="ref1Mobile" value={form.ref1Mobile} onChange={handleChange} placeholder="Mobile number" type="tel" />
              <Input label="Ref 1 - Address" name="ref1Address" value={form.ref1Address} onChange={handleChange} placeholder="Address" />
            </div>
            <div className="border-t border-gray-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Ref 2 - Relationship" name="ref2Rel" value={form.ref2Rel} onChange={handleChange} placeholder="e.g. Colleague" />
              <Input label="Ref 2 - Name" name="ref2Name" value={form.ref2Name} onChange={handleChange} placeholder="Full name" />
              <Input label="Ref 2 - Mobile" name="ref2Mobile" value={form.ref2Mobile} onChange={handleChange} placeholder="Mobile number" type="tel" />
              <Input label="Ref 2 - Address" name="ref2Address" value={form.ref2Address} onChange={handleChange} placeholder="Address" />
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
                      {files[doc.key] ? files[doc.key].name.slice(0, 18) + '...' : 'Upload'}
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
            {submitting ? 'Submitting...' : 'Submit Onboarding Form'}
          </button>

          <p className="text-center text-xs text-gray-400 pb-4">
            All information is confidential and will be used only for employment verification purposes.
          </p>
        </form>
      </div>
    </div>
  );
}
