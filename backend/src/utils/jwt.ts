import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string): string => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
    });
};

export const verifyRefreshToken = (token: string): { id: string } => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
};
