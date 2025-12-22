# Backend Test API

A production-ready REST API built with Node.js, Express, TypeScript, PostgreSQL, and Elasticsearch for managing jokes with external API integration and mathematical operations.

## 🚀 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Search Engine**: Elasticsearch
- **Testing**: Jest (Unit Tests with TDD)
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston (Console + Elasticsearch)
- **HTTP Client**: Axios
- **Validation**: Zod
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

### Start all services

```bash
npm run docker:up
```

This will start:
- PostgreSQL on port 5432
- Elasticsearch on port 9200
- Node.js application on port 3000

### View logs

```bash
npm run docker:logs
```

### Stop services

```bash
npm run docker:down
```

### Rebuild containers

```bash
npm run docker:rebuild
```

## 🏃 Running Locally (Without Docker)

### 1. Start PostgreSQL and Elasticsearch

Make sure PostgreSQL and Elasticsearch are running locally or via Docker:

```bash
docker-compose up -d postgres elasticsearch
```

### 2. Run Prisma migrations

```bash
npm run prisma:migrate
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Seed the database

```bash
npm run prisma:seed
```

This will create:
- 4 users: Manolito, Pepe, Isabel, Pedro
- 3 topics: humor negro, humor amarillo, chistes verdes
- 36 jokes (3 jokes per topic per user)

### 5. Start the development server

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
│   ├── __tests__/
│   │   ├── setup.ts           # Jest setup and mocks
│   │   └── unit/              # Unit tests
│   ├── config/
│   │   ├── database.ts        # Prisma configuration
│   │   ├── elasticsearch.ts   # Elasticsearch client
│   │   ├── env.ts             # Environment validation
│   │   ├── logger.ts          # Winston logger setup
│   │   └── swagger.ts         # Swagger configuration
│   ├── controllers/
│   │   └── healthController.ts
│   ├── middleware/
│   │   ├── errorHandler.ts    # Global error handling
│   │   └── requestLogger.ts   # HTTP request logging
│   ├── repositories/          # Data access layer
│   ├── routes/
│   │   └── index.ts           # Route definitions
│   ├── services/              # Business logic
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── utils/                 # Utility functions
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── docker-compose.yml
├── Dockerfile
├── jest.config.js
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc.json
└── package.json
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

Elasticsearch is used for:

1. **Application Logs**: Centralized logging with Winston
   - Accessible via Elasticsearch queries
   - Index: `logs`

2. **Jokes Search** (prepared for implementation):
   - Full-text search on joke content
   - Filter by source, user, topics
   - Index: `jokes`

## 🔍 API Endpoints (To Be Implemented)

### Jokes Endpoints

- `GET /api/jokes/:type?` - Get random joke (Chuck/Dad/random)
- `POST /api/jokes` - Create a new joke
- `PUT /api/jokes/:number` - Update a joke by number
- `DELETE /api/jokes/:number` - Delete a joke by number
- `GET /api/jokes/user/:userId` - Get jokes by user
- `GET /api/jokes/topic/:topicName` - Get jokes by topic

### Math Endpoints

- `GET /api/math/lcm?numbers=[]` - Calculate LCM of numbers
- `GET /api/math/increment?number=X` - Increment number by 1

### Paired Jokes Endpoint

- `GET /api/jokes/paired` - Get 5 paired Chuck + Dad jokes

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

### Adding New Endpoints

1. Create controller in `src/controllers/`
2. Create service in `src/services/`
3. Create repository in `src/repositories/` (if needed)
4. Add routes in `src/routes/`
5. Add Swagger documentation with JSDoc
6. Write unit tests in `src/__tests__/unit/`

### Testing Strategy

- **Unit Tests Only**: All external dependencies are mocked
- Mock Prisma, Elasticsearch, and external APIs
- Test business logic in services
- Test request/response handling in controllers
- Aim for 80%+ code coverage

### Code Style

- Use ESLint and Prettier (configured)
- Follow TypeScript best practices
- Use async/await over callbacks
- Handle errors properly with try/catch
- Log important operations

## 📄 License

ISC

## 👥 Authors

Backend Test Team

---

**Ready to start implementing the endpoints!** 🎉
