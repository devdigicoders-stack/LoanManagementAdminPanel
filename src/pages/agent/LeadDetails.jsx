import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, Phone, MapPin, CalendarCheck, MessageSquare, 
  FolderOpen, Activity, Edit, User, Briefcase, IndianRupee, FileText
} from "lucide-react";
import { mockAgentLeads, statusColors, priorityColors } from "./agentData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function LeadDetails() {
  const { id } = useParams();
  const leadId = id || "LD-10245";
  const lead = mockAgentLeads.find(l => l.id === leadId) || mockAgentLeads[0];
  
  const sc = statusColors[lead.status] || { bg: "#F1F5F9", text: "#64748B" };
  const pc = priorityColors[lead.priority] || { bg: "#F1F5F9", text: "#64748B" };

  return (
    <div className="space-y-6 w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/agent/leads" className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-80" style={{ background: tc.card, border: `1px solid ${tc.border}`, color: tc.muted }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-[20px] font-extrabold flex items-center gap-3" style={{ color: tc.text }}>
              {lead.customerName}
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: tc.sky, color: tc.blue }}>{lead.id}</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: sc.bg, color: sc.text }}>{lead.status}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: pc.bg, color: pc.text }}>Priority: {lead.priority}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all hover:opacity-90" style={{ background: "#EEF2FF", color: "#4338CA" }}>
            <Phone size={14} /> Call
          </button>
          <Link to="/agent/visits/add" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all hover:opacity-90" style={{ background: tc.sky, color: tc.blue }}>
            <MapPin size={14} /> Schedule Visit
          </Link>
          <Link to="/agent/followups" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all hover:opacity-90" style={{ background: "#FEF3C7", color: "#D97706" }}>
            <CalendarCheck size={14} /> Add Follow-up
          </Link>
          <Link to="/agent/remarks" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all hover:opacity-90" style={{ background: "#DCFCE7", color: "#15803D" }}>
            <MessageSquare size={14} /> Remark
          </Link>
          <Link to="/agent/documents" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all hover:opacity-90" style={{ background: "#FEF9C3", color: "#CA8A04" }}>
            <FolderOpen size={14} /> Documents
          </Link>
          <Link to="/agent/status/1" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all hover:opacity-90" style={{ background: tc.text, color: tc.card }}>
            <Activity size={14} /> Update Status
          </Link>
          <Link to="/agent/applications" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all hover:opacity-90" style={{ background: "#F3E8FF", color: "#7E22CE" }}>
            <FileText size={14} /> Application
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Customer & Professional Info */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
                <User size={16} style={{ color: tc.blue }} /> Customer Information
              </h2>
              <button className="text-[12px] font-bold flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: tc.blue }}>
                <Edit size={14} /> Edit
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.muted }}>Full Name</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>{lead.customerName}</p></div>
              <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.muted }}>Mobile Number</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>{lead.mobile}</p></div>
              <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.muted }}>Alternate Mobile</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>{lead.altMobile || "-"}</p></div>
              <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.muted }}>Email Address</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>{lead.email}</p></div>
              <div className="sm:col-span-2"><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.muted }}>Address</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>{lead.address}, {lead.city}, {lead.state} - {lead.pincode}</p></div>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
                <Briefcase size={16} style={{ color: "#D97706" }} /> Professional Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
              <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.muted }}>Occupation</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>{lead.occupation}</p></div>
              <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.muted }}>Company / Business</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>{lead.company}</p></div>
              <div><p className="text-[11px] font-bold mb-0.5" style={{ color: tc.muted }}>Monthly Income</p><p className="text-[13px] font-semibold" style={{ color: tc.text }}>₹{Number(lead.income).toLocaleString("en-IN")}</p></div>
            </div>
          </div>
          
        </div>

        {/* Right Col: Loan & Sales Info */}
        <div className="space-y-6">
          
          <div className="rounded-2xl p-5" style={{ background: tc.sky, border: `1px solid ${tc.skyMid}` }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.blue }}>
                <IndianRupee size={16} /> Loan Requirement
              </h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2" style={{ borderBottom: `1px solid ${tc.skyMid}` }}>
                <span className="text-[12px] font-semibold" style={{ color: tc.blue }}>Loan Type</span>
                <span className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{lead.loanType}</span>
              </div>
              <div className="flex justify-between items-center py-2" style={{ borderBottom: `1px solid ${tc.skyMid}` }}>
                <span className="text-[12px] font-semibold" style={{ color: tc.blue }}>Required Amount</span>
                <span className="text-[14px] font-extrabold text-[#15803D]">₹{Number(lead.amount).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center py-2" style={{ borderBottom: `1px solid ${tc.skyMid}` }}>
                <span className="text-[12px] font-semibold" style={{ color: tc.blue }}>Purpose</span>
                <span className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{lead.purpose}</span>
              </div>
              <div className="flex justify-between items-center py-2" style={{ borderBottom: `1px solid ${tc.skyMid}` }}>
                <span className="text-[12px] font-semibold" style={{ color: tc.blue }}>Preferred Tenure</span>
                <span className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{lead.tenure}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[12px] font-semibold" style={{ color: tc.blue }}>Existing Loan</span>
                <span className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{lead.existingLoan}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: tc.cream, border: `1px solid ${tc.border}` }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
                <Activity size={16} style={{ color: "#D97706" }} /> Sales Information
              </h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold" style={{ color: tc.muted }}>Lead Source</span>
                <span className="text-[12px] font-semibold" style={{ color: tc.text }}>{lead.source}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold" style={{ color: tc.muted }}>Assigned By</span>
                <span className="text-[12px] font-semibold" style={{ color: tc.text }}>{lead.assignedBy}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold" style={{ color: tc.muted }}>Assigned Date</span>
                <span className="text-[12px] font-semibold" style={{ color: tc.text }}>{lead.assignedDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold" style={{ color: tc.muted }}>Last Activity</span>
                <span className="text-[12px] font-semibold" style={{ color: tc.text }}>{lead.lastActivity}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
