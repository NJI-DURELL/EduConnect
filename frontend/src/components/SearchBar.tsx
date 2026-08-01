import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CourseCategory, CourseFilters } from '../types';

interface SearchBarProps {
  filters: CourseFilters;
  onFilterChange: (filters: CourseFilters) => void;
  onSearch: () => void;
}

const CATEGORIES: CourseCategory[] = [
  'Programming', 'Design', 'Marketing', 'Business', 'Data Science', 'Other',
];

const SearchBar = ({ filters, onFilterChange, onSearch }: SearchBarProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (field: keyof CourseFilters, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleReset = () => {
    onFilterChange({ search: '', category: '', minPrice: '', maxPrice: '' });
    onSearch();
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div style={styles.wrapper}>
      {/* Search Input Row */}
      <div style={styles.searchRow}>
        <div style={styles.inputWrapper}>
          <Search size={18} color="var(--color-text-muted)" style={styles.searchIcon} />
          <input
            id="course-search"
            type="text"
            className="form-input"
            placeholder="Search for any course..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            style={styles.searchInput}
          />
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => setShowFilters(!showFilters)}
          style={{ position: 'relative' }}
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasActiveFilters && <span style={styles.filterDot} />}
        </button>
        <button className="btn btn-primary" onClick={onSearch}>
          Search
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div style={styles.filterPanel} className="animate-fade-in">
          <div style={styles.filterGrid}>
            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                id="filter-category"
                className="form-select"
                value={filters.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div className="form-group">
              <label className="form-label">Min Price (XAF)</label>
              <input
                id="filter-min-price"
                type="number"
                className="form-input"
                placeholder="0"
                min={0}
                value={filters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
              />
            </div>

            {/* Max Price */}
            <div className="form-group">
              <label className="form-label">Max Price (XAF)</label>
              <input
                id="filter-max-price"
                type="number"
                className="form-input"
                placeholder="999"
                min={0}
                value={filters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button onClick={handleReset} style={styles.clearBtn}>
              <X size={14} /> Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  searchRow: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  inputWrapper: { position: 'relative', flex: 1 },
  searchIcon: { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  searchInput: { paddingLeft: '2.75rem', width: '100%' },
  filterPanel: {
    background: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '1.25rem',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
  },
  filterDot: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#6366f1',
  },
  clearBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginTop: '1rem',
    background: 'none',
    border: 'none',
    color: 'var(--color-error)',
    fontSize: '0.82rem',
    cursor: 'pointer',
    padding: 0,
  },
};

export default SearchBar;
