import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import WhatsAppAccount from '../models/WhatsAppAccount';
import whatsappCloudService from '../services/whatsappCloudService';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

// Get all WhatsApp accounts for user
export const getWhatsAppAccounts = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const userId = req.user?._id;

        const accounts = await WhatsAppAccount.find({ userId })
            .select('-accessToken')
            .sort({ isDefault: -1, createdAt: -1 });

        res.json({
            success: true,
            data: accounts
        });
    } catch (error) {
        next(error);
    }
};

// Get single WhatsApp account
export const getWhatsAppAccount = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const account = await WhatsAppAccount.findOne({ _id: id, userId })
            .select('-accessToken');

        if (!account) {
            throw new AppError('WhatsApp account not found', 404);
        }

        res.json({
            success: true,
            data: account
        });
    } catch (error) {
        next(error);
    }
};

// Add new WhatsApp account
export const addWhatsAppAccount = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const userId = req.user?._id;
        const {
            name,
            phoneNumberId,
            phoneNumber,
            businessAccountId,
            accessToken,
            isDefault
        } = req.body;

        // Validate required fields
        if (!name || !phoneNumberId || !phoneNumber || !businessAccountId || !accessToken) {
            throw new AppError('All fields are required', 400);
        }

        // Verify the account with WhatsApp API
        const phoneDetails = await whatsappCloudService.verifyAccount(phoneNumberId, accessToken);

        // Check if account already exists
        const existingAccount = await WhatsAppAccount.findOne({ phoneNumberId });
        if (existingAccount) {
            throw new AppError('This WhatsApp account is already connected', 400);
        }

        // Get additional details
        const businessDetails = await whatsappCloudService.getBusinessAccountDetails(
            businessAccountId,
            accessToken
        );

        const phoneNumberDetails = await whatsappCloudService.getPhoneNumberDetails(
            phoneNumberId,
            accessToken
        );

        // Create new account
        const account = await WhatsAppAccount.create({
            userId,
            name,
            phoneNumberId,
            phoneNumber,
            businessAccountId,
            accessToken,
            isDefault: isDefault || false,
            status: 'active',
            metadata: {
                displayName: phoneNumberDetails.display_phone_number,
                qualityRating: phoneNumberDetails.quality_rating,
                verifiedName: phoneNumberDetails.verified_name,
                codeVerificationStatus: phoneNumberDetails.code_verification_status,
                messagingLimit: phoneNumberDetails.messaging_limit_tier
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
            logger.warn('Failed to register webhook, but account was created:', webhookError);
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

// Update WhatsApp account
export const updateWhatsAppAccount = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;
        const { name, isDefault, status } = req.body;

        const account = await WhatsAppAccount.findOne({ _id: id, userId });

        if (!account) {
            throw new AppError('WhatsApp account not found', 404);
        }

        if (name) account.name = name;
        if (typeof isDefault === 'boolean') account.isDefault = isDefault;
        if (status) account.status = status;

        await account.save();

        const accountData: any = account.toObject();
        delete accountData.accessToken;

        res.json({
            success: true,
            data: accountData
        });
    } catch (error) {
        next(error);
    }
};

// Delete WhatsApp account
export const deleteWhatsAppAccount = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const account = await WhatsAppAccount.findOneAndDelete({ _id: id, userId });

        if (!account) {
            throw new AppError('WhatsApp account not found', 404);
        }

        res.json({
            success: true,
            message: 'WhatsApp account deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Sync account details with WhatsApp
export const syncWhatsAppAccount = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const account = await WhatsAppAccount.findOne({ _id: id, userId }).select('+accessToken');

        if (!account) {
            throw new AppError('WhatsApp account not found', 404);
        }

        // Get latest details from WhatsApp
        const phoneNumberDetails = await whatsappCloudService.getPhoneNumberDetails(
            account.phoneNumberId,
            account.accessToken
        );

        // Update metadata
        account.metadata = {
            displayName: phoneNumberDetails.display_phone_number,
            qualityRating: phoneNumberDetails.quality_rating,
            verifiedName: phoneNumberDetails.verified_name,
            codeVerificationStatus: phoneNumberDetails.code_verification_status,
            messagingLimit: phoneNumberDetails.messaging_limit_tier
        };
        account.lastSyncedAt = new Date();

        await account.save();

        const accountData: any = account.toObject();
        delete accountData.accessToken;

        res.json({
            success: true,
            data: accountData
        });
    } catch (error) {
        next(error);
    }
};

// Test WhatsApp account connection
export const testWhatsAppAccount = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;
        const { testPhoneNumber } = req.body;

        if (!testPhoneNumber) {
            throw new AppError('Test phone number is required', 400);
        }

        const account = await WhatsAppAccount.findOne({ _id: id, userId }).select('+accessToken');

        if (!account) {
            throw new AppError('WhatsApp account not found', 404);
        }

        // Send test message
        const result = await whatsappCloudService.sendTextMessage(
            account,
            testPhoneNumber,
            '🎉 Test message from your WhatsApp Business Account! Your integration is working correctly.'
        );

        res.json({
            success: true,
            message: 'Test message sent successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// Get account statistics
export const getWhatsAppAccountStats = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const account = await WhatsAppAccount.findOne({ _id: id, userId });

        if (!account) {
            throw new AppError('WhatsApp account not found', 404);
        }

        account.resetDailyCountIfNeeded();

        const stats = {
            messagesPerDay: account.rateLimits.messagesPerDay,
            messagesSentToday: account.rateLimits.currentDayCount,
            messagesRemaining: account.rateLimits.messagesPerDay - account.rateLimits.currentDayCount,
            qualityRating: account.metadata.qualityRating,
            messagingLimit: account.metadata.messagingLimit,
            status: account.status
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

// Get webhook configuration
export const getWebhookConfig = async (req: AuthRequest, res: Response, next: any) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params;

        const account = await WhatsAppAccount.findOne({ _id: id, userId });

        if (!account) {
            throw new AppError('WhatsApp account not found', 404);
        }

        const webhookUrl = `${process.env.APP_URL}/api/v1/webhooks/whatsapp/${account._id}`;

        res.json({
            success: true,
            data: {
                webhookUrl,
                webhookVerifyToken: account.webhookVerifyToken,
                instructions: {
                    step1: 'Go to Meta for Developers (developers.facebook.com)',
                    step2: 'Select your app and navigate to WhatsApp > Configuration',
                    step3: 'Click "Edit" in the Webhook section',
                    step4: `Enter Callback URL: ${webhookUrl}`,
                    step5: `Enter Verify Token: ${account.webhookVerifyToken}`,
                    step6: 'Subscribe to webhook fields: messages, message_status',
                    step7: 'Click "Verify and Save"'
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
