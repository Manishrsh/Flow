import { Response, NextFunction } from 'express';
import Bot from '../models/Bot';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth';

export const getBots = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const query: any = { userId: req.user?._id };
        if (status) query.status = status;

        const bots = await Bot.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        const total = await Bot.countDocuments(query);

        res.status(200).json({
            success: true,
            data: bots,
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

export const getBot = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const bot = await Bot.findOne({
            _id: req.params.id,
            userId: req.user?._id
        });

        if (!bot) {
            return next(new AppError('Bot not found', 404));
        }

        res.status(200).json({
            success: true,
            data: bot
        });
    } catch (error) {
        next(error);
    }
};

export const createBot = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const botData = {
            ...req.body,
            userId: req.user?._id
        };

        const bot = await Bot.create(botData);

        res.status(201).json({
            success: true,
            data: bot
        });
    } catch (error) {
        next(error);
    }
};

export const updateBot = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const bot = await Bot.findOneAndUpdate(
            { _id: req.params.id, userId: req.user?._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!bot) {
            return next(new AppError('Bot not found', 404));
        }

        res.status(200).json({
            success: true,
            data: bot
        });
    } catch (error) {
        next(error);
    }
};

export const deleteBot = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const bot = await Bot.findOneAndDelete({
            _id: req.params.id,
            userId: req.user?._id
        });

        if (!bot) {
            return next(new AppError('Bot not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Bot deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const toggleBotStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const bot = await Bot.findOne({
            _id: req.params.id,
            userId: req.user?._id
        });

        if (!bot) {
            return next(new AppError('Bot not found', 404));
        }

        bot.status = bot.status === 'active' ? 'inactive' : 'active';
        await bot.save();

        res.status(200).json({
            success: true,
            data: bot
        });
    } catch (error) {
        next(error);
    }
};

export const importN8nWorkflow = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { workflow } = req.body;

        if (!workflow || !workflow.nodes || !workflow.connections) {
            return next(new AppError('Invalid n8n workflow format', 400));
        }

        // Transform n8n workflow to our bot format
        const bot = await Bot.create({
            name: workflow.name || 'Imported n8n Workflow',
            description: 'Imported from n8n',
            userId: req.user?._id,
            status: 'inactive',
            trigger: {
                type: 'keyword',
                keywords: []
            },
            flow: {
                nodes: workflow.nodes.map((node: any) => ({
                    id: node.name,
                    type: node.type,
                    position: node.position || { x: 0, y: 0 },
                    data: node.parameters
                })),
                edges: Object.entries(workflow.connections).flatMap(([source, targets]: any) =>
                    targets.main[0].map((target: any, index: number) => ({
                        id: `${source}-${target.node}-${index}`,
                        source,
                        target: target.node
                    }))
                )
            }
        });

        res.status(201).json({
            success: true,
            data: bot,
            message: 'n8n workflow imported successfully'
        });
    } catch (error) {
        next(error);
    }
};
