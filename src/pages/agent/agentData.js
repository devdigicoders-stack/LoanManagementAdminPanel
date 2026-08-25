export const statusColors = {
  "New": { bg: "#EEF2FF", text: "#4338CA" },
  "Contacted": { bg: "#E0F2FE", text: "#0369A1" },
  "Interested": { bg: "#DCFCE7", text: "#15803D" },
  "Visit Scheduled": { bg: "#FEF3C7", text: "#D97706" },
  "Visit Completed": { bg: "#F3E8FF", text: "#7E22CE" },
  "Follow-up": { bg: "#FFEDD5", text: "#C2410C" },
  "Documents Pending": { bg: "#FEF9C3", text: "#CA8A04" },
  "Application Submitted": { bg: "#DBEAFE", text: "#1D4ED8" },
  "Converted": { bg: "#D1FAE5", text: "#059669" },
  "Lost": { bg: "#FEE2E2", text: "#DC2626" },
};

export const priorityColors = {
  "High": { bg: "#FEE2E2", text: "#DC2626" },
  "Medium": { bg: "#FEF3C7", text: "#D97706" },
  "Low": { bg: "#F1F5F9", text: "#64748B" },
};

export const applicationStatusColors = {
  "Submitted": { bg: "#DBEAFE", text: "#1D4ED8" },
  "Documents Pending": { bg: "#FEF9C3", text: "#CA8A04" },
  "Verification": { bg: "#FFEDD5", text: "#C2410C" },
  "Under Review": { bg: "#FEF3C7", text: "#D97706" },
  "On Hold": { bg: "#FEE2E2", text: "#DC2626" },
  "Approved": { bg: "#DCFCE7", text: "#15803D" },
  "Rejected": { bg: "#FEE2E2", text: "#DC2626" },
  "Completed": { bg: "#D1FAE5", text: "#059669" },
};

export const mockAgentLeads = [
  {
    id: "LD-10245",
    customerName: "Rahul Kumar",
    mobile: "+91 9876543210",
    altMobile: "+91 9876543211",
    email: "rahul.kumar@email.com",
    address: "B-12, Green Park",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110016",
    occupation: "Salaried",
    company: "TCS",
    income: 85000,
    loanType: "Home Loan",
    amount: 5000000,
    purpose: "Buying new flat",
    tenure: "20 Years",
    existingLoan: "No",
    status: "Interested",
    priority: "High",
    assignedDate: "24 Aug 2026",
    assignedBy: "Super Admin",
    lastActivity: "25 Aug 2026",
    nextFollowup: "26 Aug 2026",
    source: "Website"
  },
  {
    id: "LD-10246",
    customerName: "Amit Singh",
    mobile: "+91 9123456780",
    altMobile: "",
    email: "amit.s@email.com",
    address: "Plot 45, Sector 15",
    city: "Noida",
    state: "UP",
    pincode: "201301",
    occupation: "Business",
    company: "Amit Traders",
    income: 150000,
    loanType: "LAP",
    amount: 15000000,
    purpose: "Business Expansion",
    tenure: "15 Years",
    existingLoan: "Car Loan",
    status: "Visit Scheduled",
    priority: "Medium",
    assignedDate: "23 Aug 2026",
    assignedBy: "Sales Admin",
    lastActivity: "25 Aug 2026",
    nextFollowup: "27 Aug 2026",
    source: "Referral"
  },
  {
    id: "LD-10247",
    customerName: "Priya Sharma",
    mobile: "+91 9988776655",
    altMobile: "",
    email: "priya.sharma@email.com",
    address: "Flat 101, Elite Towers",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122018",
    occupation: "Salaried",
    company: "Google",
    income: 200000,
    loanType: "Personal Loan",
    amount: 800000,
    purpose: "Medical Emergency",
    tenure: "3 Years",
    existingLoan: "No",
    status: "Application Submitted",
    priority: "High",
    assignedDate: "20 Aug 2026",
    assignedBy: "Super Admin",
    lastActivity: "25 Aug 2026",
    nextFollowup: "-",
    source: "Mobile App"
  },
  {
    id: "LD-10248",
    customerName: "Vikas Verma",
    mobile: "+91 8877665544",
    altMobile: "",
    email: "vikas.v@email.com",
    address: "H-56, Phase 2",
    city: "Noida",
    state: "UP",
    pincode: "201305",
    occupation: "Self Employed",
    company: "Vikas Consultancy",
    income: 95000,
    loanType: "Business Loan",
    amount: 1200000,
    purpose: "Working Capital",
    tenure: "5 Years",
    existingLoan: "Personal Loan",
    status: "Documents Pending",
    priority: "Low",
    assignedDate: "21 Aug 2026",
    assignedBy: "Sales Admin",
    lastActivity: "24 Aug 2026",
    nextFollowup: "28 Aug 2026",
    source: "Walk-in"
  },
  {
    id: "LD-10249",
    customerName: "Neha Gupta",
    mobile: "+91 7766554433",
    altMobile: "",
    email: "neha.g@email.com",
    address: "Villa 12, Rose Gardens",
    city: "Delhi",
    state: "Delhi",
    pincode: "110020",
    occupation: "Salaried",
    company: "HDFC Bank",
    income: 120000,
    loanType: "Home Loan",
    amount: 7500000,
    purpose: "Property Purchase",
    tenure: "25 Years",
    existingLoan: "No",
    status: "New",
    priority: "Medium",
    assignedDate: "25 Aug 2026",
    assignedBy: "Sales Admin",
    lastActivity: "-",
    nextFollowup: "25 Aug 2026",
    source: "Website"
  }
];

