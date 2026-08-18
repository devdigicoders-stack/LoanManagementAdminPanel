import React, { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Monitor, 
  User,
  Key,
  Database,
  Save
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("General");

  const tabs = [
    { name: "General", icon: <SettingsIcon size={18} /> },
    { name: "Security", icon: <Shield size={18} /> },
    { name: "Notifications", icon: <Bell size={18} /> },
    { name: "System Preferences", icon: <Monitor size={18} /> },
  ];

  return (
    <div className="w-full h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Settings</h1>
        <p className="text-[12px] font-medium text-slate-500">Manage application configuration and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all font-bold text-[13px] ${
                activeTab === tab.name 
                  ? "bg-[#489b0d] text-white shadow-md shadow-[#489b0d]/20" 
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-[16px] font-extrabold text-slate-800">{activeTab} Settings</h2>
            <p className="text-[12px] font-medium text-slate-500">Update your {activeTab.toLowerCase()} configuration here.</p>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {activeTab === "General" && (
              <div className="max-w-2xl space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">Company Name</label>
                    <input type="text" defaultValue="NextGen Microfinance" className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d]" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">Support Email</label>
                    <input type="email" defaultValue="support@ngm.com" className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-2">Office Address</label>
                  <textarea className="w-full p-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d] focus:ring-1 focus:ring-[#489b0d] resize-none h-24" defaultValue="123 Financial Hub, Sector 15&#10;New Delhi, 110001"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">Timezone</label>
                    <select className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d] bg-white">
                      <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                      <option>(GMT+00:00) UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-2">Currency Format</label>
                    <select className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d] bg-white">
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
                </div>

              </div>
            )}

            {activeTab === "Security" && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="text-[14px] font-extrabold text-slate-800 mb-4 flex items-center gap-2"><Key size={16} className="text-[#489b0d]"/> Password Policy</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" />
                      <span className="text-[13px] font-bold text-slate-700">Require alphanumeric passwords</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" />
                      <span className="text-[13px] font-bold text-slate-700">Require special characters</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#489b0d] focus:ring-[#489b0d]" />
                      <span className="text-[13px] font-bold text-slate-700">Force password change every 90 days</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-[14px] font-extrabold text-slate-800 mb-4 flex items-center gap-2"><User size={16} className="text-blue-500"/> Session Management</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-2">Idle Session Timeout (Minutes)</label>
                      <input type="number" defaultValue="30" className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d]" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-2">Max Login Attempts</label>
                      <input type="number" defaultValue="5" className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="text-[14px] font-extrabold text-slate-800 mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-md border border-slate-100 bg-slate-50/50">
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">New Loan Application</p>
                        <p className="text-[11px] font-medium text-slate-500">Notify when a new loan application is submitted</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" name="toggle" id="toggle1" className="checked:bg-[#489b0d] outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-200 checked:border-[#489b0d] top-0" defaultChecked/>
                        <label htmlFor="toggle1" className="block overflow-hidden h-5 rounded-full bg-slate-200 cursor-pointer"></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-md border border-slate-100 bg-slate-50/50">
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">EMI Collection Delay</p>
                        <p className="text-[11px] font-medium text-slate-500">Notify when EMI collection is overdue by 3 days</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" name="toggle" id="toggle2" className="checked:bg-[#489b0d] outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-200 checked:border-[#489b0d] top-0" defaultChecked/>
                        <label htmlFor="toggle2" className="block overflow-hidden h-5 rounded-full bg-slate-200 cursor-pointer"></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-md border border-slate-100 bg-slate-50/50">
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">System Updates</p>
                        <p className="text-[11px] font-medium text-slate-500">Receive alerts regarding scheduled maintenance</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" name="toggle" id="toggle3" className="checked:bg-[#489b0d] outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-200 checked:border-[#489b0d] top-0" />
                        <label htmlFor="toggle3" className="block overflow-hidden h-5 rounded-full bg-slate-200 cursor-pointer"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "System Preferences" && (
              <div className="max-w-2xl space-y-6">
                 <div>
                  <h3 className="text-[14px] font-extrabold text-slate-800 mb-4 flex items-center gap-2"><Database size={16} className="text-purple-500"/> Data Backup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-2">Automated Backup Frequency</label>
                      <select className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d] bg-white">
                        <option>Daily at 12:00 AM</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-2">Data Retention Policy</label>
                      <select className="w-full h-11 px-4 rounded-md border border-slate-200 text-[13px] font-semibold text-slate-800 focus:outline-none focus:border-[#489b0d] bg-white">
                        <option>5 Years</option>
                        <option>7 Years</option>
                        <option>10 Years</option>
                      </select>
                    </div>
                  </div>
                  <button className="h-10 px-6 rounded-md border border-[#489b0d] text-[#489b0d] font-bold text-[13px] hover:bg-[#489b0d]/5 transition-colors">
                    Trigger Manual Backup
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
            <button className="h-10 px-6 rounded-md border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-white transition-colors">
              Discard Changes
            </button>
            <button className="h-10 px-6 flex items-center gap-2 rounded-md bg-[#489b0d] text-white font-bold text-[13px] hover:bg-[#3e850b] transition-colors shadow-sm">
              <Save size={16} /> Save Configurations
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
