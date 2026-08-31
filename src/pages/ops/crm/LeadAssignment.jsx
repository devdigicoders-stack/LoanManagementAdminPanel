import React, { useState } from 'react';
import { Search, Filter, UserPlus, Users, CheckSquare } from 'lucide-react';

const mockLeads = [
  { id: 'LD-10041', customer: 'Suresh Raina', mobile: '+91 9988776655', source: 'Facebook', date: '31 Aug 2026', location: 'Mumbai', product: 'Personal Loan' },
  { id: 'LD-10042', customer: 'Pooja Hegde', mobile: '+91 8877665544', source: 'Website', date: '31 Aug 2026', location: 'Delhi', product: 'Home Loan' },
  { id: 'LD-10043', customer: 'MS Dhoni', mobile: '+91 7766554433', source: 'Google', date: '30 Aug 2026', location: 'Ranchi', product: 'Business Loan' },
  { id: 'LD-10044', customer: 'Virat Kohli', mobile: '+91 6655443322', source: 'Referral', date: '30 Aug 2026', location: 'Delhi', product: 'Auto Loan' },
  { id: 'LD-10045', customer: 'Rohit Sharma', mobile: '+91 5544332211', source: 'Facebook', date: '29 Aug 2026', location: 'Mumbai', product: 'Personal Loan' },
];

export default function LeadAssignment() {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [assignee, setAssignee] = useState('');

  const toggleAll = (e) => {
    if (e.target.checked) setSelectedLeads(mockLeads.map(l => l.id));
    else setSelectedLeads([]);
  };

  const toggleLead = (id) => {
    if (selectedLeads.includes(id)) setSelectedLeads(selectedLeads.filter(l => l !== id));
    else setSelectedLeads([...selectedLeads, id]);
  };

  const handleAssign = () => {
    if (selectedLeads.length === 0) return alert('Select at least one lead');
    if (!assignee) return alert('Select an executive to assign to');
    alert(`Successfully assigned ${selectedLeads.length} leads to ${assignee}!`);
    setSelectedLeads([]);
    setAssignee('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Assignment</h1>
          <p className="text-sm text-gray-500 mt-1">Bulk assign unassigned leads to your sales executives.</p>
        </div>
        
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3">
          <div className="px-3 border-r border-gray-200">
            <span className="text-sm text-gray-500 font-medium">Selected: </span>
            <span className="text-sm font-bold text-blue-600">{selectedLeads.length} Leads</span>
          </div>
          <select 
            className="border-none text-sm font-semibold text-gray-700 focus:outline-none focus:ring-0 bg-transparent py-1"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">Select Executive...</option>
            <option value="Rahul Sharma">Rahul Sharma</option>
            <option value="Priya Mishra">Priya Mishra</option>
            <option value="Vikram Kapoor">Vikram Kapoor</option>
          </select>
          <button 
            onClick={handleAssign}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              selectedLeads.length > 0 && assignee 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <UserPlus size={16} /> Assign Now
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search unassigned leads..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 text-gray-600">
          <option value="">All Locations</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
        </select>
        <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 text-gray-600">
          <option value="">All Products</option>
          <option value="Personal">Personal Loan</option>
          <option value="Home">Home Loan</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    onChange={toggleAll}
                    checked={selectedLeads.length === mockLeads.length && mockLeads.length > 0}
                  />
                </th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lead Info</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product & Location</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Source</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className={`transition-colors cursor-pointer ${selectedLeads.includes(lead.id) ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleLead(lead.id)}
                >
                  <td className="py-3 px-4 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => {}} // handled by row click
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                        {lead.customer.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{lead.customer}</div>
                        <div className="text-xs font-medium text-gray-500">{lead.mobile}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-0.5">{lead.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm font-bold text-gray-700">{lead.product}</div>
                    <div className="text-xs text-gray-500">{lead.location}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 font-medium">{lead.date}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
                      <Users size={12} /> Unassigned
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
