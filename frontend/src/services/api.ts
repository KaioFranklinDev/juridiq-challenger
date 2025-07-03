import { Book, CreateBookRequest, BookFilters } from '@/types/book';

const API_BASE_URL = 'https://juridiq-challenger.onrender.com:3002/api';

export class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API Request:', { url, method: options?.method || 'GET', body: options?.body });
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    console.log('API Response:', { status: response.status, ok: response.ok, url: response.url });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      console.log('API: 204 No Content - returning void');
      // @ts-expect-error: Forçar undefined apenas quando T permite
      return undefined;
    }

    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
  }

  async createBook(bookData: CreateBookRequest): Promise<Book> {
    return this.request<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async getAllBooks(filters?: BookFilters): Promise<Book[]> {
    const params = new URLSearchParams();
    if (filters?.title) {
      params.append('title', filters.title);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/books?${queryString}` : '/books';
    
    return this.request<Book[]>(endpoint);
  }

  async getBookById(id: string): Promise<Book> {
    return this.request<Book>(`/books/${id}`);
  }

  async deleteBook(id: string): Promise<void> {
    console.log('Deleting book with ID:', id);
    await this.request(`/books/${id}`, {
      method: 'DELETE',
    });
    console.log('Book deleted successfully');
  }

  async updateBook(id: string, bookData: Partial<CreateBookRequest>): Promise<Book> {
    return this.request<Book>(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  }
}

export const apiService = new ApiService(); 