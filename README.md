# 🏆 Juridiq Full Stack Challenge

Sistema completo de gerenciamento de livros desenvolvido para o desafio Full Stack da Juridiq, utilizando Next.js, Fastify e TypeScript.

## 🚀 Tecnologias Utilizadas

### Backend
- **Fastify** - Framework web rápido e eficiente
- **TypeScript** - Linguagem principal com tipagem estática
- **Jest** - Framework de testes unitários
- **UUID** - Geração de identificadores únicos

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Linguagem principal
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn UI** - Componentes UI modernos e acessíveis
- **Lucide React** - Ícones SVG
- **Jest + Testing Library** - Testes unitários

## 📁 Estrutura do Projeto

```
juridiq/
├── backend/                 # API Fastify
│   ├── src/
│   │   ├── types/          # Tipos TypeScript
│   │   ├── services/       # Lógica de negócio
│   │   ├── routes/         # Rotas da API
│   │   └── server.ts       # Servidor principal
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── frontend/               # Aplicação Next.js
│   ├── src/
│   │   ├── app/           # Páginas Next.js 14
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Serviços de API
│   │   ├── types/         # Tipos TypeScript
│   │   └── lib/           # Utilitários
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
└── package.json           # Scripts principais
```

## 📦 Scripts do package.json (raiz)

| Script                | Descrição                                                                 |
|-----------------------|---------------------------------------------------------------------------|
| `npm run install:all` | Instala todas as dependências do projeto (raiz, backend, frontend)         |
| `npm run dev:all`     | Inicia backend e frontend em modo desenvolvimento (paralelo)               |
| `npm run dev:backend` | Inicia apenas o backend em modo desenvolvimento                            |
| `npm run dev:frontend`| Inicia apenas o frontend em modo desenvolvimento                           |
| `npm run build:all`   | Faz build de produção do backend e frontend                                |
| `npm run build:backend`| Build apenas do backend                                                    |
| `npm run build:frontend`| Build apenas do frontend                                                  |
| `npm run start:all`   | Inicia backend e frontend em modo produção (paralelo)                      |
| `npm run start:backend`| Inicia backend em modo produção                                           |
| `npm run start:frontend`| Inicia frontend em modo produção                                         |
| `npm run test:all`    | Executa todos os testes (backend e frontend)                               |
| `npm run test:backend`| Executa apenas os testes do backend                                        |
| `npm run test:frontend`| Executa apenas os testes do frontend                                      |

---

## 🛠️ Funções do Backend (Fastify)

- **createBook(bookData):** Cria um novo livro.
- **getAllBooks(filters?):** Lista todos os livros, com filtro opcional por título.
- **getBookById(id):** Busca um livro pelo ID.
- **deleteBook(id):** Remove um livro pelo ID.
- **updateBook(id, bookData):** Atualiza dados de um livro existente.
- **loadSeedBooks():** Carrega livros iniciais do seed JSON ao iniciar o servidor.

---

## 🛠️ Funções do Frontend (Next.js + Shadcn UI)

### Componentes principais:
- **BookForm:** Formulário para adicionar/editar livros, com validação, loading e reset.
- **BookList:** Lista de livros, busca em tempo real, botões de editar/excluir, loading e erro.
- **UI Components:** Button, Input, Label, Card (estilizados com Shadcn UI).

### Páginas:
- **/** (Buscar Livros): Listagem e busca de livros, editar/excluir.
- **/adicionar:** Página dedicada para adicionar novo livro.
- **/dashboard:** Dashboard com estatísticas (total de livros, top autores, gráfico de livros por autor).

---

## 🧪 Testes Automatizados

### Backend (`backend/src/services/__tests__/bookService.test.ts`)
- Criação de livro
- Deleção de livro
- Atualização de livro
- Listagem de todos os livros (com seed)
- Filtro por título
- Busca por ID
- Casos de erro (ID inexistente)
- IDs únicos para cada livro

### Frontend

#### BookForm (`frontend/src/components/__tests__/BookForm.test.tsx`)
- Renderização do formulário (adicionar e editar)
- Validação de campos obrigatórios
- Submissão de dados válidos
- Estado de loading
- Reset do formulário após sucesso

