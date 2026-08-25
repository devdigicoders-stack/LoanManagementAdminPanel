import { useState } from "react";
import { User, Mail, Phone, Briefcase, Camera, Save, Lock } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function AccountantProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  const name = localStorage.getItem(`adminName_${localStorage.getItem("userRole")}`) || "Accountant Admin";
  const pic = localStorage.getItem(`adminPic_${localStorage.getItem("userRole")}`) || "https://api.dicebear.com/7.x/avataaars/svg?seed=Accountant&backgroundColor=dff3ff";

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    toast.success("Password changed successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>My Profile</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Manage your account settings and password.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: tc.border }}>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-[13px] font-bold border-b-2 transition-all ${activeTab === "profile" ? "border-[#1e7ba8] text-[#1e7ba8]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Edit Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 text-[13px] font-bold border-b-2 transition-all ${activeTab === "password" ? "border-[#1e7ba8] text-[#1e7ba8]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Change Password
        </button>
      </div>

      {activeTab === "profile" ? (
        <form onSubmit={handleProfileUpdate} className="rounded-2xl p-6 space-y-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          
          <div className="flex items-center gap-6 pb-6 border-b" style={{ borderColor: tc.border }}>
            <div className="relative">
              <img src={pic} alt="Profile" className="w-20 h-20 rounded-2xl shadow-sm" style={{ border: `1px solid ${tc.border}` }} />
              <button type="button" className="absolute -bottom-2 -right-2 p-1.5 rounded-lg text-white shadow-md transition-all hover:opacity-90" style={{ background: tc.blue }}>
                <Camera size={14} />
              </button>
            </div>
            <div>
              <h2 className="text-[16px] font-extrabold" style={{ color: tc.text }}>Profile Photo</h2>
              <p className="text-[12px] mt-1" style={{ color: tc.muted }}>JPG or PNG. Max size of 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: tc.text }}><User size={14}/> Full Name</label>
              <input type="text" defaultValue={name} className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: tc.muted }}><Briefcase size={14}/> Employee ID</label>
              <input type="text" defaultValue="ACC-2024-001" disabled className="w-full h-11 px-4 rounded-xl text-[13px] outline-none cursor-not-allowed opacity-70" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.muted }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: tc.text }}><Mail size={14}/> Email Address</label>
              <input type="email" defaultValue="admin@accountant.com" className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: tc.text }}><Phone size={14}/> Mobile Number</label>
              <input type="tel" defaultValue="+91 9876543210" className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: tc.muted }}><Briefcase size={14}/> Department</label>
              <input type="text" defaultValue="Accounts / Finance" disabled className="w-full h-11 px-4 rounded-xl text-[13px] outline-none cursor-not-allowed opacity-70" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.muted }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: tc.muted }}><Briefcase size={14}/> Designation</label>
              <input type="text" defaultValue="Accountant Admin" disabled className="w-full h-11 px-4 rounded-xl text-[13px] outline-none cursor-not-allowed opacity-70" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.muted }} />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t" style={{ borderColor: tc.border }}>
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all text-white hover:opacity-90 shadow-sm" style={{ background: tc.blue }}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordUpdate} className="rounded-2xl p-6 space-y-6 max-w-lg" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <h2 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}><Lock size={16}/> Security Details</h2>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold" style={{ color: tc.text }}>Current Password <span className="text-red-500">*</span></label>
              <input type="password" required className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold" style={{ color: tc.text }}>New Password <span className="text-red-500">*</span></label>
              <input type="password" required className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} />
              <p className="text-[11px]" style={{ color: tc.muted }}>Min. 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold" style={{ color: tc.text }}>Confirm New Password <span className="text-red-500">*</span></label>
              <input type="password" required className="w-full h-11 px-4 rounded-xl text-[13px] outline-none transition-all" style={{ border: `1px solid ${tc.border}`, background: tc.bg, color: tc.text }} />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t" style={{ borderColor: tc.border }}>
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all text-white hover:opacity-90 shadow-sm" style={{ background: tc.blue }}>
              <Save size={16} /> Update Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
