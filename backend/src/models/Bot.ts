import mongoose, { Document, Schema } from 'mongoose';

export interface IBot extends Document {
    name: string;
    description?: string;
    userId: mongoose.Types.ObjectId;
    status: 'active' | 'inactive';
    trigger: {
        type: 'keyword' | 'webhook' | 'schedule';
        keywords?: string[];
        webhookUrl?: string;
        schedule?: string;
    };
    flow: {
        nodes: Array<{
            id: string;
            type: string;
            position: { x: number; y: number };
            data: any;
        }>;
        edges: Array<{
            id: string;
            source: string;
            target: string;
            sourceHandle?: string;
            targetHandle?: string;
        }>;
    };
    stats: {
        triggered: number;
        completed: number;
        failed: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const botSchema = new Schema<IBot>({
    name: {
        type: String,
        required: [true, 'Bot name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    trigger: {
        type: {
            type: String,
            enum: ['keyword', 'webhook', 'schedule'],
            required: true
        },
        keywords: [{
            type: String,
            lowercase: true,
            trim: true
        }],
        webhookUrl: String,
        schedule: String
    },
    flow: {
        nodes: [{
            id: String,
            type: String,
            position: {
                x: Number,
                y: Number
            },
            data: Schema.Types.Mixed
        }],
        edges: [{
            id: String,
            source: String,
            target: String,
            sourceHandle: String,
            targetHandle: String
        }]
    },
    stats: {
        triggered: { type: Number, default: 0 },
        completed: { type: Number, default: 0 },
        failed: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Indexes
botSchema.index({ userId: 1, status: 1 });
botSchema.index({ 'trigger.keywords': 1 });

export default mongoose.model<IBot>('Bot', botSchema);
