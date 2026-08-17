import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, User, Globe, Activity, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 font-sans selection:bg-[#D2A054]/30 overflow-hidden">
      
      {/* Left Section - Dark Theme */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-start p-10 xl:p-14 border-r border-[#232B3A] bg-[#0A0E17]">
        
        {/* Full height login_back.png */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/images/login_back.png')",
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#D2A054]/10 rounded-lg border border-[#D2A054] flex items-center justify-center transform rotate-45 shadow-sm">
              <div className="w-5 h-5 bg-[#D2A054] transform -rotate-45" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#D2A054] leading-tight">LoanPro</h1>
              <p className="text-xs text-slate-300 font-medium">Admin Panel</p>
            </div>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D2A054]/30 bg-[#D2A054]/10 text-[#D2A054] text-[10px] font-bold mb-6 uppercase tracking-wider">
              WELCOME BACK! <span>👋</span>
            </div>
            
            <h2 className="text-4xl xl:text-5xl font-bold mb-4 leading-tight text-white">
              Welcome to <br />
              <span className="text-[#D2A054]">Loan Management<br/>System</span>
            </h2>
            
            <p className="text-slate-400 text-sm max-w-sm mb-10 leading-relaxed font-medium">
              Securely manage applications, users, employees and grow your lending business with ease.
            </p>

            <div className="h-px w-12 bg-[#D2A054] mb-8"></div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-10 h-10 rounded-full border border-[#232B3A] bg-[#121824] shadow-sm flex items-center justify-center text-[#D2A054]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">Secure & Reliable</h4>
                  <p className="text-[11px] text-slate-400 leading-snug font-medium">Bank-grade security<br/>to protect your data</p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-10 h-10 rounded-full border border-[#232B3A] bg-[#121824] shadow-sm flex items-center justify-center text-[#D2A054]">
                  <Activity size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">Smart Analytics</h4>
                  <p className="text-[11px] text-slate-400 leading-snug font-medium">Real-time insights<br/>for better decisions</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-10 h-10 rounded-full border border-[#232B3A] bg-[#121824] shadow-sm flex items-center justify-center text-[#D2A054]">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">User Management</h4>
                  <p className="text-[11px] text-slate-400 leading-snug font-medium">Manage users, roles<br/>and permissions</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="shrink-0 w-10 h-10 rounded-full border border-[#232B3A] bg-[#121824] shadow-sm flex items-center justify-center text-[#D2A054]">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">Easy Workflow</h4>
                  <p className="text-[11px] text-slate-400 leading-snug font-medium">Streamlined loan<br/>management process</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col relative bg-slate-50 overflow-y-auto">
        
        {/* Language selector */}
        {/* <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-20">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs text-slate-600 hover:text-slate-900 shadow-sm transition-colors">
            <Globe size={14} />
            <span className="font-medium">English</span>
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div> */}

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 z-10 w-full h-full relative">
          
          <div className="w-full max-w-[400px] rounded-2xl border border-slate-100 bg-white p-8 sm:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative">
             
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#D2A054]/10 border border-[#D2A054]/20 flex items-center justify-center">
                <User size={24} className="text-[#D2A054]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Admin <span className="text-[#D2A054]">Login</span></h3>
                <p className="text-[13px] text-slate-500 mt-1 font-medium">Please sign in to your account</p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#D2A054] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#D2A054] focus:ring-1 focus:ring-[#D2A054] focus:bg-white transition-all font-medium"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#D2A054] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#D2A054] focus:ring-1 focus:ring-[#D2A054] focus:bg-white transition-all font-medium"
                    placeholder="Enter your password"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              {/* <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-slate-300 bg-slate-50 group-hover:border-[#D2A054]/50 flex items-center justify-center transition-colors">
                  </div>
                  <span className="text-[13px] text-slate-500 font-medium group-hover:text-slate-700 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-[13px] text-[#D2A054] font-medium hover:text-[#C89446] transition-colors">Forgot Password?</a>
              </div> */}

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D2A054] to-[#C89446] text-white font-bold text-[13px] tracking-wide uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-all mt-4 shadow-[0_8px_20px_rgba(210,160,84,0.3)] hover:shadow-[0_10px_25px_rgba(210,160,84,0.4)] hover:-translate-y-0.5"
              >
                Sign In
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>

              {/* Divider */}
              {/* <div className="relative py-1 flex items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-[11px] text-slate-400 font-bold uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div> */}

              {/* OTP Login */}
              {/* <button 
                type="button" 
                className="w-full py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm hover:shadow"
              >
                <ShieldCheck size={16} className="text-[#D2A054]" />
                Login with OTP
              </button> */}
            </form>
            
          </div>
        </div>

        {/* Footer info */}
        <div className="py-4 text-center z-10 w-full absolute bottom-0">
          <p className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
            <Lock size={10} />
            Secure login protected by advanced encryption
          </p>
        </div>

      </div>

    </div>
  );
};

export default LoginPage;
