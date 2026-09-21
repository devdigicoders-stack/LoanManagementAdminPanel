import React from 'react';
import { Search, UserPlus, Filter, Mail, Phone, MapPin } from 'lucide-react';

const mockEmployees = [];

export default function EmployeeDirectory() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all staff profiles, skills, and payroll records.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Employee..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50">
            <Filter size={16} /> Advanced Filters
          </button>
        </div>

        {/* Grid View */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {mockEmployees.length === 0 ? (
             <div className="col-span-full py-12 text-center text-gray-400 font-medium">No employees found.</div>
           ) : mockEmployees.map(emp => (
             <div key={emp.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{emp.name}</h3>
                        <p className="text-xs font-bold text-blue-600 mt-0.5">{emp.id}</p>
                      </div>
                   </div>
                   <span className={`px-2 py-1 rounded text-xs font-bold ${
                     emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                   }`}>
                     {emp.status}
                   </span>
                </div>
                
                <div className="space-y-2 mb-4 text-sm">
                   <div className="flex items-center gap-2 text-gray-700">
                     <span className="font-semibold w-24">Role:</span>
                     <span>{emp.role}</span>
                   </div>
                   <div className="flex items-center gap-2 text-gray-700">
                     <span className="font-semibold w-24">Department:</span>
                     <span>{emp.department}</span>
                   </div>
                   <div className="flex items-center gap-2 text-gray-700">
                     <span className="font-semibold w-24">Location:</span>
                     <span className="flex items-center gap-1"><MapPin size={14} className="text-gray-400"/> {emp.location}</span>
                   </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                   <button className="flex-1 flex justify-center items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded text-xs font-bold hover:bg-gray-100">
                     <Mail size={14} /> Email
                   </button>
                   <button className="flex-1 flex justify-center items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded text-xs font-bold hover:bg-gray-100">
                     <Phone size={14} /> Call
                   </button>
                   <button className="flex-1 flex justify-center items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-bold hover:bg-blue-100">
                     View Profile
                   </button>
                </div>
             </div>
           ))}
        </div>
        
      </div>
    </div>
  );
}
