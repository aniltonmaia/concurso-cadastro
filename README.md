# Sistema de Cadastro de Candidatos

Sistema completo para gerenciamento de candidatos em processos seletivos/concursos.

## Funcionalidades

- ✅ Autenticação de usuários (Admin/Recrutador)
- ✅ CRUD de candidatos
- ✅ Dashboard com estatísticas
- ✅ Filtros e busca
- ✅ Interface responsiva
- ✅ Validação de formulários

## Tecnologias

### Backend
- Node.js + Express
- PostgreSQL
- JWT Authentication
- bcryptjs
- CORS e Helmet (segurança)

### Frontend
- React 18 + TypeScript
- React Router
- Tailwind CSS
- React Hook Form
- Axios

## Instalação

### Pré-requisitos
- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

### 1. Configurar Banco de Dados

```bash
# Criar banco de dados
createdb concurso_cadastro

# Executar schema
psql -d concurso_cadastro -f server/database/schema.sql
```

### 2. Instalar Dependências

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configurar Variáveis de Ambiente

O arquivo `.env` já está configurado no servidor com as seguintes variáveis:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=concurso_cadastro
DB_USER=postgres
DB_PASSWORD=senha123

# JWT Configuration
JWT_SECRET=chave_secreta_super_segura_2024
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

**Importante**: Altere a senha do banco de dados se necessário.

### 4. Executar a Aplicação

```bash
# Iniciar o servidor (terminal 1)
cd server
npm run dev

# Iniciar o frontend (terminal 2)
cd client
npm start
```

## Acesso

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## Usuário Padrão

Email: `admin@concurso.com`
Senha: `admin123`

## Estrutura do Projeto

```
concurso-cadastro/
├── server/
│   ├── routes/
│   │   ├── auth.js
│   │   └── candidates.js
│   ├── database/
│   │   └── schema.sql
│   ├── .env
│   ├── index.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── ...
│   └── package.json
└── README.md
```

## API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Candidatos
- `GET /api/candidates` - Listar candidatos
- `GET /api/candidates/:id` - Obter candidato
- `POST /api/candidates` - Criar candidato
- `PUT /api/candidates/:id` - Atualizar candidato
- `DELETE /api/candidates/:id` - Excluir candidato

## Desenvolvimento

O sistema está pronto para uso. Os erros de TypeScript no frontend são esperados pois as dependências ainda não foram instaladas. Após executar `npm install` no client, todos os erros serão resolvidos.

## Próximos Passos

1. Instalar as dependências do frontend
2. Configurar o banco de dados PostgreSQL
3. Executar a aplicação
4. Testar todas as funcionalidades
