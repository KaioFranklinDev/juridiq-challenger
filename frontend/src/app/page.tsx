'use client';

import React from 'react';
import { BookList } from '@/components/BookList';
import { BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 justify-center items-start">
      <div className="mb-10 text-center w-full">
        <div className="flex items-center justify-center gap-3 mb-2">
          <BookOpen className="h-10 w-10 text-[#2563eb]" />
          <h1 className="text-4xl font-extrabold tracking-tight text-[#2563eb] drop-shadow-sm">Buscar Livros</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Encontre livros cadastrados pelo título ou autor. Clique em editar para alterar ou excluir para remover um livro.
        </p>
      </div>
      <div className="card-shadow p-8 w-full">
        <BookList />
      </div>
    </div>
  );
} 