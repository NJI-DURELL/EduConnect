// ── User ─────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  username: string;
  email: string;
  bio: string;
  profilePicture: string;
  role: 'student' | 'instructor';
  createdAt: string;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: 'student' | 'instructor';
}

// ── Course ────────────────────────────────────────────────────────────────────
export interface Module {
  _id?: string;
  title: string;
  content: string;
  order: number;
}

export type CourseCategory =
  | 'Programming'
  | 'Design'
  | 'Marketing'
  | 'Business'
  | 'Data Science'
  | 'Other';

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: CourseCategory;
  thumbnail: string;
  instructor: User;
  modules: Module[];
  averageRating: number;
  totalReviews: number;
  enrollmentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFormData {
  title: string;
  description: string;
  price: number;
  category: CourseCategory;
  thumbnail?: string;
  modules: Module[];
}

// ── Review ────────────────────────────────────────────────────────────────────
export interface Review {
  _id: string;
  student: User;
  course: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ── API Responses ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedCoursesResponse {
  courses: Course[];
  total: number;
  page: number;
  pages: number;
}

// ── Filters ───────────────────────────────────────────────────────────────────
export interface CourseFilters {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}
