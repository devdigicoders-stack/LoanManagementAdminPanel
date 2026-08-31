import React from 'react';
import { FileText, Download, Printer, CheckCircle2, ChevronRight, PenTool, Stamp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LegalDocs() {
  const navigate = useNavigate();

  const docs = [
    { name: 'Sanction Letter', status: 'Generated', generatedOn: '31 Aug 2026', mandatory: true },
    { name: 'Key Fact Statement (KFS)', status: 'Generated', generatedOn: '31 Aug 2026', mandatory: true },
    { name: 'Loan Agreement', status: 'Pending Signature', generatedOn: '-', mandatory: true },
    { name: 'Demand Promissory Note (DNP)', status: 'Pending Signature', generatedOn: '-', mandatory: true },
    { name: 'NACH / ECS Mandate', status: 'Pending', generatedOn: '-', mandatory: true },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="font-medium text-blue-600 cursor-pointer" onClick={() => navigate('/ops/los/applications')}>APP-8001</span>
            <ChevronRight size={14} />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Legal & Agreements</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">
            <Stamp size={16} /> Init e-Sign Process
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
            Generate All Docs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Document List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Required Documents</h3>
            <span className="text-xs font-bold text-gray-500">2 / 5 Completed</span>
          </div>
          <div className="divide-y divide-gray-100">
            {docs.map((doc, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${doc.status === 'Generated' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      {doc.name} {doc.mandatory && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase">Mandatory</span>}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Status: <span className={`font-semibold ${doc.status === 'Generated' ? 'text-green-600' : 'text-orange-500'}`}>{doc.status}</span>
                      {doc.generatedOn !== '-' && ` • On ${doc.generatedOn}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View / Edit">
                    <PenTool size={18} />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors" title="Print">
                    <Printer size={18} />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors" title="Download">
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* E-Stamp & Signature Status */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">e-Sign & Franking</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Stamp Duty Calculated</p>
                <p className="text-xl font-black text-gray-900 mt-1">₹2,500</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">e-Sign Status (Applicant)</p>
                <p className="text-sm font-bold text-orange-600 mt-1 flex items-center gap-1">
                  Pending OTP Verification
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">e-Sign Status (Co-Applicant)</p>
                <p className="text-sm font-bold text-gray-400 mt-1 flex items-center gap-1">
                  Not Applicable
                </p>
              </div>
              
              <button className="w-full py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-100 mt-2">
                Resend e-Sign Link
              </button>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl border border-green-200 p-6">
            <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle2 size={18} /> Ready for Disbursement?
            </h3>
            <p className="text-sm text-green-800 mb-4">
              Once all documents are generated and signed by the applicant, you can move this file to the disbursement queue.
            </p>
            <button className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-green-700 opacity-50 cursor-not-allowed">
              Push to Disbursement
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
