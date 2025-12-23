# Backend Test API

A production-ready REST API built with Node.js, Express, TypeScript, PostgreSQL, and Elasticsearch for managing jokes with external API integration, full-text search, and mathematical operations.

## 🚀 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Search Engine**: Elasticsearch (Full-text search with automatic indexing)
- **NLP**: Compromise.js (Natural language processing for joke combinations)
- **Testing**: Jest (Unit Tests with TDD - 88 tests)
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston (Console + Elasticsearch)
- **HTTP Client**: Axios
- **Validation**: Zod (Request validation with transformations)
- **Code Quality**: ESLint + Prettier
- **Containerization**: Docker + Docker Compose

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** and **Docker Compose**
- **Git**

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend-test
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory (you can copy from `.env.example`):

```bash
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/backend_test

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# Logging
LOG_LEVEL=debug

# API Configuration
CHUCK_NORRIS_API_URL=https://api.chucknorris.io
DAD_JOKE_API_URL=https://icanhazdadjoke.com
```

## 🐳 Running with Docker (Recommended)

### First Time Setup

If this is your **first time** running the project:

```bash
# 1. Start all services (Postgres, Elasticsearch, App)
npm run docker:up

# 2. Wait ~15 seconds for services to be healthy, then run migrations
docker compose exec app npx prisma migrate deploy

# 3. Seed the database with initial data
docker compose exec app npx prisma db seed

# 4. Check if everything is running
curl http://localhost:3000/api/health
```

This will create:
- **4 users**: Manolito, Pepe, Isabel, Pedro
- **3 topics**: humor negro, humor amarillo, chistes verdes
- **36 jokes**: 3 jokes per topic per user

### Regular Usage

```bash
# Start services (if already configured)
npm run docker:up

# View application logs
npm run docker:logs

# Stop services
npm run docker:down

# Rebuild containers (after dependency changes)
npm run docker:rebuild
```

### What Gets Started

- **PostgreSQL**: Port 5432 (Database)
- **Elasticsearch**: Port 9200 (Search engine + Logs)
- **Node.js App**: Port 3000 (API Server)

## 💻 Running Locally (Without Docker)

If you prefer to run the app locally without Docker:

### 1. Start dependencies with Docker

```bash
docker compose up -d postgres elasticsearch
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run migrations (first time only)

```bash
npm run prisma:migrate:deploy
npm run prisma:seed
```

### 4. Start the development server

```bash
npm run dev
```

The server will start on http://localhost:3000

## 📚 API Documentation

Once the server is running, you can access:

- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/health

## 🧪 Testing

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Generate coverage report

```bash
npm run test:coverage
```

Coverage thresholds are set to 80% for:
- Branches
- Functions
- Lines
- Statements

## 📂 Project Structure

```
backend-test/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seed script
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma configuration
│   │   ├── elasticsearch.ts   # Elasticsearch client & index setup
│   │   ├── env.ts             # Environment validation (Zod)
│   │   ├── logger.ts          # Winston logger
│   │   └── swagger.ts         # Swagger configuration
│   ├── controllers/           # HTTP request handlers (Singleton)
│   │   ├── HealthController.ts
│   │   ├── JokesController.ts
│   │   └── MathController.ts
│   ├── services/              # Business logic (Singleton)
│   │   ├── JokesService.ts
│   │   ├── MathService.ts
│   │   └── ElasticsearchService.ts
│   ├── repositories/          # Data access layer (Singleton)
│   │   └── JokesRepository.ts
│   ├── models/                # DTOs and mappers
│   │   └── Joke.model.ts
│   ├── validators/            # Zod schemas for request validation
│   │   ├── jokes.validator.ts
│   │   ├── math.validator.ts
│   │   └── search.validator.ts
│   ├── routes/                # Route definitions with Swagger docs
│   │   ├── index.ts
│   │   ├── health.routes.ts
│   │   ├── jokes.routes.ts
│   │   └── math.routes.ts
│   ├── middleware/
│   │   ├── errorHandler.ts   # Global error handling
│   │   ├── requestLogger.ts  # HTTP request logging
│   │   └── validateRequest.ts # Zod validation middleware
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── tests/                     # Unit tests (outside src/)
│   ├── setup.ts               # Jest configuration
│   ├── controllers/           # Controller tests
│   ├── services/              # Service tests
│   └── repositories/          # Repository tests
├── docker-compose.yml
├── docker-entrypoint.sh       # Container startup script
├── Dockerfile
├── jest.config.js
└── tsconfig.json
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:seed` | Seed database with initial data |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run docker:up` | Start Docker services |
| `npm run docker:down` | Stop Docker services |
| `npm run docker:logs` | View application logs |
| `npm run docker:rebuild` | Rebuild and restart containers |

## 🗄️ Database Models

### User
- Stores user information (Manolito, Pepe, Isabel, Pedro)
- One-to-many relationship with Jokes

### Topic
- Stores joke categories (humor negro, humor amarillo, chistes verdes)
- Many-to-many relationship with Jokes via JokeTopic

### Joke
- Stores joke text and metadata
- Can be from external APIs (Chuck, Dad) or custom
- Has auto-incrementing `number` field for easy reference
- Belongs to one User
- Can have multiple Topics

### JokeTopic
- Junction table for many-to-many relationship
- Links Jokes with Topics

