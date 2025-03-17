import { z } from 'zod';
import { Role } from '../../types';

export const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    role: z.nativeEnum(Role).optional(),
});

export const updateUserSchema = z.object({
    name: z.string().optional(),
    role: z.nativeEnum(Role).optional(),
});

export const updateUserStatusSchema = z.object({
    active: z.boolean(),
});
