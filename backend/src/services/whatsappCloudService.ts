import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';
import WhatsAppAccount, { IWhatsAppAccount } from '../models/WhatsAppAccount';
import { AppError } from '../utils/AppError';

const WHATSAPP_API_VERSION = 'v18.0';
const WHATSAPP_API_BASE_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

class WhatsAppCloudService {
    private createAxiosInstance(accessToken: string): AxiosInstance {
        return axios.create({
            baseURL: WHATSAPP_API_BASE_URL,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
    }

    /**
     * Verify WhatsApp Business Account credentials
     */
    async verifyAccount(phoneNumberId: string, accessToken: string): Promise<any> {
        try {
            const api = this.createAxiosInstance(accessToken);
            const response = await api.get(`/${phoneNumberId}`);

            logger.info(`WhatsApp account verified: ${phoneNumberId}`);
            return response.data;
        } catch (error: any) {
            logger.error('WhatsApp account verification failed:', error.response?.data || error.message);
            throw new AppError('Failed to verify WhatsApp account. Please check your credentials.', 400);
        }
    }

    /**
     * Get WhatsApp Business Account details
     */
    async getBusinessAccountDetails(businessAccountId: string, accessToken: string): Promise<any> {
        try {
            const api = this.createAxiosInstance(accessToken);
            const response = await api.get(`/${businessAccountId}`, {
                params: {
                    fields: 'id,name,timezone_id,message_template_namespace'
                }
            });

            return response.data;
        } catch (error: any) {
            logger.error('Failed to get business account details:', error.response?.data || error.message);
            throw new AppError('Failed to fetch business account details', 400);
        }
    }

    /**
     * Get phone number details including quality rating and limits
     */
    async getPhoneNumberDetails(phoneNumberId: string, accessToken: string): Promise<any> {
        try {
            const api = this.createAxiosInstance(accessToken);
            const response = await api.get(`/${phoneNumberId}`, {
                params: {
                    fields: 'id,verified_name,display_phone_number,quality_rating,code_verification_status,messaging_limit_tier'
                }
            });

            return response.data;
        } catch (error: any) {
            logger.error('Failed to get phone number details:', error.response?.data || error.message);
            throw new AppError('Failed to fetch phone number details', 400);
        }
    }

    /**
     * Send text message
     */
    async sendTextMessage(
        account: IWhatsAppAccount,
        to: string,
        message: string,
        previewUrl: boolean = false
    ): Promise<{ messageId: string; status: string }> {
        try {
            // Check rate limits
            if (!account.canSendMessage()) {
                throw new AppError('Daily message limit reached for this account', 429);
            }

            const api = this.createAxiosInstance(account.accessToken);
            const cleanPhone = to.replace(/\D/g, '');

            const payload = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanPhone,
                type: 'text',
                text: {
                    preview_url: previewUrl,
                    body: message
                }
            };

            const response = await api.post(`/${account.phoneNumberId}/messages`, payload);

            // Increment message count
            account.incrementMessageCount();
            await account.save();

            logger.info(`WhatsApp message sent from ${account.phoneNumber} to ${to}`);

            return {
                messageId: response.data.messages[0].id,
                status: 'sent'
            };
        } catch (error: any) {
            logger.error('WhatsApp send message error:', error.response?.data || error.message);

            if (error.response?.status === 429) {
                throw new AppError('Rate limit exceeded. Please try again later.', 429);
            }

            throw new AppError(
                error.response?.data?.error?.message || 'Failed to send WhatsApp message',
                error.response?.status || 500
            );
        }
    }

    /**
     * Send media message (image, video, document, audio)
     */
    async sendMediaMessage(
        account: IWhatsAppAccount,
        to: string,
        mediaType: 'image' | 'video' | 'document' | 'audio',
        mediaUrl: string,
        caption?: string,
        filename?: string
    ): Promise<{ messageId: string; status: string }> {
        try {
            if (!account.canSendMessage()) {
                throw new AppError('Daily message limit reached for this account', 429);
            }

            const api = this.createAxiosInstance(account.accessToken);
            const cleanPhone = to.replace(/\D/g, '');

            const payload: any = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanPhone,
                type: mediaType
            };

            payload[mediaType] = {
                link: mediaUrl
            };

            if (caption && (mediaType === 'image' || mediaType === 'video' || mediaType === 'document')) {
                payload[mediaType].caption = caption;
            }

            if (filename && mediaType === 'document') {
                payload[mediaType].filename = filename;
            }

            const response = await api.post(`/${account.phoneNumberId}/messages`, payload);

            account.incrementMessageCount();
            await account.save();

            logger.info(`WhatsApp ${mediaType} sent from ${account.phoneNumber} to ${to}`);

            return {
                messageId: response.data.messages[0].id,
                status: 'sent'
            };
        } catch (error: any) {
            logger.error('WhatsApp send media error:', error.response?.data || error.message);
            throw new AppError(
                error.response?.data?.error?.message || 'Failed to send media message',
                error.response?.status || 500
            );
        }
    }

