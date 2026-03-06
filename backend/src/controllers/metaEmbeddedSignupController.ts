import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import WhatsAppAccount from '../models/WhatsAppAccount';
import whatsappCloudService from '../services/whatsappCloudService';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import axios from 'axios';

// Exchange code for access token
export const exchangeCodeForToken = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const userId = req.user?._id;
        const { code } = req.body;

        if (!code) {
            throw new AppError('Authorization code is required', 400);
        }

        // Exchange code for access token with Meta
        const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
            params: {
                client_id: process.env.META_APP_ID,
                client_secret: process.env.META_APP_SECRET,
                code: code
            }
        });

        const { access_token } = response.data;

        // Get debug token info to extract WABA ID
        const debugResponse = await axios.get('https://graph.facebook.com/v18.0/debug_token', {
            params: {
                input_token: access_token,
                access_token: `${process.env.META_APP_ID}|${process.env.META_APP_SECRET}`
            }
        });

        const tokenData = debugResponse.data.data;
        const wabaId = tokenData.granular_scopes?.find((s: any) =>
            s.scope === 'whatsapp_business_management'
        )?.target_ids?.[0];

        if (!wabaId) {
            throw new AppError('WhatsApp Business Account ID not found in token', 400);
        }

        res.json({
            success: true,
            data: {
                accessToken: access_token,
                wabaId: wabaId,
                expiresIn: tokenData.expires_at
            }
        });
    } catch (error: any) {
        logger.error('Meta token exchange error:', error.response?.data || error.message);
        next(new AppError('Failed to exchange authorization code', 500));
    }
};

// Complete embedded signup
export const completeEmbeddedSignup = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const userId = req.user?._id;
        const {
            accessToken,
            wabaId,
            phoneNumberId,
            name
        } = req.body;

        if (!accessToken || !wabaId || !phoneNumberId) {
            throw new AppError('Missing required fields', 400);
        }

        // Get phone number details
        const phoneDetails = await whatsappCloudService.getPhoneNumberDetails(
            phoneNumberId,
            accessToken
        );

        // Get business account details
        const businessDetails = await whatsappCloudService.getBusinessAccountDetails(
            wabaId,
            accessToken
        );

        // Check if account already exists
        const existingAccount = await WhatsAppAccount.findOne({ phoneNumberId });
        if (existingAccount) {
            throw new AppError('This WhatsApp account is already connected', 400);
        }

        // Create new account
        const account = await WhatsAppAccount.create({
            userId,
            name: name || phoneDetails.verified_name || phoneDetails.display_phone_number,
            phoneNumberId,
            phoneNumber: phoneDetails.display_phone_number,
            businessAccountId: wabaId,
            accessToken,
            isDefault: true, // First account is default
            status: 'active',
            metadata: {
                displayName: phoneDetails.display_phone_number,
                qualityRating: phoneDetails.quality_rating,
                verifiedName: phoneDetails.verified_name,
                codeVerificationStatus: phoneDetails.code_verification_status,
                messagingLimit: phoneDetails.messaging_limit_tier
            },
            lastSyncedAt: new Date()
        });

        // Register webhook
        const webhookUrl = `${process.env.APP_URL}/api/v1/webhooks/whatsapp/${account._id}`;
        try {
            await whatsappCloudService.registerWebhook(
                account,
                webhookUrl,
                account.webhookVerifyToken
            );
        } catch (webhookError) {
            logger.warn('Failed to register webhook automatically:', webhookError);
        }

        // Return account without access token
        const accountData: any = account.toObject();
        delete accountData.accessToken;

        res.status(201).json({
            success: true,
            data: accountData,
            webhookUrl,
            webhookVerifyToken: account.webhookVerifyToken
        });
    } catch (error) {
        next(error);
    }
};

// Get embedded signup configuration
export const getEmbeddedSignupConfig = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const config = {
            appId: process.env.META_APP_ID,
            configId: process.env.META_CONFIG_ID,
            redirectUri: `${process.env.APP_URL}/integrations/callback`,
            state: req.user?._id.toString() // Pass user ID as state
        };

        res.json({
            success: true,
            data: config
        });
    } catch (error) {
        next(error);
    }
};

// Handle webhook subscription
export const subscribeWebhook = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const { accountId } = req.params;
        const userId = req.user?._id;

        const account = await WhatsAppAccount.findOne({
            _id: accountId,
            userId
        }).select('+accessToken');

        if (!account) {
            throw new AppError('WhatsApp account not found', 404);
        }

        const webhookUrl = `${process.env.APP_URL}/api/v1/webhooks/whatsapp/${account._id}`;

        await whatsappCloudService.registerWebhook(
            account,
            webhookUrl,
            account.webhookVerifyToken,
            ['messages', 'message_status']
        );

        res.json({
            success: true,
            message: 'Webhook subscribed successfully',
            data: {
                webhookUrl,
                verifyToken: account.webhookVerifyToken
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get available phone numbers from WABA
export const getAvailablePhoneNumbers = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const { wabaId, accessToken } = req.body;

        if (!wabaId || !accessToken) {
            throw new AppError('WABA ID and access token are required', 400);
        }

        const response = await axios.get(
            `https://graph.facebook.com/v18.0/${wabaId}/phone_numbers`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        const phoneNumbers = response.data.data.map((phone: any) => ({
            id: phone.id,
            displayPhoneNumber: phone.display_phone_number,
            verifiedName: phone.verified_name,
            qualityRating: phone.quality_rating,
            codeVerificationStatus: phone.code_verification_status
        }));

        res.json({
            success: true,
            data: phoneNumbers
        });
    } catch (error: any) {
        logger.error('Get phone numbers error:', error.response?.data || error.message);
        next(new AppError('Failed to fetch phone numbers', 500));
    }
};
