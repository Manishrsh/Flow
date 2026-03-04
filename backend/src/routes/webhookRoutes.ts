import { Router, Request, Response } from 'express';
import Message from '../models/Message';
import Conversation from '../models/Conversation';
import Contact from '../models/Contact';
import Bot from '../models/Bot';
import { logger } from '../utils/logger';
import { io } from '../server';
import { markMessageAsRead } from '../services/whatsappService';

const router = Router();

// WhatsApp webhook verification
router.get('/whatsapp', (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        logger.info('WhatsApp webhook verified');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// WhatsApp webhook handler
router.post('/whatsapp', async (req: Request, res: Response) => {
    try {
        const { entry } = req.body;

        if (!entry || !entry[0]?.changes) {
            return res.sendStatus(200);
        }

        for (const change of entry[0].changes) {
            const { value } = change;

            // Handle incoming messages
            if (value.messages) {
                for (const message of value.messages) {
                    await handleIncomingMessage(message, value.metadata);
                }
            }

            // Handle message status updates
            if (value.statuses) {
                for (const status of value.statuses) {
                    await handleMessageStatus(status);
                }
            }
        }

        res.sendStatus(200);
    } catch (error) {
        logger.error('Webhook error:', error);
        res.sendStatus(500);
    }
});

async function handleIncomingMessage(message: any, metadata: any) {
    try {
        const phone = message.from;
        const content = message.text?.body || message.caption || '';
        const type = message.type;

        // Find or create contact
        let contact = await Contact.findOne({ phone });
        if (!contact) {
            contact = await Contact.create({
                name: metadata.display_phone_number || phone,
                phone,
                whatsappId: message.from,
                userId: metadata.phone_number_id, // Map to your user
                status: 'active'
            });
        }

        // Find or create conversation
        let conversation = await Conversation.findOne({
            contactId: contact._id,
            platform: 'whatsapp',
            status: { $ne: 'closed' }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                contactId: contact._id,
                userId: contact.userId,
                platform: 'whatsapp',
                status: 'open',
                lastMessageAt: new Date(),
                unreadCount: 1
            });
        } else {
            conversation.unreadCount += 1;
            conversation.lastMessageAt = new Date();
            await conversation.save();
        }

        // Create message
        const newMessage = await Message.create({
            conversationId: conversation._id,
            contactId: contact._id,
            userId: contact.userId,
            direction: 'inbound',
            platform: 'whatsapp',
            type,
            content,
            whatsappMessageId: message.id,
            status: 'delivered'
        });

        // Update contact last interaction
        contact.lastInteraction = new Date();
        await contact.save();

        // Emit socket event
        io.to(`conversation:${conversation._id}`).emit('new_message', newMessage);
        io.to(`user:${contact.userId}`).emit('new_conversation_message', {
            conversationId: conversation._id,
            message: newMessage
        });

        // Mark as read
        await markMessageAsRead(message.id);

        // Check for bot triggers
        await checkBotTriggers(content.toLowerCase(), conversation, contact);

        logger.info(`Incoming message processed: ${message.id}`);
    } catch (error) {
        logger.error('Error handling incoming message:', error);
    }
}

async function handleMessageStatus(status: any) {
    try {
        const { id, status: messageStatus } = status;

        await Message.findOneAndUpdate(
            { whatsappMessageId: id },
            { status: messageStatus }
        );

        logger.info(`Message status updated: ${id} -> ${messageStatus}`);
    } catch (error) {
        logger.error('Error handling message status:', error);
    }
}

async function checkBotTriggers(content: string, conversation: any, contact: any) {
    try {
        const bots = await Bot.find({
            userId: contact.userId,
            status: 'active',
            'trigger.type': 'keyword'
        });

        for (const bot of bots) {
            const keywords = bot.trigger.keywords || [];
            const hasKeyword = keywords.some(keyword => content.includes(keyword.toLowerCase()));

            if (hasKeyword) {
                // Execute bot flow (simplified - implement full flow execution)
                bot.stats.triggered += 1;
                await bot.save();

                logger.info(`Bot triggered: ${bot.name}`);
                // TODO: Implement full bot flow execution
            }
        }
    } catch (error) {
        logger.error('Error checking bot triggers:', error);
    }
}

export default router;
