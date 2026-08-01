import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => (
  <div style={styles.page}>
    <div style={styles.content} className="animate-fade-in">
      <div style={styles.code}>404</div>
      <h1 style={styles.title}>Page Not Found</h1>
      <p style={styles.desc}>
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={16} /> Go Home
        </Link>
        <button className="btn btn-secondary" onClick={() => window.history.back()}>
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    </div>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '75vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    textAlign: 'center',
  },
  content: { maxWidth: '480px' },
  code: {
    fontSize: '8rem',
    fontWeight: 900,
    lineHeight: 1,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1.5rem',
  },
  title: { fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' },
  desc: { color: 'var(--color-text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 },
};

export default NotFoundPage;
