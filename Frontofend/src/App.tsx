import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useState, useEffect, ReactNode } from 'react'; 
import axiosClient from './api/axiosClients';
import MemberForm from './components/MemberEntry'; 
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
import LogisticsTower from './Pages/LogisticsandScheduling';
import Merch from './Pages/Merch';
import ClientHomepage from './Pages/CLIENT/HomePage';
import MemberDashboard from './Pages/CLIENT/MemberDash'; 
import AboutPage from './Pages/CLIENT/AboutPage';
import Lenis from '@studio-freight/lenis';
import PlacesToGo from './Pages/CLIENT/Placestogo';
import ThingsToDo from './Pages/CLIENT/Thingstodo';
import ExperiencesPage from './Pages/CLIENT/Experience';
import BlogPage from './Pages/CLIENT/Blog';
import PlanATripPage from './Pages/CLIENT/PlanATrip';
import EventsPage from './Pages/CLIENT/Events';
import CancellationPolicyPage from './Pages/CLIENT/Cancellation';
import { VisitorHome } from './Pages/VISITOR/Homepage'; 
import { PublicNavbar } from './components/PublicNavbar';
import { ProtectedNavbar } from './components/PrivateNavbar'; 
import PrivacyPolicyPage from './Pages/CLIENT/PrivacyPolicy';
import FAQPage from './Pages/CLIENT/FAQ'; 
import ContactUs from './Pages/CLIENT/ContactUs';
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
  const [user, setUser] = useState<{ loggedIn: boolean; isAdmin: boolean; isMember: boolean; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // 2. AUTHENTICATION SECURITY CHECK Lifecycle Loop
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('yolo_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosClient.get('/msee/verify-token');
        const isAdminUser = res.data?.is_admin || false;
        
        setUser({ 
          loggedIn: true, 
          isAdmin: isAdminUser, 
          isMember: !isAdminUser, 
          email: localStorage.getItem('yolo_email') || '' 
        });
      } catch (err) {
        console.warn("Auth check failed, clearing session.");
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

const handleLoginSuccess = async (data: AuthValues & { isSignup: boolean; full_name?: string; phone_number?: string }) => {
    try {
      
      if (data.isSignup) {
        await axiosClient.post('/msee/signup', {
          email: data.email,
          password: data.password,
          full_name: data.full_name,
          phone_number: data.phone_number
        });
      }

      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await axiosClient.post('/msee/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { access_token, is_admin, email } = response.data;
      
      localStorage.setItem('yolo_token', access_token);
      localStorage.setItem('yolo_email', email);

      const adminFlag = !!is_admin;
      setUser({ 
        loggedIn: true, 
        isAdmin: adminFlag, 
        isMember: !adminFlag, 
        email: email?.toLowerCase() || '' 
      });
      
    
      if (adminFlag) {
        navigate('/a1/mdosi/kejayamkuu', { replace: true });
      } else {
        navigate('/c2/v1/memberdash', { replace: true });
      }
      
      return access_token;
    } catch (err: any) {
      localStorage.clear();
      setUser(null);
      console.error("Auth process failed:", err);
      throw err; 
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/c2/v1/home', { replace: true });
  };

  if (loading) return null;

  const authenticatedAsAdmin = user?.loggedIn && user.isAdmin;
  const authenticatedAsMember = user?.loggedIn && user.isMember;

  
  const isClientExperienceRoute = location.pathname.startsWith('/c2/v1/');
  
  
  const isDashboardRoute = ['/c2/v1/memberdash','/c2/v1/placestogo', '/c2/v1/tings'].includes(location.pathname);

  return (
    <TraceProvider>
      {isClientExperienceRoute && !isDashboardRoute && (
        user?.loggedIn ? (
          <ProtectedNavbar user={user} onLogout={handleLogout} />
        ) : (
          <PublicNavbar onSignUpClick={() => navigate('/kufika')} />
        )
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/c2/v1/home" replace />} />
        
        <Route 
          path="/c2/v1/home" 
          element={authenticatedAsMember ? <Navigate to="/c2/v1/memberdash" replace /> : <VisitorHome />} 
        />
        
        <Route 
          path="/c2/v1/memberdash" 
          element={authenticatedAsMember ? <MemberDashboard /> : <Navigate to="/kufika" replace />} 
        />

        <Route path="/c2/v1/feed" element={authenticatedAsMember ? <ClientHomepage /> : <Navigate to="/kufika" replace />} />
        <Route path="/c2/v1/about" element={<AboutPage />} />
        <Route path="/c2/v1/placestogo" element={<PlacesToGo />} />
        <Route path="/c2/v1/tings" element={<ThingsToDo />} />
        <Route path="/c2/v1/experiences" element={<ExperiencesPage />} />
        <Route path="/c2/v1/blog" element={<BlogPage />} />
        <Route path="/c2/v1/events" element={<EventsPage />} />
        <Route path="/c2/v1/experience/:id" element={<ExperiencesPage />} />
        <Route path="/c2/v1/cancellation" element={<CancellationPolicyPage />} />
        <Route path="/c2/v1/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/c2/v1/faq" element={<FAQPage />} />
        <Route path="/c2/v1/contact" element={<ContactUs />} />
        <Route
          path="/c2/v1/plan-trip" 
          element={user?.loggedIn ? <PlanATripPage /> : <Navigate to="/kufika" replace />} 
        />

        <Route path="/kudonjo" element={
          authenticatedAsAdmin ? (
            <Navigate to="/a1/mdosi/kejayamkuu" replace />
          ) : (
            <AuthLayout title="FOR THE BRAND " subtitle="Restricted Access">
              <MemberForm onSuccess={handleLoginSuccess} />
            </AuthLayout>
          )
        } />
        <Route path="/kufika" element={
          authenticatedAsMember ? (
            <Navigate to="/c2/v1/memberdash" replace />
          ) : authenticatedAsAdmin ? (
            <Navigate to="/a1/mdosi/kejayamkuu" replace />
          ) : (
            <AuthLayout title="YOLO Connect" subtitle="Clearance Framework Matrix">
              <MemberForm onSuccess={handleLoginSuccess} />
            </AuthLayout>
          )
        } />

        {/* ADMIN INFRASTRUCTURE CONTROLS */}
        <Route path="/a1/mdosi/kejayamkuu" element={authenticatedAsAdmin ? <AdminHub /> : <Navigate to="/kudonjo" replace />} />
        <Route path="/a1/mdosi/finance" element={authenticatedAsAdmin ? <FinancePage /> : <Navigate to="/kudonjo" replace />} />
        <Route path="/a1/mdosi/bookings" element={authenticatedAsAdmin ? <BookingsAndEvents /> : <Navigate to="/kudonjo" replace />} />
        <Route path="/a1/mdosi/personnel" element={authenticatedAsAdmin ? <Personnel /> : <Navigate to="/kudonjo" replace />} />
        <Route path="/a1/mdosi/logbook" element={authenticatedAsAdmin ? <Logbook /> : <Navigate to="/kudonjo" replace />} />
        <Route path="/a1/mdosi/archive" element={authenticatedAsAdmin ? <Archive /> : <Navigate to="/kudonjo" replace />} />
        <Route path="/a1/mdosi/system" element={authenticatedAsAdmin ? <SystemPage /> : <Navigate to="/kudonjo" replace />} />
        <Route path="/a1/mdosi/trips" element={authenticatedAsAdmin ? <LogisticsTower /> : <Navigate to="/kudonjo" replace />} />
        <Route path="/a1/mdosi/merch" element={authenticatedAsAdmin ? <Merch /> : <Navigate to="/kudonjo" replace />} />
        
        {/* STANDARDIZED REDIRECT BASES */}
        <Route path="/access-denied" element={
          <div style={{ textAlign: 'center', padding: '50px', color: '#ff4d4d', fontFamily: 'sans-serif' }}>
            <h2>Access Denied</h2>
            <a href="/kufika">Return to Member Portal</a>
          </div>
        } />
        <Route path="*" element={<Navigate to="/kufika" replace />} />
      </Routes>

      
      {isClientExperienceRoute && !isDashboardRoute && <VisitorFooter />}
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


function VisitorFooter() {
  return (
    <footer className="bg-[#08090a] border-t border-white/5 pt-44 pb-16 relative overflow-hidden z-20">
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full text-center overflow-hidden pointer-events-none select-none z-0 px-4">
        <h2 className="text-[11vw] font-black tracking-tighter opacity-[0.02] text-white leading-none uppercase">
          #YOLOCONNECT
        </h2>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 relative z-10 mb-24 items-start">
        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-amber-500 font-bold font-mono"> Stay Updated</h4>
          <p className="text-xs font-light text-slate-400 leading-relaxed max-w-xs">
            Signup to our newsletter. Get exclusive paths, design drops, and hidden track coordinates to make your experience unforgettable.
          </p>
          <div className="flex gap-2 max-w-sm">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs w-full focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-white placeholder-slate-600" 
            />
            <button className="bg-amber-500 text-black font-bold px-6 rounded-xl text-[10px] uppercase tracking-wider hover:bg-white hover:text-black transition-colors whitespace-nowrap font-mono">
              Subscribe
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold font-mono"> Quick Navigation</h4>
          <div className="grid grid-cols-2 gap-8 text-xs text-slate-400 font-light">
            <div className="space-y-4 flex flex-col">
              <Link to="/c2/v1/events" className="hover:text-amber-400 transition-colors">Events</Link>
              <Link to="/c2/v1/experiences" className="hover:text-amber-400 transition-colors">Experiences</Link>
              <Link to="/c2/v1/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
              <Link to="/c2/v1/faq" className="hover:text-amber-400 transition-colors">FAQ</Link>
            </div>
            <div className="space-y-4 flex flex-col">
              <Link to="/c2/v1/about" className="hover:text-amber-400 transition-colors">About Story</Link>
              <Link to="/c2/v1/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link>
              <Link to="/c2/v1/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:justify-self-end w-full max-w-xs">
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold md:text-right font-mono"> Vibes and Inshallah</h4>
          <div className="bg-gradient-to-br from-white/[0.03] to-transparent p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-36 backdrop-blur-sm shadow-xl">
            <div className="flex justify-between items-center text-slate-500 text-[10px] gap-1.5 text-emerald-400">
              <span>Da Code</span>
              <span className="text-amber-500">•</span>
            </div>
            <div>
              <p className='text-[10px] uppercase tracking-[0.25em] text-amber-500 font-bold font-mono'>
                It is always done For the Brand . By the Brand . With the Brand
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 border-t border-white/5 pt-8 text-[10px] uppercase tracking-widest text-slate-600 font-mono">
        <p>© 2026 YOLO CONNECT. ALL RIGHTS RESERVED.</p>
        <p>FOR THE BRAND . BY THE BRAND .WITH THE BRAND </p>
        <p>Designed by <span className="text-amber-500">Mkulimah</span></p>
      </div>
    </footer>
  );
}