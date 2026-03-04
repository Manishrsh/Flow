import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
    contactId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
    platform: 'whatsapp' | 'instagram' | 'youtube' | 'web';
    status: 'open' | 'closed' | 'pending';
    lastMessageAt: Date;
    unreadCount: number;
    tags: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>({
    contactId: {
        type: Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    platform: {
        type: String,
        enum: ['whatsapp', 'instagram', 'youtube', 'web'],
        default: 'whatsapp'
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'pending'],
        default: 'open'
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    unreadCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes
conversationSchema.index({ contactId: 1, userId: 1 });
conversationSchema.index({ userId: 1, status: 1, lastMessageAt: -1 });
conversationSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.model<IConversation>('Conversation', conversationSchema);
