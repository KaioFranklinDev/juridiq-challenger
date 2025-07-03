'use client';

import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateBookRequest } from '@/types/book';

interface BookFormProps {
  onSubmit: (bookData: CreateBookRequest) => Promise<void>;
  initialData?: CreateBookRequest;
  isLoading?: boolean;
}

export function BookForm({
  onSubmit,
  initialData,
  isLoading = false,
}: BookFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [author, setAuthor] = useState(initialData?.author ?? '');
  const [publishedYear, setPublishedYear] = useState(
    String(initialData?.publishedYear ?? new Date().getFullYear())
  );
  const [errors, setErrors] = useState<{
    title?: string;
    author?: string;
    publishedYear?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (!author.trim()) {
      newErrors.author = 'Autor é obrigatório';
    }

    const yearNum = parseInt(publishedYear, 10);
    const currentYear = new Date().getFullYear();
    if (
      publishedYear.trim() === '' ||
      isNaN(yearNum) ||
      yearNum < 1000 ||
      yearNum > currentYear
    ) {
      newErrors.publishedYear = 'Ano de publicação deve ser válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const yearNum = parseInt(publishedYear, 10);
    await onSubmit({ title, author, publishedYear: yearNum });

    if (!initialData) {
      setTitle('');
      setAuthor('');
      setPublishedYear(String(new Date().getFullYear()));
      setErrors({});
    }
  };

  return (
    <Card className="w-full card-shadow p-6">
      <CardHeader>
        <CardTitle className="text-2xl text-[#2563eb] font-bold mb-2">
          {initialData ? 'Editar Livro' : 'Adicionar Novo Livro'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-semibold">Título</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do livro"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p role="alert" className="text-sm text-red-500 font-medium">
                {errors.title}
              </p>
            )}
          </div>

          {/* Autor */}
          <div className="space-y-2">
            <Label htmlFor="author" className="font-semibold">Autor</Label>
            <Input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Digite o nome do autor"
              className={errors.author ? 'border-red-500' : ''}
            />
            {errors.author && (
              <p role="alert" className="text-sm text-red-500 font-medium">
                {errors.author}
              </p>
            )}
          </div>

          {/* Ano de Publicação */}
          <div className="space-y-2">
            <Label htmlFor="publishedYear" className="font-semibold">Ano de Publicação</Label>
            <Input
              id="publishedYear"
              type="number"
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value)}
              placeholder="Digite o ano de publicação"
              min={1000}
              max={new Date().getFullYear()}
              className={errors.publishedYear ? 'border-red-500' : ''}
            />
            {errors.publishedYear && (
              <p role="alert" className="text-sm text-red-500 font-medium">
                {errors.publishedYear}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="btn-primary w-full text-lg"
            disabled={isLoading}
          >
            {isLoading
              ? 'Salvando...'
              : initialData
              ? 'Atualizar'
              : 'Adicionar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
