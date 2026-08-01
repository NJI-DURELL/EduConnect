import { Link } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          {/* Brand */}
          <div style={styles.brand}>
            <Link to="/" style={styles.logo}>
              <GraduationCap size={22} color="var(--color-text-primary)" />
              <span style={styles.logoText}>EduConnect</span>
            </Link>
            <p style={styles.tagline}>
              Empowering learners and educators to connect, grow, and thrive together.
            </p>
            <div style={styles.socials}>
              <a href="https://github.com/NJI-DURELL" target="_blank" rel="noreferrer" style={styles.social}><Github size={18} /></a>
              <a href="https://linkedin.com/nji-durell" target="_blank" rel="noreferrer" style={styles.social}><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p style={styles.colTitle}>Platform</p>
            <div style={styles.colLinks}>
              <Link to="/courses" style={styles.footerLink}>Browse Courses</Link>
              <Link to="/register" style={styles.footerLink}>Become an Instructor</Link>
              <Link to="/dashboard/enrolled" style={styles.footerLink}>My Learning</Link>
            </div>
          </div>

          <div>
            <p style={styles.colTitle}>Account</p>
            <div style={styles.colLinks}>
              <Link to="/login" style={styles.footerLink}>Login</Link>
              <Link to="/register" style={styles.footerLink}>Register</Link>
              <Link to="/profile" style={styles.footerLink}>Profile</Link>
            </div>
          </div>
        </div>

        <div style={styles.bottom}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
            © {new Date().getFullYear()} EduConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    background: 'var(--color-surface)',
    borderTop: '1px solid var(--color-border)',
    padding: '3rem 0 1.5rem',
    marginTop: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '3rem',
    marginBottom: '2rem',
  },
  brand: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' },
  logoText: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--color-text-primary)',
  },
  tagline: { color: 'var(--color-text-muted)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '280px' },
  socials: { display: 'flex', gap: '0.75rem' },
  social: {
    color: 'var(--color-text-muted)',
    transition: 'color 0.2s',
    display: 'flex',
    alignItems: 'center',
  },
  colTitle: { fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-primary)', marginBottom: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' },
  colLinks: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  footerLink: { color: 'var(--color-text-muted)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' },
  bottom: { borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', textAlign: 'center' },
};

export default Footer;
