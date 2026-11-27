import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useFocusScope } from '../../hooks/useFocusScope';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import {SectionLink} from '../learning/SectionLink';
import {useSectionNavigation} from '../../hooks/useSectionNavigation';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { pathname, hash } = useLocation();
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  useFocusScope(sidebarOpen, '#academy-sidebar', closeSidebar);
  useEffect(() => {
    setSidebarOpen(false);
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  useSectionNavigation();
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (media.matches) setSidebarOpen(false); };
    media.addEventListener('change', closeOnDesktop);
    return () => media.removeEventListener('change', closeOnDesktop);
  }, []);
  return (
    <div className="min-h-screen bg-void flex flex-col">
      <SectionLink sectionId="main-content" className="skip-link">Skip to content</SectionLink>
      <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        {/* Main Content Area: Offset for desktop sidebar */}
        <main id="main-content" tabIndex={-1} className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
