import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId;
    contactId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    direction: 'inbound' | 'outbound';
    platform: 'whatsapp' | 'instagram' | 'youtube' | 'web';
    type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'template';
    content: string;
    mediaUrl?: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    whatsappMessageId?: string;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
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
    direction: {
        type: String,
        enum: ['inbound', 'outbound'],
        required: true
    },
    platform: {
        type: String,
        enum: ['whatsapp', 'instagram', 'youtube', 'web'],
        default: 'whatsapp'
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'document', 'location', 'template'],
        default: 'text'
    },
    content: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read', 'failed'],
        default: 'sent'
    },
    whatsappMessageId: {
        type: String
    },
    metadata: {
        type: Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ contactId: 1, createdAt: -1 });
messageSchema.index({ userId: 1, createdAt: -1 });
messageSchema.index({ whatsappMessageId: 1 });

export default mongoose.model<IMessage>('Message', messageSchema);
