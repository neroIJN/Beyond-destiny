import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Public layout
import Navigation from './components/Navigation';
import ScrollToTop from './components/ScrollToTop';

// Public pages
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import RequestQuote from './pages/RequestQuote';
import AlbumPage from './pages/albums/AlbumPage';

// Admin infrastructure
import { AdminAuthProvider } from './components/admin/AdminAuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAlbums from './pages/admin/AdminAlbums';
import AdminAlbumEditor from './pages/admin/AdminAlbumEditor';
import AdminQuotes from './pages/admin/AdminQuotes';
import AdminContacts from './pages/admin/AdminContacts';
import AdminHeroSlides from './pages/admin/AdminHeroSlides';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminShowcase from './pages/admin/AdminShowcase';
import AdminSettings from './pages/admin/AdminSettings';
import AdminTeamMembers from './pages/admin/AdminTeamMembers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminServices from './pages/admin/AdminServices';

import './App.css';

// ── Public routes (with Navigation + page transitions) ──────────────────
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<AlbumPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/request-quote" element={<RequestQuote />} />
      </Routes>
    </AnimatePresence>
  );
};

// ── Public shell (Navigation + animated routes) ──────────────────────────
const PublicShell = () => (
  <div className="app">
    <Navigation />
    <ScrollToTop />
    <AnimatedRoutes />
  </div>
);

// ── Root app ─────────────────────────────────────────────────────────────
// AdminAuthProvider must live inside <Router> because it calls useNavigate()
function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <Routes>
          {/* ── Admin section ── no Navigation, no page transitions ── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="albums" element={<AdminAlbums />} />
            <Route path="albums/:id" element={<AdminAlbumEditor />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="quotes" element={<AdminQuotes />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="hero-slides" element={<AdminHeroSlides />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="showcase" element={<AdminShowcase />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="team-members" element={<AdminTeamMembers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ── Public site ── everything else ── */}
          <Route path="/*" element={<PublicShell />} />
        </Routes>
      </AdminAuthProvider>
    </Router>
  );
}

export default App;
