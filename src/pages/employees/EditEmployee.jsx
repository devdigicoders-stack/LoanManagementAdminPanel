import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Upload, Mail, Phone, Briefcase } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', designation: '', division: '',
    role: '', status: '', password: ''
  });

  const authRoles = [
    'Admin', 'HR Admin', 'Operation Admin', 'Sales Admin',
    'Tele callers operator', 'Agent operator', 'Accountant Admin', 'Credit Admin'
  ];
  const needsAuth = authRoles.includes(formData.role);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setFormData({
            empId: data.empId,
            name: data.name || '',
            email: data.email || '',
            mobile: data.mobile || '',
            designation: data.designation || '',
            division: data.division || '',
            role: data.role || '',
            status: data.status || 'Active',
            password: '' // Don't pre-fill password for security
          });
        } else {
          toast.error('Failed to load employee details');
          navigate('/employees');
        }
      } catch (error) {
        toast.error('Server error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployee();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success('Employee updated successfully!');
        navigate('/employees');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to update employee');
      }
    } catch (error) {
      toast.error('Server error while updating');
    }
  };

  if (isLoading) {
    return <div className="w-full flex justify-center py-20 text-slate-500">Loading details...</div>;
  }

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
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f8fafc" alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm mb-4" />
              <h2 className="text-lg font-extrabold text-slate-800 mb-0.5">{formData.name}</h2>
              <p className="text-[13px] font-medium text-slate-500">{formData.designation}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <Mail size={14} className="text-slate-400" /> {formData.email}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <Phone size={14} className="text-slate-400" /> {formData.mobile || 'N/A'}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <Briefcase size={14} className="text-slate-400" /> {formData.division || 'N/A'}
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
                  className={`py-4 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${i === 0 ? 'border-[#489b0d] text-[#489b0d]' : 'border-transparent text-slate-500 hover:text-slate-800'
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
                      <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                      <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Designation <span className="text-red-500">*</span></label>
                      <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Role <span className="text-red-500">*</span></label>
                      <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all">
                        <option value="">- Select Role -</option>
                        <option>Admin</option>
                        <option>HR Admin</option>
                        <option>Operation Admin</option>
                        <option>Sales Admin</option>
                        <option>Accountant Admin</option>
                        <option>Credit Admin</option>
                        <option>Tele callers operator</option>
                        <option>Agent operator</option>
                        <option>HR Manager</option>
                        <option>Operational Head</option>
                        <option>Operational Manager</option>
                        <option>Reporting Manager</option>
                        <option>Secured Loan Manager</option>
                        <option>Unsecured Loan Manager</option>
                        <option>Agent Manager</option>
                        <option>Secured Executive</option>
                        <option>Unsecured Executive</option>
                        <option>Agent Executive</option>
                        <option>Telecaller</option>
                      </select>
                    </div>
                    {needsAuth && (
                      <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Reset Password</label>
                        <input type="password" name="password" placeholder="Leave blank to keep current" value={formData.password} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Department / Division <span className="text-red-500">*</span></label>
                      <input type="text" name="division" value={formData.division} onChange={handleChange} className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#489b0d] focus:ring-2 focus:ring-[#489b0d]/20 transition-all" />
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
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f8fafc" alt="Current" className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-white shadow-sm" />
                    <p className="text-[13px] font-bold text-[#489b0d] mb-1 flex items-center gap-1"><Upload size={14} /> Upload New Photo</p>
                    <p className="text-[11px] font-medium text-slate-500">PNG, JPG (Max. 2MB)</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-4 shrink-0 bg-slate-50/50">
              <Link to={`/employees/${id}`} className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-md text-[13px] font-bold hover:bg-slate-50 transition-colors bg-white shadow-sm">
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
