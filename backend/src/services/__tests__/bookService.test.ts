import { bookService } from '../bookService';
import { CreateBookRequest } from '../../types/book';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

describe('BookService', () => {
  // Função utilitária para resetar os livros com base no seed
  function resetBooksWithSeed() {
    const seedPath = path.resolve(__dirname, '../../../seed/books-seed.json');
    const data = fs.readFileSync(seedPath, 'utf-8');
    const seedBooks: Omit<CreateBookRequest, 'id'>[] = JSON.parse(data);
    (bookService as any).books = seedBooks.map(book => ({ ...book, id: uuidv4() }));
  }

  beforeEach(() => {
    resetBooksWithSeed();
  });

  it('deve criar um novo livro e aumentar o total', async () => {
    const initialBooks = await bookService.getAllBooks();
    const bookData: CreateBookRequest = {
      title: 'Novo Livro Teste',
      author: 'Autor Teste',
      publishedYear: 2024,
    };
    const result = await bookService.createBook(bookData);
    const booksAfter = await bookService.getAllBooks();
    expect(result).toMatchObject(bookData);
    expect(booksAfter.length).toBe(initialBooks.length + 1);
    expect(booksAfter.find(b => b.id === result.id)).toBeDefined();
  });

  it('deve deletar um livro existente', async () => {
    const books = await bookService.getAllBooks();
    const bookToDelete = books[0];
    const deleted = await bookService.deleteBook(bookToDelete.id);
    expect(deleted).toBe(true);
    const booksAfter = await bookService.getAllBooks();
    expect(booksAfter.find(b => b.id === bookToDelete.id)).toBeUndefined();
  });

  it('deve atualizar um livro existente', async () => {
    const books = await bookService.getAllBooks();
    const bookToUpdate = books[0];
    const updatedBook = await bookService.updateBook(bookToUpdate.id, {
      title: 'Título Editado',
      publishedYear: 2020,
    });
    expect(updatedBook).not.toBeNull();
    expect(updatedBook!.title).toBe('Título Editado');
    expect(updatedBook!.publishedYear).toBe(2020);
    expect(updatedBook!.author).toBe(bookToUpdate.author);
  });

  it('deve criar múltiplos livros com IDs diferentes', async () => {
    const book1 = await bookService.createBook({
      title: 'Livro 1',
      author: 'Autor 1',
      publishedYear: 2020,
    });
    const book2 = await bookService.createBook({
      title: 'Livro 2',
      author: 'Autor 2',
      publishedYear: 2021,
    });
    expect(book1.id).not.toBe(book2.id);
  });

  it('deve retornar todos os livros do seed', async () => {
    const seedPath = path.resolve(__dirname, '../../../seed/books-seed.json');
    const data = fs.readFileSync(seedPath, 'utf-8');
    const seedBooks: Omit<CreateBookRequest, 'id'>[] = JSON.parse(data);
    const books = await bookService.getAllBooks();
    expect(books.length).toBe(seedBooks.length);
    // Confere se todos os títulos do seed estão presentes
    for (const seedBook of seedBooks) {
      expect(books.some(b => b.title === seedBook.title && b.author === seedBook.author)).toBe(true);
    }
  });

  it('deve filtrar livros do seed por título', async () => {
    const books = await bookService.getAllBooks({ title: 'Senhor' });
    expect(books.length).toBeGreaterThan(0);
    expect(books.some(b => b.title.includes('Senhor'))).toBe(true);
  });

  it('deve retornar lista vazia quando filtro não encontra resultados', async () => {
    const filteredBooks = await bookService.getAllBooks({ title: 'Inexistente' });
    expect(filteredBooks).toEqual([]);
  });

  it('deve retornar livro do seed quando ID existe', async () => {
    const books = await bookService.getAllBooks();
    const book = books[0];
    const foundBook = await bookService.getBookById(book.id);
    expect(foundBook).toEqual(book);
  });

  it('deve retornar null quando ID não existe', async () => {
    const foundBook = await bookService.getBookById('id-inexistente');
    expect(foundBook).toBeNull();
  });

  it('deve retornar false ao deletar ID inexistente', async () => {
    const deleted = await bookService.deleteBook('id-inexistente');
    expect(deleted).toBe(false);
  });

  it('deve retornar null ao atualizar ID inexistente', async () => {
    const updatedBook = await bookService.updateBook('id-inexistente', {
      title: 'Novo Título',
    });
    expect(updatedBook).toBeNull();
  });
}); 