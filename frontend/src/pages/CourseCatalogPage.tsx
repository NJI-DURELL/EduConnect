import { useState, useEffect } from 'react';
import { courseAPI } from '../api/axiosInstance';
import { Course, CourseFilters } from '../types';
import CourseCard from '../components/CourseCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const CourseCatalogPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<CourseFilters>({
    search: '', category: '', minPrice: '', maxPrice: '',
  });

  const fetchCourses = async (currentPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string | number> = { page: currentPage, limit: 12 };
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const { data } = await courseAPI.getAll(params);
      setCourses(data.courses);
      setTotalPages(data.pages);
      setTotal(data.total);
      setPage(currentPage);
    } catch {
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchCourses(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => fetchCourses(1);

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <h1 className="page-title">Course Catalog</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.4rem' }}>
            {total > 0 ? `${total} courses available` : 'Explore our courses'}
          </p>
        </div>

        {/* Search & Filter */}
        <div style={{ marginBottom: '2.5rem' }}>
          <SearchBar filters={filters} onFilterChange={setFilters} onSearch={handleSearch} />
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <LoadingSpinner size="lg" text="Loading courses..." />
          </div>
        ) : error ? (
          <ErrorAlert message={error} />
        ) : courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description="Try adjusting your search or filters to find what you're looking for."
            action={
              <button className="btn btn-secondary" onClick={() => { setFilters({ search: '', category: '', minPrice: '', maxPrice: '' }); fetchCourses(1); }}>
                Clear Filters
              </button>
            }
          />
        ) : (
          <>
            <div className="courses-grid animate-fade-in">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => fetchCourses(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <span style={styles.pageInfo}>
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => fetchCourses(page + 1)}
                  disabled={page === totalPages}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '3rem',
  },
  pageInfo: { color: 'var(--color-text-secondary)', fontSize: '0.875rem' },
};

export default CourseCatalogPage;
