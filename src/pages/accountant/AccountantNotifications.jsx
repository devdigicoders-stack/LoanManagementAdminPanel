import { CheckCircle, AlertTriangle, FileText, RefreshCcw } from "lucide-react";
import { mockNotifications } from "./accountantData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function AccountantNotifications() {
  const getIcon = (name) => {
    switch (name) {
      case 'FileText': return <FileText size={18} />;
      case 'AlertTriangle': return <AlertTriangle size={18} />;
      case 'RefreshCcw': return <RefreshCcw size={18} />;
      default: return <CheckCircle size={18} />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold" style={{ color: tc.text }}>Notifications</h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Stay updated with important financial activities.</p>
        </div>
        <button className="px-4 py-2 rounded-xl text-[13px] font-bold transition-all hover:bg-gray-100" style={{ color: tc.blue, border: `1px solid ${tc.border}` }}>
          Mark All as Read
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        <div className="divide-y" style={{ borderColor: tc.border }}>
          {mockNotifications.map((n) => (
            <div key={n.id} className={`p-5 flex gap-4 transition-colors ${n.read ? 'opacity-70' : 'bg-[#FAFCFD]'}`}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${n.color}15`, color: n.color }}>
                {getIcon(n.icon)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-[14px] font-extrabold" style={{ color: tc.text }}>{n.title}</h3>
                  <span className="text-[11px] font-bold whitespace-nowrap ml-4" style={{ color: tc.muted }}>{n.time}</span>
                </div>
                <p className="text-[13px] mt-1" style={{ color: tc.muted }}>{n.message}</p>
                {!n.read && (
                  <button className="mt-3 text-[12px] font-bold transition-all hover:opacity-80" style={{ color: tc.blue }}>
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
          {mockNotifications.length === 0 && (
            <div className="p-10 text-center">
              <CheckCircle size={40} className="mx-auto mb-3" style={{ color: tc.muted }} />
              <h3 className="text-[15px] font-extrabold" style={{ color: tc.text }}>You're all caught up!</h3>
              <p className="text-[13px] mt-1" style={{ color: tc.muted }}>No new notifications at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
