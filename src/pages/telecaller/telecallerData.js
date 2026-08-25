// Shared mock data for telecaller panel
export const mockLeads = [
  {
    id: "LD-10245", customerName: "Amit Kumar", mobile: "9876543210",
    altMobile: "9123456780", email: "amit@email.com",
    address: "12, Sector 5, Gomti Nagar", city: "Lucknow", state: "Uttar Pradesh", pincode: "226010",
    occupation: "Salaried", company: "Reliance Industries", income: "55000",
    loanType: "Home Loan", amount: "2500000", purpose: "Purchase", tenure: "20 years",
    existingLoan: "No", leadSource: "Telecaller", priority: "High",
    status: "Interested", lastContact: "2026-08-24", nextFollowup: "2026-08-26",
    assignedDate: "2026-08-20", createdDate: "2026-08-18", remarks: "Customer interested in 25L home loan."
  },
  {
    id: "LD-10246", customerName: "Priya Sharma", mobile: "9988776655",
    altMobile: "", email: "priya.sharma@email.com",
    address: "45, Hazratganj", city: "Lucknow", state: "Uttar Pradesh", pincode: "226001",
    occupation: "Business", company: "Sharma Traders", income: "80000",
    loanType: "Loan Against Property", amount: "5000000", purpose: "Business Expansion", tenure: "15 years",
    existingLoan: "Yes", leadSource: "Telecaller", priority: "Medium",
    status: "Follow-up", lastContact: "2026-08-23", nextFollowup: "2026-08-25",
    assignedDate: "2026-08-19", createdDate: "2026-08-17", remarks: "Needs more info on LAP."
  },
  {
    id: "LD-10247", customerName: "Rahul Verma", mobile: "8877665544",
    altMobile: "9090909090", email: "rahul.v@email.com",
    address: "8, Aliganj", city: "Lucknow", state: "Uttar Pradesh", pincode: "226024",
    occupation: "Salaried", company: "TCS Ltd", income: "70000",
    loanType: "Home Loan", amount: "3500000", purpose: "Construction", tenure: "25 years",
    existingLoan: "No", leadSource: "Telecaller", priority: "Urgent",
    status: "Documents Pending", lastContact: "2026-08-24", nextFollowup: "2026-08-27",
    assignedDate: "2026-08-21", createdDate: "2026-08-19", remarks: "Waiting for salary slips."
  },
  {
    id: "LD-10248", customerName: "Sunita Devi", mobile: "7766554433",
    altMobile: "", email: "sunita@email.com",
    address: "22, Indira Nagar", city: "Lucknow", state: "Uttar Pradesh", pincode: "226016",
    occupation: "Self Employed", company: "Boutique Owner", income: "45000",
    loanType: "Other", amount: "1000000", purpose: "Renovation", tenure: "10 years",
    existingLoan: "No", leadSource: "Telecaller", priority: "Normal",
    status: "New", lastContact: "—", nextFollowup: "2026-08-25",
    assignedDate: "2026-08-25", createdDate: "2026-08-25", remarks: ""
  },
  {
    id: "LD-10249", customerName: "Vijay Singh", mobile: "9900887766",
    altMobile: "8811223344", email: "vijay.s@email.com",
    address: "67, Vikas Nagar", city: "Lucknow", state: "Uttar Pradesh", pincode: "226022",
    occupation: "Business", company: "Singh Enterprises", income: "120000",
    loanType: "Loan Against Property", amount: "8000000", purpose: "Business", tenure: "20 years",
    existingLoan: "Yes", leadSource: "Telecaller", priority: "High",
    status: "Contacted", lastContact: "2026-08-22", nextFollowup: "2026-08-28",
    assignedDate: "2026-08-18", createdDate: "2026-08-15", remarks: "Interested but wants rate comparison."
  },
  {
    id: "LD-10250", customerName: "Anita Gupta", mobile: "9870123456",
    altMobile: "", email: "anita.g@email.com",
    address: "3, Nirala Nagar", city: "Lucknow", state: "Uttar Pradesh", pincode: "226020",
    occupation: "Salaried", company: "BSNL", income: "35000",
    loanType: "Home Loan", amount: "1500000", purpose: "Purchase", tenure: "15 years",
    existingLoan: "No", leadSource: "Telecaller", priority: "Normal",
    status: "Lost", lastContact: "2026-08-20", nextFollowup: "—",
    assignedDate: "2026-08-10", createdDate: "2026-08-10", remarks: "Not interested anymore."
  },
];

