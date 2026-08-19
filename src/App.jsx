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

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
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
          <Route
            path="employees/performance"
            element={<EmployeePerformance />}
          />
          <Route path="employees/activity" element={<EmployeeActivityLogs />} />
          <Route path="employees/attendance" element={<Attendance />} />
          <Route path="employees/:id" element={<EmployeeDetails />} />
          <Route path="employees/:id/edit" element={<EditEmployee />} />
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
          
          {/* Placeholder Routes for missing pages */}
          <Route path="user-profile/:id" element={<UserProfile />} />
          <Route path="verify-documents" element={<VerifyDocuments />} />
          <Route path="application-decision" element={<ApplicationDecision />} />
          <Route path="request-documents" element={<RequestDocuments />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
