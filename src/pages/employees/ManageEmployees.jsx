import { useState, useEffect } from 'react';
import { Search, UserPlus, Link2, EyeOff, Check, Hourglass, Edit, Eye, UserCheck, UserX, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function ManageEmployees() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(location.state?.initialSearch || '');
  const [copiedId, setCopiedId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      // Adding search filter if present
      let url = `${import.meta.env.VITE_API_BASE_URL}/employees`;
      if (searchTerm) {
        url += `?search=${searchTerm}`;
      }

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // The backend returns an array of Employee documents
        // We will map MongoDB `_id` to `id` for frontend consistency, 
        // and keep `empId` as it is (e.g. NUOGM-SEC-004)
        const currentUserRole = (localStorage.getItem('userRole') || '').toLowerCase();
        let formatted = Array.isArray(data) ? data.map(emp => ({
          id: emp._id,
          empId: emp.empId,
          name: emp.name,
          email: emp.email,
          role: emp.role,
          designation: emp.designation,
          status: emp.status,
          onboarding: emp.onboardingStatus, // 'Pending', 'Submitted', 'Done'
        })) : [];

        if (currentUserRole === 'hr admin') {
          formatted = formatted.filter(emp => {
             const r = (emp.role || '').toLowerCase();
             return !['hr admin', 'hr', 'super admin', 'admin'].includes(r);
          });
        }

        setEmployees(formatted);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce the search input to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchEmployees();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}/status`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.ok) {
            const updatedEmployee = await res.json();
            // Update local state to reflect new status instantly without reloading entire list
            setEmployees(employees.map(emp => 
              emp.id === id ? { ...emp, status: updatedEmployee.status } : emp
            ));
            toast.success(`Employee ${actionText.toLowerCase()}d successfully`);
          } else {
            toast.error('Failed to change status');
          }
        } catch (error) {
          toast.error('Server error');
        }
      }
    });
  };

  const handleDeleteEmployee = (id) => {
    Swal.fire({
      title: 'Delete Employee?',
      text: "This action cannot be undone! The employee will be permanently removed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.ok) {
            setEmployees(employees.filter(emp => emp.id !== id));
            toast.success('Employee deleted successfully');
          } else {
            toast.error('Failed to delete employee');
          }
        } catch (error) {
          toast.error('Server error');
        }
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
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-[13px] font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate(`/employees/${emp.id}`)}>{emp.name}</p>
                        <p className="text-[12px] text-gray-400 mt-0.5">{emp.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-[13px] text-gray-500 font-medium">{emp.empId}</p>
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
                      {emp.onboarding === 'Done' || emp.onboarding === 'Submitted' ? (
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
                      <div className="flex items-center gap-2">
                        {emp.onboarding !== 'Done' && emp.onboarding !== 'Submitted' ? (
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
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-md text-[12px] font-bold border border-green-100 w-fit">
                            <Check size={14} strokeWidth={3} />
                            Activated
                          </div>
                        )}
                        <button 
                          onClick={() => navigate(`/employees/${emp.id}`)}
                          className="flex items-center justify-center p-1.5 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          title="View Profile & Documents"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => navigate(`/employees/${emp.id}/edit`)}
                          className="flex items-center justify-center p-1.5 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 hover:text-orange-500 transition-colors"
                          title="Edit Employee"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteEmployee(emp.id)}
                          className="flex items-center justify-center p-1.5 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 hover:text-red-500 transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <p className="text-gray-500 text-sm font-medium">Loading employees...</p>
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <p className="text-gray-500 text-sm font-medium">No employees found matching your search.</p>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
