import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Star, Zap, Shield, BarChart3, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page" style={{ padding: '0 0 5rem 0' }}>
      
      {/* Liquid Glass Hero Section */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <div className="badge badge-primary" style={{ marginBottom: '2rem', display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
            <Zap size={14} fill="currentColor" /> The Next Generation of Learning
          </div>
          
          <h1 style={styles.heroTitle}>
            Master Your Craft.<br />
            <span style={{ color: 'var(--color-primary-dark)' }}>Defy Boundaries.</span>
          </h1>
          
          <p style={styles.heroSubtitle}>
            Experience a fluid, immersive learning environment. Join elite instructors and thousands of students pushing the limits of online education.
          </p>
          
          <div style={styles.heroActions}>
            <Link to="/courses" className="btn btn-primary btn-lg">
              Explore Courses <ArrowRight size={18} />
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-secondary btn-lg">
                Start Teaching
              </Link>
            )}
          </div>

          {/* Floating Glass Widgets Demo */}
          <div style={styles.widgetContainer}>
            <div className="glass-panel" style={{...styles.widget, transform: 'translateY(10px) rotate(-2deg)'}}>
               <div style={styles.widgetIcon}><Layers size={24} color="#3B82F6" /></div>
               <div style={{fontWeight: 800, fontSize: '1.2rem'}}>150+</div>
               <div style={{color: 'var(--color-text-secondary)', fontSize: '0.85rem'}}>Interactive Modules</div>
            </div>
            <div className="glass-panel" style={{...styles.widget, transform: 'translateY(-10px) rotate(1deg)', zIndex: 10, padding: '2rem'}}>
               <div style={styles.widgetIcon}><Users size={32} color="#7C3AED" /></div>
               <div style={{fontWeight: 900, fontSize: '2rem'}}>50k+</div>
               <div style={{color: 'var(--color-text-secondary)', fontSize: '0.95rem', fontWeight: 600}}>Active Students</div>
            </div>
            <div className="glass-panel" style={{...styles.widget, transform: 'translateY(15px) rotate(3deg)'}}>
               <div style={styles.widgetIcon}><Star size={24} fill="#D97706" color="#D97706" /></div>
               <div style={{fontWeight: 800, fontSize: '1.2rem'}}>4.9/5</div>
               <div style={{color: 'var(--color-text-secondary)', fontSize: '0.85rem'}}>Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section with Glass Cards */}
      <section style={styles.featureSection}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Designed for Fluency</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
              Everything you need to learn effectively, wrapped in an interface that feels invisible.
            </p>
          </div>

          <div style={styles.featuresGrid}>
            {[
              { icon: <BookOpen size={24} color="#2563EB" />, title: 'Immersive Courses', text: 'Dive deep into interactive modules that adapt to your pace.' },
              { icon: <Users size={24} color="#7C3AED" />, title: 'Community Driven', text: 'Learn alongside peers with direct instructor access.' },
              { icon: <Star size={24} fill="#D97706" color="#D97706" />, title: 'Verified Reviews', text: 'Transparent ratings help you pick the best content.' },
              { icon: <Shield size={24} color="#10B981" />, title: 'Enterprise Security', text: 'Bank-level encryption secures your data.' },
              { icon: <Zap size={24} color="#D97706" />, title: 'Lightning Fast', text: 'Optimized performance for zero buffering.' },
              { icon: <BarChart3 size={24} color="#EC4899" />, title: 'Analytics', text: 'Track your progress with beautiful dashboards.' },
            ].map((feature, i) => (
              <div key={i} className="glass-panel" style={styles.featureCard}>
                <div style={styles.featureIconWrap}>
                  {feature.icon}
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureText}>{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  hero: {
    padding: '8rem 0 4rem',
    position: 'relative',
    textAlign: 'center',
    overflow: 'hidden',
  },
  heroContent: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: '4.5rem',
    fontWeight: 900,
    letterSpacing: '-0.04em',
    lineHeight: 1.1,
    marginBottom: '1.5rem',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: 'var(--color-text-secondary)',
    maxWidth: '640px',
    margin: '0 auto 2.5rem',
    lineHeight: 1.5,
    fontWeight: 500,
  },
  heroActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '5rem',
  },
  widgetContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.5rem',
    width: '100%',
    maxWidth: '800px',
  },
  widget: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    flex: 1,
  },
  widgetIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    background: 'var(--color-glass-heavy)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  featureSection: {
    padding: '5rem 0',
    position: 'relative',
    zIndex: 2,
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  featureIconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '20px',
    background: 'var(--color-glass-heavy)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-glass-sm)',
    border: '1px solid var(--color-glass-border)',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
  },
  featureText: {
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
    fontWeight: 500,
  },
};

export default HomePage;
