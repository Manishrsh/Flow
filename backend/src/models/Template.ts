import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplate extends Document {
    name: string;
    category: 'marketing' | 'utility' | 'authentication';
    language: string;
    status: 'pending' | 'approved' | 'rejected';
    userId: mongoose.Types.ObjectId;
    whatsappTemplateId?: string;
    content: {
        header?: {
            type: 'text' | 'image' | 'video' | 'document';
            content: string;
        };
        body: string;
        footer?: string;
        buttons?: Array<{
            type: 'quick_reply' | 'url' | 'phone_number';
            text: string;
            url?: string;
            phoneNumber?: string;
        }>;
    };
    variables: string[];
    createdAt: Date;
    updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>({
    name: {
        type: String,
        required: [true, 'Template name is required'],
        trim: true
    },
    category: {
        type: String,
        enum: ['marketing', 'utility', 'authentication'],
        required: true
    },
    language: {
        type: String,
        default: 'en_US'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    whatsappTemplateId: {
        type: String
    },
    content: {
        header: {
            type: {
                type: String,
                enum: ['text', 'image', 'video', 'document']
            },
            content: String
        },
        body: {
            type: String,
            required: true
        },
        footer: String,
        buttons: [{
            type: {
                type: String,
                enum: ['quick_reply', 'url', 'phone_number']
            },
            text: String,
            url: String,
            phoneNumber: String
        }]
    },
    variables: [{
        type: String
    }]
}, {
    timestamps: true
});

// Indexes
templateSchema.index({ userId: 1, status: 1 });
templateSchema.index({ name: 1 });

export default mongoose.model<ITemplate>('Template', templateSchema);
