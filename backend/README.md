# WhatsApp CRM Backend

Production-ready Node.js backend for WhatsApp CRM application with TypeScript, Express, MongoDB, and Socket.IO.

## Features

- ✅ Authentication & Authorization (JWT)
- ✅ Contact Management (CRUD, Import/Export CSV)
- ✅ Campaign Management (Broadcast, Drip, Scheduled)
- ✅ Real-time Messaging (Socket.IO)
- ✅ WhatsApp Business API Integration
- ✅ Bot Builder with n8n Import
- ✅ Template Management
- ✅ Conversation Management
- ✅ Dashboard Analytics
- ✅ Webhook Handlers
- ✅ Rate Limiting
- ✅ Error Handling
- ✅ Logging (Winston)
- ✅ Redis Caching
- ✅ File Upload (Multer)
- ✅ Input Validation
- ✅ Security (Helmet, CORS)

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Validation**: Joi, Express-Validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x
- Redis >= 7.x
- WhatsApp Business API Account

## Installation

1. Clone the repository
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Build the project
```bash
npm run build
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

## Environment Variables

See `.env.example` for all required environment variables.

### Key Variables:
- `MONGODB_URI`: MongoDB connection string
- `REDIS_URL`: Redis connection URL
- `JWT_SECRET`: Secret key for JWT tokens
- `WHATSAPP_ACCESS_TOKEN`: WhatsApp Business API token
- `WHATSAPP_PHONE_NUMBER_ID`: Your WhatsApp phone number ID
- `WHATSAPP_VERIFY_TOKEN`: Webhook verification token

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Contacts
- `GET /api/v1/contacts` - Get all contacts (with pagination, search, filters)
- `POST /api/v1/contacts` - Create contact
- `GET /api/v1/contacts/:id` - Get single contact
- `PUT /api/v1/contacts/:id` - Update contact
- `DELETE /api/v1/contacts/:id` - Delete contact
- `POST /api/v1/contacts/import` - Import contacts from CSV
- `GET /api/v1/contacts/export` - Export contacts to CSV

### Campaigns
- `GET /api/v1/campaigns` - Get all campaigns
- `POST /api/v1/campaigns` - Create campaign
- `GET /api/v1/campaigns/:id` - Get single campaign
- `PUT /api/v1/campaigns/:id` - Update campaign
- `DELETE /api/v1/campaigns/:id` - Delete campaign
- `POST /api/v1/campaigns/:id/start` - Start campaign
- `POST /api/v1/campaigns/:id/pause` - Pause campaign
- `GET /api/v1/campaigns/stats` - Get campaign statistics

### Conversations
- `GET /api/v1/conversations` - Get all conversations
- `POST /api/v1/conversations` - Create conversation
- `GET /api/v1/conversations/:id` - Get single conversation
- `PUT /api/v1/conversations/:id` - Update conversation
- `POST /api/v1/conversations/:id/assign` - Assign conversation
- `POST /api/v1/conversations/:id/close` - Close conversation
- `GET /api/v1/conversations/stats` - Get conversation statistics

### Messages
- `GET /api/v1/messages/:conversationId` - Get messages for conversation
- `POST /api/v1/messages` - Send message
- `POST /api/v1/messages/:conversationId/read` - Mark messages as read

### Bots
- `GET /api/v1/bots` - Get all bots
- `POST /api/v1/bots` - Create bot
- `GET /api/v1/bots/:id` - Get single bot
- `PUT /api/v1/bots/:id` - Update bot
- `DELETE /api/v1/bots/:id` - Delete bot
- `POST /api/v1/bots/:id/toggle` - Toggle bot status
- `POST /api/v1/bots/import-n8n` - Import n8n workflow

### Templates
- `GET /api/v1/templates` - Get all templates
- `POST /api/v1/templates` - Create template
- `GET /api/v1/templates/:id` - Get single template
- `PUT /api/v1/templates/:id` - Update template
- `DELETE /api/v1/templates/:id` - Delete template
- `POST /api/v1/templates/sync` - Sync with WhatsApp templates

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/dashboard/activity` - Get recent activity

### Webhooks
- `GET /api/v1/webhooks/whatsapp` - WhatsApp webhook verification
- `POST /api/v1/webhooks/whatsapp` - WhatsApp webhook handler

## Socket.IO Events

### Client -> Server
- `join_conversation` - Join a conversation room
- `leave_conversation` - Leave a conversation room
- `typing` - Send typing indicator

### Server -> Client
- `new_message` - New message received
- `new_conversation_message` - New message in any conversation
- `user_typing` - User is typing
- `messages_read` - Messages marked as read

## Database Models

- **User**: User accounts with authentication
- **Contact**: Customer contacts
- **Conversation**: Chat conversations
- **Message**: Individual messages
- **Campaign**: Marketing campaigns
- **Template**: Message templates
- **Bot**: Automation bots

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- CORS protection
- Helmet security headers
- Input validation and sanitization
- MongoDB injection prevention

## Error Handling

Centralized error handling with custom AppError class. All errors are logged and returned with appropriate status codes.

## Logging

Winston logger with:
- Console logging in development
- File logging in production
- Error log file
- Combined log file
- Log rotation

## Testing

```bash
npm test
```

## Deployment

### Docker
```bash
docker build -t whatsapp-crm-backend .
docker run -p 5000:5000 whatsapp-crm-backend
```

### PM2
```bash
pm2 start dist/server.js --name whatsapp-crm
```

## WhatsApp Business API Setup

1. Create a Meta Business Account
2. Set up WhatsApp Business API
3. Get your Phone Number ID and Access Token
4. Configure webhook URL: `https://yourdomain.com/api/v1/webhooks/whatsapp`
5. Set webhook verify token in environment variables
6. Subscribe to webhook events: messages, message_status

## License

MIT
