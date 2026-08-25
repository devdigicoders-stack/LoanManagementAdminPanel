import React, { useState } from 'react';
import { Search, History, FilePlus, User, ShieldCheck, RefreshCw, ArrowUp } from 'lucide-react';

const mockHistory = [
  { title: 'Application Created', desc: 'Application LN-10245 was created.', time: '24 Aug 2026, 10:30 AM', color: 'bg-[#BFE7F7]', icon: FilePlus, iconColor: 'text-[#0284C7]' },
  { title: 'Application Assigned', desc: 'Application assigned to Rahul Kumar.', time: '24 Aug 2026, 11:15 AM', color: 'bg-[#DFF3FF]', icon: User, iconColor: 'text-[#0369A1]' },
  { title: 'Customer Information Updated', desc: 'Customer contact information was updated.', time: '24 Aug 2026, 01:45 PM', color: 'bg-[#FEF08A]', icon: User, iconColor: 'text-[#D97706]' },
  { title: 'Document Uploaded', desc: 'Income proof was uploaded.', time: '24 Aug 2026, 02:30 PM', color: 'bg-[#ECFDF5]', icon: FilePlus, iconColor: 'text-[#059669]' },
  { title: 'Document Verified', desc: 'Income proof was verified.', time: '25 Aug 2026, 09:00 AM', color: 'bg-[#A7F3D0]', icon: ShieldCheck, iconColor: 'text-[#059669]' },
  { title: 'Follow-up Added', desc: 'Follow-up scheduled for 26 Aug 2026.', time: '25 Aug 2026, 10:30 AM', color: 'bg-[#E9D5FF]', icon: RefreshCw, iconColor: 'text-[#7E22CE]' },
  { title: 'Status Changed', desc: 'Application status changed from Documents Pending to Under Review.', time: '25 Aug 2026, 11:00 AM', color: 'bg-[#FFF8E7]', icon: ArrowUp, iconColor: 'text-[#D97706]' },
];

export default function ApplicationHistory() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockHistory.filter(h =>
    h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-[#FAFCFD] min-h-screen p-4 space-y-6 pb-12">

      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#DFF3FF] to-[#FFF8E7] rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#344054] tracking-tight">Application History</h1>
            <p className="text-[15px] text-[#667085] font-medium mt-2">View the complete activity timeline of an application.</p>
          </div>
          <div className="relative">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[14px] text-[#344054] w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {/* App Search */}
      <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
        <div className="flex gap-4">
          <input type="text" defaultValue="LN-10245" placeholder="Enter Application ID..." className="flex-1 px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[14px] text-[#344054] transition-all" />
          <button className="flex items-center gap-2 px-5 py-3 bg-[#BFE7F7] text-[#0369A1] rounded-xl font-bold text-[14px] hover:bg-[#8ED3F4] transition-colors shadow-sm">
            <History size={18} /> Load History
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        <h3 className="text-[16px] font-extrabold text-[#344054] mb-8">Application Timeline — LN-10245</h3>
        <div className="relative border-l-2 border-[#D9EAF2] ml-6 space-y-10 pb-4">
          {filtered.map((event, i) => (
            <div key={i} className="relative pl-8 group">
              <div className={`absolute -left-[21px] top-0.5 w-10 h-10 rounded-xl ${event.color} border-2 border-white shadow-md flex items-center justify-center transition-transform group-hover:scale-110`}>
                <event.icon size={18} className={event.iconColor} />
              </div>
              <div className="bg-[#FAFCFD] hover:bg-white border border-[#D9EAF2] hover:border-[#BFE7F7] rounded-[16px] p-4 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="text-[15px] font-extrabold text-[#344054]">{event.title}</h4>
                  <span className="text-[11px] font-bold text-[#94A3B8] shrink-0">{event.time}</span>
                </div>
                <p className="text-[13px] font-medium text-[#667085] mt-1.5 leading-relaxed">{event.desc}</p>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <History size={48} className="text-[#BFE7F7] mb-4" />
              <h3 className="text-lg font-bold text-[#344054]">No events found.</h3>
              <p className="text-[14px] text-[#667085] mt-1">Try adjusting your search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
