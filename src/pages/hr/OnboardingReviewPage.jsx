import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  User, Mail, Phone, Home, CreditCard, Briefcase, GraduationCap,
  Building2, FileText, CheckCircle2, Shield, ArrowLeft, Loader2,
  BadgeCheck, Landmark, Users2, Eye, Check, X, AlertCircle, CheckSquare,
  Crown, ExternalLink, Calendar, MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://loan-management-backend-wu4y.onrender.com/api';
const API = API_BASE.replace('/api', '');

const DOC_LABEL = {
  aadhar: 'Aadhaar Card',
  pan: 'PAN Card',
  degree: 'Degree / Marksheet',
  photo: 'Passport-size Photo',
  bankPassbook: 'Bank Passbook / Cancelled Cheque',
  offerLetter: 'Previous Offer Letter',
  experienceLetter: 'Experience Letter',
};

const SectionCard = ({ icon: Icon, title, children, badge }) => (
  <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 mb-6">
    <div className="flex items-center justify-between pb-3 mb-5 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Icon size={18} />
        </div>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
      </div>
      {badge && (
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          {badge}
        </span>
      )}
    </div>
    {children}
  </div>
);

const DetailItem = ({ label, value, isMonospace, isBadge }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
    {isBadge ? (
      <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
        {value || 'N/A'}
      </span>
    ) : (
      <p className={`text-sm font-semibold text-gray-800 ${isMonospace ? 'font-mono' : ''}`}>
        {value ? String(value) : <span className="text-gray-400 font-normal italic">Not provided</span>}
      </p>
    )}
  </div>
);

