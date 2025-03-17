# Express + Prisma + PostgreSQL API

A robust RESTful API built with Express.js, Prisma ORM, and PostgreSQL, featuring authentication, role-based authorization, and rate limiting.

## Features

- 🔐 JWT Authentication
- 👥 Role-Based Access Control (User, Employee, Admin)
- 📝 User Management
- ⚡ Rate Limiting
- 🔍 Input Validation using Zod
- 📦 PostgreSQL with Prisma ORM
- 🚀 TypeScript Support
- 🔄 Refresh Token Rotation
- 📊 Pagination Support
- ⚠️ Error Handling
- 🔧 Environment Variables

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd prisma-postgress-express
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   - Set your PostgreSQL connection URL
   - Change the JWT secret
   - Adjust other settings as needed

4. **Database Setup:**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run database migrations
   npm run prisma:migrate

   # Seed the database (optional)
   npx prisma db seed
   ```

## Running the Application

**Development:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/refresh-token` - Refresh access token
- POST `/api/auth/logout` - Logout user

### Users
- GET `/api/users` - Get all users (paginated)
- GET `/api/users/me` - Get current user profile
- GET `/api/users/:id` - Get user by ID
- PATCH `/api/users/:id/role` - Update user role (Admin only)
- PATCH `/api/users/:id/status` - Update user status (Admin only)

## Rate Limiting

- General API routes: 100 requests per 15 minutes
- Auth routes: 5 login attempts per hour

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── config/          # Configuration files
├── middlewares/     # Express middlewares
├── modules/         # Feature modules
│   ├── auth/        # Authentication module
│   └── users/       # Users module
├── types/           # TypeScript type definitions
├── utils/          # Utility functions
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## Default Users (After Seeding)

- Admin: admin@example.com (password: Admin@123)
- Employees: employee1@example.com, employee2@example.com (password: Employee@123)
- Regular Users: user1@example.com to user10@example.com (password: User@123)

## Error Handling

The API uses a centralized error handling mechanism with proper HTTP status codes and consistent error responses.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS enabled
- Input validation
- Role-based access control

## Development Tools

- ESLint for linting
- Prettier for code formatting
- TypeScript for type safety
- Winston for logging

## License

MIT