import React, { useState } from 'react';
import { Search, Filter, MoreVertical, CheckCircle2, AlertCircle, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockLoans = [];

export default function ActiveLoans() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Loans Portfolio</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all live running loans.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Total Active Loans</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{mockLoans.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Total AUM</p>
          <p className="text-2xl font-black text-gray-900 mt-1">₹0</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Standard Assets</p>
          <p className="text-2xl font-black text-green-600 mt-1">0%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase">Stressed (SMA)</p>
          <p className="text-2xl font-black text-orange-600 mt-1">0%</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search LAN or Customer..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50">
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">LAN</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Product</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Principal</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">EMI (₹)</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Tenure</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {mockLoans.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    <FileText className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="font-semibold text-gray-700">No active loans found</p>
                    <p className="text-xs text-gray-400 mt-0.5">Active loans will appear here once disbursed.</p>
                  </td>
                </tr>
              ) : (
                mockLoans.map(loan => (
                  <tr key={loan.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-blue-600">{loan.id}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{loan.customer}</td>
                    <td className="py-3 px-4 text-gray-600">{loan.product}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{loan.amount}</td>
                    <td className="py-3 px-4 font-medium text-gray-700">{loan.emi}</td>
                    <td className="py-3 px-4 text-gray-600">{loan.paid} / {loan.tenure}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                        loan.status.includes('Standard') ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {loan.status.includes('Standard') ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {loan.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-gray-400 hover:text-blue-600 p-1">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600 bg-gray-50">
          <span>Showing {mockLoans.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100" disabled>Prev</button>
            <button className="px-3 py-1 border border-blue-600 rounded bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100" disabled>Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
