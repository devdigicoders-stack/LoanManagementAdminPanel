import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, User, Users, BarChart3, FileCheck, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { storePermissions, ROLE_PERMISSIONS, clearPermissions } from '../utils/permissions';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [subRole, setSubRole] = useState('Tele callers operator');
  const navigate = useNavigate();

  // Clear auth state when login page mounts (keep role-specific pics intact)
  useEffect(() => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userSubRole');
    localStorage.removeItem('userEmail');
    clearPermissions();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
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
          // For Super Admin, do strict role check
          if (role === 'Super Admin') {
            const backendRoleStr = (data.role || '').toLowerCase().replace(/ /g, '');
            const uiRoleStr = 'superadmin';
            if (backendRoleStr !== uiRoleStr && backendRoleStr !== 'super admin') {
              toast.error(`Invalid role selected. This account is assigned as ${data.role || 'another role'}.`);
              return;
            }
          }

          const actualRole = data.role || role;
          localStorage.setItem('isAuthenticated', 'true');
          // For Admin, use their actual role from DB so sidebar filters correctly
          localStorage.setItem('userRole', role === 'Super Admin' ? 'Super Admin' : actualRole);
          localStorage.setItem('userEmail', data.email);
          localStorage.setItem('token', data.token);
          
          // Store permissions from backend (the ones SuperAdmin granted them)
          const roleKey = actualRole.toLowerCase().replace(/ /g, '_');
          storePermissions(data.permissions || ROLE_PERMISSIONS[roleKey] || []);
          toast.success(`Login Successful! Welcome, ${actualRole}.`);
          navigate('/');
        } else {
          toast.error(data.message || 'Invalid email or password.');
        }
      } catch (error) {
        toast.error('Server error. Please check if backend is running.');
      }
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
        const backendRoleStr = (data.role || '').toLowerCase().replace(/ /g, '');
        const uiRoleStr = effectiveRole.toLowerCase().replace(/ /g, '');

        if (backendRoleStr !== uiRoleStr) {
          toast.error(`Invalid role selected. This account is assigned as ${data.role || 'another role'}.`);
          return;
        }

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', effectiveRole);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('token', data.token);
        
        // Store permissions from backend
        storePermissions(data.permissions || ROLE_PERMISSIONS[uiRoleStr] || []);
        
        toast.success(`Login Successful! Welcome, ${effectiveRole}.`);

        // Route to different dashboards based on role
        if (effectiveRole === 'Tele callers operator') {
          navigate("/telecaller");
        } else if (effectiveRole === 'Agent operator') {
          navigate("/agent");
        } else if (effectiveRole === 'Accountant Admin') {
          navigate("/accountant");
        } else if (effectiveRole === 'HR Admin') {
          navigate("/"); // Navigates to HRDashboard via RoleBasedDashboard
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message || 'Invalid email or password.');
      }
    } catch (error) {
      toast.error('Server error. Please check if backend is running.');
    }
  };

  const roles = [
    'Super Admin',
    'Admin',
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
                className="w-full py-3 rounded-[10px] bg-[var(--color-brand-blue-primary)] hover:bg-[var(--color-brand-blue-dark)] text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm mt-2"
              >
                Sign In
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
};

export default LoginPage;
