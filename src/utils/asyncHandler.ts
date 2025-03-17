import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;

export const asyncHandler = (handler: AsyncRequestHandler): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    };
};
