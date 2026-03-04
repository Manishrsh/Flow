import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email?: string;
    phone: string;
    whatsappId?: string;
    tags: string[];
    status: 'active' | 'inactive' | 'blocked';
    customFields: Map<string, any>;
    segments: mongoose.Types.ObjectId[];
    userId: mongoose.Types.ObjectId;
    lastInteraction?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const contactSchema = new Schema<IContact>({
    name: {
        type: String,
        required: [true, 'Contact name is required'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    whatsappId: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'blocked'],
        default: 'active'
    },
    customFields: {
        type: Map,
        of: Schema.Types.Mixed
    },
    segments: [{
        type: Schema.Types.ObjectId,
        ref: 'Segment'
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastInteraction: {
        type: Date
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes for better query performance
contactSchema.index({ phone: 1, userId: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ tags: 1 });
contactSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IContact>('Contact', contactSchema);
