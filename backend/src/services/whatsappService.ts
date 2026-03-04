import axios from 'axios';
import { logger } from '../utils/logger';

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export const sendWhatsAppMessage = async (
    to: string,
    message: string,
    mediaUrl?: string
): Promise<{ messageId: string }> => {
    try {
        const payload: any = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to.replace(/\D/g, ''), // Remove non-digits
            type: mediaUrl ? 'image' : 'text'
        };

        if (mediaUrl) {
            payload.image = {
                link: mediaUrl,
                caption: message
            };
        } else {
            payload.text = {
                preview_url: false,
                body: message
            };
        }

        const response = await axios.post(
            `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        logger.info(`WhatsApp message sent to ${to}`);

        return {
            messageId: response.data.messages[0].id
        };
    } catch (error: any) {
        logger.error('WhatsApp API Error:', error.response?.data || error.message);
        throw new Error('Failed to send WhatsApp message');
    }
};

export const sendWhatsAppTemplate = async (
    to: string,
    templateName: string,
    languageCode: string = 'en_US',
    components?: any[]
): Promise<{ messageId: string }> => {
    try {
        const payload = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to.replace(/\D/g, ''),
            type: 'template',
            template: {
                name: templateName,
                language: {
                    code: languageCode
                },
                components: components || []
            }
        };

        const response = await axios.post(
            `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        logger.info(`WhatsApp template sent to ${to}`);

        return {
            messageId: response.data.messages[0].id
        };
    } catch (error: any) {
        logger.error('WhatsApp Template API Error:', error.response?.data || error.message);
        throw new Error('Failed to send WhatsApp template');
    }
};

export const getWhatsAppTemplates = async (): Promise<any[]> => {
    try {
        const response = await axios.get(
            `${WHATSAPP_API_URL}/${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}/message_templates`,
            {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                }
            }
        );

        return response.data.data;
    } catch (error: any) {
        logger.error('WhatsApp Get Templates Error:', error.response?.data || error.message);
        throw new Error('Failed to fetch WhatsApp templates');
    }
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
    try {
        await axios.post(
            `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                status: 'read',
                message_id: messageId
            },
            {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        logger.info(`Message ${messageId} marked as read`);
    } catch (error: any) {
        logger.error('WhatsApp Mark Read Error:', error.response?.data || error.message);
    }
};
