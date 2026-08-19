import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-slate-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#fafbfa] relative">
        {/* Fixed Header */}
        <div className="sticky top-0 z-20 w-full">
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>
        
        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-6">
          <div className="w-full max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
