import React from 'react';
import { PhoneCall, Phone, Search, Clock, CheckCircle2, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockCalls = [];

export default function TeleCalling() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tele-Calling Queue (SMA-0)</h1>
          <p className="text-sm text-gray-500 mt-1">Manage soft buckets (1-30 DPD) via phone follow-ups.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
            <PhoneCall size={16} /> Auto-Dialer Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Call Queue List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search allocation..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-sm font-bold text-gray-500">My Allocations: {mockCalls.length}</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">DPD</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Due Amount</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Disposition</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {mockCalls.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-500">
                      <PhoneCall className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                      <p className="font-semibold text-gray-700">No overdue accounts in queue</p>
                      <p className="text-xs text-gray-400 mt-0.5">Accounts due for calling will be allocated here.</p>
                    </td>
                  </tr>
                ) : (
                  mockCalls.map((item, i) => (
                    <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 px-4">
                         <div className="font-bold text-blue-600">{item.id}</div>
                         <div className="font-medium text-gray-900">{item.customer}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-orange-600">{item.dpd}</td>
                      <td className="py-3 px-4 font-bold text-gray-900">{item.amount}</td>
                      <td className="py-3 px-4 text-gray-600">
                         <span className={`px-2 py-1 rounded text-xs font-bold ${
                           item.status.includes('PTP') ? 'bg-green-100 text-green-700' :
                           item.status.includes('RTP') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                         }`}>
                           {item.status}
                         </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors">
                          <Phone size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Call Disposition Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
               <PhoneCall size={18} className="text-blue-600" /> Active Call Action
            </h3>
            
            {mockCalls.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <Phone className="mx-auto h-8 w-8 text-gray-300 mb-2 opacity-50" />
                <p className="text-sm font-semibold text-gray-600">No Active Call</p>
                <p className="text-xs text-gray-400 mt-1">Select an account or click auto-dialer to start calling.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                   <p className="text-xs font-semibold text-gray-500 uppercase">Calling</p>
                   <p className="text-lg font-bold text-gray-900 mt-0.5">Meena Kumari</p>
                   <p className="text-sm font-mono text-blue-600 mt-1">+91 98765 43210</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Call Disposition</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Select Outcome</option>
                    <option>PTP (Promise to Pay)</option>
                    <option>RTP (Refused to Pay)</option>
                    <option>RNR (Ring No Response)</option>
                    <option>Switch Off / Not Reachable</option>
                    <option>Dispute</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">PTP Date (If applicable)</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Remarks / Notes</label>
                  <textarea 
                    rows="3" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter details of conversation..."
                  ></textarea>
                </div>

                <button className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-green-700 mt-4">
                  <CheckCircle2 size={16} /> Save & Dial Next
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
