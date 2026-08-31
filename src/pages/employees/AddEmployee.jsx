import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function AddEmployee() {
  const navigate = useNavigate();

  // state for form fields
  const [formData, setFormData] = useState({
    fullName: '', role: '', email: '', mobile: '', designation: '', division: '',
    pincode: '', district: '', state: '', city: '',
    pan: '', aadhar: '',
    grossMonthly: '', transportation: '', performance: '', achievement: '', incentives: ''
  });

  const grossYearly = formData.grossMonthly ? (parseFloat(formData.grossMonthly) * 12).toString() : '';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Create Employee?',
      text: 'Are you sure you want to add this employee to the system?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6b21a8',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Create Employee'
    }).then((result) => {
      if (result.isConfirmed) {
        const existing = localStorage.getItem('employees');
        let empList = existing ? JSON.parse(existing) : [];
        
        const newId = `NUOGM-EMP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        
        let badgeRole = formData.role.toUpperCase();
        if (badgeRole === 'UNSECURED EXECUTIVE') badgeRole = 'UNSECURED EXEC';
        if (badgeRole === 'SECURED EXECUTIVE') badgeRole = 'SECURED EXEC';
        if (badgeRole === 'HR MANAGER') badgeRole = 'HR';
        
        const newEmp = {
          id: newId,
          name: formData.fullName || 'New Employee',
          email: formData.email || 'employee@gmail.com',
          role: badgeRole || 'NEW ROLE',
          designation: formData.designation || 'Executive',
          status: 'Active',
          onboarding: 'Pending'
        };
        
        empList.unshift(newEmp);
        localStorage.setItem('employees', JSON.stringify(empList));

        toast.success('Employee created successfully.');
        navigate('/employees');
      }
    });
  };

  const SectionHeader = ({ title, colorClass }) => (
    <div className={`px-4 py-2.5 rounded-lg mb-5 font-bold text-[14px] ${colorClass}`}>
      {title}
    </div>
  );

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h1 className="text-[18px] font-bold text-gray-900">Add New Employee</h1>
          <button 
            onClick={() => navigate('/employees')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSave} className="p-8 space-y-8">
          
          {/* Basic Information */}
          <div>
            <SectionHeader title="Basic Information" colorClass="bg-purple-50 text-purple-700" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 px-1">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Full Name *</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Role *</label>
                <select required name="role" value={formData.role} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200">
                  <option value="">- Select Role -</option>
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
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Email ID *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Mobile No. *</label>
                <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Designation *</label>
                <input required type="text" name="designation" placeholder="e.g. Field Executive, Manager" value={formData.designation} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Division</label>
                <input type="text" name="division" placeholder="e.g. Sales, Operations" value={formData.division} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200 placeholder:text-gray-400" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <SectionHeader title="Location" colorClass="bg-teal-50 text-teal-600" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 px-1">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Pincode</label>
                <input type="text" name="pincode" placeholder="6-digit pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">District</label>
                <input type="text" name="district" placeholder="Auto-filled from pincode" value={formData.district} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">State</label>
                <select name="state" value={formData.state} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200">
                  <option value="">Select state</option>
                  <option>Andhra Pradesh</option>
                  <option>Arunachal Pradesh</option>
                  <option>Assam</option>
                  <option>Bihar</option>
                  <option>Chhattisgarh</option>
                  <option>Goa</option>
                  <option>Gujarat</option>
                  <option>Haryana</option>
                  <option>Himachal Pradesh</option>
                  <option>Jharkhand</option>
                  <option>Karnataka</option>
                  <option>Kerala</option>
                  <option>Madhya Pradesh</option>
                  <option>Maharashtra</option>
                  <option>Manipur</option>
                  <option>Meghalaya</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">City / Location</label>
                <input type="text" name="city" placeholder="City or area" value={formData.city} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200 placeholder:text-gray-400" />
              </div>
            </div>
          </div>

          {/* Identity Documents */}
          <div>
            <SectionHeader title="Identity Documents" colorClass="bg-orange-50 text-orange-600" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 px-1">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">PAN Number *</label>
                <input required type="text" name="pan" placeholder="ABCDE1234F" value={formData.pan} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 uppercase focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-200 placeholder:text-gray-400 placeholder:normal-case" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Aadhar Number *</label>
                <input required type="text" name="aadhar" placeholder="12-digit Aadhar" value={formData.aadhar} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-200 placeholder:text-gray-400" />
              </div>
            </div>
          </div>

          {/* Salary Structure */}
          <div>
            <SectionHeader title="Salary Structure" colorClass="bg-green-50 text-green-600" />
            <p className="text-[12px] text-gray-500 font-medium px-1 mb-4">Enter monthly salary — annual will auto-calculate (x12)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 px-1">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Gross Monthly (₹) *</label>
                <input required type="number" name="grossMonthly" placeholder="e.g. 30000" value={formData.grossMonthly} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-200 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Gross Yearly (₹)</label>
                <input type="text" value={grossYearly} readOnly placeholder="Auto-calculated" className="w-full bg-green-50/50 border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-600 font-medium focus:outline-none cursor-not-allowed placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Transportation Allowance (₹)</label>
                <input type="number" name="transportation" placeholder="e.g. 2000" value={formData.transportation} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-200 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Performance Bonus (₹)</label>
                <input type="number" name="performance" placeholder="e.g. 5000" value={formData.performance} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-200 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Achievement Bonus (₹)</label>
                <input type="number" name="achievement" placeholder="e.g. 3000" value={formData.achievement} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-200 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Business Incentives (₹)</label>
                <input type="number" name="incentives" placeholder="e.g. 1000" value={formData.incentives} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-200 placeholder:text-gray-400" />
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 px-1">
            <button 
              type="button"
              onClick={() => navigate('/employees')}
              className="text-[14px] font-bold text-gray-500 hover:text-gray-700 transition-colors w-full md:w-1/4"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="w-full md:flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] text-[14px] font-bold text-white bg-[#6b21a8] hover:bg-[#581c87] transition-colors shadow-sm"
            >
              <UserPlus size={18} />
              Create Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
