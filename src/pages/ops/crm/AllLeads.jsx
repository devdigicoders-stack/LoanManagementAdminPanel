import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, Eye, Edit, UserPlus, PhoneCall, 
  MessageCircle, MessageSquare, ArrowRightLeft, XOctagon, MoreVertical, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AllLeads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = statusFilter === 'all'
        ? `${import.meta.env.VITE_API_BASE_URL}/leads`
        : `${import.meta.env.VITE_API_BASE_URL}/leads?status=${statusFilter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leads from database");
    } finally {
      setLoading(false);
    }
  };

  const filtered = leads.filter(l => {
    const q = searchTerm.toLowerCase();
    return (
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.leadId && l.leadId.toLowerCase().includes(q)) ||
      (l.mobile && l.mobile.includes(q))
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Pipeline Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Live customer leads from MongoDB CRM.</p>
        </div>
        <button 
          onClick={() => navigate('/telecaller/leads/add')}
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
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg text-sm px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-[12px] font-bold text-gray-500 uppercase">
                <th className="py-4 px-6">Lead ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Source</th>
                <th className="py-4 px-6">Product Purpose</th>
                <th className="py-4 px-6">Expected Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-blue-600" />
                    Loading live leads...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 text-sm">
                    No leads found matching your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-blue-600">
                      {lead.leadId || `LD-${lead._id.slice(-4)}`}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900 text-sm">{lead.name}</div>
                      <div className="text-xs text-gray-400">{lead.mobile}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                      {lead.source}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-800">
                      {lead.loanPurpose}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">
                      {lead.expectedAmount || '₹10,00,000'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        lead.status === 'Qualified' || lead.status === 'Converted' ? 'bg-green-100 text-green-700' :
                        lead.status === 'Lost' ? 'bg-red-100 text-red-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <a 
                        href={`tel:${lead.mobile}`}
                        className="p-1.5 inline-block text-gray-400 hover:text-green-600 rounded-md"
                        title="Call"
                      >
                        <PhoneCall size={16} />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
