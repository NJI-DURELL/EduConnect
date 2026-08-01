import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI, enrollmentAPI } from '../api/axiosInstance';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import ModuleList from '../components/ModuleList';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import {
  Users, Clock, Star, Tag, CheckCircle, ArrowLeft, BookOpen,
} from 'lucide-react';

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [activeTab, setActiveTab] = useState<'modules' | 'reviews'>('modules');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await courseAPI.getById(id!);
        if (!cancelled) setCourse(data.course);

        // Check enrollment if authenticated
        if (isAuthenticated) {
          const enrollRes = await enrollmentAPI.getMyEnrollments();
          if (!cancelled) {
            const enrolled = enrollRes.data.courses.some((c: Course) => c._id === id);
            setIsEnrolled(enrolled);
          }
        }
      } catch {
        if (!cancelled) setError('Could not load course.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!id) return;
    setEnrolling(true);
    try {
      await courseAPI.enroll(id);
      setIsEnrolled(true);
      toast.success('You are now enrolled!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Enrollment failed.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <LoadingSpinner size="lg" text="Loading course..." />
    </div>
  );

  if (error || !course) return (
    <div className="container page"><ErrorAlert message={error || 'Course not found.'} /></div>
  );

  const isOwnCourse = user?._id === course.instructor?._id;

  return (
    <div className="page">
      <div className="container">
        {/* Breadcrumb */}
        <Link to="/courses" style={styles.back}>
          <ArrowLeft size={16} /> Back to Catalog
        </Link>

        <div style={styles.layout}>
          {/* Left: Course Info */}
          <div style={styles.main}>
            {/* Category + Title */}
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>{course.category}</span>
            <h1 style={styles.title}>{course.title}</h1>
            <p style={styles.desc}>{course.description}</p>

            {/* Meta Row */}
            <div style={styles.meta}>
              <div style={styles.metaItem}><Star size={14} fill="#D97706" color="#D97706" />
                <span>{course.averageRating.toFixed(1)}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>({course.totalReviews} reviews)</span>
              </div>
              <div style={styles.metaItem}><Users size={14} color="#7C3AED" />{course.enrollmentCount} students</div>
              <div style={styles.metaItem}><Clock size={14} />{course.modules?.length || 0} modules</div>
              <div style={styles.metaItem}><Tag size={14} />{course.price === 0 ? 'Free' : `${course.price.toLocaleString()} XAF`}</div>
            </div>

            {/* Instructor */}
            <div style={styles.instructor}>
              <div style={styles.instructorAvatar}>
                {course.instructor?.profilePicture
                  ? <img src={course.instructor.profilePicture} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : course.instructor?.username?.charAt(0).toUpperCase()
                }
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Instructor</p>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{course.instructor?.username}</p>
                {course.instructor?.bio && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{course.instructor.bio}</p>}
              </div>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
              {(['modules', 'reviews'] as const).map((tab) => (
                <button key={tab} style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }} onClick={() => setActiveTab(tab)}>
                  {tab === 'modules' ? <><BookOpen size={14} color="#2563EB" /> Modules ({course.modules?.length})</> : <><Star size={14} color="#D97706" /> Reviews ({course.totalReviews})</>}
                </button>
              ))}
            </div>

            {activeTab === 'modules' ? (
              <ModuleList modules={course.modules} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {isAuthenticated && isEnrolled && !isOwnCourse && (
                  <ReviewForm courseId={course._id} onReviewAdded={() => setReviewRefresh((r) => r + 1)} />
                )}
                <ReviewList courseId={course._id} refreshTrigger={reviewRefresh} />
              </div>
            )}
          </div>

          {/* Right: Sticky Enroll Card */}
          <div style={styles.sidebar}>
            <div style={styles.enrollCard}>
              <img
                src={course.thumbnail || `https://picsum.photos/seed/${course._id}/500/280`}
                alt={course.title}
                style={styles.enrollImg}
              />
              <div style={{ padding: '1.5rem' }}>
                <p style={styles.enrollPrice}>
                  {course.price === 0 ? 'Free' : `${course.price.toLocaleString()} XAF`}
                </p>
                <StarRating rating={course.averageRating} size={18} />
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
                  {course.totalReviews} ratings · {course.enrollmentCount} students
                </p>

                {!isAuthenticated ? (
                  <Link to="/login" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>
                    Login to Enroll
                  </Link>
                ) : isOwnCourse ? (
                  <Link to={`/dashboard/courses/${course._id}/edit`} className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>
                    Edit Course
                  </Link>
                ) : isEnrolled ? (
                  <div className="btn btn-secondary w-full" style={{ justifyContent: 'center', cursor: 'default', color: 'var(--color-success)' }}>
                    <CheckCircle size={16} /> Enrolled
                  </div>
                ) : (
                  <button
                    className="btn btn-primary w-full"
                    style={{ justifyContent: 'center' }}
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  back: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', textDecoration: 'none' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem', alignItems: 'start' },
  main: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  title: { fontSize: '2rem', fontWeight: 800, lineHeight: 1.2 },
  desc: { color: 'var(--color-text-secondary)', lineHeight: 1.7 },
  meta: { display: 'flex', flexWrap: 'wrap', gap: '1.25rem' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' },
  instructor: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--color-glass)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 'var(--radius-lg)' },
  instructorAvatar: { width: '48px', height: '48px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, color: 'white', flexShrink: 0 },
  tabs: { display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0' },
  tab: { display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', borderBottom: '2px solid transparent', marginBottom: '-1px', transition: 'all 0.2s' },
  tabActive: { color: 'var(--color-primary-light)', borderBottomColor: 'var(--color-primary)' },
  sidebar: { position: 'sticky', top: '80px' },
  enrollCard: {},
  enrollImg: { width: '100%', aspectRatio: '16/9', objectFit: 'cover' },
  enrollPrice: { fontSize: '2rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.5rem' },
};

export default CourseDetailPage;
