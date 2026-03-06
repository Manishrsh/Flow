# WhatsApp Embedded Signup - Complete Guide

## Overview

The Embedded Signup flow provides a seamless, one-click experience for users to connect their WhatsApp Business accounts. Similar to "Sign in with Google" or "Connect with Facebook", users can authorize your app to access their WhatsApp Business Account without manually copying tokens.

## Features

✅ **One-Click Connection** - Users connect in seconds, not minutes
✅ **No Manual Token Management** - Tokens are exchanged automatically
✅ **Multi-Phone Support** - Automatically detects and lets users choose from multiple phone numbers
✅ **Secure OAuth Flow** - Uses Meta's official OAuth 2.0 implementation
✅ **Automatic Webhook Setup** - Webhooks are configured automatically
✅ **Beautiful UI** - Professional, responsive interface with loading states

## Setup Steps

### 1. Create Meta App with Embedded Signup

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add **WhatsApp** product
4. Navigate to **WhatsApp > Configuration**
5. Scroll to **Embedded signup**
6. Click **Create configuration**

### 2. Configure Embedded Signup

In the Embedded Signup configuration:

1. **Configuration Name**: Give it a descriptive name (e.g., "Production Signup")
2. **Callback URL**: `https://your-domain.com/integrations/callback`
3. **Verify Token**: Generate a secure random string
4. **Webhook Fields**: Select:
   - ✅ messages
   - ✅ message_status
5. **Permissions**: Ensure these are selected:
   - ✅ whatsapp_business_management
   - ✅ whatsapp_business_messaging
6. Save and copy the **Configuration ID**

### 3. Update Environment Variables

Add to `backend/.env`:

```env
# Meta App Configuration
META_APP_ID=your-app-id-here
META_APP_SECRET=your-app-secret-here
META_CONFIG_ID=your-config-id-here
APP_URL=https://your-domain.com
```

Add to `.env.local` (frontend):

```env
NEXT_PUBLIC_META_APP_ID=your-app-id-here
NEXT_PUBLIC_API_URL=https://your-domain.com/api/v1
```

### 4. Configure App Settings

In Meta for Developers:

1. Go to **Settings > Basic**
2. Add **App Domains**: `your-domain.com`
3. Add **Privacy Policy URL**
4. Add **Terms of Service URL**
5. Add **Website URL**: `https://your-domain.com`

### 5. Set Up OAuth Redirect URIs

1. Go to **WhatsApp > Configuration**
2. Under **OAuth Redirect URIs**, add:
   - `https://your-domain.com/integrations/callback`
   - `http://localhost:3000/integrations/callback` (for development)

### 6. Make App Live

1. Complete App Review if required
2. Switch app from Development to Live mode
3. Verify all settings are correct

## Usage

### Quick Connect Button

The simplest way to use embedded signup:

```tsx
import WhatsAppEmbeddedSignup from '@/components/WhatsAppEmbeddedSignup';

<WhatsAppEmbeddedSignup
  onSuccess={(account) => {
    console.log('Connected:', account);
    // Refresh your accounts list
  }}
  onError={(error) => {
    console.error('Connection failed:', error);
  }}
/>
```

### Custom Button

With custom styling:

```tsx
<WhatsAppEmbeddedSignup
  buttonText="Connect My WhatsApp"
  buttonClassName="custom-button-class"
  onSuccess={handleSuccess}
  onError={handleError}
/>
```

### In Signup Flow

Add to your registration page:

```tsx
export default function SignupPage() {
  const handleWhatsAppConnected = (account) => {
    // User registered and connected WhatsApp
    // Redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <div>
      {/* Regular signup form */}
      <SignupForm onSuccess={handleSignupSuccess} />
      
      {/* Optional WhatsApp connection */}
      <div className="mt-6">
        <p className="text-center mb-4">
          Connect WhatsApp to get started faster
        </p>
        <WhatsAppEmbeddedSignup
          onSuccess={handleWhatsAppConnected}
        />
      </div>
    </div>
  );
}
```

## User Flow

### Step 1: User Clicks "Connect WhatsApp"
- Facebook SDK loads
- Embedded signup modal opens

### Step 2: Meta Authorization
- User logs in to Facebook (if not already)
- User selects WhatsApp Business Account
- User grants permissions

### Step 3: Phone Selection (if multiple)
- System fetches available phone numbers
- User selects which phone to connect
- Shows quality rating and verification status

### Step 4: Completion
- System exchanges code for access token
- Creates WhatsApp account in database
- Registers webhook automatically
- Shows success message

## API Endpoints

### Get Configuration

```typescript
GET /api/v1/meta-embedded-signup/config

Response:
{
  "success": true,
  "data": {
    "appId": "123456789",
    "configId": "987654321",
    "redirectUri": "https://your-domain.com/integrations/callback",
    "state": "user-id"
  }
}
```

### Exchange Token

```typescript
POST /api/v1/meta-embedded-signup/exchange-token
Body: {
  "code": "authorization-code-from-meta"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "EAAxxxxx...",
    "wabaId": "123456789",
    "expiresIn": 1234567890
  }
}
```

