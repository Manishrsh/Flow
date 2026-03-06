import jwt, { SignOptions } from 'jsonwebtoken';

export const generateAccessToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET || 'default-secret-change-in-production';

    const options: SignOptions = {
        expiresIn: process.env.JWT_EXPIRE as jwt.SignOptions["expiresIn"]
    };

    return jwt.sign({ id: userId }, secret, options);
};

export const verifyAccessToken = (token: string): { id: string } => {
    try {
        const secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
        return jwt.verify(token, secret) as { id: string };
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
};

export const generateRefreshToken = (userId: string): string => {
    const secret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production';

    const options: SignOptions = {
        expiresIn: process.env.JWT_REFRESH_EXPIRE as jwt.SignOptions["expiresIn"]
    };

    return jwt.sign({ id: userId }, secret, options);
};

export const verifyRefreshToken = (token: string): { id: string } => {
    try {
        const secret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production';
        return jwt.verify(token, secret) as { id: string };
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};