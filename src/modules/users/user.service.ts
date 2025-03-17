import bcrypt from 'bcrypt';
import { HTTP_STATUS, PAGINATION } from '../../utils/constants';
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

export class UserService {
    async createUser(data: { email: string; password: string; name?: string; role?: Role }) {
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
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
    }

    async getUserById(id: number) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
            },
        });

        if (!user) {
            throw new CustomError('User not found', HTTP_STATUS.NOT_FOUND);
        }

        return user;
    }

    async updateUserRole(id: number, role: Role, requestingUserId: number) {
        const requestingUser = await prisma.user.findUnique({ where: { id: requestingUserId } });
        if (!requestingUser || requestingUser.role !== 'ADMIN') {
            throw new CustomError('Unauthorized to change user roles', HTTP_STATUS.FORBIDDEN);
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
            },
        });

        return user;
    }

    async updateUserStatus(id: number, active: boolean, requestingUserId: number) {
        const requestingUser = await prisma.user.findUnique({ where: { id: requestingUserId } });
        if (!requestingUser || requestingUser.role !== 'ADMIN') {
            throw new CustomError('Unauthorized to change user status', HTTP_STATUS.FORBIDDEN);
        }

        const user = await prisma.user.update({
            where: { id },
            data: { active },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
            },
        });

        return user;
    }

    async getAllUsers(
        page: number = PAGINATION.DEFAULT_PAGE,
        limit: number = PAGINATION.DEFAULT_LIMIT,
    ) {
        page = Math.max(1, page);
        limit = Math.min(Math.max(1, limit), PAGINATION.MAX_LIMIT);

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    active: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            prisma.user.count(),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
                nextPage: page < totalPages ? page + 1 : null,
                previousPage: page > 1 ? page - 1 : null,
                startIndex: skip + 1,
                endIndex: Math.min(skip + limit, total),
                itemsOnPage: users.length,
            },
        };
    }
}
