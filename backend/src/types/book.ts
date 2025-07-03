export interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  publishedYear: number;
}

export interface BookFilters {
  title?: string;
} 