import React, { useState, useEffect, useRef } from 'react';
import { Users, Briefcase, Plus, CheckCircle2, ChevronRight, Search, FileText, X, Eye, MapPin, Building, Calendar, Edit2, Trash2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// ── Static data for job form dropdowns ─────────────────────────────────────
const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'];

const DEPARTMENTS = [
  'OPERATIONAL', 'FIELD-SALES', 'BRANCH SALES', 'COLLECTIONS', 'OFFICIAL WORK'
];

const LOCATION_DATA = {
  'ANDHRA PRADESH': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore'],
  'ASSAM': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
  'BIHAR': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
  'CHANDIGARH': ['Chandigarh'],
  'CHHATTISGARH': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba'],
  'DELHI-NCR': ['New Delhi', 'Gurugram', 'Noida', 'Faridabad', 'Ghaziabad'],
  'GOA': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'],
  'GUJARAT': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'HARYANA': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala'],
  'JHARKHAND': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
  'KARNATAKA': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru'],
  'MADHYA PRADESH': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior'],
  'MAHARASHTRA': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'ORISSA': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur'],
  'PUNJAB': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  'RAJASTHAN': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  'TAMIL NADU': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
  'TELANGANA': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'UTTAR PRADESH': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi'],
  'UTTARAKHAND': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani'],
  'WEST BENGAL': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur']
};

// Flatten all cities for location dropdown
const ALL_LOCATIONS = Object.entries(LOCATION_DATA).flatMap(
  ([state, cities]) => cities.map(city => `${city}, ${state}`)
);

// ── Searchable single-select dropdown ──────────────────────────────────────
const SearchableSelect = ({ label, value, onChange, options, placeholder, required }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-bold text-gray-700 mb-1">{label}{required && ' *'}</label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-300 rounded p-2 text-sm bg-white focus:ring-1 focus:ring-blue-500 text-left"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || placeholder}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-56 flex flex-col">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-xs text-gray-400 text-center">No results</div>
            ) : filtered.map((opt, i) => (
              <div
                key={i}
                onClick={() => handleSelect(opt)}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors ${
                  value === opt ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-800'
                }`}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DEFAULT_JOB_DESC = `Join our rapidly growing team and shape the future of financial services.

About the Role:
As a HAUS NUO-Pay Offer – Liability, You will be Responsible for Acquiring and Managing Customer Relationships, Driving Financial Growth, and Ensuring High-quality Service Delivery. You will Work Closely with Branch Teams, Customers, and Internal Stakeholders to Meet Business Targets and Enhance Customer Satisfaction.

What you will do:
- Build and Manage a Portfolio of Retail Customers for Loans, Insurance, and Investment Products
- Drive Financial Acquisition and Achieve Assigned Business Targets
- Provide Personalized Financial Solutions Based on Customer Needs
- Maintain Strong Relationships with Customers and Act as the First Point of Contact for Queries
- Collaborate with Nearest Branch and Product Teams to Ensure Smooth Onboarding and Service Delivery
- Ensure Compliance with Regulatory Guidelines, Internal Policies, and Operational Standards
- Prepare Reports and MIS on Portfolio Growth, Customer Engagement, and Target Achievement

What You will Need:
- Bachelor’s Degree in any Discipline; Relevant Certifications in Banking/Finance are a Plus
- 2–5 Years of Experience in Retail Banking and Financial, Liability Sales, or Relationship Management
- Strong Interpersonal, Communication, and Customer Engagement Skills
- Knowledge of Deposit Products, Financial Operations, and Regulatory Guidelines
- Target-Oriented Mindset with Ability to Drive Results Independently
- Ability to Multitask, Solve Problems, and Work in a Fast-Paced Environment
- Proficiency in MS Office and Financial Systems

Additional Role Responsibilities:
- Good Communication in Hindi,English Purely sales guy in finance sector
- Understand the entire Loan process journey Field Visit Mandatory
- Good Negotiation skills Basic knowledge of Excel
- Primary & Key Responsibility is to Negotiate the Terms & Conditions of the Loan Details Shared with the Customers (ROI, Charges etc)
- Outbound Calling of About 200 -250 Calls Per Day to the Interested Customers
- To Ensure Conversion of the Loan Applications at the Highest Rates Possible.
- Ensure Loans are Processed as Per Established Company Procedures and Policies
- Process, Close, Present, Service and Record Loan Related Notes and Disbursements etc.
- Explaining Product Benefits to Customer and Informed Him in Detail All Benefits and Convince for Loan Processing.

Life at NUO-Pay:
Life So Good, you’d think We’re Kidding:
- Competitive Salaries. Period.
- An Extensive Medical Insurance that Looks Out for Our Employees & Their Dependents. We’ll Love You and Take Care of You, Our Promise.
- Flexible Working Hours. Just Don’t Call Us at 03:00 AM, We Like Our Sleep Schedule.
- Tailored Vacation & Leave Policies So that You Enjoy Every Important Moment in Your Life.
- A Reward System that Celebrates Hard Work and Milestones Throughout the Year. Expect a Gift Coming Your Way Anytime You Kill it Here.
- Learning and Upskilling Opportunities. Seriously, Not Kidding.
- Good Food, Games, and a Cool Office to Make You Feel Like Home. An Environment So Good, You’ll Forget the Term “Colleagues Can’t be Your Friends”.
- We Believe in Equality. Period.

At HAUS NUO-Pay, We are Committed to Building a Diverse and Talented Workforce. We Never Discriminate on the Basis of Race, Sex, Religion, Colour, National Origin, Gender, Gender Identity, Sexual Orientation, Age, Marital Status, Veteran Status, Medical Condition, Disability, or Any Other Class or Characteristic Protected by the Applicable law.
We Consider All Qualified Job-Seekers with Criminal Histories in a Manner Consistent with the Applicable Law. Additionally, We are Committed to Providing Reasonable Accommodations to Qualified Individuals with Physical or Mental Disabilities in Order to Participate in the Job Application or Interview Process, Perform Essential Job Functions, and Receive other Benefits and Privileges of Employment.

Come Join Our Crew!
About NUO-Pay: https://slice.bank.in/
HAUS NUO-Pay - A New Financial for a New India
HAUS NUO-Pay’s Purpose is to Make the World Better at Using Money and Time, with a Major Focus on Building the Best Consumer Experience for Your Money. We’ve All Felt How Slow, Confusing, and Complicated Financial Services Can be. So, We’re Reimagining it. We’re Building Every Product from Scratch to be Fast, Transparent, and Feel Good, Because We Believe that the Best Products Transcend Demographics, Like How Great Music Touches Most of Us.
Our Cornerstone Products and Services: HAUS NUO-Pay Loans, Insurance, Investment, and Grow Your Business are Designed to be Simple, Rewarding, and Completely in Your Control. At HAUS NUO-Pay, you’ll get to Build things You’d Use Yourself and Shape the Future of Financial Services in India. We Tailor Our Working Experience with the Belief that the Present Moment is the Only Real thing in Life. And We have Harmony in the Present the Most when We feel Happy and Successful Together.
We’re Backed by Some of the World’s Leading Investors, Including Tiger Global and Insight Partners.`;

export default function Recruitment() {
  const [activeTab, setActiveTab] = useState('applications');
  
  // Data states
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  
  // Modals
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  const [showAppModal, setShowAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // App Edit Form
  const [isEditingApp, setIsEditingApp] = useState(false);
  const [editAppForm, setEditAppForm] = useState({});
  
  // Job Form
  const [jobForm, setJobForm] = useState({
    title: '', type: 'Full Time', department: 'OPERATIONAL', location: 'Bengaluru, Karnataka', description: DEFAULT_JOB_DESC, status: 'Open', openings: 1, skills: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/recruitment/jobs');
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load jobs');
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/recruitment/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load applications');
    }
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingJob 
        ? `http://localhost:5000/api/recruitment/jobs/${editingJob._id}`
        : 'http://localhost:5000/api/recruitment/jobs';
      
      const method = editingJob ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobForm)
      });
      
      if (res.ok) {
        toast.success(editingJob ? 'Job updated' : 'Job created');
        setShowJobModal(false);
        fetchJobs();
      } else {
        toast.error('Failed to save job');
      }
    } catch (err) {
      toast.error('Error saving job');
    }
  };

  const handleDeleteJob = (id) => {
    Swal.fire({
      title: 'Delete Job?',
      text: "This will remove the job posting. Applications will still exist.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:5000/api/recruitment/jobs/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            toast.success('Job deleted');
            fetchJobs();
          }
        } catch (err) {
          toast.error('Failed to delete job');
        }
      }
    });
  };

  const handleUpdateAppStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/recruitment/applications/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success('Status updated');
        fetchApplications();
        if (selectedApp && selectedApp._id === id) {
          setSelectedApp({...selectedApp, status: newStatus});
        }
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleSaveAppEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/recruitment/applications/${selectedApp._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editAppForm)
      });
      if (res.ok) {
        toast.success('Application profile updated');
        fetchApplications();
        setSelectedApp(editAppForm);
        setIsEditingApp(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      toast.error('Error updating profile');
    }
  };

  const openNewJob = () => {
    setEditingJob(null);
    setJobForm({
      title: 'HAUS NUO-Pay Offer- Liability', 
      type: 'Full Time', 
      department: 'OPERATIONAL', 
      location: 'Bengaluru, Karnataka', 
      description: DEFAULT_JOB_DESC, 
      status: 'Open',
      openings: 1,
      skills: ''
    });
    setShowJobModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment & Hiring</h1>
          <p className="text-sm text-gray-500 mt-1">Manage job postings, candidates, interviews, and offer letters.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={openNewJob}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700"
          >
            <Plus size={16} /> Post New Job
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Active Jobs</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">{jobs.filter(j=>j.status==='Open').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Users size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Total Applications</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">{applications.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><Search size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Shortlisted</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">{applications.filter(a=>a.status==='Shortlisted').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 size={24} /></div>
          <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Hired</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">{applications.filter(a=>a.status==='Hired').length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('applications')}
          className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'applications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Job Applications
        </button>
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Manage Jobs
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
        
        {activeTab === 'applications' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Candidate</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Applied For</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {applications.map(app => (
                  <tr key={app._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-4">
                       <span className="font-bold text-gray-900 block">{app.name}</span>
                       <span className="text-xs text-gray-500">Exp: {app.expectedSalary || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-600">{app.jobId?.title || 'Unknown Job'}</td>
                    <td className="py-3 px-4">
                      <div className="text-xs text-gray-700">{app.email}</div>
                      <div className="text-xs text-gray-500">{app.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                        app.status === 'Hired' ? 'bg-green-100 text-green-700' :
                        app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right flex justify-end gap-2">
                       <button onClick={() => { setSelectedApp(app); setShowAppModal(true); }} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-xs font-bold hover:bg-gray-50">
                         <Eye size={14} /> View
                       </button>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && <tr><td colSpan="6" className="text-center py-10 text-gray-500">No applications found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Job Title</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Type / Dept</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Location</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Seats</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {jobs.map(job => (
                  <tr key={job._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">{job.title}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-700">{job.type}</div>
                      <div className="text-xs text-gray-500">{job.department}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{job.location}</td>
                    <td className="py-3 px-4 text-sm font-bold text-gray-700">
                      {job.hiredCount !== undefined ? job.hiredCount : 0} / {job.openings || 1}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                        job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right flex justify-end gap-2">
                       <button onClick={() => { setEditingJob(job); setJobForm(job); setShowJobModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                         <Edit2 size={16} />
                       </button>
                       <button onClick={() => handleDeleteJob(job._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                         <Trash2 size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && <tr><td colSpan="5" className="text-center py-10 text-gray-500">No jobs posted yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">{editingJob ? 'Edit Job' : 'Post New Job'}</h2>
              <button onClick={() => setShowJobModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <form id="jobForm" onSubmit={handleSaveJob} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Job Title *</label>
                    <input required type="text" value={jobForm.title} onChange={e=>setJobForm({...jobForm, title: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                    <select value={jobForm.status} onChange={e=>setJobForm({...jobForm, status: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500">
                      <option>Open</option>
                      <option>Closed</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Number of Openings</label>
                    <input type="number" min="1" value={jobForm.openings} onChange={e=>setJobForm({...jobForm, openings: parseInt(e.target.value) || 1})} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Required Skills (Comma separated)</label>
                    <input type="text" placeholder="e.g. Sales, Communication" value={jobForm.skills} onChange={e=>setJobForm({...jobForm, skills: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <SearchableSelect
                    label="Job Type"
                    required
                    value={jobForm.type}
                    onChange={val => setJobForm({...jobForm, type: val})}
                    options={JOB_TYPES}
                    placeholder="Select job type"
                  />
                  <SearchableSelect
                    label="Department"
                    required
                    value={jobForm.department}
                    onChange={val => setJobForm({...jobForm, department: val})}
                    options={DEPARTMENTS}
                    placeholder="Select department"
                  />
                  <SearchableSelect
                    label="Location"
                    required
                    value={jobForm.location}
                    onChange={val => setJobForm({...jobForm, location: val})}
                    options={ALL_LOCATIONS}
                    placeholder="Select city"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Job Description * (HTML/Text)</label>
                  <textarea required rows={12} value={jobForm.description} onChange={e=>setJobForm({...jobForm, description: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500" />
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50 rounded-b-xl">
              <button onClick={() => setShowJobModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100">Cancel</button>
              <button form="jobForm" type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">Save Job</button>
            </div>
          </div>
        </div>
      )}

      {/* Application Review Modal */}
      {showAppModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedApp.name}'s Application</h2>
                <p className="text-xs text-gray-500">Applied for: {selectedApp.jobId?.title}</p>
              </div>
              <div className="flex items-center gap-2">
                {!isEditingApp ? (
                  <button onClick={() => { setIsEditingApp(true); setEditAppForm(selectedApp); }} className="text-blue-600 text-xs font-bold border border-blue-600 px-3 py-1.5 rounded bg-white hover:bg-blue-50">Edit Profile</button>
                ) : (
                  <>
                    <button onClick={() => setIsEditingApp(false)} className="text-gray-600 text-xs font-bold border border-gray-300 px-3 py-1.5 rounded bg-white hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSaveAppEdit} className="text-white text-xs font-bold bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-700">Save</button>
                  </>
                )}
                <button onClick={() => { setShowAppModal(false); setIsEditingApp(false); }} className="text-gray-400 hover:text-gray-600 ml-2"><X size={20}/></button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Col - Personal info */}
                <div className="col-span-1 space-y-4">
                   <div className="flex flex-col items-center p-4 border border-gray-200 rounded-xl bg-gray-50">
                     {selectedApp.profilePhotoUrl ? (
                       <img src={`http://localhost:5000/${selectedApp.profilePhotoUrl}`} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" />
                     ) : (
                       <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400"><Users size={32} /></div>
                     )}
                     {isEditingApp ? (
                       <input type="text" value={editAppForm.name} onChange={e=>setEditAppForm({...editAppForm, name: e.target.value})} className="border border-blue-300 p-1 rounded w-full mt-3 text-center text-sm font-bold focus:ring-1 focus:ring-blue-500" />
                     ) : (
                       <h3 className="font-bold text-gray-900 mt-3 text-center">{selectedApp.name}</h3>
                     )}
                     
                     {isEditingApp ? (
                       <input type="email" value={editAppForm.email} onChange={e=>setEditAppForm({...editAppForm, email: e.target.value})} className="border border-blue-300 p-1 rounded w-full mt-1 text-center text-xs focus:ring-1 focus:ring-blue-500" />
                     ) : (
                       <p className="text-xs text-gray-500 text-center">{selectedApp.email}</p>
                     )}

                     {isEditingApp ? (
                       <input type="text" value={editAppForm.phone} onChange={e=>setEditAppForm({...editAppForm, phone: e.target.value})} className="border border-blue-300 p-1 rounded w-full mt-1 text-center text-xs focus:ring-1 focus:ring-blue-500" />
                     ) : (
                       <p className="text-xs text-gray-500 text-center">{selectedApp.phone}</p>
                     )}
                     
                     <div className="w-full mt-4 pt-4 border-t border-gray-200 space-y-2">
                       <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">Father:</span> {isEditingApp ? <input type="text" value={editAppForm.fatherName || ''} onChange={e=>setEditAppForm({...editAppForm, fatherName: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate">{selectedApp.fatherName}</span>}</div>
                       <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">Mother:</span> {isEditingApp ? <input type="text" value={editAppForm.motherName || ''} onChange={e=>setEditAppForm({...editAppForm, motherName: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate">{selectedApp.motherName}</span>}</div>
                       <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">Marital:</span> {isEditingApp ? <input type="text" value={editAppForm.maritalStatus || ''} onChange={e=>setEditAppForm({...editAppForm, maritalStatus: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate">{selectedApp.maritalStatus}</span>}</div>
                       <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">PAN:</span> {isEditingApp ? <input type="text" value={editAppForm.pan || ''} onChange={e=>setEditAppForm({...editAppForm, pan: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate">{selectedApp.pan}</span>}</div>
                       <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">Aadhaar:</span> {isEditingApp ? <input type="text" value={editAppForm.aadhaar || ''} onChange={e=>setEditAppForm({...editAppForm, aadhaar: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate">{selectedApp.aadhaar}</span>}</div>
                     </div>
                   </div>

                   <div className="p-4 border border-gray-200 rounded-xl">
                      <h4 className="text-sm font-bold text-gray-900 mb-2">Documents</h4>
                      {selectedApp.resumeUrl && (
                        <a href={`http://localhost:5000/${selectedApp.resumeUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded text-xs font-bold mb-2 hover:bg-blue-100">
                          <FileText size={14} /> View Resume
                        </a>
                      )}
                      {selectedApp.coverLetterUrl && (
                        <a href={`http://localhost:5000/${selectedApp.coverLetterUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-purple-50 text-purple-700 rounded text-xs font-bold mb-2 hover:bg-purple-100">
                          <FileText size={14} /> View Cover Letter
                        </a>
                      )}
                      {selectedApp.salarySlipUrl && (
                        <a href={`http://localhost:5000/${selectedApp.salarySlipUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded text-xs font-bold hover:bg-green-100">
                          <FileText size={14} /> View Salary Slip
                        </a>
                      )}
                   </div>
                   
                   <div className="p-4 border border-gray-200 rounded-xl">
                      <h4 className="text-sm font-bold text-gray-900 mb-2">Update Status</h4>
                      <select 
                        value={selectedApp.status}
                        onChange={(e) => handleUpdateAppStatus(selectedApp._id, e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 font-bold"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Hired">Hired</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                   </div>
                </div>

                {/* Right Col - Experience & Education */}
                <div className="col-span-2 space-y-6">
                  
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Salary & Expectations</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Gross Yearly</p>
                        {isEditingApp ? <input type="text" value={editAppForm.yearlyGrossSalary || ''} onChange={e=>setEditAppForm({...editAppForm, yearlyGrossSalary: e.target.value})} className="border border-blue-300 p-1.5 rounded text-sm w-full font-bold focus:ring-1 focus:ring-blue-500" /> : <p className="text-sm font-bold text-gray-900">{selectedApp.yearlyGrossSalary || 'N/A'}</p>}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Net Monthly</p>
                        {isEditingApp ? <input type="text" value={editAppForm.monthlyNetSalary || ''} onChange={e=>setEditAppForm({...editAppForm, monthlyNetSalary: e.target.value})} className="border border-blue-300 p-1.5 rounded text-sm w-full font-bold focus:ring-1 focus:ring-blue-500" /> : <p className="text-sm font-bold text-gray-900">{selectedApp.monthlyNetSalary || 'N/A'}</p>}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Expected Salary</p>
                        {isEditingApp ? <input type="text" value={editAppForm.expectedSalary || ''} onChange={e=>setEditAppForm({...editAppForm, expectedSalary: e.target.value})} className="border border-blue-300 p-1.5 rounded text-sm w-full font-bold text-blue-600 focus:ring-1 focus:ring-blue-500" /> : <p className="text-sm font-bold text-blue-600">{selectedApp.expectedSalary || 'N/A'}</p>}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Notice Period</p>
                        {isEditingApp ? <input type="text" value={editAppForm.noticePeriod || ''} onChange={e=>setEditAppForm({...editAppForm, noticePeriod: e.target.value})} className="border border-blue-300 p-1.5 rounded text-sm w-full font-bold text-orange-600 focus:ring-1 focus:ring-blue-500" /> : <p className="text-sm font-bold text-orange-600">{selectedApp.noticePeriod || 'N/A'}</p>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 flex items-center gap-2"><Briefcase size={16}/> Experience</h3>
                    {selectedApp.experience && selectedApp.experience.length > 0 ? selectedApp.experience.map((exp, idx) => (
                      <div key={idx} className="mb-4 last:mb-0">
                        <h4 className="font-bold text-gray-900">{exp.title} <span className="text-gray-500 font-normal">at</span> {exp.company}</h4>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                           <Calendar size={12}/> {exp.startDate} - {exp.endDate}
                           <span className="mx-1">•</span>
                           <MapPin size={12}/> {exp.location}
                        </p>
                        {exp.summary && <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">{exp.summary}</p>}
                      </div>
                    )) : <p className="text-sm text-gray-500 italic">No experience added.</p>}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 flex items-center gap-2"><Building size={16}/> Education</h3>
                    {selectedApp.education && selectedApp.education.length > 0 ? selectedApp.education.map((edu, idx) => (
                      <div key={idx} className="mb-4 last:mb-0">
                        <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                        <p className="text-sm font-medium text-gray-700">{edu.institution}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                           <Calendar size={12}/> {edu.startDate} - {edu.endDate}
                           <span className="mx-1">•</span>
                           <MapPin size={12}/> {edu.location} ({edu.districtState})
                        </p>
                      </div>
                    )) : <p className="text-sm text-gray-500 italic">No education added.</p>}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Address Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Present Address</p>
                        {isEditingApp ? <textarea value={editAppForm.presentAddress || ''} onChange={e=>setEditAppForm({...editAppForm, presentAddress: e.target.value})} className="border border-blue-300 p-2 rounded text-sm w-full focus:ring-1 focus:ring-blue-500" rows="2" /> : <p className="text-sm text-gray-800">{selectedApp.presentAddress || 'N/A'}</p>}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Permanent Address</p>
                        {isEditingApp ? <textarea value={editAppForm.permanentAddress || ''} onChange={e=>setEditAppForm({...editAppForm, permanentAddress: e.target.value})} className="border border-blue-300 p-2 rounded text-sm w-full focus:ring-1 focus:ring-blue-500" rows="2" /> : <p className="text-sm text-gray-800">{selectedApp.permanentAddress || 'N/A'}</p>}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
