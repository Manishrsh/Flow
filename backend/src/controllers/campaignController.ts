import { Response, NextFunction } from 'express';
import Campaign from '../models/Campaign';
import Contact from '../models/Contact';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth';
import { sendWhatsAppMessage } from '../services/whatsappService';

export const getCampaigns = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 10, status, type } = req.query;

        const query: any = { userId: req.user?._id };

        if (status) query.status = status;
        if (type) query.type = type;

        const campaigns = await Campaign.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 })
            .populate('templateId', 'name');

        const total = await Campaign.countDocuments(query);

        res.status(200).json({
            success: true,
            data: campaigns,
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

export const getCampaign = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const campaign = await Campaign.findOne({
            _id: req.params.id,
            userId: req.user?._id
        }).populate('templateId contacts segments');

        if (!campaign) {
            return next(new AppError('Campaign not found', 404));
        }

        res.status(200).json({
            success: true,
            data: campaign
        });
    } catch (error) {
        next(error);
    }
};

export const createCampaign = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const campaignData = {
            ...req.body,
            userId: req.user?._id
        };

        // Get recipients count
        let recipients = [];
        if (req.body.contacts && req.body.contacts.length > 0) {
            recipients = await Contact.find({ _id: { $in: req.body.contacts } });
        }

        campaignData.stats = {
            recipients: recipients.length,
            sent: 0,
            delivered: 0,
            read: 0,
            failed: 0,
            clicked: 0
        };

        const campaign = await Campaign.create(campaignData);

        res.status(201).json({
            success: true,
            data: campaign
        });
    } catch (error) {
        next(error);
    }
};

export const updateCampaign = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const campaign = await Campaign.findOneAndUpdate(
            { _id: req.params.id, userId: req.user?._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!campaign) {
            return next(new AppError('Campaign not found', 404));
        }

        res.status(200).json({
            success: true,
            data: campaign
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCampaign = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const campaign = await Campaign.findOneAndDelete({
            _id: req.params.id,
            userId: req.user?._id
        });

        if (!campaign) {
            return next(new AppError('Campaign not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Campaign deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const startCampaign = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const campaign = await Campaign.findOne({
            _id: req.params.id,
            userId: req.user?._id
        }).populate('contacts');

        if (!campaign) {
            return next(new AppError('Campaign not found', 404));
        }

        if (campaign.status !== 'draft' && campaign.status !== 'paused') {
            return next(new AppError('Campaign cannot be started', 400));
        }

        // Update campaign status
        campaign.status = 'running';
        campaign.startedAt = new Date();
        await campaign.save();

        // Send messages (in production, use a queue like Bull)
        const contacts = await Contact.find({ _id: { $in: campaign.contacts } });

        for (const contact of contacts) {
            try {
                await sendWhatsAppMessage(contact.phone, campaign.message.content);
                campaign.stats.sent++;
            } catch (error) {
                campaign.stats.failed++;
            }
        }

        await campaign.save();

        res.status(200).json({
            success: true,
            data: campaign,
            message: 'Campaign started successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const pauseCampaign = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const campaign = await Campaign.findOneAndUpdate(
            { _id: req.params.id, userId: req.user?._id },
            { status: 'paused' },
            { new: true }
        );

        if (!campaign) {
            return next(new AppError('Campaign not found', 404));
        }

        res.status(200).json({
            success: true,
            data: campaign,
            message: 'Campaign paused successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const getCampaignStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const stats = await Campaign.aggregate([
            { $match: { userId: req.user?._id } },
            {
                $group: {
                    _id: null,
                    totalCampaigns: { $sum: 1 },
                    totalSent: { $sum: '$stats.sent' },
                    totalDelivered: { $sum: '$stats.delivered' },
                    totalRead: { $sum: '$stats.read' },
                    totalFailed: { $sum: '$stats.failed' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats[0] || {
                totalCampaigns: 0,
                totalSent: 0,
                totalDelivered: 0,
                totalRead: 0,
                totalFailed: 0
            }
        });
    } catch (error) {
        next(error);
    }
};