#### BookList (`frontend/src/components/__tests__/BookList.test.tsx`)
- Estado de carregamento
- Exibição de erro
- Renderização da lista de livros
- Busca e filtro em tempo real
- Edição de livro (callback)
- Exclusão de livro (com confirmação)
- Cancelamento de exclusão

---

## 🚀 Executando o Projeto

### Desenvolvimento (Backend + Frontend)
```bash
npm run dev
```

### Apenas Backend
```bash
npm run dev:backend
```

### Apenas Frontend
```bash
npm run dev:frontend
```

### Build de Produção
```bash
npm run build
```

## 🧪 Executando Testes

### Todos os Testes
```bash
npm test
```

### Testes do Backend
```bash
npm run test:backend
```

### Testes do Frontend
```bash
npm run test:frontend
```

### Cobertura de Testes
```bash
npm run test:coverage
```

## 📚 API Endpoints

### Base URL: `http://localhost:3001/api`

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| `POST` | `/books` | Criar novo livro | `{ title, author, publishedYear }` |
| `GET` | `/books` | Listar todos os livros | - |
| `GET` | `/books?title=search` | Buscar livros por título | - |
| `GET` | `/books/:id` | Buscar livro por ID | - |
| `DELETE` | `/books/:id` | Deletar livro | - |

### Exemplo de Uso

```bash
# Criar livro
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"O Senhor dos Anéis","author":"J.R.R. Tolkien","publishedYear":1954}'

# Listar livros
curl http://localhost:3001/api/books

# Buscar por título
curl http://localhost:3001/api/books?title=Senhor
```

## 🎨 Funcionalidades do Frontend

### ✅ Implementadas
- ✅ Cadastro de novos livros
- ✅ Listagem de livros cadastrados
- ✅ Busca por título e autor
- ✅ Edição de livros existentes
- ✅ Exclusão de livros
- ✅ Interface responsiva e moderna
- ✅ Validação de formulários
- ✅ Estados de loading e erro
- ✅ Design system com Shadcn UI

### 🎯 Funcionalidades Bônus
- 🎯 Filtro de busca em tempo real
- 🎯 Interface moderna com gradientes
- 🎯 Componentes reutilizáveis
- 🎯 Testes unitários completos
- 🎯 Validação de dados
- 🎯 Tratamento de erros
- 🎯 UX otimizada

## 🧪 Cobertura de Testes

### Backend
- ✅ BookService - 100% de cobertura
- ✅ Validação de dados
- ✅ Operações CRUD
- ✅ Filtros de busca

### Frontend
- ✅ BookForm - Validação e submissão
- ✅ Componentes UI
- ✅ Integração com API

## 🏗️ Decisões de Arquitetura

### Backend
1. **Fastify**: Escolhido por sua performance e simplicidade
2. **Arquitetura em Camadas**: Separação clara entre rotas, serviços e tipos
3. **Validação**: Validação manual nos endpoints para maior controle
4. **Armazenamento**: Array em memória para simplicidade (pode ser facilmente substituído por banco de dados)

### Frontend
1. **Next.js 14**: App Router para melhor performance e SEO
2. **Shadcn UI**: Componentes acessíveis e customizáveis
3. **TypeScript**: Tipagem forte para melhor DX
4. **Arquitetura Modular**: Componentes reutilizáveis e bem estruturados

### Testes
1. **Jest**: Framework padrão para testes
2. **Testing Library**: Foco em comportamento do usuário
3. **Cobertura Completa**: Testes para lógica de negócio e componentes

## 🚀 Deploy

### Backend (Vercel/Netlify Functions)
```bash
cd backend
npm run build
```

### Frontend (Vercel)
```bash
cd frontend
npm run build
npm run start
```

## 📝 Licença

Este projeto foi desenvolvido para o Desafio Full Stack da Juridiq.

## 👨‍💻 Autor: Kaio Franklin

Desenvolvido com ❤️ para o processo seletivo da Juridiq.

---

**Contato**: kaio.franklin.dev@gmail.com 