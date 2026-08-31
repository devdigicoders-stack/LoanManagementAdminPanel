import React, { useState } from 'react';
import { ChevronRight, FileText, CheckCircle2, XCircle, AlertCircle, ZoomIn, Download, RotateCw, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockDocs = [
  { id: 'doc1', name: 'Aadhaar Card (Front & Back)', type: 'Identity Proof', status: 'Pending' },
  { id: 'doc2', name: 'PAN Card', type: 'Identity Proof', status: 'Verified' },
  { id: 'doc3', name: 'Bank Statement (6 Months)', type: 'Income Proof', status: 'Pending' },
  { id: 'doc4', name: 'Salary Slip (Last 3 Months)', type: 'Income Proof', status: 'Rejected' },
];

export default function DocumentVerification() {
  const navigate = useNavigate();
  const [activeDoc, setActiveDoc] = useState(mockDocs[0]);
  const [remarks, setRemarks] = useState('');

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="font-medium text-blue-600 cursor-pointer" onClick={() => navigate('/ops/los/applications')}>APP-8001</span>
            <ChevronRight size={14} />
            <span>Document Verification</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">KYC & Income Verification</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">Back</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">Submit Verification</button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Document List Sidebar */}
        <div className="w-full lg:w-72 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-bold text-gray-900">Uploaded Documents</h3>
            <p className="text-xs text-gray-500 mt-1">Select a document to review</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mockDocs.map(doc => (
              <div 
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${activeDoc.id === doc.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
              >
                <div className="flex items-start gap-3">
                  <FileText className={activeDoc.id === doc.id ? 'text-blue-600' : 'text-gray-400'} size={20} />
                  <div className="flex-1">
                    <h4 className={`text-sm font-bold ${activeDoc.id === doc.id ? 'text-blue-900' : 'text-gray-900'}`}>{doc.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{doc.type}</p>
                    <div className="mt-2">
                      {doc.status === 'Verified' && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200"><CheckCircle2 size={10} /> Verified</span>}
                      {doc.status === 'Pending' && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200"><Clock size={10} /> Pending</span>}
                      {doc.status === 'Rejected' && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200"><XCircle size={10} /> Rejected</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Viewer Area */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-0">
          
          {/* Viewer Toolbar */}
          <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl shrink-0">
            <h3 className="font-bold text-gray-900">{activeDoc.name}</h3>
            <div className="flex gap-2">
              <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded"><ZoomIn size={18} /></button>
              <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded"><RotateCw size={18} /></button>
              <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded"><Download size={18} /></button>
            </div>
          </div>

          {/* Actual Viewer (Mocked) */}
          <div className="flex-1 bg-gray-200 flex items-center justify-center p-8 overflow-auto">
            <div className="w-full max-w-2xl bg-white shadow-lg aspect-[1/1.4] flex flex-col items-center justify-center border border-gray-300 text-gray-400">
              <FileText size={64} className="mb-4 opacity-50" />
              <p className="font-medium text-lg">Document Preview UI</p>
              <p className="text-sm">In production, render PDF or Image here.</p>
            </div>
          </div>

          {/* Verification Actions */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Remarks</label>
            <textarea 
              rows="2" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Add notes about blurriness, mismatch, etc..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => alert(`Rejected ${activeDoc.name}`)}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg font-bold hover:bg-red-100 transition-colors"
              >
                <XCircle size={18} /> Reject Document
              </button>
              <button 
                onClick={() => alert(`Verified ${activeDoc.name}`)}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-bold shadow-sm hover:bg-green-700 transition-colors"
              >
                <CheckCircle2 size={18} /> Mark as Verified
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
