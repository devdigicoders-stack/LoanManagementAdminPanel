import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AddUser() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Add New User</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">User Management</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">Manage Users</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-slate-800">Add New User</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-slate-800 mb-6">Personal Information</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter full name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <input type="email" placeholder="Enter email address" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter phone number" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Date of Birth</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Gender</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all appearance-none outline-none">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Role & Status */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-slate-800 mb-6">Role & Status</h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Role <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all appearance-none outline-none">
                    <option value="">Select role</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Status <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all appearance-none outline-none">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="text-[13px] font-bold text-slate-800">Send Welcome Email</h4>
                  <p className="text-[11px] font-medium text-slate-500">User will receive login credentials via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#489b0d]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-slate-800 mb-6">Account Information</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Username <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter username" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                <input type="password" placeholder="Enter password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                <input type="password" placeholder="Confirm password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-slate-800 mb-6">Additional Information</h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Department</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all appearance-none outline-none">
                    <option value="">Select department</option>
                    <option value="IT">IT</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Reporting Manager</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all appearance-none outline-none">
                    <option value="">Select manager (optional)</option>
                    <option value="1">Ravi Kumar</option>
                    <option value="2">Priya Sharma</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Remarks</label>
                <textarea rows="3" placeholder="Enter any remarks (optional)" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-4">
        <Link to="/users" className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors">
          Cancel
        </Link>
        <button className="px-6 py-2.5 bg-[#489b0d] text-white rounded-md text-[13px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm">
          Save User
        </button>
      </div>

    </div>
  );
}
