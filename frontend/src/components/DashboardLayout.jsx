import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <header className="text-white sticky top-0 z-50 shadow-lg" style={{ backgroundColor: '#2563EB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Activity className="h-7 w-7" style={{ color: '#93C5FD' }} />
              <div>
                <h1 className="text-lg font-bold leading-tight">Clinic Management</h1>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#BFDBFE' }}>
                  {user.role} Dashboard
                </p>
              </div>
            </div>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <UserIcon size={14} />
                <span className="font-medium">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{ backgroundColor: '#DC2626' }}
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t px-4 pb-3 pt-2" style={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: '#1D4ED8' }}>
            <div className="flex items-center gap-2 py-2 text-sm" style={{ color: '#BFDBFE' }}>
              <UserIcon size={14} />
              <span>{user.name} · {user.role}</span>
            </div>
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: '#DC2626' }}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 mt-auto">
        <p className="text-center text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} Clinic Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default DashboardLayout;
