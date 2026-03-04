import { Response, NextFunction } from 'express';
import Contact from '../models/Contact';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middleware/auth';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

export const getContacts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 10, search, status, tags } = req.query;

        const query: any = { userId: req.user?._id };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            query.status = status;
        }

        if (tags) {
            query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
        }

        const contacts = await Contact.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .sort({ createdAt: -1 });

        const total = await Contact.countDocuments(query);

        res.status(200).json({
            success: true,
            data: contacts,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const contact = await Contact.findOne({
            _id: req.params.id,
            userId: req.user?._id
        });

        if (!contact) {
            return next(new AppError('Contact not found', 404));
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const contactData = {
            ...req.body,
            userId: req.user?._id
        };

        const contact = await Contact.create(contactData);

        res.status(201).json({
            success: true,
            data: contact
        });
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const contact = await Contact.findOneAndUpdate(
            { _id: req.params.id, userId: req.user?._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!contact) {
            return next(new AppError('Contact not found', 404));
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const contact = await Contact.findOneAndDelete({
            _id: req.params.id,
            userId: req.user?._id
        });

        if (!contact) {
            return next(new AppError('Contact not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const importContacts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return next(new AppError('Please upload a CSV file', 400));
        }

        const contacts: any[] = [];
        const stream = Readable.from(req.file.buffer.toString());

        stream
            .pipe(csvParser())
            .on('data', (row) => {
                contacts.push({
                    name: row.name,
                    email: row.email,
                    phone: row.phone,
                    tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
                    userId: req.user?._id
                });
            })
            .on('end', async () => {
                try {
                    const result = await Contact.insertMany(contacts, { ordered: false });

                    res.status(201).json({
                        success: true,
                        message: `${result.length} contacts imported successfully`,
                        data: result
                    });
                } catch (error) {
                    next(error);
                }
            });
    } catch (error) {
        next(error);
    }
};

export const exportContacts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const contacts = await Contact.find({ userId: req.user?._id });

        const csv = [
            ['Name', 'Email', 'Phone', 'Tags', 'Status', 'Created At'].join(','),
            ...contacts.map(c => [
                c.name,
                c.email || '',
                c.phone,
                c.tags.join(';'),
                c.status,
                c.createdAt.toISOString()
            ].join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
        res.status(200).send(csv);
    } catch (error) {
        next(error);
    }
};
