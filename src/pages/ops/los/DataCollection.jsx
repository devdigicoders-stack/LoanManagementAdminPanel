import React, { useState } from 'react';
import { User, Briefcase, MapPin, Users, Save, CheckCircle2, ChevronRight } from 'lucide-react';

export default function DataCollection() {
  const [activeTab, setActiveTab] = useState('primary');

  const tabs = [
    { id: 'primary', label: 'Primary Data (KYC)', icon: User },
    { id: 'employment', label: 'Employment / Business', icon: Briefcase },
    { id: 'address', label: 'Address Details', icon: MapPin },
    { id: 'coapplicant', label: 'Co-Applicant', icon: Users },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="font-medium text-blue-600">APP-8001</span>
            <ChevronRight size={14} />
            <span>Data Collection</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Data Entry & Cleaning</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">Save Draft</button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
            <CheckCircle2 size={16} /> Mark Data Complete
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-bold text-left border-l-4 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'} />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2">Instructions</h4>
            <ul className="text-sm text-yellow-700 space-y-2 list-disc pl-4">
              <li>Ensure name exactly matches PAN card.</li>
              <li>Verify DOB against Aadhaar.</li>
              <li>Fill all mandatory (*) fields before submitting.</li>
            </ul>
          </div>
        </div>

        {/* Form Content Area */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          
          {activeTab === 'primary' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Primary Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="Ramesh" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="Patel" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth *</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="1985-05-12" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gender *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Number *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-blue-500" defaultValue="ABCDE1234F" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhaar Number *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500" defaultValue="9876 5432 1098" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Marital Status</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Married</option>
                    <option>Single</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">No. of Dependents</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="2" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employment' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Employment & Income Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Employment Type *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Salaried</option>
                    <option>Self-Employed</option>
                    <option>Business Owner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Employer / Company Name *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="Tech Solutions Pvt Ltd" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="Senior Manager" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Total Experience (Years)</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="8" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Net Income (₹) *</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="85000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Other Income (₹)</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="0" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Address Details</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <h3 className="font-bold text-gray-800 text-sm">Current Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Address Line 1</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="Flat 402, Sunshine Apts" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="400001" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Residence Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                      <option>Owned</option>
                      <option>Rented</option>
                      <option>Company Provided</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Years at Current Address</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" defaultValue="5" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 my-2">
                <input type="checkbox" id="sameAddress" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" defaultChecked />
                <label htmlFor="sameAddress" className="text-sm font-medium text-gray-700">Permanent address is same as current address</label>
              </div>

            </div>
          )}

          {activeTab === 'coapplicant' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Co-Applicant Details</h2>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No Co-Applicant Added</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">Add a co-applicant to increase the chances of loan approval and higher eligibility.</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
                  + Add Co-Applicant
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
