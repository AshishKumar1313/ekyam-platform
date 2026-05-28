import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-pro">
      <Link to="/" className="logo">
        <span className="logo-mark">E</span>
        <span>
          EKYAM
          <small>Unity in Diversity</small>
        </span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/communities">Communities</NavLink>
        <NavLink to="/resources">Resources</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        {user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
            <span className="nav-user">{user.name}</span>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" className="btn btn-primary btn-sm">
              Join Free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
