import { ChevronRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto">
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Reset Password</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">User Management</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">Manage Users</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-slate-800">Reset Password</span>
          </div>
        </div>
        
        <Link to="/users" className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm flex items-center gap-2">
           &larr; Back to Users
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column - User Information */}
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 h-fit">
          <h3 className="text-[15px] font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">User Information</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <img src="https://i.pravatar.cc/150?u=1" alt="Ravi Kumar" className="w-16 h-16 rounded-full border-2 border-slate-50 object-cover" />
            <div>
              <h2 className="text-[16px] font-bold text-slate-800 mb-0.5">Ravi Kumar</h2>
              <p className="text-[12px] font-medium text-slate-500 mb-0.5">ravi.kumar@ngm.com</p>
              <p className="text-[12px] font-bold text-[#489b0d]">Super Admin</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-slate-500">Username</span>
              <span className="text-[13px] font-bold text-slate-800">ravi.kumar</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-slate-500">Status</span>
              <span className="px-2.5 py-1 bg-emerald-50 text-[#489b0d] border border-emerald-100 rounded-md text-[10px] font-bold">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-slate-500">Last Login</span>
              <span className="text-[13px] font-bold text-slate-800">10 May 2025, 10:30 AM</span>
            </div>
          </div>
        </div>

        {/* Right Column - Reset Password Form */}
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-[15px] font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Reset Password</h3>
          
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">New Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter new password" 
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm new password" 
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="bg-[#489b0d]/5 border border-[#489b0d]/20 rounded-md p-4 flex gap-3">
              <CheckCircle2 size={16} className="text-[#489b0d] shrink-0 mt-0.5" />
              <p className="text-[12px] font-bold text-[#489b0d]">Password must be at least 8 characters long with a combination of letters, numbers and symbols.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
            <Link to="/users" className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm">
              Cancel
            </Link>
            <button className="px-6 py-2.5 bg-[#489b0d] text-white rounded-md text-[13px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm">
              Reset Password
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
