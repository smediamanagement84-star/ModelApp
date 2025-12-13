import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './app/page';
import ModelSearchPage from './app/models/page';
import JoinPage from './app/join/page';

const App = () => {
  // Simple router implementation since we can't use Next.js Router in this environment
  // and we are restricted to a single page application structure.
  
  const [currentPath, setCurrentPath] = useState('/');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});

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

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/models':
        return <ModelSearchPage initialCategory={queryParams.category} />;
      case '/join':
        return <JoinPage />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <Navbar onNavigate={navigate} currentPage={currentPath} />
      <main>
        {renderPage()}
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
           <div className="mb-6 md:mb-0">
             <span className="font-serif text-2xl font-bold">MODEL APP</span>
             <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">
               &copy; {new Date().getFullYear()} Model App Agency. All rights reserved.
             </p>
           </div>
           <div className="flex space-x-6 text-xs uppercase tracking-widest text-gray-400">
             <a href="#" className="hover:text-white">Instagram</a>
             <a href="#" className="hover:text-white">Facebook</a>
             <a href="#" className="hover:text-white">Email Us</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;