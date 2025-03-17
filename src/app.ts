import express from 'express';
import cors from 'cors';
import userRoutes from './modules/users/user.routes';
import authRoutes from './modules/auth/auth.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { apiLimiter, authLimiter } from './middlewares/rateLimiter.middleware';

const app = express();
app.use(cors());
app.use(express.json());

// Apply rate limiting
app.use('/api', apiLimiter); // General rate limiting for all API routes
app.use('/api/auth', authLimiter); // Stricter rate limiting for auth routes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware should be last
app.use(errorMiddleware as express.ErrorRequestHandler);

export default app;
