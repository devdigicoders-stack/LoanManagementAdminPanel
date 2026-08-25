import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ManageUsers from "./pages/ManageUsers";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import UserDetails from "./pages/UserDetails";
import RolePermissions from "./pages/RolePermissions";
import BulkImport from "./pages/BulkImport";
import ResetPassword from "./pages/ResetPassword";
import UserActivityLog from "./pages/UserActivityLog";

// Employee Management Imports
import ManageEmployees from "./pages/employees/ManageEmployees";
import AddEmployee from "./pages/employees/AddEmployee";
import EditEmployee from "./pages/employees/EditEmployee";
import EmployeeDetails from "./pages/employees/EmployeeDetails";
import Departments from "./pages/employees/Departments";
import Designations from "./pages/employees/Designations";
import EmployeeRoles from "./pages/employees/EmployeeRoles";
import EmployeePerformance from "./pages/employees/EmployeePerformance";
import EmployeeActivityLogs from "./pages/employees/EmployeeActivityLogs";
import Attendance from "./pages/employees/Attendance";
import LeaveManagement from "./pages/employees/LeaveManagement";

import HRDashboard from "./pages/hr/HRDashboard";
import HRReports from "./pages/hr/HRReports";
import HRNotifications from "./pages/hr/HRNotifications";

// Lead Management Imports
import ManageLeads from "./pages/leads/ManageLeads";
import AddLead from "./pages/leads/AddLead";
import LeadSources from "./pages/leads/LeadSources";
import LeadStatus from "./pages/leads/LeadStatus";
import AssignLead from "./pages/leads/AssignLead";
import FollowUps from "./pages/leads/FollowUps";

// Work Management Imports
import TaskManagement from './pages/work/TaskManagement';
import ApplicationAssignment from './pages/work/ApplicationAssignment';
import WorkCalendar from './pages/work/WorkCalendar';

// Loan Management Imports
import LoanDashboard from './pages/loans/LoanDashboard';
import ManageApplications from './pages/loans/ManageApplications';
import ActiveLoans from './pages/loans/ActiveLoans';
import RepaymentSchedule from './pages/loans/RepaymentSchedule';
import EMICollections from './pages/loans/EMICollections';
import CollectionDashboard from './pages/loans/CollectionDashboard';
import OverdueLoans from './pages/loans/OverdueLoans';
import ForeclosureRequests from './pages/loans/ForeclosureRequests';
import TopUpRequests from './pages/loans/TopUpRequests';
import LoanClosure from './pages/loans/LoanClosure';
import DocumentCenter from './pages/loans/DocumentCenter';
import VerifyDocuments from './pages/loans/VerifyDocuments';
import ApplicationDecision from './pages/loans/ApplicationDecision';
import RequestDocuments from './pages/loans/RequestDocuments';

// System Imports
import Settings from './pages/system/Settings';
import AuditLogs from './pages/system/AuditLogs';
import ReportsAnalytics from './pages/system/ReportsAnalytics';
import ManageComplaints from './pages/system/ManageComplaints';
import AdminProfile from './pages/system/AdminProfile';
import Notifications from './pages/system/Notifications';
import UnderConstruction from './pages/UnderConstruction';
import UserProfile from './pages/UserProfile';
import ChangePassword from './pages/ChangePassword';

// Operations Admin Imports
import OperationDashboard from './pages/operations/OperationDashboard';
import ApplicationManagement from './pages/operations/ApplicationManagement';
import ApplicationDetails from './pages/operations/ApplicationDetails';
import AssignedApplications from './pages/operations/AssignedApplications';
import CustomerManagement from './pages/operations/CustomerManagement';
import CustomerDetails from './pages/operations/CustomerDetails';
import DocumentManagement from './pages/operations/DocumentManagement';
import ApplicationVerification from './pages/operations/ApplicationVerification';
import FollowUpManagement from './pages/operations/FollowUpManagement';
import RemarksNotes from './pages/operations/RemarksNotes';
import ApplicationHistory from './pages/operations/ApplicationHistory';
import OperationNotifications from './pages/operations/OperationNotifications';
import OperationReports from './pages/operations/OperationReports';

