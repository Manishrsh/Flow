import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
    name: string;
    type: 'broadcast' | 'drip' | 'scheduled';
    status: 'draft' | 'running' | 'paused' | 'completed';
    templateId?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    segments: mongoose.Types.ObjectId[];
    contacts: mongoose.Types.ObjectId[];
    scheduledAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    stats: {
        recipients: number;
        sent: number;
        delivered: number;
        read: number;
        failed: number;
        clicked: number;
    };
    message: {
        type: 'text' | 'template';
        content: string;
        mediaUrl?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>({
    name: {
        type: String,
        required: [true, 'Campaign name is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['broadcast', 'drip', 'scheduled'],
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'running', 'paused', 'completed'],
        default: 'draft'
    },
    templateId: {
        type: Schema.Types.ObjectId,
        ref: 'Template'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    segments: [{
        type: Schema.Types.ObjectId,
        ref: 'Segment'
    }],
    contacts: [{
        type: Schema.Types.ObjectId,
        ref: 'Contact'
    }],
    scheduledAt: {
        type: Date
    },
    startedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    stats: {
        recipients: { type: Number, default: 0 },
        sent: { type: Number, default: 0 },
        delivered: { type: Number, default: 0 },
        read: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        clicked: { type: Number, default: 0 }
    },
    message: {
        type: {
            type: String,
            enum: ['text', 'template'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        mediaUrl: String
    }
}, {
    timestamps: true
});

// Indexes
campaignSchema.index({ userId: 1, status: 1 });
campaignSchema.index({ scheduledAt: 1 });

export default mongoose.model<ICampaign>('Campaign', campaignSchema);
