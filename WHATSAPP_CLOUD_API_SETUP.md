# WhatsApp Cloud API Integration - Production Ready

## Overview
This is a complete, production-ready WhatsApp Cloud API integration that supports multiple client accounts. Each user can connect multiple WhatsApp Business accounts and manage them independently.

## Features

### Multi-Account Support
- ✅ Connect unlimited WhatsApp Business accounts
- ✅ Set default account for quick access
- ✅ Independent rate limiting per account
- ✅ Quality rating monitoring
- ✅ Messaging limit tier tracking

### Message Types Supported
- ✅ Text messages with URL preview
- ✅ Media messages (image, video, document, audio)
- ✅ Template messages (approved by Meta)
- ✅ Interactive messages (buttons, lists)
- ✅ Message status tracking (sent, delivered, read, failed)

### Production Features
- ✅ Rate limiting (per second and per day)
- ✅ Automatic daily counter reset
- ✅ Webhook verification and handling
- ✅ Error handling and logging
- ✅ Account health monitoring
- ✅ Template management
- ✅ Media upload and download

## Setup Guide

### Step 1: Create Meta for Developers Account

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Sign in with your Facebook account
3. Click "My Apps" → "Create App"
4. Select "Business" as app type
5. Fill in app details and create

### Step 2: Add WhatsApp Product

1. In your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set Up"
3. Select or create a Business Account
4. Add a phone number (you can use Meta's test number initially)

### Step 3: Get Required Credentials

#### Phone Number ID
1. Go to WhatsApp → API Setup
2. Copy the "Phone number ID" (15-digit number)

#### Business Account ID
1. Go to WhatsApp → API Setup
2. Copy the "WhatsApp Business Account ID"

#### Access Token
1. Go to WhatsApp → API Setup
2. Click "Generate Token" (temporary) or create a System User for permanent token
3. For production, create a permanent token:
   - Go to Business Settings → System Users
   - Create a new system user
   - Assign WhatsApp permissions
   - Generate token and save it securely

### Step 4: Configure Environment Variables

Add to your `backend/.env`:

```env
APP_URL=https://your-domain.com
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
```

### Step 5: Add Account via UI

1. Navigate to Integrations page
2. Click "Add Account"
3. Fill in the form:
   - **Account Name**: Friendly name (e.g., "Main Business")
   - **Phone Number ID**: From Step 3
   - **Phone Number**: Your WhatsApp number with country code
   - **Business Account ID**: From Step 3
   - **Access Token**: From Step 3
4. Click "Add Account"
5. Save the Webhook URL and Verify Token shown in the success message

### Step 6: Configure Webhook in Meta

1. Go to Meta for Developers → Your App
2. Navigate to WhatsApp → Configuration
3. Click "Edit" in Webhook section
4. Enter:
   - **Callback URL**: The webhook URL from Step 5
   - **Verify Token**: The verify token from Step 5
5. Subscribe to fields:
   - ✅ messages
   - ✅ message_status
6. Click "Verify and Save"

### Step 7: Test Your Integration

1. In the Integrations page, click "Test" on your account
2. Enter a test phone number (with country code)
3. Click "Send Test"
4. Check WhatsApp for the test message

## API Endpoints

### WhatsApp Account Management

```typescript
// Get all accounts
GET /api/v1/whatsapp-accounts

// Get single account
GET /api/v1/whatsapp-accounts/:id

// Add new account
POST /api/v1/whatsapp-accounts
Body: {
  name: string,
  phoneNumberId: string,
  phoneNumber: string,
  businessAccountId: string,
  accessToken: string,
  isDefault?: boolean
}

// Update account
PUT /api/v1/whatsapp-accounts/:id
Body: {
  name?: string,
  isDefault?: boolean,
  status?: string
}

// Delete account
DELETE /api/v1/whatsapp-accounts/:id

// Sync account with WhatsApp
POST /api/v1/whatsapp-accounts/:id/sync

// Test account
POST /api/v1/whatsapp-accounts/:id/test
Body: {
  testPhoneNumber: string
}

// Get account statistics
GET /api/v1/whatsapp-accounts/:id/stats

// Get webhook configuration
GET /api/v1/whatsapp-accounts/:id/webhook
```

## Usage Examples

### Send Text Message

```typescript
import whatsappCloudService from './services/whatsappCloudService';
import WhatsAppAccount from './models/WhatsAppAccount';

// Get account
const account = await WhatsAppAccount.findOne({ 
  userId, 
  isDefault: true 
}).select('+accessToken');

// Send message
const result = await whatsappCloudService.sendTextMessage(
  account,
  '+1234567890',
  'Hello from WhatsApp Cloud API!',
  true // Enable URL preview
);

console.log('Message ID:', result.messageId);
```

### Send Media Message

```typescript
const result = await whatsappCloudService.sendMediaMessage(
  account,
  '+1234567890',
  'image',
  'https://example.com/image.jpg',
  'Check out this image!'
);
```

### Send Template Message

```typescript
const result = await whatsappCloudService.sendTemplateMessage(
  account,
  '+1234567890',
  'order_confirmation',
  'en_US',
  [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: 'John' },
        { type: 'text', text: '#12345' }
      ]
    }
  ]
);
```

### Send Interactive Button Message

```typescript
const result = await whatsappCloudService.sendInteractiveMessage(
  account,
  '+1234567890',
  'button',
  'Would you like to continue?',
  [
    {
      type: 'reply',
      reply: {
        id: 'yes_button',
        title: 'Yes'
      }
    },
    {
      type: 'reply',
      reply: {
        id: 'no_button',
        title: 'No'
      }
    }
  ]
);
```

## Rate Limiting

### Default Limits
- **Messages per second**: 80
- **Messages per day**: 1,000 (tier-based, can increase)

### Automatic Handling
The system automatically:
- Tracks message count per account
- Resets daily counters at midnight
- Prevents sending when limit reached
- Returns 429 error when rate limited

### Checking Limits

```typescript
// Check if can send
if (account.canSendMessage()) {
  await whatsappCloudService.sendTextMessage(...);
}

// Get stats
const stats = await api.get(`/whatsapp-accounts/${accountId}/stats`);
console.log('Messages remaining:', stats.data.messagesRemaining);
```

## Quality Rating

WhatsApp monitors your message quality based on:
- User blocks
- User reports
- Message delivery failures

### Quality Levels
- **GREEN**: Good quality, no restrictions
- **YELLOW**: Medium quality, may face restrictions
- **RED**: Poor quality, severe restrictions

### Monitoring
Check quality rating in:
- Integrations page (badge on each account)
- Account stats endpoint
- Sync account to get latest rating

## Messaging Limit Tiers

Your daily message limit increases based on quality:
- **Tier 1**: 1,000 messages/day
- **Tier 2**: 10,000 messages/day
- **Tier 3**: 100,000 messages/day
- **Tier 4**: Unlimited

Tiers increase automatically based on:
- Message quality
- Business verification
- Usage patterns

## Webhook Events

The system handles these webhook events:

### Message Received
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "1234567890",
          "id": "wamid.xxx",
          "timestamp": "1234567890",
          "type": "text",
          "text": {
            "body": "Hello"
          }
        }]
      }
    }]
  }]
}
```

### Message Status Update
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "statuses": [{
          "id": "wamid.xxx",
          "status": "delivered",
          "timestamp": "1234567890",
          "recipient_id": "1234567890"
        }]
      }
    }]
  }]
}
```

