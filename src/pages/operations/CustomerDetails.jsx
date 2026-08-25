import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Phone, Mail, MapPin, Briefcase, CreditCard,
  FileText, CalendarRange, MessageSquare, History, Download
} from 'lucide-react';

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');

  const custId = id || 'CUST-1001';

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: Phone },
    { id: 'applications', label: 'Loan Applications', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'followups', label: 'Follow-up History', icon: CalendarRange },
    { id: 'remarks', label: 'Customer Remarks', icon: MessageSquare },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h3 className="text-[15px] font-black text-[#344054] uppercase tracking-wider mb-4 pb-2 border-b border-[#D9EAF2]">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { label: 'Full Name', value: 'Ramesh Patel' },
                  { label: 'Customer ID', value: custId },
                  { label: 'Mobile', value: '+91 9876543210' },
                  { label: 'Alternate Mobile', value: '+91 9876543211' },
                  { label: 'Email', value: 'ramesh.p@example.com' },
                  { label: 'Date of Birth', value: '12 March 1985' },
                ].map((f, i) => (
                  <div key={i} className="bg-[#FAFCFD] p-4 rounded-xl border border-[#D9EAF2]">
                    <p className="text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-1">{f.label}</p>
                    <p className="text-[15px] font-black text-[#344054]">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[15px] font-black text-[#344054] uppercase tracking-wider mb-4 pb-2 border-b border-[#D9EAF2]">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { label: 'Current Address', value: 'A-24, Vasant Nagar', full: true },
                  { label: 'Permanent Address', value: 'B-12, Old Town, Rajkot', full: true },
                  { label: 'City', value: 'Mumbai' },
                  { label: 'State', value: 'Maharashtra' },
                  { label: 'Pincode', value: '400001' },
                ].map((f, i) => (
                  <div key={i} className={`bg-[#FAFCFD] p-4 rounded-xl border border-[#D9EAF2] ${f.full ? 'md:col-span-2 lg:col-span-3' : ''}`}>
                    <p className="text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-1">{f.label}</p>
                    <p className="text-[15px] font-black text-[#344054]">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[15px] font-black text-[#344054] uppercase tracking-wider mb-4 pb-2 border-b border-[#D9EAF2]">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { label: 'Occupation', value: 'Salaried' },
                  { label: 'Company / Business Name', value: 'Tech Solutions Pvt Ltd' },
                  { label: 'Monthly Income', value: '₹85,000' },
                  { label: 'Employment Type', value: 'Full-time' },
                ].map((f, i) => (
                  <div key={i} className="bg-[#FAFCFD] p-4 rounded-xl border border-[#D9EAF2]">
                    <p className="text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-1">{f.label}</p>
                    <p className="text-[15px] font-black text-[#344054]">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'applications':
        return (
          <div className="animate-in fade-in duration-300">
            <h3 className="text-xl font-extrabold text-[#344054] mb-6">Loan Applications</h3>
            <div className="overflow-x-auto border border-[#D9EAF2] rounded-2xl">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-[#FAFCFD] border-b border-[#D9EAF2]">
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Application ID</th>
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Loan Type</th>
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Amount</th>
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Date</th>
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Status</th>
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0FAFF]">
                  <tr className="hover:bg-[#FAFCFD] transition-colors">
                    <td className="py-4 px-5 text-[13px] font-bold text-[#0284C7] hover:underline cursor-pointer" onClick={() => navigate('/operations/applications/LN-10245')}>LN-10245</td>
                    <td className="py-4 px-5 text-[13px] text-[#344054]">Personal Loan</td>
                    <td className="py-4 px-5 text-[13px] font-bold text-[#344054]">₹5,00,000</td>
                    <td className="py-4 px-5 text-[13px] text-[#667085]">24 Aug 2026</td>
                    <td className="py-4 px-5"><span className="px-2 py-1 text-[11px] font-bold rounded-md bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]">Under Review</span></td>
                    <td className="py-4 px-5"><button onClick={() => navigate('/operations/applications/LN-10245')} className="text-[12px] font-bold text-[#0284C7] hover:underline">View</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="animate-in fade-in duration-300">
            <h3 className="text-xl font-extrabold text-[#344054] mb-6">Customer Documents</h3>
            <div className="overflow-x-auto border border-[#D9EAF2] rounded-2xl">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-[#FAFCFD] border-b border-[#D9EAF2]">
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Document Name</th>
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Type</th>
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Upload Date</th>
                    <th className="py-4 px-5 text-[11px] font-black text-[#667085] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0FAFF]">
                  <tr className="hover:bg-[#FAFCFD]"><td className="py-4 px-5 text-[13px] font-bold text-[#344054]">PAN_Card.pdf</td><td className="py-4 px-5 text-[13px] text-[#667085]">Identity Proof</td><td className="py-4 px-5 text-[13px] text-[#667085]">24 Aug 2026</td><td className="py-4 px-5"><span className="px-2 py-1 text-[11px] font-bold rounded-md bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">Verified</span></td></tr>
                  <tr className="hover:bg-[#FAFCFD]"><td className="py-4 px-5 text-[13px] font-bold text-[#344054]">Aadhar_Card.pdf</td><td className="py-4 px-5 text-[13px] text-[#667085]">Address Proof</td><td className="py-4 px-5 text-[13px] text-[#667085]">24 Aug 2026</td><td className="py-4 px-5"><span className="px-2 py-1 text-[11px] font-bold rounded-md bg-[#FFF8E7] text-[#D97706] border border-[#FDE68A]">Pending</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'followups':
        return (
          <div className="animate-in fade-in duration-300">
            <h3 className="text-xl font-extrabold text-[#344054] mb-6">Customer Follow-up History</h3>
            <div className="bg-[#FAFCFD] border border-[#D9EAF2] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <CalendarRange size={48} className="text-[#BFE7F7] mb-4" />
              <h3 className="text-lg font-bold text-[#344054]">No follow-ups scheduled.</h3>
              <p className="text-[14px] text-[#667085] mt-1">You currently have no follow-ups to display.</p>
            </div>
          </div>
        );

      case 'remarks':
        return (
          <div className="animate-in fade-in duration-300">
            <h3 className="text-xl font-extrabold text-[#344054] mb-6">Customer Remarks</h3>
            <div className="bg-[#FAFCFD] p-6 rounded-2xl border border-[#D9EAF2] space-y-4">
              <textarea className="w-full h-28 p-4 rounded-xl border border-[#D9EAF2] focus:ring-2 focus:ring-[#8ED3F4] focus:outline-none text-[14px] text-[#344054] bg-white resize-none" placeholder="Write an operational remark..."></textarea>
              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#8ED3F4] text-white rounded-xl font-bold text-[14px] hover:bg-[#7BC4E8] transition-all">
                  <MessageSquare size={18} /> Add Remark
                </button>
              </div>
            </div>
            <div className="mt-6 bg-white border border-[#D9EAF2] rounded-2xl p-6">
              <p className="text-[14px] text-[#667085] italic">No remarks available.</p>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full bg-[#FAFCFD] min-h-screen p-4 space-y-6 pb-12">
      
      {/* Back & Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-[#D9EAF2] rounded-xl text-[#667085] hover:bg-[#F0FAFF] transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#344054] tracking-tight">Customer Details</h1>
          <p className="text-[15px] text-[#667085] font-medium mt-1">View and manage complete customer information.</p>
        </div>
      </div>

      {/* Profile Hero */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#DFF3FF] to-[#FFF8E7] rounded-full blur-3xl opacity-60 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-[20px] bg-[#DFF3FF] border border-[#BFE7F7] flex items-center justify-center text-4xl font-black text-[#0284C7] shadow-inner">
              R
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#344054]">Ramesh Patel</h2>
              <p className="text-[14px] font-bold text-[#667085] mt-1">{custId}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#667085]"><Phone size={13} /> +91 9876543210</span>
                <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#667085]"><Mail size={13} /> ramesh.p@example.com</span>
                <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#667085]"><MapPin size={13} /> Mumbai</span>
                <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#667085]"><Briefcase size={13} /> Salaried</span>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#344054] border border-[#D9EAF2] rounded-xl font-bold text-[14px] hover:bg-[#F0FAFF] shadow-sm transition-all hover:-translate-y-0.5">
            <Edit size={16} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Sidebar Tabs */}
        <div className="xl:w-56 shrink-0 bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 h-fit">
          <nav className="flex flex-row xl:flex-col gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[13px] transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-[#FAFCFD] text-[#0369A1] border border-[#BFE7F7] shadow-sm' 
                    : 'text-[#667085] border border-transparent hover:bg-[#FAFCFD]'}`}
              >
                <tab.icon size={16} className={activeTab === tab.id ? 'text-[#0284C7]' : 'text-[#94A3B8]'} />
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
