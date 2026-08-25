import React, { useState } from 'react';
import { MessageSquare, PlusCircle, Search, AlertCircle, Star } from 'lucide-react';

const mockRemarks = [
  { remark: 'Customer confirmed document upload via WhatsApp. Awaiting final income proof.', by: 'Suresh K.', type: 'Document', priority: 'Important', date: '24 Aug 2026', time: '11:35 AM' },
  { remark: 'Application is complete from our end. Pending management approval.', by: 'Meena R.', type: 'Operational', priority: 'Normal', date: '23 Aug 2026', time: '04:10 PM' },
];

const priorityStyle = {
  Normal: 'bg-[#FAFCFD] text-[#667085] border-[#D9EAF2]',
  Important: 'bg-[#FFF8E7] text-[#D97706] border-[#FDE68A]',
  Urgent: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
};

const typeStyle = {
  Operational: 'bg-[#DFF3FF] text-[#0369A1] border-[#BFE7F7]',
  Document: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
  Customer: 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]',
  'Follow-up': 'bg-[#FFF8E7] text-[#D97706] border-[#FDE68A]',
  Internal: 'bg-[#FAFCFD] text-[#344054] border-[#D9EAF2]',
};

export default function RemarksNotes() {
  const [remark, setRemark] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [type, setType] = useState('Operational');

  return (
    <div className="w-full bg-[#FAFCFD] min-h-screen p-4 space-y-6 pb-12">

      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#DFF3FF] to-[#FFF8E7] rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-[#344054] tracking-tight">Remarks & Notes</h1>
          <p className="text-[15px] text-[#667085] font-medium mt-2">Maintain operational notes and communication history for applications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Add Remark Form */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 space-y-5 sticky top-6">
            <h3 className="text-[16px] font-extrabold text-[#344054]">Add New Remark</h3>

            <div>
              <label className="text-[11px] font-black text-[#667085] uppercase tracking-wider block mb-2">Application <span className="text-[#DC2626]">*</span></label>
              <input type="text" placeholder="Enter Application ID..." className="w-full px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[14px] text-[#344054] transition-all" />
            </div>

            <div>
              <label className="text-[11px] font-black text-[#667085] uppercase tracking-wider block mb-2">Remark Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[14px] font-bold text-[#344054] cursor-pointer">
                <option>Operational</option>
                <option>Document</option>
                <option>Customer</option>
                <option>Follow-up</option>
                <option>Internal</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-black text-[#667085] uppercase tracking-wider block mb-2">Priority</label>
              <div className="flex gap-2">
                {['Normal', 'Important', 'Urgent'].map(p => (
                  <button key={p} onClick={() => setPriority(p)} className={`flex-1 py-2 rounded-xl font-bold text-[12px] border transition-all ${priority === p ? priorityStyle[p] : 'bg-white text-[#667085] border-[#D9EAF2] hover:bg-[#FAFCFD]'}`}>{p}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-[#667085] uppercase tracking-wider block mb-2">Remark <span className="text-[#DC2626]">*</span></label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full h-32 px-4 py-3 rounded-xl border border-[#D9EAF2] bg-[#FAFCFD] focus:bg-white focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[14px] text-[#344054] resize-none transition-all"
                placeholder="Enter your remark or note..."
              ></textarea>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#8ED3F4] text-white rounded-xl font-bold text-[14px] hover:bg-[#7BC4E8] shadow-md transition-all hover:-translate-y-0.5">
              <MessageSquare size={18} /> Add Remark
            </button>
          </div>
        </div>

        {/* Previous Remarks */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[16px] font-extrabold text-[#344054]">Previous Remarks</h3>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085]" />
              <input type="text" placeholder="Search remarks..." className="pl-9 pr-4 py-2 rounded-xl border border-[#D9EAF2] bg-white focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[13px] text-[#344054] w-52 transition-all" />
            </div>
          </div>

          {mockRemarks.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-[#D9EAF2] p-8 flex flex-col items-center justify-center text-center">
              <MessageSquare size={48} className="text-[#BFE7F7] mb-4" />
              <h3 className="text-lg font-bold text-[#344054]">No remarks have been added yet.</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {mockRemarks.map((r, i) => (
                <div key={i} className="bg-white rounded-[20px] border border-[#D9EAF2] shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-1 text-[10px] font-black rounded-md border uppercase tracking-wide ${typeStyle[r.type] || ''}`}>{r.type}</span>
                      <span className={`px-2.5 py-1 text-[10px] font-black rounded-md border uppercase tracking-wide flex items-center gap-1 ${priorityStyle[r.priority]}`}>
                        {r.priority === 'Urgent' && <AlertCircle size={10} />}
                        {r.priority === 'Important' && <Star size={10} />}
                        {r.priority}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] font-bold text-[#344054]">{r.date}</p>
                      <p className="text-[10px] text-[#667085]">{r.time}</p>
                    </div>
                  </div>
                  <p className="text-[14px] font-medium text-[#344054] leading-relaxed">{r.remark}</p>
                  <p className="text-[12px] font-bold text-[#667085] mt-3 pt-3 border-t border-[#F0FAFF]">Added by: <span className="text-[#344054]">{r.by}</span></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
