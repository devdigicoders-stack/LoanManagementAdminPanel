import React, { useState, useEffect, useRef } from 'react';
import { Users, Briefcase, Plus, CheckCircle2, ChevronRight, Search, FileText, X, Eye, MapPin, Building, Calendar, Edit2, Trash2, ChevronDown, UserCheck, Copy, ExternalLink, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// ── Static data for job form dropdowns ─────────────────────────────────────
const JOB_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'];

const DEPARTMENTS = [
  'OPERATIONAL', 'FIELD-SALES', 'BRANCH SALES', 'COLLECTIONS', 'OFFICIAL WORK'
];

const DEPARTMENT_DESIGNATIONS = {
  'OPERATIONAL': [
    'HAUS NUO-Pay Offer- Liability',
    'Branch Operations Manager',
    'Credit Manager',
    'Credit Underwriter',
    'Credit Executive',
    'Operation Manager',
    'Operation Executive',
    'Treasury Officer',
    'Payroll Manager',
    'Account Manager',
    'Account Executive',
    'HR Manager',
    'HR Executive',
    'KYC Verification Officer',
    'Loan Documentation Specialist'
  ],
  'FIELD-SALES': [
    'HAUS NUO-Pay Offer- Liability',
    'Senior Field Loan Officer',
    'Relationship Manager',
    'Relationship Executive',
    'Relationship Officer',
    'Direct Sales Executive',
    'Microfinance Field Officer',
    'Rural Agri-Loan Officer',
    'SME Business Acquisition Officer'
  ],
  'BRANCH SALES': [
    'HAUS NUO-Pay Offer- Liability',
    'Branch Relationship Manager',
    'Regional Sales Manager',
    'Area Sales Manager',
    'Sales Trainer',
    'Reporting Team Manager',
    'Business Development Executive',
    'Gold Loan Officer',
    'Senior Sales Officer'
  ],
  'COLLECTIONS': [
    'HAUS NUO-Pay Offer- Liability',
    'Collection Manager',
    'Collection Executive',
    'Field Recovery Executive',
    'Debt Recovery Officer',
    'Legal Collections Specialist',
    'Field Investigation Officer',
    'Soft Calling Officer'
  ],
  'OFFICIAL WORK': [
    'HAUS NUO-Pay Offer- Liability',
    'Customer Care Executive - CCE',
    'Customer Support Representative - CSR',
    'Customer Service Representative',
    'Front Desk Executive',
    'MIS & Reporting Executive',
    'Back Office Operations Executive',
    'Admin & Facility Associate'
  ]
};

const LOCATION_DATA = {
  // North Zone
  'HARYANA': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar', 'Karnal', 'Rohtak', 'Sonipat'],
  'PUNJAB': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'],
  'JAMMU': ['Jammu', 'Srinagar', 'Anantnag', 'Udhampur', 'Baramulla'],
  'HIMACHAL PRADESH': ['Shimla', 'Dharamshala', 'Mandi', 'Solan', 'Kullu'],
  'UTTARAKHAND': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rishikesh', 'Nainital'],
  'UTTAR PRADESH': ['Lucknow', 'Kanpur', 'Noida', 'Ghaziabad', 'Agra', 'Varanasi', 'Prayagraj', 'Meerut', 'Bareilly', 'Aligarh', 'Gorakhpur', 'Moradabad', 'Ayodhya'],

  // South Zone
  'ANDHRA PRADESH': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Kakinada'],
  'KARNATAKA': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Davangere', 'Kalaburagi'],
  'KERALA': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Alappuzha', 'Palakkad'],
  'TAMIL NADU': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore'],
  'TELANGANA': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Secunderabad'],
  'PUDUCHERRY': ['Puducherry', 'Karaikal', 'Oulgaret'],

  // East Zone
  'BIHAR': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif'],
  'JHARKHAND': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'],
  'ORISSA': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri'],
  'CHHATTISGARH': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon'],
  'WEST BENGAL': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Howrah', 'Bardhaman'],
  'SIKKIM': ['Gangtok', 'Namchi', 'Geyzing', 'Mangan'],
  'ASSAM': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia'],

  // West Zone
  'MAHARASHTRA': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur', 'Navi Mumbai'],
  'GUJARAT': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar'],
  'MADHYA PRADESH': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas'],
  'RAJASTHAN': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar'],
  'GOA': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],

  // Central Zone
  'CHANDIGARH': ['Chandigarh', 'Mohali (Chandigarh Region)', 'Panchkula (Chandigarh Region)'],
  'DELHI': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Dwarka', 'Connaught Place']
};

// Flatten all cities for location dropdown
const ALL_LOCATIONS = Object.entries(LOCATION_DATA).flatMap(
  ([state, cities]) => cities.map(city => `${city}, ${state}`)
);

