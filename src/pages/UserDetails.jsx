import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Mail, Phone, MapPin, User, FileText, FileCheck, Clock, ChevronDown, Edit, Key, Shield, Trash2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function UserDetails() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userStatus, setUserStatus] = useState('Active');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleStatus = () => {
    setIsDropdownOpen(false);
    const action = userStatus === 'Active' ? 'Deactivate' : 'Activate';
    const color = userStatus === 'Active' ? '#ef4444' : '#489b0d';
    
    Swal.fire({
      title: `${action} User?`,
      text: `Are you sure you want to ${action.toLowerCase()} Ravi Kumar's account?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: color,
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: `Yes, ${action}!`
    }).then((result) => {
      if (result.isConfirmed) {
        setUserStatus(userStatus === 'Active' ? 'Inactive' : 'Active');
        toast.success(`User account has been ${action.toLowerCase()}d successfully.`);
      }
    });
  };
  return (
    <div className="w-full max-w-6xl mx-auto">
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">View User Details</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">User Management</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">Manage Users</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-slate-800">User Details</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm flex items-center gap-2">
            &larr; Back
          </button>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2 bg-[#489b0d] text-white rounded-md text-[13px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm flex items-center gap-2"
            >
              More Actions <ChevronDown size={16} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-2">
                <Link to="/users/1/edit" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#489b0d]">
                  <Edit size={16} /> Edit User
                </Link>
                <Link to="/users/1/reset-password" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#489b0d]">
                  <Key size={16} /> Reset Password
                </Link>
                <Link to="/users/roles" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#489b0d]">
                  <Shield size={16} /> Edit Permissions
                </Link>
                <Link to="/users/1/activity" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-[#489b0d]">
                  <Clock size={16} /> View Activity Log
                </Link>
                <div className="h-px bg-slate-100 my-1"></div>
                <button 
                  onClick={handleToggleStatus}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold transition-colors ${userStatus === 'Active' ? 'text-red-500 hover:bg-red-50' : 'text-[#489b0d] hover:bg-[#489b0d]/10'}`}
                >
                  {userStatus === 'Active' ? <><Trash2 size={16} /> Deactivate User</> : <><CheckCircle2 size={16} /> Activate User</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center border-b border-slate-100">
              <img src="https://i.pravatar.cc/150?u=1" alt="Ravi Kumar" className="w-24 h-24 rounded-full border-4 border-slate-50 object-cover shrink-0" />
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-slate-800">Ravi Kumar</h2>
                  <span className={`px-2.5 py-1 border rounded-md text-[10px] font-bold ${userStatus === 'Active' ? 'bg-emerald-50 text-[#489b0d] border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                    {userStatus}
                  </span>
                </div>
                <p className="text-[14px] font-bold text-slate-500">Super Admin</p>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div>
                <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#489b0d] shrink-0">
                      <Mail size={14} />
                    </div>
                    <span className="text-[13px] font-bold text-slate-700">ravi.kumar@ngm.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#489b0d] shrink-0">
                      <Phone size={14} />
                    </div>
                    <span className="text-[13px] font-bold text-slate-700">+91 9876543210</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#489b0d] shrink-0">
                      <MapPin size={14} />
                    </div>
                    <span className="text-[13px] font-bold text-slate-700">Bangalore, Karnataka, India</span>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div>
                <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4">Account Information</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-0.5">Username</p>
                    <p className="text-[13px] font-bold text-slate-800">ravi.kumar</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-0.5">Gender</p>
                    <p className="text-[13px] font-bold text-slate-800">Male</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-0.5">Date of Birth</p>
                    <p className="text-[13px] font-bold text-slate-800">15 Aug 1990</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-0.5">Created On</p>
                    <p className="text-[13px] font-bold text-slate-800">01 Apr 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#489b0d] flex items-center justify-center mb-3">
                <User size={18} />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-800 mb-1">48</h4>
              <p className="text-[11px] font-bold text-slate-500">Total Leads</p>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                <FileText size={18} />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-800 mb-1">156</h4>
              <p className="text-[11px] font-bold text-slate-500">Applications Created</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
                <FileCheck size={18} />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-800 mb-1">342</h4>
              <p className="text-[11px] font-bold text-slate-500">Documents Verified</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-5 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center mb-3">
                <Clock size={18} />
              </div>
              <h4 className="text-[13px] font-extrabold text-slate-800 mb-1">10 May 2025<br/>10:30 AM</h4>
              <p className="text-[11px] font-bold text-slate-500">Last Activity</p>
            </div>
          </div>
        </div>

        {/* Right Column - Role & Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h3 className="text-[14px] font-bold text-slate-800 border-b border-slate-100 pb-4 mb-4">Role & Permissions</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-1">Role</p>
                <p className="text-[13px] font-bold text-slate-800">Super Admin</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-1">Permissions</p>
                <p className="text-[13px] font-bold text-slate-800">All Modules Access</p>
              </div>
            </div>
            <Link to="/users/roles" className="mt-6 w-full flex items-center justify-center py-2 border border-slate-200 rounded-md text-[12px] font-bold text-[#489b0d] hover:bg-[#489b0d] hover:text-white transition-colors">
              Manage Permissions
            </Link>
          </div>

          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h3 className="text-[14px] font-bold text-slate-800 border-b border-slate-100 pb-4 mb-4">Status Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-1">Current Status</p>
                <span className={`px-2.5 py-1 border rounded-md text-[10px] font-bold inline-block mt-0.5 ${userStatus === 'Active' ? 'bg-emerald-50 text-[#489b0d] border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                  {userStatus}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-1">Status Since</p>
                <p className="text-[13px] font-bold text-slate-800">01 Apr 2025, 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
