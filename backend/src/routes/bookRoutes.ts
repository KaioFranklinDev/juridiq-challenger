import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { bookService } from '../services/bookService';
import { CreateBookRequest, BookFilters } from '../types/book';

export async function bookRoutes(fastify: FastifyInstance) {
  // POST /books - Criar novo livro
  fastify.post<{ Body: CreateBookRequest }>('/books', async (request, reply) => {
    try {
      const { title, author, publishedYear } = request.body;

      // Validações básicas
      if (!title || !author || !publishedYear) {
        return reply.status(400).send({
          error: 'Todos os campos são obrigatórios: title, author, publishedYear'
        });
      }

      if (typeof publishedYear !== 'number' || publishedYear < 1000 || publishedYear > new Date().getFullYear()) {
        return reply.status(400).send({
          error: 'Ano de publicação deve ser um número válido'
        });
      }

      const newBook = await bookService.createBook({ title, author, publishedYear });
      
      return reply.status(201).send(newBook);
    } catch (error) {
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      });
    }
  });

  // GET /books - Listar todos os livros (com filtro opcional)
  fastify.get<{ Querystring: BookFilters }>('/books', async (request, reply) => {
    try {
      const { title } = request.query;
      const filters: BookFilters = title ? { title } : {};
      
      const books = await bookService.getAllBooks(filters);
      
      return reply.status(200).send(books);
    } catch (error) {
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      });
    }
  });

  // GET /books/:id - Buscar livro por ID
  fastify.get<{ Params: { id: string } }>('/books/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const book = await bookService.getBookById(id);
      
      if (!book) {
        return reply.status(404).send({
          error: 'Livro não encontrado'
        });
      }
      
      return reply.status(200).send(book);
    } catch (error) {
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      });
    }
  });

  // PUT /books/:id - Atualizar livro
  fastify.put<{ 
    Params: { id: string }; 
    Body: Partial<CreateBookRequest> 
  }>('/books/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const updateData = request.body;

      // Validações básicas
      if (updateData.publishedYear && (typeof updateData.publishedYear !== 'number' || updateData.publishedYear < 1000 || updateData.publishedYear > new Date().getFullYear())) {
        return reply.status(400).send({
          error: 'Ano de publicação deve ser um número válido'
        });
      }

      const updatedBook = await bookService.updateBook(id, updateData);
      
      if (!updatedBook) {
        return reply.status(404).send({
          error: 'Livro não encontrado'
        });
      }
      
      return reply.status(200).send(updatedBook);
    } catch (error) {
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      });
    }
  });

  // DELETE /books/:id - Deletar livro
  fastify.delete<{ Params: { id: string } }>('/books/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const deleted = await bookService.deleteBook(id);
      
      if (!deleted) {
        return reply.status(404).send({
          error: 'Livro não encontrado'
        });
      }
      
      return reply.status(204).send();
    } catch (error) {
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      });
    }
  });
} 