import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, ReactNode } from 'react'; 
import LoginForm from './components/LoginForm';
import AdminHub from './Pages/AdminHub'; // Renamed to match your screenshot
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

  const handleLoginSuccess = (data: AuthValues) => {
    // Elite Logic: Check for admin keyword or specific farm email
    const isAdmin = data.email.toLowerCase().includes('admin') || data.email.includes('maitai.farm');
    setUser({ loggedIn: true, role: isAdmin ? 'admin' : 'user' });
  };

  return (
    <Router>
      <Routes>
        <Route path="/kudonjo" element={
          user?.loggedIn ? (
            <Navigate to={user.role === 'admin' ? "/yolo/jadong" : "/dashboard"} replace />
          ) : (
            <AuthLayout title="YOLO Connect" subtitle="Sign in to your portal">
              <LoginForm onSuccess={handleLoginSuccess} />
            </AuthLayout>
          )
        } />
        
        {/* Protected Admin Route */}
        <Route path="/yolo/jadong" element={
          user?.role === 'admin' ? <AdminHub /> : <Navigate to="/kudonjo" replace />
        } />

        <Route path="/" element={<Navigate to="/kudonjo" replace />} />
      </Routes>
    </Router>
  );
}