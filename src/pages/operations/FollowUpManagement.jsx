import React, { useState } from 'react';
import { 
  CalendarRange, PlusCircle, Clock, CheckCircle2, AlertCircle, 
  Phone, Users, FileText, X, Calendar, AlarmClock 
} from 'lucide-react';

const mockFollowUps = [
  { appId: 'LN-10245', customer: 'Ramesh Patel', employee: 'Suresh K.', date: '25 Aug 2026', time: '10:00 AM', type: 'Call', status: 'Upcoming', outcome: '-' },
  { appId: 'LN-10241', customer: 'Priya Sharma', employee: 'Meena R.', date: '24 Aug 2026', time: '02:30 PM', type: 'Meeting', status: 'Completed', outcome: 'Positive' },
  { appId: 'LN-10238', customer: 'Amit Kumar', employee: 'Vikram S.', date: '22 Aug 2026', time: '11:00 AM', type: 'Call', status: 'Missed', outcome: '-' },
];

const StatCard = ({ icon: Icon, title, value, color, bg }) => (
  <div className={`bg-white rounded-[20px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all p-6`}>
    <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center mb-4 border border-[#D9EAF2]`}>
      <Icon size={22} strokeWidth={2.5} />
    </div>
    <p className="text-[13px] font-bold text-[#667085]">{title}</p>
    <p className="text-3xl font-black text-[#344054] tracking-tight mt-1">{value}</p>
  </div>
);

export default function FollowUpManagement() {
  const [showModal, setShowModal] = useState(false);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Upcoming': return 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
      case 'Completed': return 'bg-[#DFF3FF] text-[#0369A1] border-[#BFE7F7]';
      case 'Missed': return 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
      case 'Overdue': return 'bg-[#FFF8E7] text-[#D97706] border-[#FDE68A]';
      default: return 'bg-[#FAFCFD] text-[#344054] border-[#D9EAF2]';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Call': return <Phone size={14} />;
      case 'Meeting': return <Users size={14} />;
      default: return <FileText size={14} />;
    }
  };

  return (
    <div className="w-full bg-[#FAFCFD] min-h-screen p-4 space-y-6 pb-12">

      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#DFF3FF] to-[#FFF8E7] rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#344054] tracking-tight">Follow-up Management</h1>
            <p className="text-[15px] text-[#667085] font-medium mt-2">Track upcoming, completed and overdue customer follow-ups.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#8ED3F4] text-white rounded-xl font-bold text-[14px] hover:bg-[#7BC4E8] shadow-md transition-all hover:-translate-y-0.5">
            <PlusCircle size={18} /> Schedule Follow-up
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard icon={CalendarRange} title="Today's Follow-ups" value="8" color="text-[#0369A1]" bg="bg-[#DFF3FF]" />
        <StatCard icon={Clock} title="Upcoming" value="24" color="text-[#059669]" bg="bg-[#ECFDF5]" />
        <StatCard icon={CheckCircle2} title="Completed" value="156" color="text-[#0284C7]" bg="bg-[#BFE7F7]" />
        <StatCard icon={X} title="Missed" value="5" color="text-[#DC2626]" bg="bg-[#FEF2F2]" />
        <StatCard icon={AlertCircle} title="Overdue" value="3" color="text-[#D97706]" bg="bg-[#FFF8E7]" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#EFF9FE] border-b border-[#D9EAF2]">
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Application</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Customer</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Assigned Employee</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Date & Time</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Type</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Status</th>
                <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0FAFF]">
              {mockFollowUps.map((fu, i) => (
                <tr key={i} className="hover:bg-[#F7FCFF] transition-colors">
                  <td className="py-4 px-5 text-[13px] font-bold text-[#0284C7]">{fu.appId}</td>
                  <td className="py-4 px-5 text-[13px] font-bold text-[#344054]">{fu.customer}</td>
                  <td className="py-4 px-5 text-[13px] text-[#667085]">{fu.employee}</td>
                  <td className="py-4 px-5">
                    <p className="text-[13px] font-bold text-[#344054]">{fu.date}</p>
                    <p className="text-[11px] text-[#667085] mt-0.5">{fu.time}</p>
                  </td>
                  <td className="py-4 px-5">
                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#344054] bg-[#FAFCFD] border border-[#D9EAF2] px-2.5 py-1 rounded-lg w-fit">
                      {getTypeIcon(fu.type)} {fu.type}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md border ${getStatusStyle(fu.status)}`}>{fu.status}</span>
                  </td>
                  <td className="py-4 px-5 text-[13px] text-[#667085]">{fu.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Follow-up Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#344054]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#D9EAF2] bg-[#FAFCFD] flex justify-between items-center">
              <h3 className="text-xl font-black text-[#344054]">Schedule Follow-up</h3>
              <button onClick={() => setShowModal(false)} className="text-[#667085] hover:text-[#344054]"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              {[
                { label: 'Application', type: 'text', placeholder: 'Enter Application ID...' },
                { label: 'Customer', type: 'text', placeholder: 'Customer Name' },
                { label: 'Follow-up Date', type: 'date' },
                { label: 'Follow-up Time', type: 'time' },
              ].map((field, i) => (
                <div key={i}>
                  <label className="text-[12px] font-black text-[#344054] uppercase tracking-wider block mb-1.5">{field.label} <span className="text-[#DC2626]">*</span></label>
                  <input type={field.type} placeholder={field.placeholder} className="w-full px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[14px] text-[#344054] transition-all" />
                </div>
              ))}
              <div>
                <label className="text-[12px] font-black text-[#344054] uppercase tracking-wider block mb-1.5">Follow-up Type</label>
                <select className="w-full px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[14px] font-bold text-[#344054] cursor-pointer">
                  <option>Call</option>
                  <option>Meeting</option>
                  <option>Customer Visit</option>
                  <option>Document Follow-up</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-black text-[#344054] uppercase tracking-wider block mb-1.5">Remarks</label>
                <textarea className="w-full h-24 px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[14px] text-[#344054] resize-none transition-all" placeholder="Enter purpose or notes..."></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-[#D9EAF2] bg-[#FAFCFD] flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-[14px] text-[#344054] bg-white border border-[#D9EAF2] hover:bg-[#F0FAFF] transition-all">Cancel</button>
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-[14px] text-white bg-[#8ED3F4] border border-[#7BC4E8] hover:bg-[#7BC4E8] shadow-md transition-all">Schedule Follow-up</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
