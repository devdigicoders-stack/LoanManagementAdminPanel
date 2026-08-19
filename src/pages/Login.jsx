import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, User, Users, BarChart3, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Clear auth state when login page mounts (acts as a logout mechanism)
  useEffect(() => {
    localStorage.removeItem('isAuthenticated');
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === '123456') {
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Login Successful! Welcome back.');
      navigate('/');
    } else {
      toast.error('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#51A500]/30 overflow-hidden relative">
      
      {/* Background Wave - slightly wider than 50% to go behind the login form, fixed small height */}
      <div 
        className="absolute bottom-0 left-[-5%] w-[70%] h-[35%] lg:h-[40%] pointer-events-none z-0 hidden lg:block opacity-80"
        style={{
          backgroundImage: "url('/backLoan.png')",
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Left Section - Content */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center px-12 xl:px-24 z-10 h-full">
        
        {/* Logo */}
        <div className="mb-10">
          <img src="/loanlogo.png" alt="Loan Management System Logo" className="h-[90px] xl:h-[100px] object-contain" />
        </div>

        <div className="max-w-[460px]">
          <h2 className="text-[34px] xl:text-[38px] font-bold mb-3 leading-[1.2] text-[#1E293B] tracking-tight">
            Welcome to <br />
            <span className="text-[#489b0d]">Loan Management</span><br/>
            System
          </h2>
          
          {/* Decorative Line */}
          <div className="flex gap-1.5 mb-5">
            <div className="h-1 w-10 bg-[#489b0d] rounded-full"></div>
            <div className="h-1 w-5 bg-[#FBBF24] rounded-full"></div>
          </div>
          
          <p className="text-slate-500 text-[13.5px] max-w-[380px] mb-8 leading-relaxed">
            Securely manage applications, users and loans with speed, accuracy and complete control.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm relative z-20">
            {/* Feature 1 */}
            <div className="flex gap-3.5 items-start">
              <div className="shrink-0 w-11 h-11 rounded-[14px] bg-[#F0FDF4] flex items-center justify-center text-[#489b0d]">
                <ShieldCheck size={20} strokeWidth={2} />
              </div>
              <div className="pt-0.5">
                <h4 className="text-[13px] font-semibold text-[#1E293B] mb-0.5">Secure & Reliable</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Bank-grade security<br/>to protect your data</p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="flex gap-3.5 items-start">
              <div className="shrink-0 w-11 h-11 rounded-[14px] bg-[#F0FDF4] flex items-center justify-center text-[#489b0d]">
                <BarChart3 size={20} strokeWidth={2} />
              </div>
              <div className="pt-0.5">
                <h4 className="text-[13px] font-semibold text-[#1E293B] mb-0.5">Smart Analytics</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Real-time insights<br/>for better decisions</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-3.5 items-start">
              <div className="shrink-0 w-11 h-11 rounded-[14px] bg-[#F0FDF4] flex items-center justify-center text-[#489b0d]">
                <Users size={20} strokeWidth={2} />
              </div>
              <div className="pt-0.5">
                <h4 className="text-[13px] font-semibold text-[#1E293B] mb-0.5">User Management</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Manage users, roles<br/>and permissions</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-3.5 items-start">
              <div className="shrink-0 w-11 h-11 rounded-[14px] bg-[#F0FDF4] flex items-center justify-center text-[#489b0d]">
                <FileCheck size={20} strokeWidth={2} />
              </div>
              <div className="pt-0.5">
                <h4 className="text-[13px] font-semibold text-[#1E293B] mb-0.5">Easy Workflow</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Streamlined loan<br/>management process</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col relative z-10 bg-white lg:bg-transparent overflow-y-auto no-scrollbar">
        
        {/* Language selector */}
        {/* <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-20">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] text-slate-700 hover:bg-slate-50 shadow-sm transition-colors font-semibold">
            <Globe size={15} />
            <span>English</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
        </div> */}

        {/* Mobile Logo */}
        <div className="lg:hidden w-full flex justify-center pt-16 pb-6">
          <img src="/loanlogo.png" alt="Loan Management System Logo" className="h-[80px] object-contain" />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-start lg:items-center justify-center px-6 pb-6 pt-2 lg:p-6 w-full relative">
          
          <div className="w-full max-w-[460px] rounded-lg bg-white px-1 py-4 sm:p-10 lg:p-12 shadow-none lg:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border-0 lg:border lg:border-slate-100 relative lg:min-h-[480px] flex flex-col justify-center">
             
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-lg bg-[#F0FDF4] flex items-center justify-center shrink-0">
                <User size={28} className="text-[#489b0d]" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-[24px] font-bold text-[#1E293B] tracking-tight">Admin <span className="text-[#489b0d]">Login</span></h3>
                <p className="text-[13px] text-slate-500 mt-1">Please sign in to continue to your account</p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[#1E293B]">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#489b0d] transition-colors">
                    <Mail size={16} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-[10px] py-3 pl-11 pr-4 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-[#1E293B]">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#489b0d] transition-colors">
                    <Lock size={16} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-[10px] py-3 pl-11 pr-11 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all"
                    placeholder="Enter your password"
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
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer" />
                  <span className="text-[12.5px] text-slate-500 group-hover:text-slate-800 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-[12.5px] text-[#489b0d] font-semibold hover:text-[#3e850b] transition-colors">Forgot Password?</a>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full py-3 rounded-[10px] bg-[#489b0d] hover:bg-[#3e850b] text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(72,155,13,0.2)] hover:shadow-[0_6px_16px_rgba(72,155,13,0.3)]"
              >
                Sign In
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>

              {/* Divider */}
              {/* <div className="relative py-1 flex items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink-0 mx-4 text-[11px] text-slate-400 font-bold uppercase tracking-wider">OR</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div> */}

              {/* OTP Login */}
              {/* <button 
                type="button" 
                className="w-full py-3 rounded-md border border-slate-200 bg-white text-slate-700 font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ShieldCheck size={18} className="text-[#489b0d]" />
                Login with OTP
              </button> */}
            </form>
            
          </div>
        </div>

        {/* Footer info */}
        {/* <div className="pb-8 text-center w-full mt-auto">
          <p className="flex items-center justify-center gap-1.5 text-[12px] text-slate-500 font-medium">
            <Lock size={12} className="text-slate-400" />
            Secure login protected by advanced encryption
          </p>
        </div> */}

      </div>

    </div>
  );
};

export default LoginPage;
