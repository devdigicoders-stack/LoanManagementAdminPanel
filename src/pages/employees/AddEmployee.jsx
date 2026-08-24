import { useState } from 'react';
import { ArrowLeft, Upload, User, MapPin, Briefcase, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function AddEmployee() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');

  const handleSave = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Save Employee?',
      text: 'Are you sure you want to add this employee to the system?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8ED3F4',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Save Employee'
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success('Employee created successfully.');
        navigate('/employees');
      }
    });
  };

  return (
    <div className="w-full space-y-6 pb-10 bg-[var(--color-brand-page-bg)] min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/employees')}
            className="w-10 h-10 flex items-center justify-center rounded-[12px] border border-[var(--color-brand-border)] bg-white text-[var(--color-brand-text-secondary)] hover:bg-[var(--color-brand-sky-light)] hover:text-[var(--color-brand-blue-dark)] transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-brand-text)] mb-1">Add New Employee</h1>
            <p className="text-[13px] text-[var(--color-brand-text-secondary)] font-medium">Create a new employee profile in the system</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0 space-y-2 bg-white p-3 rounded-[18px] border border-[var(--color-brand-border)] shadow-sm h-fit">
          {[
            { id: 'personal', label: 'Personal Information', icon: User },
            { id: 'address', label: 'Address Details', icon: MapPin },
            { id: 'professional', label: 'Professional Info', icon: Briefcase },
            { id: 'login', label: 'Login Information', icon: Lock },
            { id: 'documents', label: 'Documents', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-[13px] font-bold transition-all ${
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

        {/* Main Form Content */}
        <div className="flex-1 bg-white rounded-[18px] border border-[var(--color-brand-border)] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[var(--color-brand-border)] bg-[var(--color-brand-sky-pale)]">
            <h2 className="text-[18px] font-bold text-[var(--color-brand-text)] capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
          </div>
          
          <form onSubmit={handleSave} className="p-6 space-y-6">
            
            {activeTab === 'personal' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Photo Upload */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-[var(--color-brand-sky-light)] flex items-center justify-center border-2 border-dashed border-[var(--color-brand-blue-primary)] shrink-0 overflow-hidden group relative cursor-pointer">
                    <User size={32} className="text-[var(--color-brand-blue-dark)]" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload size={20} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[var(--color-brand-text)] mb-1">Profile Photo</h4>
                    <p className="text-[12px] text-[var(--color-brand-text-secondary)] mb-3">Upload a professional, recent photograph.</p>
                    <button type="button" className="px-4 py-1.5 text-[12px] font-semibold bg-[var(--color-brand-cream)] text-amber-700 rounded-md hover:opacity-80 transition-opacity">
                      Browse Image
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[var(--color-brand-text)]">First Name *</label>
                    <input required type="text" className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2.5 px-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[var(--color-brand-text)]">Middle Name</label>
                    <input type="text" className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2.5 px-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[var(--color-brand-text)]">Last Name *</label>
                    <input required type="text" className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2.5 px-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[var(--color-brand-text)]">Gender *</label>
                    <select required className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2.5 px-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)]">
                      <option value="">Select Gender</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[var(--color-brand-text)]">Date of Birth *</label>
                    <input required type="date" className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2.5 px-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[var(--color-brand-text)]">Mobile Number *</label>
                    <input required type="tel" className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2.5 px-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)]" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'professional' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[var(--color-brand-text)]">Employee ID *</label>
                    <input required type="text" defaultValue="EMP-1005" className="w-full bg-[var(--color-brand-gray-light)] border border-[var(--color-brand-border)] rounded-[10px] py-2.5 px-4 text-[13px] text-[var(--color-brand-text-secondary)] font-bold focus:outline-none cursor-not-allowed" readOnly />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[var(--color-brand-text)]">Department *</label>
                    <select required className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2.5 px-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)]">
                      <option value="">Select Department</option>
                      <option>Sales</option><option>HR</option><option>Operations</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[var(--color-brand-text)]">Designation *</label>
                    <input required type="text" className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2.5 px-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[var(--color-brand-text)]">Joining Date *</label>
                    <input required type="date" className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2.5 px-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)]" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'login' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[var(--color-brand-text)]">Login Email *</label>
                    <input required type="email" className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2.5 px-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[var(--color-brand-text)]">Temporary Password *</label>
                    <input required type="password" placeholder="Min 8 chars, 1 uppercase, 1 special char" className="w-full bg-white border border-[var(--color-brand-border)] rounded-[10px] py-2.5 px-4 text-[13px] text-[var(--color-brand-text)] focus:outline-none focus:border-[var(--color-brand-blue-dark)]" />
                  </div>
                </div>
              </div>
            )}

            {/* Placeholders for other tabs for brevity */}
            {(activeTab === 'address' || activeTab === 'documents') && (
              <div className="py-10 text-center animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-[var(--color-brand-sky-light)] flex items-center justify-center mx-auto mb-3 text-[var(--color-brand-blue-dark)]">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-brand-text)] mb-2">Ready for Input</h3>
                <p className="text-[13px] text-[var(--color-brand-text-secondary)]">Please fill in the {activeTab} information required for this profile.</p>
              </div>
            )}

            <div className="pt-6 border-t border-[var(--color-brand-border)] flex items-center justify-end gap-3">
              <button 
                type="button"
                onClick={() => navigate('/employees')}
                className="px-6 py-2.5 rounded-[10px] text-[13px] font-bold text-[var(--color-brand-text-secondary)] bg-[var(--color-brand-gray-light)] hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 rounded-[10px] text-[13px] font-bold text-[var(--color-brand-blue-dark)] bg-[var(--color-brand-sky-light)] border border-[var(--color-brand-border)] hover:opacity-80 transition-opacity shadow-sm"
              >
                Save & Add Another
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 rounded-[10px] text-[13px] font-bold text-white bg-[var(--color-brand-blue-primary)] hover:bg-[var(--color-brand-blue-dark)] transition-colors shadow-sm"
              >
                Save Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
