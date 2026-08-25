import { useState } from "react";
import { Bell, Check, CheckCheck, UserPlus, Calendar, FileText, RefreshCw, Activity } from "lucide-react";
import toast from "react-hot-toast";

const tc = {
  card: "#FFFFFF", sky: "#DFF3FF", skyMid: "#BFE7F7",
  cream: "#FFF8E7", text: "#344054", muted: "#667085", border: "#D9EAF2", blue: "#1e7ba8",
};

export default function TelecallerNotifications() {
  const [notifs, setNotifs] = useState([
    { id: 1, type: "New Lead Assigned", message: "A new lead (LD-10255) has been assigned to you.", time: "10 mins ago", icon: UserPlus, color: "#1e7ba8", bg: tc.sky, read: false },
    { id: 2, type: "Follow-up Reminder", message: "Your follow-up with Amit Kumar is scheduled for today at 10:00 AM.", time: "2 hours ago", icon: Calendar, color: "#D97706", bg: "#FEF3C7", read: false },
    { id: 3, type: "Document Request", message: "Additional document (Salary Slip) is required for lead LD-10247.", time: "5 hours ago", icon: FileText, color: "#DC2626", bg: "#FEE2E2", read: false },
    { id: 4, type: "Lead Status Updated", message: "Lead LD-10241 status has been updated to Documents Pending.", time: "1 day ago", icon: RefreshCw, color: "#15803D", bg: "#DCFCE7", read: true },
    { id: 5, type: "Application Update", message: "Lead LD-10238 has moved to the application stage.", time: "2 days ago", icon: Activity, color: "#4338CA", bg: "#EEF2FF", read: true },
  ]);

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };

  const markRead = (id) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold flex items-center gap-2" style={{ color: tc.text }}>
            <Bell size={22} style={{ color: tc.primary }} /> Notifications
            {unreadCount > 0 && <span className="px-2 py-0.5 rounded-full text-[12px] font-bold" style={{ background: tc.sky, color: tc.blue }}>{unreadCount} New</span>}
          </h1>
          <p className="text-[13px] mt-1" style={{ color: tc.muted }}>Stay updated with your assigned leads and follow-up activities.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold transition-colors"
            style={{ background: tc.sky, color: tc.blue }}>
            <CheckCheck size={14} /> Mark All as Read
          </button>
        )}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: tc.card, border: `1px solid ${tc.border}` }}>
        {notifs.length === 0 || unreadCount === 0 && notifs.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: tc.sky, color: tc.blue }}>
              <Check size={30} />
            </div>
            <p className="font-extrabold text-[18px] mb-1" style={{ color: tc.text }}>You're all caught up!</p>
            <p className="text-[13px]" style={{ color: tc.muted }}>There are no new notifications at the moment.</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: tc.border }}>
            {notifs.map(n => {
              const Icon = n.icon;
              return (
                <div key={n.id} className="p-4 sm:p-5 flex items-start gap-4 transition-colors hover:bg-[#FAFCFD]" style={{ background: n.read ? "transparent" : "#F4FBFF" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: n.bg }}>
                    <Icon size={18} style={{ color: n.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <p className="text-[13px] font-bold truncate" style={{ color: tc.text }}>{n.type}</p>
                      <p className="text-[11px] font-medium whitespace-nowrap" style={{ color: tc.muted }}>{n.time}</p>
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color: n.read ? tc.muted : tc.text }}>{n.message}</p>
                  </div>
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} className="p-1.5 rounded-lg hover:bg-[#DFF3FF] transition-colors group" title="Mark as Read">
                      <Check size={16} className="text-gray-400 group-hover:text-[#1e7ba8]" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
