import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseAPI } from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { Edit, Plus, Trash2, BookOpen, Clock, Activity, BarChart3, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import CourseCard from '../components/CourseCard';

const DashboardPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, [user]);

  const fetchMyCourses = async () => {
    try {
      const res = await courseAPI.getAll();
      const myCourses = res.data.filter((c: any) => c.instructor._id === user?._id);
      setCourses(myCourses);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await courseAPI.delete(id);
      toast.success('Course deleted');
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const totalStudents = courses.reduce((acc, curr) => acc + curr.enrollmentCount, 0);
  const totalRevenue = courses.reduce((acc, curr) => acc + (curr.enrollmentCount * curr.price), 0);

  return (
    <div className="page container">
      
      {/* Bento Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user?.profilePicture ? (
             <img src={user.profilePicture} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '24px', objectFit: 'cover', boxShadow: 'var(--shadow-glass-sm)' }} />
          ) : (
             <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)', boxShadow: 'var(--shadow-glow)' }}>
               {user?.username?.charAt(0).toUpperCase()}
             </div>
          )}
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Welcome back, {user?.username}</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>Here's what's happening with your account today.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/profile" className="btn btn-secondary">
             <Settings size={18} /> Settings
          </Link>
          {user?.role === 'instructor' && (
            <Link to="/dashboard/courses/new" className="btn btn-primary">
              <Plus size={18} /> New Course
            </Link>
          )}
        </div>
      </div>

      {/* Bento Grid */}
      <div style={styles.bentoGrid}>
        
        {/* Main Stats (Span 2 cols if possible) */}
        <div className="glass-panel" style={{ ...styles.bentoBox, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Activity size={20} color="#7C3AED" />
            <h3 style={{ fontSize: '1.1rem' }}>Overview</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: '2rem' }}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{user?.role === 'instructor' ? courses.length : '--'}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Active Courses</div>
             </div>
             <div style={{ width: '1px', background: 'var(--color-glass-border)' }}></div>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{user?.role === 'instructor' ? totalStudents : '--'}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Total Students</div>
             </div>
             <div style={{ width: '1px', background: 'var(--color-glass-border)' }}></div>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{user?.role === 'instructor' ? `${totalRevenue.toLocaleString()}` : '--'}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Revenue (XAF)</div>
             </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="glass-panel" style={styles.bentoBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <BarChart3 size={20} color="#3B82F6" />
            <h3 style={{ fontSize: '1.1rem' }}>Shortcuts</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <Link to="/courses" className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}>Browse Catalog</Link>
             <Link to="/dashboard/enrolled" className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}>My Learning</Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {user?.role === 'instructor' && (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Your Teaching Courses</h2>
          
          {loading ? (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="skeleton" style={{ height: '240px', flex: 1, borderRadius: 'var(--radius-lg)' }}></div>
              <div className="skeleton" style={{ height: '240px', flex: 1, borderRadius: 'var(--radius-lg)' }}></div>
            </div>
          ) : courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--color-glass-heavy)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-glass-border)' }}>
              <BookOpen size={48} color="var(--color-text-muted)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No courses yet</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Create your first course to start teaching.</p>
              <Link to="/dashboard/courses/new" className="btn btn-primary">Create Course</Link>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  actions={
                    <>
                      <Link to={`/dashboard/courses/${course._id}/edit`} className="btn btn-secondary btn-sm" style={{flex: 1}}>
                        <Edit size={14} /> Edit
                      </Link>
                      <button onClick={() => handleDelete(course._id, course.title)} className="btn btn-danger btn-sm" style={{flex: 1}}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5rem',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  bentoBox: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
};

export default DashboardPage;
