# WhatsApp Integration Methods

Your application now supports **TWO ways** to connect WhatsApp Business accounts:

## 🚀 Method 1: Quick Connect (Embedded Signup) - RECOMMENDED

**Best for:** Fast setup, OAuth-like experience, automatic configuration

### How it works:
1. Click "Quick Connect" button on integrations page
2. Meta popup opens (similar to "Login with Facebook")
3. Select your WhatsApp Business Account
4. Select phone number (if multiple)
5. Done! Account is automatically configured

### Requirements:
- Meta App ID configured in environment variables
- Meta Config ID for embedded signup
- App Secret for token exchange

### Environment Variables:

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_META_APP_ID=your-app-id
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**Backend** (`backend/.env`):
```env
META_APP_ID=your-app-id
META_APP_SECRET=your-app-secret
META_CONFIG_ID=your-config-id
APP_URL=http://localhost:3000
```

### Setup Meta Embedded Signup:
1. Go to [Meta for Developers](https://developers.facebook.com)
2. Select your app
3. Go to WhatsApp > Configuration
4. Scroll to "Embedded signup"
5. Click "Create configuration"
6. Copy the Configuration ID
7. Add to `backend/.env` as `META_CONFIG_ID`

### Advantages:
- ✅ Takes ~30 seconds
- ✅ No manual token copying
- ✅ Automatic webhook setup
- ✅ Professional user experience
- ✅ Handles token refresh automatically
- ✅ Multi-phone selection built-in

---

## 🔧 Method 2: Manual Setup

**Best for:** Advanced users, custom configurations, troubleshooting

### How it works:
1. Click "Manual Setup" button on integrations page
2. Fill in the form with your WhatsApp Business details
3. Configure webhook manually in Meta for Developers
4. Test the connection

### Required Information:
- **Account Name**: Friendly name for your account
- **Phone Number ID**: From Meta for Developers > WhatsApp > API Setup
- **Phone Number**: Your WhatsApp Business phone number (with country code)
- **Business Account ID**: From Meta for Developers > WhatsApp > API Setup
- **Access Token**: Generate a permanent token in Meta for Developers

### Step-by-Step Manual Setup:

#### Step 1: Get Your Credentials

1. Go to [Meta for Developers](https://developers.facebook.com)
2. Select your app (or create new one)
3. Add WhatsApp product if not already added
4. Go to WhatsApp > API Setup

**Copy these values:**
- Phone Number ID (15-digit number)
- WhatsApp Business Account ID (15-digit number)
- Temporary Access Token (starts with EAA...)

#### Step 2: Generate Permanent Token

**Option A: Using System User (Recommended for Production)**
1. Go to Business Settings > System Users
2. Create a new system user or select existing
3. Click "Generate New Token"
4. Select your app
5. Select permissions:
   - `whatsapp_business_management`
   - `whatsapp_business_messaging`
6. Copy the permanent token

**Option B: Using User Token (For Testing)**
1. Go to Meta for Developers > Tools > Access Token Tool
2. Select your app
3. Generate User Access Token
4. Add permissions: `whatsapp_business_management`, `whatsapp_business_messaging`
5. Copy the token (expires in 60 days)

#### Step 3: Add Account in Application

1. Go to your app: `http://localhost:3000/integrations`
2. Click "Manual Setup"
3. Fill in the form:
   ```
   Account Name: Main Business Account
   Phone Number ID: 123456789012345
   Phone Number: +1234567890
   Business Account ID: 987654321098765
   Access Token: EAAxxxxxxxxxxxxxxxxxx...
   ```
4. Check "Set as default account" if this is your primary account
5. Click "Add Account"

#### Step 4: Configure Webhook

After adding the account, you'll see webhook details. You need to configure these in Meta:

1. Copy the Webhook URL and Verify Token from the success message
2. Go to Meta for Developers > WhatsApp > Configuration
3. Click "Edit" in Webhook section
4. Paste your Callback URL
5. Paste your Verify Token
6. Click "Verify and Save"
7. Subscribe to webhook fields:
   - ✅ messages
   - ✅ message_status (optional but recommended)

#### Step 5: Test the Connection

1. In your app, find the account card
2. Click "Test" button
3. Enter a test phone number (with country code)
4. Click "Send Test"
5. Check your WhatsApp for the test message

### Advantages:
- ✅ Full control over configuration
- ✅ Works when embedded signup is not available
- ✅ Can use existing tokens
- ✅ Good for debugging
- ✅ No Meta app configuration needed initially

### Disadvantages:
- ❌ Takes 5-10 minutes
- ❌ Manual token management
- ❌ Manual webhook configuration
- ❌ Token expiration handling required
- ❌ More steps, more room for error

---

## 🆚 Comparison

| Feature | Quick Connect | Manual Setup |
|---------|--------------|--------------|
| Setup Time | ~30 seconds | 5-10 minutes |
| User Experience | Professional | Technical |
| Token Management | Automatic | Manual |
| Webhook Setup | Automatic | Manual |
| Multi-phone Support | Built-in | Manual |
| Token Refresh | Automatic | Manual |
| Error Handling | Built-in | Manual |
| Best For | Production | Development/Testing |

---

## 🐛 Troubleshooting

### Quick Connect Not Working?

1. **Check Environment Variables**
   ```bash
   # Frontend
   cat .env.local | grep META
   
   # Backend
   cat backend/.env | grep META
   ```

2. **Run Configuration Test**
   - Go to: `http://localhost:3000/test-embedded-signup`
   - Click "Run Configuration Tests"
   - Fix any errors shown

3. **Check Debug Panel**
   - Debug panel appears in bottom-right when using Quick Connect
   - Shows real-time logs of the signup process
   - Look for errors marked with "ERROR:"

4. **Common Issues:**
   - "Loading SDK..." stuck → Check internet connection, disable ad blockers
   - "Loading..." stuck → Backend not running or wrong API URL
   - "Config ID missing" → Add META_CONFIG_ID to backend/.env
   - Popup blocked → Allow popups for localhost in browser settings

### Manual Setup Not Working?

1. **Verify Credentials**
   - Phone Number ID is 15 digits
   - Business Account ID is 15 digits
   - Access Token starts with "EAA"
   - Phone number includes country code (+)

2. **Test Access Token**
   ```bash
   curl -X GET "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

3. **Check Webhook**
   - Server must be publicly accessible (use ngrok for local testing)
   - URL must be HTTPS
   - Verify token must match exactly

4. **Common Issues:**
   - "Invalid access token" → Token expired or wrong permissions
   - "Phone number not found" → Wrong Phone Number ID
   - "Webhook verification failed" → Wrong verify token or URL not accessible

---

## 📋 Quick Start Checklist

### For Quick Connect:
- [ ] Create Meta app at developers.facebook.com
- [ ] Add WhatsApp product
- [ ] Create embedded signup configuration
- [ ] Copy App ID, App Secret, Config ID
- [ ] Add to `.env.local` and `backend/.env`
- [ ] Restart frontend and backend
- [ ] Go to /integrations
- [ ] Click "Quick Connect"
- [ ] Complete authorization
- [ ] Done!

### For Manual Setup:
- [ ] Create Meta app at developers.facebook.com
- [ ] Add WhatsApp product
- [ ] Get Phone Number ID and Business Account ID
- [ ] Generate permanent access token
- [ ] Go to /integrations
- [ ] Click "Manual Setup"
- [ ] Fill in all fields
- [ ] Click "Add Account"
- [ ] Copy webhook URL and verify token
- [ ] Configure webhook in Meta for Developers
- [ ] Test the connection
- [ ] Done!

---

## 🎯 Recommendations

**For Production:**
- Use Quick Connect for end users
- Use Manual Setup for admin/support team
- Keep both options available
- Monitor token expiration
- Set up proper error logging

**For Development:**
- Start with Manual Setup to understand the flow
- Switch to Quick Connect once comfortable
- Use test phone numbers
- Enable debug mode
- Check logs frequently

**For Multiple Clients:**
- Quick Connect is ideal (each client can connect their own account)
- No need to share tokens
- Automatic multi-account management
- Better security (tokens never exposed to users)

---

## 🔐 Security Notes

### Quick Connect:
- Tokens are exchanged server-side
- No token exposure to frontend
- Automatic token refresh
- OAuth-like security model

### Manual Setup:
- Tokens are entered by user
- Store securely in database (encrypted)
- Implement token rotation
- Monitor for token expiration

---

## 📚 Additional Resources

- [Meta Embedded Signup Documentation](https://developers.facebook.com/docs/whatsapp/embedded-signup)
- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Access Token Best Practices](https://developers.facebook.com/docs/facebook-login/guides/access-tokens)

---

## ✅ Success Indicators

You know it's working when:

**Quick Connect:**
1. Button shows "Quick Connect" (not "Loading...")
2. Clicking opens Meta popup
3. Can complete authorization
4. Success message appears
5. Account shows in integrations list
6. Can send test message

**Manual Setup:**
1. Form accepts all values
2. Success message with webhook details
3. Account appears in list
4. Webhook verification succeeds in Meta
5. Can send test message
6. Messages are received

---

## 🆘 Still Having Issues?

1. Check `QUICK_FIX_CHECKLIST.md` for step-by-step troubleshooting
2. Check `EMBEDDED_SIGNUP_TROUBLESHOOTING.md` for detailed debugging
3. Run configuration test at `/test-embedded-signup`
4. Check browser console (F12) for errors
5. Check backend logs: `cat backend/logs/combined.log`
6. Enable debug mode in Quick Connect component

Good luck! 🚀
