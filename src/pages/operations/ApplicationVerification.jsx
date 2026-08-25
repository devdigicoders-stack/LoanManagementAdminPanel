import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, ArrowLeft, CheckCircle2, XCircle, 
  AlertCircle, FilePlus, RefreshCcw, MessageSquare 
} from 'lucide-react';

export default function ApplicationVerification() {
  const navigate = useNavigate();

  const [checklist, setChecklist] = useState([
    { id: 1, label: 'Customer details complete', status: 'Complete' },
    { id: 2, label: 'Contact information complete', status: 'Complete' },
    { id: 3, label: 'Loan requirement complete', status: 'Complete' },
    { id: 4, label: 'Required documents uploaded', status: 'Pending' },
    { id: 5, label: 'Documents readable', status: 'Pending' },
    { id: 6, label: 'Application information consistent', status: 'Complete' },
    { id: 7, label: 'Required fields complete', status: 'Complete' },
  ]);

  const allComplete = checklist.every(item => item.status === 'Complete');

  const toggleStatus = (id) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, status: item.status === 'Complete' ? 'Pending' : 'Complete' } : item
    ));
  };

  return (
    <div className="w-full bg-[#FAFCFD] min-h-screen p-4 space-y-6 pb-12">
      
      {/* Back & Header */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-[#D9EAF2] rounded-xl text-[#667085] hover:bg-[#F0FAFF] transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#344054] tracking-tight">Application Verification</h1>
          <p className="text-[15px] text-[#667085] font-medium mt-1">Check application completeness before moving it to the next processing stage.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Checklist */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-6 border-b border-[#D9EAF2] bg-[#FAFCFD] flex justify-between items-center">
               <h3 className="text-lg font-extrabold text-[#344054]">Verification Checklist</h3>
               <span className="text-[12px] font-bold text-[#667085]">App ID: <span className="text-[#344054]">LN-10245</span></span>
            </div>
            <div className="p-2">
              <table className="w-full text-left">
                <tbody className="divide-y divide-[#F0FAFF]">
                  {checklist.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAFCFD] transition-colors group">
                      <td className="py-4 px-6 text-[14px] font-bold text-[#344054] w-2/3">{item.label}</td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => toggleStatus(item.id)}
                          className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg border font-bold text-[12px] transition-all w-32 ml-auto
                            ${item.status === 'Complete' 
                              ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] hover:bg-[#D1FAE5]' 
                              : 'bg-[#FFF8E7] text-[#D97706] border-[#FDE68A] hover:bg-[#FEF3C7]'
                            }`}
                        >
                          {item.status === 'Complete' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                          {item.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Missing Information */}
          {!allComplete && (
            <div className="bg-[#FFFDF5] rounded-[24px] border border-[#FEF08A] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
              <div className="flex items-center gap-2 mb-4">
                 <AlertCircle size={20} className="text-[#D97706]" />
                 <h3 className="text-lg font-extrabold text-[#D97706]">Missing Information</h3>
              </div>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-2"></div>
                  <p className="text-[14px] font-bold text-[#344054]">PAN Card is missing</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-2"></div>
                  <p className="text-[14px] font-bold text-[#344054]">Income proof is required</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-2"></div>
                  <p className="text-[14px] font-bold text-[#344054]">Customer income details are incomplete</p>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col items-center text-center">
            {allComplete ? (
               <div className="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center border-4 border-[#A7F3D0] mb-4">
                 <ShieldCheck size={40} className="text-[#059669]" />
               </div>
            ) : (
               <div className="w-20 h-20 bg-[#FFF8E7] rounded-full flex items-center justify-center border-4 border-[#FDE68A] mb-4">
                 <XCircle size={40} className="text-[#D97706]" />
               </div>
            )}
            <h3 className={`text-xl font-black mb-1 ${allComplete ? 'text-[#059669]' : 'text-[#D97706]'}`}>
              {allComplete ? 'Application Complete' : 'Application Incomplete'}
            </h3>
            <p className="text-[13px] font-medium text-[#667085]">
              {allComplete 
                ? 'All required checks have passed successfully. You can now mark this application as complete.' 
                : 'There are pending checks. Please resolve the missing information before proceeding.'}
            </p>
          </div>

          <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
            <h3 className="text-[15px] font-extrabold text-[#344054] mb-4">Actions</h3>
            <div className="space-y-3">
              <button 
                disabled={!allComplete}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl font-bold text-[14px] border transition-all ${
                  allComplete 
                    ? 'bg-[#8ED3F4] text-white border-[#7BC4E8] hover:bg-[#7BC4E8] shadow-md hover:-translate-y-0.5' 
                    : 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0] cursor-not-allowed'
                }`}
              >
                <CheckCircle2 size={18} /> Mark as Complete
              </button>
              <button className="w-full flex items-center gap-3 p-3.5 rounded-xl font-bold text-[14px] border border-[#FDE68A] bg-[#FFF8E7] text-[#D97706] hover:bg-[#FEF3C7] transition-all hover:-translate-y-0.5">
                <FilePlus size={18} /> Request Additional Documents
              </button>
              <button className="w-full flex items-center gap-3 p-3.5 rounded-xl font-bold text-[14px] border border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] transition-all hover:-translate-y-0.5">
                <RefreshCcw size={18} /> Return for Correction
              </button>
              <button className="w-full flex items-center gap-3 p-3.5 rounded-xl font-bold text-[14px] border border-[#D9EAF2] bg-[#FAFCFD] text-[#344054] hover:bg-white hover:border-[#BFE7F7] hover:shadow-sm transition-all hover:-translate-y-0.5">
                <MessageSquare size={18} /> Add Remarks
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