// Telecaller Panel Imports
import TelecallerLayout from './layouts/TelecallerLayout';
import TelecallerDashboard from './pages/telecaller/TelecallerDashboard';
import MyLeads from './pages/telecaller/MyLeads';
import AddNewLead from './pages/telecaller/AddNewLead';
import LeadDetails from './pages/telecaller/LeadDetails';
import CustomerCall from './pages/telecaller/CustomerCall';
import MyFollowups from './pages/telecaller/MyFollowups';
import AddFollowup from './pages/telecaller/AddFollowup';
import CompleteFollowup from './pages/telecaller/CompleteFollowup';
import CustomerDocuments from './pages/telecaller/CustomerDocuments';
import TelecallerRemarksNotes from './pages/telecaller/RemarksNotes';
import TelecallerNotifications from './pages/telecaller/TelecallerNotifications';
import TelecallerReports from './pages/telecaller/TelecallerReports';
import MyPerformance from './pages/telecaller/MyPerformance';
import TelecallerProfile from './pages/telecaller/TelecallerProfile';
import UpdateLeadStatus from './pages/telecaller/UpdateLeadStatus';

// Agent Panel Imports
import AgentLayout from './layouts/AgentLayout';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentMyLeads from './pages/agent/MyLeads';
import AgentLeadDetails from './pages/agent/LeadDetails';
import AgentCustomerVisits from './pages/agent/CustomerVisits';
import AgentScheduleVisit from './pages/agent/ScheduleVisit';
import AgentVisitDetails from './pages/agent/VisitDetails';
import AgentMyFollowups from './pages/agent/MyFollowups';
import AgentAddFollowup from './pages/agent/AddFollowup';
import AgentCompleteFollowup from './pages/agent/CompleteFollowup';
import AgentCustomerDocuments from './pages/agent/CustomerDocuments';
import AgentCustomerDetails from './pages/agent/CustomerDetails';
import AgentRemarksNotes from './pages/agent/RemarksNotes';
import AgentUpdateLeadStatus from './pages/agent/UpdateLeadStatus';
import AgentCreateApplication from './pages/agent/CreateApplication';
import AgentApplicationTracking from './pages/agent/ApplicationTracking';
import AgentNotifications from './pages/agent/AgentNotifications';
import AgentMyPerformance from './pages/agent/MyPerformance';
import AgentReports from './pages/agent/AgentReports';
import AgentProfile from './pages/agent/AgentProfile';

