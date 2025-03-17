import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HTTP_STATUS } from '../utils/constants';
import prisma from '../config/db';
import { Role } from '../types';

interface JwtPayload {
    userId: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: Role;
            };
        }
    }
}

export const authenticate: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }

        const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true },
        });

        if (!user) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: 'Invalid token',
        });
        return;
    }
};

export const authorize = (...allowedRoles: Role[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: 'Insufficient permissions',
            });
            return;
        }
        next();
    };
};
