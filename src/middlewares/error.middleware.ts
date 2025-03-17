import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/apiResponse';
import logger from '../utils/logger';

interface CustomError extends Error {
    statusCode?: number;
}

export const errorMiddleware = (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    if (error instanceof ZodError) {
        res.status(400).json(errorResponse('Validation error', { errors: error.errors }));
        return;
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';

    if (statusCode >= 500) {
        logger.error(message, { error });
    } else {
        logger.warn(message, { error });
    }

    res.status(statusCode).json(errorResponse(message));
};
