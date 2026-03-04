import { Response, NextFunction } from 'express';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth';
import { sendWhatsAppMessage } from '../services/whatsappService';
import { io } from '../server';

export const getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const messages = await Message.find({ conversationId })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: 1 })
            .populate('contactId', 'name phone');

        const total = await Message.countDocuments({ conversationId });

        res.status(200).json({
            success: true,
            data: messages,
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

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { conversationId, content, type = 'text', mediaUrl } = req.body;

        // Get conversation
        const conversation = await Conversation.findById(conversationId)
            .populate('contactId', 'phone');

        if (!conversation) {
            return next(new AppError('Conversation not found', 404));
        }

        // Create message
        const message = await Message.create({
            conversationId,
            contactId: conversation.contactId,
            userId: req.user?._id,
            direction: 'outbound',
            platform: conversation.platform,
            type,
            content,
            mediaUrl,
            status: 'sent'
        });

        // Send via WhatsApp
        try {
            const contact: any = conversation.contactId;
            const result = await sendWhatsAppMessage(contact.phone, content, mediaUrl);
            message.whatsappMessageId = result.messageId;
            await message.save();
        } catch (error) {
            message.status = 'failed';
            await message.save();
        }

        // Update conversation
        conversation.lastMessageAt = new Date();
        await conversation.save();

        // Emit socket event
        io.to(`conversation:${conversationId}`).emit('new_message', message);

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { conversationId } = req.params;

        await Message.updateMany(
            { conversationId, direction: 'inbound', status: { $ne: 'read' } },
            { status: 'read' }
        );

        await Conversation.findByIdAndUpdate(conversationId, { unreadCount: 0 });

        // Emit socket event
        io.to(`conversation:${conversationId}`).emit('messages_read');

        res.status(200).json({
            success: true,
            message: 'Messages marked as read'
        });
    } catch (error) {
        next(error);
    }
};
