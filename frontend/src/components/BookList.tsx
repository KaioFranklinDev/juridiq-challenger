'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from '@/types/book';
import { apiService } from '@/services/api';
import { Trash2, Edit, Search } from 'lucide-react';

interface BookListProps {
  onEditBook?: (book: Book) => void;
  onBookDeleted?: () => void;
}

export function BookList({ onEditBook, onBookDeleted }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [searchTerm, books]);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const booksData = await apiService.getAllBooks();
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (err) {
      setError('Erro ao carregar livros');
      console.error('Erro ao carregar livros:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    console.log('handleDeleteBook called with ID:', id);
    
    if (!confirm('Tem certeza que deseja excluir este livro?')) {
      console.log('Delete cancelled by user');
      return;
    }

    try {
      console.log('Calling apiService.deleteBook with ID:', id);
      await apiService.deleteBook(id);
      console.log('Book deleted successfully, updating local state');
      setBooks(prev => prev.filter(book => book.id !== id));
      onBookDeleted?.();
    } catch (err) {
      console.error('Error in handleDeleteBook:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao deletar livro';
      alert(`Erro ao deletar livro: ${errorMessage}`);
    }
  };

  const handleEditBook = (book: Book) => {
    onEditBook?.(book);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-[#2563eb] font-semibold animate-pulse">Carregando livros...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Barra de busca */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#2563eb] h-5 w-5" />
        <Input
          type="text"
          placeholder="Buscar por título ou autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-primary pl-12 text-base"
        />
      </div>

      {/* Lista de livros */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg font-medium">
            {searchTerm ? 'Nenhum livro encontrado para sua busca.' : 'Nenhum livro cadastrado ainda.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="card-shadow p-6 flex flex-col justify-between h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#2563eb] line-clamp-2 mb-2">{book.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-base text-gray-700">
                    <strong>Autor:</strong> {book.author}
                  </p>
                  <p className="text-base text-gray-700">
                    <strong>Ano:</strong> {book.publishedYear}
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBook(book)}
                    className="btn-outline flex-1 flex items-center justify-center gap-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteBook(book.id)}
                    className="btn-primary flex-1 flex items-center justify-center gap-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Estatísticas */}
      {books.length > 0 && (
        <div className="text-center text-sm text-gray-400 mt-4">
          {searchTerm ? (
            <p>
              Mostrando {filteredBooks.length} de {books.length} livros
            </p>
          ) : (
            <p>Total de {books.length} livro{books.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      )}
    </div>
  );
} 