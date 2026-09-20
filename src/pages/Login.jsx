import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, User, Users, BarChart3, FileCheck, ChevronDown, AlertCircle, Send, CheckCircle2, Clock, X, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { storePermissions, ROLE_PERMISSIONS, clearPermissions } from '../utils/permissions';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [subRole, setSubRole] = useState('Tele callers operator');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Unlock Request Modal State
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [unblockIdentifier, setUnblockIdentifier] = useState('');
  const [unblockName, setUnblockName] = useState('');
  const [unblockReason, setUnblockReason] = useState('Late due to heavy traffic / public transport delay');
  const [customReason, setCustomReason] = useState('');
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
  const [querySubmittedSuccess, setQuerySubmittedSuccess] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusCheckResult, setStatusCheckResult] = useState(null);

  // Clear auth state when login page mounts (keep role-specific pics intact)
  useEffect(() => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userSubRole');
    localStorage.removeItem('userEmail');
    clearPermissions();
  }, []);

  const openUnlockModalForUser = (userData = {}) => {
    setUnblockIdentifier(userData.empId || userData.email || email);
    setUnblockName(userData.name || '');
    setStatusCheckResult(null);
    setQuerySubmittedSuccess(false);
    setShowUnblockModal(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const API_URL = import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL}`;

    if (role === 'Super Admin' || role === 'Admin') {
      try {
        let response = await fetch(`${API_URL}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        let data = await response.json();
        
        // If Admin login fails in admin collection, fallback to employee collection
        if (!response.ok && role === 'Admin') {
          response = await fetch(`${API_URL}/employees/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          data = await response.json();
        }
        
        if (response.ok) {
          const actualRole = data.role || data.employee?.role || role;
          const userEmail = data.email || data.employee?.email || email;

          // For Super Admin, do strict role check
          if (role === 'Super Admin') {
            const backendRoleStr = (actualRole || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            if (backendRoleStr !== 'superadmin') {
              toast.error(`Invalid role selected. This account is assigned as ${actualRole || 'another role'}.`);
              setIsLoading(false);
              return;
            }
          }

          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', role === 'Super Admin' ? 'Super Admin' : actualRole);
          localStorage.setItem('userEmail', userEmail);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.admin || data.user || data.employee || { _id: data._id, name: data.name, email: userEmail, role: actualRole }));
          
          // Store permissions from backend
          const roleKey = actualRole.toLowerCase().replace(/ /g, '_');
          storePermissions(data.permissions || data.employee?.permissions || ROLE_PERMISSIONS[roleKey] || []);
          toast.success(`Login Successful! Welcome, ${actualRole}.`);
          const cleanActual = actualRole.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (cleanActual.includes('tele')) {
            navigate('/telecaller');
          } else if (cleanActual.includes('agent')) {
            navigate('/agent');
          } else if (cleanActual.includes('account')) {
            navigate('/accountant');
          } else {
            navigate('/');
          }
        } else {
          if (data.isLateBlocked) {
            openUnlockModalForUser(data);
          } else {
            toast.error(data.message || 'Invalid email or password.');
          }
        }
      } catch (error) {
        toast.error('Server error. Please check if backend is running.');
      }
      setIsLoading(false);
      return;
    }

    const effectiveRole = (role === 'Sales Admin') ? subRole : role;

    try {
      const response = await fetch(`${API_URL}/employees/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const actualRole = data.role || data.employee?.role || effectiveRole;
        const actualDesignation = data.employee?.designation || data.designation || '';
        const userEmail = data.email || data.employee?.email || email;

        const normalizeRole = (r) => {
          const s = (r || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          if (s === 'hrhead' || s === 'hr_head') return 'hrhead';
          if (s === 'hrmanager' || s === 'hr_manager') return 'hrmanager';
          if (s === 'hrexecutive' || s === 'hr_executive' || s === 'hrexec') return 'hrexecutive';
          if (s === 'hr' || s === 'hradmin') return 'hradmin';
          if (s === 'telecaller' || s === 'telecallersoperator' || s === 'telecallers' || s === 'telecalleroperator' || s === 'seniortelecaller') return 'telecaller';
          if (s === 'agent' || s === 'agentoperator' || s === 'agentmanager' || s === 'agentexec') return 'agent';
          if (s === 'accountant' || s === 'accountantadmin') return 'accountant';
          if (s === 'credit' || s === 'creditadmin') return 'credit';
          if (s === 'operation' || s === 'operationadmin' || s === 'operations') return 'operation';
          if (s === 'sales' || s === 'salesadmin') return 'sales';
          if (s === 'admin') return 'admin';
          if (s === 'superadmin') return 'superadmin';
          return s;
        };

        const backendNorm = normalizeRole(actualRole);
        const desigNorm = normalizeRole(actualDesignation);
        const uiNorm = normalizeRole(effectiveRole);

        // Allow match if role or designation matches, or if generalized HR Admin is chosen for an HR staff member
        const isHRMatch = ['hradmin', 'hrhead', 'hrmanager', 'hrexecutive'].includes(uiNorm) && 
                          (['hradmin', 'hrhead', 'hrmanager', 'hrexecutive'].includes(backendNorm) || ['hrhead', 'hrmanager', 'hrexecutive'].includes(desigNorm));

        const isExactMatch = backendNorm === uiNorm || desigNorm === uiNorm || backendNorm.includes(uiNorm) || uiNorm.includes(backendNorm);

        if (!isHRMatch && !isExactMatch) {
          toast.error(`Invalid role selected. This account is assigned as ${actualRole || 'another role'}.`);
          setIsLoading(false);
          return;
        }

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', effectiveRole);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('token', data.token);
        if (data.employee || data.user) {
          localStorage.setItem('user', JSON.stringify(data.employee || data.user));
        } else {
          localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: userEmail, role: effectiveRole, empId: data.empId }));
        }
        
        // Store permissions from backend (or fallback to defaults if empty)
        const uiRoleStr = effectiveRole.toLowerCase().replace(/ /g, '_');
        const cleanRoleStr = effectiveRole.toLowerCase().replace(/[^a-z0-9]/g, '');
        const backendPerms = (Array.isArray(data.permissions) && data.permissions.length > 0)
          ? data.permissions
          : (Array.isArray(data.employee?.permissions) && data.employee.permissions.length > 0)
            ? data.employee.permissions
            : (ROLE_PERMISSIONS[cleanRoleStr] || ROLE_PERMISSIONS[uiRoleStr] || []);
        storePermissions(backendPerms);
        
        toast.success(`Login Successful! Welcome, ${effectiveRole}.`);

        // Route to different dashboards based on role
        const cleanEffective = effectiveRole.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanEffective.includes('tele')) {
          navigate("/telecaller");
        } else if (cleanEffective.includes('agent')) {
          navigate("/agent");
        } else if (cleanEffective.includes('account')) {
          navigate("/accountant");
        } else {
          // HR Head, HR Manager, HR Executive, HR Admin, Operations, Admin
          navigate("/"); 
        }
      } else {
        if (data.isLateBlocked) {
          openUnlockModalForUser(data);
        } else {
          toast.error(data.message || 'Invalid email or password.');
        }
      }
    } catch (error) {
      toast.error('Server error. Please check if backend is running.');
    }
    setIsLoading(false);
  };

  const handleSendUnblockQuery = async (e) => {
    e.preventDefault();
    if (!unblockIdentifier.trim()) {
      toast.error('Please enter your Employee ID or registered Email');
      return;
    }

    const finalQueryText = unblockReason === 'Custom' ? customReason.trim() : unblockReason;
    if (!finalQueryText) {
      toast.error('Please provide a reason / explanation for HR');
      return;
    }

    setIsSubmittingQuery(true);
    const API_URL = import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL}`;

    try {
      const res = await fetch(`${API_URL}/employees/request-unblock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: unblockIdentifier,
          queryText: finalQueryText
        })
      });

      const data = await res.json();
      if (res.ok) {
        setQuerySubmittedSuccess(true);
        toast.success('Query HR Panel par bhej di gayi hai!');
      } else {
        toast.error(data.message || 'Failed to submit query to HR');
      }
    } catch (error) {
      toast.error('Network error. Could not connect to server.');
    } finally {
      setIsSubmittingQuery(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!unblockIdentifier.trim()) {
      toast.error('Please enter Employee ID or Email to check status');
      return;
    }

    setIsCheckingStatus(true);
    const API_URL = import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL}`;

    try {
      const res = await fetch(`${API_URL}/employees/check-unblock-status?identifier=${encodeURIComponent(unblockIdentifier.trim())}`);
      const data = await res.json();
      if (res.ok) {
        setStatusCheckResult(data);
        if (data.canLoginNow) {
          toast.success('Badhai ho! HR ne aapki ID unblock kar di hai. Ab aap sign in kar sakte hain.');
        } else if (data.unblockRequest?.status === 'Pending') {
          toast('Aapki request HR ke review me hai (Pending).', { icon: '⏳' });
        } else if (data.unblockRequest?.status === 'Rejected') {
          toast.error('HR dwara request reject kar di gayi hai: ' + (data.unblockRequest?.hrRemark || 'Contact HR Admin'));
        } else {
          toast('HR Approval abhi pending hai.', { icon: 'ℹ️' });
        }
      } else {
        toast.error(data.message || 'Employee not found');
      }
    } catch (error) {
      toast.error('Failed to check status');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const roles = [
    'Super Admin',
    'Admin',
    'HR Head',
    'HR Manager',
    'HR Executive',
    'HR Admin',
    'Operation Admin',
    'Sales Admin',
    'Accountant Admin',
    'Credit Admin'
  ];

  const salesSubRoles = [
    'Tele callers operator',
    'Agent operator'
  ];

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-[var(--color-brand-page-bg)] text-[var(--color-brand-text)] font-sans overflow-hidden relative">
      {/* Background Wave */}
      <div
        className="absolute bottom-0 left-[-5%] w-[70%] h-[35%] lg:h-[40%] pointer-events-none z-0 hidden lg:block opacity-60"
        style={{
          backgroundImage: "url('/backLoan.png')",
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Left Section - Content */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center px-12 xl:px-24 z-10 h-full">
        <div className="mb-10">
          <img src="/loanlogo.png" alt="Logo" className="h-[90px] xl:h-[100px] object-contain" />
        </div>

        <div className="max-w-[460px]">
          <h2 className="text-[34px] xl:text-[38px] font-bold mb-3 leading-[1.2] tracking-tight text-[var(--color-brand-text)]">
            Welcome to <br />
            <span className="text-[var(--color-brand-blue-dark)]">Loan Management</span><br />
            System
          </h2>

          <div className="flex gap-1.5 mb-5">
            <div className="h-1 w-10 bg-[var(--color-brand-blue-primary)] rounded-full"></div>
            <div className="h-1 w-5 bg-[var(--color-brand-cream)] border border-slate-200 rounded-full"></div>
          </div>

          <p className="text-[var(--color-brand-text-secondary)] text-[13.5px] max-w-[380px] mb-8 leading-relaxed">
            Securely manage applications, users and loans with speed, accuracy and complete control.
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-6 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-[var(--color-brand-border)] shadow-sm relative z-20">
            <div className="flex gap-3.5 items-start">
              <div className="shrink-0 w-11 h-11 rounded-[14px] bg-[var(--color-brand-sky-light)] flex items-center justify-center text-[var(--color-brand-blue-dark)]">
                <ShieldCheck size={20} strokeWidth={2} />
              </div>
              <div className="pt-0.5">
                <h4 className="text-[13px] font-semibold text-[var(--color-brand-text)] mb-0.5">Secure & Reliable</h4>
                <p className="text-[11px] text-[var(--color-brand-text-secondary)] leading-relaxed">Bank-grade security<br />to protect your data</p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="shrink-0 w-11 h-11 rounded-[14px] bg-[var(--color-brand-sky-light)] flex items-center justify-center text-[var(--color-brand-blue-dark)]">
                <BarChart3 size={20} strokeWidth={2} />
              </div>
              <div className="pt-0.5">
                <h4 className="text-[13px] font-semibold text-[var(--color-brand-text)] mb-0.5">Smart Analytics</h4>
                <p className="text-[11px] text-[var(--color-brand-text-secondary)] leading-relaxed">Real-time insights<br />for better decisions</p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="shrink-0 w-11 h-11 rounded-[14px] bg-[var(--color-brand-sky-light)] flex items-center justify-center text-[var(--color-brand-blue-dark)]">
                <Users size={20} strokeWidth={2} />
              </div>
              <div className="pt-0.5">
                <h4 className="text-[13px] font-semibold text-[var(--color-brand-text)] mb-0.5">User Management</h4>
                <p className="text-[11px] text-[var(--color-brand-text-secondary)] leading-relaxed">Manage users, roles<br />and permissions</p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="shrink-0 w-11 h-11 rounded-[14px] bg-[var(--color-brand-sky-light)] flex items-center justify-center text-[var(--color-brand-blue-dark)]">
                <FileCheck size={20} strokeWidth={2} />
              </div>
              <div className="pt-0.5">
                <h4 className="text-[13px] font-semibold text-[var(--color-brand-text)] mb-0.5">Easy Workflow</h4>
                <p className="text-[11px] text-[var(--color-brand-text-secondary)] leading-relaxed">Streamlined loan<br />management process</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col relative z-10 bg-white lg:bg-transparent overflow-y-auto no-scrollbar">

        {/* Mobile Logo */}
        <div className="lg:hidden w-full flex justify-center pt-16 pb-6">
          <img src="/loanlogo.png" alt="Logo" className="h-[80px] object-contain" />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-start lg:items-center justify-center px-6 pb-6 pt-2 lg:p-6 w-full relative">
          <div className="w-full max-w-[460px] rounded-[18px] bg-white px-1 py-4 sm:p-10 lg:p-12 shadow-none lg:shadow-xl lg:shadow-slate-200/50 border-0 lg:border lg:border-[var(--color-brand-border)] relative lg:min-h-[480px] flex flex-col justify-center">

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-[14px] bg-[var(--color-brand-sky-light)] flex items-center justify-center shrink-0">
                <User size={28} className="text-[var(--color-brand-blue-dark)]" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[24px] font-bold text-[var(--color-brand-text)] tracking-tight">System <span className="text-[var(--color-brand-blue-dark)]">Login</span></h3>
                <p className="text-[13px] text-[var(--color-brand-text-secondary)] mt-1">Select your role and sign in</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              
              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-brand-text)]">Select Role</label>
                <div className="relative">
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-3 px-4 pr-10 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)] focus:ring-1 focus:ring-[var(--color-brand-blue-dark)] appearance-none cursor-pointer"
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-brand-text-secondary)] pointer-events-none" size={16} />
                </div>
              </div>

              {/* Sub-Role for Sales Admin */}
              {role === 'Sales Admin' && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[13px] font-semibold text-[var(--color-brand-text)]">Select Sub-Role</label>
                  <div className="relative">
                    <select 
                      value={subRole} 
                      onChange={(e) => setSubRole(e.target.value)}
                      className="w-full bg-[var(--color-brand-cream)]/30 border border-[var(--color-brand-border)] rounded-[10px] py-3 px-4 pr-10 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)] focus:ring-1 focus:ring-[var(--color-brand-blue-dark)] appearance-none cursor-pointer"
                    >
                      {salesSubRoles.map(sr => <option key={sr} value={sr}>{sr}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-brand-text-secondary)] pointer-events-none" size={16} />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-brand-text)]">Email / Employee ID</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[var(--color-brand-blue-dark)] transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-3 pl-11 pr-4 text-[13px] text-[var(--color-brand-text)] placeholder-slate-400 focus:outline-none focus:border-[var(--color-brand-blue-dark)] focus:ring-1 focus:ring-[var(--color-brand-blue-dark)] transition-all"
                    placeholder="Enter email or ID"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-brand-text)]">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[var(--color-brand-blue-dark)] transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-3 pl-11 pr-11 text-[13px] text-[var(--color-brand-text)] placeholder-slate-400 focus:outline-none focus:border-[var(--color-brand-blue-dark)] focus:ring-1 focus:ring-[var(--color-brand-blue-dark)] transition-all"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between pt-1 pb-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-[var(--color-brand-border)] text-[var(--color-brand-blue-primary)] focus:ring-[var(--color-brand-blue-primary)] cursor-pointer" />
                  <span className="text-[12.5px] text-[var(--color-brand-text-secondary)] group-hover:text-[var(--color-brand-text)] transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-[12.5px] text-[var(--color-brand-blue-dark)] font-semibold hover:opacity-80 transition-colors">Forgot Password?</a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-[10px] bg-[var(--color-brand-blue-primary)] hover:bg-[var(--color-brand-blue-dark)] text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
                {!isLoading && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                )}
              </button>

              {/* In-app HR Unblock Request Trigger */}
              <div className="pt-3 border-t border-slate-100 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => openUnlockModalForUser({ email, empId: email })}
                  className="text-[12.5px] font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200/70 transition-all flex items-center gap-1.5"
                >
                  <AlertCircle size={14} />
                  <span>ID Locked / Late? <strong>Submit Query to HR</strong></span>
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* IN-APP HR LOGIN QUERY / UNBLOCK REQUEST MODAL */}
      {/* ========================================================================= */}
      {showUnblockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white relative">
              <button
                onClick={() => setShowUnblockModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1.5 transition-colors"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Clock size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">HR Login Query & Unblock Request</h3>
                  <p className="text-xs text-amber-100">Directly submit query to HR Panel without SMS/WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
              
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5 text-amber-800">
                  <AlertCircle size={15} />
                  <span>Late Login / ID Block Alert</span>
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Office timings me late hone par ya account locked hone par, aap yahan se direct HR Panel ko unlock query bhej sakte hain. HR unblock karte hi aap login kar sakenge.
                </p>
              </div>

              <form onSubmit={handleSendUnblockQuery} className="space-y-4">
                
                {/* Identifier Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Employee ID / Registered Email</label>
                  <input
                    type="text"
                    value={unblockIdentifier}
                    onChange={(e) => setUnblockIdentifier(e.target.value)}
                    placeholder="e.g. NuoGM-EMP-2025-XXXX or email@company.com"
                    required
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                  {unblockName && (
                    <p className="text-[11px] text-slate-500 font-medium">Employee Name: <span className="text-slate-800 font-bold">{unblockName}</span></p>
                  )}
                </div>

                {/* Reason Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Select Late / Unlock Reason</label>
                  <select
                    value={unblockReason}
                    onChange={(e) => setUnblockReason(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Late due to heavy traffic / public transport delay">Traffic / Transport Delay</option>
                    <option value="Directly visited client site / Outdoor official visit">Direct Client Site Visit</option>
                    <option value="Personal medical issue / Family emergency">Medical / Family Emergency</option>
                    <option value="Technical glitch / System login issue">Technical Glitch / System Issue</option>
                    <option value="Custom">Other Reason (Type Custom Message)</option>
                  </select>
                </div>

                {/* Custom Reason Text */}
                {unblockReason === 'Custom' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Type Your Explanation / Message for HR</label>
                    <textarea
                      rows={3}
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Explain your reason clearly so HR can approve quickly..."
                      required
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                    />
                  </div>
                )}

                {/* Submit to HR Button */}
                <button
                  type="submit"
                  disabled={isSubmittingQuery}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingQuery ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  <span>{isSubmittingQuery ? 'Sending Query to HR...' : 'Submit Query to HR Panel'}</span>
                </button>

              </form>

              {/* Status Section & Live Checker */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Check HR Approval Status</span>
                  <button
                    type="button"
                    onClick={handleCheckStatus}
                    disabled={isCheckingStatus}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={isCheckingStatus ? 'animate-spin' : ''} />
                    <span>Check Live Status</span>
                  </button>
                </div>

                {statusCheckResult && (
                  <div className={`p-3 rounded-xl border text-xs ${
                    statusCheckResult.canLoginNow 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                      : statusCheckResult.unblockRequest?.status === 'Pending'
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    {statusCheckResult.canLoginNow ? (
                      <div className="space-y-2">
                        <p className="font-bold flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 size={16} />
                          <span>Approved by {statusCheckResult.hrApprovedBy || 'HR Admin'}!</span>
                        </p>
                        <p className="text-[11px] text-emerald-800">Aapki ID unblock ho chuki hai. Aap ab login kar sakte hain.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setShowUnblockModal(false);
                            toast.success('Ab aap apna password daal kar Sign In karein.');
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all"
                        >
                          Sign In Now
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="font-bold">Current Status: <span className="uppercase text-amber-600">{statusCheckResult.unblockRequest?.status || 'No Request'}</span></p>
                        <p className="text-[11px] text-slate-500">Late Locked: {statusCheckResult.isLateLocked ? 'Yes (Locked)' : 'No'}</p>
                        {statusCheckResult.unblockRequest?.hrRemark && (
                          <p className="text-[11px] text-slate-600">HR Remark: <em>{statusCheckResult.unblockRequest.hrRemark}</em></p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {querySubmittedSuccess && !statusCheckResult && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 size={15} />
                      <span>Query Successfully Submitted!</span>
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      Aapki request HR panel par chali gayi hai. HR se approve hone ke baad aap upar "Check Live Status" daba sakte hain ya direct sign in kar sakte hain.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowUnblockModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;
