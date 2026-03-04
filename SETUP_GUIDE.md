# Complete Setup Guide - WhatsApp CRM

## Prerequisites

- Node.js 18+ and npm
- MongoDB 6+
- Redis 7+
- WhatsApp Business API Account

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- MongoDB URI
- Redis URL
- JWT secrets
- WhatsApp API credentials
- SMTP settings

### 3. Start Services

**Option A: Using Docker**
```bash
docker-compose up -d
```

**Option B: Manual**
```bash
# Start MongoDB
mongod

# Start Redis
redis-server

# Start backend
npm run dev
```

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## WhatsApp Business API Setup

1. Create Meta Business Account
2. Set up WhatsApp Business API
3. Get Phone Number ID and Access Token
4. Configure webhook: `https://yourdomain.com/api/v1/webhooks/whatsapp`
5. Set verify token in .env
6. Subscribe to: messages, message_status

## Production Deployment

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
npm run build
npm start
```

## Testing

Register a new account at `/signup` and start using the application!
