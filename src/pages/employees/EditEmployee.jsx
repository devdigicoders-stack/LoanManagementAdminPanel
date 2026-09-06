import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ArrowLeft, Upload, Mail, Phone, Briefcase, 
  User, Shield, Lock, FileText, Building2, Check, X, 
  ExternalLink, Copy, CheckCircle2, AlertCircle, Eye, EyeOff, 
  MapPin, Plus, Trash2, KeyRound, DollarSign, GraduationCap, 
  Clock, ShieldCheck
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ALL_ROLES = [
  'Admin', 'HR Admin', 'Operation Admin', 'Sales Admin',
  'Accountant Admin', 'Credit Admin', 'Tele callers operator', 'Agent operator',
  'HR Manager', 'Operational Head', 'Operational Manager', 'Reporting Manager',
  'Secured Loan Manager', 'Unsecured Loan Manager', 'Agent Manager',
  'Secured Executive', 'Unsecured Executive', 'Agent Executive',
  'Telecaller', 'Senior Telecaller'
];

const PERMISSION_GROUPS = [
  {
    category: 'User & Employee Management',
    permissions: ['Manage Users', 'Manage Employees', 'Role & Permission Management']
  },
  {
    category: 'Leads & Pipeline',
    permissions: ['Lead Management', 'Assign Lead to Employee', 'Status Management']
  },
  {
    category: 'Loans & Underwriting',
    permissions: ['View Loan Applications', 'Approve/Reject/Hold Loan', 'Verify Documents', 'Download Documents']
  },
  {
    category: 'Job Hiring & Recruitment',
    permissions: ['View Job', 'Add Job', 'Edit Job', 'Delete Job', 'Active / Inactive Job', 'Publish Job', 'Assign Job Application']
  },
  {
    category: 'Operations, Finance & Reports',
    permissions: ['Send Reminders/SMS', 'View Reports', 'Export Data', 'Payroll/Salary']
  }
];

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('Personal');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New document modal / form state
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocData, setNewDocData] = useState({ name: '', key: 'other', fileUrl: '' });

  const [formData, setFormData] = useState({
    empId: '',
    name: '',
    email: '',
    mobile: '',
    designation: '',
    division: '',
    role: '',
    status: 'Active',
    onboardingStatus: 'Pending',
    password: '',

    // Personal
    fathersName: '',
    mothersName: '',
    fathersMobile: '',
    maritalStatus: '',
    drivingLicence: '',
    vehicleNumber: '',
    presentAddress: '',
    permanentAddress: '',
    landmark: '',
    pincode: '',
    district: '',
    state: '',
    city: '',

    // Employment / Salary
    grossMonthly: '',
    transportation: '',
    performance: '',
    achievement: '',
    incentives: '',

    // Qualification
    qual1Type: '',
    qual1Inst: '',
    qual1Dist: '',
    qual1Year: '',
    qual1Perc: '',

    // Previous Experience
    expCompany: '',
    expPosition: '',
    expPhone: '',
    expStart: '',
    expEnd: '',
    expMonthly: '',
    expReason: '',
    expAddress: '',
    expRmName: '',
    expRmDesig: '',
    expRmMobile: '',
    expRmEmail: '',

    // Bank
    bankName: '',
    bankAccName: '',
    bankAccType: '',
    bankAccNum: '',
    bankIfsc: '',
    bankBranch: '',

    // References
    ref1Name: '',
    ref1Rel: '',
    ref1Mobile: '',
    ref1Address: '',
    ref2Name: '',
    ref2Rel: '',
    ref2Mobile: '',
    ref2Address: '',

    // Documents & Identity
    pan: '',
    aadhar: '',
    documents: [],

    // Permissions
    permissions: []
  });

  const authRoles = [
    'Admin', 'HR Admin', 'Operation Admin', 'Sales Admin',
    'Tele callers operator', 'Agent operator', 'Accountant Admin', 'Credit Admin'
  ];
  const needsAuth = authRoles.includes(formData.role);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setFormData({
            empId: data.empId || '',
            name: data.name || '',
            email: data.email || '',
            mobile: data.mobile || '',
            designation: data.designation || '',
            division: data.division || '',
            role: data.role || '',
            status: data.status || 'Active',
            onboardingStatus: data.onboardingStatus || 'Pending',
            password: '',

            // Personal
            fathersName: data.fathersName || '',
            mothersName: data.mothersName || '',
            fathersMobile: data.fathersMobile || '',
            maritalStatus: data.maritalStatus || '',
            drivingLicence: data.drivingLicence || '',
            vehicleNumber: data.vehicleNumber || '',
            presentAddress: data.presentAddress || '',
            permanentAddress: data.permanentAddress || '',
            landmark: data.landmark || '',
            pincode: data.pincode || '',
            district: data.district || '',
            state: data.state || '',
            city: data.city || '',

            // Employment / Salary
            grossMonthly: data.grossMonthly || '',
            transportation: data.transportation || '',
            performance: data.performance || '',
            achievement: data.achievement || '',
            incentives: data.incentives || '',

            // Qualification
            qual1Type: data.qual1Type || '',
            qual1Inst: data.qual1Inst || '',
            qual1Dist: data.qual1Dist || '',
            qual1Year: data.qual1Year || '',
            qual1Perc: data.qual1Perc || '',

            // Previous Experience
            expCompany: data.expCompany || '',
            expPosition: data.expPosition || '',
            expPhone: data.expPhone || '',
            expStart: data.expStart || '',
            expEnd: data.expEnd || '',
            expMonthly: data.expMonthly || '',
            expReason: data.expReason || '',
            expAddress: data.expAddress || '',
            expRmName: data.expRmName || '',
            expRmDesig: data.expRmDesig || '',
            expRmMobile: data.expRmMobile || '',
            expRmEmail: data.expRmEmail || '',

            // Bank
            bankName: data.bankName || '',
            bankAccName: data.bankAccName || '',
            bankAccType: data.bankAccType || '',
            bankAccNum: data.bankAccNum || '',
            bankIfsc: data.bankIfsc || '',
            bankBranch: data.bankBranch || '',

            // References
            ref1Name: data.ref1Name || '',
            ref1Rel: data.ref1Rel || '',
            ref1Mobile: data.ref1Mobile || '',
            ref1Address: data.ref1Address || '',
            ref2Name: data.ref2Name || '',
            ref2Rel: data.ref2Rel || '',
            ref2Mobile: data.ref2Mobile || '',
            ref2Address: data.ref2Address || '',

            // Documents & Identity
            pan: data.pan || '',
            aadhar: data.aadhar || '',
            documents: Array.isArray(data.documents) ? data.documents : [],

            // Permissions
            permissions: Array.isArray(data.permissions) ? data.permissions : []
          });
        } else {
          toast.error('Failed to load employee details');
          navigate('/employees');
        }
      } catch (error) {
        toast.error('Server error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployee();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePincodeChange = async (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, pincode: value }));
    if (value.length === 6 && /^\d+$/.test(value)) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        if (data && data[0]?.Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setFormData(prev => ({
            ...prev,
            district: postOffice.District || prev.district,
            state: postOffice.State || prev.state,
            city: postOffice.Block || postOffice.Region || prev.city
          }));
          toast.success('City and state autofilled from Pincode!');
        }
      } catch (error) {
        console.error('Pincode fetch error', error);
      }
    }
  };

  const handleTogglePermission = (perm) => {
    setFormData(prev => {
      const current = prev.permissions || [];
      const updated = current.includes(perm)
        ? current.filter(p => p !== perm)
        : [...current, perm];
      return { ...prev, permissions: updated };
    });
  };

  const handleSelectAllPermissions = () => {
    const allPerms = PERMISSION_GROUPS.flatMap(g => g.permissions);
    setFormData(prev => ({ ...prev, permissions: allPerms }));
    toast.success('All permissions selected');
  };

  const handleClearAllPermissions = () => {
    setFormData(prev => ({ ...prev, permissions: [] }));
    toast.success('All permissions cleared');
  };

  const handleDocumentStatusChange = async (docId, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}/documents/${docId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Document marked as ${status}`);
        setFormData(prev => ({
          ...prev,
          documents: prev.documents.map(d => d._id === docId ? { ...d, status } : d)
        }));
      } else {
        toast.error('Failed to update document status');
      }
    } catch (e) {
      toast.error('Server error');
    }
  };

  const handleAddDocument = () => {
    if (!newDocData.name || !newDocData.fileUrl) {
      toast.error('Please enter document name and file URL');
      return;
    }

    const newDoc = {
      _id: 'doc_' + Date.now(),
      name: newDocData.name,
      key: newDocData.key || 'other',
      fileUrl: newDocData.fileUrl,
      status: 'Verified',
      uploadedAt: new Date().toISOString()
    };

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDoc]
    }));

    setNewDocData({ name: '', key: 'other', fileUrl: '' });
    setShowAddDocModal(false);
    toast.success('Document added! Click "Update Employee" to save changes permanently.');
  };

  const handleCopyOnboardingLink = () => {
    const link = `${window.location.origin}/onboarding/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      toast.success('Onboarding link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 3000);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success('Employee updated successfully!');
        navigate(`/employees/${id}`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to update employee');
      }
    } catch (error) {
      toast.error('Server error while updating');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'Personal', label: 'Personal', icon: User },
    { id: 'Employment', label: 'Employment', icon: Briefcase },
    { id: 'Account & Access', label: 'Account & Access', icon: KeyRound },
    { id: 'Role & Permissions', label: 'Role & Permissions', icon: Lock },
    { id: 'Documents', label: 'Documents', icon: FileText },
    { id: 'Additional', label: 'Additional', icon: Building2 }
  ];

  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-28 text-slate-500 font-medium">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#489b0d] border-t-transparent rounded-full animate-spin"></div>
          Loading employee details...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Edit Employee Profile</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/employees" className="hover:text-[#489b0d] transition-colors">Employee Management</Link>
            <ChevronRight size={14} className="mx-1 text-slate-400" />
            <Link to={`/employees/${id}`} className="hover:text-[#489b0d] transition-colors">{formData.empId || 'Details'}</Link>
            <ChevronRight size={14} className="mx-1 text-slate-400" />
            <span className="text-[#489b0d] font-bold">Edit Employee</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            to={`/employees/${id}`} 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Eye size={15} /> View Profile
          </Link>
          <Link 
            to="/employees" 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={15} /> Back to List
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* Left Column - Profile Card Summary */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">

            <div className="p-6 flex flex-col items-center border-b border-slate-100 text-center bg-gradient-to-b from-slate-50 to-white">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-3 bg-[#489b0d]/10 text-[#489b0d] font-extrabold text-3xl flex items-center justify-center">
                {formData.name?.charAt(0)?.toUpperCase() || 'E'}
              </div>
              <h2 className="text-lg font-extrabold text-slate-800 mb-0.5">{formData.name || 'Employee Name'}</h2>
              <p className="text-[13px] font-medium text-slate-500 mb-2">{formData.designation || 'Staff Member'}</p>
              
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  formData.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                }`}>
                  {formData.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                  {formData.role || 'No Role'}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3.5">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Employee ID</p>
                <p className="text-[13px] font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                  {formData.empId || 'Not Generated'}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700 truncate">
                  <Mail size={14} className="text-slate-400 shrink-0" /> 
                  <span className="truncate">{formData.email || 'N/A'}</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <Phone size={14} className="text-slate-400 shrink-0" /> {formData.mobile || 'N/A'}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <Briefcase size={14} className="text-slate-400 shrink-0" /> {formData.division || 'General'}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Onboarding Status</p>
                <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${
                  formData.onboardingStatus === 'Done' ? 'bg-emerald-50 text-emerald-700' :
                  formData.onboardingStatus === 'Submitted' ? 'bg-blue-50 text-blue-700' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  {formData.onboardingStatus || 'Pending'}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={handleCopyOnboardingLink}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
              >
                {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-slate-500" />}
                {copiedLink ? 'Copied Onboarding Link' : 'Copy Onboarding Link'}
              </button>
            </div>

          </div>
        </div>

        {/* Right Column - Form Tabs & Dynamic Content */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[640px]">

            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-2 md:gap-6 px-6 border-b border-slate-200 overflow-x-auto custom-scrollbar pt-2 shrink-0 bg-slate-50/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 text-[13px] font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                      isActive 
                        ? 'border-[#489b0d] text-[#489b0d] bg-white rounded-t-md px-3' 
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-[#489b0d]' : 'text-slate-400'} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Body Content */}
            <div className="p-6 md:p-8 flex-1">

              {/* ================= TAB 1: PERSONAL ================= */}
              {activeTab === 'Personal' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-800 mb-1">Personal Details</h3>
                    <p className="text-[12px] text-slate-500 font-medium">Update basic identifying and personal background information.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Primary Mobile Number <span className="text-red-500">*</span></label>
                      <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Marital Status</label>
                      <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all">
                        <option value="">- Select Marital Status -</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Father's Name</label>
                      <input type="text" name="fathersName" value={formData.fathersName} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Father's Mobile Number</label>
                      <input type="tel" name="fathersMobile" value={formData.fathersMobile} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Mother's Name</label>
                      <input type="text" name="mothersName" value={formData.mothersName} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Driving Licence Number</label>
                      <input type="text" name="drivingLicence" value={formData.drivingLicence} onChange={handleChange} placeholder="DL Number (optional)" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Vehicle Number</label>
                      <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="e.g. UP32AB1234 (optional)" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <MapPin size={16} className="text-[#489b0d]" /> Address Details
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Present / Current Address</label>
                        <textarea rows="2" name="presentAddress" value={formData.presentAddress} onChange={handleChange} placeholder="Complete local residential address..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all resize-none"></textarea>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Permanent Address</label>
                        <textarea rows="2" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} placeholder="Complete permanent home address..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all resize-none"></textarea>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Postal Pincode</label>
                        <input type="text" name="pincode" value={formData.pincode} onChange={handlePincodeChange} maxLength={6} placeholder="6-digit PIN code" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Landmark</label>
                        <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Nearby landmark" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">City / Town</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">District</label>
                        <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: EMPLOYMENT ================= */}
              {activeTab === 'Employment' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-800 mb-1">Employment & Compensation</h3>
                    <p className="text-[12px] text-slate-500 font-medium">Manage job designation, department, salary structure, and education/experience records.</p>
                  </div>

                  {/* Designation, Division & Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Designation <span className="text-red-500">*</span></label>
                      <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Department / Division <span className="text-red-500">*</span></label>
                      <input type="text" name="division" value={formData.division} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Assigned Role <span className="text-red-500">*</span></label>
                      <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-bold text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all">
                        <option value="">- Select Role -</option>
                        {ALL_ROLES.map((r, i) => (
                          <option key={i} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Employment Status</label>
                      <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Salary Structure */}
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <DollarSign size={16} className="text-[#489b0d]" /> Monthly & Annual Salary Structure
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Gross Monthly Salary (₹)</label>
                        <input type="number" name="grossMonthly" value={formData.grossMonthly} onChange={handleChange} placeholder="e.g. 25000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Calculated Annual Gross (₹)</label>
                        <input 
                          type="text" 
                          disabled 
                          value={formData.grossMonthly ? `₹ ${(parseFloat(formData.grossMonthly) * 12).toLocaleString('en-IN')}` : '₹ 0'} 
                          className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-md text-[13px] font-bold text-slate-600 cursor-not-allowed" 
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Transportation Allowance (₹)</label>
                        <input type="number" name="transportation" value={formData.transportation} onChange={handleChange} placeholder="e.g. 2000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Performance Bonus (₹)</label>
                        <input type="number" name="performance" value={formData.performance} onChange={handleChange} placeholder="e.g. 3000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Achievement Allowance (₹)</label>
                        <input type="number" name="achievement" value={formData.achievement} onChange={handleChange} placeholder="e.g. 1500" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Variable Incentives (₹)</label>
                        <input type="number" name="incentives" value={formData.incentives} onChange={handleChange} placeholder="e.g. 5000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Educational Qualification */}
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <GraduationCap size={16} className="text-[#489b0d]" /> Educational Qualification
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Highest Qualification</label>
                        <input type="text" name="qual1Type" value={formData.qual1Type} onChange={handleChange} placeholder="e.g. B.Tech / MBA / Graduate" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Institution / University</label>
                        <input type="text" name="qual1Inst" value={formData.qual1Inst} onChange={handleChange} placeholder="e.g. Lucknow University" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Passing Year</label>
                        <input type="text" name="qual1Year" value={formData.qual1Year} onChange={handleChange} placeholder="e.g. 2022" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">City / District</label>
                        <input type="text" name="qual1Dist" value={formData.qual1Dist} onChange={handleChange} placeholder="e.g. Lucknow" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Percentage / CGPA</label>
                        <input type="text" name="qual1Perc" value={formData.qual1Perc} onChange={handleChange} placeholder="e.g. 78% or 8.2 CGPA" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Previous Experience */}
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Clock size={16} className="text-[#489b0d]" /> Previous Work Experience
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Previous Company</label>
                        <input type="text" name="expCompany" value={formData.expCompany} onChange={handleChange} placeholder="e.g. ABC Finance Pvt Ltd" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Designation / Role</label>
                        <input type="text" name="expPosition" value={formData.expPosition} onChange={handleChange} placeholder="e.g. Loan Officer" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Last Drawn Monthly (₹)</label>
                        <input type="text" name="expMonthly" value={formData.expMonthly} onChange={handleChange} placeholder="e.g. 20000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Employment Period (From - To)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" name="expStart" value={formData.expStart} onChange={handleChange} placeholder="Start (MM/YYYY)" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[12px] font-medium text-slate-700" />
                          <input type="text" name="expEnd" value={formData.expEnd} onChange={handleChange} placeholder="End (MM/YYYY)" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[12px] font-medium text-slate-700" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Reporting Manager Name</label>
                        <input type="text" name="expRmName" value={formData.expRmName} onChange={handleChange} placeholder="Manager name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Reporting Manager Phone</label>
                        <input type="tel" name="expRmMobile" value={formData.expRmMobile} onChange={handleChange} placeholder="Contact number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Reason for Leaving</label>
                        <input type="text" name="expReason" value={formData.expReason} onChange={handleChange} placeholder="e.g. Career growth, Relocation, etc." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 3: ACCOUNT & ACCESS ================= */}
              {activeTab === 'Account & Access' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-800 mb-1">Account & Login Credentials</h3>
                    <p className="text-[12px] text-slate-500 font-medium">Manage employee login credentials, password resets, and onboarding link.</p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Login Email (Username)</label>
                        <div className="flex items-center gap-2 bg-white px-4 py-2.5 border border-slate-200 rounded-md text-[13px] font-semibold text-slate-700">
                          <Mail size={16} className="text-slate-400" />
                          <span>{formData.email}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">To change username email, update in the Personal tab.</p>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Account Status</label>
                        <div className="flex items-center gap-3 bg-white p-2.5 border border-slate-200 rounded-md">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, status: prev.status === 'Active' ? 'Inactive' : 'Active' }))}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.status === 'Active' ? 'bg-[#489b0d]' : 'bg-slate-300'}`}
                          >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.status === 'Active' ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                          <span className={`text-[13px] font-bold ${formData.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {formData.status} {formData.status === 'Active' ? '(Can Log In)' : '(Access Blocked)'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Reset / Change Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="Enter new password to reset" 
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all pr-10" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">Leave blank to keep the employee's current password.</p>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">System Access Privilege</label>
                        <div className="bg-white p-3 border border-slate-200 rounded-md">
                          <div className="flex items-center gap-2">
                            <ShieldCheck size={16} className={needsAuth ? 'text-emerald-600' : 'text-slate-400'} />
                            <span className="text-[13px] font-bold text-slate-800">
                              {needsAuth ? 'Admin / Management Panel Access' : 'Standard Employee Access'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {needsAuth 
                              ? 'This employee can sign into the Admin & ERP portal with their credentials.' 
                              : 'This employee uses the Mobile App / Field Portal only.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Onboarding Form Link Card */}
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-[14px] font-bold text-emerald-900 mb-1 flex items-center gap-2">
                          <ExternalLink size={16} className="text-emerald-600" /> Digital Onboarding Portal Link
                        </h4>
                        <p className="text-[12px] text-emerald-700 font-medium">
                          Share this personal link with the employee to complete their KYC, upload documents, and submit bank info.
                        </p>
                        <div className="mt-2 text-[12px] font-mono bg-white/80 border border-emerald-200 px-3 py-1.5 rounded-md text-emerald-800 break-all select-all">
                          {`${window.location.origin}/onboarding/${id}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleCopyOnboardingLink}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[12px] font-bold transition-colors shadow-xs"
                        >
                          {copiedLink ? <Check size={15} /> : <Copy size={15} />}
                          {copiedLink ? 'Copied!' : 'Copy Link'}
                        </button>
                        <a
                          href={`/onboarding/${id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-md text-[12px] font-bold transition-colors"
                        >
                          Open Form <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 4: ROLE & PERMISSIONS ================= */}
              {activeTab === 'Role & Permissions' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-800 mb-1">Granular Feature Permissions</h3>
                    <p className="text-[12px] text-slate-500 font-medium">Configure individual feature-level access privileges for this employee.</p>
                  </div>

                  {/* Permissions Checklist Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                    <div>
                      <h4 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                        <Lock size={16} className="text-[#489b0d]" /> Granular Permissions Matrix
                      </h4>
                      <p className="text-[12px] text-slate-500 font-medium">Select the specific actions this employee is allowed to execute.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllPermissions}
                        className="px-3 py-1.5 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAllPermissions}
                        className="px-3 py-1.5 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Groups of Permissions */}
                  <div className="space-y-5">
                    {PERMISSION_GROUPS.map((group, gIdx) => (
                      <div key={gIdx} className="border border-slate-200 rounded-xl p-5 bg-white">
                        <h5 className="text-[13px] font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                          <span>{group.category}</span>
                          <span className="text-[11px] font-medium text-slate-400">
                            {group.permissions.filter(p => formData.permissions?.includes(p)).length} / {group.permissions.length} enabled
                          </span>
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {group.permissions.map((perm, pIdx) => {
                            const isChecked = formData.permissions?.includes(perm);
                            return (
                              <label 
                                key={pIdx}
                                className={`flex items-start gap-3 p-3 rounded-lg border text-left cursor-pointer transition-all ${
                                  isChecked 
                                    ? 'bg-[#489b0d]/5 border-[#489b0d]/40 text-slate-800' 
                                    : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                <input 
                                  type="checkbox" 
                                  checked={isChecked || false} 
                                  onChange={() => handleTogglePermission(perm)}
                                  className="mt-0.5 rounded text-[#489b0d] focus:ring-[#489b0d] accent-[#489b0d] cursor-pointer" 
                                />
                                <span className="text-[12px] font-bold leading-tight select-none">{perm}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 5: DOCUMENTS ================= */}
              {activeTab === 'Documents' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-[15px] font-bold text-slate-800 mb-1">Employee KYC & Documents</h3>
                      <p className="text-[12px] text-slate-500 font-medium">Verify official identity cards, certificates, and uploaded KYC attachments.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddDocModal(true)}
                      className="flex items-center gap-2 px-3.5 py-2 bg-[#489b0d] text-white rounded-md text-[12px] font-bold hover:bg-[#3e850b] transition-colors shadow-xs"
                    >
                      <Plus size={15} /> Add Document
                    </button>
                  </div>

                  {/* ID Numbers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">PAN Card Number</label>
                      <input type="text" name="pan" value={formData.pan} onChange={handleChange} placeholder="e.g. ABCDE1234F" maxLength={10} className="w-full uppercase px-4 py-2.5 bg-white border border-slate-200 rounded-md text-[13px] font-bold text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all tracking-wider" />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Aadhar Card Number</label>
                      <input type="text" name="aadhar" value={formData.aadhar} onChange={handleChange} placeholder="12-digit Aadhar number" maxLength={12} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-[13px] font-bold text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all tracking-wider" />
                    </div>
                  </div>

                  {/* Uploaded Documents Grid */}
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <FileText size={16} className="text-[#489b0d]" /> Uploaded Verification Documents
                    </h4>

                    {formData.documents && formData.documents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.documents.map((doc, idx) => (
                          <div key={doc._id || idx} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between gap-3 shadow-xs hover:border-slate-300 transition-all">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#489b0d]/10 text-[#489b0d] flex items-center justify-center shrink-0">
                                  <FileText size={20} />
                                </div>
                                <div>
                                  <h5 className="text-[13px] font-bold text-slate-800">{doc.name || 'Document'}</h5>
                                  <p className="text-[11px] text-slate-400 capitalize">{doc.key || 'Attachment'} • {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Uploaded'}</p>
                                </div>
                              </div>

                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                doc.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                                doc.status === 'Re-upload Required' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                'bg-blue-50 text-blue-600 border border-blue-200'
                              }`}>
                                {doc.status || 'Pending'}
                              </span>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              {doc.fileUrl ? (
                                <a 
                                  href={doc.fileUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-[12px] font-bold text-[#489b0d] hover:underline flex items-center gap-1"
                                >
                                  View File <ExternalLink size={12} />
                                </a>
                              ) : (
                                <span className="text-[11px] text-slate-400">No URL Available</span>
                              )}

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleDocumentStatusChange(doc._id, 'Verified')}
                                  className="px-2 py-1 text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                  title="Approve & Verify Document"
                                >
                                  Verify
                                </button>
                                <span className="text-slate-300">|</span>
                                <button
                                  type="button"
                                  onClick={() => handleDocumentStatusChange(doc._id, 'Rejected')}
                                  className="px-2 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                  title="Reject Document"
                                >
                                  Reject
                                </button>
                                <span className="text-slate-300">|</span>
                                <button
                                  type="button"
                                  onClick={() => handleDocumentStatusChange(doc._id, 'Re-upload Required')}
                                  className="px-2 py-1 text-[11px] font-bold text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                  title="Request Re-upload"
                                >
                                  Re-upload
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
                        <FileText size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-[13px] font-bold text-slate-600 mb-1">No documents uploaded yet</p>
                        <p className="text-[11px] text-slate-400 max-w-sm mx-auto mb-3">
                          Upload documents manually or share the employee onboarding link for them to upload KYC certificates.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowAddDocModal(true)}
                          className="px-3 py-1.5 bg-[#489b0d] text-white rounded-md text-[12px] font-bold hover:bg-[#3e850b] transition-colors"
                        >
                          Upload Document
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Add Document Modal */}
                  {showAddDocModal && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <h4 className="text-[15px] font-bold text-slate-800">Add New Document</h4>
                          <button onClick={() => setShowAddDocModal(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={18} />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[12px] font-bold text-slate-700 mb-1">Document Title <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              value={newDocData.name} 
                              onChange={(e) => setNewDocData({ ...newDocData, name: e.target.value })} 
                              placeholder="e.g. Aadhar Card / Degree Certificate" 
                              className="w-full px-3 py-2 border border-slate-200 rounded-md text-[13px]" 
                            />
                          </div>

                          <div>
                            <label className="block text-[12px] font-bold text-slate-700 mb-1">Document Type</label>
                            <select 
                              value={newDocData.key} 
                              onChange={(e) => setNewDocData({ ...newDocData, key: e.target.value })} 
                              className="w-full px-3 py-2 border border-slate-200 rounded-md text-[13px]"
                            >
                              <option value="aadhar">Aadhar Card</option>
                              <option value="pan">PAN Card</option>
                              <option value="degree">Degree / Educational Certificate</option>
                              <option value="experience">Experience / Relieving Letter</option>
                              <option value="cheque">Cancelled Cheque / Bank Passbook</option>
                              <option value="salary">Salary Slips</option>
                              <option value="other">Other Document</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[12px] font-bold text-slate-700 mb-1">File URL / Cloud Link <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              value={newDocData.fileUrl} 
                              onChange={(e) => setNewDocData({ ...newDocData, fileUrl: e.target.value })} 
                              placeholder="https://..." 
                              className="w-full px-3 py-2 border border-slate-200 rounded-md text-[13px]" 
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                          <button 
                            type="button" 
                            onClick={() => setShowAddDocModal(false)} 
                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md text-[12px] font-bold hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                          <button 
                            type="button" 
                            onClick={handleAddDocument} 
                            className="px-4 py-2 bg-[#489b0d] text-white rounded-md text-[12px] font-bold hover:bg-[#3e850b]"
                          >
                            Save Document
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 6: ADDITIONAL ================= */}
              {activeTab === 'Additional' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-800 mb-1">Bank Account & References</h3>
                    <p className="text-[12px] text-slate-500 font-medium">Employee salary disbursement bank details and personal reference contacts.</p>
                  </div>

                  {/* Bank Account Details */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <h4 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Building2 size={16} className="text-[#489b0d]" /> Bank Account (For Salary Disbursement)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Bank Name</label>
                        <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="e.g. State Bank of India" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Account Holder Name</label>
                        <input type="text" name="bankAccName" value={formData.bankAccName} onChange={handleChange} placeholder="Name as in bank passbook" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Account Type</label>
                        <select name="bankAccType" value={formData.bankAccType} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all">
                          <option value="">- Select Account Type -</option>
                          <option value="Savings">Savings Account</option>
                          <option value="Salary">Salary Account</option>
                          <option value="Current">Current Account</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Bank Account Number</label>
                        <input type="text" name="bankAccNum" value={formData.bankAccNum} onChange={handleChange} placeholder="Account Number" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Bank IFSC Code</label>
                        <input type="text" name="bankIfsc" value={formData.bankIfsc} onChange={handleChange} placeholder="e.g. SBIN0001234" className="w-full uppercase px-4 py-2.5 bg-white border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Branch Name</label>
                        <input type="text" name="bankBranch" value={formData.bankBranch} onChange={handleChange} placeholder="Branch City/Location" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Personal & Emergency References */}
                  <div className="pt-2">
                    <h4 className="text-[14px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <User size={16} className="text-[#489b0d]" /> Emergency & Professional References
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Reference 1 */}
                      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                        <span className="text-[12px] font-bold text-[#489b0d] bg-[#489b0d]/10 px-2.5 py-1 rounded">Primary Reference 1</span>
                        <div>
                          <label className="block text-[12px] font-bold text-slate-700 mb-1">Full Name</label>
                          <input type="text" name="ref1Name" value={formData.ref1Name} onChange={handleChange} placeholder="Reference Name" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px]" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-slate-700 mb-1">Relationship</label>
                          <input type="text" name="ref1Rel" value={formData.ref1Rel} onChange={handleChange} placeholder="e.g. Brother / Friend / Colleague" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px]" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-slate-700 mb-1">Contact Phone</label>
                          <input type="tel" name="ref1Mobile" value={formData.ref1Mobile} onChange={handleChange} placeholder="Mobile Number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px]" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-slate-700 mb-1">Address / Location</label>
                          <input type="text" name="ref1Address" value={formData.ref1Address} onChange={handleChange} placeholder="City or Address" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px]" />
                        </div>
                      </div>

                      {/* Reference 2 */}
                      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                        <span className="text-[12px] font-bold text-[#489b0d] bg-[#489b0d]/10 px-2.5 py-1 rounded">Secondary Reference 2</span>
                        <div>
                          <label className="block text-[12px] font-bold text-slate-700 mb-1">Full Name</label>
                          <input type="text" name="ref2Name" value={formData.ref2Name} onChange={handleChange} placeholder="Reference Name" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px]" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-slate-700 mb-1">Relationship</label>
                          <input type="text" name="ref2Rel" value={formData.ref2Rel} onChange={handleChange} placeholder="e.g. Uncle / Ex-Manager" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px]" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-slate-700 mb-1">Contact Phone</label>
                          <input type="tel" name="ref2Mobile" value={formData.ref2Mobile} onChange={handleChange} placeholder="Mobile Number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px]" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-slate-700 mb-1">Address / Location</label>
                          <input type="text" name="ref2Address" value={formData.ref2Address} onChange={handleChange} placeholder="City or Address" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-[13px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Footer Actions */}
            <div className="p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 bg-slate-50/70 rounded-b-xl">
              <div className="flex items-center gap-2">
                {currentTabIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab(tabs[currentTabIndex - 1].id)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md text-[12px] font-bold hover:bg-slate-100 transition-colors bg-white shadow-xs"
                  >
                    ← Previous: {tabs[currentTabIndex - 1].label}
                  </button>
                )}
                {currentTabIndex < tabs.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab(tabs[currentTabIndex + 1].id)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-md text-[12px] font-bold hover:bg-slate-100 transition-colors bg-white shadow-xs"
                  >
                    Next: {tabs[currentTabIndex + 1].label} →
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Link 
                  to={`/employees/${id}`} 
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-100 transition-colors bg-white shadow-xs"
                >
                  Cancel
                </Link>
                <button 
                  type="button"
                  onClick={handleUpdate} 
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#489b0d] text-white rounded-md text-[13px] font-bold hover:bg-[#3e850b] transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Update Employee
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