const ZONE_STATES_MAP = {
  'NORTH': ['HARYANA', 'PUNJAB', 'JAMMU', 'HIMACHAL PRADESH', 'UTTARAKHAND', 'UTTAR PRADESH'],
  'SOUTH': ['ANDHRA PRADESH', 'KARNATAKA', 'KERALA', 'TAMIL NADU', 'TELANGANA', 'PUDUCHERRY'],
  'EAST': ['BIHAR', 'JHARKHAND', 'ORISSA', 'CHHATTISGARH', 'WEST BENGAL', 'SIKKIM', 'ASSAM'],
  'WEST': ['MAHARASHTRA', 'GUJARAT', 'MADHYA PRADESH', 'RAJASTHAN', 'GOA'],
  'CENTRAL': ['CHANDIGARH', 'DELHI']
};

const ZONE_DEFAULT_LOCATIONS = {
  'NORTH': 'Lucknow, UTTAR PRADESH',
  'SOUTH': 'Bengaluru, KARNATAKA',
  'EAST': 'Patna, BIHAR',
  'WEST': 'Mumbai, MAHARASHTRA',
  'CENTRAL': 'New Delhi, DELHI',
  'ALL': 'Bengaluru, KARNATAKA'
};

const getLocationsForZone = (zone) => {
  if (!zone || zone === 'ALL') return ALL_LOCATIONS;
  const states = ZONE_STATES_MAP[zone.toUpperCase()] || [];
  const matched = Object.entries(LOCATION_DATA)
    .filter(([st]) => states.includes(st.toUpperCase()))
    .flatMap(([st, cities]) => cities.map(city => `${city}, ${st}`));
  return matched.length > 0 ? matched : ALL_LOCATIONS;
};

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
  const [employees, setEmployees] = useState([]);
  const [designations, setDesignations] = useState([]);
  
  // Auth User context
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = (currentUser.role || '').toLowerCase();
  const userDesig = (currentUser.designation || '').toLowerCase();
  const isMasterAdmin = ['super admin', 'superadmin', 'admin'].includes(userRole);
  const isHRLead = ['hr head', 'hr_head', 'hr admin', 'hr manager', 'hr_manager'].includes(userRole) || 
                   userDesig.includes('hr head') || userDesig.includes('hr manager');
  const isHRHead = isHRLead;
  const isExecutive = !isMasterAdmin && !isHRHead && (userRole.includes('executive') || userDesig.includes('executive'));
  const userZone = (currentUser.zone && currentUser.zone !== 'ALL') ? currentUser.zone.toUpperCase() : 'NORTH';
  const canAssignApplications = isHRLead && !isMasterAdmin;

  // Assignment & Filter states
  const [appFilterTab, setAppFilterTab] = useState('all'); // 'all', 'unassigned', 'assigned'
  const [selectedAppIds, setSelectedAppIds] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [targetEmployeeId, setTargetEmployeeId] = useState('');
  const [assigningApp, setAssigningApp] = useState(null); // single assign or null for bulk

  // Modals
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  const [showAppModal, setShowAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Designation Modal & Form
  const [showAddDesigModal, setShowAddDesigModal] = useState(false);
  const [newDesigForm, setNewDesigForm] = useState({
    name: '',
    department: 'OPERATIONAL',
    description: '',
    status: 'Active'
  });
  const [desigSearch, setDesigSearch] = useState('');
  const [desigDeptFilter, setDesigDeptFilter] = useState('all');
  
  // App Edit Form
  const [isEditingApp, setIsEditingApp] = useState(false);
  const [editAppForm, setEditAppForm] = useState({});
  
  // Job Form
  const [jobForm, setJobForm] = useState({
    title: 'HAUS NUO-Pay Offer- Liability',
    designation: 'HAUS NUO-Pay Offer- Liability',
    type: 'Full Time',
    department: 'OPERATIONAL',
    location: isMasterAdmin || isHRHead ? 'Bengaluru, KARNATAKA' : (ZONE_DEFAULT_LOCATIONS[userZone] || 'Lucknow, UTTAR PRADESH'),
    zone: isMasterAdmin || isHRHead ? 'ALL' : userZone,
    description: DEFAULT_JOB_DESC,
    status: 'Open',
    openings: 1,
    skills: '',
    publishStatus: 'Published'
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchEmployees();
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/designations`);
      if (res.ok) {
        const data = await res.json();
        setDesignations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching designations:', err);
    }
  };

  const handleSaveDesignation = async (e) => {
    e.preventDefault();
    if (!newDesigForm.name.trim()) {
      toast.error('Designation name is required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/designations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDesigForm)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Designation added successfully');
        setShowAddDesigModal(false);
        setNewDesigForm({ name: '', department: jobForm.department || 'OPERATIONAL', description: '', status: 'Active' });
        await fetchDesignations();
        // If adding while in job modal, select it in job form
        if (showJobModal) {
          setJobForm(prev => ({
            ...prev,
            designation: data.name,
            title: prev.title || data.name
          }));
        }
      } else {
        toast.error(data.message || 'Failed to create designation');
      }
    } catch (err) {
      toast.error('Server error creating designation');
    }
  };

  const handleDeleteDesignation = (id, name) => {
    Swal.fire({
      title: 'Delete Designation?',
      text: `Are you sure you want to remove "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/designations/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            toast.success('Designation deleted');
            fetchDesignations();
          } else {
            toast.error('Failed to delete designation');
          }
        } catch (err) {
          toast.error('Server error');
        }
      }
    });
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users?type=staff`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.users || []);
        // Filter out superadmins and show relevant executives/staff
        setEmployees(list.filter(u => !['superadmin', 'super admin', 'Super Admin'].includes(u.role)));
      } else {
        const fallback = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (fallback.ok) {
          const fbData = await fallback.json();
          setEmployees(Array.isArray(fbData) ? fbData : []);
        }
      }
    } catch (err) {
      console.error('Error fetching staff list for assignment:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recruitment/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load jobs');
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recruitment/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load applications');
    }
  };

  const handleSingleAssign = async () => {
    if (!targetEmployeeId) {
      toast.error('Please select an employee');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recruitment/applications/${assigningApp._id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ assignedToId: targetEmployeeId })
      });
      if (res.ok) {
        toast.success('Application assigned successfully');
        setShowAssignModal(false);
        setAssigningApp(null);
        setTargetEmployeeId('');
        fetchApplications();
      } else {
        toast.error('Failed to assign application');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleBulkAssign = async () => {
    if (!targetEmployeeId) {
      toast.error('Please select an employee');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recruitment/applications/bulk-assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ applicationIds: selectedAppIds, assignedToId: targetEmployeeId })
      });
      if (res.ok) {
        toast.success(`${selectedAppIds.length} applications assigned successfully`);
        setShowAssignModal(false);
        setSelectedAppIds([]);
        setTargetEmployeeId('');
        fetchApplications();
      } else {
        toast.error('Failed to bulk assign');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingJob 
        ? `${import.meta.env.VITE_API_BASE_URL}/recruitment/jobs/${editingJob._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/recruitment/jobs`;
      
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
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recruitment/jobs/${id}`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recruitment/applications/${id}/status`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recruitment/applications/${selectedApp._id}`, {
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
    const dept = 'OPERATIONAL';
    const deptDesigs = designations.filter(d => d.department === dept);
    const defaultDesig = deptDesigs.length > 0 ? deptDesigs[0].name : 'HAUS NUO-Pay Offer- Liability';
    const effectiveZone = (isMasterAdmin || isHRHead) ? 'ALL' : userZone;
    const defaultLoc = (isMasterAdmin || isHRHead) ? 'Bengaluru, KARNATAKA' : (ZONE_DEFAULT_LOCATIONS[userZone] || 'Lucknow, UTTAR PRADESH');

    setJobForm({
      title: 'HAUS NUO-Pay Offer- Liability',
      designation: defaultDesig,
      type: 'Full Time', 
      department: dept, 
      zone: effectiveZone,
      location: defaultLoc, 
      description: DEFAULT_JOB_DESC, 
      status: 'Open',
      publishStatus: 'Published',
      openings: 1,
      skills: ''
    });
    setShowJobModal(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      designation: job.designation || job.title || '',
      type: job.type || 'Full Time',
      department: job.department || 'OPERATIONAL',
      zone: job.zone || ((isMasterAdmin || isHRHead) ? 'ALL' : userZone),
      location: job.location || '',
      description: job.description || '',
      status: job.status || 'Open',
      publishStatus: job.publishStatus || 'Published',
      openings: job.openings || 1,
      skills: job.skills || ''
    });
    setShowJobModal(true);
  };

  // Pagination & Filtering for Applications
  const [appSearch, setAppSearch] = useState('');
  const [appZoneFilter, setAppZoneFilter] = useState('all');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [appCurrentPage, setAppCurrentPage] = useState(1);
  const [appPageSize, setAppPageSize] = useState(15);

  // Pagination & Filtering for Jobs
  const [jobSearch, setJobSearch] = useState('');
  const [jobZoneFilter, setJobZoneFilter] = useState('all');
  const [jobDeptFilter, setJobDeptFilter] = useState('all');
  const [jobStatusFilter, setJobStatusFilter] = useState('all');
  const [jobCurrentPage, setJobCurrentPage] = useState(1);
  const [jobPageSize, setJobPageSize] = useState(15);

  // Reset pagination on filter changes
  useEffect(() => {
    setAppCurrentPage(1);
  }, [appSearch, appFilterTab, appZoneFilter, appStatusFilter, appPageSize]);

  useEffect(() => {
    setJobCurrentPage(1);
  }, [jobSearch, jobZoneFilter, jobDeptFilter, jobStatusFilter, jobPageSize]);

  // Filtered Applications
  const filteredApplications = applications.filter(app => {
    if (appFilterTab === 'unassigned' && app.assignedToId) return false;
    if (appFilterTab === 'assigned' && !app.assignedToId) return false;
    if (appZoneFilter !== 'all' && (app.zone || '').toUpperCase() !== appZoneFilter.toUpperCase()) return false;
    if (appStatusFilter !== 'all' && (app.status || '').toLowerCase() !== appStatusFilter.toLowerCase()) return false;
    if (appSearch) {
      const q = appSearch.toLowerCase();
      const matchName = (app.name || '').toLowerCase().includes(q);
      const matchEmail = (app.email || '').toLowerCase().includes(q);
      const matchPhone = (app.phone || '').toLowerCase().includes(q);
      const matchAppNo = (app.applicationNo || '').toLowerCase().includes(q);
      const matchJob = (app.jobId?.title || '').toLowerCase().includes(q);
      const matchState = (app.state || '').toLowerCase().includes(q);
      const matchZone = (app.zone || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchAppNo && !matchJob && !matchState && !matchZone) {
        return false;
      }
    }
    return true;
  });

  const appTotalPages = Math.max(1, Math.ceil(filteredApplications.length / appPageSize));
  const paginatedApplications = filteredApplications.slice(
    (appCurrentPage - 1) * appPageSize,
    appCurrentPage * appPageSize
  );

  // Filtered Jobs
  const filteredJobs = jobs.filter(job => {
    if (jobZoneFilter !== 'all' && (job.zone || 'ALL').toUpperCase() !== jobZoneFilter.toUpperCase()) return false;
    if (jobDeptFilter !== 'all' && job.department !== jobDeptFilter) return false;
    if (jobStatusFilter !== 'all' && job.status !== jobStatusFilter) return false;
    if (jobSearch) {
      const q = jobSearch.toLowerCase();
      const matchTitle = (job.title || '').toLowerCase().includes(q);
      const matchDept = (job.department || '').toLowerCase().includes(q);
      const matchLoc = (job.location || '').toLowerCase().includes(q);
      const matchZone = (job.zone || '').toLowerCase().includes(q);
      const matchSkills = (job.skills || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDept && !matchLoc && !matchZone && !matchSkills) return false;
    }
    return true;
  });

  const jobTotalPages = Math.max(1, Math.ceil(filteredJobs.length / jobPageSize));
  const paginatedJobs = filteredJobs.slice(
    (jobCurrentPage - 1) * jobPageSize,
    jobCurrentPage * jobPageSize
  );

  const renderPaginationBar = (currentPage, totalPages, pageSize, setPageSize, setPage, totalItems) => {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const getPageNumbers = () => {
      const pages = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 4) {
          pages.push(1, 2, 3, 4, 5, '...', totalPages);
        } else if (currentPage >= totalPages - 3) {
          pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
      }
      return pages;
    };

    return (
      <div className="p-4 bg-white border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-gray-600">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 text-gray-800 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {[15, 25, 50, 100].map(sz => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
          </div>
          <span className="text-gray-400">|</span>
          <div>
            Showing <span className="text-gray-900 font-bold">{startItem}</span> to <span className="text-gray-900 font-bold">{endItem}</span> of <span className="text-gray-900 font-bold">{totalItems}</span> entries
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
            title="First Page"
          >
            « First
          </button>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
          >
            ‹ Prev
          </button>

          <div className="flex items-center gap-1 mx-1">
            {getPageNumbers().map((p, idx) => (
              p === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-400">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                    currentPage === p
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              )
            ))}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
          >
            Next ›
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
            title="Last Page"
          >
            Last »
          </button>
        </div>
      </div>
    );
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
          Job Applications ({applications.length})
        </button>
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Manage Jobs ({jobs.length})
        </button>
        <button 
          onClick={() => setActiveTab('designations')}
          className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'designations' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Department Designations ({designations.length})
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
        
        {activeTab === 'applications' && (
          <div>
            {/* Filter Toolbar */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap justify-between items-center gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-1.5 bg-gray-200/70 p-1 rounded-lg">
                  <button
                    onClick={() => setAppFilterTab('all')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      appFilterTab === 'all' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All ({applications.length})
                  </button>
                  <button
                    onClick={() => setAppFilterTab('unassigned')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      appFilterTab === 'unassigned' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Unassigned ({applications.filter(a => !a.assignedToId).length})
                  </button>
                  <button
                    onClick={() => setAppFilterTab('assigned')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      appFilterTab === 'assigned' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Assigned ({applications.filter(a => a.assignedToId).length})
                  </button>
                </div>

                {/* Zone Filter */}
                <select
                  value={appZoneFilter}
                  onChange={(e) => setAppZoneFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-white text-gray-700 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Zones</option>
                  <option value="NORTH">North Zone</option>
                  <option value="SOUTH">South Zone</option>
                  <option value="EAST">East Zone</option>
                  <option value="WEST">West Zone</option>
                  <option value="CENTRAL">Central Zone</option>
                </select>

                {/* Status Filter */}
                <select
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-white text-gray-700 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="applied">Applied</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview">Interview</option>
                  <option value="selected">Selected</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search candidate, job, phone..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs w-64 bg-white focus:outline-none focus:border-blue-500"
                  />
                  {appSearch && (
                    <button onClick={() => setAppSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X size={12} />
                    </button>
                  )}
                </div>

                {canAssignApplications && selectedAppIds.length > 0 && (
                  <button
                    onClick={() => { setAssigningApp(null); setTargetEmployeeId(''); setShowAssignModal(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
                  >
                    <UserCheck size={14} /> Bulk Assign ({selectedAppIds.length})
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {canAssignApplications && (
                      <th className="py-3 px-4 w-10 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={
                            paginatedApplications.length > 0 &&
                            paginatedApplications.every(a => selectedAppIds.includes(a._id))
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newIds = Array.from(new Set([...selectedAppIds, ...paginatedApplications.map(a => a._id)]));
                              setSelectedAppIds(newIds);
                            } else {
                              const pageIds = new Set(paginatedApplications.map(a => a._id));
                              setSelectedAppIds(selectedAppIds.filter(id => !pageIds.has(id)));
                            }
                          }}
                          className="rounded text-blue-600"
                        />
                      </th>
                    )}
                    <th className="py-3 px-4 whitespace-nowrap">App No & Candidate</th>
                    <th className="py-3 px-4 whitespace-nowrap">Zone & State</th>
                    <th className="py-3 px-4 whitespace-nowrap">Applied For</th>
                    <th className="py-3 px-4 whitespace-nowrap">Contact</th>
                    <th className="py-3 px-4 whitespace-nowrap">Assigned HR Exec</th>
                    <th className="py-3 px-4 whitespace-nowrap">Date</th>
                    <th className="py-3 px-4 whitespace-nowrap">Status</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {paginatedApplications.map(app => (
                    <tr key={app._id} className="hover:bg-blue-50/50 transition-colors">
                      {canAssignApplications && (
                        <td className="py-3 px-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedAppIds.includes(app._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAppIds([...selectedAppIds, app._id]);
                              } else {
                                setSelectedAppIds(selectedAppIds.filter(id => id !== app._id));
                              }
                            }}
                            className="rounded text-blue-600"
                          />
                        </td>
                      )}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {app.applicationNo && (
                          <span className="font-mono text-[10.5px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1 whitespace-nowrap">
                            {app.applicationNo}
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{app.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                            app.candidateType === 'Experienced'
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                            {app.candidateType || 'Fresher'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 block mt-0.5">Exp CTC: {app.expectedSalary || 'N/A'}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border whitespace-nowrap ${
                          app.zone === 'NORTH' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                          app.zone === 'SOUTH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          app.zone === 'EAST' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          app.zone === 'WEST' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          <MapPin size={10} /> {app.zone || 'NORTH'}
                        </span>
                        <div className="text-[11.5px] text-gray-500 mt-0.5 font-medium whitespace-nowrap">
                          {app.state || 'State Mapped'}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-blue-600 block">{app.jobId?.title || 'Unknown Job'}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="text-xs font-medium text-gray-700">{app.email}</div>
                        <div className="text-xs text-gray-500">{app.phone}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {app.assignedTo && app.assignedTo !== 'Unassigned' ? (
                          <div>
                            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                              <UserCheck size={12} /> {app.assignedTo}
                            </div>
                            {app.assignedManagerName && (
                              <span className="text-[10px] text-gray-500 font-medium mt-0.5 block whitespace-nowrap">
                                Mgr: {app.assignedManagerName}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-block text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 whitespace-nowrap">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${
                          app.status === 'Hired' ? 'bg-green-100 text-green-700 border border-green-200' :
                          app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          app.status === 'Interview' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                          app.status === 'Reviewed' ? 'bg-sky-100 text-sky-700 border border-sky-200' :
                          app.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {canAssignApplications && (
                            <button
                              onClick={() => { setAssigningApp(app); setTargetEmployeeId(app.assignedToId?._id || app.assignedToId || ''); setShowAssignModal(true); }}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 text-gray-700 rounded-md text-xs font-bold hover:bg-gray-50 cursor-pointer whitespace-nowrap shadow-2xs"
                              title="Assign to HR Executive"
                            >
                              <UserCheck size={12} /> Reassign
                            </button>
                          )}
                          <button 
                            onClick={() => { setSelectedApp(app); setShowAppModal(true); }} 
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-xs font-bold hover:bg-blue-100 cursor-pointer whitespace-nowrap shadow-2xs"
                          >
                            <Eye size={12} /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedApplications.length === 0 && (
                    <tr>
                      <td colSpan="9" className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users size={32} className="text-gray-300" />
                          <p className="font-semibold text-gray-600">No applications match your filter.</p>
                          <p className="text-xs text-gray-400">Try adjusting your search terms or zone filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Applications Pagination */}
            {renderPaginationBar(
              appCurrentPage,
              appTotalPages,
              appPageSize,
              setAppPageSize,
              setAppCurrentPage,
              filteredApplications.length
            )}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div>
            {/* Jobs Filter Toolbar */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap justify-between items-center gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Zone Filter */}
                <select
                  value={jobZoneFilter}
                  onChange={(e) => setJobZoneFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-white text-gray-700 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Zones ({jobs.length})</option>
                  <option value="NORTH">NORTH Zone ({jobs.filter(j => (j.zone || 'NORTH').toUpperCase() === 'NORTH').length})</option>
                  <option value="SOUTH">SOUTH Zone ({jobs.filter(j => (j.zone || '').toUpperCase() === 'SOUTH').length})</option>
                  <option value="EAST">EAST Zone ({jobs.filter(j => (j.zone || '').toUpperCase() === 'EAST').length})</option>
                  <option value="WEST">WEST Zone ({jobs.filter(j => (j.zone || '').toUpperCase() === 'WEST').length})</option>
                  <option value="CENTRAL">CENTRAL Zone ({jobs.filter(j => (j.zone || '').toUpperCase() === 'CENTRAL').length})</option>
                </select>

                {/* Department Filter */}
                <select
                  value={jobDeptFilter}
                  onChange={(e) => setJobDeptFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-white text-gray-700 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Departments ({jobs.length})</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept} ({jobs.filter(j => j.department === dept).length})</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={jobStatusFilter}
                  onChange={(e) => setJobStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-white text-gray-700 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="Open">Active (Open)</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search job title, location, skills..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs w-64 bg-white focus:outline-none focus:border-blue-500"
                />
                {jobSearch && (
                  <button onClick={() => setJobSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Job Title & Role</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Type / Dept</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Location & Zone</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Seats</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {paginatedJobs.map(job => (
                    <tr key={job._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{job.title}</span>
                        {job.designation && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded text-[10px] font-bold">
                            Role: {job.designation}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-700">{job.type}</div>
                        <div className="text-xs text-gray-500">{job.department}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-800 font-medium text-xs">{job.location}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold">
                          {job.zone ? `${job.zone} Zone` : 'NORTH Zone'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-gray-700">
                        {job.hiredCount !== undefined ? job.hiredCount : 0} / {job.openings || 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                            job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {job.status === 'Open' ? 'Active' : job.status}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            job.publishStatus === 'Draft' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {job.publishStatus || 'Published'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right flex justify-end gap-2">
                         <button onClick={() => handleEditJob(job)} title="Edit Job" className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                           <Edit2 size={16} />
                         </button>
                         <button onClick={() => handleDeleteJob(job._id)} title="Delete Job" className="p-2 text-red-600 hover:bg-red-50 rounded">
                           <Trash2 size={16} />
                         </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedJobs.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Briefcase size={32} className="text-gray-300" />
                          <p className="font-semibold text-gray-600">No jobs match your filter criteria.</p>
                          <p className="text-xs text-gray-400">Try clearing the search or changing department filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Jobs Pagination */}
            {renderPaginationBar(
              jobCurrentPage,
              jobTotalPages,
              jobPageSize,
              setJobPageSize,
              setJobCurrentPage,
              filteredJobs.length
            )}
          </div>
        )}

        {activeTab === 'designations' && (
          <div>
            {/* Designations Toolbar */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap justify-between items-center gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={desigDeptFilter}
                  onChange={(e) => setDesigDeptFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-white text-gray-700 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Departments ({designations.length})</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept} ({designations.filter(d => d.department === dept).length})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search designation..."
                    value={desigSearch}
                    onChange={(e) => setDesigSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs w-64 bg-white focus:outline-none focus:border-blue-500"
                  />
                  {desigSearch && (
                    <button onClick={() => setDesigSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X size={12} />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setNewDesigForm({ name: '', department: 'OPERATIONAL', description: '', status: 'Active' });
                    setShowAddDesigModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  <Plus size={14} /> Add Designation
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Designation Name</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Department</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Description</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {designations
                    .filter(d => {
                      if (desigDeptFilter !== 'all' && d.department !== desigDeptFilter) return false;
                      if (desigSearch && !d.name.toLowerCase().includes(desigSearch.toLowerCase())) return false;
                      return true;
                    })
                    .map(desig => (
                      <tr key={desig._id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900">{desig.name}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-xs border border-slate-200">
                            {desig.department}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-xs">{desig.description || 'Standard departmental role'}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-[11px] font-bold">
                            {desig.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteDesignation(desig._id, desig.name)}
                            title="Delete Designation"
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {designations.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-gray-500">No designations added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                <div className="grid grid-cols-3 gap-4">
                  <SearchableSelect
                    label="Department"
                    required
                    value={jobForm.department}
                    onChange={val => {
                      const deptDesigs = designations.filter(d => d.department === val);
                      const nextDesig = deptDesigs.length > 0 ? deptDesigs[0].name : (DEPARTMENT_DESIGNATIONS[val]?.[0] || 'HAUS NUO-Pay Offer- Liability');
                      setJobForm({
                        ...jobForm,
                        department: val,
                        designation: nextDesig,
                        title: jobForm.title === jobForm.designation || !jobForm.title ? nextDesig : jobForm.title
                      });
                    }}
                    options={DEPARTMENTS}
                    placeholder="Select department"
                  />

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700">Designation *</label>
                      <button
                        type="button"
                        onClick={() => {
                          setNewDesigForm({ name: '', department: jobForm.department || 'OPERATIONAL', description: '', status: 'Active' });
                          setShowAddDesigModal(true);
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                      >
                        <Plus size={12} /> Add New
                      </button>
                    </div>
                    <select
                      required
                      value={jobForm.designation}
                      onChange={e => {
                        const val = e.target.value;
                        setJobForm({
                          ...jobForm,
                          designation: val,
                          title: jobForm.title === jobForm.designation || !jobForm.title ? val : jobForm.title
                        });
                      }}
                      className="w-full border border-gray-300 rounded p-2 text-sm bg-white focus:ring-1 focus:ring-blue-500 font-medium text-gray-900"
                    >
                      <option value="">Select Designation</option>
                      {(designations.filter(d => d.department === jobForm.department).length > 0
                        ? designations.filter(d => d.department === jobForm.department)
                        : (DEPARTMENT_DESIGNATIONS[jobForm.department] || []).map(name => ({ name }))
                      ).map((d, idx) => (
                        <option key={idx} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Job Title *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. HAUS NUO-Pay Offer- Liability"
                      value={jobForm.title}
                      onChange={e=>setJobForm({...jobForm, title: e.target.value})}
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <SearchableSelect
                    label="Job Type"
                    required
                    value={jobForm.type}
                    onChange={val => setJobForm({...jobForm, type: val})}
                    options={JOB_TYPES}
                    placeholder="Select job type"
                  />
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Zone {isExecutive ? '(Assigned)' : '*'}
                    </label>
                    {isExecutive ? (
                      <div className="flex items-center justify-between border border-blue-200 bg-blue-50/70 rounded p-2 text-xs font-bold text-blue-900 h-[38px]">
                        <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-extrabold">{userZone}</span>
                        <span className="text-[11px] text-blue-700 font-medium">Assigned Zone</span>
                      </div>
                    ) : (
                      <select
                        value={jobForm.zone || 'ALL'}
                        onChange={e => {
                          const newZ = e.target.value;
                          const locs = getLocationsForZone(newZ);
                          setJobForm({
                            ...jobForm,
                            zone: newZ,
                            location: locs.includes(jobForm.location) ? jobForm.location : (ZONE_DEFAULT_LOCATIONS[newZ] || locs[0] || '')
                          });
                        }}
                        className="w-full border border-gray-300 rounded p-2 text-sm bg-white focus:ring-1 focus:ring-blue-500 font-bold text-gray-800 h-[38px]"
                      >
                        <option value="ALL">ALL (Pan-India)</option>
                        <option value="NORTH">NORTH Zone</option>
                        <option value="SOUTH">SOUTH Zone</option>
                        <option value="EAST">EAST Zone</option>
                        <option value="WEST">WEST Zone</option>
                        <option value="CENTRAL">CENTRAL Zone</option>
                      </select>
                    )}
                  </div>
                  <SearchableSelect
                    label="Location"
                    required
                    value={jobForm.location}
                    onChange={val => setJobForm({...jobForm, location: val})}
                    options={getLocationsForZone(jobForm.zone)}
                    placeholder="Select city"
                  />
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Status (Active/Inactive)</label>
                    <select value={jobForm.status} onChange={e=>setJobForm({...jobForm, status: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500 h-[38px]">
                      <option value="Open">Active (Open)</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Publish Status</label>
                    <select value={jobForm.publishStatus || 'Published'} onChange={e=>setJobForm({...jobForm, publishStatus: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500">
                      <option value="Draft">Draft (Hidden from Website)</option>
                      <option value="Published">Published (Live on Website)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Number of Openings</label>
                    <input type="number" min="1" value={jobForm.openings} onChange={e=>setJobForm({...jobForm, openings: parseInt(e.target.value) || 1})} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Required Skills (Comma separated)</label>
                    <input type="text" placeholder="e.g. Sales, Communication" value={jobForm.skills} onChange={e=>setJobForm({...jobForm, skills: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500" />
                  </div>
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

      {/* Quick Add Designation Modal */}
      {showAddDesigModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h2 className="text-base font-bold text-gray-900">Add New Designation</h2>
              <button onClick={() => setShowAddDesigModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <form onSubmit={handleSaveDesignation} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Designation Name *</label>
                <input
                  required
                  autoFocus
                  type="text"
                  placeholder="e.g. Senior Credit Officer"
                  value={newDesigForm.name}
                  onChange={e => setNewDesigForm({...newDesigForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Department *</label>
                <select
                  value={newDesigForm.department}
                  onChange={e => setNewDesigForm({...newDesigForm, department: e.target.value})}
                  className="w-full border border-gray-300 rounded p-2 text-sm bg-white focus:ring-1 focus:ring-blue-500"
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Brief role overview"
                  value={newDesigForm.description}
                  onChange={e => setNewDesigForm({...newDesigForm, description: e.target.value})}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDesigModal(false)}
                  className="px-3.5 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm"
                >
                  Save Designation
                </button>
              </div>
            </form>
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
                       <img src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedApp.profilePhotoUrl}`} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" />
                     ) : (
                       <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400"><Users size={32} /></div>
                     )}
                     {isEditingApp ? (
                       <input type="text" value={editAppForm.name} onChange={e=>setEditAppForm({...editAppForm, name: e.target.value})} className="border border-blue-300 p-1 rounded w-full mt-3 text-center text-sm font-bold focus:ring-1 focus:ring-blue-500" />
                     ) : (
                       <div className="mt-3 text-center">
                         <h3 className="font-bold text-gray-900">{selectedApp.name}</h3>
                         <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                           selectedApp.candidateType === 'Experienced'
                             ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                             : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                         }`}>
                           {selectedApp.candidateType === 'Experienced' ? '💼 Experienced' : '🎓 Fresher'}
                         </span>
                       </div>
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
                        <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedApp.resumeUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded text-xs font-bold mb-2 hover:bg-blue-100">
                          <FileText size={14} /> View Resume
                        </a>
                      )}
                      {selectedApp.profilePhotoUrl && (
                        <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedApp.profilePhotoUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-700 rounded text-xs font-bold mb-2 hover:bg-emerald-100">
                          <FileText size={14} /> View Candidate Photo
                        </a>
                      )}
                      {selectedApp.salarySlipUrl && (
                        <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedApp.salarySlipUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded text-xs font-bold mb-2 hover:bg-green-100">
                          <FileText size={14} /> View Salary Slip
                        </a>
                      )}
                      {selectedApp.experienceLetterUrl && (
                        <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedApp.experienceLetterUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-indigo-50 text-indigo-700 rounded text-xs font-bold mb-2 hover:bg-indigo-100">
                          <FileText size={14} /> View Experience Letter
                        </a>
                      )}
                      {selectedApp.relievingLetterUrl && (
                        <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedApp.relievingLetterUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-amber-50 text-amber-700 rounded text-xs font-bold mb-2 hover:bg-amber-100">
                          <FileText size={14} /> View Relieving Letter
                        </a>
                      )}
                      {selectedApp.coverLetterUrl && (
                        <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedApp.coverLetterUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-purple-50 text-purple-700 rounded text-xs font-bold hover:bg-purple-100">
                          <FileText size={14} /> View Cover Letter
                        </a>
                      )}
                      {!selectedApp.resumeUrl && !selectedApp.profilePhotoUrl && !selectedApp.salarySlipUrl && !selectedApp.experienceLetterUrl && !selectedApp.relievingLetterUrl && !selectedApp.coverLetterUrl && (
                        <p className="text-xs text-gray-400 italic">No documents attached.</p>
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
                        <option value="Interview">Interview</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Hired">Hired (Generates Onboarding)</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      {/* Onboarding Link Display if Hired */}
                      {selectedApp.status === 'Hired' && (selectedApp.employeeId || selectedApp.onboardingStatus) && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <p className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-1">
                            <CheckCircle2 size={13} /> Onboarding Link Generated
                          </p>
                          <div className="flex gap-2 items-center mt-2">
                            <input
                              type="text"
                              readOnly
                              value={`${window.location.origin}/onboarding/${selectedApp.employeeId?._id || selectedApp.employeeId || ''}`}
                              className="w-full bg-white border border-emerald-300 px-2 py-1 rounded text-xs text-gray-700"
                            />
                            <button
                              onClick={() => {
                                const link = `${window.location.origin}/onboarding/${selectedApp.employeeId?._id || selectedApp.employeeId || ''}`;
                                navigator.clipboard.writeText(link);
                                toast.success('Onboarding link copied!');
                              }}
                              title="Copy Link"
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 shrink-0"
                            >
                              <Copy size={12} /> Copy
                            </button>
                          </div>
                        </div>
                      )}
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
                    )) : (
                      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg p-3 text-center">
                        <p className="text-xs text-slate-500 font-medium">
                          {selectedApp.candidateType === 'Fresher'
                            ? '🎓 Candidate applied as a Fresher (No prior work experience required)'
                            : 'No prior experience provided.'}
                        </p>
                      </div>
                    )}
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

      {/* Assignment Modal (Single or Bulk) */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900">
                {assigningApp ? `Assign ${assigningApp.name}` : `Bulk Assign (${selectedAppIds.length})`}
              </h3>
              <button onClick={() => { setShowAssignModal(false); setAssigningApp(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Select the employee/HR responsible for processing {assigningApp ? 'this candidate' : 'these selected candidates'}.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Assign To Employee / HR *</label>
              <select
                value={targetEmployeeId}
                onChange={(e) => setTargetEmployeeId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="">Select HR Executive / Manager / Employee...</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.designation || emp.role || 'Employee'}) - Zone: {emp.zone || 'ALL'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowAssignModal(false); setAssigningApp(null); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={assigningApp ? handleSingleAssign : handleBulkAssign}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
