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

const getZoneFromState = (stateName) => {
 if (!stateName) return null;
 const cleanState = stateName.trim().toUpperCase();
 for (const [zone, states] of Object.entries(ZONE_STATES_MAP)) {
   if (states.some(s => cleanState.includes(s) || s.includes(cleanState))) {
     return zone;
   }
 }
 return null;
};

// ── Searchable single-select dropdown ──────────────────────────────────────
const SearchableSelect = ({ label, value, onChange, options, placeholder, required, extraHeader }) => {
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
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-bold text-gray-700">{label}{required && ' *'}</label>
        {extraHeader}
      </div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-300 hover:border-blue-400 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-left shadow-sm min-h-[38px] transition-all"
      >
        <span className={`truncate ${value ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-400 shrink-0 ml-1.5 transition-transform duration-200 ${open ? 'rotate-180 text-blue-600' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-2 border-b border-gray-100 bg-gray-50/70">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48 divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-xs text-gray-400 text-center italic">No matching results</div>
            ) : filtered.map((opt, i) => (
              <div
                key={i}
                onClick={() => handleSelect(opt)}
                className={`px-3 py-2 text-xs sm:text-sm cursor-pointer transition-colors flex items-center justify-between ${
                  value === opt ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="truncate">{opt}</span>
                {value === opt && <CheckCircle2 size={15} className="text-blue-600 shrink-0 ml-2" />}
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
 const isHRHeadOnly = userRole.includes('hr head') || userRole.includes('hr_head') || userRole.includes('hr admin') || userDesig.includes('hr head');
  const isHRManagerOnly = userRole.includes('hr manager') || userRole.includes('hr_manager') || userDesig.includes('hr manager');
  const isHRLead = isHRHeadOnly || isHRManagerOnly;
  const isHRHead = isHRHeadOnly;
  const isHRManager = isHRManagerOnly;
  const isExecutive = !isMasterAdmin && !isHRLead && (userRole.includes('executive') || userDesig.includes('executive'));
  const rawZone = currentUser.zone || localStorage.getItem('userZone');
  const userZone = (rawZone && rawZone !== 'ALL') ? rawZone.toUpperCase() : (isExecutive ? 'SOUTH' : 'ALL');
  const canAssignApplications = (isHRLead || isMasterAdmin);

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
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recruitment/assignable-staff`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : (data.staff || []));
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
 body: JSON.stringify({ ...jobForm, openings: Math.max(1, parseInt(jobForm.openings, 10) || 1) })
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
    // 🔒 Lock: cannot change status once Hired or Rejected
    const currentApp = applications.find(a => a._id === id) || selectedApp;
    if (currentApp && (currentApp.status === 'Hired' || currentApp.status === 'Rejected')) {
      toast.error(`Status is locked — cannot change after being marked "${currentApp.status}"`);
      return;
    }

    // Instant UI reflection
    if (selectedApp && selectedApp._id === id) {
      setSelectedApp(prev => ({ ...prev, status: newStatus }));
    }
    setApplications(prev => prev.map(app => app._id === id ? { ...app, status: newStatus } : app));

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
      const data = await res.json();
      if (res.ok) {
        toast.success('Status updated');
        if (data.application) {
          if (selectedApp && selectedApp._id === id) {
            setSelectedApp(prev => ({ ...prev, ...data.application }));
          }
          setApplications(prev => prev.map(app => app._id === id ? { ...app, ...data.application } : app));
        }
        fetchApplications();
        fetchJobs();
      } else {
        toast.error(data.message || 'Failed to update status');
        fetchApplications();
      }
    } catch (err) {
      toast.error('Failed to update status');
      fetchApplications();
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

 
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse min-w-[1100px]">
 <thead>
 <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
 
 <th className="py-3 px-4 whitespace-nowrap">App No & Candidate</th>
 <th className="py-3 px-4 whitespace-nowrap">Job Zone & Location</th>
                  <th className="py-3 px-4 whitespace-nowrap">Applicant Zone & Location</th>
 <th className="py-3 px-4 whitespace-nowrap">Applied For</th>
 <th className="py-3 px-4 whitespace-nowrap">Contact</th>
 
 <th className="py-3 px-4 whitespace-nowrap">Date</th>
 <th className="py-3 px-4 whitespace-nowrap">Status</th>
 <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100 text-sm">
 {paginatedApplications.map(app => (
 <tr key={app._id} className="hover:bg-blue-50/50 transition-colors">
 
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
 <div className="text-xs space-y-0.5 mt-0.5">
                        <span className="text-gray-500 block">Exp CTC: <strong className="text-gray-700 font-semibold">{app.expectedSalary ? (app.expectedSalary.toString().startsWith('₹') ? app.expectedSalary : `₹${app.expectedSalary}`) : 'N/A'}</strong></span>
                        {app.status === 'Hired' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Offered: {app.employeeId?.grossMonthly ? `₹${Number(app.employeeId.grossMonthly).toLocaleString('en-IN')}/mo` : (app.monthlyNetSalary ? `₹${Number(app.monthlyNetSalary).toLocaleString('en-IN')}/mo` : (app.yearlyGrossSalary ? `₹${app.yearlyGrossSalary}/yr` : 'Fixed / In Onboarding'))}
                          </span>
                        )}
                      </div>
 </td>
                  {/* Job Target Zone & Office Location */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border whitespace-nowrap ${
                        (app.jobId?.zone || app.zone) === 'NORTH' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                        (app.jobId?.zone || app.zone) === 'SOUTH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        (app.jobId?.zone || app.zone) === 'EAST' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        (app.jobId?.zone || app.zone) === 'WEST' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        <Briefcase size={10} /> Job: {app.jobId?.zone || app.zone || 'NORTH'}
                      </span>
                      <div className="text-[11.5px] text-gray-700 font-semibold flex items-center gap-1 whitespace-nowrap">
                        <MapPin size={11} className="text-gray-400 shrink-0" />
                        <span>{app.jobId?.location || 'Head Office / Base'}</span>
                      </div>
                    </div>
                  </td>

                  {/* Applicant Origin Zone & Address (District, State) */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border whitespace-nowrap ${
                        (getZoneFromState(app.state) || app.zone) === 'NORTH' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                        (getZoneFromState(app.state) || app.zone) === 'SOUTH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        (getZoneFromState(app.state) || app.zone) === 'EAST' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        (getZoneFromState(app.state) || app.zone) === 'WEST' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        <Users size={10} /> Applicant: {getZoneFromState(app.state) || app.zone || 'NORTH'}
                      </span>
                      <div className="text-[11.5px] text-gray-700 font-medium flex items-center gap-1 whitespace-nowrap">
                        <MapPin size={11} className="text-blue-500 shrink-0" />
                        <span>{[app.district || app.area, app.state].filter(Boolean).join(', ') || app.state || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
 <td className="py-3 px-4 whitespace-nowrap">
 <span className="font-bold text-blue-600 block">{app.jobId?.title || 'Unknown Job'}</span>
 </td>
 <td className="py-3 px-4 whitespace-nowrap">
 <div className="text-xs font-medium text-gray-700">{app.email}</div>
 <div className="text-xs text-gray-500">{app.phone}</div>
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
 <td colSpan="7" className="text-center py-12 text-gray-500">
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

                <SearchableSelect
                  label="Position / Designation"
                  required
                  value={jobForm.designation}
                  onChange={val => {
                    setJobForm({
                      ...jobForm,
                      designation: val,
                      title: jobForm.title === jobForm.designation || !jobForm.title ? val : jobForm.title
                    });
                  }}
                  options={(designations.filter(d => d.department === jobForm.department).length > 0
                    ? designations.filter(d => d.department === jobForm.department).map(d => d.name)
                    : (DEPARTMENT_DESIGNATIONS[jobForm.department] || [])
                  )}
                  placeholder="Search and select designation"
                  extraHeader={(
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
                  )}
                />

 <div>
 <label className="block text-xs font-bold text-gray-700 mb-1">Job Title *</label>
 <input
 required
 type="text"
 placeholder="e.g. HAUS NUO-Pay Offer- Liability"
 value={jobForm.title}
 onChange={e=>setJobForm({...jobForm, title: e.target.value})}
 className="w-full border border-gray-300 hover:border-blue-400 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-gray-900 shadow-sm h-[38px] transition-all"
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
 className="w-full border border-gray-300 hover:border-blue-400 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none font-bold text-gray-800 shadow-sm h-[38px] transition-all"
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
 <select value={jobForm.status} onChange={e=>setJobForm({...jobForm, status: e.target.value})} className="w-full border border-gray-300 hover:border-blue-400 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none text-gray-900 shadow-sm h-[38px] transition-all">
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
 <input type="number" min="1" value={jobForm.openings} onChange={e=>setJobForm({...jobForm, openings: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-blue-500" />
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
 <div className="flex items-center gap-3">
 <h2 className="text-lg font-bold text-gray-900">{selectedApp.name}'s Profile</h2>
 <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
 (selectedApp.employeeId?.onboardingStatus === 'Done' || selectedApp.onboardingStatus === 'Done')
 ? 'bg-green-100 text-green-700 border border-green-200'
 : (selectedApp.employeeId?.onboardingStatus === 'Submitted' || selectedApp.onboardingStatus === 'Submitted')
 ? 'bg-blue-100 text-blue-700 border border-blue-200'
 : selectedApp.status === 'Hired'
 ? 'bg-amber-100 text-amber-700 border border-amber-200'
 : 'bg-gray-100 text-gray-600'
 }`}>
 Onboarding: {(selectedApp.employeeId?.onboardingStatus || selectedApp.onboardingStatus || (selectedApp.status === 'Hired' ? 'Pending' : 'Not Initiated'))}
 </span>
 </div>
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
 {selectedApp.candidateType === 'Experienced' ? ' Experienced' : ' Fresher'}
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
 <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">Father:</span> {isEditingApp ? <input type="text" value={editAppForm.fatherName || ''} onChange={e=>setEditAppForm({...editAppForm, fatherName: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate font-medium text-gray-800">{selectedApp.fatherName || 'N/A'}</span>}</div>
 <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">Mother:</span> {isEditingApp ? <input type="text" value={editAppForm.motherName || ''} onChange={e=>setEditAppForm({...editAppForm, motherName: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate font-medium text-gray-800">{selectedApp.motherName || 'N/A'}</span>}</div>
 <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">Marital:</span> {isEditingApp ? <input type="text" value={editAppForm.maritalStatus || ''} onChange={e=>setEditAppForm({...editAppForm, maritalStatus: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate font-medium text-gray-800">{selectedApp.maritalStatus || 'Single'}</span>}</div>
 {(isEditingApp || selectedApp.spouseName) && (
 <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">Spouse:</span> {isEditingApp ? <input type="text" value={editAppForm.spouseName || ''} onChange={e=>setEditAppForm({...editAppForm, spouseName: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate font-medium text-gray-800">{selectedApp.spouseName}</span>}</div>
 )}
 {(isEditingApp || selectedApp.dob) && (
 <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">DOB:</span> {isEditingApp ? <input type="date" value={editAppForm.dob || ''} onChange={e=>setEditAppForm({...editAppForm, dob: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate font-medium text-gray-800">{selectedApp.dob}</span>}</div>
 )}
 {(isEditingApp || selectedApp.gender) && (
 <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">Gender:</span> {isEditingApp ? <input type="text" value={editAppForm.gender || ''} onChange={e=>setEditAppForm({...editAppForm, gender: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate font-medium text-gray-800">{selectedApp.gender}</span>}</div>
 )}
 {(isEditingApp || selectedApp.religion) && (
 <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">Religion:</span> {isEditingApp ? <input type="text" value={editAppForm.religion || ''} onChange={e=>setEditAppForm({...editAppForm, religion: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate font-medium text-gray-800">{selectedApp.religion}</span>}</div>
 )}
 <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">Nationality:</span> {isEditingApp ? <input type="text" value={editAppForm.nationality || ''} onChange={e=>setEditAppForm({...editAppForm, nationality: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate font-medium text-gray-800">{selectedApp.nationality || 'Indian'}</span>}</div>
 {(isEditingApp || selectedApp.alternatePhone) && (
 <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">Alt Phone:</span> {isEditingApp ? <input type="text" value={editAppForm.alternatePhone || ''} onChange={e=>setEditAppForm({...editAppForm, alternatePhone: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate font-medium text-gray-800">{selectedApp.alternatePhone}</span>}</div>
 )}
 <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">PAN:</span> {isEditingApp ? <input type="text" value={editAppForm.pan || ''} onChange={e=>setEditAppForm({...editAppForm, pan: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate font-mono font-bold text-gray-800">{selectedApp.pan || 'N/A'}</span>}</div>
 <div className="text-xs text-gray-600 flex justify-between items-center"><span className="font-semibold text-gray-900 mr-2">Aadhaar:</span> {isEditingApp ? <input type="text" value={editAppForm.aadhaar || ''} onChange={e=>setEditAppForm({...editAppForm, aadhaar: e.target.value})} className="border border-blue-300 p-1 rounded text-xs w-2/3 focus:ring-1 focus:ring-blue-500" /> : <span className="text-right truncate font-mono font-bold text-gray-800">{selectedApp.aadhaar || 'N/A'}</span>}</div>
 </div>
 </div>

 <div className="p-4 border border-gray-200 rounded-xl space-y-2">
 <div className="flex items-center justify-between mb-1">
 <h4 className="text-sm font-bold text-gray-900">Documents</h4>
 {selectedApp.employeeId?.documents && selectedApp.employeeId.documents.length > 0 && (
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
 selectedApp.employeeId.documents.every(d => d.status === 'Verified')
 ? 'bg-green-100 text-green-700 border border-green-200'
 : 'bg-amber-100 text-amber-700 border border-amber-200'
 }`}>
 {selectedApp.employeeId.documents.filter(d => d.status === 'Verified').length}/{selectedApp.employeeId.documents.length} Verified
 </span>
 )}
 </div>
 {selectedApp.resumeUrl && (
 <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedApp.resumeUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded text-xs font-bold hover:bg-blue-100">
 <FileText size={14} /> Resume
 </a>
 )}
 {selectedApp.profilePhotoUrl && (
 <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedApp.profilePhotoUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-700 rounded text-xs font-bold hover:bg-emerald-100">
 <FileText size={14} /> Candidate Photo
 </a>
 )}
 {selectedApp.salarySlipUrl && (
 <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedApp.salarySlipUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded text-xs font-bold hover:bg-green-100">
 <FileText size={14} /> Salary Slip
 </a>
 )}
 {selectedApp.experienceLetterUrl && (
 <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedApp.experienceLetterUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-indigo-50 text-indigo-700 rounded text-xs font-bold hover:bg-indigo-100">
 <FileText size={14} /> Experience Letter
 </a>
 )}
 {selectedApp.relievingLetterUrl && (
 <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedApp.relievingLetterUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-amber-50 text-amber-700 rounded text-xs font-bold hover:bg-amber-100">
 <FileText size={14} /> Relieving Letter
 </a>
 )}
 {selectedApp.coverLetterUrl && (
 <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${selectedApp.coverLetterUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-purple-50 text-purple-700 rounded text-xs font-bold hover:bg-purple-100">
 <FileText size={14} /> Cover Letter
 </a>
 )}
 {selectedApp.employeeId?.documents && selectedApp.employeeId.documents.length > 0 && selectedApp.employeeId.documents.map((doc, dIdx) => (
 <div key={dIdx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-xs">
 <div className="flex items-center gap-1.5 truncate">
 <FileText size={13} className="text-slate-500 shrink-0" />
 {doc.fileUrl ? (
 <a href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${doc.fileUrl}`} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline truncate">
 {doc.name || 'Document'}
 </a>
 ) : (
 <span className="font-semibold text-slate-700 truncate">{doc.name || 'Document'}</span>
 )}
 </div>
 <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ${
 doc.status === 'Verified' ? 'bg-green-100 text-green-700' :
 doc.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'
 }`}>
 {doc.status || 'Pending'}
 </span>
 </div>
 ))}
 {!selectedApp.resumeUrl && !selectedApp.profilePhotoUrl && !selectedApp.salarySlipUrl && !selectedApp.experienceLetterUrl && (!selectedApp.employeeId?.documents || selectedApp.employeeId.documents.length === 0) && (
 <p className="text-xs text-gray-400 italic">No documents attached.</p>
 )}
 </div>
 
 <div className="p-4 border border-gray-200 rounded-xl">
 <h4 className="text-sm font-bold text-gray-900 mb-2">Update Status</h4>
 {(selectedApp.status === 'Hired' || selectedApp.status === 'Rejected') ? (
   <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-bold ${
     selectedApp.status === 'Hired'
       ? 'bg-green-50 border-green-300 text-green-800'
       : 'bg-red-50 border-red-300 text-red-800'
   }`}>
     <span>🔒</span>
     <span>Status Locked: <span className="uppercase">{selectedApp.status}</span></span>
     <span className="ml-auto text-xs font-normal opacity-70">Cannot be changed</span>
   </div>
 ) : (
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
 )}
 </div>


 {/* Onboarding Link Display if Hired */}
 {selectedApp.status === 'Hired' && (selectedApp.employeeId || selectedApp.onboardingStatus) && (
 <div className={`mt-3 p-3 rounded-lg border ${
 selectedApp.onboardingStatus === 'Done' 
 ? 'bg-blue-50 border-blue-200' 
 : 'bg-emerald-50 border-emerald-200'
 }`}>
 {selectedApp.onboardingStatus === 'Done' ? (
 <div>
 <p className="text-xs font-bold text-blue-800 flex items-center gap-1.5 mb-1">
 <CheckCircle2 size={14} className="text-blue-600" /> Onboarding Completed
 </p>
 <div className="flex items-center gap-2 mt-2">
 <span className="px-2.5 py-1 bg-blue-100 text-blue-700 font-bold rounded text-xs">
 Form Submitted (Link Disabled)
 </span>
 </div>
 </div>
 ) : (
 <div>
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
 )}
 </div>


 {/* Right Col - Experience & Education */}
          <div className="col-span-2 space-y-6">
            
            {/* Zone & Location Matching Comparison Banner */}
            <div className="bg-gradient-to-r from-slate-50 via-blue-50/40 to-indigo-50/30 border border-blue-200/80 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-blue-100 pb-2 mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <MapPin size={14} className="text-blue-600" /> Zone & Location Routing Mapping
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-blue-100">
                  Target Zone vs Applicant Origin
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Job Posting Target */}
                <div className="bg-white rounded-lg p-3 border border-blue-200/70 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase text-gray-500">Job Target Zone</span>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded border ${
                      (selectedApp.jobId?.zone || selectedApp.zone) === 'NORTH' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                      (selectedApp.jobId?.zone || selectedApp.zone) === 'SOUTH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      (selectedApp.jobId?.zone || selectedApp.zone) === 'EAST' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      (selectedApp.jobId?.zone || selectedApp.zone) === 'WEST' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      <Briefcase size={10} className="inline mr-1" />
                      {selectedApp.jobId?.zone || selectedApp.zone || 'NORTH'} ZONE
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Building size={13} className="text-blue-600 shrink-0" />
                    <span>{selectedApp.jobId?.location || 'Base / Head Office'}</span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Job: <strong className="text-gray-700">{selectedApp.jobId?.title || 'Open Position'}</strong>
                  </p>
                </div>

                {/* Candidate Origin Location */}
                <div className="bg-white rounded-lg p-3 border border-indigo-200/70 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase text-gray-500">Applicant Origin Zone</span>
                    <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded border ${
                      (getZoneFromState(selectedApp.state) || selectedApp.zone) === 'NORTH' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                      (getZoneFromState(selectedApp.state) || selectedApp.zone) === 'SOUTH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      (getZoneFromState(selectedApp.state) || selectedApp.zone) === 'EAST' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      (getZoneFromState(selectedApp.state) || selectedApp.zone) === 'WEST' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      <Users size={10} className="inline mr-1" />
                      {getZoneFromState(selectedApp.state) || selectedApp.zone || 'NORTH'} ZONE
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <MapPin size={13} className="text-indigo-600 shrink-0" />
                    <span>{[selectedApp.district || selectedApp.area, selectedApp.state].filter(Boolean).join(', ') || selectedApp.state || 'Address not specified'}</span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    PIN: <strong className="text-gray-700">{selectedApp.pincode || 'N/A'}</strong> • State: <strong className="text-gray-700">{selectedApp.state || 'N/A'}</strong>
                  </p>
                </div>
              </div>
            </div>
 
 <div>
 <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Salary & Expectations</h3>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Gross Yearly</p>
 {isEditingApp ? (
 <input type="text" value={editAppForm.yearlyGrossSalary || ''} onChange={e=>setEditAppForm({...editAppForm, yearlyGrossSalary: e.target.value})} className="border border-blue-300 p-1.5 rounded text-sm w-full font-bold focus:ring-1 focus:ring-blue-500" />
 ) : (
 <p className="text-sm font-bold text-gray-900">
 {selectedApp.yearlyGrossSalary ? (selectedApp.yearlyGrossSalary.startsWith('₹') ? selectedApp.yearlyGrossSalary : `₹${selectedApp.yearlyGrossSalary}`) : (selectedApp.experience?.[0]?.grossPay ? `₹${Number(selectedApp.experience[0].grossPay) * 12}/yr` : (selectedApp.candidateType === 'Fresher' ? 'Fresher (Standard)' : 'N/A'))}
 </p>
 )}
 </div>
 <div>
 <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Net Monthly</p>
 {isEditingApp ? (
 <input type="text" value={editAppForm.monthlyNetSalary || ''} onChange={e=>setEditAppForm({...editAppForm, monthlyNetSalary: e.target.value})} className="border border-blue-300 p-1.5 rounded text-sm w-full font-bold focus:ring-1 focus:ring-blue-500" />
 ) : (
 <p className="text-sm font-bold text-gray-900">
 {selectedApp.monthlyNetSalary ? (selectedApp.monthlyNetSalary.startsWith('₹') ? selectedApp.monthlyNetSalary : `₹${selectedApp.monthlyNetSalary}/mo`) : (selectedApp.experience?.[0]?.netPay ? `₹${selectedApp.experience[0].netPay}/mo` : (selectedApp.candidateType === 'Fresher' ? 'Fresher (Standard)' : 'N/A'))}
 </p>
 )}
 </div>
 <div>
 <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Expected Salary</p>
 {isEditingApp ? (
 <input type="text" value={editAppForm.expectedSalary || editAppForm.expectedMonthlySalary || ''} onChange={e=>setEditAppForm({...editAppForm, expectedSalary: e.target.value, expectedMonthlySalary: e.target.value})} className="border border-blue-300 p-1.5 rounded text-sm w-full font-bold text-blue-600 focus:ring-1 focus:ring-blue-500" />
 ) : (
 <p className="text-sm font-bold text-blue-600">
 {selectedApp.expectedSalary || selectedApp.expectedMonthlySalary ? ((selectedApp.expectedSalary || selectedApp.expectedMonthlySalary).startsWith('₹') ? (selectedApp.expectedSalary || selectedApp.expectedMonthlySalary) : `₹${selectedApp.expectedSalary || selectedApp.expectedMonthlySalary}/mo`) : 'Negotiable / Standard'}
 </p>
 )}
 </div>
 <div>
 <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Notice Period</p>
 {isEditingApp ? (
 <input type="text" value={editAppForm.noticePeriod || ''} onChange={e=>setEditAppForm({...editAppForm, noticePeriod: e.target.value})} className="border border-blue-300 p-1.5 rounded text-sm w-full font-bold text-orange-600 focus:ring-1 focus:ring-blue-500" />
 ) : (
 <p className="text-sm font-bold text-orange-600">
 {selectedApp.noticePeriod || selectedApp.experience?.[0]?.noticePeriod || (selectedApp.joinedComfortableDate ? `Immediate (From ${selectedApp.joinedComfortableDate})` : (selectedApp.candidateType === 'Fresher' ? 'Immediate Joiner' : 'Immediate'))}
 </p>
 )}
 </div>
 </div>
 </div>

 <div>
 <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 flex items-center gap-2"><Briefcase size={16}/> Experience</h3>
 {selectedApp.experience && selectedApp.experience.length > 0 ? selectedApp.experience.map((exp, idx) => (
 <div key={idx} className="mb-4 last:mb-0 bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
 <div className="flex justify-between items-start">
 <div>
 <h4 className="font-bold text-gray-900">{exp.title} <span className="text-gray-500 font-normal">at</span> {exp.company}</h4>
 {(exp.industry || exp.location) && (
 <p className="text-xs text-gray-500">{[exp.industry, exp.location].filter(Boolean).join(' • ')}</p>
 )}
 </div>
 {(exp.startDate || exp.endDate) && (
 <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
 <Calendar size={12}/> {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}
 </span>
 )}
 </div>

 {(exp.grossPay || exp.netPay || exp.startingSalary || exp.endingSalary) && (
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
 {exp.grossPay && <div><span className="text-gray-400 block text-[10px] uppercase font-bold">Gross Pay</span><span className="font-bold text-gray-800">₹{exp.grossPay}/mo</span></div>}
 {exp.netPay && <div><span className="text-gray-400 block text-[10px] uppercase font-bold">Net Pay</span><span className="font-bold text-gray-800">₹{exp.netPay}/mo</span></div>}
 {exp.startingSalary && <div><span className="text-gray-400 block text-[10px] uppercase font-bold">Start Salary</span><span className="font-bold text-gray-800">₹{exp.startingSalary}</span></div>}
 {exp.endingSalary && <div><span className="text-gray-400 block text-[10px] uppercase font-bold">End Salary</span><span className="font-bold text-gray-800">₹{exp.endingSalary}</span></div>}
 </div>
 )}

 {(exp.rmName || exp.rmPhone || exp.rmEmail) && (
 <div className="bg-sky-50/60 border border-sky-100 rounded-lg p-2 text-xs text-slate-700">
 <span className="font-bold text-sky-900 block text-[10px] uppercase">Reporting Manager (RM)</span>
 <p className="font-medium text-slate-800">{exp.rmName} {exp.rmDesignation ? `(${exp.rmDesignation})` : ''}</p>
 <p className="text-slate-500 text-[11px]">{[exp.rmPhone, exp.rmEmail].filter(Boolean).join(' • ')}</p>
 </div>
 )}

 {exp.responsibilitiesSummary && (
 <div>
 <span className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">Responsibilities</span>
 <p className="text-xs text-gray-700 bg-white p-2 rounded border border-gray-100">{exp.responsibilitiesSummary}</p>
 </div>
 )}

 {exp.summary && !exp.responsibilitiesSummary && (
 <p className="text-xs text-gray-700 bg-white p-2 rounded border border-gray-100">{exp.summary}</p>
 )}

 {exp.reasonOfLeaving && (
 <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200/60 rounded p-1.5">
 <strong>Reason of Leaving:</strong> {exp.reasonOfLeaving}
 </p>
 )}
 </div>
 )) : (
 <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg p-3 text-center">
 <p className="text-xs text-slate-500 font-medium">
 {selectedApp.candidateType === 'Fresher'
 ? ' Candidate applied as a Fresher (No prior work experience required)'
 : 'No prior experience provided.'}
 </p>
 </div>
 )}
 </div>

 <div>
 <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 flex items-center gap-2"><Building size={16}/> Education</h3>
 {selectedApp.education && selectedApp.education.length > 0 ? selectedApp.education.map((edu, idx) => (
 <div key={idx} className="mb-3 last:mb-0 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
 <div className="flex justify-between items-start">
 <h4 className="font-bold text-gray-900 text-sm">{edu.degree} {edu.subject ? <span className="text-xs font-semibold text-blue-600 ml-1">({edu.subject})</span> : ''}</h4>
 {edu.passingYear && <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">Passing: {edu.passingYear}</span>}
 </div>
 <p className="text-xs font-semibold text-gray-700 mt-0.5">{edu.institution}</p>
 <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1.5">
 {(edu.percentage || edu.grade) && (
 <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
 {edu.percentage ? `Marks: ${edu.percentage}` : ''} {edu.grade ? `Grade: ${edu.grade}` : ''}
 </span>
 )}
 {(edu.startDate || edu.endDate) && <span className="flex items-center gap-1"><Calendar size={12}/> {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}</span>}
 {(edu.location || edu.districtState) && <span className="flex items-center gap-1"><MapPin size={12}/> {[edu.location, edu.districtState].filter(Boolean).join(', ')}</span>}
 </div>
 </div>
 )) : <p className="text-sm text-gray-500 italic">No education added.</p>}
 </div>
 
 <div>
 <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Address Details</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Present Address</p>
 {isEditingApp ? (
 <textarea value={editAppForm.presentAddress || ''} onChange={e=>setEditAppForm({...editAppForm, presentAddress: e.target.value})} className="border border-blue-300 p-2 rounded text-sm w-full focus:ring-1 focus:ring-blue-500" rows="2" />
 ) : (
 <p className="text-sm text-gray-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
 {selectedApp.presentAddress || [selectedApp.flatHouseFloor, selectedApp.societyName, selectedApp.landmark, selectedApp.area, selectedApp.district, selectedApp.state, selectedApp.pincode ? `PIN - ${selectedApp.pincode}` : ''].filter(Boolean).join(', ') || 'N/A'}
 </p>
 )}
 </div>
 <div>

 {/* Bank & Settlement Details - Unified display */}
 <div>
 <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Bank Details</h3>
 {selectedApp.employeeId?.bankAccNum ? (
 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
 <div><span className="text-gray-400 block text-[10px] uppercase font-bold">Bank Name</span><span className="font-bold text-gray-800">{selectedApp.employeeId.bankName || 'N/A'}</span></div>
 <div><span className="text-gray-400 block text-[10px] uppercase font-bold">Account Holder</span><span className="font-bold text-gray-800">{selectedApp.employeeId.bankAccName || selectedApp.name}</span></div>
 <div><span className="text-gray-400 block text-[10px] uppercase font-bold">Account Number</span><span className="font-mono font-bold text-gray-800">{selectedApp.employeeId.bankAccNum}</span></div>
 <div><span className="text-gray-400 block text-[10px] uppercase font-bold">IFSC Code</span><span className="font-mono font-bold text-blue-700">{selectedApp.employeeId.bankIfsc || 'N/A'}</span></div>
 <div><span className="text-gray-400 block text-[10px] uppercase font-bold">Account Type</span><span className="font-semibold text-gray-800">{selectedApp.employeeId.bankAccType || 'Savings'}</span></div>
 <div><span className="text-gray-400 block text-[10px] uppercase font-bold">Branch</span><span className="font-semibold text-gray-800">{selectedApp.employeeId.bankBranch || 'N/A'}</span></div>
 </div>
 ) : (
 <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400 italic">
 No bank details available yet (Pending submission by candidate)
 </div>
 )}
 </div>

 {/* Emergency & Professional References */}
 <div>
 <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">References</h3>
 {(selectedApp.employeeId?.ref1Name || selectedApp.employeeId?.ref2Name) ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {selectedApp.employeeId.ref1Name && (
 <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
 <span className="text-[10px] font-bold text-blue-600 uppercase block mb-1">Reference 1 ({selectedApp.employeeId.ref1Rel || 'Contact'})</span>
 <p className="font-bold text-gray-800">{selectedApp.employeeId.ref1Name} - {selectedApp.employeeId.ref1Mobile}</p>
 <p className="text-gray-500 text-[11px] mt-0.5">{selectedApp.employeeId.ref1Address}</p>
 </div>
 )}
 {selectedApp.employeeId.ref2Name && (
 <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
 <span className="text-[10px] font-bold text-blue-600 uppercase block mb-1">Reference 2 ({selectedApp.employeeId.ref2Rel || 'Contact'})</span>
 <p className="font-bold text-gray-800">{selectedApp.employeeId.ref2Name} - {selectedApp.employeeId.ref2Mobile}</p>
 <p className="text-gray-500 text-[11px] mt-0.5">{selectedApp.employeeId.ref2Address}</p>
 </div>
 )}
 </div>
 ) : (
 <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400 italic">
 No references added yet (Pending submission by candidate)
 </div>
 )}
 </div>
 <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Permanent Address</p>
 {isEditingApp ? (
 <textarea value={editAppForm.permanentAddress || ''} onChange={e=>setEditAppForm({...editAppForm, permanentAddress: e.target.value})} className="border border-blue-300 p-2 rounded text-sm w-full focus:ring-1 focus:ring-blue-500" rows="2" />
 ) : (
 <p className="text-sm text-gray-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
 {selectedApp.permanentAddress || selectedApp.presentAddress || [selectedApp.flatHouseFloor, selectedApp.societyName, selectedApp.landmark, selectedApp.area, selectedApp.district, selectedApp.state, selectedApp.pincode ? `PIN - ${selectedApp.pincode}` : ''].filter(Boolean).join(', ') || 'N/A'}
 </p>
 )}
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
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {assigningApp ? `Assign ${assigningApp.name}` : `Bulk Assign (${selectedAppIds.length})`}
                  </h3>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">
                    {isHRHead ? 'Assign candidates to HR Manager' : isHRManager ? 'Assign candidates to HR Executive' : 'Assign candidates'}
                  </p>
                </div>
                <button onClick={() => { setShowAssignModal(false); setAssigningApp(null); }} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                {isHRHead
                  ? 'As HR Head, assign applications to an HR Manager for their team/zone.'
                  : isHRManager
                  ? 'As HR Manager, assign applications to an HR Executive in your team.'
                  : 'Select staff member to process candidate application(s).'
                }
              </p>

              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isHRHead ? 'Select HR Manager *' : isHRManager ? 'Select HR Executive *' : 'Assign To *'}
                </label>
                <select
                  value={targetEmployeeId}
                  onChange={(e) => setTargetEmployeeId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="">
                    {isHRHead ? '-- Select HR Manager --' : isHRManager ? '-- Select HR Executive --' : '-- Select Staff --'}
                  </option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.designation || emp.role || 'Staff'}) {emp.zone ? `- Zone: ${emp.zone}` : ''}
                    </option>
                  ))}
                </select>
                {employees.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1.5 font-medium">
                    {isHRHead 
                      ? 'No active HR Managers found. Please ensure HR Managers exist.' 
                      : 'No active HR Executives found in your team.'
                    }
                  </p>
                )}
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
