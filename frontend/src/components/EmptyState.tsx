import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
  return (
    <div style={styles.wrapper} className="animate-fade-in">
      {Icon && (
        <div style={styles.iconWrapper}>
          <Icon size={40} color="var(--color-primary)" strokeWidth={1.5} />
        </div>
      )}
      <h3 style={styles.title}>{title}</h3>
      {description && <p style={styles.desc}>{description}</p>}
      {action && <div style={{ marginTop: '1.25rem' }}>{action}</div>}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  iconWrapper: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: '0.5rem',
  },
  desc: {
    color: 'var(--color-text-secondary)',
    fontSize: '0.9rem',
    maxWidth: '380px',
    lineHeight: 1.6,
  },
};

export default EmptyState;
