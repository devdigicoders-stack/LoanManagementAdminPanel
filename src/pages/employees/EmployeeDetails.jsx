import React from 'react';
import { 
  ChevronRight, ArrowLeft, Edit, MoreVertical, Mail, Phone, MapPin, 
  Briefcase, Calendar, Hash, CheckCircle2, Award, ClipboardList, CheckSquare, Coins
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmployeeDetails() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Employee Details</h1>
          <div className="flex flex-wrap items-center gap-y-1 text-[12px] font-medium text-slate-500">
            <Link to="/employees" className="hover:text-[#489b0d] transition-colors whitespace-nowrap">Employee Management</Link>
            <ChevronRight size={14} className="mx-1 shrink-0" />
            <Link to="/employees" className="hover:text-[#489b0d] transition-colors whitespace-nowrap">Manage Employees</Link>
            <ChevronRight size={14} className="mx-1 shrink-0" />
            <span className="text-[#489b0d] font-bold whitespace-nowrap">Employee Details</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <Link to="/employees" className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-md text-[12px] font-bold hover:bg-slate-50 transition-colors shadow-sm shrink-0 whitespace-nowrap">
            <ArrowLeft size={14} /> Back to List
          </Link>
          <Link to="/employees/EMP-1001/edit" className="flex items-center gap-2 px-4 py-2 bg-[#489b0d] text-white rounded-md text-[12px] font-bold hover:bg-[#3e850b] transition-colors shadow-sm shrink-0 whitespace-nowrap">
            <Edit size={14} /> Edit Employee
          </Link>
          <button className="p-2 bg-white border border-slate-200 text-slate-500 rounded-md hover:bg-slate-50 transition-colors shadow-sm shrink-0">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column - Profile Card */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden sticky top-24">
            
            <div className="p-6 flex flex-col items-center border-b border-slate-100 text-center">
              <div className="relative mb-4">
                <img src="https://i.pravatar.cc/150?u=1" alt="Ravi Kumar" className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm" />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#489b0d] border-2 border-white rounded-full"></span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-800 mb-0.5">Ravi Kumar</h2>
              <p className="text-[13px] font-medium text-slate-500 mb-2">Loan Officer</p>
              <span className="bg-[#489b0d]/10 text-[#489b0d] px-2.5 py-1 rounded-md text-[11px] font-bold">Active</span>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <Mail size={14} className="text-slate-400" /> ravi.kumar@ngm.com
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <Phone size={14} className="text-slate-400" /> +91 98765 43210
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <Briefcase size={14} className="text-slate-400" /> Loan Department
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Branch</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <MapPin size={14} className="text-slate-400" /> Lucknow Branch
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reporting Manager</p>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                  <img src="https://i.pravatar.cc/150?u=3" alt="Manager" className="w-5 h-5 rounded-full" /> Amit Verma
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Details & Tabs */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
            
            {/* Tabs */}
            <div className="flex items-center gap-8 px-6 border-b border-slate-100 overflow-x-auto custom-scrollbar pt-2">
              {['Overview', 'Personal', 'Employment', 'Performance', 'Account & Access', 'Documents', 'Activity'].map((tab, i) => (
                <button 
                  key={i}
                  className={`py-4 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${
                    i === 0 ? 'border-[#489b0d] text-[#489b0d]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-6">
              
              {/* Summary Section */}
              <h3 className="text-[15px] font-bold text-slate-800 mb-4">Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-md border border-slate-100 bg-slate-50 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">Joining Date</p>
                    <p className="text-[13px] font-bold text-slate-800">10 Jan 2025</p>
                  </div>
                </div>
                <div className="p-4 rounded-md border border-slate-100 bg-slate-50 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                    <Award size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">Experience</p>
                    <p className="text-[13px] font-bold text-slate-800">1.4 Years</p>
                  </div>
                </div>
                <div className="p-4 rounded-md border border-slate-100 bg-slate-50 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                    <Hash size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">Employee Code</p>
                    <p className="text-[13px] font-bold text-slate-800">NGM-LO-1001</p>
                  </div>
                </div>
                <div className="p-4 rounded-md border border-slate-100 bg-slate-50 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-50 text-[#489b0d] flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">Status</p>
                    <p className="text-[13px] font-bold text-[#489b0d]">Active</p>
                  </div>
                </div>
              </div>

              {/* Middle Row: Contact & Something else? */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Contact Information */}
                <div>
                  <h3 className="text-[15px] font-bold text-slate-800 mb-4">Contact Information</h3>
                  <div className="p-5 rounded-md border border-slate-100 bg-white space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <Mail size={14} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 mb-0.5">Email</p>
                        <p className="text-[13px] font-bold text-slate-800">ravi.kumar@ngm.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <Phone size={14} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 mb-0.5">Phone Number</p>
                        <p className="text-[13px] font-bold text-slate-800">+91 98765 43210</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <MapPin size={14} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 mb-0.5">Address</p>
                        <p className="text-[13px] font-bold text-slate-800 leading-relaxed">123, Green Park, Lucknow,<br/>Uttar Pradesh - 226001</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Work Summary */}
              <h3 className="text-[15px] font-bold text-slate-800 mb-4">Work Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-md border border-slate-100 bg-white flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#489b0d]/10 text-[#489b0d] flex items-center justify-center shrink-0">
                    <ClipboardList size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Leads</p>
                    <p className="text-xl font-extrabold text-slate-800 leading-none mt-1">128</p>
                  </div>
                </div>
                <div className="p-4 rounded-md border border-slate-100 bg-white flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Applications Assigned</p>
                    <p className="text-xl font-extrabold text-slate-800 leading-none mt-1">42</p>
                  </div>
                </div>
                <div className="p-4 rounded-md border border-slate-100 bg-white flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <CheckSquare size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Applications Approved</p>
                    <p className="text-xl font-extrabold text-slate-800 leading-none mt-1">24</p>
                  </div>
                </div>
                <div className="p-4 rounded-md border border-slate-100 bg-white flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <Coins size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Disbursed Amount</p>
                    <p className="text-[17px] font-extrabold text-slate-800 leading-none mt-1">₹42,50,000</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
