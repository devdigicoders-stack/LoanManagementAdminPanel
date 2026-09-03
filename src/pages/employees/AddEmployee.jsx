import { useState } from 'react';
import { X, UserPlus, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function AddEmployee() {
  const navigate = useNavigate();

  // state for form fields
  const [formData, setFormData] = useState({
    fullName: '', role: '', email: '', password: '', mobile: '', designation: '', division: '',
    pincode: '', district: '', state: '', city: '',
    pan: '', aadhar: '',
    grossMonthly: '', transportation: '', performance: '', achievement: '', incentives: ''
  });

  const authRoles = [
    'Admin', 'HR Admin', 'Operation Admin', 'Sales Admin',
    'Tele callers operator', 'Agent operator', 'Accountant Admin', 'Credit Admin'
  ];
  const needsAuth = authRoles.includes(formData.role);

  const grossYearly = formData.grossMonthly ? (parseFloat(formData.grossMonthly) * 12).toString() : '';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
          const data = await res.json();
          if (data.status === 'OK' && data.results.length > 0) {
            const addressComponents = data.results[0].address_components;
            let pincode = '';
            let district = '';
            let state = '';
            let city = '';
            addressComponents.forEach(component => {
              if (component.types.includes('postal_code')) pincode = component.long_name;
              if (component.types.includes('administrative_area_level_2') || component.types.includes('administrative_area_level_3')) district = component.long_name;
              if (component.types.includes('administrative_area_level_1')) state = component.long_name;
              if (component.types.includes('locality')) city = component.long_name;
            });
            setFormData(prev => ({
              ...prev,
              pincode: pincode || prev.pincode,
              district: district || prev.district,
              state: state || prev.state,
              city: city || prev.city
            }));
            toast.success('Location fetched successfully!');
          } else {
            toast.error('Could not resolve address from coordinates');
          }
        } catch (error) {
          toast.error('Error fetching location details');
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        toast.error('Failed to get location. Please allow location access.');
        setIsFetchingLocation(false);
      }
    );
  };

  const handlePincodeChange = async (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, pincode: value }));
    
    if (value.length === 6 && /^\d+$/.test(value)) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        if (data && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setFormData(prev => ({
            ...prev,
            district: postOffice.District,
            state: postOffice.State,
            city: postOffice.Block || postOffice.Region || prev.city
          }));
          toast.success('Location auto-filled from Pincode!');
        }
      } catch (error) {
        console.error('Pincode fetch error', error);
      }
    }
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          
          let badgeRole = formData.role.toUpperCase();
          if (badgeRole === 'UNSECURED EXECUTIVE') badgeRole = 'UNSECURED EXEC';
          if (badgeRole === 'SECURED EXECUTIVE') badgeRole = 'SECURED EXEC';
          if (badgeRole === 'HR MANAGER') badgeRole = 'HR';
          
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              name: formData.fullName,
              role: badgeRole,
              email: formData.email,
              password: needsAuth ? formData.password : undefined,
              mobile: formData.mobile,
              designation: formData.designation,
              division: formData.division,
              pincode: formData.pincode,
              district: formData.district,
              state: formData.state,
              city: formData.city,
              pan: formData.pan,
              aadhar: formData.aadhar,
              grossMonthly: formData.grossMonthly ? Number(formData.grossMonthly) : undefined,
              transportation: formData.transportation ? Number(formData.transportation) : undefined,
              performance: formData.performance ? Number(formData.performance) : undefined,
              achievement: formData.achievement ? Number(formData.achievement) : undefined,
              incentives: formData.incentives ? Number(formData.incentives) : undefined
            })
          });

          const data = await res.json();
          if (res.ok) {
            toast.success('Employee created successfully.');
            navigate('/employees');
          } else {
            toast.error(data.message || 'Failed to create employee');
          }
        } catch (error) {
          toast.error('Server error while creating employee');
        }
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
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Email ID *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200" />
              </div>
              {needsAuth && (
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Login Password *</label>
                  <input required type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-200" />
                </div>
              )}
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
            <div className="flex items-center justify-between mb-5">
              <SectionHeader title="Location" colorClass="bg-teal-50 text-teal-600 mb-0" />
              <button 
                type="button"
                onClick={handleGetLocation}
                disabled={isFetchingLocation}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-sm disabled:opacity-70"
              >
                {isFetchingLocation ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Navigation size={14} />
                )}
                Use Current Location
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 px-1">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Pincode</label>
                <input type="text" name="pincode" placeholder="6-digit pincode" value={formData.pincode} onChange={handlePincodeChange} maxLength={6} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">District</label>
                <input type="text" name="district" placeholder="Auto-filled from pincode" value={formData.district} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200 placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">State</label>
                <input type="text" name="state" placeholder="Auto-filled from pincode" value={formData.state} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[14px] text-gray-800 focus:outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-200 placeholder:text-gray-400" />
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
