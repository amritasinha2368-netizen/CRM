import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store';
import { AppLayout } from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard';
import MarketingDashboard from './pages/dashboards/MarketingDashboard';
import TeamLeaderDashboard from './pages/dashboards/TeamLeaderDashboard';
import CounsellorDashboard from './pages/dashboards/CounsellorDashboard';
import AdmissionsDashboard from './pages/dashboards/AdmissionsDashboard';
import LeadsList from './pages/Leads/LeadsList';
import Pipeline from './pages/Leads/Pipeline';
import LeadProfile from './pages/Leads/LeadProfile';
import FollowUps from './pages/FollowUps';
import Calls from './pages/Calls';
import Students from './pages/Students';
import Applications from './pages/Applications';
import Admissions from './pages/Admissions';
import Payments from './pages/Payments';
import Courses from './pages/Courses';
import Campaigns from './pages/Campaigns';
import Reports from './pages/Reports';
import Team from './pages/Team';
import Automations from './pages/Automations';
import Templates from './pages/Templates';
import Documents from './pages/Documents';
import Settings from './pages/Settings';

function DashboardRouter() {
  const { currentUser } = useAppStore();
  if (!currentUser) return <Navigate to="/" />;
  switch (currentUser.role) {
    case 'super_admin': return <SuperAdminDashboard />;
    case 'crm_admin': return <MarketingDashboard />;
    case 'team_leader': return <TeamLeaderDashboard />;
    case 'counsellor': return <CounsellorDashboard />;
    case 'admissions': return <AdmissionsDashboard />;
    default: return <SuperAdminDashboard />;
  }
}

export default function App() {
  const { currentUser } = useAppStore();
  const isAuthenticated = !!currentUser;

  return (
    <Routes>
      {/* Public Landing */}
      <Route path="/" element={<Landing />} />

      {/* Auth */}
      <Route element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected App */}
      <Route element={isAuthenticated ? <AppLayout /> : <Navigate to="/" />}>
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/leads" element={<LeadsList />} />
        <Route path="/my-leads" element={<LeadsList />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/leads/:leadId" element={<LeadProfile />} />
        <Route path="/follow-ups" element={<FollowUps />} />
        <Route path="/calls" element={<Calls />} />
        <Route path="/students" element={<Students />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/team" element={<Team />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
