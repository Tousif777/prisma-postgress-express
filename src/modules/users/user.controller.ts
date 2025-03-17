import { Request, Response } from 'express';
import { UserService } from './user.service';
import { createUserSchema, updateUserStatusSchema } from './user.schema';
import { successResponse } from '../../utils/apiResponse';
import { HTTP_STATUS } from '../../utils/constants';
import { asyncHandler } from '../../utils/asyncHandler';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    createUser = asyncHandler(async (req: Request, res: Response) => {
        const userData = createUserSchema.parse(req.body);
        const user = await this.userService.createUser(userData);
        res.status(HTTP_STATUS.CREATED).json(successResponse(user, 'User created successfully'));
    });

    getProfile = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userService.getUserById(req.user!.id);
        res.status(HTTP_STATUS.OK).json(successResponse(user, 'Profile retrieved successfully'));
    });

    getAllUsers = asyncHandler(async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const users = await this.userService.getAllUsers(page, limit);
        res.status(HTTP_STATUS.OK).json(successResponse(users, 'Users retrieved successfully'));
    });

    getUserById = asyncHandler(async (req: Request, res: Response) => {
        const userId = Number(req.params.id);
        const user = await this.userService.getUserById(userId);
        res.status(HTTP_STATUS.OK).json(successResponse(user, 'User retrieved successfully'));
    });

    updateUserRole = asyncHandler(async (req: Request, res: Response) => {
        const userId = Number(req.params.id);
        const { role } = req.body;
        const user = await this.userService.updateUserRole(userId, role, req.user!.id);
        res.status(HTTP_STATUS.OK).json(successResponse(user, 'User role updated successfully'));
    });

    updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
        const userId = Number(req.params.id);
        const { active } = updateUserStatusSchema.parse(req.body);
        const user = await this.userService.updateUserStatus(userId, active, req.user!.id);
        res.status(HTTP_STATUS.OK).json(
            successResponse(user, `User ${active ? 'activated' : 'deactivated'} successfully`),
        );
    });
}
