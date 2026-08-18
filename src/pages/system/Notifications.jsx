import { useState } from "react";
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  FileText, 
  UserPlus, 
  CreditCard,
  Trash2,
  Check
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    title: "New Loan Application",
    description: "Rohit Kumar has submitted a new Personal Loan application (APP-2025-1250).",
    time: "10 mins ago",
    type: "action",
    icon: <FileText size={18} className="text-blue-500" />,
    bg: "bg-blue-50",
    isRead: false,
  },
  {
    id: 2,
    title: "EMI Payment Overdue",
    description: "Amit Verma has missed the EMI payment for Business Loan (LN-089).",
    time: "2 hours ago",
    type: "alert",
    icon: <AlertCircle size={18} className="text-red-500" />,
    bg: "bg-red-50",
    isRead: false,
  },
  {
    id: 3,
    title: "Loan Approved",
    description: "Application for Priya Sharma (APP-2025-1249) has been approved by the manager.",
    time: "5 hours ago",
    type: "success",
    icon: <CheckCircle2 size={18} className="text-[#489b0d]" />,
    bg: "bg-[#489b0d]/10",
    isRead: true,
  },
  {
    id: 4,
    title: "New Lead Assigned",
    description: "You have been assigned a new lead from Website form.",
    time: "1 day ago",
    type: "info",
    icon: <UserPlus size={18} className="text-purple-500" />,
    bg: "bg-purple-50",
    isRead: true,
  },
  {
    id: 5,
    title: "Disbursement Successful",
    description: "₹12,00,000 has been disbursed to Priya Sharma's account.",
    time: "1 day ago",
    type: "success",
    icon: <CreditCard size={18} className="text-[#489b0d]" />,
    bg: "bg-[#489b0d]/10",
    isRead: true,
  },
  {
    id: 6,
    title: "System Maintenance",
    description: "Scheduled system downtime on Sunday, 25 May from 2:00 AM to 4:00 AM.",
    time: "2 days ago",
    type: "info",
    icon: <Info size={18} className="text-orange-500" />,
    bg: "bg-orange-50",
    isRead: true,
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all"); // 'all', 'unread'

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const toggleReadStatus = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2">
            Notifications 
            {unreadCount > 0 && (
              <span className="bg-[#489b0d] text-white text-[12px] px-2 py-0.5 rounded-md">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-[12px] font-medium text-slate-500">Stay updated with system alerts, loan statuses, and activities</p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors ${filter === "all" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("unread")}
              className={`px-4 py-1.5 rounded-md text-[13px] font-bold transition-colors ${filter === "unread" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Unread
            </button>
          </div>
          
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="h-9 px-4 flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={14} /> Mark all as read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm flex flex-col flex-1 overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-5 flex items-start gap-4 transition-colors hover:bg-slate-50 ${!notif.isRead ? "bg-slate-50/50" : ""}`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${notif.bg}`}>
                  {notif.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-[14px] font-extrabold ${!notif.isRead ? "text-slate-800" : "text-slate-600"}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap ml-4">
                      {notif.time}
                    </span>
                  </div>
                  <p className={`text-[13px] leading-relaxed ${!notif.isRead ? "text-slate-600 font-medium" : "text-slate-500"}`}>
                    {notif.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0 ml-4 opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity">
                  {!notif.isRead ? (
                    <button 
                      onClick={() => toggleReadStatus(notif.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#489b0d] hover:bg-[#489b0d]/10 transition-colors"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  ) : (
                    <div className="w-8 h-8"></div>
                  )}
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Unread Indicator */}
                {!notif.isRead && (
                  <div className="w-2 h-2 rounded-full bg-[#489b0d] mt-2.5 ml-2 shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Bell size={24} className="text-slate-300" />
            </div>
            <h3 className="text-[16px] font-bold text-slate-700 mb-1">No notifications found</h3>
            <p className="text-[13px] font-medium text-slate-500 max-w-sm">
              You're all caught up! There are no new alerts or notifications at this time.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
