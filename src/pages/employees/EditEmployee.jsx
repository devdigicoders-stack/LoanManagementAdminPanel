import React from 'react';
import { ChevronRight, ArrowLeft, Upload, Mail, Phone, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function EditEmployee() {
  const navigate = useNavigate();

  const handleUpdate = () => {
    toast.success('Employee updated successfully!');
    navigate('/employees');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Edit Employee</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/employees" className="hover:text-[#489b0d] transition-colors">Employee Management</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link to="/employees" className="hover:text-[#489b0d] transition-colors">Manage Employees</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Edit Employee</span>
          </div>
        </div>
        
        <Link to="/employees" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-bold hover:bg-slate-50 transition-colors shadow-sm">
          <ArrowLeft size={14} /> Back to List
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column - Profile Card Summary */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden sticky top-24">
            
            <div className="p-6 flex flex-col items-center border-b border-slate-100 text-center">
              <img src="https://i.pravatar.cc/150?u=1" alt="Ravi Kumar" className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm mb-4" />
              <h2 className="text-lg font-extrabold text-slate-800 mb-0.5">Ravi Kumar</h2>
              <p className="text-[13px] font-medium text-slate-500">Loan Officer</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <Mail size={14} className="text-slate-400" /> ravi.kumar@ngm.com
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <Phone size={14} className="text-slate-400" /> +91 98765 43210
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <Briefcase size={14} className="text-slate-400" /> Loan Department
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Form Tabs */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col h-full min-h-[600px]">
            
            {/* Tabs */}
            <div className="flex items-center gap-8 px-8 border-b border-slate-100 overflow-x-auto custom-scrollbar pt-2 shrink-0">
              {['Personal', 'Employment', 'Account & Access', 'Role & Permissions', 'Documents', 'Additional'].map((tab, i) => (
                <button 
                  key={i}
                  className={`py-4 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                    i === 0 ? 'border-[#489b0d] text-[#489b0d]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Form Content - Personal */}
            <div className="p-8 flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Form Fields */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <input type="text" defaultValue="Ravi Kumar" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                      <input type="email" defaultValue="ravi.kumar@ngm.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                      <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                      <input type="date" defaultValue="1990-08-15" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                      <select className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all">
                        <option value="Male" selected>Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Address <span className="text-red-500">*</span></label>
                      <textarea rows="3" defaultValue="123, Green Park, Lucknow, Uttar Pradesh - 226001" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all resize-none"></textarea>
                    </div>
                  </div>
                </div>

                {/* Profile Photo Upload */}
                <div className="lg:col-span-1">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Profile Photo</label>
                  <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-lg p-8 flex flex-col items-center justify-center hover:border-[#489b0d]/50 hover:bg-[#489b0d]/5 transition-colors cursor-pointer mt-2">
                    <img src="https://i.pravatar.cc/150?u=1" alt="Current" className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-white shadow-sm" />
                    <p className="text-[13px] font-bold text-[#489b0d] mb-1 flex items-center gap-1"><Upload size={14}/> Upload New Photo</p>
                    <p className="text-[11px] font-medium text-slate-500">PNG, JPG (Max. 2MB)</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-4 shrink-0 bg-slate-50/50">
              <Link to="/employees/EMP-1001" className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm">
                Cancel
              </Link>
              <button onClick={handleUpdate} className="px-6 py-2.5 bg-[#489b0d] text-white rounded-md text-[13px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm">
                Update Employee
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
