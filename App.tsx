
import React, { useState, useEffect, Suspense } from 'react';
import Navbar from './components/Navbar';
import HomePage from './app/page';
import ModelSearchPage from './app/models/page';
import JoinPage from './app/join/page';
import LoginPage from './app/login/page';
import AdminDashboard from './app/admin/page';
import ModelDashboard from './app/dashboard/page';
import StudioSignature from './components/StudioSignature';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

export type UserRole = 'agency' | 'model' | 'admin' | null;

const App = () => {
  // Simple router implementation since we can't use Next.js Router in this environment
  const [currentPath, setCurrentPath] = useState('/');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  
  // Auth State: Replaced boolean with UserRole
  const [userRole, setUserRole] = useState<UserRole>(null);

  useEffect(() => {
    // Handle initial hash routing
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      const [path, search] = hash.split('?');
      
      setCurrentPath(path);
      
      if (search) {
        const params: Record<string, string> = {};
        new URLSearchParams(search).forEach((value, key) => {
          params[key] = value;
        });
        setQueryParams(params);
      } else {
        setQueryParams({});
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const handleLoginSuccess = (role: 'agency' | 'model' | 'admin') => {
    setUserRole(role);
    // Redirect based on role
    if (role === 'agency') {
      navigate('/models');
    } else if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'model') {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    navigate('/');
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/models':
        return (
          <ModelSearchPage 
            initialCategory={queryParams.category} 
            isAgency={userRole === 'agency'}
            onNavigate={navigate}
          />
        );
      case '/join':
        return <JoinPage />;
      case '/login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case '/admin':
        return userRole === 'admin' ? <AdminDashboard /> : <LoginPage onLoginSuccess={handleLoginSuccess} />;
      case '/dashboard':
        return userRole === 'model' ? <ModelDashboard /> : <LoginPage onLoginSuccess={handleLoginSuccess} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white relative">
        <Navbar
          onNavigate={navigate}
          currentPage={currentPath}
          userRole={userRole}
          onLogout={handleLogout}
        />

        <main>
          <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
            {renderPage()}
          </Suspense>
        </main>

        {/* Global Studio Signature - Fixed Position */}
        <StudioSignature variant="fixed" />

        {/* Footer */}
        <footer className="bg-black text-white py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="font-serif text-2xl font-bold">HIRE THE GLAM</span>
              <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">
                &copy; {new Date().getFullYear()} Hire The Glam Agency. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6 text-xs uppercase tracking-widest text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Email Us</a>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
