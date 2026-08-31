import React, { useState, useEffect } from 'react';
import { Plus, X, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Targets() {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    employeeId: '',
    targetType: 'LEADS',
    title: '',
    targetValue: '',
    period: 'May 2026'
  });

  // Mock Performance Data specifically for screenshot matching
  // Note: These names/IDs reflect what's in ManageEmployees.jsx by default or similar to screenshot
  const mockPerformance = {
    'NUOGM-UNSEC-001': { leads: 13, disbursed: 2 }, // Rose Pintoo / ramesh (if using default mock)
    'NUOGM-SEC-001': { leads: 5, disbursed: 1 },    // Rajesh pawar
    'NUOGM-SEC-002': { leads: 3, disbursed: 0 },    // praveen
    'NUOGM-SLM-001': { leads: 1, disbursed: 0 },    // abishek
    // Mapping default list IDs to screenshot values for a perfect match if the exact IDs differ:
    'NUOGM-ULM-001': { leads: 13, disbursed: 2 },
    'NUOGM-AGM-002': { leads: 5, disbursed: 1 },
    'NUOGM-AGT-003': { leads: 3, disbursed: 0 },
    'NUOGM-SLM-003': { leads: 1, disbursed: 0 }
  };

  useEffect(() => {
    const saved = localStorage.getItem('employees');
    if (saved) {
      setEmployees(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.title || !formData.targetValue) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Target assigned successfully!');
    setShowAssignForm(false);
    setFormData({
      employeeId: '',
      targetType: 'LEADS',
      title: '',
      targetValue: '',
      period: 'May 2026'
    });
  };

  // Aggregations
  // 1. Performance by Role
  const rolePerformance = {};
  employees.forEach(emp => {
    const perf = mockPerformance[emp.id] || { leads: 0, disbursed: 0 };
    if (!rolePerformance[emp.role]) {
      rolePerformance[emp.role] = { leads: 0, disbursed: 0 };
    }
    rolePerformance[emp.role].leads += perf.leads;
    rolePerformance[emp.role].disbursed += perf.disbursed;
  });

  // Filter out roles with 0 leads and 0 disbursed for cleaner UI
  const activeRoles = Object.entries(rolePerformance)
    .filter(([_, metrics]) => metrics.leads > 0 || metrics.disbursed > 0)
    .sort((a, b) => b[1].leads - a[1].leads);

  // 2. Top Performers
  const topPerformers = employees
    .map(emp => ({
      ...emp,
      leads: mockPerformance[emp.id]?.leads || 0
    }))
    .filter(emp => emp.leads > 0)
    .sort((a, b) => b.leads - a.leads);

  return (
    <div className="w-full bg-[#f4f7fb] min-h-screen p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Targets & Achievements</h1>
        <button 
          onClick={() => setShowAssignForm(true)}
          className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg text-[14px] font-bold transition-colors shadow-sm"
        >
          <Plus size={16} strokeWidth={3} />
          Assign Target
        </button>
      </div>

      {/* Assign Target Form Card */}
      {showAssignForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-bold text-gray-900">Assign Target to Employee</h2>
            <button onClick={() => setShowAssignForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700">Employee *</label>
                <select 
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="">— Select Employee —</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                  ))}
                </select>
              </div>

              {/* Target Type */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700">Target Type *</label>
                <select 
                  name="targetType"
                  value={formData.targetType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="LEADS">LEADS</option>
                  <option value="DISBURSED">DISBURSED</option>
                  <option value="REVENUE">REVENUE</option>
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700">Title *</label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. April Monthly Target"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Target Value */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700">Target Value *</label>
                <input 
                  type="number"
                  name="targetValue"
                  value={formData.targetValue}
                  onChange={handleInputChange}
                  placeholder="e.g. 50"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Period */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[13px] font-semibold text-gray-700">Period *</label>
                <input 
                  type="text"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => setShowAssignForm(false)}
                className="flex-1 md:flex-none md:w-32 py-2.5 px-4 bg-white border border-gray-200 text-gray-600 rounded-lg text-[14px] font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 py-2.5 px-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-[14px] font-bold transition-colors shadow-sm text-center"
              >
                Assign Target
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Performance by Role */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-6">
        <h2 className="text-[16px] font-bold text-gray-900 mb-6">Performance by Role</h2>
        <div className="space-y-4">
          {activeRoles.map(([role, metrics], idx) => (
            <div key={role} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 last:border-0 gap-2">
              <span className="text-[13px] font-bold text-gray-600 tracking-wide uppercase">{role}</span>
              <div className="flex items-center gap-8">
                <span className="text-[13px] font-medium text-gray-500">Leads: <strong className="text-gray-800 text-[14px]">{metrics.leads}</strong></span>
                <span className="text-[13px] font-medium text-gray-500">Disbursed: <strong className="text-[#16a34a] text-[14px]">{metrics.disbursed}</strong></span>
              </div>
            </div>
          ))}
          {activeRoles.length === 0 && (
            <p className="text-[13px] text-gray-400">No performance data available.</p>
          )}
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="text-amber-500" size={20} />
          <h2 className="text-[16px] font-bold text-gray-900">Top Performers</h2>
        </div>
        
        <div className="space-y-5">
          {topPerformers.map((emp, idx) => (
            <div key={emp.id} className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <span className={`text-[16px] font-bold ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-700' : 'text-orange-500'}`}>
                  #{idx + 1}
                </span>
                <div>
                  <h3 className="text-[14px] font-bold text-gray-800">{emp.name}</h3>
                  <p className="text-[11px] text-gray-400 tracking-wide font-medium uppercase mt-0.5">{emp.role} · {emp.id}</p>
                </div>
              </div>
              <div className="text-[15px] font-bold text-[#2563eb]">
                {emp.leads} leads
              </div>
            </div>
          ))}
          {topPerformers.length === 0 && (
            <p className="text-[13px] text-gray-400">No top performers found.</p>
          )}
        </div>
      </div>

    </div>
  );
}
