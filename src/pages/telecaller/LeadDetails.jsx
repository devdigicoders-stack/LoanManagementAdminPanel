import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Phone, CalendarCheck, MessageSquare, RefreshCw, 
  FolderOpen, ChevronRight, CheckCircle2, Clock, ExternalLink,
  Send, FileText, User, ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  card: "#FFFFFF", sky: "#F8FAFC", skyMid: "#E2E8F0",
  cream: "#FFF8E7", text: "#0F172A", muted: "#64748B", border: "#E2E8F0", blue: "#6366F1",
};

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2.5 border-b border-slate-100">
      <span className="text-[12px] font-semibold text-slate-500">{label}</span>
      <span className="text-[13px] font-bold text-slate-900">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm space-y-2">
      <h3 className="text-[14px] font-extrabold pb-2 text-slate-900 border-b border-slate-100">{title}</h3>
      {children}
    </div>
  );
}

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forwarding, setForwarding] = useState(false);

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLead(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForwardToOperations = async () => {
    try {
      setForwarding(true);
      const token = localStorage.getItem("token");

      await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${lead._id}/telecaller-confirm`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notes: "Telecaller reviewed documents and confirmed customer file." })
      });

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads/${lead._id}/handover-operations`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success("Lead verified and forwarded to Operations Manager successfully!");
        fetchLeadDetails();
      } else {
        toast.error("Failed to forward lead");
      }
    } catch (err) {
      toast.error("Error during forwarding");
    } finally {
      setForwarding(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-bold">
        <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-purple-600" />
        Loading lead details...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm max-w-xl mx-auto my-8">
        <h2 className="text-lg font-bold text-slate-700">No Lead Found</h2>
        <p className="text-sm text-slate-500 mt-2">There are currently no lead records matching this identifier.</p>
        <button onClick={() => navigate(-1)} className="mt-5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
          Go Back
        </button>
      </div>
    );
  }

  const isFormFilled = lead.customerFormStatus === "Completed";

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => navigate("/telecaller/assigned-leads")}
          className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex items-center gap-1 text-[12px] font-semibold text-slate-500">
          <Link to="/telecaller" className="hover:underline">Telecaller Desk</Link>
          <ChevronRight size={13} />
          <Link to="/telecaller/assigned-leads" className="hover:underline">Assigned Leads</Link>
          <ChevronRight size={13} />
          <span className="text-purple-600">Lead Details</span>
        </div>
      </div>

      {/* Top Banner */}
      <div className="rounded-3xl p-6 bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-md">
              {lead.leadId || lead._id}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
              isFormFilled 
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                : "bg-amber-100 text-amber-800 border border-amber-300"
            }`}>
              {isFormFilled ? <CheckCircle2 size={12} /> : <Clock size={12} />}
              {isFormFilled ? "Customer Form Submitted" : "Customer Form Pending"}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Zone: {lead.zone || 'NORTH'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">{lead.name}</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Loan Volume: ₹{Number(lead.expectedAmount || 0).toLocaleString('en-IN')} &bull; {lead.productCategory} ({lead.productSubtype})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`tel:${lead.mobile}`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
          >
            <Phone size={14} /> Call Customer
          </a>

          {isFormFilled && (
            <button
              onClick={handleForwardToOperations}
              disabled={forwarding}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition shadow-xs disabled:opacity-50"
            >
              {forwarding ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              Verify & Forward to Operations
            </button>
          )}

          <a
            href={`/api/apply/${lead.leadId || lead._id}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ExternalLink size={14} /> View Link
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Customer Information */}
        <Section title="Customer Details">
          <InfoRow label="Full Name" value={lead.name} />
          <InfoRow label="Mobile Number" value={lead.mobile} />
          <InfoRow label="Email" value={lead.email} />
          <InfoRow label="PAN Number" value={lead.panNumber} />
          <InfoRow label="Aadhaar Reference" value={lead.aadhaarApc} />
          <InfoRow label="Address" value={lead.address} />
          <InfoRow label="City & State" value={[lead.city, lead.state].filter(Boolean).join(', ')} />
          <InfoRow label="Pincode" value={lead.pincode} />
        </Section>

        {/* Loan Requirement & Source Info */}
        <Section title="Loan & Source Details">
          <InfoRow label="Lead Generator" value={lead.generatorType === 'Employee' ? `${lead.createdByDesignation || 'Employee'} (${lead.createdByName || 'Staff'})` : 'Customer Direct Apply (Self)'} />
          <InfoRow label="Lead Source" value={lead.source || (lead.generatorType === 'Employee' ? 'Employee App' : 'Customer Portal')} />
          <InfoRow label="Product Category" value={lead.productCategory} />
          <InfoRow label="Loan Sub-Type" value={lead.productSubtype} />
          <InfoRow label="Requested Amount" value={`₹${Number(lead.expectedAmount || 0).toLocaleString("en-IN")}`} />
          <InfoRow label="Tenure & Comfort EMI" value={`${lead.tenure || 'N/A'} Yrs / ₹${lead.comfortEmi || 'N/A'}`} />
          <InfoRow label="Facility & Program" value={`${lead.facilityType} (${lead.financialProgram})`} />
          <InfoRow label="Workflow Stage" value={lead.workflowStage} />
        </Section>

        {/* Customer Uploaded Documents (Read-Only) */}
        <div className="xl:col-span-2">
          <Section title={`Customer Uploaded Documents (${lead.documents?.length || 0})`}>
            {(!lead.documents || lead.documents.length === 0) ? (
              <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <FileText size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">No documents submitted by customer yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Customer will upload files using their application link</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                {lead.documents.map((doc, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        {doc.type}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Received
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate" title={doc.fileName}>
                      {doc.fileName || `${doc.type}.pdf`}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Uploaded by: {doc.uploadedBy || 'Customer'}
                    </p>
                    {doc.fileUrl && (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:underline"
                      >
                        <ExternalLink size={12} /> View File
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
