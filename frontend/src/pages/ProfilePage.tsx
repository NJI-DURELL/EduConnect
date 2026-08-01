import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { userAPI } from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { User, Lock, Camera, Save } from 'lucide-react';

interface ProfileFormData {
  username: string;
  bio: string;
  profilePicture: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const profileForm = useForm<ProfileFormData>();
  const passwordForm = useForm<PasswordFormData>();

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      try {
        const { data } = await userAPI.getMe();
        if (!cancelled) {
          profileForm.reset({
            username: data.user.username,
            bio: data.user.bio,
            profilePicture: data.user.profilePicture,
          });
        }
      } catch {
        /* user already in context */
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, []);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setProfileError('');
    setProfileLoading(true);
    try {
      const res = await userAPI.updateMe(data);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Update failed.');
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async ({ currentPassword, newPassword, confirmPassword }: PasswordFormData) => {
    if (newPassword !== confirmPassword) {
      passwordForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    setPasswordError('');
    setPasswordLoading(true);
    try {
      await userAPI.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully!');
      passwordForm.reset();
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Password change failed.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '680px' }}>
        <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Profile Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2.5rem' }}>
          Manage your account information and security settings.
        </p>

        {/* Avatar Preview */}
        <div style={styles.avatarSection}>
          <div style={styles.avatarLarge}>
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '1.25rem' }}>{user?.username}</p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{user?.email}</p>
            <span className={`badge ${user?.role === 'instructor' ? 'badge-secondary' : 'badge-primary'}`} style={{ marginTop: '0.5rem' }}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <User size={18} color="#7C3AED" />
            <h2 style={styles.sectionTitle}>Personal Information</h2>
          </div>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} style={styles.form} noValidate>
            {profileError && <ErrorAlert message={profileError} />}

            <div className="form-group">
              <label className="form-label" htmlFor="profile-username">Username</label>
              <input
                id="profile-username"
                className="form-input"
                {...profileForm.register('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Min 3 characters' },
                })}
              />
              {profileForm.formState.errors.username && (
                <span className="form-error">{profileForm.formState.errors.username.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-bio">Bio</label>
              <textarea
                id="profile-bio"
                className="form-textarea"
                placeholder="Tell us about yourself..."
                style={{ minHeight: '100px' }}
                {...profileForm.register('bio', { maxLength: { value: 500, message: 'Max 500 characters' } })}
              />
              {profileForm.formState.errors.bio && (
                <span className="form-error">{profileForm.formState.errors.bio.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-picture">
                <Camera size={14} /> Profile Picture URL
              </label>
              <input
                id="profile-picture"
                type="url"
                className="form-input"
                placeholder="https://example.com/avatar.jpg"
                {...profileForm.register('profilePicture')}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={profileLoading} style={{ alignSelf: 'flex-start' }}>
              <Save size={15} />
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password Form */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Lock size={18} color="var(--color-primary)" />
            <h2 style={styles.sectionTitle}>Change Password</h2>
          </div>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} style={styles.form} noValidate>
            {passwordError && <ErrorAlert message={passwordError} />}

            <div className="form-group">
              <label className="form-label" htmlFor="current-password">Current Password</label>
              <input
                id="current-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                {...passwordForm.register('currentPassword', { required: 'Current password is required' })}
              />
              {passwordForm.formState.errors.currentPassword && (
                <span className="form-error">{passwordForm.formState.errors.currentPassword.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                className="form-input"
                placeholder="Min 6 characters"
                {...passwordForm.register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
              />
              {passwordForm.formState.errors.newPassword && (
                <span className="form-error">{passwordForm.formState.errors.newPassword.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-new-password">Confirm New Password</label>
              <input
                id="confirm-new-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                {...passwordForm.register('confirmPassword', { required: 'Please confirm your password' })}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <span className="form-error">{passwordForm.formState.errors.confirmPassword.message}</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={passwordLoading} style={{ alignSelf: 'flex-start' }}>
              <Lock size={15} />
              {passwordLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1.5rem',
    background: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '2rem',
  },
  avatarLarge: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'var(--gradient-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    border: '3px solid rgba(99,102,241,0.3)',
  },
  section: {
    background: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.75rem',
    marginBottom: '1.5rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  sectionTitle: { fontSize: '1rem', fontWeight: 700 },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
};

export default ProfilePage;
