import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { AppError } from '../utils/AppError';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError('Not authorized to access this route', 401));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return next(new AppError('User not found', 404));
            }

            if (!user.isActive) {
                return next(new AppError('User account is deactivated', 403));
            }

            req.user = user;
            next();
        } catch (error) {
            return next(new AppError('Invalid token', 401));
        }
    } catch (error) {
        next(error);
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('Not authorized to access this route', 403));
        }
        next();
    };
};
