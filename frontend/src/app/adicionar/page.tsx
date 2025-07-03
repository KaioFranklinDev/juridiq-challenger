'use client';

import React, { useState } from 'react';
import { BookForm } from '@/components/BookForm';
import { CreateBookRequest } from '@/types/book';
import { apiService } from '@/services/api';
import { CheckCircle2 } from 'lucide-react';

export default function AdicionarLivro() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (bookData: CreateBookRequest) => {
    setIsSubmitting(true);
    try {
      await apiService.createBook(bookData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert('Erro ao adicionar livro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-8 justify-center items-center">
      <div className="mb-6 text-center w-full">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#2563eb] mb-2">Adicionar Livro</h1>
        <p className="text-lg text-gray-600">Cadastre um novo livro na sua biblioteca.</p>
      </div>
      <BookForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      {success && (
        <div className="flex items-center gap-2 text-green-600 font-semibold mt-2">
          <CheckCircle2 className="h-5 w-5" /> Livro adicionado com sucesso!
        </div>
      )}
    </div>
  );
} 