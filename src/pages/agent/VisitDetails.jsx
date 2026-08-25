import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { mockCustomerVisits } from "./agentData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function VisitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const visit = mockCustomerVisits.find(v => v.id === id) || mockCustomerVisits[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Visit details updated successfully.");
    navigate("/agent/visits");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/agent/visits" className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-80" style={{ background: tc.card, border: `1px solid ${tc.border}`, color: tc.muted }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-[20px] font-extrabold" style={{ color: tc.text }}>Visit Details</h1>
          <p className="text-[12px] mt-0.5" style={{ color: tc.muted }}>Manage meeting outcomes and next actions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Info */}
        <div className="rounded-2xl p-5 space-y-4 h-fit" style={{ background: tc.sky, border: `1px solid ${tc.skyMid}` }}>
          <div className="flex justify-between items-center pb-3" style={{ borderBottom: `1px solid ${tc.skyMid}` }}>
            <span className="text-[12px] font-semibold" style={{ color: tc.blue }}>Visit ID</span>
            <span className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{visit.id}</span>
          </div>
          <div className="flex justify-between items-center pb-3" style={{ borderBottom: `1px solid ${tc.skyMid}` }}>
            <span className="text-[12px] font-semibold" style={{ color: tc.blue }}>Customer</span>
            <span className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{visit.customerName}</span>
          </div>
          <div className="flex justify-between items-center pb-3" style={{ borderBottom: `1px solid ${tc.skyMid}` }}>
            <span className="text-[12px] font-semibold" style={{ color: tc.blue }}>Date & Time</span>
            <span className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{visit.date} at {visit.time}</span>
          </div>
          <div className="flex justify-between items-center pb-3" style={{ borderBottom: `1px solid ${tc.skyMid}` }}>
            <span className="text-[12px] font-semibold" style={{ color: tc.blue }}>Purpose</span>
            <span className="text-[13px] font-extrabold" style={{ color: tc.blue }}>{visit.purpose}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-semibold" style={{ color: tc.blue }}>Current Status</span>
            <span className="text-[12px] font-extrabold px-2 py-0.5 rounded bg-white text-blue-700">{visit.status}</span>
          </div>
        </div>

        {/* Update Form */}
        <div className="rounded-2xl p-5" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold" style={{ color: tc.text }}>Visit Outcome <span className="text-red-500">*</span></label>
              <select className="w-full h-10 px-3 rounded-lg text-[13px] outline-none bg-white" style={{ border: `1px solid ${tc.border}`, color: tc.text }} required>
                <option value="">Select outcome</option>
                <option value="Customer Interested">Customer Interested</option>
                <option value="Customer Not Interested">Customer Not Interested</option>
                <option value="More Information Required">More Information Required</option>
                <option value="Documents Collected">Documents Collected</option>
                <option value="Application Ready">Application Ready</option>
                <option value="Follow-up Required">Follow-up Required</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold" style={{ color: tc.text }}>Meeting Notes <span className="text-red-500">*</span></label>
              <textarea 
                rows={4} 
                required
                className="w-full p-3 rounded-lg text-[13px] outline-none resize-none" 
                placeholder="Enter details discussed during the customer meeting..."
                style={{ border: `1px solid ${tc.border}`, color: tc.text }}
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold" style={{ color: tc.text }}>Next Action <span className="text-red-500">*</span></label>
              <select className="w-full h-10 px-3 rounded-lg text-[13px] outline-none bg-white" style={{ border: `1px solid ${tc.border}`, color: tc.text }} required>
                <option value="">Select action</option>
                <option value="Follow-up Call">Follow-up Call</option>
                <option value="Second Visit">Second Visit</option>
                <option value="Document Collection">Document Collection</option>
                <option value="Application Creation">Application Creation</option>
                <option value="No Further Action">No Further Action</option>
              </select>
            </div>

            <button type="submit" className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-[13px] font-bold text-white transition-all hover:opacity-90 mt-2" style={{ background: tc.blue }}>
              <Save size={16} /> Save Visit Outcome
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
