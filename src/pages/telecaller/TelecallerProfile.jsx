import { useState, useRef } from "react";
import { User, Mail, Phone, Camera, Save, KeyRound, CheckCircle2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

export default function TelecallerProfile() {
  const role = localStorage.getItem("userRole") || "Sales Admin";
  const picKey = `adminPic_${role}`;
  const nameKey = `adminName_${role}`;

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(localStorage.getItem(picKey) || "https://api.dicebear.com/7.x/avataaars/svg?seed=TC&backgroundColor=dff3ff");
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: localStorage.getItem(nameKey) || "Telecaller",
    email: localStorage.getItem("userEmail") || "telecaller@ngm.com",
    mobile: "9876543210"
  });

  const [secForm, setSecForm] = useState({ current: "", newPass: "", confirm: "" });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem(nameKey, form.name);
    localStorage.setItem(picKey, profilePic);
    window.dispatchEvent(new Event("profileUpdated"));
    setIsEditing(false);
    toast.success("Profile updated successfully.");
  };

  const handleSecurityUpdate = (e) => {
    e.preventDefault();
    if (secForm.newPass !== secForm.confirm) { toast.error("New passwords do not match."); return; }
    toast.success("Password changed successfully.");
    setSecForm({ current: "", newPass: "", confirm: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>My Profile</h1>
        <p className="text-[13px]" style={{ color: tc.muted }}>Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl p-6 text-center" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <div className="w-full h-full rounded-full overflow-hidden border-4" style={{ borderColor: tc.skyMid }}>
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} color="#fff" />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            </div>
            
            <h2 className="text-[16px] font-extrabold" style={{ color: tc.text }}>{form.name}</h2>
            <p className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: tc.sky, color: tc.blue }}>
              <ShieldCheck size={12} /> Telecaller Operator
            </p>

            <div className="mt-6 space-y-2">
              <button onClick={() => setActiveTab("profile")}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors"
                style={activeTab === "profile" ? { background: tc.blue, color: "#fff" } : { background: tc.card, color: tc.muted }}>
                <User size={16} /> Edit Profile
              </button>
              <button onClick={() => setActiveTab("security")}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors"
                style={activeTab === "security" ? { background: tc.blue, color: "#fff" } : { background: tc.card, color: tc.muted }}>
                <KeyRound size={16} /> Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3">
          
          {activeTab === "profile" && (
            <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: `1px solid ${tc.border}` }}>
                <h3 className="text-[15px] font-extrabold" style={{ color: tc.blue }}>Personal Information</h3>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-xl text-[12px] font-bold transition-colors"
                    style={{ background: tc.sky, color: tc.blue }}>
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Full Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
                      <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} disabled={!isEditing}
                        className="w-full h-10 pl-9 pr-4 rounded-xl border text-[13px] font-medium outline-none transition-colors"
                        style={{ borderColor: tc.border, background: isEditing ? tc.sky : "#F8FAFC", color: tc.text }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
                      <input type="email" value={form.email} disabled
                        className="w-full h-10 pl-9 pr-4 rounded-xl border text-[13px] font-medium outline-none cursor-not-allowed"
                        style={{ borderColor: tc.border, background: "#F1F5F9", color: tc.muted }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Mobile Number</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tc.muted }} />
                      <input type="tel" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} disabled={!isEditing}
                        className="w-full h-10 pl-9 pr-4 rounded-xl border text-[13px] font-medium outline-none transition-colors"
                        style={{ borderColor: tc.border, background: isEditing ? tc.sky : "#F8FAFC", color: tc.text }} />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
                  <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Employee ID</p><p className="text-[13px] font-bold" style={{ color: tc.text }}>EMP-1024</p></div>
                  <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Department</p><p className="text-[13px] font-bold" style={{ color: tc.text }}>Sales</p></div>
                  <div><p className="text-[11px] font-bold" style={{ color: tc.muted }}>Joining Date</p><p className="text-[13px] font-bold" style={{ color: tc.text }}>15 Aug 2026</p></div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-5" style={{ borderTop: `1px solid ${tc.border}` }}>
                    <button type="button" onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 rounded-xl text-[13px] font-bold border transition-colors"
                      style={{ borderColor: tc.border, color: tc.muted }}>
                      Cancel
                    </button>
                    <button type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-colors"
                      style={{ background: tc.blue }}>
                      <Save size={15} /> Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="rounded-2xl p-6" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
              <div className="mb-6 pb-4" style={{ borderBottom: `1px solid ${tc.border}` }}>
                <h3 className="text-[15px] font-extrabold" style={{ color: tc.blue }}>Change Password</h3>
              </div>

              <div className="p-4 rounded-xl mb-6 flex items-start gap-3" style={{ background: tc.cream, border: "1px solid #FDE047" }}>
                <ShieldCheck size={18} style={{ color: "#CA8A04", flexShrink: 0 }} />
                <div>
                  <p className="text-[12px] font-bold mb-1" style={{ color: "#854D0E" }}>Password Requirements</p>
                  <ul className="text-[11px] list-disc list-inside" style={{ color: "#A16207" }}>
                    <li>Minimum 8 characters</li>
                    <li>One uppercase & one lowercase letter</li>
                    <li>One number & one special character</li>
                  </ul>
                </div>
              </div>

              <form onSubmit={handleSecurityUpdate} className="space-y-5">
                <div>
                  <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Current Password</label>
                  <input type="password" value={secForm.current} onChange={e => setSecForm({...secForm, current: e.target.value})} required
                    className="w-full sm:w-1/2 h-10 px-4 rounded-xl border text-[13px] font-medium outline-none transition-colors"
                    style={{ borderColor: tc.border, background: tc.sky, color: tc.text }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>New Password</label>
                    <input type="password" value={secForm.newPass} onChange={e => setSecForm({...secForm, newPass: e.target.value})} required
                      className="w-full h-10 px-4 rounded-xl border text-[13px] font-medium outline-none transition-colors"
                      style={{ borderColor: tc.border, background: tc.sky, color: tc.text }} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold mb-1.5" style={{ color: tc.text }}>Confirm New Password</label>
                    <input type="password" value={secForm.confirm} onChange={e => setSecForm({...secForm, confirm: e.target.value})} required
                      className="w-full h-10 px-4 rounded-xl border text-[13px] font-medium outline-none transition-colors"
                      style={{ borderColor: tc.border, background: tc.sky, color: tc.text }} />
                  </div>
                </div>
                <div className="flex justify-end pt-5" style={{ borderTop: `1px solid ${tc.border}` }}>
                  <button type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold text-white transition-colors"
                    style={{ background: tc.blue }}>
                    <CheckCircle2 size={15} /> Update Password
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
