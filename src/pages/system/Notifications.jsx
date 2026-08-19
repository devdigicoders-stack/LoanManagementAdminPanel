import React, { useState } from "react";
import { 
  Bell, CheckCircle2, AlertCircle, Info, FileText, 
  UserPlus, CreditCard, Trash2, Check, Send, Users, 
  Target, Activity, XCircle
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

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
  const [activeTab, setActiveTab] = useState("inbox"); // 'inbox', 'send'
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all"); // 'all', 'unread'
  
  // Send Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targetAudience, setTargetAudience] = useState("all");
  const [priority, setPriority] = useState("info");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read.");
  };

  const toggleReadStatus = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  const deleteNotification = (id) => {
    Swal.fire({
      title: 'Delete Notification?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setNotifications(notifications.filter(n => n.id !== id));
        toast.success("Notification deleted");
      }
    });
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Please fill in both title and message");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate sending
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Inject to local state for demo purposes
      const newNotif = {
        id: Date.now(),
        title: title,
        description: message,
        time: "Just now",
        type: priority,
        icon: priority === 'alert' ? <AlertCircle size={18} className="text-red-500" /> : priority === 'success' ? <CheckCircle2 size={18} className="text-[#489b0d]" /> : <Info size={18} className="text-blue-500" />,
        bg: priority === 'alert' ? "bg-red-50" : priority === 'success' ? "bg-[#489b0d]/10" : "bg-blue-50",
        isRead: false,
      };

      setNotifications([newNotif, ...notifications]);
      
      Swal.fire({
        title: 'Sent!',
        text: 'Notification broadcasted successfully.',
        icon: 'success',
        confirmButtonColor: '#489b0d'
      });
      
      // Reset form
      setTitle("");
      setMessage("");
      setTargetAudience("all");
      setPriority("info");
      setActiveTab("inbox");
    }, 1500);
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2">
            Notification Center
          </h1>
          <p className="text-[12px] font-medium text-slate-500">Manage system alerts and broadcast messages</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[600px] overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab("inbox")}
            className={`flex-1 h-14 flex items-center justify-center gap-2 font-bold text-[13px] transition-colors ${activeTab === 'inbox' ? 'bg-white border-b-2 border-[#489b0d] text-[#489b0d]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <Bell size={16} /> 
            Inbox
            {unreadCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab("send")}
            className={`flex-1 h-14 flex items-center justify-center gap-2 font-bold text-[13px] transition-colors ${activeTab === 'send' ? 'bg-white border-b-2 border-[#489b0d] text-[#489b0d]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <Send size={16} /> Broadcast Message
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'inbox' ? (
            <div className="flex flex-col h-full">
              {/* Inbox Controls */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setFilter("all")}
                    className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-colors ${filter === "all" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    All Alerts
                  </button>
                  <button 
                    onClick={() => setFilter("unread")}
                    className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-colors ${filter === "unread" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Unread
                  </button>
                </div>
                
                <button 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="h-8 px-3 flex items-center justify-center gap-1.5 rounded border border-slate-200 bg-white text-slate-600 font-bold text-[12px] hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={14} /> Mark all read
                </button>
              </div>

              {/* Inbox List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {filteredNotifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-5 flex items-start gap-4 transition-colors hover:bg-slate-50 group ${!notif.isRead ? "bg-slate-50/50" : ""}`}
                      >
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${notif.bg}`}>
                          {notif.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pr-4">
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
                        <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity items-center self-center">
                          {!notif.isRead && (
                            <button 
                              onClick={() => toggleReadStatus(notif.id)}
                              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#489b0d] hover:bg-[#489b0d]/10 transition-colors"
                              title="Mark as read"
                            >
                              <Check size={14} strokeWidth={2.5}/>
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(notif.id)}
                            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} strokeWidth={2.5}/>
                          </button>
                        </div>

                        {/* Unread Indicator */}
                        {!notif.isRead && (
                          <div className="w-2 h-2 rounded-full bg-[#489b0d] mt-2.5 shrink-0 self-start"></div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center h-full">
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
          ) : (
            <div className="flex-1 p-6 md:p-10 flex justify-center bg-slate-50/50">
              <div className="w-full max-w-[600px] bg-white border border-slate-200 p-6 md:p-8 rounded-xl shadow-sm h-fit">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <Send size={18} />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-extrabold text-slate-800">Broadcast Message</h2>
                    <p className="text-[12px] font-medium text-slate-500">Send an instant alert to users or employees.</p>
                  </div>
                </div>

                <form onSubmit={handleSendNotification} className="space-y-6">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">
                      Target Audience
                    </label>
                    <div className="relative">
                      <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select 
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#489b0d] bg-white appearance-none cursor-pointer"
                      >
                        <option value="all">All Users & Employees</option>
                        <option value="employees">All Employees</option>
                        <option value="customers">All Customers</option>
                        <option value="loan_officers">Loan Officers Only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">
                      Notification Type (Priority)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div 
                        onClick={() => setPriority('info')}
                        className={`h-11 flex items-center justify-center gap-2 rounded-lg border-2 cursor-pointer transition-colors ${priority === 'info' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                      >
                        <Info size={14} /> <span className="font-bold text-[12px]">Info</span>
                      </div>
                      <div 
                        onClick={() => setPriority('success')}
                        className={`h-11 flex items-center justify-center gap-2 rounded-lg border-2 cursor-pointer transition-colors ${priority === 'success' ? 'border-[#489b0d] bg-[#489b0d]/10 text-[#489b0d]' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                      >
                        <CheckCircle2 size={14} /> <span className="font-bold text-[12px]">Success</span>
                      </div>
                      <div 
                        onClick={() => setPriority('alert')}
                        className={`h-11 flex items-center justify-center gap-2 rounded-lg border-2 cursor-pointer transition-colors ${priority === 'alert' ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                      >
                        <AlertCircle size={14} /> <span className="font-bold text-[12px]">Alert</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., System Maintenance Scheduled"
                      className="w-full h-11 px-4 rounded-lg border border-slate-200 text-[13px] text-slate-700 focus:outline-none focus:border-[#489b0d] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">
                      Message Content <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows="4"
                      placeholder="Type the detailed notification message here..."
                      className="w-full p-4 rounded-lg border border-slate-200 text-[13px] text-slate-700 focus:outline-none focus:border-[#489b0d] bg-white resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-lg bg-[#489b0d] text-white font-bold text-[14px] hover:bg-[#3e850b] transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Sending Broadcast...</>
                      ) : (
                        <><Send size={16} /> Broadcast Notification</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
