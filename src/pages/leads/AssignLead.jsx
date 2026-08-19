import React, { useState } from "react";
import { 
  Search, UserCheck, Users, FileText, ChevronRight, CheckCircle2,
  Phone, Globe, IndianRupee, Tag, ShieldAlert, X, Eye, Trash2
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const initialLeads = [
  { id: "LID-2025-1268", name: "Rohit Kumar", mobile: "+91 9876543210", source: "Website", amount: "₹5,00,000", status: "Unassigned" },
  { id: "LID-2025-1269", name: "Priya Sharma", mobile: "+91 9123456789", source: "Referral", amount: "₹15,00,000", status: "Unassigned" },
  { id: "LID-2025-1270", name: "Amit Verma", mobile: "+91 9988776655", source: "Social Media", amount: "₹8,50,000", status: "Unassigned" },
  { id: "LID-2025-1271", name: "Neha Singh", mobile: "+91 9876501234", source: "Walk-in", amount: "₹2,00,000", status: "Unassigned" },
];

export default function AssignLead() {
  const [leads, setLeads] = useState(initialLeads);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [selectedLead, setSelectedLead] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [employee, setEmployee] = useState("");
  const [team, setTeam] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [remarks, setRemarks] = useState("");

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lead.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAssignModal = (lead) => {
    setSelectedLead(lead);
    setEmployee("");
    setTeam("");
    setPriority("Medium");
    setRemarks("");
  };

  const closeAssignModal = () => {
    setSelectedLead(null);
  };

  const handleAssign = (e) => {
    e.preventDefault();
    if (!employee && !team) {
      toast.error("Please select an employee or a team to assign the lead.");
      return;
    }

    Swal.fire({
      title: 'Confirm Assignment',
      text: `Are you sure you want to assign ${selectedLead.name} to ${employee || team}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#489b0d',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, Assign!'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
          setIsSubmitting(false);
          // Remove assigned lead from the list
          setLeads(prev => prev.filter(l => l.id !== selectedLead.id));
          toast.success("Lead assigned successfully!");
          closeAssignModal();
        }, 1000);
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this lead from the assignment queue?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setLeads(prev => prev.filter(l => l.id !== id));
        toast.success("Lead deleted successfully!");
      }
    });
  };

  const handleView = (lead) => {
    Swal.fire({
      title: 'Lead Details',
      html: `
        <div class="text-left space-y-3 mt-4">
          <p><strong>Name:</strong> ${lead.name}</p>
          <p><strong>ID:</strong> ${lead.id}</p>
          <p><strong>Mobile:</strong> ${lead.mobile}</p>
          <p><strong>Source:</strong> ${lead.source}</p>
          <p><strong>Expected Amount:</strong> <span class="text-[#489b0d] font-bold">${lead.amount}</span></p>
        </div>
      `,
      confirmButtonColor: '#489b0d',
      confirmButtonText: 'Close'
    });
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Lead Assignment</h1>
          <div className="flex items-center text-[12px] font-medium text-slate-500">
            <span className="cursor-pointer hover:text-[#489b0d] transition-colors">Lead Management</span>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-[#489b0d] font-bold">Assign Leads</span>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full sm:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name or ID..." 
              className="h-10 pl-9 pr-4 rounded-md border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] transition-all bg-white w-full sm:w-[280px]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <span className="font-bold text-slate-700 text-[14px]">Pending Assignments ({leads.length})</span>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Lead ID</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Customer Details</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Source</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Expected Amount</th>
                <th className="py-4 px-6 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="text-[13px] font-bold text-slate-700">{lead.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-[13px] font-bold text-slate-800">{lead.name}</p>
                    <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5"><Phone size={10}/> {lead.mobile}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[11px] font-bold border border-blue-100 flex items-center gap-1 w-fit">
                      <Globe size={10}/> {lead.source}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[13px] font-extrabold text-[#489b0d]">{lead.amount}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openAssignModal(lead)}
                        className="h-8 px-4 inline-flex items-center gap-1.5 text-white bg-slate-800 hover:bg-black font-bold text-[11px] rounded shadow-sm transition-colors"
                        title="Assign Lead"
                      >
                        <UserCheck size={12} strokeWidth={2.5} /> Assign Now
                      </button>
                      <button 
                        onClick={() => handleView(lead)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded border border-transparent transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => handleDelete(lead.id)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded border border-transparent transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="text-center py-12 flex flex-col items-center">
              <ShieldAlert size={40} className="text-slate-200 mb-3" />
              <p className="text-slate-500 font-medium text-[14px]">No unassigned leads found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-extrabold text-slate-800 text-[16px] flex items-center gap-2">
                  <UserCheck size={18} className="text-[#489b0d]"/> Assign Lead
                </h3>
                <p className="text-[12px] text-slate-500 font-medium mt-0.5">Assigning {selectedLead.name} ({selectedLead.id})</p>
              </div>
              <button onClick={closeAssignModal} className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-slate-200/50 rounded-full hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              {/* Lead Summary Box */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-center justify-between">
                 <div>
                   <p className="text-[11px] text-blue-500 font-bold uppercase tracking-wider mb-0.5">Loan Amount</p>
                   <p className="text-[16px] font-black text-blue-900">{selectedLead.amount}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[11px] text-blue-500 font-bold uppercase tracking-wider mb-0.5">Source</p>
                   <p className="text-[13px] font-bold text-blue-900">{selectedLead.source}</p>
                 </div>
              </div>

              <form id="assign-form" onSubmit={handleAssign} className="space-y-5">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                    Select Employee <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                      value={employee}
                      onChange={(e) => { setEmployee(e.target.value); setTeam(""); }}
                      className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#489b0d] bg-white appearance-none"
                    >
                      <option value="">Select individual employee</option>
                      <option value="Ravi Kumar">Ravi Kumar (Loan Officer)</option>
                      <option value="Neha Singh">Neha Singh (Loan Officer)</option>
                      <option value="Suresh Patel">Suresh Patel (Branch Manager)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-1">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">OR</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                    Assign To Team
                  </label>
                  <div className="relative">
                    <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                      value={team}
                      onChange={(e) => { setTeam(e.target.value); setEmployee(""); }}
                      className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#489b0d] bg-white appearance-none"
                    >
                      <option value="">Select an entire team</option>
                      <option value="Sales Team A">Sales Team A (Fast Track)</option>
                      <option value="Sales Team B">Sales Team B (Standard)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-2">
                    Lead Priority
                  </label>
                  <div className="flex gap-3">
                    {['Low', 'Medium', 'High'].map(p => (
                      <div 
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 h-10 flex items-center justify-center gap-2 rounded border-2 cursor-pointer transition-all ${priority === p ? (p === 'High' ? 'border-red-500 bg-red-50 text-red-600' : p === 'Medium' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-[#489b0d] bg-[#489b0d]/10 text-[#489b0d]') : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                      >
                        {priority === p && <CheckCircle2 size={14} />}
                        <span className="font-bold text-[12px]">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">
                    Assignment Remarks (Optional)
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add instructions or notes..."
                    rows="3"
                    className="w-full p-3 rounded-md border border-slate-200 text-[13px] text-slate-700 focus:outline-none focus:border-[#489b0d] bg-white resize-none"
                  ></textarea>
                </div>
              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={closeAssignModal}
                className="h-10 px-5 rounded-md border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="assign-form"
                disabled={isSubmitting}
                className="h-10 px-6 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Processing...</>
                ) : (
                  <><UserCheck size={16}/> Confirm Assignment</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
