import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Camera, Save, KeyRound, Shield } from "lucide-react";

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">My Profile</h1>
        <p className="text-[12px] font-medium text-slate-500">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative mb-4 group cursor-pointer">
              <div className="w-24 h-24 rounded-full border-4 border-slate-50 overflow-hidden shadow-sm">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f8fafc" 
                  alt="Admin" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Admin User</h2>
            <p className="text-[12px] font-semibold text-[#489b0d] mt-1 bg-[#489b0d]/10 px-3 py-1 rounded-md">Super Admin</p>
            
            <div className="w-full h-px bg-slate-100 my-5"></div>
            
            <div className="w-full flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-[13px] font-bold transition-colors ${activeTab === "profile" ? "bg-[#489b0d] text-white" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <User size={16} /> Personal Information
              </button>
              <button 
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-[13px] font-bold transition-colors ${activeTab === "security" ? "bg-[#489b0d] text-white" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <KeyRound size={16} /> Security & Password
              </button>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 animate-in fade-in duration-300">
              <h3 className="text-[15px] font-bold text-slate-800 mb-6 pb-3 border-b border-slate-100">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-2">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" defaultValue="Admin User" className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" defaultValue="admin@ngm.com" className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="tel" defaultValue="+91 9876543210" className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-2">Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" defaultValue="Lucknow, UP" className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8 pt-6 border-t border-slate-100">
                <button className="h-10 px-6 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm flex items-center gap-2">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 animate-in fade-in duration-300">
              <h3 className="text-[15px] font-bold text-slate-800 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Shield size={18} className="text-[#489b0d]" /> Change Password
              </h3>
              
              <div className="max-w-md space-y-5">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-2">Current Password</label>
                  <input type="password" placeholder="Enter current password" className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all" />
                </div>
                
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-2">New Password</label>
                  <input type="password" placeholder="Enter new password" className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all" />
                  <p className="text-[10px] font-medium text-slate-400 mt-1">Must be at least 8 characters long</p>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 mb-2">Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] bg-white transition-all" />
                </div>
              </div>

              <div className="flex justify-start mt-8 pt-6 border-t border-slate-100">
                <button className="h-10 px-6 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm flex items-center gap-2">
                  <KeyRound size={16} /> Update Password
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