### Get Phone Numbers

```typescript
POST /api/v1/meta-embedded-signup/phone-numbers
Body: {
  "wabaId": "123456789",
  "accessToken": "EAAxxxxx..."
}

Response:
{
  "success": true,
  "data": [
    {
      "id": "phone-number-id",
      "displayPhoneNumber": "+1234567890",
      "verifiedName": "My Business",
      "qualityRating": "GREEN",
      "codeVerificationStatus": "VERIFIED"
    }
  ]
}
```

### Complete Signup

```typescript
POST /api/v1/meta-embedded-signup/complete
Body: {
  "accessToken": "EAAxxxxx...",
  "wabaId": "123456789",
  "phoneNumberId": "phone-id",
  "name": "My Business Account"
}

Response:
{
  "success": true,
  "data": {
    "_id": "account-id",
    "name": "My Business Account",
    "phoneNumber": "+1234567890",
    "status": "active",
    ...
  },
  "webhookUrl": "https://your-domain.com/api/v1/webhooks/whatsapp/account-id",
  "webhookVerifyToken": "verify-token"
}
```

## Component Props

### WhatsAppEmbeddedSignup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSuccess` | `(account: any) => void` | - | Called when connection succeeds |
| `onError` | `(error: string) => void` | - | Called when connection fails |
| `buttonText` | `string` | "Connect WhatsApp Business" | Button label |
| `buttonClassName` | `string` | - | Custom CSS classes for button |

## States

The component manages these states:

- **idle**: Initial state, button ready
- **loading**: SDK loading or authorization in progress
- **selecting**: Multiple phones available, user choosing
- **completing**: Finalizing setup
- **success**: Connection successful
- **error**: Connection failed

## Error Handling

Common errors and solutions:

### "SDK not loaded yet"
- **Cause**: Facebook SDK hasn't loaded
- **Solution**: Wait a moment and try again

### "Authorization cancelled"
- **Cause**: User closed the popup
- **Solution**: User can try again

### "No phone numbers found"
- **Cause**: WABA has no phone numbers
- **Solution**: Add phone number in Meta Business Suite

### "This WhatsApp account is already connected"
- **Cause**: Phone number already in use
- **Solution**: Use different phone or disconnect existing

### "Failed to exchange authorization code"
- **Cause**: Invalid code or expired
- **Solution**: Try connecting again

## Security Considerations

### Token Storage
- ✅ Access tokens stored encrypted in database
- ✅ Tokens never exposed in API responses
- ✅ Tokens only accessible by account owner

### OAuth Security
- ✅ State parameter prevents CSRF
- ✅ Code exchange happens server-side
- ✅ Short-lived authorization codes
- ✅ HTTPS required for production

### Webhook Security
- ✅ Unique verify token per account
- ✅ Signature verification
- ✅ HTTPS only
- ✅ Rate limiting

## Testing

### Development Testing

1. Use test phone numbers from Meta
2. Test with development app
3. Use localhost with ngrok for webhooks

```bash
# Start ngrok
ngrok http 5000

# Update APP_URL in .env
APP_URL=https://your-ngrok-url.ngrok.io
```

### Production Testing

1. Use real phone numbers
2. Test with live app
3. Verify webhook delivery
4. Test all message types

## Troubleshooting

### Popup Blocked
- **Issue**: Browser blocks popup
- **Solution**: Allow popups for your domain

### Redirect Loop
- **Issue**: Infinite redirects
- **Solution**: Check redirect URI configuration

### Token Exchange Fails
- **Issue**: 400 error on token exchange
- **Solution**: Verify app ID and secret

### Webhook Not Working
- **Issue**: Messages not received
- **Solution**: Check webhook URL is publicly accessible

## Best Practices

### User Experience
- ✅ Show loading states
- ✅ Provide clear error messages
- ✅ Allow retry on failure
- ✅ Confirm successful connection

### Performance
- ✅ Load SDK asynchronously
- ✅ Cache configuration
- ✅ Minimize API calls
- ✅ Use optimistic UI updates

### Security
- ✅ Validate all inputs
- ✅ Use HTTPS in production
- ✅ Rotate tokens regularly
- ✅ Monitor for suspicious activity

## Migration from Manual Setup

If you have existing manual setup users:

1. Keep manual setup option available
2. Encourage embedded signup for new users
3. Allow users to reconnect via embedded signup
4. Migrate tokens gradually

## Support

### Meta Resources
- [Embedded Signup Documentation](https://developers.facebook.com/docs/whatsapp/embedded-signup)
- [OAuth Documentation](https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow)
- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)

### Common Issues
- Check Meta for Developers status page
- Review app logs for errors
- Test with Meta's debug tools
- Contact Meta support if needed

## Conclusion

Embedded Signup provides the best user experience for connecting WhatsApp Business accounts. It's secure, fast, and professional. Users can connect in seconds instead of minutes, reducing friction and improving conversion rates.

For manual setup instructions, see `WHATSAPP_CLOUD_API_SETUP.md`.
