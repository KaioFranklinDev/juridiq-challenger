import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BookList } from '../BookList';
import { Book } from '@/types/book';

// Mock dos componentes UI
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
}));

// Mock do apiService
jest.mock('@/services/api', () => ({
  apiService: {
    getAllBooks: jest.fn(),
    deleteBook: jest.fn(),
  },
}));

const mockBooks: Book[] = [
  { id: '1', title: 'Livro 1', author: 'Autor 1', publishedYear: 2000 },
  { id: '2', title: 'Livro 2', author: 'Autor 2', publishedYear: 2010 },
];

describe('BookList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir estado de carregamento', async () => {
    const { apiService } = require('@/services/api');
    apiService.getAllBooks.mockReturnValue(new Promise(() => {}));
    render(<BookList />);
    expect(screen.getByText('Carregando livros...')).toBeInTheDocument();
  });

  it('deve exibir erro ao carregar livros', async () => {
    const { apiService } = require('@/services/api');
    apiService.getAllBooks.mockRejectedValueOnce(new Error('Erro ao carregar'));
    render(<BookList />);
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar livros')).toBeInTheDocument();
    });
  });

  it('deve renderizar lista de livros', async () => {
    const { apiService } = require('@/services/api');
    apiService.getAllBooks.mockResolvedValueOnce(mockBooks);
    render(<BookList />);
    await waitFor(() => {
      expect(screen.getByText('Livro 1')).toBeInTheDocument();
      expect(screen.getByText('Livro 2')).toBeInTheDocument();
    });
  });

  it('deve filtrar livros pela busca', async () => {
    const { apiService } = require('@/services/api');
    apiService.getAllBooks.mockResolvedValueOnce(mockBooks);
    render(<BookList />);
    await waitFor(() => {
      expect(screen.getByText('Livro 1')).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText('Buscar por título ou autor...');
    fireEvent.change(input, { target: { value: '2' } });
    expect(screen.queryByText('Livro 1')).not.toBeInTheDocument();
    expect(screen.getByText('Livro 2')).toBeInTheDocument();
  });

  it('deve chamar onEditBook ao clicar em Editar', async () => {
    const { apiService } = require('@/services/api');
    apiService.getAllBooks.mockResolvedValueOnce(mockBooks);
    const onEditBook = jest.fn();
    render(<BookList onEditBook={onEditBook} />);
    await waitFor(() => {
      expect(screen.getByText('Livro 1')).toBeInTheDocument();
    });
    const editButtons = screen.getAllByText('Editar');
    fireEvent.click(editButtons[0]);
    expect(onEditBook).toHaveBeenCalledWith(mockBooks[0]);
  });

  it('deve chamar deleteBook e onBookDeleted ao clicar em Excluir e confirmar', async () => {
    window.confirm = jest.fn(() => true);
    const { apiService } = require('@/services/api');
    apiService.getAllBooks.mockResolvedValueOnce(mockBooks);
    apiService.deleteBook.mockResolvedValueOnce(undefined);
    const onBookDeleted = jest.fn();
    render(<BookList onBookDeleted={onBookDeleted} />);
    await waitFor(() => {
      expect(screen.getByText('Livro 1')).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByText('Excluir');
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(apiService.deleteBook).toHaveBeenCalledWith('1');
      expect(onBookDeleted).toHaveBeenCalled();
    });
  });

  it('deve não excluir se usuário cancelar confirmação', async () => {
    window.confirm = jest.fn(() => false);
    const { apiService } = require('@/services/api');
    apiService.getAllBooks.mockResolvedValueOnce(mockBooks);
    render(<BookList />);
    await waitFor(() => {
      expect(screen.getByText('Livro 1')).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByText('Excluir');
    fireEvent.click(deleteButtons[0]);
    expect(apiService.deleteBook).not.toHaveBeenCalled();
  });
}); 