export const mockCustomerVisits = [
  {
    id: "VS-5001",
    leadId: "LD-10246",
    customerName: "Amit Singh",
    mobile: "+91 9123456780",
    date: "25 Aug 2026",
    time: "14:30 PM",
    location: "Plot 45, Sector 15, Noida",
    purpose: "Property Visit",
    status: "Scheduled"
  },
  {
    id: "VS-5002",
    leadId: "LD-10245",
    customerName: "Rahul Kumar",
    mobile: "+91 9876543210",
    date: "24 Aug 2026",
    time: "11:00 AM",
    location: "B-12, Green Park, New Delhi",
    purpose: "Document Collection",
    status: "Completed"
  },
  {
    id: "VS-5003",
    leadId: "LD-10248",
    customerName: "Vikas Verma",
    mobile: "+91 8877665544",
    date: "26 Aug 2026",
    time: "16:00 PM",
    location: "H-56, Phase 2, Noida",
    purpose: "Loan Discussion",
    status: "Scheduled"
  }
];

export const mockFollowups = [
  {
    id: "FU-3001",
    leadId: "LD-10245",
    customerName: "Rahul Kumar",
    date: "26 Aug 2026",
    time: "10:30 AM",
    type: "Call",
    purpose: "Confirm documents collection",
    status: "Pending",
    lastActivity: "25 Aug 2026"
  },
  {
    id: "FU-3002",
    leadId: "LD-10246",
    customerName: "Amit Singh",
    date: "27 Aug 2026",
    time: "12:00 PM",
    type: "Visit",
    purpose: "Property Inspection",
    status: "Pending",
    lastActivity: "25 Aug 2026"
  },
  {
    id: "FU-3003",
    leadId: "LD-10248",
    customerName: "Vikas Verma",
    date: "28 Aug 2026",
    time: "15:00 PM",
    type: "Call",
    purpose: "Remind about pending ITR documents",
    status: "Pending",
    lastActivity: "24 Aug 2026"
  },
  {
    id: "FU-3004",
    leadId: "LD-10247",
    customerName: "Priya Sharma",
    date: "24 Aug 2026",
    time: "14:00 PM",
    type: "Call",
    purpose: "Application Update",
    status: "Completed",
    lastActivity: "24 Aug 2026"
  }
];

export const mockApplications = [
  {
    id: "APP-8001",
    leadId: "LD-10247",
    customerName: "Priya Sharma",
    loanType: "Personal Loan",
    amount: 800000,
    submittedDate: "22 Aug 2026",
    status: "Under Review",
    lastUpdated: "24 Aug 2026"
  },
  {
    id: "APP-8002",
    leadId: "LD-10201",
    customerName: "Sanjay Mishra",
    loanType: "Home Loan",
    amount: 4500000,
    submittedDate: "15 Aug 2026",
    status: "Approved",
    lastUpdated: "20 Aug 2026"
  },
  {
    id: "APP-8003",
    leadId: "LD-10190",
    customerName: "Kavita Reddy",
    loanType: "Business Loan",
    amount: 2500000,
    submittedDate: "18 Aug 2026",
    status: "Verification",
    lastUpdated: "23 Aug 2026"
  }
];

export const mockNotifications = [
  {
    id: 1,
    title: "New Lead Assigned",
    message: "A new lead (LD-10249) has been assigned to you.",
    time: "10 mins ago",
    read: false,
    icon: "Target",
    color: "#1e7ba8"
  },
  {
    id: 2,
    title: "Visit Reminder",
    message: "Your customer visit with Amit Singh is scheduled for today at 14:30 PM.",
    time: "1 hour ago",
    read: false,
    icon: "MapPin",
    color: "#D97706"
  },
  {
    id: 3,
    title: "Application Update",
    message: "Application APP-8001 has moved to Under Review.",
    time: "1 day ago",
    read: true,
    icon: "FileText",
    color: "#15803D"
  }
];
