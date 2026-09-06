import React, { useState } from 'react';
import { Bell, CheckCircle2, Trash2, X, Check } from 'lucide-react';

const mockNotifications = [];


export default function OperationNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead   = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearAll   = () => setNotifications([]);
  const dismiss    = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <div className="w-full bg-[#FAFCFD] min-h-screen p-4 space-y-6 pb-12">

      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-[24px] p-8 border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#DFF3FF] to-[#FFF8E7] rounded-full blur-3xl opacity-70 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-[#344054] tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-3 py-1 text-[12px] font-black rounded-full bg-[#DFF3FF] text-[#0369A1] border border-[#BFE7F7]">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-[15px] text-[#667085] font-medium mt-2">Stay updated with application and operational activities.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#344054] border border-[#D9EAF2] rounded-xl font-bold text-[13px] hover:bg-[#F0FAFF] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={16} className="text-[#059669]" /> Mark All as Read
            </button>
            <button
              onClick={clearAll}
              disabled={notifications.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] rounded-xl font-bold text-[13px] hover:bg-[#FECACA] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} /> Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-[#D9EAF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-16 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-[#DFF3FF] rounded-full flex items-center justify-center mb-6 border-4 border-[#BFE7F7]">
            <Bell size={40} className="text-[#0284C7]" />
          </div>
          <h3 className="text-2xl font-black text-[#344054]">You're all caught up!</h3>
          <p className="text-[15px] text-[#667085] mt-2">There are no new notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-[20px] border shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all p-5
                ${n.read ? 'border-[#D9EAF2]' : 'border-[#BFE7F7] ring-1 ring-[#DFF3FF]'}`}
            >
              <div className="flex items-start gap-4">

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl border ${n.read ? 'bg-[#FAFCFD] border-[#D9EAF2]' : 'bg-[#DFF3FF] border-[#BFE7F7]'}`}>
                  {n.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className={`text-[15px] font-extrabold leading-tight ${n.read ? 'text-[#667085]' : 'text-[#344054]'}`}>
                      {!n.read && <span className="inline-block w-2 h-2 rounded-full bg-[#0284C7] mr-2 mb-0.5 align-middle"></span>}
                      {n.title}
                    </h4>
                    <span className="text-[11px] font-bold text-[#94A3B8] shrink-0">{n.time}</span>
                  </div>
                  <p className={`text-[13px] leading-relaxed ${n.read ? 'text-[#94A3B8]' : 'text-[#667085]'}`}>{n.desc}</p>
                </div>

              </div>

              {/* Action row — always visible */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[#F0FAFF]">
                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg hover:bg-[#D1FAE5] transition-all"
                  >
                    <Check size={13} /> Mark as Read
                  </button>
                )}
                <button
                  onClick={() => dismiss(n.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] rounded-lg hover:bg-[#FEE2E2] transition-all"
                >
                  <X size={13} /> Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
