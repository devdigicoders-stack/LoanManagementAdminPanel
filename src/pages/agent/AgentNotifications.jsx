import { Bell, Check, CheckCheck, Trash2, Target, MapPin, FileText } from "lucide-react";
import { mockNotifications } from "./agentData";

const tc = {
  bg: "#FAFCFD", card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  primary: "#8ED3F4", cream: "#FFF8E7", text: "#344054", muted: "#667085",
  border: "#D9EAF2", blue: "#1e7ba8",
};

export default function AgentNotifications() {
  const notifs = [...mockNotifications];
  const unreadCount = notifs.filter(n => !n.read).length;

  const getIcon = (name) => {
    switch(name) {
      case "Target": return Target;
      case "MapPin": return MapPin;
      case "FileText": return FileText;
      default: return Bell;
    }
  };

  return (
    <div className="space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
            Notifications 
            {unreadCount > 0 && <span className="text-[12px] px-2 py-0.5 rounded-full text-white" style={{ background: tc.blue }}>{unreadCount} New</span>}
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: tc.muted }}>Stay updated with your leads, visits, and applications.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all hover:opacity-80" style={{ background: tc.sky, color: tc.blue }}>
            <CheckCheck size={14} /> Mark All as Read
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all hover:opacity-80 text-red-600 bg-red-50">
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifs.map(n => {
          const Icon = getIcon(n.icon);
          return (
            <div key={n.id} className="relative p-4 rounded-2xl flex gap-4 transition-all hover:shadow-md" style={{ background: tc.card, border: `1px solid ${n.read ? tc.border : tc.skyMid}` }}>
              {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: tc.primary }} />}
              
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${n.color}15` }}>
                <Icon size={18} style={{ color: n.color }} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h3 className="text-[14px] font-extrabold" style={{ color: tc.text }}>{n.title}</h3>
                  <span className="text-[11px] font-bold" style={{ color: tc.muted }}>{n.time}</span>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: tc.muted }}>{n.message}</p>
                
                {!n.read && (
                  <div className="mt-3 flex gap-2">
                    <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all" style={{ background: tc.sky, color: tc.blue }}>
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {notifs.length === 0 && (
          <div className="text-center py-12 rounded-2xl" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: tc.sky }}>
              <Check size={30} style={{ color: tc.blue }} />
            </div>
            <h2 className="text-[16px] font-extrabold" style={{ color: tc.text }}>You're all caught up!</h2>
            <p className="text-[13px] mt-1" style={{ color: tc.muted }}>There are no new notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
