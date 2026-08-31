import React, { useState } from 'react';
import { Calculator, CheckCircle2, ChevronRight, HelpCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Underwriting() {
  const navigate = useNavigate();
  
  // Basic FOIR Calculator State
  const [netIncome, setNetIncome] = useState(85000);
  const [existingEMI, setExistingEMI] = useState(12500);
  const [proposedEMI, setProposedEMI] = useState(25000);

  const totalObligations = existingEMI + proposedEMI;
  const foir = netIncome > 0 ? ((totalObligations / netIncome) * 100).toFixed(2) : 0;
  
  const foirStatus = foir <= 50 ? 'Safe' : foir <= 65 ? 'Marginal' : 'High Risk';
  const foirColor = foir <= 50 ? 'text-green-600 bg-green-50 border-green-200' : 
                    foir <= 65 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' : 
                    'text-red-600 bg-red-50 border-red-200';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="font-medium text-blue-600 cursor-pointer" onClick={() => navigate('/ops/los/applications')}>APP-8001</span>
            <ChevronRight size={14} />
            <span>Underwriting</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Underwriting</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-bold shadow-sm hover:bg-red-100">
            <XCircle size={16} /> Reject Application
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-green-700">
            <CheckCircle2 size={16} /> Recommend Approval
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* FOIR Calculator */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Calculator size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">FOIR Calculator</h3>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Net Income (₹)</label>
                <input 
                  type="number" 
                  value={netIncome}
                  onChange={(e) => setNetIncome(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-bold" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Existing Total EMI (₹)</label>
                <input 
                  type="number" 
                  value={existingEMI}
                  onChange={(e) => setExistingEMI(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-bold text-red-600" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Proposed Loan Amount</label>
                <input type="text" disabled value="₹10,00,000" className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Proposed EMI (₹)</label>
                <input 
                  type="number" 
                  value={proposedEMI}
                  onChange={(e) => setProposedEMI(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-bold text-blue-700" 
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                    FOIR Result <HelpCircle size={14} className="text-gray-400" />
                  </h4>
                  <div className="text-4xl font-black text-gray-900 mt-1">{foir}%</div>
                  <p className="text-xs text-gray-500 mt-1">(Fixed Obligation to Income Ratio)</p>
                </div>
                
                <div className={`px-6 py-3 rounded-xl border flex flex-col items-center justify-center min-w-[150px] ${foirColor}`}>
                  <span className="text-sm font-bold uppercase tracking-wider">{foirStatus}</span>
                  <span className="text-xs font-medium mt-1">
                    {foir <= 50 ? 'Good to proceed' : foir <= 65 ? 'Requires Mgmt Approval' : 'High rejection probability'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Checklist & Recommendation */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Policy Checklist</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700 font-medium">Age is within policy limits (21-60 yrs)</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700 font-medium">Income proofs verified and matched</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700 font-medium">No negative areas in field verification</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700 font-medium">CIBIL score meets minimum threshold</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Underwriter's Recommendation</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
               <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Recommended Loan Amount</label>
                  <input type="number" defaultValue="1000000" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-bold" />
               </div>
               <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Recommended Tenure (Mo)</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-bold">
                    <option>48 Months</option>
                    <option>60 Months</option>
                    <option>72 Months</option>
                  </select>
               </div>
            </div>
            <textarea 
              rows="3" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter final recommendation notes for the approver..."
            ></textarea>
          </div>
        </div>

      </div>
    </div>
  );
}
