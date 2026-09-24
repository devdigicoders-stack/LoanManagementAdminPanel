import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, CheckCircle2, AlertCircle, 
  Clock, RefreshCw, Search, Eye, Phone, Check, 
  Building2, ShieldCheck, X, Layers, ExternalLink, 
  Send, UserCheck, CheckSquare, Sparkles, FolderCheck,
  ChevronRight, ArrowUpRight, User, UserCheck2, Briefcase
} from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerDocuments() {
  const [leads, setLeads] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [forwarding, setForwarding] = useState(false);

  // Document preview modal
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    fetchLiveDocumentsData();
  }, []);

  const fetchLiveDocumentsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [leadsRes, docsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/my-leads`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/desk/documents`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      let combinedLeads = [];
      if (leadsRes.ok) {
        const lData = await leadsRes.json();
        combinedLeads = [
          ...(lData.leads || []).map(l => ({ 
            _id: l._id, 
            id: l.leadId || l._id, 
            name: l.name, 
            mobile: l.mobile, 
            zone: l.zone,
            customerFormStatus: l.customerFormStatus || "Pending",
            customerFilledAt: l.customerFilledAt,
            workflowStage: l.workflowStage || "Field_Lead_Created",
            status: l.status,
            expectedAmount: l.expectedAmount || l.loanAmount || 0,
            productSubtype: l.productSubtype || "Loan",
            source: l.source || "Employee App",
            generatorType: l.generatorType || (l.createdByName ? "Employee" : "Customer"),
            createdByDesignation: l.createdByDesignation || l.createdByRole || "",
            createdByName: l.createdByName || "",
            documents: l.documents || []
          })),
          ...(lData.loanApplications || []).map(a => ({ 
            _id: a._id, 
            id: a.applicationId || a._id, 
            name: a.customer, 
            mobile: a.mobile, 
            zone: a.zone,
            customerFormStatus: "Completed",
            workflowStage: a.workflowStage || "RM_Telecaller_Review",
            status: a.status,
            expectedAmount: a.amount || 0,
            productSubtype: a.loanType || "Home Loan",
            source: a.source || "Customer App",
            generatorType: a.generatorType || "Customer",
            createdByDesignation: a.createdByDesignation || "",
            createdByName: a.createdByName || "",
            documents: []
          }))
        ];
        setLeads(combinedLeads);
        if (combinedLeads.length > 0 && !selectedLeadId) {
          setSelectedLeadId(combinedLeads[0]._id);
        }
      }

      if (docsRes.ok) {
        const dData = await docsRes.json();
        setDocuments(dData.documents || []);
      }
    } catch (err) {
      console.error("Failed to load customer documents", err);
      toast.error("Failed to fetch customer documents");
    } finally {
      setLoading(false);
    }
  };

  // Verify and Forward to Operation Manager
  const handleVerifyAndForward = async (leadId) => {
    try {
      setForwarding(true);
      const token = localStorage.getItem("token");

      // 1. Confirm lead telecaller check
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${leadId}/telecaller-confirm`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          notes: "Customer documents verified by Telecaller. Handed over to Operations."
        })
      });

      // 2. Handover to Operations Desk
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${leadId}/handover-operations`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success("Lead documents verified and forwarded to Operations Manager successfully!");
        fetchLiveDocumentsData();
      } else {
        toast.error("Failed to forward lead to Operations Manager");
      }
    } catch (err) {
      toast.error("Network error during handover");
    } finally {
      setForwarding(false);
    }
  };

  const selectedLead = leads.find(l => l._id === selectedLeadId) || leads[0];
  const selectedLeadDocs = documents.filter(d => d.rawLeadId === selectedLeadId || d.leadId === selectedLead?.id);

  const filteredDocs = documents.filter(d => {
    if (statusFilter !== "ALL" && d.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (d.customer && d.customer.toLowerCase().includes(q)) ||
        (d.leadId && d.leadId.toLowerCase().includes(q)) ||
        (d.mobile && d.mobile.includes(q)) ||
        (d.type && d.type.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Customer Document Verification Desk</h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Review documents submitted by customers via online link, confirm details with customer over call, and forward to Operations.
          </p>
        </div>

        <button
          onClick={fetchLiveDocumentsData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer self-start md:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-emerald-600" : ""} /> Refresh
        </button>
      </div>

      {/* ── WORKSPACE GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Active Leads List with Customer Form Status */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Assigned Queue (Alternate)</h3>
              <p className="text-[11px] text-slate-400 font-medium">{leads.length} Leads & Applications Allocated</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
              All Zones
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {leads.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                No active leads assigned in your queue
              </div>
            ) : (
              leads.map(l => {
                const isSelected = selectedLead?._id === l._id;
                const isFormFilled = l.customerFormStatus === "Completed";
                const isEmployee = l.generatorType === "Employee";

                return (
                  <div
                    key={l._id}
                    onClick={() => setSelectedLeadId(l._id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20" 
                        : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {l.id}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {l.zone || "NORTH"}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">{l.name}</h4>
                        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Phone size={11} className="text-slate-400" /> {l.mobile}
                        </p>
                        
                        {/* Source & Creator Tag */}
                        <div className="mt-1.5">
                          {isEmployee ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200" title={`Generated by ${l.createdByDesignation || 'Employee'}: ${l.createdByName}`}>
                              <Briefcase size={10} /> {l.createdByDesignation || 'Employee'}: {l.createdByName || 'Staff'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200" title="Direct Customer Online Application">
                              <User size={10} /> Customer Direct Apply
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isFormFilled 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}>
                          {isFormFilled ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                          {isFormFilled ? "Form Filled" : "Form Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 8 Cols: Selected Lead Verification & Document View Panel */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Selected Lead Overview Banner */}
          {selectedLead && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                      {selectedLead.id}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      Zone: {selectedLead.zone || "NORTH"}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      selectedLead.customerFormStatus === "Completed"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}>
                      {selectedLead.customerFormStatus === "Completed" ? (
                        <>
                          <CheckCircle2 size={12} /> Customer Form Completed & Docs Uploaded
                        </>
                      ) : (
                        <>
                          <Clock size={12} /> Customer Form Pending (Call Customer to Upload)
                        </>
                      )}
                    </span>
                  </div>

                  <h2 className="text-lg font-black text-slate-900 mt-1.5">{selectedLead.name}</h2>
                  
                  {/* Creator / Source Details Row */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1 flex-wrap">
                    <span>Requested: <b className="text-slate-900">₹{Number(selectedLead.expectedAmount).toLocaleString('en-IN')}</b> ({selectedLead.productSubtype})</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      Source: 
                      {selectedLead.generatorType === "Employee" ? (
                        <b className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {selectedLead.createdByDesignation || "Employee"}: {selectedLead.createdByName || "Staff"}
                        </b>
                      ) : (
                        <b className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Customer Direct Online
                        </b>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedLead.mobile}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition"
                  >
                    <Phone size={13} /> Call Customer
                  </a>
                  <a
                    href={`/api/apply/${selectedLead.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                  >
                    <ExternalLink size={13} /> Customer Link
                  </a>
                </div>
              </div>

              {/* Status Notice */}
              {selectedLead.customerFormStatus === "Pending" ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle size={14} /> Customer has not uploaded documents via portal link yet
                  </p>
                  <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                    Please call the customer at <b>+91 {selectedLead.mobile}</b> and guide them to open their pre-filled application link to submit Aadhaar, PAN, and Bank Statements online. Telecallers do not upload documents manually.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Customer submitted form & documents online
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Review all customer uploaded documents below, verify with customer over phone call, and click forward to Operations Desk.
                    </p>
                  </div>

                  <button
                    onClick={() => handleVerifyAndForward(selectedLead._id)}
                    disabled={forwarding}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {forwarding ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                    Verify & Forward to Operations
                  </button>
                </div>
              )}

              {/* Uploaded Documents List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={14} className="text-purple-600" /> Customer Submitted Files ({selectedLeadDocs.length})
                  </h4>
                  <span className="text-[11px] font-medium text-slate-400">
                    Read-Only Telecaller Verification
                  </span>
                </div>

                {selectedLeadDocs.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
                    <FileText size={28} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-600">No documents received from customer yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Customer must upload KYC documents using their application link
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedLeadDocs.map((doc, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                              {doc.type}
                            </span>
                            <h5 className="text-xs font-bold text-slate-800 mt-1 truncate max-w-[200px]" title={doc.fileName}>
                              {doc.fileName || `${doc.type}.pdf`}
                            </h5>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Uploaded
                          </span>
                        </div>

                        {doc.hasBothSides && doc.fileUrlBack && (
                          <div className="text-[10px] font-bold text-slate-500 bg-white p-1.5 rounded-lg border border-slate-200">
                            Front & Back Verified
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 text-[11px] flex items-center justify-center gap-1 transition"
                          >
                            <Eye size={12} /> Preview Document
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Desk Documents Table (Overview of all leads) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <FolderCheck size={16} className="text-emerald-600" /> All Received Customer Files ({documents.length})
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Comprehensive view of all customer-uploaded documents across assigned queue</p>
              </div>

              <div className="relative w-full sm:w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Customer & Lead</th>
                    <th className="py-2.5 px-3">Document Type</th>
                    <th className="py-2.5 px-3">Uploaded By</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs font-semibold">
                        No customer documents found matching filter
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{doc.customer}</div>
                          <div className="text-[11px] text-slate-400">{doc.leadId} &bull; {doc.mobile}</div>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {doc.type}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {doc.uploadedBy || "Customer"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Received
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition"
                          >
                            Preview
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

      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">{previewDoc.type}</h3>
                <p className="text-[11px] text-slate-400 font-medium">Customer: {previewDoc.customer} ({previewDoc.leadId})</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-100 rounded-2xl text-center">
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.type}
                  className="max-h-60 mx-auto rounded-xl object-contain shadow-sm"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400";
                  }}
                />
                <p className="text-[11px] text-slate-500 font-bold mt-2">Primary / Front Document</p>
              </div>

              {previewDoc.fileUrlBack && (
                <div className="p-3 bg-slate-100 rounded-2xl text-center">
                  <img
                    src={previewDoc.fileUrlBack}
                    alt={`${previewDoc.type} Back`}
                    className="max-h-60 mx-auto rounded-xl object-contain shadow-sm"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                  <p className="text-[11px] text-slate-500 font-bold mt-2">Back Side Document (Address & Details)</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setPreviewDoc(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
