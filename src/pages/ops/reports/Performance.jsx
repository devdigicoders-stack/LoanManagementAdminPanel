import React from 'react';
import { Trophy, Target, Award, MapPin } from 'lucide-react';

export default function Performance() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance & Targets</h1>
          <p className="text-sm text-gray-500 mt-1">Branch and Executive leaderboards for Disbursement & Collections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Branch Leaderboard */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">Top Performing Branches (MTD)</h3>
          </div>
          <div className="p-0">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="py-3 px-4 font-bold">Branch</th>
                  <th className="py-3 px-4 font-bold text-right">Disbursement Achieved</th>
                  <th className="py-3 px-4 font-bold text-right">Collection Eff.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-2">
                     <Trophy size={16} className="text-yellow-500"/> Mumbai (Andheri)
                  </td>
                  <td className="py-4 px-4 text-right">
                     <span className="font-bold text-gray-900">₹4.2 Cr</span>
                     <span className="block text-xs text-green-600 font-bold mt-0.5">110% of Target</span>
                  </td>
                  <td className="py-4 px-4 text-right font-black text-green-600">98.5%</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-2">
                     <span className="text-gray-400 font-bold w-4 text-center">2</span> Delhi (South)
                  </td>
                  <td className="py-4 px-4 text-right">
                     <span className="font-bold text-gray-900">₹3.8 Cr</span>
                     <span className="block text-xs text-green-600 font-bold mt-0.5">105% of Target</span>
                  </td>
                  <td className="py-4 px-4 text-right font-black text-green-600">96.2%</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-2">
                     <span className="text-gray-400 font-bold w-4 text-center">3</span> Pune (Kalyani Nagar)
                  </td>
                  <td className="py-4 px-4 text-right">
                     <span className="font-bold text-gray-900">₹2.5 Cr</span>
                     <span className="block text-xs text-orange-600 font-bold mt-0.5">92% of Target</span>
                  </td>
                  <td className="py-4 px-4 text-right font-black text-orange-600">94.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Executive Leaderboard */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Award size={20} className="text-purple-600" />
            <h3 className="font-bold text-gray-900">Top Field Executives (Collections)</h3>
          </div>
          <div className="p-0">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="py-3 px-4 font-bold">Executive Name</th>
                  <th className="py-3 px-4 font-bold text-right">Accounts Resolved</th>
                  <th className="py-3 px-4 font-bold text-right">Amount Recovered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr className="hover:bg-purple-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">RK</div>
                     Rahul Kumar
                  </td>
                  <td className="py-4 px-4 text-right">
                     <span className="font-bold text-gray-900">45</span>
                     <span className="block text-xs text-green-600 font-bold mt-0.5">120% of Target</span>
                  </td>
                  <td className="py-4 px-4 text-right font-black text-green-600">₹14.5 L</td>
                </tr>
                <tr className="hover:bg-purple-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">SM</div>
                     Suresh Menon
                  </td>
                  <td className="py-4 px-4 text-right">
                     <span className="font-bold text-gray-900">38</span>
                     <span className="block text-xs text-green-600 font-bold mt-0.5">102% of Target</span>
                  </td>
                  <td className="py-4 px-4 text-right font-black text-green-600">₹11.2 L</td>
                </tr>
                <tr className="hover:bg-purple-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">AS</div>
                     Amit Singh
                  </td>
                  <td className="py-4 px-4 text-right">
                     <span className="font-bold text-gray-900">32</span>
                     <span className="block text-xs text-orange-600 font-bold mt-0.5">85% of Target</span>
                  </td>
                  <td className="py-4 px-4 text-right font-black text-orange-600">₹8.4 L</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
