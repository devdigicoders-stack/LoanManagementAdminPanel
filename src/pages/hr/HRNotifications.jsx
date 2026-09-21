import React, { useState, useEffect } from "react";
import { 
  Bell, CheckCircle2, AlertCircle, Info, FileText, 
  Calendar, Award, Trash2, Check, Send, Users, ShieldCheck, MapPin, RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function HRNotifications() {
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || localStorage.getItem('admin') || '{}');
    } catch {
      return {};
    }
  })();

  const userRole = (currentUser.role || '').toLowerCase();
  const cleanRole = userRole.replace(/[^a-z0-9]/g, '');
  const isMasterAdmin = ['superadmin', 'admin', 'administrator'].includes(cleanRole);
  const isHrHead = cleanRole.includes('hrhead') || cleanRole.includes('hradmin') || cleanRole === 'hr';
  const isHrExecutive = !isMasterAdmin && !isHrHead && cleanRole.includes('executive');
  const isHrManager = !isMasterAdmin && !isHrHead && !isHrExecutive && cleanRole.includes('manager');
  const userZone = currentUser.zone || 'NORTH';

  const [activeTab, setActiveTab] = useState("inbox"); // 'inbox', 'send'
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'unread'
  const [isLoading, setIsLoading] = useState(false);
  
  // Send Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targetAudience, setTargetAudience] = useState(
    isHrExecutive 
      ? `zone_applicants_${userZone}` 
      : isHrManager 
        ? `zone_all_${userZone}` 
        : 'all'
  );
  const [priority, setPriority] = useState("info");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const formatted = Array.isArray(data) ? data.map(item => ({
          id: item._id || item.id,
          title: item.title,
          description: item.detail || item.message || item.description || '',
          time: new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          type: item.type || 'info',
          icon: item.type === 'alert' ? <AlertCircle size={18} className="text-red-500" /> : item.type === 'success' ? <CheckCircle2 size={18} className="text-[#489b0d]" /> : <Info size={18} className="text-blue-500" />,
          bg: item.type === 'alert' ? "bg-red-50" : item.type === 'success' ? "bg-[#489b0d]/10" : "bg-blue-50",
          isRead: !!item.isRead,
          targetAudience: item.targetAudience || 'All'
        })) : [];
        setNotifications(formatted);
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read.");
  };

  const toggleReadStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {}
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch (e) {}
        setNotifications(notifications.filter(n => n.id !== id));
        toast.success("Notification deleted");
      }
    });
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Please fill in both title and message");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          message,
          type: priority,
          targetAudience,
          zone: userZone
        })
      });

      const newNotif = {
        id: Date.now().toString(),
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
      
      setTitle("");
      setMessage("");
      setPriority("info");
      setActiveTab("inbox");
    } catch (err) {
      toast.error("Failed to broadcast notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10 bg-[var(--color-brand-page-bg)] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--color-brand-text)] mb-1 flex items-center gap-2">
              HR Notifications & Announcements
            </h1>
            {isHrExecutive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <MapPin size={12} /> Zone: {userZone} (Executive)
              </span>
            ) : isHrManager ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                <MapPin size={12} /> Zone Manager: {userZone}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck size={12} /> Head / Central Admin
              </span>
            )}
          </div>
          <p className="text-[13px] font-medium text-[var(--color-brand-text-secondary)]">
            {isHrExecutive 
              ? `View announcements from HR Head / Manager & send updates to ${userZone} zone applicants.`
              : "Manage HR alerts, requests, and broadcast messages to teams across zones."}
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          disabled={isLoading}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[16px] border border-[var(--color-brand-border)] shadow-sm flex flex-col min-h-[600px] overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-[var(--color-brand-border)] bg-[var(--color-brand-gray-light)]/50">
          <button 
            onClick={() => setActiveTab("inbox")}
            className={`flex-1 h-14 flex items-center justify-center gap-2 font-bold text-[13px] transition-colors ${activeTab === 'inbox' ? 'bg-white border-b-2 border-[#489b0d] text-[#489b0d]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <Bell size={16} /> 
            Inbox (Senior & System Alerts)
            {unreadCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab("send")}
            className={`flex-1 h-14 flex items-center justify-center gap-2 font-bold text-[13px] transition-colors ${activeTab === 'send' ? 'bg-white border-b-2 border-[#489b0d] text-[#489b0d]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
          >
            <Send size={16} /> Broadcast Announcement
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'inbox' ? (
            <div className="flex flex-col h-full">
              {/* Inbox Controls */}
              <div className="p-4 border-b border-[var(--color-brand-border)] flex justify-between items-center bg-white">
                <div className="flex bg-[var(--color-brand-sky-light)]/50 p-1 rounded-[10px] border border-[var(--color-brand-border)]">
                  <button 
                    onClick={() => setFilter("all")}
                    className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-colors ${filter === "all" ? "bg-white text-[var(--color-brand-blue-dark)] shadow-sm border border-[var(--color-brand-border)]" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    All Alerts
                  </button>
                  <button 
                    onClick={() => setFilter("unread")}
                    className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-colors ${filter === "unread" ? "bg-white text-[var(--color-brand-blue-dark)] shadow-sm border border-[var(--color-brand-border)]" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Unread
                  </button>
                </div>
                
                <button 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="h-8 px-3 flex items-center justify-center gap-1.5 rounded-[8px] border border-[var(--color-brand-border)] bg-white text-[var(--color-brand-text)] font-bold text-[12px] hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Check size={14} /> Mark all read
                </button>
              </div>

              {/* Inbox List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length > 0 ? (
                  <div className="divide-y divide-[var(--color-brand-border)]">
                    {filteredNotifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-5 flex items-start gap-4 transition-colors hover:bg-slate-50 group ${!notif.isRead ? "bg-[var(--color-brand-sky-light)]/30" : ""}`}
                      >
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 mt-1 ${notif.bg}`}>
                          {notif.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pr-4">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-[14px] font-extrabold ${!notif.isRead ? "text-[var(--color-brand-text)]" : "text-[var(--color-brand-text-secondary)]"}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap ml-4">
                              {notif.time}
                            </span>
                          </div>
                          <p className={`text-[13px] leading-relaxed ${!notif.isRead ? "text-[var(--color-brand-text-secondary)] font-medium" : "text-slate-500"}`}>
                            {notif.description}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity items-center self-center">
                          {!notif.isRead && (
                            <button 
                              onClick={() => toggleReadStatus(notif.id)}
                              className="w-8 h-8 rounded-full border border-[var(--color-brand-border)] bg-white flex items-center justify-center text-[#489b0d] hover:bg-[#489b0d]/10 hover:border-[#489b0d]/30 transition-colors shadow-sm"
                              title="Mark as read"
                            >
                              <Check size={14} strokeWidth={2.5}/>
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(notif.id)}
                            className="w-8 h-8 rounded-full border border-[var(--color-brand-border)] bg-white flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
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
                    <div className="w-16 h-16 bg-[var(--color-brand-sky-light)] rounded-full flex items-center justify-center mb-4 text-[var(--color-brand-blue-dark)]">
                      <Bell size={24} />
                    </div>
                    <h3 className="text-[16px] font-bold text-[var(--color-brand-text)] mb-1">No HR notifications</h3>
                    <p className="text-[13px] font-medium text-[var(--color-brand-text-secondary)] max-w-sm">
                      You're all caught up! There are no new alerts or broadcast announcements at this time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 p-6 md:p-10 flex justify-center bg-[var(--color-brand-gray-light)]/30">
              <div className="w-full max-w-[600px] bg-white border border-[var(--color-brand-border)] p-6 md:p-8 rounded-[16px] shadow-sm h-fit">
                <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-brand-border)] pb-4">
                  <div className="w-10 h-10 rounded-[12px] bg-[var(--color-brand-sky-light)] flex items-center justify-center text-[var(--color-brand-blue-dark)]">
                    <Send size={18} />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-extrabold text-[var(--color-brand-text)]">
                      {isHrExecutive 
                        ? `Send Announcement (${userZone} Zone)`
                        : "Broadcast HR Message"}
                    </h2>
                    <p className="text-[12px] font-medium text-[var(--color-brand-text-secondary)]">
                      {isHrExecutive 
                        ? `Send alerts & updates to ${userZone} zone job applicants and hired staff.`
                        : "Send announcements, policy updates, or alerts to employees."}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSendNotification} className="space-y-6">
                  <div>
                    <label className="block text-[12px] font-bold text-[var(--color-brand-text)] mb-2">
                      Target Audience
                    </label>
                    <div className="relative">
                      <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select 
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-[10px] border border-[var(--color-brand-border)] text-[13px] font-semibold text-[var(--color-brand-text)] focus:outline-none focus:border-[#489b0d] bg-white appearance-none cursor-pointer"
                      >
                        {isHrExecutive ? (
                          <>
                            <option value={`zone_applicants_${userZone}`}>Zone Applicants & Candidates ({userZone})</option>
                            <option value={`zone_staff_${userZone}`}>Zone Field / Telecalling Staff ({userZone})</option>
                            <option value={`zone_hired_${userZone}`}>Zone Hired Employees ({userZone})</option>
                          </>
                        ) : isHrManager ? (
                          <>
                            <option value={`zone_all_${userZone}`}>All Staff & Applicants in Zone ({userZone})</option>
                            <option value={`zone_executives_${userZone}`}>HR Executives in Zone ({userZone})</option>
                            <option value={`zone_sales_${userZone}`}>Sales Team ({userZone})</option>
                            <option value={`zone_ops_${userZone}`}>Operations Team ({userZone})</option>
                          </>
                        ) : (
                          <>
                            <option value="all">All Employees (Pan-India)</option>
                            <option value="hr_managers">All HR Managers</option>
                            <option value="hr_executives">All HR Executives</option>
                            <option value="sales">Sales Team</option>
                            <option value="ops">Operations Team</option>
                            <option value="credit">Credit Team</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[var(--color-brand-text)] mb-2">
                      Notification Type (Priority)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div 
                        onClick={() => setPriority('info')}
                        className={`h-11 flex items-center justify-center gap-2 rounded-[10px] border-2 cursor-pointer transition-colors ${priority === 'info' ? 'border-[var(--color-brand-blue-dark)] bg-[var(--color-brand-sky-light)] text-[var(--color-brand-blue-dark)]' : 'border-[var(--color-brand-border)] text-[var(--color-brand-text-secondary)] hover:border-slate-300'}`}
                      >
                        <Info size={14} /> <span className="font-bold text-[12px]">Info</span>
                      </div>
                      <div 
                        onClick={() => setPriority('success')}
                        className={`h-11 flex items-center justify-center gap-2 rounded-[10px] border-2 cursor-pointer transition-colors ${priority === 'success' ? 'border-[#489b0d] bg-[#489b0d]/10 text-[#489b0d]' : 'border-[var(--color-brand-border)] text-[var(--color-brand-text-secondary)] hover:border-slate-300'}`}
                      >
                        <CheckCircle2 size={14} /> <span className="font-bold text-[12px]">Success</span>
                      </div>
                      <div 
                        onClick={() => setPriority('alert')}
                        className={`h-11 flex items-center justify-center gap-2 rounded-[10px] border-2 cursor-pointer transition-colors ${priority === 'alert' ? 'border-red-500 bg-red-50 text-red-600' : 'border-[var(--color-brand-border)] text-[var(--color-brand-text-secondary)] hover:border-slate-300'}`}
                      >
                        <AlertCircle size={14} /> <span className="font-bold text-[12px]">Alert</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[var(--color-brand-text)] mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={isHrExecutive ? `e.g., Interview Scheduled / Onboarding Update (${userZone})` : "e.g., Holiday Schedule / Policy Update"}
                      className="w-full h-11 px-4 rounded-[10px] border border-[var(--color-brand-border)] text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[#489b0d] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[var(--color-brand-text)] mb-2">
                      Message Content <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows="4"
                      placeholder="Type the detailed notification message here..."
                      className="w-full p-4 rounded-[10px] border border-[var(--color-brand-border)] text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[#489b0d] bg-white resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-[10px] bg-[#489b0d] text-white font-bold text-[14px] hover:bg-[#3e850b] transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
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
