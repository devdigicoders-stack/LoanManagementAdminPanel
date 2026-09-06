import React, { useState } from 'react';
import { Calendar, Clock, Phone, MessageSquare, Mail, MessageCircle, Search, Filter, CheckCircle2 } from 'lucide-react';

const mockFollowUps = [];

export default function FollowUps() {
  const [activeTab, setActiveTab] = useState('Today');

  const getModeIcon = (mode) => {
    switch(mode) {
      case 'Call': return <Phone size={14} className="text-blue-500" />;
      case 'WhatsApp': return <MessageCircle size={14} className="text-emerald-500" />;
      case 'SMS': return <MessageSquare size={14} className="text-gray-500" />;
      case 'Email': return <Mail size={14} className="text-rose-500" />;
      default: return <Phone size={14} className="text-gray-500" />;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Follow-Ups</h1>
          <p className="text-sm text-gray-500 mt-1">Manage scheduled calls, meetings, and communications.</p>
        </div>
        <div className="flex gap-2 bg-gray-200 p-1 rounded-lg">
          {['Overdue', 'Today', 'Upcoming', 'Completed'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by customer, lead ID..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 text-gray-600">
          <option value="">All Executives</option>
          <option value="Rahul S.">Rahul S.</option>
          <option value="Meena K.">Meena K.</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {mockFollowUps.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500">
            <Clock className="mx-auto h-10 w-10 text-gray-300 mb-2" />
            <p className="font-semibold text-gray-700">No follow-ups found</p>
            <p className="text-xs text-gray-400 mt-1">Scheduled follow-up interactions will appear here.</p>
          </div>
        ) : (
          mockFollowUps.map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-4 md:items-center">
              
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
                  task.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-200' :
                  task.status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-200' :
                  'bg-blue-50 text-blue-600 border-blue-200'
                }`}>
                  {task.status === 'Completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{task.customer}</h3>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 rounded">{task.leadId}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1 font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      <Calendar size={14} /> {task.date} at {task.time}
                    </span>
                    <span className="flex items-center gap-1">
                      {getModeIcon(task.mode)} {task.mode}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="font-medium text-gray-500">Exec: <span className="text-gray-700">{task.executive}</span></span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg border border-gray-100 inline-block">
                    "{task.remarks}"
                  </p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-2 shrink-0 self-start md:self-center">
                {task.status !== 'Completed' ? (
                  <>
                    <button 
                      onClick={() => {
                        if(task.mode === 'Call') alert(`Calling ${task.customer} at ${task.time}...`);
                        else if(task.mode === 'WhatsApp') alert(`Opening WhatsApp to message ${task.customer}...`);
                        else alert(`Taking action on ${task.customer}...`);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700"
                    >
                      Action Now
                    </button>
                    <button 
                      onClick={() => alert(`Opening reschedule dialog for ${task.customer}`)}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50"
                    >
                      Reschedule
                    </button>
                    <button 
                      onClick={() => alert(`Marked follow-up for ${task.customer} as completed.`)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-green-50 hover:text-green-700 transition-colors mt-2"
                    >
                      Mark Done
                    </button>
                  </>
                ) : (
                  <span className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-bold">Marked Completed</span>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
