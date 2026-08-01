import { Module } from '../types';
import { PlayCircle } from 'lucide-react';

interface ModuleListProps {
  modules: Module[];
}

const ModuleList = ({ modules }: ModuleListProps) => {
  if (!modules || modules.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No modules added yet.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {modules.map((mod, idx) => (
        <div key={mod._id || idx} style={styles.module}>
          <div style={styles.icon}>
            <PlayCircle size={16} color="var(--color-primary)" />
          </div>
          <div>
            <p style={styles.title}>
              <span style={styles.orderBadge}>{idx + 1}</span>
              {mod.title}
            </p>
            {mod.content && (
              <p style={styles.content}>{mod.content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  module: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
    padding: '0.875rem 1rem',
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    transition: 'background 0.2s',
  },
  icon: { marginTop: '2px', flexShrink: 0 },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--color-text-primary)',
  },
  orderBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.2)',
    color: 'var(--color-primary-light)',
    fontSize: '0.7rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  content: {
    color: 'var(--color-text-muted)',
    fontSize: '0.82rem',
    marginTop: '0.25rem',
    lineHeight: 1.5,
  },
};

export default ModuleList;
