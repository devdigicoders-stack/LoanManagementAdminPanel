import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, User, DollarSign, Users, PhoneCall, GraduationCap, Briefcase, CreditCard, FileText, Check, Eye } from 'lucide-react';

export default function ReviewOnboardingModal({ employee, onClose, onApprove }) {
  const [assignRM, setAssignRM] = useState('');
  const [openSection, setOpenSection] = useState('Basic Details (HR Filled)');
  const [previewDoc, setPreviewDoc] = useState(null);

  const fd = employee.formData || {};
  const docs = employee.documents || {};
  const docKeys = Object.keys(docs);

  const rmList = [
    { id: 'NUOGM-RM-002', name: 'lucky singh' },
    { id: 'NUOGM-RM-001', name: 'poorav' },
  ];

  const handleApprove = () => {
    if (!assignRM) return;
    onApprove(assignRM);
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const Section = ({ title, icon: Icon, children, count }) => {
    const isOpen = openSection === title;
    return (
      <div className="border border-gray-100 rounded-lg mb-2 overflow-hidden bg-white">
        <button 
          onClick={() => toggleSection(title)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon size={18} className="text-gray-500" />
            <span className="font-bold text-gray-800 text-[14px]">{title} {count && `(${count})`}</span>
          </div>
          {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>
        {isOpen && (
          <div className="p-4 border-t border-gray-100 text-[13px] text-gray-600">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">Review Onboarding — {employee.name}</h2>
            <p className="text-[13px] text-gray-500 mt-1 uppercase font-medium">{employee.id} · {employee.role} · Submitted 20/5/2026</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* RM Assignment */}
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-4">
          <span className="text-[14px] font-bold text-gray-700 whitespace-nowrap">Assign RM:</span>
          <select 
            value={assignRM}
            onChange={(e) => setAssignRM(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg py-2 px-3 text-[14px] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 bg-white text-gray-700 font-medium"
          >
            <option value="">— Select Reporting Manager —</option>
            {rmList.map(rm => (
              <option key={rm.id} value={rm.name}>{rm.name} ({rm.id})</option>
            ))}
          </select>
          <button 
            className={`px-6 py-2 rounded-lg font-bold text-[14px] transition-colors ${assignRM ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Assign
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-1">
          <Section title="Basic Details (HR Filled)" icon={User}>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <span className="block text-gray-400 mb-1">Employee ID</span>
                <span className="font-bold text-gray-800">{employee.id}</span>
              </div>
              <div>
                <span className="block text-gray-400 mb-1">Full Name</span>
                <span className="font-bold text-gray-800">{employee.name}</span>
              </div>
              <div>
                <span className="block text-gray-400 mb-1">Email</span>
                <span className="font-bold text-gray-800">{employee.email}</span>
              </div>
              <div>
                <span className="block text-gray-400 mb-1">Phone</span>
                <span className="font-bold text-gray-800">9874563211</span>
              </div>
              <div>
                <span className="block text-gray-400 mb-1">Designation</span>
                <span className="font-bold text-gray-800">{employee.designation}</span>
              </div>
              <div>
                <span className="block text-gray-400 mb-1">Division</span>
                <span className="font-bold text-gray-800">Sales</span>
              </div>
            </div>
          </Section>
          
          <Section title="Salary Structure" icon={DollarSign}>
            <div className="grid grid-cols-2 gap-y-4">
              <div><span className="block text-gray-400 mb-1">Expected CTC</span><span className="font-bold text-gray-800">₹{fd.expectedCtc || '0'} / year</span></div>
              <div><span className="block text-gray-400 mb-1">Monthly In-Hand</span><span className="font-bold text-gray-800">₹{fd.monthlyInhand || '0'}</span></div>
            </div>
          </Section>
          
          <Section title="Personal Details (Employee Filled)" icon={Users}>
            <div className="grid grid-cols-2 gap-y-4">
              <div><span className="block text-gray-400 mb-1">Father's Name</span><span className="font-bold text-gray-800">{fd.fathersName || 'N/A'}</span></div>
              <div><span className="block text-gray-400 mb-1">Mother's Name</span><span className="font-bold text-gray-800">{fd.mothersName || 'N/A'}</span></div>
              <div><span className="block text-gray-400 mb-1">Marital Status</span><span className="font-bold text-gray-800">{fd.maritalStatus || 'N/A'}</span></div>
              <div><span className="block text-gray-400 mb-1">Blood Group</span><span className="font-bold text-gray-800">{fd.bloodGroup || 'N/A'}</span></div>
              <div className="col-span-2"><span className="block text-gray-400 mb-1">Present Address</span><span className="font-bold text-gray-800">{fd.presentAddress || 'N/A'}</span></div>
              <div className="col-span-2"><span className="block text-gray-400 mb-1">Permanent Address</span><span className="font-bold text-gray-800">{fd.permanentAddress || 'N/A'}</span></div>
              <div><span className="block text-gray-400 mb-1">District / State</span><span className="font-bold text-gray-800">{fd.district || 'N/A'}, {fd.state || 'N/A'}</span></div>
              <div><span className="block text-gray-400 mb-1">Pincode</span><span className="font-bold text-gray-800">{fd.pincode || 'N/A'}</span></div>
            </div>
          </Section>
          
          <Section title="References" count="2" icon={PhoneCall}>
            <div className="grid grid-cols-2 gap-6 border-b border-gray-100 pb-4 mb-4">
              <div><span className="block text-gray-400 mb-1">Ref 1: Relationship</span><span className="font-bold text-gray-800">{fd.ref1Rel || 'N/A'}</span></div>
              <div><span className="block text-gray-400 mb-1">Name & Mobile</span><span className="font-bold text-gray-800 block">{fd.ref1Name || 'N/A'}</span><span className="text-blue-600 font-bold block">{fd.ref1Mobile || 'N/A'}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div><span className="block text-gray-400 mb-1">Ref 2: Relationship</span><span className="font-bold text-gray-800">{fd.ref2Rel || 'N/A'}</span></div>
              <div><span className="block text-gray-400 mb-1">Name & Mobile</span><span className="font-bold text-gray-800 block">{fd.ref2Name || 'N/A'}</span><span className="text-blue-600 font-bold block">{fd.ref2Mobile || 'N/A'}</span></div>
            </div>
          </Section>
          
          <Section title="Education" count="1" icon={GraduationCap}>
            <div className="grid grid-cols-2 gap-y-4">
              <div><span className="block text-gray-400 mb-1">Degree / Type</span><span className="font-bold text-gray-800">{fd.qual1Type || 'N/A'}</span></div>
              <div><span className="block text-gray-400 mb-1">Institution</span><span className="font-bold text-gray-800">{fd.qual1Inst || 'N/A'}</span></div>
            </div>
          </Section>
          
          <Section title="Experience" icon={Briefcase}>
            <div className="grid grid-cols-2 gap-y-4">
              <div><span className="block text-gray-400 mb-1">Previous Company</span><span className="font-bold text-gray-800">{fd.company1Name || 'Fresher'}</span></div>
              {fd.company1Name && <div><span className="block text-gray-400 mb-1">Designation</span><span className="font-bold text-gray-800">{fd.company1Desig || 'N/A'}</span></div>}
            </div>
          </Section>
          
          <Section title="Bank Details" icon={CreditCard}>
            <div className="grid grid-cols-2 gap-y-4">
              <div><span className="block text-gray-400 mb-1">Account Type</span><span className="font-bold text-gray-800">{fd.bankAccType || 'N/A'}</span></div>
              <div><span className="block text-gray-400 mb-1">Account Holder</span><span className="font-bold text-gray-800">{fd.bankAccName || 'N/A'}</span></div>
              <div><span className="block text-gray-400 mb-1">Bank Name & Branch</span><span className="font-bold text-gray-800 block">{fd.bankName || 'N/A'}</span><span className="text-gray-500 font-medium block">{fd.bankBranch || 'N/A'}</span></div>
              <div><span className="block text-gray-400 mb-1">Account Number / IFSC</span><span className="font-bold text-blue-600 block">{fd.bankAccNum || 'N/A'}</span><span className="text-gray-800 font-bold block">{fd.bankIfsc || 'N/A'}</span></div>
            </div>
          </Section>
          
          <Section title="Documents" count={docKeys.length} icon={FileText}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docKeys.map(key => (
                <div key={key} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:border-gray-300 transition-colors bg-gray-50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText size={20} className="text-purple-500 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-[13px] font-bold text-gray-800 truncate" title={docs[key].name}>{docs[key].name}</p>
                      <p className="text-[11px] text-gray-500">{key} • {(docs[key].size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => setPreviewDoc(docs[key])} className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors flex items-center gap-1 text-[12px] font-bold shrink-0">
                    <Eye size={14} /> View
                  </button>
                </div>
              ))}
              {docKeys.length === 0 && <p className="text-gray-500 italic py-4">No documents uploaded.</p>}
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-xl">
          <button className="px-6 py-2 border border-red-200 text-red-500 rounded-lg font-bold hover:bg-red-50 flex items-center gap-2 text-[14px]">
            <X size={16} /> Reject
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 text-[14px]">
              Close
            </button>
            <button 
              onClick={handleApprove}
              disabled={!assignRM}
              className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 text-[14px] shadow-sm transition-colors
                ${assignRM ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              <Check size={16} /> Approve & Activate
            </button>
          </div>
        </div>

      </div>

      {/* Document Preview Overlay */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex flex-col items-center justify-center p-8 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl flex justify-end mb-4">
            <button onClick={() => setPreviewDoc(null)} className="text-white hover:text-gray-300 flex items-center gap-2 font-bold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
              <X size={20} /> Close Preview
            </button>
          </div>
          <div className="bg-white rounded-xl w-full max-w-4xl h-[75vh] flex flex-col items-center justify-center shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-50 opacity-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <FileText size={80} className="text-purple-300 mb-6 relative z-10" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2 relative z-10 text-center">{previewDoc.name}</h3>
            <p className="text-gray-500 mb-8 font-medium relative z-10">{(previewDoc.size / 1024).toFixed(0)} KB • {previewDoc.type || 'Unknown format'}</p>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg max-w-md text-center relative z-10">
              <p className="text-[14px] text-blue-800 font-medium">Since files are not persisted across local storage in this demo environment, this is a placeholder preview.</p>
            </div>
            
            <button onClick={() => setPreviewDoc(null)} className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold shadow-sm transition-colors relative z-10">
              Done Viewing
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