// Accountant Pages
import AccountantLayout from './layouts/AccountantLayout';
import AccountantDashboard from './pages/accountant/AccountantDashboard';
import PaymentsCollections from './pages/accountant/PaymentsCollections';
import RecordPayment from './pages/accountant/RecordPayment';
import PaymentDetails from './pages/accountant/PaymentDetails';
import Transactions from './pages/accountant/Transactions';
import TransactionDetails from './pages/accountant/TransactionDetails';
import OutstandingPayments from './pages/accountant/OutstandingPayments';
import AccountantCustomers from './pages/accountant/AccountantCustomers';
import CustomerFinancialProfile from './pages/accountant/CustomerFinancialProfile';
import Receipts from './pages/accountant/Receipts';
import Refunds from './pages/accountant/Refunds';
import RequestRefund from './pages/accountant/RequestRefund';
import Expenses from './pages/accountant/Expenses';
import AddExpense from './pages/accountant/AddExpense';
import Reconciliation from './pages/accountant/Reconciliation';
import FinancialReports from './pages/accountant/FinancialReports';
import AccountantNotifications from './pages/accountant/AccountantNotifications';
import AccountantProfile from './pages/accountant/AccountantProfile';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Component to dynamically route dashboards based on role
const RoleBasedDashboard = () => {
  const role = localStorage.getItem('userRole');
  if (role === 'HR Admin') {
    return <HRDashboard />;
  }
  if (role === 'Operation Admin') {
    return <OperationDashboard />;
  }
  return <Dashboard />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Telecaller Routes */}
        <Route path="/telecaller" element={<ProtectedRoute><TelecallerLayout /></ProtectedRoute>}>
          <Route index element={<TelecallerDashboard />} />
          <Route path="leads" element={<MyLeads />} />
          <Route path="leads/add" element={<AddNewLead />} />
          <Route path="leads/:id" element={<LeadDetails />} />
          <Route path="call/:id" element={<CustomerCall />} />
          <Route path="followups" element={<MyFollowups />} />
          <Route path="followups/add" element={<AddFollowup />} />
          <Route path="followups/complete/:id" element={<CompleteFollowup />} />
          <Route path="documents" element={<CustomerDocuments />} />
          <Route path="remarks" element={<TelecallerRemarksNotes />} />
          <Route path="notifications" element={<TelecallerNotifications />} />
          <Route path="reports" element={<TelecallerReports />} />
          <Route path="performance" element={<MyPerformance />} />
          <Route path="profile" element={<TelecallerProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="status/:id" element={<UpdateLeadStatus />} />
        </Route>

        {/* Agent Routes */}
        <Route path="/agent" element={<ProtectedRoute><AgentLayout /></ProtectedRoute>}>
          <Route index element={<AgentDashboard />} />
          <Route path="leads" element={<AgentMyLeads />} />
          <Route path="leads/:id" element={<AgentLeadDetails />} />
          <Route path="visits" element={<AgentCustomerVisits />} />
          <Route path="visits/add" element={<AgentScheduleVisit />} />
          <Route path="visits/:id" element={<AgentVisitDetails />} />
          <Route path="followups" element={<AgentMyFollowups />} />
          <Route path="followups/add" element={<AgentAddFollowup />} />
          <Route path="followups/complete/:id" element={<AgentCompleteFollowup />} />
          <Route path="documents" element={<AgentCustomerDocuments />} />
          <Route path="customer/:id" element={<AgentCustomerDetails />} />
          <Route path="remarks" element={<AgentRemarksNotes />} />
          <Route path="status/:id" element={<AgentUpdateLeadStatus />} />
          <Route path="applications/new" element={<AgentCreateApplication />} />
          <Route path="applications" element={<AgentApplicationTracking />} />
          <Route path="notifications" element={<AgentNotifications />} />
          <Route path="performance" element={<AgentMyPerformance />} />
          <Route path="reports" element={<AgentReports />} />
          <Route path="profile" element={<AgentProfile />} />
          <Route path="change-password" element={<AgentProfile />} />
        </Route>

        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<RoleBasedDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="users/:id/edit" element={<EditUser />} />
          <Route path="users/roles" element={<RolePermissions />} />
          <Route path="users/import" element={<BulkImport />} />
          <Route path="users/:id/reset-password" element={<ResetPassword />} />
          <Route path="users/:id/activity" element={<UserActivityLog />} />

          {/* Employee Management Routes */}
          <Route path="employees" element={<ManageEmployees />} />
          <Route path="employees/add" element={<AddEmployee />} />
          <Route path="employees/departments" element={<Departments />} />
          <Route path="employees/designations" element={<Designations />} />
          <Route path="employees/roles" element={<EmployeeRoles />} />
          <Route path="employees/performance" element={<EmployeePerformance />} />
          <Route path="employees/activity" element={<EmployeeActivityLogs />} />
          <Route path="employees/attendance" element={<Attendance />} />
          <Route path="employees/leave-management" element={<LeaveManagement />} />
          <Route path="employees/:id" element={<EmployeeDetails />} />
          <Route path="employees/:id/edit" element={<EditEmployee />} />
          
          <Route path="hr/reports" element={<HRReports />} />
          <Route path="hr/notifications" element={<HRNotifications />} />

          {/* Lead Management Routes */}
          <Route path="leads" element={<ManageLeads />} />
          <Route path="leads/add" element={<AddLead />} />
          <Route path="leads/sources" element={<LeadSources />} />
          <Route path="leads/status" element={<LeadStatus />} />
          <Route path="leads/assignment" element={<AssignLead />} />
          <Route path="leads/follow-ups" element={<FollowUps />} />

          {/* Work Management Routes */}
          <Route path="work/tasks" element={<TaskManagement />} />
          <Route path="work/applications" element={<ApplicationAssignment />} />
          <Route path="work/calendar" element={<WorkCalendar />} />

          {/* Loan Management Routes */}
          <Route path="loans/dashboard" element={<LoanDashboard />} />
          <Route path="loans" element={<ManageApplications />} />
          <Route path="loans/active" element={<ActiveLoans />} />
          <Route path="loans/repayments" element={<RepaymentSchedule />} />
          <Route path="loans/collections" element={<EMICollections />} />
          <Route path="loans/collections-dashboard" element={<CollectionDashboard />} />
          <Route path="loans/closure" element={<LoanClosure />} />
          <Route path="loans/foreclosures" element={<ForeclosureRequests />} />
          <Route path="loans/top-up" element={<TopUpRequests />} />
          <Route path="loans/overdue" element={<OverdueLoans />} />
          <Route path="loans/documents" element={<DocumentCenter />} />
          
          {/* System Routes */}
          <Route path="settings" element={<Settings />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="complaints" element={<ManageComplaints />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="notifications" element={<Notifications />} />
          
          {/* Operations Admin Routes */}
          <Route path="operations/applications" element={<ApplicationManagement />} />
          <Route path="operations/applications/:id" element={<ApplicationDetails />} />
          <Route path="operations/assigned" element={<AssignedApplications />} />
          <Route path="operations/customers" element={<CustomerManagement />} />
          <Route path="operations/customers/:id" element={<CustomerDetails />} />
          <Route path="operations/documents" element={<DocumentManagement />} />
          <Route path="operations/verification" element={<ApplicationVerification />} />
          <Route path="operations/follow-ups" element={<FollowUpManagement />} />
          <Route path="operations/remarks" element={<RemarksNotes />} />
          <Route path="operations/history" element={<ApplicationHistory />} />
          <Route path="operations/notifications" element={<OperationNotifications />} />
          <Route path="operations/reports" element={<OperationReports />} />
          
          {/* Placeholder Routes for missing pages */}
          <Route path="user-profile/:id" element={<UserProfile />} />
          <Route path="verify-documents" element={<VerifyDocuments />} />
          <Route path="application-decision" element={<ApplicationDecision />} />
          <Route path="request-documents" element={<RequestDocuments />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
        {/* Accountant Routes */}
        <Route path="/accountant" element={<ProtectedRoute allowedRole="accountant"><AccountantLayout /></ProtectedRoute>}>
          <Route index element={<AccountantDashboard />} />
          <Route path="payments" element={<PaymentsCollections />} />
          <Route path="payments/add" element={<RecordPayment />} />
          <Route path="payments/:id" element={<PaymentDetails />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/:id" element={<TransactionDetails />} />
          <Route path="outstanding" element={<OutstandingPayments />} />
          <Route path="customers" element={<AccountantCustomers />} />
          <Route path="customers/:id" element={<CustomerFinancialProfile />} />
          <Route path="receipts" element={<Receipts />} />
          <Route path="refunds" element={<Refunds />} />
          <Route path="refunds/request" element={<RequestRefund />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="expenses/add" element={<AddExpense />} />
          <Route path="reconciliation" element={<Reconciliation />} />
          <Route path="reports" element={<FinancialReports />} />
          <Route path="notifications" element={<AccountantNotifications />} />
          <Route path="profile" element={<AccountantProfile />} />
          <Route path="change-password" element={<AccountantProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
