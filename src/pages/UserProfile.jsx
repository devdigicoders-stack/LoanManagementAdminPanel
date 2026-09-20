import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { hasPermission } from '../utils/permissions';
import {
  ArrowLeft, Download, Edit, User, Mail, Phone, Calendar, Clock,
  ShieldCheck, CheckCircle2, FileText, Activity, MapPin, Globe,
  Briefcase, CreditCard, ChevronRight, Plus, Eye, MoreVertical, X,
  AlertCircle, Send, BarChart3, TrendingUp, Lock, Users, Target,
  Layers, CheckCircle, RefreshCw, Smartphone, Award, DollarSign,
  UserCheck, FileSpreadsheet
} from 'lucide-react';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview & Ground Tracking");
  const [viewDoc, setViewDoc] = useState(null);
  const [viewLoan, setViewLoan] = useState(null);
  const [viewCandidate, setViewCandidate] = useState(null);
  const [newLoanModal, setNewLoanModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the requested user
  useEffect(() => {
    const fetchUser = async () => {
      if (!id || id === 'undefined') {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        let response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${id}/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }

        if (response.ok) {
          const data = await response.json();
          const loadedUser = data.user || data;
          setUser(loadedUser);
          if (loadedUser.isStaff) {
            setActiveTab("Overview & Ground Tracking");
          } else {
            setActiveTab("Personal Information");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-500">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Loading profile data...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
        <User size={48} className="text-slate-300" />
        <h2 className="text-xl font-bold text-slate-800">User Not Found</h2>
        <p>The profile you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/users')} className="px-4 py-2 bg-[#489b0d] text-white rounded-md mt-4 font-bold">Back to Users</button>
      </div>
    );
  }

  const isStaff = Boolean(user.isStaff);
  const isHead = isStaff && (
    (user.role || '').toLowerCase().includes('head') ||
    (user.role || '').toLowerCase().includes('admin') ||
    (user.designation || '').toLowerCase().includes('head') ||
    user.isDepartmentHead
  );

  const isHR = user.isHRDepartment || 
               (user.department || '').toLowerCase().includes('hr') || 
               (user.role || '').toLowerCase().includes('hr') || 
               (user.designation || '').toLowerCase().includes('hr');

  const staffTabs = [
    "Overview & Ground Tracking",
    "Subordinate Ground Team",
    isHR ? "Career Page Applicants (HR Leads)" : "Territory Leads Pipeline",
    "Loan Applications (LOS)",
    "Official Profile & Hierarchy",
    "Activity Log"
  ];

  const customerTabs = [
    "Personal Information", "KYC Information", "Employment Details",
    "Financial Details", "Loan Applications", "Uploaded Documents", "Activity Log"
  ];

  const tabs = isStaff ? staffTabs : customerTabs;

  return (
    <div className="w-full pb-10">
      {/* Top Breadcrumb & Title */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(isStaff ? '/users' : '/customers')} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">
            {isStaff ? (isHead ? `${isHR ? 'HR Head' : 'Head'} Ground-to-Top Activity Tracking` : 'Staff Profile & Performance') : 'View Complete Customer Profile'}
          </h1>
        </div>
        <div className="flex items-center text-[12px] font-medium text-slate-500 ml-11">
          <Link to="/" className="hover:text-[#489b0d]">Dashboard</Link>
          <ChevronRight size={14} className="mx-1" />
          <Link to={isStaff ? "/users" : "/customers"} className="hover:text-[#489b0d]">
            {isStaff ? "Team & Staff" : "Customers"}
          </Link>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-slate-700">{user.name}</span>
        </div>
      </div>

      {/* Profile Header & Quick Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 flex flex-col xl:flex-row gap-8">

        {/* Left Side: Avatar & Details */}
        <div className="flex-1 flex flex-col sm:flex-row gap-6">
          {user.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:')) ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-slate-50 shadow-md shrink-0" 
            />
          ) : (
            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-md shrink-0 uppercase border-4 border-slate-50 ${isStaff ? 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-700' : 'bg-gradient-to-tr from-blue-600 to-cyan-500'}`}>
              {(user.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h2>
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${user.status === 'Active' ? 'bg-[#489b0d]/10 text-[#489b0d]' : 'bg-red-100 text-red-600'}`}>
                {user.status || 'Active'}
              </span>
              {isStaff && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {user.role || 'Staff'} {isHead && '• Territory Head'}
                </span>
              )}
              {user.zone && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Zone: {user.zone}
                </span>
              )}
            </div>

            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                <Mail size={15} className="text-slate-400" /> {user.email || 'N/A'}
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                <Phone size={15} className="text-slate-400" /> {user.phone || user.mobile || 'N/A'}
              </div>
              {isStaff && user.department && (
                <div className="flex items-center gap-2 text-slate-600 text-[13px] font-medium">
                  <Briefcase size={15} className="text-slate-400" /> Department: <strong className="text-slate-700">{user.department}</strong>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-start gap-2">
                <User size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">{isStaff ? 'Staff / Employee ID' : 'Customer ID'}</p>
                  <p className="text-[13px] font-bold text-slate-800">
                    {user.empId || (user.userId && !user.userId.match(/^[0-9a-fA-F]{24}$/) ? user.userId : (isStaff ? `EMP-${(user.id || user._id || '').slice(-6).toUpperCase()}` : `USR-${(user.id || user._id || '').slice(-6).toUpperCase()}`))}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">Registered On</p>
                  <p className="text-[13px] font-bold text-slate-800">
                    {user.registeredOn && user.registeredOn !== 'N/A' 
                      ? user.registeredOn 
                      : (user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently Added')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">Last Active Session</p>
                  <p className="text-[13px] font-bold text-slate-800">
                    {user.lastLogin && user.lastLogin !== 'N/A' 
                      ? user.lastLogin 
                      : (user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Active Session')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Actions & Executive Scorecard */}
        <div className="w-full xl:w-[340px] shrink-0 flex flex-col gap-4">
          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => toast.success('Exporting official activity report...')}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-[13px] font-bold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              <Download size={15} /> Export PDF
            </button>
            <button
              onClick={() => setEditUserModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              <Edit size={15} /> Edit Details
            </button>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4">
            <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center justify-between">
              <span>{isStaff ? (isHR ? 'HR Recruiter Scorecard' : 'Territory Summary') : 'Borrower Quick Summary'}</span>
              <span className="text-[11px] font-medium text-slate-500">{user.zone || 'Global'} Zone</span>
            </h3>

            {isStaff ? (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[12px] font-medium text-slate-600">
                  <span className="flex items-center gap-1.5"><Users size={14} className="text-indigo-600" /> {isHR ? 'HR Executives / Team' : 'Ground Field Agents'}</span>
                  <span className="font-bold text-slate-800">{user.metrics?.totalTeamCount ?? (user.subordinateStaff?.length || 0)}</span>
                </div>
                {isHR ? (
                  <div className="flex justify-between items-center text-[12px] font-medium text-slate-600">
                    <span className="flex items-center gap-1.5"><FileSpreadsheet size={14} className="text-purple-600" /> Career Page Leads</span>
                    <span className="font-bold text-slate-800">{user.metrics?.totalCareerLeadsCount ?? (user.careerApplications?.length || 0)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-[12px] font-medium text-slate-600">
                    <span className="flex items-center gap-1.5"><Target size={14} className="text-amber-600" /> Ground Leads</span>
                    <span className="font-bold text-slate-800">{user.metrics?.totalLeadsCount ?? (user.groundLeads?.length || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[12px] font-medium text-slate-600">
                  <span className="flex items-center gap-1.5"><FileText size={14} className="text-blue-600" /> Total Applications</span>
                  <span className="font-bold text-slate-800">{isHR ? (user.careerApplications?.length || 0) : (user.metrics?.totalApplicationsCount ?? (user.groundApplications?.length || 0))}</span>
                </div>
                <div className="flex justify-between items-center text-[12px] font-medium text-[#489b0d] pt-2 border-t border-slate-200">
                  <span className="flex items-center gap-1.5"><Award size={14} /> {isHR ? 'Hiring / Review Rate' : 'Approval Rate'}</span>
                  <span className="font-bold">{user.metrics?.approvalRate || 95}%</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[12px] font-medium text-slate-600">
                  <span>Total Applications</span>
                  <span className="font-bold text-slate-800">{user.loans?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center text-[12px] font-medium text-[#489b0d]">
                  <span>Approved</span>
                  <span className="font-bold">{user.loans?.filter(l => l.status === 'Approved').length || 0}</span>
                </div>
                <div className="flex justify-between items-center text-[12px] font-medium text-blue-600">
                  <span>Under Review</span>
                  <span className="font-bold">{user.loans?.filter(l => ['Under Review', 'Processing', 'Credit Appraisal'].includes(l.status)).length || 0}</span>
                </div>
                <div className="flex justify-between items-center text-[12px] font-medium text-red-600">
                  <span>Rejected</span>
                  <span className="font-bold">{user.loans?.filter(l => l.status === 'Rejected').length || 0}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white rounded-t-xl border-b border-slate-200 px-3 flex overflow-x-auto no-scrollbar gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer px-5 py-3.5 text-[13px] font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Body */}
      <div className="bg-white min-h-[420px] p-6 rounded-b-xl border border-t-0 border-slate-200">

        {/* ════════════════════════════════════════════════════════════════════
            STAFF / HEAD VIEW: TAB 1 - OVERVIEW & GROUND TRACKING
        ════════════════════════════════════════════════════════════════════ */}
        {isStaff && activeTab === "Overview & Ground Tracking" && (
          <div className="space-y-6">
            {/* Top KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50/30 border border-indigo-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-bold text-indigo-700 uppercase tracking-wide">{isHR ? 'HR Executives in Zone' : 'Ground Team Members'}</span>
                  <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                    <Users size={18} />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-800">{user.metrics?.totalTeamCount ?? (user.subordinateStaff?.length || 0)}</div>
                <p className="text-[11px] text-indigo-600 font-medium mt-1">{isHR ? 'Recruiters & Executives in Zone' : `Field Agents & Officers in ${user.zone || 'Territory'}`}</p>
              </div>

              {isHR ? (
                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50/30 border border-purple-100 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-bold text-purple-700 uppercase tracking-wide">Career Portal Leads</span>
                    <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-sm">
                      <FileSpreadsheet size={18} />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-800">{user.metrics?.totalCareerLeadsCount ?? (user.careerApplications?.length || 0)}</div>
                  <p className="text-[11px] text-purple-700 font-medium mt-1">Direct Career Page Job Applications</p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 border border-amber-100 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-bold text-amber-700 uppercase tracking-wide">Ground Leads Sourced</span>
                    <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-sm">
                      <Target size={18} />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-800">{user.metrics?.totalLeadsCount ?? (user.groundLeads?.length || 0)}</div>
                  <p className="text-[11px] text-amber-700 font-medium mt-1">Active customer inquiries in jurisdiction</p>
                </div>
              )}

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50/30 border border-blue-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-bold text-blue-700 uppercase tracking-wide">{isHR ? 'Interviews & Shortlists' : 'LOS Loan Pipeline'}</span>
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <FileText size={18} />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-800">{isHR ? (user.careerApplications?.filter(a => ['Reviewed', 'Interview', 'Shortlisted'].includes(a.status)).length || 0) : (user.metrics?.totalApplicationsCount ?? (user.groundApplications?.length || 0))}</div>
                <p className="text-[11px] text-blue-600 font-medium mt-1">{isHR ? 'Active Candidate Evaluation Stages' : 'Submitted applications under management'}</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50/30 border border-emerald-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-bold text-emerald-700 uppercase tracking-wide">{isHR ? 'Hired Candidates' : 'Disbursed Volume'}</span>
                  <div className="w-9 h-9 rounded-lg bg-[#489b0d] text-white flex items-center justify-center shadow-sm">
                    {isHR ? <UserCheck size={18} /> : <DollarSign size={18} />}
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-800">{isHR ? (user.careerApplications?.filter(a => a.status === 'Hired').length || 0) : (user.metrics?.disbursedAmount || '₹14,50,000')}</div>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">{isHR ? 'Successfully Onboarded Staff' : `Approval Success Rate: ${user.metrics?.approvalRate || 92}%`}</p>
              </div>
            </div>

            {/* Hierarchy & Jurisdiction Console */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Jurisdiction details */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-[14px] font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-600" /> Operational Territory & Hierarchy
                </h3>
                <div className="space-y-3">
                  <InfoRow label="Assigned Zone" value={user.zone || 'NORTH'} />
                  <InfoRow label="Department" value={user.department || (isHR ? 'Human Resources (HR)' : 'Operations')} />
                  <InfoRow label="Designation / Role" value={user.designation || user.role || 'HR Head'} />
                  <InfoRow label="Reports Directly To" value={user.reportsToHeadName || 'Super Admin'} />
                  <InfoRow label="Management Level" value={isHead ? "Level 1 - Executive Head" : "Level 2 - Staff"} />
                  <InfoRow label="Jurisdiction Status" value={user.status || 'Active'} />
                </div>
              </div>

              {/* Quick Ground Team Snapshot */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                    <Users size={16} className="text-indigo-600" /> {isHR ? 'Subordinate HR Executives & Recruiters' : 'Subordinate Ground Team Snapshot'}
                  </h3>
                  <button onClick={() => setActiveTab("Subordinate Ground Team")} className="text-[12px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                    View All ({user.subordinateStaff?.length || 0}) →
                  </button>
                </div>

                {user.subordinateStaff && user.subordinateStaff.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.subordinateStaff.slice(0, 4).map((staff, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between hover:bg-slate-100/70 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center uppercase">
                            {(staff.name || 'S').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-800">{staff.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{staff.role || 'HR Executive'} • {staff.empId || 'EMP'}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${staff.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                          {staff.status || 'Active'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400 text-[13px] border border-dashed border-slate-200 rounded-lg">
                    No staff currently assigned under this Head in {user.zone || 'this'} zone.
                  </div>
                )}
              </div>
            </div>

            {/* Career Page Leads / Ground Leads in Territory */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                  {isHR ? <FileSpreadsheet size={16} className="text-purple-600" /> : <Target size={16} className="text-amber-500" />}
                  {isHR ? 'Recent Career Page Applicants (HR Pipeline)' : 'Recent Ground Leads in Jurisdiction'}
                </h3>
                <button onClick={() => setActiveTab(isHR ? "Career Page Applicants (HR Leads)" : "Territory Leads Pipeline")} className="text-[12px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                  {isHR ? 'View All Career Leads →' : 'Full Leads Pipeline →'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-2.5 px-4">{isHR ? 'Application No' : 'Lead ID'}</th>
                      <th className="py-2.5 px-4">{isHR ? 'Candidate / Applicant' : 'Borrower / Applicant'}</th>
                      <th className="py-2.5 px-4">{isHR ? 'Applied Job Role' : 'Product Category'}</th>
                      <th className="py-2.5 px-4">{isHR ? 'Experience & Expected' : 'Amount'}</th>
                      <th className="py-2.5 px-4">{isHR ? 'Assigned HR Executive' : 'Assigned Ground Agent'}</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px] divide-y divide-slate-100">
                    {isHR ? (
                      user.careerApplications && user.careerApplications.slice(0, 5).map((app, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-purple-600 font-mono">{app.applicationNo || `APP-${idx+101}`}</td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-800">{app.name}</div>
                            <div className="text-[11px] text-slate-400">{app.email} • {app.phone}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium">{app.jobId?.title || 'Loan Officer'}</td>
                          <td className="py-3 px-4 text-slate-800 font-medium">
                            <div>{app.candidateType || 'Experienced'}</div>
                            <div className="text-[11px] text-slate-400">Exp: {app.expectedSalary || '₹4.5 LPA'}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium">{app.assignedTo || 'HR Executive'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              app.status === 'Hired' ? 'bg-emerald-100 text-emerald-700' :
                              app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                              app.status === 'Interview' ? 'bg-purple-100 text-purple-700' :
                              'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}>
                              {app.status || 'Applied'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      user.groundLeads && user.groundLeads.slice(0, 5).map((lead, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-blue-600">{lead.leadId || `LD-${idx+101}`}</td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-800">{lead.name}</div>
                            <div className="text-[11px] text-slate-400">{lead.mobile}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium">{lead.productCategory || 'Personal Loan'}</td>
                          <td className="py-3 px-4 font-bold text-slate-800">{lead.loanAmount ? `₹${Number(lead.loanAmount).toLocaleString('en-IN')}` : '₹3,00,000'}</td>
                          <td className="py-3 px-4 text-slate-600 font-medium">{lead.assignedTo || 'Unassigned'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              lead.status === 'Approved' || lead.status === 'Disbursed' ? 'bg-emerald-100 text-emerald-700' :
                              lead.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                              'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}>
                              {lead.status || 'In Progress'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                    {((isHR && (!user.careerApplications || user.careerApplications.length === 0)) ||
                      (!isHR && (!user.groundLeads || user.groundLeads.length === 0))) && (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-slate-400 font-medium">No records tracked in this jurisdiction yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STAFF / HEAD VIEW: TAB 2 - SUBORDINATE GROUND TEAM
        ════════════════════════════════════════════════════════════════════ */}
        {isStaff && activeTab === "Subordinate Ground Team" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">{isHR ? 'HR Executives & Recruiters' : 'Ground Field Staff & Officers'}</h2>
                <p className="text-[12px] text-slate-500 font-medium">Team members reporting under this Head in {user.zone || 'Zone'}</p>
              </div>
              <button onClick={() => navigate('/add-user')} className="flex items-center gap-1.5 px-4 py-2 bg-[#489b0d] text-white rounded-lg text-[12px] font-bold hover:bg-[#3d830b] transition-colors shadow-sm cursor-pointer">
                <Plus size={15} /> Add Team Member
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Member Details</th>
                      <th className="py-3.5 px-6">Employee ID</th>
                      <th className="py-3.5 px-6">Role & Designation</th>
                      <th className="py-3.5 px-6">Phone / Mobile</th>
                      <th className="py-3.5 px-6">Zone</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] divide-y divide-slate-100">
                    {user.subordinateStaff && user.subordinateStaff.map((staff, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center uppercase shadow-sm">
                              {(staff.name || 'S').slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{staff.name}</div>
                              <div className="text-[11px] text-slate-400">{staff.email || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-[12px] font-bold text-slate-700">{staff.empId || 'EMP-100'}</td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-700">{staff.role || 'HR Executive'}</span>
                          <p className="text-[11px] text-slate-500">{staff.designation || 'Staff'}</p>
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">{staff.mobile || staff.phone || 'N/A'}</td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">{staff.zone || user.zone || 'NORTH'}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${staff.status === 'Active' ? 'bg-[#489b0d]/10 text-[#489b0d]' : 'bg-red-100 text-red-600'}`}>
                            {staff.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button onClick={() => navigate(`/user-profile/${staff._id || staff.empId}`)} className="text-blue-600 hover:text-blue-800 font-bold text-[12px] inline-flex items-center gap-1 cursor-pointer">
                            <Eye size={14} /> View Member
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!user.subordinateStaff || user.subordinateStaff.length === 0) && (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                          <Users size={32} className="mx-auto mb-2 opacity-40" />
                          No ground staff found assigned to this territory head.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STAFF / HEAD VIEW: TAB 3 - CAREER PAGE APPLICANTS (HR LEADS)
        ════════════════════════════════════════════════════════════════════ */}
        {isStaff && activeTab === "Career Page Applicants (HR Leads)" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Career Portal Job Applications (HR Leads)</h2>
                <p className="text-[12px] text-slate-500 font-medium">Direct candidate applications submitted on website career portal in {user.zone || 'Zone'}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Application ID</th>
                      <th className="py-3.5 px-6">Candidate Details</th>
                      <th className="py-3.5 px-6">Position Applied</th>
                      <th className="py-3.5 px-6">Experience & Expected CTC</th>
                      <th className="py-3.5 px-6">Assigned HR Executive</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] divide-y divide-slate-100">
                    {user.careerApplications && user.careerApplications.map((app, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-bold text-purple-600 font-mono">{app.applicationNo || `APP-${idx+100}`}</td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-800">{app.name}</div>
                          <div className="text-[11px] text-slate-400">{app.email} • {app.phone}</div>
                        </td>
                        <td className="py-4 px-6 text-slate-700 font-medium">{app.jobId?.title || 'Loan Executive'}</td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-800">{app.candidateType || 'Experienced'}</span>
                          <div className="text-[11px] text-slate-400">Exp: {app.expectedSalary || '₹4,00,000'}</div>
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">{app.assignedTo || 'Unassigned'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            app.status === 'Hired' ? 'bg-emerald-100 text-emerald-700' :
                            app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            app.status === 'Interview' ? 'bg-purple-100 text-purple-700' :
                            'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {app.status || 'Applied'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button onClick={() => setViewCandidate(app)} className="text-purple-600 hover:text-purple-800 font-bold text-[12px] inline-flex items-center gap-1 cursor-pointer">
                            <Eye size={14} /> View Candidate
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!user.careerApplications || user.careerApplications.length === 0) && (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">No career applications currently tracked in this territory.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STAFF / HEAD VIEW: TAB 3 (ALTERNATIVE) - TERRITORY LEADS PIPELINE
        ════════════════════════════════════════════════════════════════════ */}
        {isStaff && activeTab === "Territory Leads Pipeline" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Ground Leads Pipeline</h2>
                <p className="text-[12px] text-slate-500 font-medium">All incoming and sourced loan leads tracked in {user.zone || 'Zone'}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Lead ID</th>
                      <th className="py-3.5 px-6">Customer / Borrower</th>
                      <th className="py-3.5 px-6">Product Type</th>
                      <th className="py-3.5 px-6">Requested Amount</th>
                      <th className="py-3.5 px-6">Assigned Agent</th>
                      <th className="py-3.5 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] divide-y divide-slate-100">
                    {user.groundLeads && user.groundLeads.map((lead, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-bold text-blue-600 font-mono">{lead.leadId || `LD-${idx+100}`}</td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-800">{lead.name}</div>
                          <div className="text-[11px] text-slate-400">{lead.mobile}</div>
                        </td>
                        <td className="py-4 px-6 text-slate-700 font-medium">{lead.productCategory || 'Un-Secured Loan'}</td>
                        <td className="py-4 px-6 font-bold text-slate-800">{lead.loanAmount ? `₹${Number(lead.loanAmount).toLocaleString('en-IN')}` : '₹5,00,000'}</td>
                        <td className="py-4 px-6 text-slate-600 font-medium">{lead.assignedTo || 'Direct Web Lead'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            lead.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                            lead.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {lead.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!user.groundLeads || user.groundLeads.length === 0) && (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">No leads currently in pipeline for this territory.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STAFF / HEAD VIEW: TAB 4 - LOAN APPLICATIONS (LOS PIPELINE)
        ════════════════════════════════════════════════════════════════════ */}
        {isStaff && activeTab === "Loan Applications (LOS)" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Territory Loan Origination (LOS)</h2>
                <p className="text-[12px] text-slate-500 font-medium">All applications undergoing credit verification and sanctioning</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Application ID</th>
                      <th className="py-3.5 px-6">Customer Name</th>
                      <th className="py-3.5 px-6">Loan Product</th>
                      <th className="py-3.5 px-6">Sanction / Applied Amount</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] divide-y divide-slate-100">
                    {user.groundApplications && user.groundApplications.map((loan, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 font-bold text-blue-600 font-mono">{loan.applicationId || `APP-${idx+200}`}</td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-800">{loan.customer || loan.name || 'Borrower'}</div>
                          <div className="text-[11px] text-slate-400">{loan.mobile}</div>
                        </td>
                        <td className="py-4 px-6 text-slate-700 font-medium">{loan.loanType || 'Business Loan'}</td>
                        <td className="py-4 px-6 font-bold text-slate-800">₹{Number(loan.amount || 350000).toLocaleString('en-IN')}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            loan.status === 'Approved' || loan.status === 'Disbursed' ? 'bg-[#489b0d]/10 text-[#489b0d]' :
                            loan.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {loan.status || 'Under Review'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button onClick={() => setViewLoan(loan.applicationId || 'APP')} className="text-blue-600 hover:text-blue-800 font-bold text-[12px] inline-flex items-center gap-1 cursor-pointer">
                            <Eye size={14} /> Review
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!user.groundApplications || user.groundApplications.length === 0) && (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">No active loan applications in this territory.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            STAFF / HEAD VIEW: TAB 5 - OFFICIAL PROFILE & HIERARCHY
        ════════════════════════════════════════════════════════════════════ */}
        {isStaff && activeTab === "Official Profile & Hierarchy" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800">Official Staff Credentials & Hierarchy</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-[14px] font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Briefcase size={16} className="text-blue-600" /> Organizational Details
                </h3>
                <div className="space-y-3">
                  <InfoRow label="Full Name" value={user.name} />
                  <InfoRow label="Employee ID" value={user.empId || user.userId} />
                  <InfoRow label="Department" value={user.department || (isHR ? 'Human Resources (HR)' : 'Operations')} />
                  <InfoRow label="Assigned Zone" value={user.zone || 'NORTH'} />
                  <InfoRow label="Designation" value={user.designation || user.role} />
                  <InfoRow label="Head of Department" value={isHead ? "Yes (Territory Head)" : "No"} />
                  <InfoRow label="Reporting Manager" value={user.reportsToHeadName || 'Super Admin'} />
                  <InfoRow label="Employment Status" value={user.status || 'Active'} />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-[14px] font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Mail size={16} className="text-emerald-600" /> Contact & System Access
                </h3>
                <div className="space-y-3">
                  <InfoRow label="Official Email" value={user.email} />
                  <InfoRow label="Primary Phone" value={user.phone || user.mobile || 'N/A'} />
                  <InfoRow label="Division / City" value={user.division || user.city || 'Headquarters'} />
                  <InfoRow label="State / Region" value={user.state || 'N/A'} />
                  <InfoRow label="Aadhaar Reference" value={user.aadhar || 'Verified on File'} />
                  <InfoRow label="PAN Reference" value={user.pan || 'Verified on File'} />
                  <InfoRow label="System Role" value={user.role || 'Staff'} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            CUSTOMER VIEWS: PERSONAL INFORMATION
        ════════════════════════════════════════════════════════════════════ */}
        {!isStaff && activeTab === "Personal Information" && (
          <div className="space-y-6">
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
                  <InfoRow label="Nationality" value={user.nationality || 'Indian'} />
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-[12px] font-medium text-slate-500">Address</span>
                    <span className="text-[13px] font-bold text-slate-800 text-right leading-relaxed">{user.address || 'N/A'}</span>
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
                    <span className="text-[13px] font-bold text-slate-800 text-right leading-relaxed">{user.currentAddress || user.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Social & Credit Details */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-bold text-slate-800">Credit & Profile</h3>
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <Globe size={16} />
                  </div>
                </div>
                <div className="space-y-4">
                  <InfoRow label="Occupation Type" value={user.occupation || 'Salaried'} />
                  <InfoRow label="Annual Income" value={user.annualIncome || '₹6,00,000'} />
                  <InfoRow label="Education" value={user.education || 'Graduate'} />
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <span className="text-[12px] font-medium text-slate-500">CIBIL Score</span>
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[13px] font-bold text-slate-800">{user.creditScore || 750}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#489b0d]/10 text-[#489b0d]">
                        Good
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            CUSTOMER VIEWS: KYC INFORMATION
        ════════════════════════════════════════════════════════════════════ */}
        {!isStaff && activeTab === "KYC Information" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800">KYC Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-[14px] font-bold text-slate-800 mb-4">PAN Card Verification</h3>
                <div className="space-y-3">
                  <InfoRow label="PAN Number" value={user.pan || 'N/A'} />
                  <InfoRow label="Name on Document" value={user.name} />
                  <InfoRow label="Status" value="Verified" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-[14px] font-bold text-slate-800 mb-4">Aadhaar Verification</h3>
                <div className="space-y-3">
                  <InfoRow label="Aadhaar Number" value={user.aadhaar || 'N/A'} />
                  <InfoRow label="Name on Document" value={user.name} />
                  <InfoRow label="Status" value="Verified" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            CUSTOMER VIEWS: EMPLOYMENT & FINANCIAL & LOANS
        ════════════════════════════════════════════════════════════════════ */}
        {!isStaff && activeTab === "Employment Details" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800">Employment Details</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <InfoRow label="Occupation Type" value={user.occupation || 'Salaried'} />
                <InfoRow label="Employer Name" value={user.employerName || 'TCS Ltd'} />
                <InfoRow label="Designation" value={user.designation || 'Software Engineer'} />
                <InfoRow label="Annual Income" value={user.annualIncome || '₹7,50,000'} />
              </div>
            </div>
          </div>
        )}

        {!isStaff && activeTab === "Financial Details" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800">Financial Details</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <InfoRow label="Bank Name" value={user.bankName || 'HDFC Bank'} />
                <InfoRow label="Account Number" value={user.accountNumber || 'XXXXX9876'} />
                <InfoRow label="IFSC Code" value={user.ifscCode || 'HDFC0001234'} />
                <InfoRow label="Monthly Net Salary" value={user.monthlyNetSalary || '₹65,000'} />
              </div>
            </div>
          </div>
        )}

        {!isStaff && activeTab === "Loan Applications" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">All Loan Applications</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[12px] font-bold text-slate-600">
                    <th className="py-4 px-6">Application ID</th>
                    <th className="py-4 px-6">Loan Product</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {user.loans && user.loans.map((loan, idx) => (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-bold text-blue-600">{loan.applicationId}</td>
                      <td className="py-4 px-6 font-bold text-slate-800">{loan.loanType}</td>
                      <td className="py-4 px-6 font-bold text-slate-800">₹{Number(loan.amount).toLocaleString('en-IN')}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#489b0d]/10 text-[#489b0d]">
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!user.loans || user.loans.length === 0) && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-400 font-medium">No loan applications recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isStaff && activeTab === "Uploaded Documents" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800">Document Repository</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user.documents && user.documents.map((doc, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col items-center text-center">
                  <FileText size={28} className="text-blue-500 mb-2" />
                  <h4 className="text-[12px] font-bold text-slate-800 truncate w-full">{doc.name}</h4>
                  <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-[#489b0d]">Verified</span>
                </div>
              ))}
              {(!user.documents || user.documents.length === 0) && (
                <div className="col-span-full py-8 text-center text-slate-400 text-[13px] border-2 border-dashed border-slate-200 rounded-xl">
                  No documents found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            ACTIVITY LOG TAB (COMMON)
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "Activity Log" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800">Audit & Activity Log</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="relative border-l-2 border-slate-100 ml-3 md:ml-4 space-y-6 pb-2">
                {user.activities && user.activities.length > 0 ? (
                  user.activities.map((activity, idx) => (
                    <div key={idx} className="relative pl-6 md:pl-8">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white bg-emerald-600 shadow-sm" />
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                        <h4 className="text-[14px] font-bold text-slate-800">{activity.title}</h4>
                        <span className="text-[11px] text-slate-400 font-medium">{activity.date}</span>
                      </div>
                      <p className="text-[13px] text-slate-600">{activity.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="relative pl-6 md:pl-8">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white bg-emerald-600 shadow-sm" />
                    <h4 className="text-[14px] font-bold text-slate-800">System Activity Initialized</h4>
                    <p className="text-[13px] text-slate-600 mt-1">
                      Account registered with {isStaff ? `${user.role || 'Staff'} status in ${user.zone || 'NORTH'} Zone` : 'verified profile'}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Candidate Profile Details Modal */}
      {viewCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewCandidate(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
              <div>
                <h3 className="font-extrabold text-slate-800 text-[16px]">Candidate Job Application</h3>
                <p className="text-[12px] text-slate-500 font-medium">{viewCandidate.applicationNo} • {viewCandidate.jobId?.title || 'Open Position'}</p>
              </div>
              <button onClick={() => setViewCandidate(null)} className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Candidate Name" value={viewCandidate.name} />
                <InfoRow label="Email Address" value={viewCandidate.email} />
                <InfoRow label="Phone Number" value={viewCandidate.phone} />
                <InfoRow label="Assigned Zone" value={viewCandidate.zone} />
                <InfoRow label="Candidate Type" value={viewCandidate.candidateType} />
                <InfoRow label="Expected CTC" value={viewCandidate.expectedSalary || 'N/A'} />
                <InfoRow label="Notice Period" value={viewCandidate.noticePeriod || 'Immediate'} />
                <InfoRow label="Status" value={viewCandidate.status || 'Applied'} />
              </div>
              {viewCandidate.resumeUrl && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between bg-purple-50/50 p-3 rounded-lg">
                  <span className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                    <FileText size={16} className="text-purple-600" /> Attached Resume
                  </span>
                  <a href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/${viewCandidate.resumeUrl}`} target="_blank" rel="noreferrer" className="text-[12px] font-bold text-purple-600 hover:text-purple-800 underline">
                    Download Resume
                  </a>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button onClick={() => setViewCandidate(null)} className="px-5 py-2 bg-slate-800 text-white rounded-lg font-bold text-[13px]">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Loan Details Modal */}
      {viewLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewLoan(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
              <div>
                <h3 className="font-extrabold text-slate-800 text-[16px]">Application Details</h3>
                <p className="text-[12px] text-slate-500 font-medium">{viewLoan}</p>
              </div>
              <button onClick={() => setViewLoan(null)} className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <p className="text-[13px] text-slate-600">Application verification and sanction records for reference ID {viewLoan}.</p>
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button onClick={() => setViewLoan(null)} className="px-5 py-2 bg-slate-800 text-white rounded-lg font-bold text-[13px]">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditUserModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50 rounded-t-xl">
              <h3 className="font-extrabold text-slate-800 text-[16px]">Edit Profile Details</h3>
              <button onClick={() => setEditUserModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Full Name</label>
                <input type="text" defaultValue={user.name} className="w-full border border-slate-300 rounded-lg p-2.5 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Email Address</label>
                <input type="email" defaultValue={user.email} className="w-full border border-slate-300 rounded-lg p-2.5 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Phone Number</label>
                <input type="text" defaultValue={user.phone || user.mobile} className="w-full border border-slate-300 rounded-lg p-2.5 text-[13px] text-slate-800 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
              <button onClick={() => setEditUserModal(false)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-bold text-[13px]">Cancel</button>
              <button onClick={() => {
                toast.success('Profile changes saved successfully!');
                setEditUserModal(false);
              }} className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold text-[13px]">Save Changes</button>
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
    <div className="flex justify-between items-center gap-4 py-1">
      <span className="text-[12px] font-medium text-slate-500">{label}</span>
      <span className="text-[13px] font-bold text-slate-800 text-right truncate" title={value}>{value || '-'}</span>
    </div>
  );
}
