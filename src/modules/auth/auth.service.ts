import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { HTTP_STATUS } from '../../utils/constants';
import prisma from '../../config/db';
import { Role } from '../../types';

class CustomError extends Error {
    constructor(
        public message: string,
        public statusCode: number,
    ) {
        super(message);
    }
}

export class AuthService {
    async register(data: { email: string; password: string; name?: string; role?: Role }) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new CustomError('Email already in use', HTTP_STATUS.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        return prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                role: data.role || 'USER',
                active: true,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
                createdAt: true,
            },
        });
    }

    private generateTokens(userId: number) {
        const accessToken = jwt.sign({ userId }, env.jwtSecret, {
            expiresIn: '15m',
        });

        const refreshToken = jwt.sign({ userId }, env.jwtSecret, {
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    }

    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
                active: true,
            },
        });

        if (!user) {
            throw new CustomError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
        }

        if (!user.active) {
            throw new CustomError('Account is deactivated', HTTP_STATUS.UNAUTHORIZED);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new CustomError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
        }

        const { accessToken, refreshToken } = this.generateTokens(user.id);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        return {
            accessToken,
            refreshToken,
            user: userWithoutPassword,
        };
    }

    async refreshToken(token: string) {
        const refreshTokenData = await prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!refreshTokenData || refreshTokenData.expiresAt < new Date()) {
            throw new CustomError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
        }

        const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(
            refreshTokenData.userId,
        );

        await prisma.refreshToken.delete({ where: { id: refreshTokenData.id } });
        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: refreshTokenData.userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: {
                id: refreshTokenData.user.id,
                email: refreshTokenData.user.email,
                name: refreshTokenData.user.name,
                role: refreshTokenData.user.role,
            },
        };
    }

    async logout(token: string) {
        await prisma.refreshToken.delete({ where: { token } });
    }
}
