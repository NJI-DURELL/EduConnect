import { useState, useEffect } from 'react';
import { courseAPI } from '../api/axiosInstance';
import { Review } from '../types';
import StarRating from './StarRating';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { MessageSquare } from 'lucide-react';

interface ReviewListProps {
  courseId: string;
  refreshTrigger?: number;
}

const ReviewList = ({ courseId, refreshTrigger }: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const { data } = await courseAPI.getReviews(courseId);
        if (!cancelled) setReviews(data.reviews);
      } catch {
        if (!cancelled) setError('Could not load reviews.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchReviews();

    // Cleanup to prevent state updates on unmounted component
    return () => { cancelled = true; };
  }, [courseId, refreshTrigger]);

  if (loading) return <LoadingSpinner text="Loading reviews..." />;
  if (error) return <p style={{ color: 'var(--color-error)' }}>{error}</p>;
  if (reviews.length === 0) return (
    <EmptyState icon={MessageSquare} title="No reviews yet" description="Be the first to leave a review!" />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {reviews.map((review) => (
        <div key={review._id} className="card animate-fade-in" style={styles.reviewCard}>
          <div style={styles.header}>
            <div style={styles.avatar}>
              {review.student?.profilePicture ? (
                <img src={review.student.profilePicture} alt={review.student.username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                review.student?.username?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p style={styles.username}>{review.student?.username}</p>
              <StarRating rating={review.rating} size={14} />
            </div>
            <span style={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          <p style={styles.comment}>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  reviewCard: { padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  header: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'var(--gradient-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'white',
    flexShrink: 0,
  },
  username: { fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' },
  date: { marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--color-text-muted)' },
  comment: { color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 },
};

export default ReviewList;
