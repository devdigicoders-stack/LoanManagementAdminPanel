import React, { useState } from 'react';
import { ClipboardList, Hourglass, CheckSquare, XSquare, Search, Phone, Mail, FileText, CheckCircle2, XCircle } from 'lucide-react';

export default function TelecallerDashboard() {
  const [activeFilter, setActiveFilter] = useState('All Records');
  const [searchQuery, setSearchQuery] = useState('');

  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Karan Malhotra",
      loanType: "Home Loan",
      status: "Pending",
      phone: "9998877665",
      email: "karan.malhotra@gmail.com",
      amount: "₹28,00,000",
      assignedBy: "Sitaram",
      note: "High income",
      interested: null
    },
    {
      id: 2,
      name: "Rahul Sharma",
      loanType: "Personal Loan",
      status: "Pending",
      phone: "9876543210",
      email: "rahul.sharma@gmail.com",
      amount: "₹1,50,000",
      assignedBy: "Sitaram",
      note: "First time borrower",
      interested: null
    },
    {
      id: 3,
      name: "Priya Verma",
      loanType: "Home Loan",
      status: "Pending",
      phone: "9123456780",
      email: "priya.verma@yahoo.com",
      amount: "₹25,00,000",
      assignedBy: "Sitaram",
      note: "Salaried",
      interested: null
    }
  ]);

  const handleStatusChange = (id, isInterested) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, interested: isInterested } : lead
    ));
  };

  const filteredLeads = leads.filter(lead => {
    // Filter by Tabs
    if (activeFilter === 'Interested' && lead.interested !== true) return false;
    if (activeFilter === 'Not Interested' && lead.interested !== false) return false;
    
    // Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return lead.name.toLowerCase().includes(q) || 
             lead.phone.includes(q) || 
             lead.loanType.toLowerCase().includes(q);
    }
    return true;
  });

  const totalRecords = leads.length;
  const pendingCalls = leads.filter(l => l.interested === null).length;
  const interestedCount = leads.filter(l => l.interested === true).length;
  const notInterestedCount = leads.filter(l => l.interested === false).length;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Telecaller Dashboard</h1>
          <p className="text-[14px] text-gray-500 mt-1">Call customers and mark their interest</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg font-medium text-[13px] shadow-sm">
          <CheckCircle2 size={16} className="text-green-600" />
          Welcome, avni saha!
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Total Records */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between w-48 shadow-sm">
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Total Records</p>
            <p className="text-3xl font-bold text-blue-600">{totalRecords}</p>
          </div>
          <div className="text-gray-400 bg-gray-50 p-2 rounded-lg">
            <ClipboardList size={24} />
          </div>
        </div>

        {/* Pending Call */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between w-48 shadow-sm">
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Pending Call</p>
            <p className="text-3xl font-bold text-orange-500">{pendingCalls}</p>
          </div>
          <div className="text-orange-400 bg-orange-50 p-2 rounded-lg">
            <Hourglass size={24} />
          </div>
        </div>

        {/* Interested */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between w-48 shadow-sm">
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Interested</p>
            <p className="text-3xl font-bold text-green-500">{interestedCount}</p>
          </div>
          <div className="text-green-500 bg-green-50 p-2 rounded-lg border border-green-200">
            <CheckSquare size={24} />
          </div>
        </div>

        {/* Not Interested */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between w-48 shadow-sm">
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Not Interested</p>
            <p className="text-3xl font-bold text-red-500">{notInterestedCount}</p>
          </div>
          <div className="text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <XSquare size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setActiveFilter('All Records')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors shadow-sm ${activeFilter === 'All Records' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
        >
          <ClipboardList size={14} /> All Records
        </button>
        <button 
          onClick={() => setActiveFilter('Interested')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors shadow-sm ${activeFilter === 'Interested' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
        >
          <CheckSquare size={14} className={activeFilter === 'Interested' ? 'text-white' : 'text-green-500'} /> Interested
        </button>
        <button 
          onClick={() => setActiveFilter('Not Interested')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors shadow-sm ${activeFilter === 'Not Interested' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}
        >
          <XSquare size={14} className={activeFilter === 'Not Interested' ? 'text-white' : 'text-gray-400'} /> Not Interested
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, phone, loan type..." 
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200 text-gray-500 font-medium">
            No records found matching your filters.
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div key={lead.id} className={`bg-white border ${lead.interested === true ? 'border-green-300 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : lead.interested === false ? 'border-red-300 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'border-gray-200'} rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm hover:shadow-md transition-all`}>
            
            {/* Left Details */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-[16px] font-bold text-gray-900">{lead.name}</h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-bold">{lead.loanType}</span>
                <span className="bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
                  <Hourglass size={10} /> {lead.status}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-gray-600 font-medium">
                <div className="flex items-center gap-1.5 text-blue-600">
                  <Phone size={14} /> {lead.phone}
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail size={14} className="text-gray-400" /> {lead.email}
                </div>
                <div className="flex items-center gap-1.5 font-bold text-gray-700">
                  <span className="text-yellow-500 text-[14px]">💰</span> {lead.amount}
                </div>
                <div className="text-gray-400">
                  By: {lead.assignedBy}
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 bg-gray-50 w-max px-2 py-1 rounded">
                <FileText size={12} /> {lead.note}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
              <button 
                onClick={() => handleStatusChange(lead.id, true)}
                className={`flex items-center justify-center gap-1.5 ${lead.interested === true ? 'bg-green-800 border-green-900 border-2' : 'bg-[#22c55e] hover:bg-[#16a34a] border border-transparent'} text-white px-4 py-2 rounded-md text-[12px] font-bold transition-all w-full md:w-44 whitespace-nowrap shadow-sm`}
              >
                <CheckCircle2 size={14} /> {lead.interested === true ? 'Marked Interested' : 'Interested'}
              </button>
              <button 
                onClick={() => handleStatusChange(lead.id, false)}
                className={`flex items-center justify-center gap-1.5 ${lead.interested === false ? 'bg-red-50 text-red-700 border-red-500 border-2' : 'bg-white border-[#ef4444] text-[#ef4444] hover:bg-red-50 border'} px-4 py-2 rounded-md text-[12px] font-bold transition-all w-full md:w-44 whitespace-nowrap shadow-sm`}
              >
                <XCircle size={14} /> {lead.interested === false ? 'Marked Not Interested' : 'Not Interested'}
              </button>
            </div>
            
          </div>
        )))}
      </div>

    </div>
  );
}
