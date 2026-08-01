import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { authAPI } from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import { UserPlus, GraduationCap, BookOpen, Presentation } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'instructor';
}

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: { role: 'student' },
  });

  const onSubmit = async ({ username, email, password, role }: RegisterFormData) => {
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.register({ username, email, password, role });
      login(res.data.token, res.data.user);
      toast.success(`Welcome to EduConnect, ${res.data.user.username}!`);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="animate-fade-in">
        <div style={styles.logoArea}>
          <GraduationCap size={36} color="#6366f1" />
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join EduConnect and start your journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form} noValidate>
          {error && <ErrorAlert message={error} />}

          {/* Role Toggle */}
          <div className="form-group">
            <label className="form-label">I want to...</label>
            <div style={styles.roleGrid}>
              {(['student', 'instructor'] as const).map((r) => (
                <label key={r} style={styles.roleLabel}>
                  <input type="radio" value={r} {...register('role')} style={{ display: 'none' }} />
                  <div style={{
                    ...styles.roleCard,
                    ...(watch('role') === r ? styles.roleCardActive : {}),
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                  }}>
                    {r === 'student' ? <><BookOpen size={16} color="#2563EB" /> Learn</> : <><Presentation size={16} /> Teach</>}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              type="text"
              className="form-input"
              placeholder="nji-durell"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
              })}
            />
            {errors.username && <span className="form-error">{errors.username.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
              })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              placeholder="Min. 6 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm-password">Confirm Password</label>
            <input
              id="reg-confirm-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === watch('password') || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
            <UserPlus size={16} />
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(204,255,0,0.1) 0%, transparent 70%)',
  },
  card: {
    background: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-xl)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '460px',
    boxShadow: 'var(--shadow-lg)',
  },
  logoArea: { textAlign: 'center', marginBottom: '2rem' },
  title: { fontSize: '1.75rem', fontWeight: 800, marginTop: '0.75rem', marginBottom: '0.25rem' },
  subtitle: { color: 'var(--color-text-secondary)', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  roleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  roleLabel: { cursor: 'pointer' },
  roleCard: {
    padding: '0.75rem',
    borderRadius: 'var(--radius-md)',
    border: '2px solid var(--color-border)',
    textAlign: 'center',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'all 0.2s',
    color: 'var(--color-text-secondary)',
    background: 'var(--color-surface)',
  },
  roleCardActive: {
    border: '2px solid var(--color-primary)',
    background: 'var(--color-bg)',
    color: 'var(--color-text-primary)',
  },
  switchText: { textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' },
  link: { color: 'var(--color-primary-light)', fontWeight: 600 },
};

export default RegisterPage;
