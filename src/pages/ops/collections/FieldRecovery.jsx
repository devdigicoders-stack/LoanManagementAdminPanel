import React from 'react';
import { MapPin, Navigation, Camera, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FieldRecovery() {
  const navigate = useNavigate();

  const mockVisits = [
    { id: 'FR-201', customer: 'Rajesh Sharma', dpd: '45 Days', amount: '₹42,500', address: 'Bandra West, Mumbai', status: 'Pending Visit' },
    { id: 'FR-202', customer: 'Anil Gupta', dpd: '62 Days', amount: '₹1,15,000', address: 'Andheri East, Mumbai', status: 'Pending Visit' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Field Recovery (SMA-1 & SMA-2)</h1>
          <p className="text-sm text-gray-500 mt-1">Manage hard buckets (31-90 DPD) physical visits.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
            Allocate Addresses to Execs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Visit List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-gray-900 mb-2">My Visit Queue</h3>
          
          {mockVisits.map(visit => (
            <div key={visit.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 cursor-pointer transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-orange-500"></div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{visit.customer}</h4>
                  <p className="text-xs font-bold text-red-600 mt-1">Due: {visit.amount} ({visit.dpd} DPD)</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {visit.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Visit Action (Mocking a visit) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900">Execute Field Visit</h3>
              <p className="text-xs text-gray-500 mt-0.5">Recording visit for Rajesh Sharma (FR-201)</p>
            </div>
            <button className="inline-flex items-center gap-1 text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded border border-blue-200 hover:bg-blue-100">
              <Navigation size={14} /> Open in Maps
            </button>
          </div>

          <div className="p-6 space-y-8">
            
            {/* GPS Lock */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                <MapPin size={18} className="text-blue-600" /> Location Lock
              </h4>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                 <div>
                    <p className="text-sm font-bold text-green-900">GPS Captured Successfully</p>
                    <p className="text-xs text-green-700 mt-1">19.0760° N, 72.8777° E (At Customer Address)</p>
                 </div>
                 <CheckCircle2 className="text-green-600" size={24} />
              </div>
            </div>

            {/* Visit Outcome Form */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                <FileText size={18} className="text-orange-600" /> Collection Outcome
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Met?</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option>Yes, met customer</option>
                    <option>No, met family member</option>
                    <option>Door Locked / Shifted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Collected?</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option>No Payment</option>
                    <option>Full Payment (Cash/Cheque)</option>
                    <option>Part Payment</option>
                  </select>
                </div>
              </div>
              
              <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Field Notes / PTP Details</label>
                 <textarea rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="Customer is facing temporary business loss. PTP given for 15th inst..."></textarea>
              </div>
            </div>

            {/* Evidence Upload */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                <Camera size={18} className="text-purple-600" /> Evidence (Optional)
              </h4>
              <div className="flex gap-4">
                <button className="flex-1 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-blue-400 flex flex-col items-center justify-center">
                  <Camera size={24} className="mb-2" />
                  <span className="text-xs font-medium">Upload House/Door Photo</span>
                </button>
                 <button className="flex-1 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-blue-400 flex flex-col items-center justify-center">
                  <FileText size={24} className="mb-2" />
                  <span className="text-xs font-medium">Upload Cheque Image</span>
                </button>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-green-700">
               <CheckCircle2 size={16} /> Submit Visit Report
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
