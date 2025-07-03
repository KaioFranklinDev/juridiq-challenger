import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookForm } from '../BookForm';
import { CreateBookRequest } from '@/types/book';

// Mock dos componentes UI
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
}));

describe('BookForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('deve renderizar formulário para adicionar novo livro', () => {
    render(<BookForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Adicionar Novo Livro')).toBeInTheDocument();
    expect(screen.getByLabelText('Título')).toBeInTheDocument();
    expect(screen.getByLabelText('Autor')).toBeInTheDocument();
    expect(screen.getByLabelText('Ano de Publicação')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeInTheDocument();
  });

  it('deve renderizar formulário para editar livro', () => {
    const initialData: CreateBookRequest = {
      title: 'O Senhor dos Anéis',
      author: 'J.R.R. Tolkien',
      publishedYear: 1954,
    };

    render(<BookForm onSubmit={mockOnSubmit} initialData={initialData} />);

    expect(screen.getByText('Editar Livro')).toBeInTheDocument();
    expect(screen.getByDisplayValue('O Senhor dos Anéis')).toBeInTheDocument();
    expect(screen.getByDisplayValue('J.R.R. Tolkien')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1954')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Atualizar' })).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios', async () => {
    render(<BookForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: 'Adicionar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Título é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Autor é obrigatório')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('deve chamar onSubmit com dados válidos', async () => {
    render(<BookForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText('Título');
    const authorInput = screen.getByLabelText('Autor');
    const yearInput = screen.getByLabelText('Ano de Publicação');

    fireEvent.change(titleInput, { target: { value: 'O Senhor dos Anéis' } });
    fireEvent.change(authorInput, { target: { value: 'J.R.R. Tolkien' } });
    fireEvent.change(yearInput, { target: { value: '1954' } });

    const submitButton = screen.getByRole('button', { name: 'Adicionar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'O Senhor dos Anéis',
        author: 'J.R.R. Tolkien',
        publishedYear: 1954,
      });
    });
  });

  it('deve mostrar estado de loading', () => {
    render(<BookForm onSubmit={mockOnSubmit} isLoading={true} />);

    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeDisabled();
  });

  it('deve limpar formulário após sucesso', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);

    render(<BookForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText('Título');
    const authorInput = screen.getByLabelText('Autor');
    const yearInput = screen.getByLabelText('Ano de Publicação');

    fireEvent.change(titleInput, { target: { value: 'O Senhor dos Anéis' } });
    fireEvent.change(authorInput, { target: { value: 'J.R.R. Tolkien' } });
    fireEvent.change(yearInput, { target: { value: '1954' } });

    const submitButton = screen.getByRole('button', { name: 'Adicionar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(authorInput).toHaveValue('');
      const expectedYear = new Date().getFullYear();
      const yearValue = (yearInput as HTMLInputElement).value;
      expect([expectedYear, expectedYear.toString()]).toContain(yearValue);
    });
  });
}); 