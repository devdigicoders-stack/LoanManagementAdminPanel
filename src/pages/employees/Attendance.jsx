import { useState } from 'react';
import { Search, Filter, Calendar, CheckCircle2, XCircle, Clock, UserCheck, Edit, Download } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function Attendance() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [attendanceData, setAttendanceData] = useState([
    { id: 'EMP-1001', name: 'Ravi Kumar', department: 'Sales', date: '2023-11-24', checkIn: '09:05 AM', checkOut: '06:15 PM', hours: '9h 10m', status: 'Present' },
    { id: 'EMP-1002', name: 'Priya Singh', department: 'HR', date: '2023-11-24', checkIn: '09:30 AM', checkOut: '06:00 PM', hours: '8h 30m', status: 'Late' },
    { id: 'EMP-1003', name: 'Amit Sharma', department: 'Operations', date: '2023-11-24', checkIn: '-', checkOut: '-', hours: '-', status: 'Absent' },
    { id: 'EMP-1004', name: 'Neha Gupta', department: 'Accounts', date: '2023-11-24', checkIn: '09:00 AM', checkOut: '02:00 PM', hours: '5h 00m', status: 'Half Day' },
    { id: 'EMP-1005', name: 'Suresh Patil', department: 'Credit', date: '2023-11-24', checkIn: '-', checkOut: '-', hours: '-', status: 'Leave' },
  ]);

  const handleEdit = (record) => {
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
            <input type="time" id="checkin" value="${record.checkIn !== '-' ? record.checkIn.split(' ')[0] : ''}" class="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2 px-3 text-[13px]">
          </div>
          <div>
            <label class="block text-[12px] font-bold text-[var(--color-brand-text)] mb-1">Check Out Time</label>
            <input type="time" id="checkout" value="${record.checkOut !== '-' ? record.checkOut.split(' ')[0] : ''}" class="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2 px-3 text-[13px]">
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
    }).then((result) => {
      if (result.isConfirmed) {
        setAttendanceData(attendanceData.map(item => {
          if (item.id === record.id) {
            // Simplified logic for mock update
            return {
              ...item,
              status: result.value.status,
              checkIn: result.value.checkIn !== '-' ? result.value.checkIn + ' AM' : '-',
              checkOut: result.value.checkOut !== '-' ? result.value.checkOut + ' PM' : '-'
            };
          }
          return item;
        }));
        toast.success('Attendance updated successfully');
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
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    record.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 pb-10 bg-[var(--color-brand-page-bg)] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)] mb-1">Attendance Management</h1>
          <p className="text-[13px] text-[var(--color-brand-text-secondary)] font-medium">Track and manage employee daily attendance and working hours</p>
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
          <h3 className="text-xl font-extrabold text-emerald-600">85</h3>
        </div>
        <div className="bg-white p-4 rounded-[14px] border border-[var(--color-brand-border)] shadow-sm">
          <p className="text-[11px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-1">Absent Today</p>
          <h3 className="text-xl font-extrabold text-red-500">4</h3>
        </div>
        <div className="bg-white p-4 rounded-[14px] border border-[var(--color-brand-border)] shadow-sm">
          <p className="text-[11px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-1">Late Today</p>
          <h3 className="text-xl font-extrabold text-orange-500">12</h3>
        </div>
        <div className="bg-white p-4 rounded-[14px] border border-[var(--color-brand-border)] shadow-sm">
          <p className="text-[11px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-1">Half Day</p>
          <h3 className="text-xl font-extrabold text-blue-500">2</h3>
        </div>
        <div className="bg-white p-4 rounded-[14px] border border-[var(--color-brand-border)] shadow-sm">
          <p className="text-[11px] font-bold text-[var(--color-brand-text-secondary)] uppercase tracking-wider mb-1">On Leave</p>
          <h3 className="text-xl font-extrabold text-amber-600">8</h3>
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
            <input type="date" className="flex-1 md:w-[150px] bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2 px-3 text-[13px] text-[var(--color-brand-text)] focus:outline-none shadow-sm" defaultValue="2023-11-24" />
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[var(--color-brand-border)] rounded-[10px] text-[13px] font-bold text-[var(--color-brand-text)] hover:bg-[var(--color-brand-gray-light)] transition-colors shadow-sm">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
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
                    <p className="text-[12px] text-[var(--color-brand-text-secondary)] mt-0.5">{record.id}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] font-bold text-[var(--color-brand-text)]">{record.department}</p>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-semibold text-[var(--color-brand-text)]">{record.checkIn}</td>
                  <td className="py-4 px-6 text-[13px] font-semibold text-[var(--color-brand-text)]">{record.checkOut}</td>
                  <td className="py-4 px-6 text-[13px] font-bold text-[var(--color-brand-text)]">{record.hours}</td>
                  <td className="py-4 px-6">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => handleEdit(record)}
                        className="p-1.5 text-[var(--color-brand-text-secondary)] hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                        title="Edit Attendance"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-[14px] font-bold text-[var(--color-brand-text)]">No records found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
