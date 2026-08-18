import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EditUser() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Edit User</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">User Management</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link to="/users" className="hover:text-[#489b0d] transition-colors">Manage Users</Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-slate-800">Edit User</span>
          </div>
        </div>
        
        <Link to="/users" className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm flex items-center gap-2">
           &larr; Back to Users
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-slate-800 mb-6">Personal Information</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="Ravi Kumar" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <input type="email" defaultValue="ravi.kumar@ngm.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="+91 9876543210" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Date of Birth</label>
                  <input type="date" defaultValue="1990-08-15" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Gender</label>
                  <select defaultValue="Male" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all appearance-none outline-none">
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
                  <select defaultValue="Super Admin" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all appearance-none outline-none">
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Status <span className="text-red-500">*</span></label>
                  <select defaultValue="Active" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all appearance-none outline-none">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="text-[13px] font-bold text-slate-800">Send Welcome Email</h4>
                  <p className="text-[11px] font-medium text-slate-500">Resend login credentials to user</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
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
                <input type="text" defaultValue="ravi.kumar" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Password</label>
                <input type="password" placeholder="********" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Confirm Password</label>
                <input type="password" placeholder="********" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all" />
                <p className="text-[10px] font-medium text-slate-400 mt-1">Leave blank to keep current password</p>
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
                  <select defaultValue="IT" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all appearance-none outline-none">
                    <option value="">Select department</option>
                    <option value="IT">IT Department</option>
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Reporting Manager</label>
                  <select defaultValue="2" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all appearance-none outline-none">
                    <option value="">Select manager (optional)</option>
                    <option value="1">Ravi Kumar</option>
                    <option value="2">Priya Sharma</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Remarks</label>
                <textarea rows="3" defaultValue="System administrator with full access" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#489b0d]/20 focus:border-[#489b0d] transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-4">
        <Link to="/users" className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm">
          Cancel
        </Link>
        <button className="px-6 py-2.5 bg-[#489b0d] text-white rounded-md text-[13px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm">
          Update User
        </button>
      </div>

    </div>
  );
}
