import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, ChevronRight, CheckCircle2, Clock, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Applications() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = statusFilter === 'all'
        ? `${import.meta.env.VITE_API_BASE_URL}/loans`
        : `${import.meta.env.VITE_API_BASE_URL}/loans?status=${statusFilter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApps(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load LOS applications");
    } finally {
      setLoading(false);
    }
  };

  const filtered = apps.filter(a => {
    const q = searchTerm.toLowerCase();
    return (
      (a.customer && a.customer.toLowerCase().includes(q)) ||
      (a.applicationId && a.applicationId.toLowerCase().includes(q)) ||
      (a.mobile && a.mobile.includes(q))
    );
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Disbursed': 
      case 'Approved': return <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
      case 'Under Review': 
      case 'Assigned': return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
      case 'Pending': return <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
      case 'Overdue': return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
      default: return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LOS Applications Queue</h1>
          <p className="text-sm text-gray-500 mt-1">Live master view of all loan applications in MongoDB.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by App ID, Customer or Phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg text-sm px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Disbursed">Disbursed</option>
          <option value="Overdue">Overdue</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-[12px] font-bold text-gray-500 uppercase">
                <th className="py-4 px-6">App ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Loan Type</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Assigned To</th>
                <th className="py-4 px-6">Applied Date</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-blue-600" />
                    Loading live loan applications...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 text-sm">
                    No applications match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-blue-600">
                      {app.applicationId || `APP-${app._id.slice(-4)}`}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900 text-sm">{app.customer}</div>
                      <div className="text-xs text-gray-400">{app.mobile}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                      {app.loanType}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">
                      {app.amount?.toString().startsWith('₹') ? app.amount : `₹${Number(app.amount).toLocaleString('en-IN')}`}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                      {app.assignedTo || 'Unassigned'}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-400">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => navigate(`/loans/manage?id=${app._id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md font-bold text-xs flex items-center gap-1 mx-auto"
                      >
                        Inspect <ChevronRight size={14} />
                      </button>
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
