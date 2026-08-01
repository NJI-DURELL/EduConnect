import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert = ({ message }: ErrorAlertProps) => (
  <div style={styles.wrapper}>
    <AlertCircle size={18} color="var(--color-error)" />
    <span style={styles.text}>{message}</span>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.6rem',
    padding: '0.875rem 1.25rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 'var(--radius-md)',
    animation: 'fadeIn 0.3s ease',
  },
  text: {
    color: '#fca5a5',
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
};

export default ErrorAlert;
