import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { courseAPI } from '../api/axiosInstance';
import toast from 'react-hot-toast';
import StarRating from './StarRating';
import { Send } from 'lucide-react';

interface ReviewFormData {
  comment: string;
}

interface ReviewFormProps {
  courseId: string;
  onReviewAdded: () => void;
}

const ReviewForm = ({ courseId, onReviewAdded }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormData>();

  const onSubmit = async ({ comment }: ReviewFormData) => {
    if (rating === 0) {
      toast.error('Please select a star rating.');
      return;
    }

    setSubmitting(true);
    try {
      await courseAPI.addReview(courseId, { rating, comment });
      toast.success('Review submitted!');
      reset();
      setRating(0);
      onReviewAdded();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form} noValidate>
      <h4 style={styles.heading}>Leave a Review</h4>

      {/* Star Picker */}
      <div className="form-group">
        <label className="form-label">Your Rating</label>
        <StarRating rating={rating} size={28} interactive onChange={setRating} />
      </div>

      {/* Comment */}
      <div className="form-group">
        <label className="form-label" htmlFor="review-comment">Comment</label>
        <textarea
          id="review-comment"
          className="form-textarea"
          placeholder="Share your thoughts about this course..."
          style={{ minHeight: '100px' }}
          {...register('comment', {
            required: 'Comment is required',
            minLength: { value: 10, message: 'Comment must be at least 10 characters' },
          })}
        />
        {errors.comment && <span className="form-error">{errors.comment.message}</span>}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={submitting}
        style={{ alignSelf: 'flex-start' }}
      >
        <Send size={15} />
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    background: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
  },
  heading: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
};

export default ReviewForm;
