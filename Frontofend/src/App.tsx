import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, ReactNode } from 'react'; 
import axiosClient from './api/axiosClients';
import LoginForm from './components/LoginForm';
import AdminHub from './Pages/AdminHub';
import Personnel from './Pages/Personnel';
import Logbook from './Pages/LogBook';
import Archive from './Pages/Archive';
import { s } from './styles/Auth.styles';
import SystemPage from './Pages/System';
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

export default function App() {
  const [user, setUser] = useState<{ loggedIn: boolean; role: string; email: string } | null>(null);

  const handleLoginSuccess = async (data: AuthValues) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await axiosClient.post('/msee/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { access_token, role, email } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('yolo_email', email);
      
      setUser({ loggedIn: true, role: role, email: email });
      
    } catch (err) {
      console.error("Access Denied:", err);
    }
  };

  return (
    <Router>
      <TraceProvider>
        <Routes>
          <Route path="/kudonjo" element={
            user?.loggedIn ? (
              user.role === 'admin' 
                ? <Navigate to="/a1/mdosi/kejayamkuu" replace /> 
                : <Navigate to="/access-denied" replace /> 
            ) : (
              <AuthLayout title="YOLO Connect" subtitle="Authorization Required">
                <LoginForm onSuccess={handleLoginSuccess} />
              </AuthLayout>
            )
          } />

          <Route path="/a1/mdosi/kejayamkuu" element={
            user?.role === 'admin' ? <AdminHub /> : <Navigate to="/kudonjo" replace />
          } />

          <Route path="/a1/mdosi/personnel" element={
            user?.role === 'admin' ? <Personnel /> : <Navigate to="/kudonjo" replace />
          } />

          <Route path="/a1/mdosi/logbook" element={
            user?.role === 'admin' ? <Logbook /> : <Navigate to="/kudonjo" replace />
          } />

          <Route path="/a1/mdosi/archive" element={
            user?.role === 'admin' ? <Archive /> : <Navigate to="/kudonjo" replace />
          } />
          <Route path="/a1/mdosi/system" element={
            user?.role === 'admin' ? <SystemPage /> : <Navigate to="/kudonjo" replace />
          } />

          <Route path="/" element={<Navigate to="/kudonjo" replace />} />
        </Routes>
      </TraceProvider>
    </Router>
  );
}