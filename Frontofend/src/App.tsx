import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, ReactNode } from 'react'; 
import axiosClient from './api/axiosClients';
import LoginForm from './components/LoginForm';
import AdminHub from './Pages/AdminHub';
import Personnel from './Pages/Personnel';
import Logbook from './Pages/LogBook';
import Archive from './Pages/Archive';
import SystemPage from './Pages/System';
import FinancePage from './Pages/Finance';
import BookingsAndEvents from './Pages/BookingandEvents';
import { s } from './styles/Auth.styles';
import type { AuthValues } from './lib/auth-schema';
import { TraceProvider } from './context/TraceProvider';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => (
  <div className={s.page}>
    <div className={s.container}>
      <div className={s.header}>
        <h1 className={s.title}>{title}</h1>
        <p className={s.subtitle}>{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);

function AppContent() {
  const [user, setUser] = useState<{ loggedIn: boolean; isAdmin: boolean; email: string } | null>(null);
  const navigate = useNavigate();

  const handleLoginSuccess = async (data: AuthValues) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await axiosClient.post('/msee/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { access_token, is_admin, email } = response.data;
      localStorage.setItem('yolo_token', access_token);
      localStorage.setItem('yolo_email', email);

      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      const normalizedEmail = email ? email.toLowerCase() : '';
      const checkedAdminStatus = !!is_admin;

      setUser({ 
        loggedIn: true, 
        isAdmin: checkedAdminStatus, 
        email: normalizedEmail 
      });
      
      if (checkedAdminStatus) {
        navigate('/a1/mdosi/kejayamkuu', { replace: true });
      } else {
        navigate('/access-denied', { replace: true });
      }
      
      return access_token;
      
    } catch (err) {
      console.error("Access Denied:", err);
    }
  };

  const authenticatedAsAdmin = user?.loggedIn && user.isAdmin;

  return (
    <TraceProvider>
      <Routes>
        <Route path="/kudonjo" element={
          user?.loggedIn ? (
            authenticatedAsAdmin 
              ? <Navigate to="/a1/mdosi/kejayamkuu" replace /> 
              : <Navigate to="/access-denied" replace /> 
          ) : (
            <AuthLayout title="YOLO Connect" subtitle="Authorization Required">
              <LoginForm onSuccess={handleLoginSuccess} />
            </AuthLayout>
          )
        } />

        <Route path="/a1/mdosi/kejayamkuu" element={
          authenticatedAsAdmin ? <AdminHub /> : <Navigate to="/kudonjo" replace />
        } />

        <Route path="/a1/mdosi/finance" element={
          authenticatedAsAdmin ? <FinancePage /> : <Navigate to="/kudonjo" replace />
        } />

        <Route path="/a1/mdosi/bookings" element={
          authenticatedAsAdmin ? <BookingsAndEvents /> : <Navigate to="/kudonjo" replace />
        } />

        <Route path="/a1/mdosi/personnel" element={
          authenticatedAsAdmin ? <Personnel /> : <Navigate to="/kudonjo" replace />
        } />

        <Route path="/a1/mdosi/logbook" element={
          authenticatedAsAdmin ? <Logbook /> : <Navigate to="/kudonjo" replace />
        } />

        <Route path="/a1/mdosi/archive" element={
          authenticatedAsAdmin ? <Archive /> : <Navigate to="/kudonjo" replace />
        } />
        
        <Route path="/a1/mdosi/system" element={
          authenticatedAsAdmin ? <SystemPage /> : <Navigate to="/kudonjo" replace />
        } />

        <Route path="/access-denied" element={
          <div style={{ textAlign: 'center', padding: '50px', color: '#ff4d4d', fontFamily: 'sans-serif' }}>
            <h2>Access Denied</h2>
            <p>Your account details are not registered with administrator privileges.</p>
            <a href="/kudonjo" style={{ color: '#0070f3', textDecoration: 'underline' }}>Return to Login</a>
          </div>
        } />

        <Route path="/" element={<Navigate to="/kudonjo" replace />} />
      </Routes>
    </TraceProvider>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}