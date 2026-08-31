import React from 'react';
import { MapPin, Home, Building2, CheckCircle2, XCircle, Clock, Camera, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockVisits = [
  { id: 'FV-901', type: 'Home Visit', executive: 'Rahul S.', status: 'Completed', date: '31 Aug 2026', time: '10:30 AM', coords: '19.0760, 72.8777' },
  { id: 'FV-902', type: 'Business Visit', executive: 'Meena K.', status: 'Pending', date: '01 Sep 2026', time: '02:00 PM', coords: null },
];

export default function FieldVerification() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="font-medium text-blue-600 cursor-pointer" onClick={() => navigate('/ops/los/applications')}>APP-8001</span>
            <ChevronRight size={14} />
            <span>Field Verification (FI)</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Physical Verifications</h1>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">+ Schedule New Visit</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">Approve FI Stage</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Visit List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-gray-900 mb-2">Verification Visits</h3>
          
          {mockVisits.map(visit => (
            <div key={visit.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 cursor-pointer transition-colors relative overflow-hidden">
              {visit.status === 'Completed' && <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>}
              {visit.status === 'Pending' && <div className="absolute top-0 right-0 w-2 h-full bg-yellow-500"></div>}
              
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${visit.type === 'Home Visit' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                  {visit.type === 'Home Visit' ? <Home size={20} /> : <Building2 size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{visit.type}</h4>
                  <p className="text-xs text-gray-500 mt-1">{visit.date} at {visit.time}</p>
                  <p className="text-xs font-medium text-gray-700 mt-1">Exec: {visit.executive}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Visit Details (Mocking the completed Home Visit) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900">Home Visit Report</h3>
              <p className="text-xs text-gray-500 mt-0.5">Completed by Rahul S. on 31 Aug 2026, 10:30 AM</p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <CheckCircle2 size={16} /> Positive Report
            </span>
          </div>

          <div className="p-6 space-y-8">
            
            {/* GPS & Map */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                <MapPin size={18} className="text-blue-600" /> Location Verification
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center text-gray-400 border border-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, black 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                  <MapPin size={32} className="text-red-500 mb-2 z-10" />
                  <span className="absolute bottom-4 font-medium z-10 text-gray-600 bg-white/80 px-2 rounded text-sm">Google Maps Mock</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">Captured GPS Coordinates</p>
                    <p className="text-sm font-bold text-gray-900 font-mono">19.0760° N, 72.8777° E</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">Distance from Given Address</p>
                    <p className="text-sm font-bold text-green-600">45 Meters (Within limits)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">Address Confirmed By Exec</p>
                    <p className="text-sm text-gray-700">Flat 402, Sunshine Apts, Mumbai 400001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                <Camera size={18} className="text-purple-600" /> Captured Evidence
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                    <Camera size={24} className="mb-2 opacity-50" />
                    <span className="text-xs">Photo {i}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Questionnaire */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                <FileText size={18} className="text-orange-600" /> Executive Questionnaire
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-700">Is the address easily locatable?</span>
                  <span className="text-sm font-bold text-gray-900">Yes</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-700">Standard of living observed?</span>
                  <span className="text-sm font-bold text-gray-900">Middle Class</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-700">Neighbor reference check?</span>
                  <span className="text-sm font-bold text-gray-900">Positive (Neighbor verified they live here)</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500 mb-1 mt-2">Executive Remarks</span>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    Met with applicant's wife. Address is genuine. Society is well maintained. No negative remarks from neighbors.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
