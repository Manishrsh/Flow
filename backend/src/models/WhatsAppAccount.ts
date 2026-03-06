import mongoose, { Document, Schema } from 'mongoose';

export interface IWhatsAppAccount extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    phoneNumberId: string;
    phoneNumber: string;
    businessAccountId: string;
    accessToken: string;
    webhookVerifyToken: string;
    status: 'active' | 'inactive' | 'expired' | 'error';
    isDefault: boolean;
    metadata: {
        displayName?: string;
        qualityRating?: string;
        verifiedName?: string;
        codeVerificationStatus?: string;
        messagingLimit?: string;
    };
    rateLimits: {
        messagesPerSecond: number;
        messagesPerDay: number;
        currentDayCount: number;
        lastResetDate: Date;
    };
    lastSyncedAt?: Date;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;

    // Methods
    resetDailyCountIfNeeded(): void;
    canSendMessage(): boolean;
    incrementMessageCount(): void;
}

const WhatsAppAccountSchema = new Schema<IWhatsAppAccount>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        phoneNumberId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        businessAccountId: {
            type: String,
            required: true
        },
        accessToken: {
            type: String,
            required: true,
            select: false // Don't return by default for security
        },
        webhookVerifyToken: {
            type: String,
            required: true,
            default: () => require('crypto').randomBytes(32).toString('hex')
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'expired', 'error'],
            default: 'active'
        },
        isDefault: {
            type: Boolean,
            default: false
        },
        metadata: {
            displayName: String,
            qualityRating: String,
            verifiedName: String,
            codeVerificationStatus: String,
            messagingLimit: String
        },
        rateLimits: {
            messagesPerSecond: {
                type: Number,
                default: 80
            },
            messagesPerDay: {
                type: Number,
                default: 1000
            },
            currentDayCount: {
                type: Number,
                default: 0
            },
            lastResetDate: {
                type: Date,
                default: Date.now
            }
        },
        lastSyncedAt: Date,
        expiresAt: Date
    },
    {
        timestamps: true
    }
);

// Index for efficient queries
WhatsAppAccountSchema.index({ userId: 1, status: 1 });
WhatsAppAccountSchema.index({ userId: 1, isDefault: 1 });

// Ensure only one default account per user
WhatsAppAccountSchema.pre('save', async function (next) {
    if (this.isDefault && this.isModified('isDefault')) {
        await mongoose.model('WhatsAppAccount').updateMany(
            { userId: this.userId, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    next();
});

// Reset daily message count
WhatsAppAccountSchema.methods.resetDailyCountIfNeeded = function () {
    const now = new Date();
    const lastReset = new Date(this.rateLimits.lastResetDate);

    if (now.getDate() !== lastReset.getDate() ||
        now.getMonth() !== lastReset.getMonth() ||
        now.getFullYear() !== lastReset.getFullYear()) {
        this.rateLimits.currentDayCount = 0;
        this.rateLimits.lastResetDate = now;
    }
};

// Check if can send message
WhatsAppAccountSchema.methods.canSendMessage = function (): boolean {
    this.resetDailyCountIfNeeded();
    return this.rateLimits.currentDayCount < this.rateLimits.messagesPerDay;
};

// Increment message count
WhatsAppAccountSchema.methods.incrementMessageCount = function () {
    this.resetDailyCountIfNeeded();
    this.rateLimits.currentDayCount += 1;
};

export default mongoose.model<IWhatsAppAccount>('WhatsAppAccount', WhatsAppAccountSchema);