## 📊 Elasticsearch Integration

Elasticsearch powers two key features:

### 1. **Application Logs**
- Centralized logging with Winston
- All application events indexed automatically
- Index: `logs`

### 2. **Jokes Full-Text Search** ✨
- **Automatic indexing**: Every joke (DB + external APIs) is indexed automatically
- **Fuzzy matching**: Handles typos ("Chuk Norris" finds "Chuck Norris")
- **Multi-field search**: Searches across text, userName, and topics
- **Relevance scoring**: Best matches ranked first
- **Index**: `jokes`

#### How It Works:
```bash
# Jokes are indexed automatically when:
# 1. Fetched from Chuck Norris API
GET /api/jokes/Chuck

# 2. Fetched from Dad Jokes API
GET /api/jokes/Dad

# 3. Created via POST endpoint
POST /api/jokes

# Then search them all:
GET /api/jokes/search?q=Chuck%20Norris&limit=10
```

## 🔍 API Endpoints

Complete API documentation available at: **http://localhost:3000/api-docs**

### Health Check
- `GET /api/health` - Check API, database, and Elasticsearch status

### Jokes Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jokes` | Get random joke from database |
| `GET` | `/api/jokes/:source` | Get joke from external API (Chuck/Dad) |
| `GET` | `/api/jokes/list` | List jokes with filters (userName, topicName) |
| `GET` | `/api/jokes/search` | **Full-text search** with Elasticsearch |
| `GET` | `/api/jokes/paired` | Get 5 paired Chuck + Dad jokes with NLP combination |
| `POST` | `/api/jokes` | Create a new joke |
| `DELETE` | `/api/jokes/:number` | Delete a joke by number |

### Math Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/math/lcm?numbers=1,2,3` | Calculate Least Common Multiple |
| `GET` | `/api/math/increment?number=5` | Increment number by 1 |

### Example Requests

```bash
# Get Chuck Norris joke
curl http://localhost:3000/api/jokes/Chuck

# Search jokes
curl "http://localhost:3000/api/jokes/search?q=divide&limit=5"

# Create a joke
curl -X POST http://localhost:3000/api/jokes \
  -H "Content-Type: application/json" \
  -d '{"text": "Why did the developer quit?", "userName": "Pedro", "topicName": "chistes verdes"}'

# Get paired jokes with NLP combination
curl http://localhost:3000/api/jokes/paired

# Calculate LCM
curl "http://localhost:3000/api/math/lcm?numbers=12,18,24"
```

## 🐛 Troubleshooting

### Port already in use

If port 3000, 5432, or 9200 is already in use:

```bash
# Change the port in .env file or docker-compose.yml
# Or kill the process using the port
lsof -ti:3000 | xargs kill -9
```

### Database connection issues

```bash
# Reset the database
npm run docker:down
docker volume rm backend-test_postgres_data
npm run docker:up
npm run prisma:migrate
npm run prisma:seed
```

### Elasticsearch not starting

Elasticsearch requires sufficient memory:

```bash
# On Linux, increase vm.max_map_count
sudo sysctl -w vm.max_map_count=262144
```

## 📝 Development Guidelines

### Architecture Patterns

- **Layered Architecture**: Controller → Service → Repository
- **Singleton Pattern**: All controllers, services, and repositories use singletons
- **OOP**: Classes with private constructors and static getInstance()
- **Dependency Injection**: Services receive repository instances
- **DTOs**: Separate domain models from API responses

### Testing Strategy (TDD)

- **88 Unit Tests**: All business logic covered
- **Mocked Dependencies**: Prisma, Elasticsearch, Axios, Winston
- **Test Location**: `tests/` folder (outside `src/`)
- **Naming Convention**: `{domain}.{layer}.spec.ts`
- **RED-GREEN-REFACTOR**: Write failing tests first

### Adding New Endpoints

1. **Write Tests First** (RED step)
   ```bash
   # tests/services/my-feature.service.spec.ts
   ```

2. **Create Service** (GREEN step)
   ```typescript
   // src/services/MyFeatureService.ts
   class MyFeatureService {
     private static instance: MyFeatureService;
     static getInstance() { ... }
   }
   ```

3. **Create Controller**
   ```typescript
   // src/controllers/MyFeatureController.ts
   ```

4. **Create Validator**
   ```typescript
   // src/validators/my-feature.validator.ts (Zod schema)
   ```

5. **Add Routes with Swagger**
   ```typescript
   // src/routes/my-feature.routes.ts
   ```

6. **Run Tests**
   ```bash
   npm test
   ```

## ✨ Key Features Implemented

✅ **Full CRUD for Jokes** with PostgreSQL
✅ **External API Integration** (Chuck Norris + Dad Jokes)
✅ **Elasticsearch Full-Text Search** with automatic indexing
✅ **NLP-Powered Joke Combinations** using Compromise.js
✅ **Mathematical Operations** (LCM, Increment)
✅ **Request Validation** with Zod (including transformations)
✅ **Comprehensive Testing** (88 unit tests, TDD approach)
✅ **API Documentation** with Swagger/OpenAPI
✅ **Centralized Logging** with Winston + Elasticsearch
✅ **Docker Support** for easy deployment
✅ **Type Safety** with TypeScript throughout

## 📄 License

ISC

---

**All features implemented and tested!** 🎉
