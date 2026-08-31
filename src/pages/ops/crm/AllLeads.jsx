import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Eye, Edit, UserPlus, PhoneCall, 
  MessageCircle, MessageSquare, ArrowRightLeft, XOctagon, MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockLeads = [
  { id: 'LD-10025', customer: 'John Doe', mobile: '+91 9876543210', source: 'Facebook', executive: 'Rahul S.', status: 'Interested', date: '31 Aug 2026', product: 'Personal Loan', location: 'Mumbai' },
  { id: 'LD-10026', customer: 'Priya Sharma', mobile: '+91 8765432109', source: 'Website', executive: 'Unassigned', status: 'New', date: '31 Aug 2026', product: 'Home Loan', location: 'Delhi' },
  { id: 'LD-10027', customer: 'Amit Patel', mobile: '+91 7654321098', source: 'Referral', executive: 'Neha G.', status: 'Callback', date: '30 Aug 2026', product: 'Business Loan', location: 'Ahmedabad' },
  { id: 'LD-10028', customer: 'Vikram Singh', mobile: '+91 6543210987', source: 'Google', executive: 'Rahul S.', status: 'Not Interested', date: '29 Aug 2026', product: 'Auto Loan', location: 'Pune' },
  { id: 'LD-10029', customer: 'Anita Desai', mobile: '+91 9988776655', source: 'Field Executive', executive: 'Meena K.', status: 'In Process', date: '28 Aug 2026', product: 'Personal Loan', location: 'Bangalore' },
];

export default function AllLeads() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all prospective customers.</p>
        </div>
        <button 
          onClick={() => navigate('/ops/leads/add')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> Add New Lead
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by Lead ID, Customer, Mobile..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Date Range</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
        </select>

        <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Lead Source</option>
          <option value="Facebook">Facebook</option>
          <option value="Website">Website</option>
          <option value="Google">Google</option>
          <option value="Referral">Referral</option>
        </select>

        <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Status</option>
          <option value="New">New</option>
          <option value="Interested">Interested</option>
          <option value="Callback">Callback</option>
          <option value="In Process">In Process</option>
        </select>

        <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Assignment</option>
          <option value="Assigned">Assigned</option>
          <option value="Unassigned">Unassigned</option>
        </select>

        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
          <Filter size={16} /> More Filters
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lead ID</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Source</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Executive</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                  <td className="py-3 px-4 text-sm font-bold text-gray-900">{lead.id}</td>
                  <td className="py-3 px-4">
                    <div className="text-sm font-bold text-gray-900">{lead.customer}</div>
                    <div className="text-xs text-gray-500">{lead.product}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 font-medium">{lead.mobile}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{lead.source}</td>
                  <td className="py-3 px-4">
                    {lead.executive === 'Unassigned' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                        <UserPlus size={12} /> Assign
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-gray-900">{lead.executive}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${
                      lead.status === 'Interested' ? 'bg-green-50 text-green-700 border-green-200' :
                      lead.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      lead.status === 'Callback' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      lead.status === 'In Process' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{lead.date}</td>
                  <td className="py-3 px-4 text-right relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleMenu(lead.id); }}
                      className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* Action Dropdown Menu */}
                    {activeMenu === lead.id && (
                      <div className="absolute right-8 top-10 w-56 bg-white rounded-xl border border-gray-200 shadow-xl z-10 py-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/ops/leads/${lead.id}`); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Eye size={16} className="text-gray-400" /> View Details
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); alert(`Opening edit form for lead ${lead.id}`); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit size={16} className="text-blue-500" /> Edit Lead
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate('/ops/leads/assignment'); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <UserPlus size={16} className="text-indigo-500" /> Assign Executive
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); alert(`Calling customer at ${lead.mobile}...`); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <PhoneCall size={16} className="text-green-500" /> Call Customer
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${lead.mobile.replace(/[^0-9]/g, '')}`, '_blank'); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <MessageCircle size={16} className="text-emerald-500" /> WhatsApp
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); alert(`Opening SMS composer for ${lead.mobile}`); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <MessageSquare size={16} className="text-gray-500" /> SMS
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); if(window.confirm(`Convert Lead ${lead.id} into a Loan Application?`)) navigate('/ops/los/applications'); }}
                          className="w-full text-left px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                        >
                          <ArrowRightLeft size={16} /> Convert to Application
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); if(window.confirm(`Are you sure you want to close lead ${lead.id}?`)) alert('Lead Closed'); setActiveMenu(null); }}
                          className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <XOctagon size={16} /> Close Lead
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <div>Showing 1 to 5 of 124 leads</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
