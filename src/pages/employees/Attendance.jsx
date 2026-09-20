import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, CheckCircle2, XCircle, Clock, UserCheck, Edit, Download, Lock } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function Attendance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Role details
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const storedRole = localStorage.getItem('userRole') || currentUser.role || 'Admin';
  const roleLower = storedRole.toLowerCase();
  const cleanRole = roleLower.replace(/[^a-z0-9]/g, '');
  const isMasterAdmin = ['super admin', 'superadmin', 'admin', 'administrator'].includes(roleLower) || ['superadmin', 'admin'].includes(cleanRole);
  const isHRHead = ['hr head', 'hr_head', 'hr admin', 'hradmin', 'hr'].includes(roleLower) || 
                   ['hrhead', 'hradmin', 'hr'].includes(cleanRole) || 
                   (currentUser.designation || '').toLowerCase().includes('hr head');
  const isHRManager = ['hr manager', 'hr_manager', 'hrmanager'].includes(roleLower) || 
                     ['hrmanager'].includes(cleanRole) || 
                     (currentUser.designation || '').toLowerCase().includes('hr manager');
  const isHRExecutive = !isMasterAdmin && !isHRHead && !isHRManager;
  const canManage = isMasterAdmin || isHRHead || isHRManager;

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/attendance?date=` + date, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(Array.isArray(data) ? data : []);
      } else {
        toast.error('Failed to fetch attendance');
      }
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  // Helper to parse 12h or 24h time to Date object
  const parseTime = (timeStr) => {
    if (!timeStr || timeStr === '-') return null;
    let time = timeStr;
    let modifier = null;
    if (timeStr.includes(' ')) {
      [time, modifier] = timeStr.split(' ');
    }
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return new Date(2000, 0, 1, hours, minutes);
  };

  // Helper to format 24h string from input to 12h string
  const format12Hour = (time24h) => {
    if (!time24h || time24h === '-') return '-';
    let [hours, minutes] = time24h.split(':');
    hours = parseInt(hours, 10);
    const modifier = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${modifier}`;
  };

  // Calculate hours diff
  const calculateHours = (inStr, outStr) => {
    const inTime = parseTime(inStr);
    const outTime = parseTime(outStr);
    if (!inTime || !outTime) return '-';
    const diffMs = outTime - inTime;
    if (diffMs <= 0) return '-';
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.round((diffMs % 3600000) / 60000);
    return `${diffHrs}h ${diffMins}m`;
  };

  const handleEdit = (record) => {
    // Convert 12h from db to 24h for input type="time"
    let defaultCheckIn = '';
    let defaultCheckOut = '';
    
    if (record.checkIn && record.checkIn !== '-') {
      const parsedIn = parseTime(record.checkIn);
      if (parsedIn) defaultCheckIn = `${parsedIn.getHours().toString().padStart(2, '0')}:${parsedIn.getMinutes().toString().padStart(2, '0')}`;
    }
    if (record.checkOut && record.checkOut !== '-') {
      const parsedOut = parseTime(record.checkOut);
      if (parsedOut) defaultCheckOut = `${parsedOut.getHours().toString().padStart(2, '0')}:${parsedOut.getMinutes().toString().padStart(2, '0')}`;
    }

    Swal.fire({
      title: 'Edit Attendance',
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-[12px] font-bold text-[var(--color-brand-text)] mb-1">Status</label>
            <select id="status" class="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2 px-3 text-[13px]">
              <option value="Present" ${record.status === 'Present' ? 'selected' : ''}>Present</option>
              <option value="Absent" ${record.status === 'Absent' ? 'selected' : ''}>Absent</option>
              <option value="Late" ${record.status === 'Late' ? 'selected' : ''}>Late</option>
              <option value="Half Day" ${record.status === 'Half Day' ? 'selected' : ''}>Half Day</option>
              <option value="Leave" ${record.status === 'Leave' ? 'selected' : ''}>Leave</option>
            </select>
          </div>
          <div>
            <label class="block text-[12px] font-bold text-[var(--color-brand-text)] mb-1">Check In Time</label>
            <input type="time" id="checkin" value="${defaultCheckIn}" class="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2 px-3 text-[13px]" />
          </div>
          <div>
            <label class="block text-[12px] font-bold text-[var(--color-brand-text)] mb-1">Check Out Time</label>
            <input type="time" id="checkout" value="${defaultCheckOut}" class="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2 px-3 text-[13px]" />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      confirmButtonColor: '#8ED3F4',
      preConfirm: () => {
        return {
          status: document.getElementById('status').value,
          checkIn: document.getElementById('checkin').value || '-',
          checkOut: document.getElementById('checkout').value || '-'
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { status, checkIn, checkOut } = result.value;
        const formattedCheckIn = format12Hour(checkIn);
        const formattedCheckOut = format12Hour(checkOut);
        const hours = calculateHours(formattedCheckIn, formattedCheckOut);

        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/` + record.id + '/attendance', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
              date,
              status,
              checkIn: formattedCheckIn,
              checkOut: formattedCheckOut,
              hours
            })
          });
          
          if (response.ok) {
            toast.success('Attendance updated successfully');
            fetchAttendance();
          } else {
            toast.error('Failed to update attendance');
          }
        } catch (err) {
          toast.error('Error updating attendance');
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Present":
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full flex items-center gap-1.5 w-max"><CheckCircle2 size={12} /> Present</span>;
      case "Absent":
        return <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[11px] font-bold rounded-full flex items-center gap-1.5 w-max"><XCircle size={12} /> Absent</span>;
      case "Late":
        return <span className="px-2.5 py-1 bg-orange-50 text-orange-500 text-[11px] font-bold rounded-full flex items-center gap-1.5 w-max"><Clock size={12} /> Late</span>;
      case "Half Day":
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-500 text-[11px] font-bold rounded-full flex items-center gap-1.5 w-max"><UserCheck size={12} /> Half Day</span>;
      case "Leave":
        return <span className="px-2.5 py-1 bg-[var(--color-brand-cream)] text-amber-600 text-[11px] font-bold rounded-full flex items-center gap-1.5 w-max"><Calendar size={12} /> On Leave</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const filteredData = attendanceData.filter(record => 
    record.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    record.empId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const kpis = {
    present: attendanceData.filter(a => a.status === 'Present').length,
    absent: attendanceData.filter(a => a.status === 'Absent' || a.status === '-').length,
    late: attendanceData.filter(a => a.status === 'Late').length,
    halfDay: attendanceData.filter(a => a.status === 'Half Day').length,
    leave: attendanceData.filter(a => a.status === 'Leave').length,
  };

  return (
    <div className="w-full space-y-6 pb-10 bg-[var(--color-brand-page-bg)] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)] mb-1">
            {isHRHead 
              ? 'HR Team Attendance Management' 
              : (isHRManager 
                ? 'My HR Executives Attendance' 
                : (isHRExecutive 
                  ? 'My Daily Attendance Log' 
                  : 'Attendance Management'))}
          </h1>
          <p className="text-[13px] text-[var(--color-brand-text-secondary)] font-medium">
            {isHRHead 
              ? 'Track and manage daily attendance & punch logs for HR Managers and HR Executives' 
              : (isHRManager 
                ? 'Track and manage daily attendance & punch logs for your assigned HR Executives' 
                : (isHRExecutive 
                  ? 'View your personal daily check-in, check-out and status records (Read-Only)' 
                  : 'Track and manage employee daily attendance and working hours'))}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-[var(--color-brand-border)] hover:bg-[var(--color-brand-gray-light)] text-[var(--color-brand-text)] px-4 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all shadow-sm">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-[14px] border border-[var(--color-brand-border)] shadow-sm">
          <p className="text-[11px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-1">Present Today</p>
          <h3 className="text-xl font-extrabold text-emerald-600">{kpis.present}</h3>
        </div>
        <div className="bg-white p-4 rounded-[14px] border border-[var(--color-brand-border)] shadow-sm">
          <p className="text-[11px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-1">Absent Today</p>
          <h3 className="text-xl font-extrabold text-red-500">{kpis.absent}</h3>
        </div>
        <div className="bg-white p-4 rounded-[14px] border border-[var(--color-brand-border)] shadow-sm">
          <p className="text-[11px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-1">Late Today</p>
          <h3 className="text-xl font-extrabold text-orange-500">{kpis.late}</h3>
        </div>
        <div className="bg-white p-4 rounded-[14px] border border-[var(--color-brand-border)] shadow-sm">
          <p className="text-[11px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-1">Half Day</p>
          <h3 className="text-xl font-extrabold text-blue-500">{kpis.halfDay}</h3>
        </div>
        <div className="bg-white p-4 rounded-[14px] border border-[var(--color-brand-border)] shadow-sm">
          <p className="text-[11px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-1">On Leave</p>
          <h3 className="text-xl font-extrabold text-amber-600">{kpis.leave}</h3>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[18px] border border-[var(--color-brand-border)] overflow-hidden shadow-sm">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-[var(--color-brand-border)] flex flex-col md:flex-row items-center gap-4 bg-[var(--color-brand-sky-pale)]">
          <div className="relative w-full md:w-[280px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2 pl-9 pr-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)] shadow-sm"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 md:w-[150px] bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2 px-3 text-[13px] text-[var(--color-brand-text)] focus:outline-none shadow-sm" 
            />
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[var(--color-brand-border)] rounded-[10px] text-[13px] font-bold text-[var(--color-brand-text)] hover:bg-[var(--color-brand-gray-light)] transition-colors shadow-sm">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-10 text-center"><p className="text-[14px] font-bold text-[var(--color-brand-text)]">Loading records...</p></div>
          ) : (
            <>
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-[var(--color-brand-border)]">
                    <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Employee</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Department</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Check In</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Check Out</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Hours</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white">Status</th>
                    <th className="py-4 px-6 text-[12px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider bg-white text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-brand-border)]">
                  {filteredData.map((record, idx) => (
                    <tr key={idx} className="hover:bg-[var(--color-brand-hover-bg)] transition-colors group">
                      <td className="py-4 px-6">
                        <p className="text-[14px] font-bold text-[var(--color-brand-text)]">{record.name}</p>
                        <p className="text-[12px] text-[var(--color-brand-text-secondary)] mt-0.5">{record.empId} {record.role ? `• ${record.role}` : ''}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-[13px] font-bold text-[var(--color-brand-text)]">{record.department || '-'}</p>
                      </td>
                      <td className="py-4 px-6 text-[13px] font-semibold text-[var(--color-brand-text)]">{record.checkIn}</td>
                      <td className="py-4 px-6 text-[13px] font-semibold text-[var(--color-brand-text)]">{record.checkOut}</td>
                      <td className="py-4 px-6 text-[13px] font-bold text-[var(--color-brand-text)]">{record.hours}</td>
                      <td className="py-4 px-6">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end">
                          {canManage && record.canEdit !== false ? (
                            <button 
                              onClick={() => handleEdit(record)}
                              className="p-1.5 text-[var(--color-brand-text-secondary)] hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                              title="Edit Attendance"
                            >
                              <Edit size={16} />
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Lock size={12} /> Read-only
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredData.length === 0 && (
                <div className="p-10 text-center">
                  <p className="text-[14px] font-bold text-[var(--color-brand-text)]">No attendance records found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