    /**
     * Send template message
     */
    async sendTemplateMessage(
        account: IWhatsAppAccount,
        to: string,
        templateName: string,
        languageCode: string = 'en_US',
        components?: any[]
    ): Promise<{ messageId: string; status: string }> {
        try {
            if (!account.canSendMessage()) {
                throw new AppError('Daily message limit reached for this account', 429);
            }

            const api = this.createAxiosInstance(account.accessToken);
            const cleanPhone = to.replace(/\D/g, '');

            const payload = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanPhone,
                type: 'template',
                template: {
                    name: templateName,
                    language: {
                        code: languageCode
                    },
                    components: components || []
                }
            };

            const response = await api.post(`/${account.phoneNumberId}/messages`, payload);

            account.incrementMessageCount();
            await account.save();

            logger.info(`WhatsApp template sent from ${account.phoneNumber} to ${to}`);

            return {
                messageId: response.data.messages[0].id,
                status: 'sent'
            };
        } catch (error: any) {
            logger.error('WhatsApp send template error:', error.response?.data || error.message);
            throw new AppError(
                error.response?.data?.error?.message || 'Failed to send template message',
                error.response?.status || 500
            );
        }
    }

    /**
     * Send interactive message (buttons, lists)
     */
    async sendInteractiveMessage(
        account: IWhatsAppAccount,
        to: string,
        interactiveType: 'button' | 'list',
        body: string,
        buttons?: any[],
        listSections?: any[],
        header?: any,
        footer?: string
    ): Promise<{ messageId: string; status: string }> {
        try {
            if (!account.canSendMessage()) {
                throw new AppError('Daily message limit reached for this account', 429);
            }

            const api = this.createAxiosInstance(account.accessToken);
            const cleanPhone = to.replace(/\D/g, '');

            const interactive: any = {
                type: interactiveType,
                body: { text: body }
            };

            if (header) {
                interactive.header = header;
            }

            if (footer) {
                interactive.footer = { text: footer };
            }

            if (interactiveType === 'button' && buttons) {
                interactive.action = { buttons };
            } else if (interactiveType === 'list' && listSections) {
                interactive.action = {
                    button: 'Select',
                    sections: listSections
                };
            }

            const payload = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanPhone,
                type: 'interactive',
                interactive
            };

            const response = await api.post(`/${account.phoneNumberId}/messages`, payload);

            account.incrementMessageCount();
            await account.save();

            logger.info(`WhatsApp interactive message sent from ${account.phoneNumber} to ${to}`);

            return {
                messageId: response.data.messages[0].id,
                status: 'sent'
            };
        } catch (error: any) {
            logger.error('WhatsApp send interactive error:', error.response?.data || error.message);
            throw new AppError(
                error.response?.data?.error?.message || 'Failed to send interactive message',
                error.response?.status || 500
            );
        }
    }

    /**
     * Mark message as read
     */
    async markMessageAsRead(account: IWhatsAppAccount, messageId: string): Promise<void> {
        try {
            const api = this.createAxiosInstance(account.accessToken);

            await api.post(`/${account.phoneNumberId}/messages`, {
                messaging_product: 'whatsapp',
                status: 'read',
                message_id: messageId
            });

            logger.info(`Message ${messageId} marked as read`);
        } catch (error: any) {
            logger.error('WhatsApp mark read error:', error.response?.data || error.message);
            // Don't throw error, just log it
        }
    }

    /**
     * Get message templates
     */
    async getMessageTemplates(account: IWhatsAppAccount): Promise<any[]> {
        try {
            const api = this.createAxiosInstance(account.accessToken);

            const response = await api.get(`/${account.businessAccountId}/message_templates`, {
                params: {
                    limit: 100
                }
            });

            return response.data.data || [];
        } catch (error: any) {
            logger.error('WhatsApp get templates error:', error.response?.data || error.message);
            throw new AppError('Failed to fetch message templates', 500);
        }
    }

    /**
     * Create message template
     */
    async createMessageTemplate(
        account: IWhatsAppAccount,
        name: string,
        category: string,
        language: string,
        components: any[]
    ): Promise<any> {
        try {
            const api = this.createAxiosInstance(account.accessToken);

            const payload = {
                name,
                category,
                language,
                components
            };

            const response = await api.post(`/${account.businessAccountId}/message_templates`, payload);

            logger.info(`Template created: ${name}`);
            return response.data;
        } catch (error: any) {
            logger.error('WhatsApp create template error:', error.response?.data || error.message);
            throw new AppError(
                error.response?.data?.error?.message || 'Failed to create template',
                error.response?.status || 500
            );
        }
    }

    /**
     * Delete message template
     */
    async deleteMessageTemplate(account: IWhatsAppAccount, templateName: string): Promise<void> {
        try {
            const api = this.createAxiosInstance(account.accessToken);

            await api.delete(`/${account.businessAccountId}/message_templates`, {
                params: {
                    name: templateName
                }
            });

            logger.info(`Template deleted: ${templateName}`);
        } catch (error: any) {
            logger.error('WhatsApp delete template error:', error.response?.data || error.message);
            throw new AppError('Failed to delete template', 500);
        }
    }

    /**
     * Upload media to WhatsApp
     */
    async uploadMedia(account: IWhatsAppAccount, mediaFile: Buffer, mimeType: string): Promise<string> {
        try {
            const api = this.createAxiosInstance(account.accessToken);

            const formData = new FormData();
            formData.append('file', new Blob([mediaFile], { type: mimeType }));
            formData.append('messaging_product', 'whatsapp');

            const response = await api.post(`/${account.phoneNumberId}/media`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            logger.info(`Media uploaded: ${response.data.id}`);
            return response.data.id;
        } catch (error: any) {
            logger.error('WhatsApp upload media error:', error.response?.data || error.message);
            throw new AppError('Failed to upload media', 500);
        }
    }

    /**
     * Get media URL
     */
    async getMediaUrl(account: IWhatsAppAccount, mediaId: string): Promise<string> {
        try {
            const api = this.createAxiosInstance(account.accessToken);

            const response = await api.get(`/${mediaId}`);

            return response.data.url;
        } catch (error: any) {
            logger.error('WhatsApp get media URL error:', error.response?.data || error.message);
            throw new AppError('Failed to get media URL', 500);
        }
    }

    /**
     * Download media
     */
    async downloadMedia(account: IWhatsAppAccount, mediaUrl: string): Promise<Buffer> {
        try {
            const response = await axios.get(mediaUrl, {
                headers: {
                    'Authorization': `Bearer ${account.accessToken}`
                },
                responseType: 'arraybuffer'
            });

            return Buffer.from(response.data);
        } catch (error: any) {
            logger.error('WhatsApp download media error:', error.message);
            throw new AppError('Failed to download media', 500);
        }
    }

    /**
     * Register webhook
     */
    async registerWebhook(
        account: IWhatsAppAccount,
        callbackUrl: string,
        verifyToken: string,
        fields: string[] = ['messages', 'message_status']
    ): Promise<void> {
        try {
            const api = this.createAxiosInstance(account.accessToken);

            await api.post(`/${account.businessAccountId}/subscribed_apps`, {
                callback_url: callbackUrl,
                verify_token: verifyToken,
                fields: fields.join(',')
            });

            logger.info(`Webhook registered for account: ${account.phoneNumber}`);
        } catch (error: any) {
            logger.error('WhatsApp register webhook error:', error.response?.data || error.message);
            throw new AppError('Failed to register webhook', 500);
        }
    }
}

export default new WhatsAppCloudService();
