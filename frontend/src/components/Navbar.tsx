import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={styles.navWrapper}>
      <nav style={styles.nav}>
        <div style={styles.inner}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <GraduationCap size={26} color="var(--color-text-primary)" />
            <span style={styles.logoText}>EduConnect</span>
          </Link>

          {/* Desktop Links */}
          <div style={styles.links}>
            <Link to="/courses" style={{ ...styles.link, ...(isActive('/courses') ? styles.linkActive : {}) }}>
              Courses
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" style={{ ...styles.link, ...(isActive('/dashboard') ? styles.linkActive : {}) }}>
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <Link to="/dashboard/enrolled" style={{ ...styles.link, ...(isActive('/dashboard/enrolled') ? styles.linkActive : {}) }}>
                  <BookOpen size={15} color="#2563EB" /> My Learning
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth */}
          <div style={styles.authArea}>
            {isAuthenticated ? (
              <>
                <Link to="/profile" style={styles.userChip}>
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.username} style={styles.avatar} />
                  ) : (
                    <div style={styles.avatarPlaceholder}>
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.username}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 1rem' }}>
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{...styles.link, fontWeight: 600}}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1.25rem' }}>Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button style={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu (Glass drop down) */}
        {menuOpen && (
          <div style={styles.mobileMenu}>
            <Link to="/courses" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Courses</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/dashboard/enrolled" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Learning</Link>
                <Link to="/profile" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Profile</Link>
                <button onClick={handleLogout} style={{ ...styles.mobileLink, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--color-error)' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  navWrapper: {
    position: 'sticky',
    top: '1rem',
    zIndex: 100,
    display: 'flex',
    justifyContent: 'center',
    padding: '0 1rem',
    marginBottom: '1rem',
  },
  nav: {
    background: 'var(--color-glass)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid var(--color-glass-border)',
    borderRadius: '100px', /* Pill shape */
    boxShadow: 'var(--shadow-glass-sm)',
    width: '100%',
    maxWidth: '1000px',
    transition: 'var(--transition)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.6rem 1rem 0.6rem 1.5rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: 'var(--color-text-primary)',
    letterSpacing: '-0.02em',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginLeft: '2rem',
    flex: 1,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.5rem 1rem',
    borderRadius: '100px',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    transition: 'all 0.2s',
    textDecoration: 'none',
  },
  linkActive: {
    color: 'var(--color-text-primary)',
    background: 'var(--color-glass-heavy)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  authArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.3rem 0.75rem 0.3rem 0.3rem',
    borderRadius: '100px',
    background: 'var(--color-glass-heavy)',
    border: '1px solid var(--color-glass-border)',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'var(--color-text-primary)',
    transition: 'var(--transition)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  menuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    padding: '0.25rem',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    borderTop: '1px solid var(--color-glass-border)',
    background: 'var(--color-glass)',
    borderBottomLeftRadius: '24px',
    borderBottomRightRadius: '24px',
  },
  mobileLink: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    color: 'var(--color-text-primary)',
    fontSize: '0.95rem',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'background 0.2s',
  },
};

export default Navbar;
