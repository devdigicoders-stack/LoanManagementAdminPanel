import React from 'react';
import { ClipboardCheck, UserCheck, CalendarDays, CheckSquare, Search } from 'lucide-react';

const mockOnboardings = [
  { id: 'EMP-TEMP-01', name: 'Vikram Singh', role: 'Field Executive', joinDate: '15 Sep 2026', status: 'Pre-Boarding', completion: 45 },
  { id: 'EMP-TEMP-02', name: 'Anjali Verma', role: 'HR Executive', joinDate: '01 Sep 2026', status: 'Orientation', completion: 80 },
];

export default function Onboarding() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Onboarding</h1>
          <p className="text-sm text-gray-500 mt-1">Manage pre-boarding, orientation, and initial training checklists.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">
              Active Onboardings
            </button>
            <button className="px-4 py-2 bg-transparent text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100">
              Completed
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-0">
           {mockOnboardings.map(emp => (
             <div key={emp.id} className="p-6 border-b border-gray-200 hover:bg-blue-50/30 transition-colors flex flex-col lg:flex-row gap-6">
                
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{emp.name}</h3>
                    <span className="px-2 py-1 rounded text-xs font-bold bg-orange-100 text-orange-700">
                      {emp.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Role:</strong> {emp.role}</p>
                    <p><strong>Joining Date:</strong> {emp.joinDate}</p>
                    <p className="mt-2 text-blue-600 font-bold text-xs">{emp.id}</p>
                  </div>
                </div>

                {/* Checklist Progress */}
                <div className="flex-1 max-w-md">
                   <div className="flex justify-between items-center mb-2 text-sm font-bold text-gray-700">
                      <span>Onboarding Checklist</span>
                      <span>{emp.completion}%</span>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: `${emp.completion}%`}}></div>
                   </div>
                   
                   <div className="space-y-2">
                     <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" defaultChecked={emp.completion > 0} className="rounded text-blue-600 focus:ring-blue-500" />
                        Offer Accepted & Docs Submitted
                     </label>
                     <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" defaultChecked={emp.completion > 40} className="rounded text-blue-600 focus:ring-blue-500" />
                        IT Assets / Laptop Allocated
                     </label>
                     <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" defaultChecked={emp.completion > 60} className="rounded text-blue-600 focus:ring-blue-500" />
                        Orientation & Policy Training
                     </label>
                     <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" defaultChecked={emp.completion === 100} className="rounded text-blue-600 focus:ring-blue-500" />
                        Manager Intro & Goal Setting
                     </label>
                   </div>
                </div>

             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
