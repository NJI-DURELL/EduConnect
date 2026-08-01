import { useState, useEffect } from 'react';
import { enrollmentAPI } from '../api/axiosInstance';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const EnrolledCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await enrollmentAPI.getMyEnrollments();
        if (!cancelled) setCourses(data.courses);
      } catch {
        if (!cancelled) setError('Could not load enrolled courses.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Learning</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            {courses.length > 0
              ? `You are enrolled in ${courses.length} course${courses.length !== 1 ? 's' : ''}`
              : 'Courses you enroll in will appear here'}
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
            <LoadingSpinner size="lg" text="Loading your courses..." />
          </div>
        ) : error ? (
          <ErrorAlert message={error} />
        ) : courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No enrolled courses"
            description="Browse the catalog and enroll in a course to start learning."
            action={
              <Link to="/courses" className="btn btn-primary">
                Browse Courses
              </Link>
            }
          />
        ) : (
          <div className="courses-grid animate-fade-in">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCoursesPage;
