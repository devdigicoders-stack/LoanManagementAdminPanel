import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Briefcase, 
  FileText, Calendar, CheckCircle2, ShieldAlert,
  Activity, Award, Clock
} from 'lucide-react';

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock employee data
  const employee = {
    id: id || 'EMP-1001',
    name: 'Ravi Kumar',
    department: 'Sales',
    designation: 'Sales Executive',
    status: 'Active',
    joinDate: '15 Jan 2023',
    email: 'ravi.kumar@ngm.com',
    phone: '+91 9876543210',
    manager: 'Anil Desai',
    location: 'Mumbai HQ'
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leave', label: 'Leave', icon: Calendar },
    { id: 'performance', label: 'Performance', icon: Award },
    { id: 'history', label: 'Activity History', icon: ShieldAlert },
  ];

  return (
    <div className="w-full space-y-6 pb-10 bg-[var(--color-brand-page-bg)] min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/employees')}
          className="w-10 h-10 flex items-center justify-center rounded-[12px] border border-[var(--color-brand-border)] bg-white text-[var(--color-brand-text-secondary)] hover:bg-[var(--color-brand-sky-light)] hover:text-[var(--color-brand-blue-dark)] transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)] mb-1">Employee Details</h1>
          <p className="text-[13px] text-[var(--color-brand-text-secondary)] font-medium">Viewing complete profile for {employee.id}</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-[18px] border border-[var(--color-brand-border)] overflow-hidden shadow-sm">
        <div className="h-24 bg-[var(--color-brand-sky-pale)]"></div>
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-10 mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-[var(--color-brand-sky-light)] flex items-center justify-center text-[var(--color-brand-blue-dark)] font-bold text-3xl shadow-sm shrink-0">
              {employee.name.charAt(0)}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-brand-text)] flex items-center gap-2">
                    {employee.name}
                    <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase">
                      {employee.status}
                    </span>
                  </h2>
                  <p className="text-[14px] text-[var(--color-brand-text-secondary)] font-medium mt-1">
                    {employee.designation} • {employee.department}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/employees/${employee.id}/edit`)} className="px-4 py-2 bg-white border border-[var(--color-brand-border)] rounded-[10px] text-[13px] font-bold text-[var(--color-brand-text)] hover:bg-[var(--color-brand-gray-light)] transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--color-brand-border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-gray-light)] flex items-center justify-center text-[var(--color-brand-text-secondary)] shrink-0"><Phone size={16}/></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-brand-text-secondary)] uppercase tracking-wider">Mobile</p>
                <p className="text-[13px] font-bold text-[var(--color-brand-text)]">{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-gray-light)] flex items-center justify-center text-[var(--color-brand-text-secondary)] shrink-0"><Mail size={16}/></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-brand-text-secondary)] uppercase tracking-wider">Email</p>
                <p className="text-[13px] font-bold text-[var(--color-brand-text)]">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-gray-light)] flex items-center justify-center text-[var(--color-brand-text-secondary)] shrink-0"><MapPin size={16}/></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-brand-text-secondary)] uppercase tracking-wider">Location</p>
                <p className="text-[13px] font-bold text-[var(--color-brand-text)]">{employee.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-gray-light)] flex items-center justify-center text-[var(--color-brand-text-secondary)] shrink-0"><Calendar size={16}/></div>
              <div>
                <p className="text-[11px] font-semibold text-[var(--color-brand-text-secondary)] uppercase tracking-wider">Joined On</p>
                <p className="text-[13px] font-bold text-[var(--color-brand-text)]">{employee.joinDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-56 shrink-0 space-y-1.5 bg-white p-3 rounded-[18px] border border-[var(--color-brand-border)] shadow-sm h-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-[13px] font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-[var(--color-brand-sky-light)] text-[var(--color-brand-blue-dark)] shadow-sm border border-[var(--color-brand-border)]' 
                  : 'text-[var(--color-brand-text-secondary)] hover:bg-[var(--color-brand-gray-light)] hover:text-[var(--color-brand-text)]'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-[var(--color-brand-blue-dark)]' : ''} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-[18px] border border-[var(--color-brand-border)] shadow-sm overflow-hidden min-h-[400px]">
          <div className="p-5 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-sky-pale)]">
            <h2 className="text-[16px] font-bold text-[var(--color-brand-text)] capitalize">
              {tabs.find(t => t.id === activeTab)?.label} Details
            </h2>
          </div>
          
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[var(--color-brand-page-bg)] p-5 rounded-[14px] border border-[var(--color-brand-border)]">
                    <h3 className="text-[14px] font-bold text-[var(--color-brand-text)] mb-4 flex items-center gap-2"><Briefcase size={16} className="text-[var(--color-brand-blue-dark)]"/> Professional Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Employee ID</span><span className="text-[13px] font-bold">{employee.id}</span></div>
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Department</span><span className="text-[13px] font-bold">{employee.department}</span></div>
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Designation</span><span className="text-[13px] font-bold">{employee.designation}</span></div>
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Reporting Manager</span><span className="text-[13px] font-bold">{employee.manager}</span></div>
                    </div>
                  </div>
                  
                  <div className="bg-[var(--color-brand-page-bg)] p-5 rounded-[14px] border border-[var(--color-brand-border)]">
                    <h3 className="text-[14px] font-bold text-[var(--color-brand-text)] mb-4 flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600"/> Quick Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Attendance (This Month)</span><span className="text-[13px] font-bold text-emerald-600">96%</span></div>
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Leaves Available</span><span className="text-[13px] font-bold text-amber-600">12 Days</span></div>
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Pending Documents</span><span className="text-[13px] font-bold text-red-600">0</span></div>
                      <div className="flex justify-between"><span className="text-[12px] text-[var(--color-brand-text-secondary)]">Last Performance</span><span className="text-[13px] font-bold">Excellent</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[14px] font-bold text-[var(--color-brand-text)]">Uploaded Documents</h3>
                  <button className="text-[12px] font-bold text-white bg-[var(--color-brand-blue-primary)] px-4 py-2 rounded-lg hover:bg-[var(--color-brand-blue-dark)] transition-colors">
                    Upload New Document
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Aadhaar Card', category: 'Identity Proof', status: 'Verified', date: '2023-01-15' },
                    { name: 'PAN Card', category: 'Identity Proof', status: 'Verified', date: '2023-01-15' },
                    { name: 'Degree Certificate', category: 'Educational Documents', status: 'Pending', date: '2023-01-16' },
                    { name: 'Previous Experience Letter', category: 'Experience Documents', status: 'Rejected', date: '2023-01-16' },
                    { name: 'Electricity Bill', category: 'Address Proof', status: 'Re-upload Required', date: '2023-01-17' },
                  ].map((doc, idx) => (
                    <div key={idx} className="bg-[var(--color-brand-page-bg)] p-4 rounded-[14px] border border-[var(--color-brand-border)] flex items-start gap-4">
                      <div className="w-10 h-10 rounded-[10px] bg-white border border-[var(--color-brand-border)] flex items-center justify-center shrink-0 text-[var(--color-brand-blue-dark)]">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-[13px] font-bold text-[var(--color-brand-text)]">{doc.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' :
                            doc.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                            doc.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--color-brand-text-secondary)] font-medium mb-3">{doc.category} • Uploaded {doc.date}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-auto">
                          <button className="text-[11px] font-bold text-[var(--color-brand-blue-dark)] hover:underline">View</button>
                          <span className="text-slate-300">•</span>
                          <button className="text-[11px] font-bold text-[var(--color-brand-text-secondary)] hover:text-[var(--color-brand-text)] transition-colors">Download</button>
                          
                          {(doc.status === 'Pending' || doc.status === 'Re-upload Required') && (
                            <>
                              <span className="text-slate-300">•</span>
                              <button className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Verify</button>
                              <span className="text-slate-300">•</span>
                              <button className="text-[11px] font-bold text-red-600 hover:text-red-700 transition-colors">Reject</button>
                            </>
                          )}
                          
                          {doc.status === 'Rejected' && (
                            <>
                              <span className="text-slate-300">•</span>
                              <button className="text-[11px] font-bold text-amber-600 hover:text-amber-700 transition-colors">Request Re-upload</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab !== 'overview' && activeTab !== 'documents' && (
              <div className="flex flex-col items-center justify-center py-16 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-[var(--color-brand-sky-light)] flex items-center justify-center mb-4 text-[var(--color-brand-blue-dark)]">
                  <Activity size={24} />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-brand-text)]">Information Available</h3>
                <p className="text-[13px] text-[var(--color-brand-text-secondary)] mt-1">Detailed {activeTab} information would be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
