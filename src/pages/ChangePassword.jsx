import React, { useState } from "react";
import { KeyRound, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ChangePassword() {
  const [isSaving, setIsSaving] = useState(false);
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSecurityUpdate = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (!securityData.currentPassword || !securityData.newPassword) {
      toast.error("Please fill all password fields.");
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully! Next time you login, please use your new password.");
    }, 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col pb-10">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Change Password</h1>
        <p className="text-[12px] font-medium text-slate-500">Update your account password to maintain security</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl mb-8 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Shield className="text-amber-600" size={20} />
          </div>
          <div>
            <h4 className="text-[14px] font-extrabold text-amber-900 mb-2">Password Security Requirements</h4>
            <ul className="text-[12px] font-medium text-amber-800 list-disc pl-4 space-y-1.5">
              <li>Must be at least 8 characters long</li>
              <li>Must contain at least one uppercase letter (A-Z)</li>
              <li>Must contain at least one number (0-9)</li>
              <li>Must contain at least one special character (!@#$%^&*)</li>
              <li>Cannot be the same as your previous password</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSecurityUpdate} className="max-w-2xl">
          <div className="space-y-6">
            
            <div>
              <label className="block text-[13px] font-extrabold text-slate-700 mb-2">Current Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  value={securityData.currentPassword}
                  onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                  className="w-full md:w-3/4 h-12 pl-11 pr-4 rounded-lg border border-slate-200 text-[14px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all shadow-sm" 
                  placeholder="Enter current password"
                  required
                />
              </div>
            </div>
            
            <div className="w-full md:w-3/4 h-px bg-slate-100 my-2"></div>

            <div>
              <label className="block text-[13px] font-extrabold text-slate-700 mb-2">New Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  value={securityData.newPassword}
                  onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                  className="w-full md:w-3/4 h-12 pl-11 pr-4 rounded-lg border border-slate-200 text-[14px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all shadow-sm" 
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-extrabold text-slate-700 mb-2">Confirm New Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  value={securityData.confirmPassword}
                  onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                  className="w-full md:w-3/4 h-12 pl-11 pr-4 rounded-lg border border-slate-200 text-[14px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all shadow-sm" 
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>
            
          </div>

          <div className="flex items-center mt-10 pt-6 border-t border-slate-100 gap-4">
            <button 
              type="submit"
              disabled={isSaving}
              className="h-12 px-8 rounded-lg bg-[#489b0d] text-white font-extrabold text-[14px] hover:bg-[#3e850b] transition-colors shadow-md flex items-center gap-2 disabled:opacity-70"
            >
              {isSaving ? (
                <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Updating Password...</>
              ) : (
                <><CheckCircle2 size={18} /> Update Password</>
              )}
            </button>
            <button 
              type="button"
              onClick={() => setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" })}
              className="h-12 px-6 rounded-lg border border-slate-200 text-slate-600 font-extrabold text-[14px] hover:bg-slate-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
