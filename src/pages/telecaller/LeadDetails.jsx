import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, CalendarCheck, MessageSquare, RefreshCw, FolderOpen, ChevronRight } from "lucide-react";
import { mockLeads, statusColors, priorityColors } from "./telecallerData";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2.5"
      style={{ borderBottom: `1px solid ${tc.border}` }}>
      <span className="text-[12px] font-semibold" style={{ color: tc.muted }}>{label}</span>
      <span className="text-[13px] font-bold" style={{ color: tc.text }}>{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
      <h3 className="text-[14px] font-extrabold mb-3 pb-3" style={{ color: tc.blue, borderBottom: `1px solid ${tc.border}` }}>{title}</h3>
      {children}
    </div>
  );
}

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = mockLeads.find(l => l.id === id) || mockLeads[0];

  if (!lead) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm max-w-xl mx-auto my-8">
        <h2 className="text-lg font-bold text-slate-700">No Lead Found</h2>
        <p className="text-sm text-slate-500 mt-2">There are currently no lead records matching this identifier.</p>
        <button onClick={() => navigate(-1)} className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
          Go Back
        </button>
      </div>
    );
  }

  const sc = statusColors[lead.status] || { bg: "#F1F5F9", text: "#64748B" };
  const pc = priorityColors[lead.priority] || { bg: "#F1F5F9", text: "#64748B" };

  const actions = [
    { label: "Call Customer",    icon: Phone,        path: `/telecaller/call/${lead.id}`,                bg: "#DCFCE7", col: "#15803D" },
    { label: "Add Follow-up",    icon: CalendarCheck, path: `/telecaller/followups/add?lead=${lead.id}`, bg: tc.sky, col: tc.blue },
    { label: "Add Remark",       icon: MessageSquare, path: "/telecaller/remarks",                       bg: "#EEF2FF", col: "#4338CA" },
    { label: "Update Status",    icon: RefreshCw,     path: `/telecaller/status/${lead.id}`,             bg: "#FFF7ED", col: "#C2410C" },
    { label: "Upload Document",  icon: FolderOpen,    path: "/telecaller/documents",                     bg: "#FEF3C7", col: "#D97706" },
  ];

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => navigate("/telecaller/leads")}
          className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft size={18} style={{ color: tc.text }} />
        </button>
        <div className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: tc.muted }}>
          <Link to="/telecaller" className="hover:underline" style={{ color: tc.muted }}>Dashboard</Link>
          <ChevronRight size={13} />
          <Link to="/telecaller/leads" className="hover:underline" style={{ color: tc.muted }}>My Leads</Link>
          <ChevronRight size={13} />
          <span style={{ color: tc.blue }}>Lead Details</span>
        </div>
      </div>

      {/* Top Bar */}
      <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: tc.sky, border: `1px solid ${tc.skyMid}` }}>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[12px] font-semibold" style={{ color: tc.muted }}>Lead ID</p>
            <p className="text-[20px] font-extrabold" style={{ color: tc.blue }}>{lead.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[12px] font-bold" style={{ background: sc.bg, color: sc.text }}>{lead.status}</span>
            <span className="px-3 py-1 rounded-full text-[12px] font-bold" style={{ background: pc.bg, color: pc.text }}>{lead.priority}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions.map((a, i) => {
            const Icon = a.icon;
            return (
              <Link key={i} to={a.path}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold transition-colors"
                style={{ background: a.bg, color: a.col, border: `1px solid ${tc.border}` }}>
                <Icon size={13} /> {a.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Customer Information */}
        <Section title="Customer Information">
          <InfoRow label="Full Name" value={lead.customerName} />
          <InfoRow label="Mobile Number" value={lead.mobile} />
          <InfoRow label="Alternate Mobile" value={lead.altMobile} />
          <InfoRow label="Email" value={lead.email} />
          <InfoRow label="Address" value={lead.address} />
          <InfoRow label="City" value={lead.city} />
          <InfoRow label="State" value={lead.state} />
          <InfoRow label="Pincode" value={lead.pincode} />
        </Section>

        {/* Professional Information */}
        <Section title="Professional Information">
          <InfoRow label="Occupation" value={lead.occupation} />
          <InfoRow label="Company / Business" value={lead.company} />
          <InfoRow label="Monthly Income" value={`₹${Number(lead.income).toLocaleString("en-IN")}`} />
        </Section>

        {/* Loan Requirement */}
        <Section title="Loan Requirement">
          <InfoRow label="Loan Type" value={lead.loanType} />
          <InfoRow label="Required Amount" value={`₹${Number(lead.amount).toLocaleString("en-IN")}`} />
          <InfoRow label="Loan Purpose" value={lead.purpose} />
          <InfoRow label="Preferred Tenure" value={lead.tenure} />
          <InfoRow label="Existing Loan" value={lead.existingLoan} />
        </Section>

        {/* Lead Information */}
        <Section title="Lead Information">
          <InfoRow label="Lead Source" value={lead.leadSource} />
          <InfoRow label="Created Date" value={lead.createdDate} />
          <InfoRow label="Assigned Date" value={lead.assignedDate} />
          <InfoRow label="Current Status" value={lead.status} />
          <InfoRow label="Last Contact" value={lead.lastContact} />
          <InfoRow label="Next Follow-up" value={lead.nextFollowup} />
          {lead.remarks && <InfoRow label="Remarks" value={lead.remarks} />}
        </Section>
      </div>
    </div>
  );
}
