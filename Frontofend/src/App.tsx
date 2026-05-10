import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, ReactNode } from 'react'; 
import axios from 'axios';
import LoginForm from './components/LoginForm';
import AdminHub from './Pages/AdminHub';
import { s } from './styles/Auth.styles';
import type { AuthValues } from './lib/auth-schema';

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
  const [user, setUser] = useState<{ loggedIn: boolean; role: string } | null>(null);

  const handleLoginSuccess = async (data: AuthValues) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await axios.post(`${apiUrl}/msee/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
        
      const { access_token, role } = response.data;
      console.log("Role Recieved:", role);

      localStorage.setItem('yolo_token', access_token);
      setUser({ loggedIn: true, role: role });
      
    } catch (err) {
      console.error("Access Denied:", err);
      alert("UNAUTHORIZED: Check your access level.");
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/kudonjo" element={
          user?.loggedIn ? (
            <Navigate to={user.role === 'admin' ? "/mdosi" : "/dashboard"} replace />
          ) : (
            <AuthLayout title="YOLO Connect" subtitle="Authorization Required">
              <LoginForm onSuccess={handleLoginSuccess} />
            </AuthLayout>
          )
        } />

        {/* NEW ADMIN HUB PATH: /mdosi */}
        <Route path="/mdosi" element={
          user?.role === 'admin' ? <AdminHub /> : <Navigate to="/kudonjo" replace />
        } />

        {/* DEFAULT REDIRECT */}
        <Route path="/" element={<Navigate to="/kudonjo" replace />} />
      </Routes>
    </Router>
  );
}