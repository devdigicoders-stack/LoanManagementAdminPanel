import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, UserPlus, CheckCircle2, FileText, User, 
  CreditCard, FolderOpen, CalendarRange, MessageSquare, History,
  Download, ShieldCheck, XCircle, RefreshCw, PlusCircle, AlertCircle
} from 'lucide-react';

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const appId = id || 'LN-10245';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'customer', label: 'Customer Details', icon: User },
    { id: 'loan', label: 'Loan Requirement', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'followup', label: 'Follow-ups', icon: CalendarRange },
    { id: 'remarks', label: 'Remarks', icon: MessageSquare },
    { id: 'history', label: 'History', icon: History },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-[#344054]">Application Overview</h3>
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate(`/operations/verification?appId=${appId}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-[13px] hover:bg-emerald-700 shadow transition-all"
                >
                  <ShieldCheck size={16} /> Verify & Forward to Bank/NBFC
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#344054] border border-[#D9EAF2] rounded-xl font-bold text-[13px] hover:bg-[#F0FAFF] transition-all">
                  <Edit size={16} /> Edit Application
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#BFE7F7] text-[#0369A1] rounded-xl font-bold text-[13px] hover:bg-[#8ED3F4] transition-all">
                  <CheckCircle2 size={16} /> Update Status
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Customer Name', value: 'Rahul Kumar' },
                { label: 'Mobile Number', value: '+91 9876543210' },
                { label: 'Loan Type', value: 'Personal Loan' },
                { label: 'Required Loan Amount', value: '₹5,00,000' },
                { label: 'Loan Purpose', value: 'Medical Emergency' },
                { label: 'Application Date', value: '24 Aug 2026' },
                { label: 'Current Status', value: 'Under Review', isStatus: true },
                { label: 'Priority', value: 'High', isPriority: true },
                { label: 'Assigned Officer', value: 'Suresh K.' },
              ].map((field, i) => (
                <div key={i} className="bg-[#FAFCFD] p-4 rounded-xl border border-[#D9EAF2]">
                  <p className="text-[12px] font-bold text-[#667085] uppercase tracking-wider mb-1.5">{field.label}</p>
                  {field.isStatus ? (
                    <span className="px-2.5 py-1 text-[12px] font-bold rounded-md bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]">{field.value}</span>
                  ) : field.isPriority ? (
                    <span className="px-2.5 py-1 text-[12px] font-bold rounded-md bg-[#FFF8E7] text-[#D97706] border border-[#FDE68A]">{field.value}</span>
                  ) : (
                    <p className="text-[15px] font-black text-[#344054]">{field.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'customer':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-[#344054]">Customer Information</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#BFE7F7] text-[#0369A1] rounded-xl font-bold text-[13px] hover:bg-[#8ED3F4] transition-all">
                <Edit size={16} /> Edit Customer Details
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Full Name', value: 'Rahul Kumar' },
                { label: 'Mobile Number', value: '+91 9876543210' },
                { label: 'Alternate Mobile', value: '+91 9876543211' },
                { label: 'Email', value: 'rahul.k@example.com' },
                { label: 'Date of Birth', value: '15 May 1990' },
                { label: 'Address', value: 'A-123, Vasant Vihar' },
                { label: 'City', value: 'New Delhi' },
                { label: 'State', value: 'Delhi' },
                { label: 'Pincode', value: '110057' },
                { label: 'Occupation', value: 'Salaried' },
                { label: 'Company / Business Name', value: 'Tech Solutions Pvt Ltd' },
                { label: 'Monthly Income', value: '₹85,000' },
              ].map((field, i) => (
                <div key={i} className="bg-[#FAFCFD] p-4 rounded-xl border border-[#D9EAF2]">
                  <p className="text-[12px] font-bold text-[#667085] uppercase tracking-wider mb-1.5">{field.label}</p>
                  <p className="text-[15px] font-black text-[#344054]">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'loan':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-extrabold text-[#344054] mb-6">Loan Requirement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'Loan Type', value: 'Personal Loan' },
                { label: 'Required Amount', value: '₹5,00,000' },
                { label: 'Loan Purpose', value: 'Medical Emergency' },
                { label: 'Preferred Tenure', value: '36 Months' },
                { label: 'Existing Loan', value: 'No' },
                { label: 'Preferred Institution', value: 'HDFC Bank' },
                { label: 'Additional Information', value: 'Requires quick disbursal for medical reasons.' },
              ].map((field, i) => (
                <div key={i} className={`bg-[#FAFCFD] p-4 rounded-xl border border-[#D9EAF2] ${field.label === 'Additional Information' ? 'md:col-span-2 lg:col-span-3' : ''}`}>
                  <p className="text-[12px] font-bold text-[#667085] uppercase tracking-wider mb-1.5">{field.label}</p>
                  <p className="text-[15px] font-black text-[#344054]">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-extrabold text-[#344054] mb-6">Application Documents</h3>
            <div className="overflow-x-auto border border-[#D9EAF2] rounded-2xl">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-[#FAFCFD] border-b border-[#D9EAF2]">
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Document Name</th>
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Document Type</th>
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Uploaded By</th>
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Upload Date</th>
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Status</th>
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0FAFF]">
                  {[
                    { name: 'PAN Card.pdf', type: 'Identity Proof', by: 'Rahul K.', date: '24 Aug 2026', status: 'Verified' },
                    { name: 'Aadhar Card.pdf', type: 'Address Proof', by: 'Rahul K.', date: '24 Aug 2026', status: 'Pending' },
                    { name: 'Salary_Slip_July.pdf', type: 'Income Proof', by: 'Suresh K.', date: '25 Aug 2026', status: 'Rejected' },
                  ].map((doc, i) => (
                    <tr key={i} className="hover:bg-[#FAFCFD] transition-colors">
                      <td className="py-4 px-5 text-[13px] font-bold text-[#344054]">{doc.name}</td>
                      <td className="py-4 px-5 text-[13px] font-medium text-[#667085]">{doc.type}</td>
                      <td className="py-4 px-5 text-[13px] font-medium text-[#667085]">{doc.by}</td>
                      <td className="py-4 px-5 text-[13px] font-medium text-[#667085]">{doc.date}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md border ${
                          doc.status === 'Verified' ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]' :
                          doc.status === 'Rejected' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' :
                          'bg-[#FFF8E7] text-[#D97706] border-[#FDE68A]'
                        }`}>{doc.status}</span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-[12px] font-bold text-[#0284C7] bg-[#DFF3FF] px-2 py-1 rounded hover:bg-[#BFE7F7]">View</button>
                          <button className="text-[12px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-1 rounded hover:bg-[#A7F3D0]">Verify</button>
                          <button className="text-[12px] font-bold text-[#DC2626] bg-[#FEF2F2] px-2 py-1 rounded hover:bg-[#FECACA]">Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'followup':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-[#344054]">Follow-up History</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#8ED3F4] text-white rounded-xl font-bold text-[13px] hover:bg-[#7BC4E8] transition-all">
                <PlusCircle size={16} /> Add Follow-up
              </button>
            </div>
            
            <div className="bg-[#FAFCFD] border border-[#D9EAF2] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <CalendarRange size={48} className="text-[#BFE7F7] mb-4" />
              <h3 className="text-lg font-bold text-[#344054]">No follow-ups scheduled.</h3>
              <p className="text-[14px] text-[#667085] mt-1">You currently have no follow-ups to display.</p>
            </div>
          </div>
        );

      case 'remarks':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-extrabold text-[#344054] mb-6">Application Remarks</h3>
            
            <div className="bg-[#FAFCFD] p-6 rounded-2xl border border-[#D9EAF2] space-y-4">
              <textarea 
                className="w-full h-32 p-4 rounded-xl border border-[#D9EAF2] focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[14px] font-medium text-[#344054] bg-white resize-none"
                placeholder="Write an operational remark..."
              ></textarea>
              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#8ED3F4] text-white rounded-xl font-bold text-[14px] hover:bg-[#7BC4E8] transition-all">
                  <MessageSquare size={18} /> Add Remark
                </button>
              </div>
            </div>

            <div className="space-y-4 mt-8">
               <h4 className="font-bold text-[#344054] mb-4">Previous Remarks</h4>
               <div className="bg-white border border-[#D9EAF2] rounded-2xl p-6">
                 <p className="text-[14px] text-[#667085] italic">No remarks available.</p>
               </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-extrabold text-[#344054] mb-6">Application Timeline</h3>
            
            <div className="relative border-l-2 border-[#D9EAF2] ml-4 space-y-8 pb-4">
              {[
                { title: 'Application Created', desc: 'Application LN-10245 was created.', time: '24 Aug 2026, 10:30 AM', color: 'bg-[#BFE7F7]' },
                { title: 'Lead Assigned', desc: 'Application assigned to Suresh K.', time: '24 Aug 2026, 11:15 AM', color: 'bg-[#DFF3FF]' },
                { title: 'Document Uploaded', desc: 'PAN Card uploaded by employee.', time: '24 Aug 2026, 02:45 PM', color: 'bg-[#FEF08A]' },
                { title: 'Status Updated', desc: 'Application moved to Under Review.', time: '25 Aug 2026, 09:30 AM', color: 'bg-[#E9D5FF]' }
              ].map((event, i) => (
                <div key={i} className="relative pl-8">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ${event.color} shadow-sm`}></div>
                  <h4 className="text-[15px] font-extrabold text-[#344054]">{event.title}</h4>
                  <p className="text-[13px] font-medium text-[#667085] mt-1">{event.desc}</p>
                  <p className="text-[11px] font-bold text-[#94A3B8] mt-2">{event.time}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#FAFCFD] min-h-screen p-4 space-y-6 pb-12">
      
      {/* Back & Header */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-[#D9EAF2] rounded-xl text-[#667085] hover:bg-[#F0FAFF] transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#344054] tracking-tight">Application Details</h1>
          <p className="text-[15px] text-[#667085] font-medium mt-1">Review and manage complete application information.</p>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#DFF3FF] to-[#FFF8E7] rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-wrap lg:flex-nowrap justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold text-[#667085] uppercase tracking-wider">Application ID</span>
            <span className="text-2xl font-black text-[#344054]">{appId}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold text-[#667085] uppercase tracking-wider">Application Date</span>
            <span className="text-[16px] font-bold text-[#344054]">24 Aug 2026</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold text-[#667085] uppercase tracking-wider">Current Status</span>
            <span className="text-[13px] font-bold text-[#7E22CE] bg-[#F3E8FF] px-3 py-1 rounded-lg border border-[#E9D5FF] w-fit">Under Review</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold text-[#667085] uppercase tracking-wider">Priority</span>
            <span className="text-[13px] font-bold text-[#D97706] bg-[#FFF8E7] px-3 py-1 rounded-lg border border-[#FDE68A] w-fit">High</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold text-[#667085] uppercase tracking-wider">Assigned Officer</span>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-6 h-6 rounded-md bg-[#DFF3FF] flex items-center justify-center text-[#0284C7] font-bold text-[10px] border border-[#BFE7F7]">R</div>
               <span className="text-[15px] font-bold text-[#344054]">Rahul Kumar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Sidebar Tabs */}
        <div className="xl:w-64 shrink-0 bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 h-fit">
          <nav className="flex flex-row xl:flex-col gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-[14px] transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-[#FAFCFD] text-[#0369A1] border border-[#BFE7F7] shadow-sm' 
                    : 'text-[#667085] border border-transparent hover:bg-[#FAFCFD] hover:text-[#344054]'
                  }
                `}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-[#0284C7]' : 'text-[#94A3B8]'} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          {renderTabContent()}
        </div>

      </div>
    </div>
  );
}
