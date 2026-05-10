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
  const [user, setUser] = useState<{ loggedIn: boolean; role: string; email: string } | null>(null);

  const handleLoginSuccess = async (data: AuthValues) => {
    console.log("Login starting")
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await axios.post(`${apiUrl}/msee/login`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      console.log("Full Backend Data:", response.data);
      const { access_token, role ,email } = response.data;
      localStorage.setItem('yolo_token', access_token);
      setUser({ loggedIn: true, role: role, email: email });
      
    } catch (err) {
      console.error("Access Denied:", err);
      alert("UNAUTHORIZED: Check your Mkubwa credentials.");
    }
  };

  return (
    <Router>
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
        <Route path="/" element={<Navigate to="/kudonjo" replace />} />
      </Routes>
    </Router>
  );
}