import { v4 as uuidv4 } from 'uuid';
import { Book, CreateBookRequest, BookFilters } from '../types/book';
import fs from 'fs';
import path from 'path';

class BookService {
  private books: Book[] = [];

  constructor() {
    this.loadSeedBooks();
  }

  private loadSeedBooks() {
    try {
      const seedPath = path.resolve(__dirname, '../../seed/books-seed.json');
      if (fs.existsSync(seedPath)) {
        const data = fs.readFileSync(seedPath, 'utf-8');
        const seedBooks: Omit<Book, 'id'>[] = JSON.parse(data);
        this.books = seedBooks.map(book => ({ ...book, id: uuidv4() }));
        console.log(`Seed de livros carregada com ${this.books.length} livros.`);
      }
    } catch (err) {
      console.error('Erro ao carregar seed de livros:', err);
    }
  }

  async createBook(bookData: CreateBookRequest): Promise<Book> {
    const newBook: Book = {
      id: uuidv4(),
      ...bookData,
    };

    this.books.push(newBook);
    return newBook;
  }

  async getAllBooks(filters?: BookFilters): Promise<Book[]> {
    let filteredBooks = [...this.books];

    if (filters?.title) {
      const searchTerm = filters.title.toLowerCase();
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm)
      );
    }

    return filteredBooks;
  }

  async getBookById(id: string): Promise<Book | null> {
    return this.books.find(book => book.id === id) || null;
  }

  async deleteBook(id: string): Promise<boolean> {
    const initialLength = this.books.length;
    this.books = this.books.filter(book => book.id !== id);
    return this.books.length < initialLength;
  }

  async updateBook(id: string, bookData: Partial<CreateBookRequest>): Promise<Book | null> {
    const bookIndex = this.books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return null;
    }

    this.books[bookIndex] = {
      ...this.books[bookIndex],
      ...bookData,
    };

    return this.books[bookIndex];
  }
}

export const bookService = new BookService(); 