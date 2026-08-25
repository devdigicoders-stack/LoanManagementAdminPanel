import { useState } from "react";
import { User, Lock, Edit } from "lucide-react";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function AgentProfile() {
  const role = localStorage.getItem("userRole") || "Sales Admin";
  const name = localStorage.getItem(`adminName_${role}`) || "Agent Operator";
  const email = localStorage.getItem("userEmail") || "agent@tele.com";
  const pic = localStorage.getItem(`adminPic_${role}`) || "https://api.dicebear.com/7.x/avataaars/svg?seed=Agent&backgroundColor=dff3ff";

  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({ name, mobile: "+91 9876543210", email });
  const [passForm, setPassForm] = useState({ current: "", new: "", confirm: "" });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(`adminName_${role}`, profileForm.name);
    alert("Profile updated successfully.");
    window.location.reload();
  };

  const handlePassSubmit = (e) => {
    e.preventDefault();
    if(passForm.new !== passForm.confirm) {
      alert("New passwords do not match.");
      return;
    }
    alert("Password changed successfully.");
    setPassForm({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="space-y-6 w-full">
      
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>My Profile</h1>
        <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Manage your personal information and security settings.</p>
      </div>

      <div className="flex items-center gap-4 border-b pb-4 mb-6" style={{ borderColor: tc.border }}>
        <button 
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${activeTab === "profile" ? "bg-[#DFF3FF] text-[#1e7ba8]" : "text-[#667085] hover:bg-gray-50"}`}
        >
          <User size={16} /> Profile
        </button>
        <button 
          onClick={() => setActiveTab("password")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${activeTab === "password" ? "bg-[#DFF3FF] text-[#1e7ba8]" : "text-[#667085] hover:bg-gray-50"}`}
        >
          <Lock size={16} /> Change Password
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col - Avatar & Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-2xl p-6 flex flex-col items-center text-center" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 mb-4 relative group" style={{ borderColor: tc.skyMid }}>
              <img src={pic} alt="profile" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Edit size={20} className="text-white" />
              </div>
            </div>
            <h2 className="text-[16px] font-extrabold" style={{ color: tc.text }}>{name}</h2>
            <p className="text-[13px] font-bold mt-1" style={{ color: tc.blue }}>Agent Operator</p>
            <p className="text-[12px] mt-1" style={{ color: tc.muted }}>Sales Department</p>
            
            <div className="w-full mt-6 pt-6 text-left space-y-3" style={{ borderTop: `1px solid ${tc.border}` }}>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Employee ID</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>EMP-1025</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Email</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>{email}</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Joining Date</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>15 Jan 2026</p></div>
              <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Account Status</p><span className="text-[11px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full mt-1 inline-block">Active</span></div>
            </div>
          </div>
        </div>

        {/* Right Col - Forms */}
        <div className="md:col-span-2">
          {activeTab === "profile" && (
            <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <h2 className="text-[15px] font-extrabold mb-5" style={{ color: tc.text }}>Edit Profile</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold" style={{ color: tc.text }}>Full Name</label>
                  <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full h-10 px-3 rounded-lg text-[13px] outline-none bg-white" style={{ border: `1px solid ${tc.border}`, color: tc.text }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold" style={{ color: tc.text }}>Mobile Number</label>
                  <input type="text" value={profileForm.mobile} onChange={(e) => setProfileForm({...profileForm, mobile: e.target.value})} className="w-full h-10 px-3 rounded-lg text-[13px] outline-none bg-white" style={{ border: `1px solid ${tc.border}`, color: tc.text }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold" style={{ color: tc.text }}>Email Address</label>
                  <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full h-10 px-3 rounded-lg text-[13px] outline-none bg-white" style={{ border: `1px solid ${tc.border}`, color: tc.text }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold" style={{ color: tc.text }}>Department (Read-only)</label>
                    <input type="text" value="Sales" readOnly className="w-full h-10 px-3 rounded-lg text-[13px] outline-none bg-gray-50 cursor-not-allowed" style={{ border: `1px solid ${tc.border}`, color: tc.muted }} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold" style={{ color: tc.text }}>Designation (Read-only)</label>
                    <input type="text" value="Agent Operator" readOnly className="w-full h-10 px-3 rounded-lg text-[13px] outline-none bg-gray-50 cursor-not-allowed" style={{ border: `1px solid ${tc.border}`, color: tc.muted }} />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90" style={{ background: tc.blue }}>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <h2 className="text-[15px] font-extrabold mb-5" style={{ color: tc.text }}>Change Password</h2>
              <form onSubmit={handlePassSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold" style={{ color: tc.text }}>Current Password <span className="text-red-500">*</span></label>
                  <input required type="password" placeholder="Enter current password" value={passForm.current} onChange={(e) => setPassForm({...passForm, current: e.target.value})} className="w-full h-10 px-3 rounded-lg text-[13px] outline-none bg-white" style={{ border: `1px solid ${tc.border}`, color: tc.text }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold" style={{ color: tc.text }}>New Password <span className="text-red-500">*</span></label>
                  <input required type="password" placeholder="Enter new password" value={passForm.new} onChange={(e) => setPassForm({...passForm, new: e.target.value})} className="w-full h-10 px-3 rounded-lg text-[13px] outline-none bg-white" style={{ border: `1px solid ${tc.border}`, color: tc.text }} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold" style={{ color: tc.text }}>Confirm Password <span className="text-red-500">*</span></label>
                  <input required type="password" placeholder="Confirm new password" value={passForm.confirm} onChange={(e) => setPassForm({...passForm, confirm: e.target.value})} className="w-full h-10 px-3 rounded-lg text-[13px] outline-none bg-white" style={{ border: `1px solid ${tc.border}`, color: tc.text }} />
                </div>
                
                <div className="p-4 rounded-xl text-[12px]" style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.muted }}>
                  <strong>Password Requirements:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Minimum 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number & one special character</li>
                  </ul>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90" style={{ background: tc.blue }}>
                    Update Password
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
