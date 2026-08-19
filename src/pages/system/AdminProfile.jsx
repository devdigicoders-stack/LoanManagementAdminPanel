import React, { useState, useRef, useCallback } from "react";
import { User, Mail, Phone, MapPin, Camera, Save, KeyRound, Shield, CheckCircle2, X } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Load initial data from localStorage if exists
  const initialName = localStorage.getItem("adminName") || "Admin User";
  const initialPic = localStorage.getItem("adminPic") || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f8fafc";

  const [profilePic, setProfilePic] = useState(initialPic);
  const fileInputRef = useRef(null);

  // Cropper states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const [profileData, setProfileData] = useState({
    name: initialName,
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
      setIsEditing(false);
      localStorage.setItem("adminName", profileData.name);
      localStorage.setItem("adminPic", profilePic);
      window.dispatchEvent(new Event('profileUpdated'));
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
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image must be smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setProfilePic(croppedImage);
      localStorage.setItem("adminPic", croppedImage);
      window.dispatchEvent(new Event('profileUpdated'));
      toast.success("Profile picture updated successfully!");
      setIsCropping(false);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image.");
    }
  }, [imageSrc, croppedAreaPixels]);

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
              <div className="w-24 h-24 rounded-full border-4 border-slate-50 overflow-hidden shadow-sm bg-slate-100 flex items-center justify-center">
                <img 
                  src={profilePic} 
                  alt="Admin" 
                  className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            {/* Hidden File Input */}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
            />
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
                {!isEditing && (
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-[12px] rounded-md hover:bg-slate-200 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
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
                        disabled={!isEditing}
                        className={`w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all shadow-sm ${!isEditing ? 'bg-slate-50 opacity-70' : 'bg-white'}`} 
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
                        disabled={true}
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-500 bg-slate-100/70 transition-all shadow-sm opacity-70 cursor-not-allowed" 
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
                        disabled={!isEditing}
                        className={`w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all shadow-sm ${!isEditing ? 'bg-slate-50 opacity-70' : 'bg-white'}`} 
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
                        disabled={!isEditing}
                        className={`w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-[13px] font-bold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all shadow-sm ${!isEditing ? 'bg-slate-50 opacity-70' : 'bg-white'}`} 
                        required
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex items-center justify-end mt-8 pt-5 border-t border-slate-100 gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="h-10 px-6 rounded-lg text-slate-600 font-bold text-[13px] hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
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
                )}
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

      {/* Cropper Modal */}
      {isCropping && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Adjust Profile Picture</h3>
              <button 
                onClick={() => { setIsCropping(false); setImageSrc(null); }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative w-full h-[300px] bg-slate-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[12px] font-bold text-slate-500">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#489b0d]"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => { setIsCropping(false); setImageSrc(null); }}
                  className="px-4 py-2 font-bold text-[13px] text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={showCroppedImage}
                  className="px-4 py-2 font-bold text-[13px] text-white bg-[#489b0d] hover:bg-[#3e850b] rounded-lg transition-colors shadow-sm"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