export const mockFollowups = [
  { id: "FU-001", leadId: "LD-10245", customer: "Amit Kumar", date: "2026-08-26", time: "10:00 AM", type: "Call", purpose: "Discuss loan terms", status: "Upcoming" },
  { id: "FU-002", leadId: "LD-10246", customer: "Priya Sharma", date: "2026-08-25", time: "02:00 PM", type: "Document Follow-up", purpose: "Collect PAN card copy", status: "Today" },
  { id: "FU-003", leadId: "LD-10247", customer: "Rahul Verma", date: "2026-08-24", time: "11:30 AM", type: "Call", purpose: "Salary slip reminder", status: "Missed" },
  { id: "FU-004", leadId: "LD-10249", customer: "Vijay Singh", date: "2026-08-25", time: "04:00 PM", type: "Customer Callback", purpose: "Interest rate clarification", status: "Today" },
  { id: "FU-005", leadId: "LD-10245", customer: "Amit Kumar", date: "2026-08-23", time: "09:00 AM", type: "Call", purpose: "Initial contact", status: "Completed" },
];

export const mockRemarks = [
  { id: "R-001", leadId: "LD-10245", customer: "Amit Kumar", type: "Call", remark: "Customer confirmed interest in 25L home loan. Will share documents by Friday.", date: "2026-08-24", time: "10:30 AM" },
  { id: "R-002", leadId: "LD-10246", customer: "Priya Sharma", type: "Follow-up", remark: "Scheduled follow-up for Monday to check document status.", date: "2026-08-23", time: "03:00 PM" },
  { id: "R-003", leadId: "LD-10247", customer: "Rahul Verma", type: "Document", remark: "Waiting for last 3 months salary slips.", date: "2026-08-24", time: "11:00 AM" },
];

export const mockDocuments = [
  { id: "D-001", leadId: "LD-10245", customer: "Amit Kumar", type: "Aadhaar Card", status: "Verified", uploaded: "2026-08-22", remark: "Clear copy" },
  { id: "D-002", leadId: "LD-10245", customer: "Amit Kumar", type: "PAN Card", status: "Under Verification", uploaded: "2026-08-23", remark: "" },
  { id: "D-003", leadId: "LD-10247", customer: "Rahul Verma", type: "Salary Slip", status: "Pending", uploaded: "—", remark: "" },
];

export const statusColors = {
  "New":                  { bg: "#EEF2FF", text: "#4338CA" },
  "Contacted":            { bg: "#FFF7ED", text: "#C2410C" },
  "Interested":           { bg: "#DCFCE7", text: "#15803D" },
  "Follow-up":            { bg: "#FEF9C3", text: "#A16207" },
  "Documents Pending":    { bg: "#FEF3C7", text: "#D97706" },
  "Application Submitted":{ bg: "#DBEAFE", text: "#1D4ED8" },
  "Converted":            { bg: "#D1FAE5", text: "#059669" },
  "Lost":                 { bg: "#FEE2E2", text: "#DC2626" },
};

export const priorityColors = {
  "Normal": { bg: "#F1F5F9", text: "#64748B" },
  "Medium": { bg: "#FFF7ED", text: "#EA580C" },
  "High":   { bg: "#FEF9C3", text: "#CA8A04" },
  "Urgent": { bg: "#FEE2E2", text: "#DC2626" },
};
