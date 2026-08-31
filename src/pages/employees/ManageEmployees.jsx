import { useState } from 'react';
import { Search, UserPlus, Link2, EyeOff, Check, Hourglass, Edit, Eye, UserCheck, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function ManageEmployees() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const defaultEmployees = [
    { id: 'NUOGM-SEC-004', name: 'pranav singh', email: 'pranav@gmail.com', role: 'SECURED EXEC', designation: 'Secure Field Executive', status: 'Inactive', onboarding: 'Done' },
    { id: 'NUOGM-HR-002', name: 'rahul', email: 'rahul@gmail.com', role: 'HR', designation: 'HR Management', status: 'Inactive', onboarding: 'Pending' },
    { id: 'NUOGM-ULM-001', name: 'ramesh', email: 'ramesh@gmail.com', role: 'UNSECURED LOAN MANAGER', designation: 'executive manager', status: 'Active', onboarding: 'Done' },
    { id: 'NUOGM-AGM-002', name: 'jhone', email: 'jhone@gmail.com', role: 'AGENT MANAGER', designation: 'sales agent manager', status: 'Inactive', onboarding: 'Done' },
    { id: 'NUOGM-AGT-003', name: 'praveen manik', email: 'praveen@gmail.com', role: 'AGENT EXEC', designation: 'field executive', status: 'Inactive', onboarding: 'Done' },
    { id: 'NUOGM-AGM-001', name: 'kamal', email: 'kamal@gmail.com', role: 'AGENT MANAGER', designation: 'field agent manager', status: 'Active', onboarding: 'Done' },
    { id: 'NUOGM-SLM-003', name: 'kiran jha', email: 'kiranjha@gmail.com', role: 'SECURED LOAN MANAGER', designation: 'field supervisor', status: 'Inactive', onboarding: 'Done' },
    { id: 'NUOGM-RM-002', name: 'lucky singh', email: 'luckys@gmail.com', role: 'REPORTING MANAGER', designation: 'field executives reporting manager', status: 'Active', onboarding: 'Done' },
    { id: 'NUOGM-TC-001', name: 'avni saha', email: 'avnis@gmail.com', role: 'TELECALLER', designation: 'telecaller', status: 'Inactive', onboarding: 'Done' },
    { id: 'NUOGM-STC-001', name: 'sitaram', email: 'sitaram@gmail.com', role: 'SENIOR TELECALLER', designation: 'senior telecaller', status: 'Inactive', onboarding: 'Done' },
  ];

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('employees');
    if (saved) return JSON.parse(saved);
    
    // Save defaults to localStorage initially
    localStorage.setItem('employees', JSON.stringify(defaultEmployees));
    return defaultEmployees;
  });

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'SECURED EXEC': return 'bg-blue-50 text-blue-600';
      case 'HR': return 'bg-purple-100 text-purple-600';
      case 'UNSECURED LOAN MANAGER': return 'bg-teal-50 text-teal-600';
      case 'AGENT MANAGER': return 'bg-orange-50 text-orange-600';
      case 'AGENT EXEC': return 'bg-pink-50 text-pink-600';
      case 'SECURED LOAN MANAGER': return 'bg-amber-50 text-amber-600';
      case 'REPORTING MANAGER': return 'bg-red-50 text-red-600';
      case 'TELECALLER': return 'bg-fuchsia-50 text-fuchsia-600';
      case 'SENIOR TELECALLER': return 'bg-indigo-50 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleCopyLink = (empId) => {
    const link = `${window.location.origin}/onboarding/${empId}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Onboarding link copied! Share with employee via WhatsApp/Email.", {
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
        },
        iconTheme: {
          primary: '#22c55e',
          secondary: '#fff',
        },
      });
      setCopiedId(empId);
      setTimeout(() => setCopiedId(null), 3000);
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const handleStatusToggle = (id, currentStatus) => {
    const actionText = currentStatus === 'Active' ? 'Deactivate' : 'Activate';
    
    Swal.fire({
      title: `${actionText} Employee?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} this employee?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentStatus === 'Active' ? '#ef4444' : '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, ${actionText}`
    }).then((result) => {
      if (result.isConfirmed) {
        const newEmployees = employees.map(emp => {
          if (emp.id === id) {
            return { ...emp, status: currentStatus === 'Active' ? 'Inactive' : 'Active' };
          }
          return emp;
        });
        setEmployees(newEmployees);
        localStorage.setItem('employees', JSON.stringify(newEmployees));
        toast.success(`Employee ${actionText.toLowerCase()}d successfully`);
      }
    });
  };

  return (
    <div className="w-full bg-white min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 pb-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 mb-0.5">Employees</h1>
          <p className="text-[14px] text-gray-500 font-medium">{employees.length} total employees</p>
        </div>
        <button 
          onClick={() => navigate('/employees/add')}
          className="flex items-center gap-2 bg-[#6b21a8] hover:bg-[#581c87] text-white px-4 py-2 rounded-lg text-[14px] font-medium transition-colors"
        >
          <UserPlus size={16} />
          Add Employee
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative w-full max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search name, ID, role, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-[14px] text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-shadow shadow-sm placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pb-10">
        <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Onboarding</th>
                  <th className="py-4 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-[13px] font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate(`/employees/${emp.id}`)}>{emp.name}</p>
                        <p className="text-[12px] text-gray-400 mt-0.5">{emp.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[13px] text-gray-500 font-medium">{emp.id}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${getRoleBadgeStyle(emp.role)}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[13px] text-gray-500">{emp.designation}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleStatusToggle(emp.id, emp.status)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`}
                          title={emp.status === 'Active' ? 'Deactivate Employee' : 'Activate Employee'}
                        >
                          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emp.status === 'Active' ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-[12px] font-semibold ${emp.status === 'Active' ? 'text-emerald-600' : 'text-gray-500'}`}>
                          {emp.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {emp.onboarding === 'Done' || emp.onboardingStatus === 'Active' || emp.onboardingStatus === 'Submitted' ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
                          <Check size={14} strokeWidth={3} />
                          <span className="text-[11px] font-bold tracking-wide">Done</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2 py-1 rounded-md w-fit">
                          <Hourglass size={14} strokeWidth={2} />
                          <span className="text-[11px] font-bold tracking-wide">Pending</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {(!emp.onboardingStatus && emp.onboarding !== 'Done') || emp.onboardingStatus === 'Pending' ? (
                          copiedId === emp.id ? (
                            <button 
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#16a34a] text-white rounded-md transition-colors text-[12px] font-medium"
                            >
                              <Check size={14} />
                              Copied!
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleCopyLink(emp.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-[12px] font-medium"
                            >
                              <Link2 size={14} />
                              Copy Link
                            </button>
                          )
                        ) : (
                          <span className="text-[13px] text-gray-400 font-medium">
                            {emp.onboardingStatus === 'Submitted' ? 'Under Review' : 'Activated'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <p className="text-gray-500 text-sm font-medium">No employees found matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
