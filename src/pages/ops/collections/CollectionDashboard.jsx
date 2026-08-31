import React from 'react';
import { Target, TrendingDown, AlertTriangle, IndianRupee, PieChart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CollectionDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">High-level default metrics and bounce rates across portfolios.</p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Target size={20} /></div>
            <p className="text-xs font-bold text-gray-500 uppercase">Collection Target</p>
          </div>
          <p className="text-2xl font-black text-gray-900">₹4.2 Cr</p>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3"><div className="bg-blue-600 h-1.5 rounded-full" style={{width: '65%'}}></div></div>
          <p className="text-xs text-gray-500 mt-2">65% achieved this month</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><IndianRupee size={20} /></div>
            <p className="text-xs font-bold text-gray-500 uppercase">Recovered Amount</p>
          </div>
          <p className="text-2xl font-black text-green-600">₹2.7 Cr</p>
          <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">+12% vs last month</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm ring-1 ring-red-50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={20} /></div>
            <p className="text-xs font-bold text-red-500 uppercase">Total NPA (90+ DPD)</p>
          </div>
          <p className="text-2xl font-black text-red-600">₹85.4 L</p>
          <p className="text-xs text-red-500 font-bold mt-2 flex items-center gap-1">Action required on 124 accounts</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><TrendingDown size={20} /></div>
            <p className="text-xs font-bold text-gray-500 uppercase">Bounce Rate</p>
          </div>
          <p className="text-2xl font-black text-gray-900">4.8%</p>
          <p className="text-xs text-orange-600 font-bold mt-2">-0.2% vs last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bucket Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <PieChart size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">Delinquency Buckets</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { bucket: 'SMA-0 (1-30 DPD)', amount: '₹1.2 Cr', count: '450 Accounts', color: 'bg-yellow-500' },
                { bucket: 'SMA-1 (31-60 DPD)', amount: '₹45 L', count: '120 Accounts', color: 'bg-orange-500' },
                { bucket: 'SMA-2 (61-90 DPD)', amount: '₹22 L', count: '45 Accounts', color: 'bg-red-400' },
                { bucket: 'NPA (90+ DPD)', amount: '₹85.4 L', count: '124 Accounts', color: 'bg-red-600' },
              ].map((b, i) => (
                <div key={i} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${b.color}`}></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{b.bucket}</p>
                      <p className="text-xs text-gray-500">{b.count}</p>
                    </div>
                  </div>
                  <span className="font-black text-gray-900">{b.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agency / Team Performance */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Users size={20} className="text-purple-600" />
            <h3 className="font-bold text-gray-900">Recovery Team Performance</h3>
          </div>
          <div className="p-0">
             <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Team / Agency</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Target</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Achieved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">In-house Telecalling</td>
                  <td className="py-3 px-4 text-right text-gray-600">₹2.0 Cr</td>
                  <td className="py-3 px-4 text-right font-bold text-green-600">85%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">Alpha Recovery (External)</td>
                  <td className="py-3 px-4 text-right text-gray-600">₹1.5 Cr</td>
                  <td className="py-3 px-4 text-right font-bold text-orange-600">45%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">Omega Legal Associates</td>
                  <td className="py-3 px-4 text-right text-gray-600">₹0.7 Cr</td>
                  <td className="py-3 px-4 text-right font-bold text-green-600">92%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
