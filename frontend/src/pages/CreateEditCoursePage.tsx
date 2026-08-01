import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { courseAPI } from '../api/axiosInstance';
import { CourseFormData, CourseCategory } from '../types';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { PlusCircle, Trash2, ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES: CourseCategory[] = [
  'Programming', 'Design', 'Marketing', 'Business', 'Data Science', 'Other',
];

const CreateEditCoursePage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CourseFormData>({
    defaultValues: { modules: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'modules' });

  // Prefill form when editing
  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;

    const fetch = async () => {
      setFetching(true);
      try {
        const { data } = await courseAPI.getById(id);
        if (!cancelled) {
          reset({
            title: data.course.title,
            description: data.course.description,
            price: data.course.price,
            category: data.course.category,
            thumbnail: data.course.thumbnail,
            modules: data.course.modules || [],
          });
        }
      } catch {
        if (!cancelled) setError('Could not load course data.');
      } finally {
        if (!cancelled) setFetching(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [id, isEdit, reset]);

  const onSubmit = async (formData: CourseFormData) => {
    setError('');
    setLoading(true);
    try {
      if (isEdit && id) {
        await courseAPI.update(id, formData);
        toast.success('Course updated!');
      } else {
        await courseAPI.create(formData);
        toast.success('Course created!');
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save course.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <LoadingSpinner size="lg" text="Loading course..." />
    </div>
  );

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '760px' }}>
        <Link to="/dashboard" style={styles.back}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>
          {isEdit ? 'Edit Course' : 'Create New Course'}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          {isEdit ? 'Update your course information below.' : 'Fill in the details to publish your course.'}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form} noValidate>
          {error && <ErrorAlert message={error} />}

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="course-title">Course Title *</label>
            <input
              id="course-title"
              className="form-input"
              placeholder="e.g. ND Complete React Course"
              {...register('title', {
                required: 'Title is required',
                maxLength: { value: 150, message: 'Title cannot exceed 150 characters' },
              })}
            />
            {errors.title && <span className="form-error">{errors.title.message}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="course-desc">Description *</label>
            <textarea
              id="course-desc"
              className="form-textarea"
              placeholder="What will students learn in this course?"
              style={{ minHeight: '140px' }}
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <span className="form-error">{errors.description.message}</span>}
          </div>

          {/* Category + Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="course-category">Category *</label>
              <select
                id="course-category"
                className="form-select"
                {...register('category', { required: 'Category is required' })}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="form-error">{errors.category.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="course-price">Price (XAF) *</label>
              <input
                id="course-price"
                type="number"
                className="form-input"
                placeholder="0 for free"
                min={0}
                step={0.01}
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price cannot be negative' },
                  valueAsNumber: true,
                })}
              />
              {errors.price && <span className="form-error">{errors.price.message}</span>}
            </div>
          </div>

          {/* Thumbnail */}
          <div className="form-group">
            <label className="form-label" htmlFor="course-thumbnail">Thumbnail URL (optional)</label>
            <input
              id="course-thumbnail"
              type="url"
              className="form-input"
              placeholder="https://example.com/thumbnail.jpg"
              {...register('thumbnail')}
            />
          </div>

          <div className="divider" />

          {/* Modules */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Modules ({fields.length})</h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => append({ title: '', content: '', order: fields.length })}
              >
                <PlusCircle size={14} /> Add Module
              </button>
            </div>

            {fields.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                No modules yet. Click "Add Module" to build your course curriculum.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {fields.map((field, idx) => (
                  <div key={field.id} style={styles.moduleCard}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-primary-light)' }}>
                        Module {idx + 1}
                      </span>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(idx)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="form-group">
                      <input
                        className="form-input"
                        placeholder="Module title"
                        {...register(`modules.${idx}.title`, { required: 'Module title required' })}
                      />
                      {errors.modules?.[idx]?.title && (
                        <span className="form-error">{errors.modules[idx]?.title?.message}</span>
                      )}
                    </div>
                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                      <textarea
                        className="form-textarea"
                        placeholder="Module content / description (optional)"
                        style={{ minHeight: '70px' }}
                        {...register(`modules.${idx}.content`)}
                      />
                    </div>
                    <input type="hidden" {...register(`modules.${idx}.order`)} value={idx} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="divider" />

          {/* Submit */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Link to="/dashboard" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={15} />
              {loading ? 'Saving...' : isEdit ? 'Update Course' : 'Publish Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  back: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', textDecoration: 'none' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  moduleCard: { background: 'var(--color-glass)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid var(--color-glass-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' },
};

export default CreateEditCoursePage;
