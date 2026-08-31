import React from 'react';
import { Home, IndianRupee, FileText, CheckCircle2, ChevronRight, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Collateral() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="font-medium text-blue-600 cursor-pointer" onClick={() => navigate('/ops/los/applications')}>APP-8001</span>
            <ChevronRight size={14} />
            <span>Collateral</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Collateral & Security</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">Save Draft</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">Submit Valuation</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Property Details Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Home size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">Property Details</h3>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Property Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  <option>Residential Apartment</option>
                  <option>Independent House</option>
                  <option>Commercial Shop</option>
                  <option>Plot</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ownership Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  <option>Self Owned</option>
                  <option>Jointly Owned</option>
                  <option>Ancestral</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Property Address</label>
                <textarea rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="Flat 402, Sunshine Apts, Mumbai 400001"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Carpet Area (Sq.Ft)</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="1250" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Age of Property (Years)</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="8" />
              </div>
            </div>
          </div>
        </div>

        {/* Valuation & Legal */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
              <IndianRupee size={20} className="text-green-600" />
              <h3 className="font-bold text-gray-900">Valuation Report</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Market Value (₹)</label>
                  <input type="number" className="w-full px-3 py-2 border border-green-300 bg-green-50 rounded-lg text-sm focus:ring-2 focus:ring-green-500 font-bold text-green-700" defaultValue="15000000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Distress Value (₹)</label>
                  <input type="number" className="w-full px-3 py-2 border border-orange-300 bg-orange-50 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 font-bold text-orange-700" defaultValue="12000000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Valuer Name / Agency</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="Rakesh & Associates" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Valuation</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="2026-08-30" />
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                 <div className="text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase">Max LTV Allowed</p>
                    <p className="text-xl font-black text-gray-900">80%</p>
                 </div>
                 <div className="text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase">Max Loan Eligible</p>
                    <p className="text-xl font-black text-blue-600">₹1,20,00,000</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-purple-600" />
                <h3 className="font-bold text-gray-900">Legal Documents</h3>
              </div>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">Clear Title</span>
            </div>
            <div className="p-4 space-y-3">
              {[
                'Sale Deed / Title Document',
                'Chain of Agreements',
                'NOC from Society',
                'Latest Property Tax Receipt',
                'Approved Building Plan'
              ].map((doc, i) => (
                <div key={i} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">{doc}</span>
                  <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors" title="Upload">
                    <UploadCloud size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
