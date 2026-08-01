import { Link } from 'react-router-dom';
import { Star, Users, Clock } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  actions?: React.ReactNode;
}

const CategoryColors: Record<string, string> = {
  Programming: 'badge-primary',
  Design: 'badge-secondary',
  Marketing: 'badge-warning',
  Business: 'badge-success',
  'Data Science': 'badge-primary',
  Other: 'badge-secondary',
};

const CourseCard = ({ course, actions }: CourseCardProps) => {
  const thumbnail = course.thumbnail || `https://picsum.photos/seed/${course._id}/600/340`;

  return (
    <div className="glass-panel" style={styles.card}>
      {/* Thumbnail */}
      <Link to={`/courses/${course._id}`} style={styles.imgWrapper}>
        <img src={thumbnail} alt={course.title} style={styles.img} />
        <span className={`badge ${CategoryColors[course.category] || 'badge-primary'}`} style={styles.categoryBadge}>
          {course.category}
        </span>
      </Link>

      {/* Body */}
      <div style={styles.body}>
        <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
          <h3 style={styles.title}>{course.title}</h3>
        </Link>
        <p style={styles.desc}>{course.description.substring(0, 100)}...</p>

        {/* Instructor */}
        <div style={styles.instructor}>
          <div style={styles.instructorAvatar}>
            {course.instructor?.username?.charAt(0).toUpperCase()}
          </div>
          <span style={styles.instructorName}>{course.instructor?.username}</span>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.stat}>
            <Star size={13} fill="#D97706" color="#D97706" />
            <span>{course.averageRating.toFixed(1)}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>({course.totalReviews})</span>
          </div>
          <div style={styles.stat}>
            <Users size={13} color="#7C3AED" />
            <span>{course.enrollmentCount} enrolled</span>
          </div>
          <div style={styles.stat}>
            <Clock size={13} />
            <span>{course.modules?.length || 0} modules</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.price}>
          {course.price === 0 ? 'Free' : `${course.price.toLocaleString()} XAF`}
        </span>
        {actions ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>{actions}</div>
        ) : (
          <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm">
            View Course
          </Link>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'transform 0.25s, box-shadow 0.25s',
  },
  imgWrapper: {
    position: 'relative',
    aspectRatio: '16/9',
    overflow: 'hidden',
    display: 'block',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  categoryBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
  },
  body: { padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  title: {
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.3,
    color: 'var(--color-text-primary)',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  desc: {
    fontSize: '0.82rem',
    color: 'var(--color-text-muted)',
    lineHeight: 1.5,
    flex: 1,
  },
  instructor: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  instructorAvatar: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: 'var(--gradient-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    fontWeight: 700,
    color: 'white',
  },
  instructorName: { fontSize: '0.8rem', color: 'var(--color-text-secondary)' },
  stats: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.78rem',
    color: 'var(--color-text-secondary)',
  },
  footer: {
    padding: '0.75rem 1.25rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 800,
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
};

export default CourseCard;
