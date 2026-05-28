import { Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <div className="app">
      <Navbar />
      <main className={isLanding ? 'main-landing' : 'main-content'}>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <strong>EKYAM</strong>
            <span>एक्यम् — Unity in diversity</span>
          </div>
          <div className="footer-links">
            <Link to="/resources">Resources</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/communities">Communities</Link>
            <Link to="/register">Join</Link>
          </div>
          <p className="footer-copy">
            Open community platform · Node.js · React · MongoDB · JWT Auth
          </p>
        </div>
      </footer>
    </div>
  );
}
