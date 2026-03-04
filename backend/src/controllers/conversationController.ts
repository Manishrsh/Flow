import { Response, NextFunction } from 'express';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth';

export const getConversations = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 20, status, platform } = req.query;

        const query: any = { userId: req.user?._id };

        if (status) query.status = status;
        if (platform) query.platform = platform;

        const conversations = await Conversation.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ lastMessageAt: -1 })
            .populate('contactId', 'name phone email avatar')
            .populate('assignedTo', 'name email');

        const total = await Conversation.countDocuments(query);

        res.status(200).json({
            success: true,
            data: conversations,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getConversation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const conversation = await Conversation.findOne({
            _id: req.params.id,
            userId: req.user?._id
        })
            .populate('contactId', 'name phone email avatar tags')
            .populate('assignedTo', 'name email');

        if (!conversation) {
            return next(new AppError('Conversation not found', 404));
        }

        res.status(200).json({
            success: true,
            data: conversation
        });
    } catch (error) {
        next(error);
    }
};

export const createConversation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const conversationData = {
            ...req.body,
            userId: req.user?._id
        };

        const conversation = await Conversation.create(conversationData);

        res.status(201).json({
            success: true,
            data: conversation
        });
    } catch (error) {
        next(error);
    }
};

export const updateConversation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const conversation = await Conversation.findOneAndUpdate(
            { _id: req.params.id, userId: req.user?._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!conversation) {
            return next(new AppError('Conversation not found', 404));
        }

        res.status(200).json({
            success: true,
            data: conversation
        });
    } catch (error) {
        next(error);
    }
};

export const assignConversation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { assignedTo } = req.body;

        const conversation = await Conversation.findOneAndUpdate(
            { _id: req.params.id, userId: req.user?._id },
            { assignedTo },
            { new: true }
        ).populate('assignedTo', 'name email');

        if (!conversation) {
            return next(new AppError('Conversation not found', 404));
        }

        res.status(200).json({
            success: true,
            data: conversation
        });
    } catch (error) {
        next(error);
    }
};

export const closeConversation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const conversation = await Conversation.findOneAndUpdate(
            { _id: req.params.id, userId: req.user?._id },
            { status: 'closed' },
            { new: true }
        );

        if (!conversation) {
            return next(new AppError('Conversation not found', 404));
        }

        res.status(200).json({
            success: true,
            data: conversation
        });
    } catch (error) {
        next(error);
    }
};

export const getConversationStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const stats = await Conversation.aggregate([
            { $match: { userId: req.user?._id } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalUnread = await Conversation.aggregate([
            { $match: { userId: req.user?._id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$unreadCount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                byStatus: stats,
                totalUnread: totalUnread[0]?.total || 0
            }
        });
    } catch (error) {
        next(error);
    }
};