export default function OnboardingReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingDoc, setUpdatingDoc] = useState(null);
  const [markingDone, setMarkingDone] = useState(false);

  const fetchEmployeeData = async () => {
    try {
      const res = await fetch(`${API}/api/employees/onboarding/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEmployee(data);
      } else {
        toast.error('Failed to load employee details');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEmployeeData();
  }, [id]);

  const handleDocStatus = async (docId, newStatus) => {
    setUpdatingDoc(docId);
    try {
      const res = await fetch(`${API}/api/employees/${id}/documents/${docId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Document marked as ${newStatus}`);
        fetchEmployeeData();
      } else {
        toast.error('Failed to update document status');
      }
    } catch {
      toast.error('Server error');
    } finally {
      setUpdatingDoc(null);
    }
  };

  const markComplete = async () => {
    setMarkingDone(true);
    try {
      const res = await fetch(`${API}/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ onboardingStatus: 'Done' }),
      });
      if (res.ok) {
        toast.success('Onboarding marked as completed successfully!');
        fetchEmployeeData();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || 'Failed to complete onboarding. All documents must be verified first.');
      }
    } catch {
      toast.error('Server error');
    } finally {
      setMarkingDone(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 size={36} className="animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-semibold text-gray-600">Loading full candidate onboarding form...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <AlertCircle size={48} className="text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-1">Candidate Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">Could not load candidate record with ID: {id}</p>
        <button
          onClick={() => navigate('/hr/onboarding')}
          className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow hover:bg-blue-700"
        >
          Back to Onboarding Queue
        </button>
      </div>
    );
  }

  const isHead = (employee.designation || '').toLowerCase().includes('head') || (employee.role || '').toLowerCase().includes('head') || (employee.division || '').toLowerCase().includes('head');
  const docs = employee.documents || [];
  const allVerified = docs.length > 0 && docs.every(d => d.status === 'Verified');

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Top Header / Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/hr/onboarding')}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors shadow-xs"
              title="Back to Onboarding Queue"
            >
              <ArrowLeft size={18} />
            </button>
            {(() => {
              const photoDoc = (employee.documents || []).find(d => 
                (d.key && (d.key.toLowerCase().includes('photo') || d.key === 'Passport Photo')) ||
                (d.name && d.name.toLowerCase().includes('photo'))
              );
              const avatarPath = employee.avatar || photoDoc?.fileUrl;
              if (avatarPath) {
                const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace('/api', '');
                const fullSrc = (avatarPath.startsWith('http') || avatarPath.startsWith('data:')) ? avatarPath : `${apiBase}/${avatarPath.startsWith('/') ? avatarPath.slice(1) : avatarPath}`;
                return (
                  <img
                    src={fullSrc}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-blue-100 shrink-0"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                );
              }
              return (
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0 uppercase">
                  {(employee.name || 'E').charAt(0)}
                </div>
              );
            })()}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900">{employee.name}</h1>
                {isHead && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
                    <Crown size={12} className="text-amber-700" /> Department Head
                  </span>
                )}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  employee.onboardingStatus === 'Done' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  Status: {employee.onboardingStatus || 'Submitted'}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {employee.designation} &middot; {employee.division || 'Corporate'} &middot; <span className="font-mono">{employee.empId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {employee.onboardingStatus !== 'Done' ? (
              <button
                onClick={markComplete}
                disabled={markingDone}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                {markingDone ? 'Completing...' : 'Approve & Mark Onboarding Complete'}
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-bold">
                <CheckCircle2 size={16} /> Onboarding Form Completed
              </div>
            )}
          </div>
        </div>

        {/* ── Grid Layout ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left / Main Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Personal Information */}
            <SectionCard icon={User} title="Personal Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <DetailItem label="Full Name" value={employee.name} />
                <DetailItem label="Email Address" value={employee.email} />
                <DetailItem label="Mobile Number" value={employee.mobile} isMonospace />
                <DetailItem label="Father's Name" value={employee.fathersName} />
                <DetailItem label="Father's Contact" value={employee.fathersMobile} isMonospace />
                <DetailItem label="Mother's Name" value={employee.mothersName} />
                <DetailItem label="Marital Status" value={employee.maritalStatus} isBadge />
                <DetailItem label="Driving Licence" value={employee.drivingLicence} isMonospace />
                <DetailItem label="Vehicle Number" value={employee.vehicleNumber} isMonospace />
              </div>
            </SectionCard>

            {/* 2. Identity & KYC Details */}
            <SectionCard icon={CreditCard} title="Identity & KYC Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <DetailItem label="PAN Card Number" value={employee.pan} isMonospace />
                <DetailItem label="Aadhaar Card Number" value={employee.aadhar} isMonospace />
              </div>
            </SectionCard>

            {/* 3. Address Details */}
            <SectionCard icon={Home} title="Address Details">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                  <DetailItem label="Pincode" value={employee.pincode} isMonospace />
                  <DetailItem label="District / City" value={employee.district || employee.city} />
                  <DetailItem label="State" value={employee.state} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <DetailItem label="Present / Current Address" value={employee.presentAddress} />
                  <DetailItem label="Permanent Address" value={employee.permanentAddress} />
                  <DetailItem label="Nearby Landmark" value={employee.landmark} />
                </div>
              </div>
            </SectionCard>

            {/* 4. Bank Account Details */}
            <SectionCard icon={Landmark} title="Bank Account Details (For Salary & Payroll)">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <DetailItem label="Bank Account Type" value={employee.bankAccType || 'Savings'} isBadge />
                <DetailItem label="Account Holder Name" value={employee.bankAccName || employee.name} />
                <DetailItem label="Bank Name" value={employee.bankName} />
                <DetailItem label="Branch Name" value={employee.bankBranch} />
                <DetailItem label="Account Number" value={employee.bankAccNum} isMonospace />
                <DetailItem label="IFSC Code" value={employee.bankIfsc} isMonospace />
              </div>
            </SectionCard>

            {/* 5. Highest Qualification */}
            <SectionCard icon={GraduationCap} title="Highest Educational Qualification">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <DetailItem label="Degree / Course" value={employee.qual1Type} isBadge />
                <DetailItem label="College / University" value={employee.qual1Inst} />
                <DetailItem label="District" value={employee.qual1Dist} />
                <DetailItem label="Passing Year" value={employee.qual1Year} isMonospace />
                <DetailItem label="Percentage / CGPA" value={employee.qual1Perc} isMonospace />
              </div>
            </SectionCard>

            {/* 6. Previous Work Experience */}
            <SectionCard icon={Briefcase} title="Previous Work Experience">
              {employee.expCompany ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    <DetailItem label="Previous Company" value={employee.expCompany} />
                    <DetailItem label="Designation / Role" value={employee.expPosition} />
                    <DetailItem label="Company Phone" value={employee.expPhone} isMonospace />
                    <DetailItem label="Tenure" value={employee.expStart ? `${employee.expStart} to ${employee.expEnd || 'Present'}` : null} />
                    <DetailItem label="Gross Salary (Annual)" value={employee.expGross ? `₹${employee.expGross}` : null} />
                    <DetailItem label="Monthly In-Hand" value={employee.expMonthly ? `₹${employee.expMonthly}` : null} />
                    <DetailItem label="Reason for Leaving" value={employee.expReason} />
                    <DetailItem label="Company Location" value={employee.expAddress} />
                  </div>
                  {(employee.expRmName || employee.expRmMobile) && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <DetailItem label="Prev Manager Name" value={employee.expRmName} />
                      <DetailItem label="Manager Designation" value={employee.expRmDesig} />
                      <DetailItem label="Manager Contact" value={employee.expRmMobile} isMonospace />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No prior experience details provided (Fresher or Not Applicable).</p>
              )}
            </SectionCard>

            {/* 7. Personal References */}
            <SectionCard icon={Users2} title="Personal References">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Ref 1 */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text-xs font-bold text-gray-700">Reference 1</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">{employee.ref1Rel || 'Primary'}</span>
                  </div>
                  <DetailItem label="Name" value={employee.ref1Name} />
                  <DetailItem label="Mobile" value={employee.ref1Mobile} isMonospace />
                  <DetailItem label="Address" value={employee.ref1Address} />
                </div>

                {/* Ref 2 */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text-xs font-bold text-gray-700">Reference 2</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 text-gray-700 rounded">{employee.ref2Rel || 'Secondary'}</span>
                  </div>
                  <DetailItem label="Name" value={employee.ref2Name} />
                  <DetailItem label="Mobile" value={employee.ref2Mobile} isMonospace />
                  <DetailItem label="Address" value={employee.ref2Address} />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Right Sidebar: Document Verification Queue (1 Col) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <FileText size={18} className="text-blue-600" />
                  <h3 className="font-bold text-gray-900 text-sm">Uploaded Documents</h3>
                </div>
                <span className="text-xs font-extrabold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                  {docs.length} Attached
                </span>
              </div>

              {docs.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <FileText size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">No documents attached yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {docs.map((doc, idx) => {
                    const docName = DOC_LABEL[doc.key] || doc.name;
                    return (
                      <div key={doc._id || idx} className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold text-gray-900">{docName}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-GB') : 'Attached'}</p>
                          </div>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                            doc.status === 'Verified' ? 'bg-green-100 text-green-700 border border-green-200' :
                            doc.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                            'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {doc.status || 'Pending'}
                          </span>
                        </div>

                        {doc.fileUrl ? (
                          <div className="pt-1">
                            <a
                              href={`${API}/${doc.fileUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 rounded-lg text-xs font-bold transition-all shadow-xs"
                            >
                              <Eye size={12} /> View File
                            </a>
                          </div>
                        ) : (
                          <p className="text-[11px] text-gray-400 italic">No file URL attached</p>
                        )}

                        {/* Verify / Reject Buttons */}
                        <div className="flex items-center gap-2 pt-1 border-t border-gray-200/60">
                          {doc.status !== 'Verified' && (
                            <button
                              disabled={updatingDoc === doc._id}
                              onClick={() => handleDocStatus(doc._id, 'Verified')}
                              className="flex-1 flex items-center justify-center gap-1 py-1 px-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors disabled:opacity-50"
                            >
                              <Check size={12} /> Verify
                            </button>
                          )}
                          {doc.status !== 'Rejected' && doc.status !== 'Verified' && (
                            <button
                              disabled={updatingDoc === doc._id}
                              onClick={() => handleDocStatus(doc._id, 'Rejected')}
                              className="flex-1 flex items-center justify-center gap-1 py-1 px-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-[11px] font-bold transition-colors disabled:opacity-50"
                            >
                              <X size={12} /> Reject
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Complete Onboarding Button in Sidebar */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={markComplete}
                  disabled={markingDone || employee.onboardingStatus === 'Done'}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckSquare size={15} />
                  {markingDone ? 'Completing...' : employee.onboardingStatus === 'Done' ? 'Already Completed' : 'Mark Onboarding Complete'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
