export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  note_count: number;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  category: number | null;
  category_detail: Category | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}
