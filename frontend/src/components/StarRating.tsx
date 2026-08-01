import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const StarRating = ({ rating, max = 5, size = 16, interactive = false, onChange }: StarRatingProps) => {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <Star
            key={i}
            size={size}
            fill={filled ? '#D97706' : 'transparent'}
            color={filled ? '#D97706' : '#E2E8F0'}
            style={interactive ? { cursor: 'pointer', transition: 'transform 0.15s' } : {}}
            onClick={() => interactive && onChange && onChange(i + 1)}
            onMouseEnter={(e) => {
              if (interactive) (e.currentTarget as SVGElement).style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              if (interactive) (e.currentTarget as SVGElement).style.transform = 'scale(1)';
            }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
