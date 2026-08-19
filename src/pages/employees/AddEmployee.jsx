import React, { useState } from 'react';
import { ChevronRight, Upload, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AddEmployee() {
  const navigate = useNavigate();
  
  const handleSave = () => {
    toast.success('Employee added successfully!');
    navigate('/employees');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Add New Employee</h1>
        <div className="flex items-center text-[12px] font-medium text-slate-500">
          <Link to="/employees" className="hover:text-[#489b0d] transition-colors">Employee Management</Link>
          <ChevronRight size={14} className="mx-1" />
          <span className="text-[#489b0d] font-bold">Add Employee</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter full name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <input type="email" placeholder="Enter email address" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" placeholder="Enter phone number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all">
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100">Employment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Employee ID</label>
                <input type="text" value="Auto-generated" disabled className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-md text-[13px] font-bold text-slate-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Department <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all">
                  <option value="">Select department</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Designation <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all">
                  <option value="">Select designation</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Branch <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all">
                  <option value="">Select branch</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Joining Date <span className="text-red-500">*</span></label>
                <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Reporting Manager <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all">
                  <option value="">Select reporting manager</option>
                </select>
              </div>
            </div>
          </div>

          {/* Role & Status */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100">Role & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Role <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all">
                  <option value="">Select role</option>
                  <option value="Admin">Admin</option>
                  <option value="Loan Officer">Loan Officer</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Status <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Profile Photo */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 text-center">
            <h3 className="text-[15px] font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100 text-left">Profile Photo</h3>
            <div className="mt-4 border-2 border-dashed border-slate-200 bg-slate-50 rounded-lg p-8 flex flex-col items-center justify-center hover:border-[#489b0d]/50 hover:bg-[#489b0d]/5 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-[#489b0d]/10 text-[#489b0d] flex items-center justify-center mb-3">
                <Upload size={20} />
              </div>
              <p className="text-[13px] font-bold text-[#489b0d] mb-1">Upload Photo</p>
              <p className="text-[11px] font-medium text-slate-500">PNG, JPG (Max. 2MB)</p>
            </div>
          </div>

          {/* Login Information */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h3 className="text-[15px] font-bold text-slate-800 mb-5 pb-3 border-b border-slate-100">Login Information</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Username <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter username" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="password" placeholder="Enter password" className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="password" placeholder="Confirm password" className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Link to="/employees" className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm">
          Cancel
        </Link>
        <button onClick={handleSave} className="px-6 py-2.5 bg-[#489b0d] text-white rounded-md text-[13px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm">
          Save Employee
        </button>
      </div>

    </div>
  );
}
