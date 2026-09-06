import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export default function SupervisorStaffFilter({ onSelectStaff, role = 'all', className = '' }) {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('all');
  const userRole = (localStorage.getItem('userRole') || '').toLowerCase();
  const isMasterAdmin = ['super admin', 'superadmin', 'admin'].includes(userRole);

  useEffect(() => {
    if (!isMasterAdmin) return;

    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        
        // Fetch all employees and admin accounts
        const [empRes, adminRes] = await Promise.all([
          fetch(`${API_URL}/employees`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
          fetch(`${API_URL}/admin/all`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null)
        ]);

        let combined = [];
        if (empRes && empRes.ok) {
          const emps = await empRes.json();
          if (Array.isArray(emps)) combined.push(...emps);
        }
        if (adminRes && adminRes.ok) {
          const admins = await adminRes.json();
          if (Array.isArray(admins)) {
            admins.forEach(a => {
              if (!combined.some(c => (c.email && a.email && c.email.toLowerCase() === a.email.toLowerCase()))) {
                combined.push(a);
              }
            });
          }
        }

        // Filter by role keyword if specified
        if (role && role !== 'all') {
          const r = role.toLowerCase();
          combined = combined.filter(s => {
            const sRole = (s.role || s.designation || s.division || '').toLowerCase();
            return sRole.includes(r);
          });
        }

        setStaffList(combined);
      } catch (err) {
        console.error('Error loading supervisor staff filter:', err);
      }
    };

    fetchStaff();
  }, [isMasterAdmin, role]);

  if (!isMasterAdmin) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/80 px-3.5 py-2 rounded-xl shadow-2xs ${className}`}>
      <div className="flex items-center gap-1.5 text-blue-900">
        <Users size={16} className="text-blue-600" />
        <span className="text-[11px] font-extrabold tracking-wider uppercase">
          Master View Filter:
        </span>
      </div>
      <select
        value={selectedStaff}
        onChange={(e) => {
          const val = e.target.value;
          setSelectedStaff(val);
          if (onSelectStaff) onSelectStaff(val);
        }}
        className="bg-white border border-blue-200 text-slate-800 text-[12px] font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
      >
        <option value="all">🌟 All Staff (Consolidated / All Records)</option>
        {staffList.map((s) => (
          <option key={s._id} value={s._id}>
            👤 {s.name} {s.empId ? `[${s.empId}]` : ''} &mdash; ({s.role || s.designation || 'Staff'})
          </option>
        ))}
      </select>
    </div>
  );
}
