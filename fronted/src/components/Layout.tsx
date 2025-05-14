import {type ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import { Outlet, useLocation } from 'react-router-dom';

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  // מעבר לראש העמוד בכל החלפת דף
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`app-container ${isAuthPage ? 'auth-page' : 'content-page'}`}>
      <Navbar />
      <main className="main-content">
        {children || <Outlet />}
      </main>
      {!isAuthPage && (
        <footer className="app-footer">
          <div className="footer-content">
            <p>יומן סרטים © {new Date().getFullYear()}</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;