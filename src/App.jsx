import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Team from './pages/Team';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import './styles/index.css';

// Lazy load admin components to prevent blocking main app
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const DashboardHome = React.lazy(() => import('./pages/admin/DashboardHome'));
const EventsManager = React.lazy(() => import('./pages/admin/EventsManager'));
const EventDetailPage = React.lazy(() => import('./pages/admin/EventDetailPage'));
const MembersManager = React.lazy(() => import('./pages/admin/MembersManager'));
const EmailCenter = React.lazy(() => import('./pages/admin/EmailCenter'));
const CertificatesManager = React.lazy(() => import('./pages/admin/CertificatesManager'));
const NotificationsPage = React.lazy(() => import('./pages/admin/NotificationsPage'));
const SettingsPage = React.lazy(() => import('./pages/admin/SettingsPage'));

// Main layout with Navbar and Footer for public pages
const MainLayout = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Loading fallback for lazy loaded components
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <AuthProvider>
      <Router>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes with Navbar/Footer */}
            <Route element={<MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              <Route path="/team" element={<Team />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Admin routes - separate layout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="events" element={<EventsManager />} />
              <Route path="events/:eventId" element={<EventDetailPage />} />
              <Route path="members" element={<MembersManager />} />
              <Route path="emails" element={<EmailCenter />} />
              <Route path="certificates" element={<CertificatesManager />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
