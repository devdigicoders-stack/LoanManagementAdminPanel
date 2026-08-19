import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { mockUsers } from './ManageUsers';
import { 
  ArrowLeft, Download, Edit, User, Mail, Phone, Calendar, Clock, 
  ShieldCheck, CheckCircle2, FileText, Activity, MapPin, Globe,
  Briefcase, CreditCard, ChevronRight, Plus, Eye, MoreVertical, X
} from 'lucide-react';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [viewDoc, setViewDoc] = useState(null);
  const [viewLoan, setViewLoan] = useState(null);
  const [newLoanModal, setNewLoanModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);

  // Find the requested user
  const user = useMemo(() => {
    return mockUsers.find(u => u.id === id) || null;
  }, [id]);

  if (!user) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <User size={48} className="text-slate-300" />
        <h2 className="text-xl font-bold text-slate-800">User Not Found</h2>
        <p>The user profile you are looking for does not exist.</p>
        <button onClick={() => navigate('/users')} className="px-4 py-2 bg-[#489b0d] text-white rounded-md mt-4 font-bold">Back to Users</button>
      </div>
    );
  }

  const tabs = [
    "Personal Information", "KYC Information", "Employment Details", 
    "Financial Details", "Loan Applications", "Uploaded Documents", "Activity Log"
  ];

  function InfoRow({ label, value }) {
    return (
      <div className="flex justify-between items-center gap-4">
        <span className="text-[12px] font-medium text-slate-500">{label}</span>
        <span className="text-[13px] font-bold text-slate-800">{value}</span>
      </div>
    );
  }

  return (
    <div className="w-full pb-10">
      {/* Top Breadcrumb & Title */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/users')} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">View Complete User Profile</h1>
        </div>
        <div className="flex items-center text-[12px] font-medium text-slate-500 ml-11">
          <Link to="/" className="hover:text-[#489b0d]">Dashboard</Link>
          <ChevronRight size={14} className="mx-1" />
          <Link to="/users" className="hover:text-[#489b0d]">Users</Link>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-slate-700">Complete User Profile</span>
        </div>
      </div>

      {/* Profile Header & Quick Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 flex flex-col xl:flex-row gap-8">
        
        {/* Left Side: Avatar & Details */}
        <div className="flex-1 flex flex-col sm:flex-row gap-6">
          <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 shadow-sm shrink-0" />
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${user.status === 'Active' ? 'bg-[#489b0d]/10 text-[#489b0d]' : 'bg-red-100 text-red-600'}`}>
                {user.status} User
              </span>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                <Mail size={16} className="text-slate-400" /> {user.email}
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                <Phone size={16} className="text-slate-400" /> {user.phone}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4">
              <div className="flex items-start gap-2">
                <User size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">User ID</p>
                  <p className="text-[13px] font-bold text-slate-800">{user.id}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">Registered On</p>
                  <p className="text-[13px] font-bold text-slate-800">{user.registeredOn || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">Last Login</p>
                  <p className="text-[13px] font-bold text-slate-800">{user.lastLogin || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Activity size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">Status</p>
                  <p className="text-[13px] font-bold text-[#489b0d]">{user.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Actions & Summary */}
        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4">
          <div className="flex items-center gap-3 justify-end">
            <button 
              onClick={() => {
                toast.success('Downloading user profile PDF...');
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              <Download size={16} /> Download Profile
            </button>
            <button 
              onClick={() => setEditUserModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-[13px] font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              <Edit size={16} /> Edit User
            </button>
          </div>

          <div className="bg-slate-50 rounded-lg border border-slate-100 p-4">
            <h3 className="text-[13px] font-bold text-slate-700 mb-3">Quick Summary</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[12px] font-medium text-slate-600">
                <span>Total Applications</span>
                <span className="font-bold text-slate-800">{user.totalApplications}</span>
              </div>
              <div className="flex justify-between items-center text-[12px] font-medium text-[#489b0d]">
                <span>Approved</span>
                <span className="font-bold">{user.approvedApplications || 0}</span>
              </div>
              <div className="flex justify-between items-center text-[12px] font-medium text-blue-600">
                <span>Under Review</span>
                <span className="font-bold">{user.underReviewApplications || 0}</span>
              </div>
              <div className="flex justify-between items-center text-[12px] font-medium text-red-600">
                <span>Rejected</span>
                <span className="font-bold">{user.rejectedApplications || 0}</span>
              </div>
              <div className="flex justify-between items-center text-[12px] font-medium text-slate-600 pt-2 border-t border-slate-200">
                <span>Total Uploaded Documents</span>
                <span className="font-bold text-slate-800">{user.totalUploadedDocuments || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-t-xl border-b border-slate-200 px-2 flex overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer px-6 py-4 text-[13px] font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white min-h-[400px] p-6 rounded-b-xl border border-t-0 border-slate-200">
        
        {activeTab === "Personal Information" && (
          <div className="space-y-6">
            {/* Info Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Personal Information */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-bold text-slate-800">Personal Information</h3>
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <User size={16} />
                  </div>
                </div>
                <div className="space-y-4">
                  <InfoRow label="Full Name" value={user.name} />
                  <InfoRow label="Date of Birth" value={user.dob} />
                  <InfoRow label="Gender" value={user.gender} />
                  <InfoRow label="Marital Status" value={user.maritalStatus} />
                  <InfoRow label="PAN Number" value={user.pan} />
                  <InfoRow label="Aadhaar Number" value={user.aadhaar} />
                  <InfoRow label="Nationality" value={user.nationality} />
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-[12px] font-medium text-slate-500">Address</span>
                    <span className="text-[13px] font-bold text-slate-800 text-right leading-relaxed">{user.address}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-bold text-slate-800">Contact Information</h3>
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <Phone size={16} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <span className="text-[12px] font-medium text-slate-500">Mobile Number</span>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[13px] font-bold text-slate-800 truncate" title={user.phone}>{user.phone}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#489b0d]/10 text-[#489b0d] shrink-0">Verified</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <span className="text-[12px] font-medium text-slate-500">Email Address</span>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[13px] font-bold text-slate-800 truncate" title={user.email}>{user.email}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#489b0d]/10 text-[#489b0d] shrink-0">Verified</span>
                    </div>
                  </div>
                  <InfoRow label="Alternate Number" value={user.alternatePhone} />
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-[12px] font-medium text-slate-500">Current Address</span>
                    <span className="text-[13px] font-bold text-slate-800 text-right leading-relaxed">{user.currentAddress}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-[12px] font-medium text-slate-500">Permanent Address</span>
                    <span className="text-[13px] font-bold text-slate-800 text-right leading-relaxed">{user.permanentAddress}</span>
                  </div>
                </div>
              </div>

              {/* Social & Other Details */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-bold text-slate-800">Social & Other Details</h3>
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <Globe size={16} />
                  </div>
                </div>
                <div className="space-y-4">
                  <InfoRow label="Preferred Communication" value={user.preferredCommunication} />
                  <InfoRow label="Source / Referred By" value={user.source} />
                  <InfoRow label="Occupation Type" value={user.occupation} />
                  <InfoRow label="Annual Income" value={user.annualIncome} />
                  <InfoRow label="Education" value={user.education} />
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <span className="text-[12px] font-medium text-slate-500">CIBIL Score</span>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[13px] font-bold text-slate-800">{user.creditScore}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${user.creditStatus === 'Excellent' ? 'bg-blue-100 text-blue-600' : user.creditStatus === 'Good' ? 'bg-[#489b0d]/10 text-[#489b0d]' : 'bg-orange-100 text-orange-600'}`}>
                        {user.creditStatus}
                      </span>
                    </div>
                  </div>
                  <InfoRow label="GST Registered" value={user.gstRegistered} />
                </div>
              </div>

            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Loan Applications */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-bold text-slate-800">Recent Loan Applications</h3>
                  <button className="text-[12px] font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50 transition-colors cursor-pointer">
                    View All Applications
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Application ID</th>
                        <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Loan Type</th>
                        <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Applied Amount</th>
                        <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                        <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Applied On</th>
                        <th className="pb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-[13px]">
                      <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                        <td className="py-4 font-medium text-slate-700">LN-250512-001</td>
                        <td className="py-4 text-slate-600">Home Loan</td>
                        <td className="py-4 font-bold text-slate-800">₹25,00,000</td>
                        <td className="py-4">
                          <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-[11px] font-bold">Under Review</span>
                        </td>
                        <td className="py-4 text-slate-600">12 May 2025</td>
                        <td className="py-4 text-right">
                          <button onClick={() => setViewLoan('LN-250512-001')} className="text-blue-600 hover:text-blue-800 font-bold text-[12px] flex items-center gap-1 justify-end ml-auto cursor-pointer">
                            <Eye size={14} /> View Details
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                        <td className="py-4 font-medium text-slate-700">LN-250425-001</td>
                        <td className="py-4 text-slate-600">Personal Loan</td>
                        <td className="py-4 font-bold text-slate-800">₹5,00,000</td>
                        <td className="py-4">
                          <span className="px-2 py-1 rounded bg-[#489b0d]/10 text-[#489b0d] text-[11px] font-bold">Approved</span>
                        </td>
                        <td className="py-4 text-slate-600">25 Apr 2025</td>
                        <td className="py-4 text-right">
                          <button onClick={() => setViewLoan('LN-250425-001')} className="text-blue-600 hover:text-blue-800 font-bold text-[12px] flex items-center gap-1 justify-end ml-auto cursor-pointer">
                            <Eye size={14} /> View Details
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                        <td className="py-4 font-medium text-slate-700">LN-250310-001</td>
                        <td className="py-4 text-slate-600">Business Loan</td>
                        <td className="py-4 font-bold text-slate-800">₹15,00,000</td>
                        <td className="py-4">
                          <span className="px-2 py-1 rounded bg-red-50 text-red-600 text-[11px] font-bold">Rejected</span>
                        </td>
                        <td className="py-4 text-slate-600">10 Mar 2025</td>
                        <td className="py-4 text-right">
                          <button onClick={() => setViewLoan('LN-250310-001')} className="text-blue-600 hover:text-blue-800 font-bold text-[12px] flex items-center gap-1 justify-end ml-auto cursor-pointer">
                            <Eye size={14} /> View Details
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* User Notes */}
              <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-bold text-slate-800">User Notes</h3>
                  <button className="text-[12px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors cursor-pointer">
                    <Plus size={14} /> Add Note
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Note 1 */}
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100/50">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-[13px] font-medium text-slate-700 leading-relaxed">
                        User is very responsive and provided documents on time.
                      </p>
                      <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                      <span>- Admin</span>
                      <span>21 May 2025, 03:12 PM</span>
                    </div>
                  </div>
                  
                  {/* Note 2 */}
                  <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100/50">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-[13px] font-medium text-slate-700 leading-relaxed">
                        Requested for higher loan amount. Follow up required.
                      </p>
                      <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
                      <span className="text-blue-600">- Neha (Relationship Manager)</span>
                      <span>20 May 2025, 11:30 AM</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab Content: KYC Information */}
        {activeTab === "KYC Information" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800">KYC Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PAN Card Details */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold text-slate-800">PAN Card</h3>
                      <p className="text-[12px] font-semibold text-slate-500">Identity Proof</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#489b0d]/10 text-[#489b0d] text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} /> Verified
                  </span>
                </div>
                <div className="space-y-4">
                  <InfoRow label="Document Number" value={user.pan} />
                  <InfoRow label="Name on Document" value={user.name} />
                  <InfoRow label="Verified On" value="13 May 2025" />
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div 
                      onClick={() => setViewDoc({ name: 'PAN Card', url: 'https://images.unsplash.com/photo-1620228892461-1eb47ce7cb38?auto=format&fit=crop&q=80&w=800' })}
                      className="w-full h-32 bg-slate-100 hover:bg-slate-200 cursor-pointer rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-500 transition-colors"
                    >
                      <FileText size={24} className="mr-2" /> PAN_Card_Front.pdf
                    </div>
                  </div>
                </div>
              </div>

              {/* Aadhaar Card Details */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold text-slate-800">Aadhaar Card</h3>
                      <p className="text-[12px] font-semibold text-slate-500">Address Proof</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#489b0d]/10 text-[#489b0d] text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} /> Verified
                  </span>
                </div>
                <div className="space-y-4">
                  <InfoRow label="Document Number" value={user.aadhaar} />
                  <InfoRow label="Name on Document" value={user.name} />
                  <InfoRow label="Verified On" value="13 May 2025" />
                  <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4">
                    <div 
                      onClick={() => setViewDoc({ name: 'Aadhaar Card Front', url: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=800' })}
                      className="flex-1 h-32 bg-slate-100 hover:bg-slate-200 cursor-pointer rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-500 text-xs transition-colors"
                    >
                      <FileText size={20} className="mr-2" /> Aadhaar_Front.jpg
                    </div>
                    <div 
                      onClick={() => setViewDoc({ name: 'Aadhaar Card Back', url: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=800' })}
                      className="flex-1 h-32 bg-slate-100 hover:bg-slate-200 cursor-pointer rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-500 text-xs transition-colors"
                    >
                      <FileText size={20} className="mr-2" /> Aadhaar_Back.jpg
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Employment Details */}
        {activeTab === "Employment Details" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800">Employment Details</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[14px] font-bold text-slate-800">Current Employment</h3>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Briefcase size={16} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <InfoRow label="Occupation Type" value={user.occupation} />
                <InfoRow label="Employer Name" value="Tech Solutions Pvt Ltd" />
                <InfoRow label="Designation" value="Senior Software Engineer" />
                <InfoRow label="Total Experience" value="5 Years 4 Months" />
                <InfoRow label="Official Email" value={`work.${user.email.split('@')[0]}@techsolutions.com`} />
                <InfoRow label="Work Phone" value="080-12345678" />
                <div className="col-span-1 md:col-span-2">
                  <InfoRow label="Office Address" value="Building 4, Mindspace IT Park, Hitech City, Hyderabad - 500081" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Financial Details */}
        {activeTab === "Financial Details" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800">Financial Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-bold text-slate-800">Bank Details</h3>
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <Globe size={16} />
                  </div>
                </div>
                <div className="space-y-4">
                  <InfoRow label="Bank Name" value="HDFC Bank" />
                  <InfoRow label="Branch" value="Sector 45, Gurugram" />
                  <InfoRow label="Account Holder Name" value={user.name} />
                  <InfoRow label="Account Number" value="50100234567890" />
                  <InfoRow label="IFSC Code" value="HDFC0001234" />
                  <InfoRow label="Account Type" value="Savings Account" />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-bold text-slate-800">Income Overview</h3>
                  <div className="w-8 h-8 rounded-full bg-[#489b0d]/10 flex items-center justify-center text-[#489b0d]">
                    <CreditCard size={16} />
                  </div>
                </div>
                <div className="space-y-4">
                  <InfoRow label="Annual Income" value={user.annualIncome} />
                  <InfoRow label="Monthly Net Salary" value="₹ 1,00,000" />
                  <InfoRow label="Existing EMIs" value="₹ 16,500" />
                  <InfoRow label="FOIR (Fixed Obligation to Income Ratio)" value="16.5%" />
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-[12px] font-bold text-blue-800 mb-1">Income Verification</p>
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      Income verified via Net Banking (Perfios) on 13 May 2025. 3 months salary slips attached.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab Content: Loan Applications */}
        {activeTab === "Loan Applications" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">All Loan Applications</h2>
              <button 
                onClick={() => {
                  toast.success('Full user profile updated successfully!');
                  setNewLoanModal(true);
                }}
                className="flex items-center gap-1 text-[12px] font-bold bg-[#489b0d] text-white px-3 py-2 rounded-md hover:bg-[#3d830b] transition-colors cursor-pointer"
              >
                <Plus size={14} /> New Application
              </button>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="py-4 px-6 text-[12px] font-bold text-slate-600">Application ID</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-slate-600">Loan Product</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-slate-600">Amount & Tenure</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-slate-600">Applied On</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-slate-600">Status</th>
                      <th className="py-4 px-6 text-[12px] font-bold text-slate-600 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px]">
                    <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-bold text-blue-600">LN-250512-001</td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">Home Loan</div>
                        <div className="text-[11px] text-slate-500">Interest: 8.5% p.a.</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">₹25,00,000</div>
                        <div className="text-[11px] text-slate-500">240 Months</div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">12 May 2025</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold border border-blue-100">Under Review</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => setViewLoan('LN-250512-001')}
                          className="text-blue-600 hover:text-blue-800 font-bold text-[12px] flex items-center gap-1 justify-end ml-auto cursor-pointer"
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-bold text-blue-600">LN-250425-001</td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">Personal Loan</div>
                        <div className="text-[11px] text-slate-500">Interest: 12.5% p.a.</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">₹5,00,000</div>
                        <div className="text-[11px] text-slate-500">36 Months</div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">25 Apr 2025</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-[#489b0d]/10 text-[#489b0d] text-[11px] font-bold border border-[#489b0d]/20">Approved</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => setViewLoan('LN-250425-001')}
                          className="text-blue-600 hover:text-blue-800 font-bold text-[12px] flex items-center gap-1 justify-end ml-auto cursor-pointer"
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-bold text-blue-600">LN-250310-001</td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">Business Loan</div>
                        <div className="text-[11px] text-slate-500">Interest: 15.0% p.a.</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">₹15,00,000</div>
                        <div className="text-[11px] text-slate-500">60 Months</div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">10 Mar 2025</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold border border-red-100">Rejected</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => setViewLoan('LN-250310-001')}
                          className="text-blue-600 hover:text-blue-800 font-bold text-[12px] flex items-center gap-1 justify-end ml-auto cursor-pointer"
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Uploaded Documents */}
        {activeTab === "Uploaded Documents" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Document Repository</h2>
              <button className="flex items-center gap-1 text-[12px] font-bold bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors cursor-pointer">
                <Download size={14} /> Download All
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                { name: "PAN Card", type: "PDF", size: "1.2 MB", date: "12 May" },
                { name: "Aadhaar Front", type: "JPG", size: "2.5 MB", date: "12 May" },
                { name: "Aadhaar Back", type: "JPG", size: "2.1 MB", date: "12 May" },
                { name: "Bank Statement_Jan_Mar", type: "PDF", size: "4.8 MB", date: "13 May" },
                { name: "Salary Slip_April", type: "PDF", size: "0.8 MB", date: "13 May" },
                { name: "Salary Slip_March", type: "PDF", size: "0.8 MB", date: "13 May" },
                { name: "Salary Slip_Feb", type: "PDF", size: "0.8 MB", date: "13 May" },
                { name: "User Photo", type: "PNG", size: "3.2 MB", date: "12 May" },
              ].map((doc, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setViewDoc({ name: doc.name, url: `https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&q=80&w=800` })}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <h4 className="text-[12px] font-bold text-slate-800 truncate w-full mb-1">{doc.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{doc.type} • {doc.size}</p>
                  <p className="text-[10px] text-slate-400 mt-2">{doc.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Activity Log */}
        {activeTab === "Activity Log" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="relative border-l-2 border-slate-100 ml-3 md:ml-4 space-y-8 pb-4">
                
                <div className="relative pl-6 md:pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                    <h4 className="text-[14px] font-bold text-slate-800">Home Loan Application Submitted</h4>
                    <span className="text-[11px] font-bold text-slate-500">12 May 2025, 02:30 PM</span>
                  </div>
                  <p className="text-[13px] text-slate-600">User successfully submitted an application for Home Loan (LN-250512-001).</p>
                </div>

                <div className="relative pl-6 md:pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#489b0d] border-4 border-white shadow-sm"></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                    <h4 className="text-[14px] font-bold text-slate-800">KYC Verification Completed</h4>
                    <span className="text-[11px] font-bold text-slate-500">13 May 2025, 11:15 AM</span>
                  </div>
                  <p className="text-[13px] text-slate-600">PAN and Aadhaar verified successfully via automated check.</p>
                </div>

                <div className="relative pl-6 md:pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow-sm"></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                    <h4 className="text-[14px] font-bold text-slate-800">Documents Uploaded</h4>
                    <span className="text-[11px] font-bold text-slate-500">13 May 2025, 10:45 AM</span>
                  </div>
                  <p className="text-[13px] text-slate-600">User uploaded Bank Statements and Salary Slips.</p>
                </div>

                <div className="relative pl-6 md:pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-400 border-4 border-white shadow-sm"></div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                    <h4 className="text-[14px] font-bold text-slate-800">Account Registered</h4>
                    <span className="text-[11px] font-bold text-slate-500">12 May 2025, 10:30 AM</span>
                  </div>
                  <p className="text-[13px] text-slate-600">User created an account using Google Ads referral link.</p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== "Personal Information" && activeTab !== "KYC Information" && activeTab !== "Employment Details" && activeTab !== "Financial Details" && activeTab !== "Loan Applications" && activeTab !== "Uploaded Documents" && activeTab !== "Activity Log" && (
          <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
              <FileText size={24} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">{activeTab}</h3>
            <p className="text-[13px] font-medium max-w-md text-center">
              This section is currently under development. All related details and functionalities will be populated here shortly.
            </p>
          </div>
        )}

      </div>

      {/* Document Viewer Modal */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewDoc(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={18} className="text-[#489b0d]" /> {viewDoc.name} Preview</h3>
              <button onClick={() => setViewDoc(null)} className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-100">
              <img src={viewDoc.url} alt={viewDoc.name} className="max-w-full max-h-full object-contain rounded shadow-sm border border-slate-200" />
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setViewDoc(null)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded font-bold text-[13px] cursor-pointer hover:bg-slate-50">Close</button>
              <button className="px-4 py-2 bg-[#489b0d] text-white rounded font-bold text-[13px] cursor-pointer hover:bg-[#3d830b] flex items-center gap-2">
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loan Details Modal */}
      {viewLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewLoan(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Application Details: {viewLoan}</h3>
              <button onClick={() => setViewLoan(null)} className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[13px] text-slate-600 leading-relaxed">
                This is a detailed view of the loan application <strong>{viewLoan}</strong>. Here you would see the complete underwriting status, verification stages, and assigned officers.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <InfoRow label="Application Stage" value="Credit Appraisal" />
                <InfoRow label="Assigned To" value="Rahul Sharma (Credit Manager)" />
                <InfoRow label="Disbursement Account" value="HDFC Bank - 50100234567890" />
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button onClick={() => setViewLoan(null)} className="px-4 py-2 bg-[#489b0d] text-white rounded font-bold text-[13px] cursor-pointer hover:bg-[#3d830b]">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* New Loan Modal */}
      {newLoanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setNewLoanModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Create New Application</h3>
              <button onClick={() => setNewLoanModal(false)} className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Loan Type</label>
                <select className="w-full border border-slate-300 rounded p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500">
                  <option>Home Loan</option>
                  <option>Personal Loan</option>
                  <option>Business Loan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Loan Amount</label>
                <input type="text" placeholder="e.g. 500000" className="w-full border border-slate-300 rounded p-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setNewLoanModal(false)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded font-bold text-[13px] cursor-pointer hover:bg-slate-50">Cancel</button>
              <button onClick={() => {
                toast.success('New application initiated successfully!');
                setNewLoanModal(false);
              }} className="px-4 py-2 bg-[#489b0d] text-white rounded font-bold text-[13px] cursor-pointer hover:bg-[#3d830b]">
                Create Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal (Full Details) */}
      {editUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditUserModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Edit size={18} className="text-blue-600" /> Edit Complete User Profile
              </h3>
              <button onClick={() => setEditUserModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              
              {/* Personal Information */}
              <div>
                <h4 className="text-[13px] font-bold text-slate-800 mb-3 uppercase tracking-wider border-b border-slate-100 pb-2">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-3">
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">Full Name</label>
                    <input type="text" defaultValue={user.name} className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">Date of Birth</label>
                    <input type="date" defaultValue="1992-05-15" className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">Gender</label>
                    <select defaultValue={user.gender} className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">Marital Status</label>
                    <select defaultValue={user.maritalStatus} className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option>Single</option>
                      <option>Married</option>
                      <option>Divorced</option>
                      <option>Widowed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h4 className="text-[13px] font-bold text-slate-800 mb-3 uppercase tracking-wider border-b border-slate-100 pb-2">Contact Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">Email Address</label>
                    <input type="email" defaultValue={user.email} className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">Primary Phone</label>
                    <input type="text" defaultValue={user.phone} className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">Alternate Phone</label>
                    <input type="text" defaultValue={user.alternatePhone} className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">Current Address</label>
                    <textarea defaultValue={user.address} rows="2" className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"></textarea>
                  </div>
                </div>
              </div>

              {/* KYC & Professional Details */}
              <div>
                <h4 className="text-[13px] font-bold text-slate-800 mb-3 uppercase tracking-wider border-b border-slate-100 pb-2">KYC & Professional</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">PAN Card</label>
                    <input type="text" defaultValue={user.pan} className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">Aadhaar Card</label>
                    <input type="text" defaultValue={user.aadhaar} className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">CIBIL Score</label>
                    <input type="number" defaultValue={user.creditScore} className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">Occupation</label>
                    <select defaultValue={user.occupation} className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option>Salaried</option>
                      <option>Self-Employed</option>
                      <option>Business Owner</option>
                      <option>Student</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">Annual Income</label>
                    <input type="text" defaultValue={user.annualIncome} className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">Education</label>
                    <select defaultValue={user.education} className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option>Undergraduate</option>
                      <option>Graduate</option>
                      <option>Post-Graduate</option>
                      <option>Doctorate</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* System Details */}
              <div>
                <h4 className="text-[13px] font-bold text-slate-800 mb-3 uppercase tracking-wider border-b border-slate-100 pb-2">System Controls</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">Account Status</label>
                    <select defaultValue={user.status} className="w-full border border-slate-300 rounded-md p-2 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Blocked</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
              <button onClick={() => setEditUserModal(false)} className="px-6 py-2 border border-slate-200 text-slate-700 rounded-md font-bold text-[13px] cursor-pointer hover:bg-white transition-colors shadow-sm">Cancel</button>
              <button onClick={() => {
                toast.success('Full user profile updated successfully!');
                setEditUserModal(false);
              }} className="px-6 py-2 bg-blue-600 text-white rounded-md font-bold text-[13px] cursor-pointer hover:bg-blue-700 shadow-sm transition-colors">
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Helper Component for info rows
function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <span className="text-[12px] font-medium text-slate-500">{label}</span>
      <span className="text-[13px] font-bold text-slate-800 text-right truncate" title={value}>{value || '-'}</span>
    </div>
  );
}
