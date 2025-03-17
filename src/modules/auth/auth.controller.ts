import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { loginSchema, refreshTokenSchema, registerSchema } from './auth.schema';
import { HTTP_STATUS } from '../../utils/constants';
import { successResponse } from '../../utils/apiResponse';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    register = asyncHandler(async (req: Request, res: Response) => {
        const userData = registerSchema.parse(req.body);
        const user = await this.authService.register(userData);
        res.status(HTTP_STATUS.CREATED).json(successResponse(user, 'User registered successfully'));
    });

    login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = loginSchema.parse(req.body);
        const result = await this.authService.login(email, password);
        res.status(HTTP_STATUS.OK).json(successResponse(result, 'Login successful'));
    });

    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const { refreshToken } = refreshTokenSchema.parse(req.body);
        const result = await this.authService.refreshToken(refreshToken);
        res.status(HTTP_STATUS.OK).json(successResponse(result, 'Token refreshed successfully'));
    });

    logout = asyncHandler(async (req: Request, res: Response) => {
        const { refreshToken } = refreshTokenSchema.parse(req.body);
        await this.authService.logout(refreshToken);
        res.status(HTTP_STATUS.OK).json(successResponse(null, 'Logged out successfully'));
    });
}
