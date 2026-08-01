interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizes = { sm: 20, md: 32, lg: 48 };

const LoadingSpinner = ({ size = 'md', text }: LoadingSpinnerProps) => {
  const px = sizes[size];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div
        style={{
          width: px,
          height: px,
          border: `3px solid rgba(99,102,241,0.2)`,
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
