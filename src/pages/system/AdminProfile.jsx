import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Camera, Save, KeyRound, Shield, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@ngm.com",
    phone: "+91 9876543210",
    location: "Lucknow, UP"
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile information updated successfully!");
    }, 800);
  };

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
      toast.success("Password changed successfully!");
    }, 800);
  };

  const handleImageUpload = () => {
    Swal.fire({
      title: 'Upload Profile Picture',
      text: "Select an image from your device to update your avatar.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#489b0d',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Select Image'
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Profile picture updated (Simulation)");
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">My Profile</h1>
        <p className="text-[12px] font-medium text-slate-500">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        
        {/* Left Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center">
            <div 
              className="relative mb-4 group cursor-pointer"
              onClick={handleImageUpload}
            >
              <div className="w-24 h-24 rounded-full border-4 border-slate-50 overflow-hidden shadow-sm">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f8fafc" 
                  alt="Admin" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-800">{profileData.name}</h2>
            <p className="text-[12px] font-semibold text-[#489b0d] mt-1 bg-[#489b0d]/10 px-3 py-1 rounded-md flex items-center gap-1.5 justify-center">
              <Shield size={12} /> Super Admin
            </p>
            
            <div className="w-full h-px bg-slate-100 my-5"></div>
            
            <div className="w-full flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-bold transition-colors ${activeTab === "profile" ? "bg-[#489b0d] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <User size={16} /> Personal Information
              </button>
              <button 
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-bold transition-colors ${activeTab === "security" ? "bg-[#489b0d] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <KeyRound size={16} /> Security & Password
              </button>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                <div>
                  <h3 className="text-[16px] font-extrabold text-slate-800">Personal Information</h3>
                  <p className="text-[12px] font-medium text-slate-500 mt-1">Update your personal details and contact info.</p>
                </div>
              </div>
              
              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all shadow-sm" 
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-slate-50/50 transition-all shadow-sm" 
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="tel" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all shadow-sm" 
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all shadow-sm" 
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end mt-8 pt-5 border-t border-slate-100 gap-3">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="h-10 px-6 rounded-lg bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSaving ? (
                      <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Saving...</>
                    ) : (
                      <><Save size={16} /> Save Changes</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                <div>
                  <h3 className="text-[16px] font-extrabold text-slate-800">Security Settings</h3>
                  <p className="text-[12px] font-medium text-slate-500 mt-1">Update your password to keep your account secure.</p>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg mb-6 flex items-start gap-3">
                <Shield className="text-amber-500 mt-0.5 shrink-0" size={18} />
                <div>
                  <h4 className="text-[13px] font-bold text-amber-800 mb-1">Password Requirements</h4>
                  <ul className="text-[11px] font-medium text-amber-700 list-disc pl-4 space-y-1">
                    <li>Minimum 8 characters long</li>
                    <li>Must contain at least one uppercase letter</li>
                    <li>Must contain at least one number and special character</li>
                  </ul>
                </div>
              </div>

              <form onSubmit={handleSecurityUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="md:col-span-2">
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">Current Password</label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="password" 
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                        className="w-full md:w-1/2 h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all shadow-sm" 
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">New Password</label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="password" 
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all shadow-sm" 
                        placeholder="Enter new password"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="password" 
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all shadow-sm" 
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end mt-8 pt-5 border-t border-slate-100 gap-3">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="h-10 px-6 rounded-lg bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSaving ? (
                      <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Updating...</>
                    ) : (
                      <><CheckCircle2 size={16} /> Update Password</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