## Security Best Practices

### Access Token Security
- ✅ Never commit tokens to version control
- ✅ Use environment variables
- ✅ Rotate tokens regularly
- ✅ Use System User tokens for production
- ✅ Store tokens encrypted in database

### Webhook Security
- ✅ Verify webhook signatures
- ✅ Use HTTPS only
- ✅ Validate verify token
- ✅ Rate limit webhook endpoints
- ✅ Log all webhook events

### API Security
- ✅ Authenticate all requests
- ✅ Validate phone numbers
- ✅ Sanitize user input
- ✅ Implement rate limiting
- ✅ Monitor for abuse

## Troubleshooting

### Common Issues

#### 1. Webhook Verification Failed
- Ensure your server is publicly accessible via HTTPS
- Check verify token matches exactly
- Verify callback URL is correct
- Check server logs for verification requests

#### 2. Messages Not Sending
- Check account status (active/inactive)
- Verify rate limits not exceeded
- Ensure phone number format is correct (+country code)
- Check access token is valid
- Review quality rating

#### 3. Template Not Found
- Sync templates from Meta
- Ensure template is approved
- Check template name spelling
- Verify language code

#### 4. Rate Limit Exceeded
- Check daily message count
- Wait for daily reset
- Upgrade messaging tier
- Use multiple accounts

### Debug Mode

Enable detailed logging:

```typescript
// In backend/.env
LOG_LEVEL=debug
```

Check logs:
```bash
tail -f backend/logs/combined.log
```

## Production Checklist

- [ ] Use permanent access tokens (System User)
- [ ] Configure HTTPS for webhooks
- [ ] Set up monitoring and alerts
- [ ] Implement error handling
- [ ] Configure rate limiting
- [ ] Set up backup accounts
- [ ] Test all message types
- [ ] Verify webhook handling
- [ ] Monitor quality rating
- [ ] Set up log rotation
- [ ] Configure database backups
- [ ] Test failover scenarios
- [ ] Document runbooks
- [ ] Train support team

## Support

### Meta Resources
- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Meta for Developers](https://developers.facebook.com/)
- [WhatsApp Business Platform](https://business.whatsapp.com/)

### Common Links
- [API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api/reference)
- [Webhooks Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)
- [Error Codes](https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes)

## License

This integration is part of your WhatsApp Business Platform application and subject to Meta's terms of service.
