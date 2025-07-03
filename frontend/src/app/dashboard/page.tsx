'use client';

import React, { useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { Book } from '@/types/book';
import { BarChart2, Users, BookOpen } from 'lucide-react';

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getAllBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  // Análise: total de livros
  const totalLivros = books.length;

  // Análise: top autores
  const autoresCount: Record<string, number> = {};
  books.forEach((book) => {
    autoresCount[book.author] = (autoresCount[book.author] || 0) + 1;
  });
  const topAutores = Object.entries(autoresCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 justify-center items-start">
      <div className="mb-10 text-center w-full">
        <div className="flex items-center justify-center gap-3 mb-2">
          <BarChart2 className="h-10 w-10 text-[#2563eb]" />
          <h1 className="text-4xl font-extrabold tracking-tight text-[#2563eb] drop-shadow-sm">Dashboard</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Veja estatísticas da sua biblioteca: total de livros cadastrados e autores em destaque.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="card-shadow p-6 flex flex-col items-center justify-center text-center">
          <BookOpen className="h-8 w-8 text-[#2563eb] mb-2" />
          <span className="text-2xl font-bold">{totalLivros}</span>
          <span className="text-gray-600">Total de Livros</span>
        </div>
        <div className="card-shadow p-6 flex flex-col items-center justify-center text-center">
          <Users className="h-8 w-8 text-[#2563eb] mb-2" />
          <span className="text-2xl font-bold">{topAutores.length > 0 ? topAutores[0][0] : '-'}</span>
          <span className="text-gray-600">Autor com mais livros</span>
        </div>
        <div className="card-shadow p-6 flex flex-col items-center w-full">
          <BarChart2 className="h-8 w-8 text-[#2563eb] mb-2" />
          <div className="flex flex-col items-start w-full max-w-xs">
            {topAutores.length === 0 ? (
              <span className="text-gray-400">-</span>
            ) : (
              topAutores.map(([autor, count]) => (
                <span key={autor} className="text-base font-semibold text-gray-700 break-words w-full mb-1">
                  {autor} <span className="text-[#2563eb] font-bold">({count})</span>
                </span>
              ))
            )}
          </div>
          <span className="text-gray-600 mt-2">Top 3 Autores</span>
        </div>
      </div>
      {/* Gráfico simples de barras (texto) */}
      <div className="card-shadow p-8 w-full mt-8">
        <h2 className="text-xl font-bold mb-4 text-[#2563eb]">Livros por Autor</h2>
        {Object.keys(autoresCount).length === 0 ? (
          <p className="text-gray-400">Nenhum livro cadastrado ainda.</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(autoresCount).map(([autor, count]) => (
              <div key={autor} className="flex items-center gap-4">
                <span className="w-32 font-semibold text-gray-700">{autor}</span>
                <div className="flex-1 bg-[#e3eefd] rounded h-4 relative">
                  <div
                    className="bg-[#2563eb] h-4 rounded"
                    style={{ width: `${(count / totalLivros) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 