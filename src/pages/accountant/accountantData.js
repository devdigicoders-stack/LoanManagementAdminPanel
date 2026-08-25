export const statusColors = {
  "Completed": { bg: "#DCFCE7", text: "#15803D" },
  "Pending": { bg: "#FEF3C7", text: "#D97706" },
  "Failed": { bg: "#FEE2E2", text: "#DC2626" },
  "Cancelled": { bg: "#FEE2E2", text: "#DC2626" },
  "Refunded": { bg: "#E0E7FF", text: "#4338CA" },
  "Matched": { bg: "#DCFCE7", text: "#15803D" },
  "Unmatched": { bg: "#FEE2E2", text: "#DC2626" },
  "Partial Match": { bg: "#FEF9C3", text: "#CA8A04" },
  "Approved": { bg: "#DCFCE7", text: "#15803D" },
  "Processing": { bg: "#DBEAFE", text: "#1D4ED8" },
  "Overdue": { bg: "#FEE2E2", text: "#DC2626" },
  "Partially Paid": { bg: "#FEF3C7", text: "#D97706" },
  "Paid": { bg: "#DCFCE7", text: "#15803D" },
  "Upcoming": { bg: "#F1F5F9", text: "#64748B" },
};

export const mockTransactions = [
  { id: "TRX-89234", customerName: "Rahul Sharma", customerId: "CUST-104", type: "Payment", amount: 15000, method: "UPI", reference: "UPI9823749823", date: "24 Aug 2026", status: "Completed", action: "Matched" },
  { id: "TRX-89235", customerName: "Sneha Patel", customerId: "CUST-201", type: "Collection", amount: 5000, method: "Cash", reference: "RCPT-992", date: "24 Aug 2026", status: "Completed", action: "Matched" },
  { id: "TRX-89236", customerName: "Vikas Kumar", customerId: "CUST-155", type: "Refund", amount: 2500, method: "Bank Transfer", reference: "NEFT83749283", date: "23 Aug 2026", status: "Processing", action: "Pending" },
  { id: "TRX-89237", customerName: "Amit Singh", customerId: "CUST-302", type: "Expense", amount: 1200, method: "UPI", reference: "UPI192837465", date: "23 Aug 2026", status: "Completed", action: "Matched" },
  { id: "TRX-89238", customerName: "Priya Sharma", customerId: "CUST-412", type: "Payment", amount: 18500, method: "Bank Transfer", reference: "IMPS98237492", date: "22 Aug 2026", status: "Failed", action: "Unmatched" },
];

export const mockPayments = [
  { id: "PAY-1001", customerName: "Rahul Sharma", loanId: "APP-9021", amount: 15000, method: "UPI", date: "24 Aug 2026", reference: "UPI9823749823", status: "Completed" },
  { id: "PAY-1002", customerName: "Sneha Patel", loanId: "APP-8832", amount: 5000, method: "Cash", date: "24 Aug 2026", reference: "RCPT-992", status: "Completed" },
  { id: "PAY-1003", customerName: "Anjali Gupta", loanId: "APP-9912", amount: 12000, method: "Bank Transfer", date: "25 Aug 2026", reference: "NEFT11223344", status: "Pending" },
];

export const mockOutstanding = [
  { customerName: "Karan Verma", customerId: "CUST-501", loanId: "APP-7711", totalDue: 50000, paid: 10000, outstanding: 40000, dueDate: "20 Aug 2026", overdueDays: 5, status: "Overdue" },
  { customerName: "Nisha Singh", customerId: "CUST-602", loanId: "APP-8844", totalDue: 25000, paid: 15000, outstanding: 10000, dueDate: "25 Aug 2026", overdueDays: 0, status: "Due Today" },
  { customerName: "Rohan Das", customerId: "CUST-703", loanId: "APP-9922", totalDue: 30000, paid: 5000, outstanding: 25000, dueDate: "30 Aug 2026", overdueDays: 0, status: "Upcoming" },
];

export const mockExpenses = [
  { id: "EXP-501", category: "Office Expense", desc: "Printer Ink & Paper", amount: 3500, method: "UPI", date: "24 Aug 2026", addedBy: "Admin", status: "Approved" },
  { id: "EXP-502", category: "Travel", desc: "Field Visit Fuel", amount: 1200, method: "Cash", date: "23 Aug 2026", addedBy: "Agent 01", status: "Pending" },
  { id: "EXP-503", category: "Marketing", desc: "Facebook Ads", amount: 15000, method: "Bank Transfer", date: "20 Aug 2026", addedBy: "Admin", status: "Completed" },
];

export const mockRefunds = [
  { id: "REF-901", customerName: "Vikas Kumar", paymentId: "PAY-0891", amount: 2500, reason: "Duplicate Payment", date: "23 Aug 2026", status: "Processing" },
  { id: "REF-902", customerName: "Arjun Reddy", paymentId: "PAY-0772", amount: 5000, reason: "Loan Cancellation", date: "21 Aug 2026", status: "Approved" },
  { id: "REF-903", customerName: "Neha Sharma", paymentId: "PAY-0653", amount: 1000, reason: "Excess Fee Charged", date: "18 Aug 2026", status: "Completed" },
];

export const mockCustomers = [
  { id: "CUST-104", name: "Rahul Sharma", mobile: "+91 9876543210", loanId: "APP-9021", amount: 500000, paid: 15000, outstanding: 485000, status: "Active" },
  { id: "CUST-201", name: "Sneha Patel", mobile: "+91 9876543211", loanId: "APP-8832", amount: 250000, paid: 50000, outstanding: 200000, status: "Active" },
  { id: "CUST-501", name: "Karan Verma", mobile: "+91 9876543212", loanId: "APP-7711", amount: 100000, paid: 10000, outstanding: 90000, status: "Defaulter" },
];

export const mockNotifications = [
  { id: 1, title: "Payment Received", message: "Payment of ₹15,000 has been recorded for customer Rahul Sharma.", time: "10 mins ago", read: false, icon: "FileText", color: "#15803D" },
  { id: 2, title: "Reconciliation Alert", message: "A transaction mismatch detected for REF: IMPS98237492.", time: "1 hour ago", read: false, icon: "AlertTriangle", color: "#DC2626" },
  { id: 3, title: "Refund Request", message: "A refund request of ₹2,500 requires your attention.", time: "3 hours ago", read: true, icon: "RefreshCcw", color: "#D97706" },
];
