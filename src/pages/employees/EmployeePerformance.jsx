import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const mockPerformance = [
  { id: 1, name: 'Ravi Kumar', leads: 128, apps: 42, approved: 24, disbursed: '₹42,50,000', perf: 92, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Priya Sharma', leads: 115, apps: 38, approved: 20, disbursed: '₹32,15,000', perf: 88, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Amit Verma', leads: 100, apps: 34, approved: 18, disbursed: '₹28,40,000', perf: 82, avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Neha Singh', leads: 98, apps: 30, approved: 16, disbursed: '₹24,10,000', perf: 78, avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, name: 'Suresh Patel', leads: 86, apps: 28, approved: 14, disbursed: '₹18,60,000', perf: 72, avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 6, name: 'John Doe', leads: 75, apps: 24, approved: 12, disbursed: '₹15,20,000', perf: 65, avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: 7, name: 'Emily Davis', leads: 62, apps: 18, approved: 9, disbursed: '₹10,50,000', perf: 58, avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: 8, name: 'Michael Brown', leads: 58, apps: 14, approved: 6, disbursed: '₹7,80,000', perf: 45, avatar: 'https://i.pravatar.cc/150?u=8' },
];

export default function EmployeePerformance() {
  const getProgressColor = (perf) => {
    if (perf >= 80) return 'bg-[#489b0d]';
    if (perf >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Employee Performance</h1>
          <p className="text-[13px] text-slate-500 font-medium">Track employee performance and activities</p>
        </div>
        <select className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[12px] font-bold text-slate-600 focus:outline-none focus:border-[#489b0d] shadow-sm">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase">Employee</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase text-center">Leads</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase text-center">Applications</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase text-center">Approved</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase text-right">Disbursed Amount</th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-800 tracking-wide uppercase w-48">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockPerformance.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                      <p className="text-[13px] font-bold text-slate-800">{emp.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-700 text-center">{emp.leads}</td>
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-700 text-center">{emp.apps}</td>
                  <td className="py-4 px-6 text-[13px] font-bold text-slate-700 text-center">{emp.approved}</td>
                  <td className="py-4 px-6 text-[13px] font-extrabold text-slate-800 text-right">{emp.disbursed}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-bold text-slate-700 w-8">{emp.perf}%</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${getProgressColor(emp.perf)}`} 
                          style={{ width: `${emp.perf}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
