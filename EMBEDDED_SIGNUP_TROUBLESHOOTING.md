# WhatsApp Embedded Signup - Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Nothing Happens When Clicking Button

#### Symptoms
- Click "Quick Connect" button
- No popup appears
- No error message
- Button just stays disabled or does nothing

#### Solutions

**Check 1: Verify Environment Variables**

Frontend (`.env.local`):
```env
NEXT_PUBLIC_META_APP_ID=your-app-id-here
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Backend (`backend/.env`):
```env
META_APP_ID=your-app-id-here
META_APP_SECRET=your-app-secret-here
META_CONFIG_ID=your-config-id-here
APP_URL=http://localhost:3000
```

**Check 2: Verify App ID Format**
- App ID should be numbers only (e.g., `123456789012345`)
- No quotes, no spaces
- Must match exactly in both frontend and backend

**Check 3: Enable Debug Mode**

The component now has debug mode enabled. Check:
1. Open browser console (F12)
2. Look for `[WhatsApp Signup]` messages
3. Check the debug panel in bottom-right corner

**Check 4: Check Browser Console**

Look for these errors:
- `Failed to load Facebook SDK` - Network issue
- `NEXT_PUBLIC_META_APP_ID not found` - Environment variable missing
- `Config load error` - Backend not running or wrong URL

**Check 5: Verify Backend is Running**

```bash
cd backend
npm run dev
```

Should see: `Server running on port 5000`

**Check 6: Test API Endpoint**

```bash
curl http://localhost:5000/api/v1/meta-embedded-signup/config \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Should return:
```json
{
  "success": true,
  "data": {
    "appId": "123456789",
    "configId": "987654321",
    "redirectUri": "...",
    "state": "..."
  }
}
```

### Issue 2: Popup Blocked

#### Symptoms
- Browser shows "Popup blocked" notification
- No Meta login window appears

#### Solutions

1. **Allow Popups**
   - Click the popup blocked icon in address bar
   - Select "Always allow popups from this site"
   - Try again

2. **Check Browser Settings**
   - Chrome: Settings > Privacy > Site Settings > Popups
   - Firefox: Preferences > Privacy > Permissions > Block pop-up windows
   - Safari: Preferences > Websites > Pop-up Windows

3. **Disable Popup Blockers**
   - Temporarily disable browser extensions
   - Try in incognito/private mode

### Issue 3: "Config ID is missing" Error

#### Symptoms
- Error: "Meta Config ID is missing"
- Button disabled

#### Solutions

1. **Create Embedded Signup Configuration**
   - Go to Meta for Developers
   - Navigate to WhatsApp > Configuration
   - Scroll to "Embedded signup"
   - Click "Create configuration"
   - Copy the Configuration ID

2. **Add to Environment Variables**
   ```env
   META_CONFIG_ID=your-config-id-here
   ```

3. **Restart Backend**
   ```bash
   cd backend
   npm run dev
   ```

### Issue 4: "Authorization cancelled or failed"

#### Symptoms
- Popup opens but closes immediately
- Error: "Authorization cancelled or failed"

#### Solutions

1. **Check App Status**
   - Go to Meta for Developers
   - Check if app is in "Live" mode
   - If in "Development", add test users

2. **Verify Permissions**
   - Ensure these permissions are enabled:
     - `whatsapp_business_management`
     - `whatsapp_business_messaging`

3. **Check OAuth Redirect URIs**
   - Go to WhatsApp > Configuration
   - Under "OAuth Redirect URIs", add:
     - `http://localhost:3000/integrations/callback`
     - `https://your-domain.com/integrations/callback`

4. **Verify App Domains**
   - Go to Settings > Basic
   - Add your domain to "App Domains"

### Issue 5: "No authorization code received"

#### Symptoms
- Popup completes but no code
- Error: "No authorization code received from Meta"

#### Solutions

1. **Check Response Type**
   - Verify `response_type: 'code'` in FB.login call
   - Check `override_default_response_type: true`

2. **Verify Configuration**
   - Ensure Embedded Signup config is active
   - Check config ID matches

3. **Check Browser Console**
   - Look for FB.login response
   - Verify authResponse exists

### Issue 6: "Failed to exchange authorization code"

#### Symptoms
- Code received but exchange fails
- 400 or 500 error from backend

#### Solutions

1. **Verify App Secret**
   ```env
   META_APP_SECRET=your-app-secret-here
   ```
   - Must be exact match from Meta
   - No extra spaces or quotes

2. **Check API Endpoint**
   ```bash
   # Test token exchange
   curl -X POST http://localhost:5000/api/v1/meta-embedded-signup/exchange-token \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"code":"test-code"}'
   ```

3. **Check Backend Logs**
   ```bash
   tail -f backend/logs/combined.log
   ```

### Issue 7: "No phone numbers found"

#### Symptoms
- Authorization succeeds
- Error: "No phone numbers found in this WhatsApp Business Account"

#### Solutions

1. **Add Phone Number**
   - Go to Meta Business Suite
   - Navigate to WhatsApp Accounts
   - Add a phone number to your WABA

2. **Verify Phone Number Status**
   - Phone must be verified
   - Phone must be active
   - Check in Meta Business Manager

3. **Check Permissions**
   - Ensure app has access to phone numbers
   - Verify WABA permissions

### Issue 8: CORS Errors

#### Symptoms
- Network errors in console
- "CORS policy" errors
- API calls fail

#### Solutions

1. **Check Backend CORS Configuration**
   ```typescript
   // backend/src/server.ts
   app.use(cors({
     origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
     credentials: true
   }));
   ```

2. **Verify CORS_ORIGIN**
   ```env
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Check API URL**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

### Issue 9: Authentication Errors

#### Symptoms
- 401 Unauthorized errors
- "Authentication required" messages

#### Solutions

1. **Verify JWT Token**
   - Check localStorage for `accessToken`
   - Verify token is valid
   - Try logging in again

2. **Check Auth Middleware**
   - Ensure `/meta-embedded-signup/*` routes use `protect` middleware
   - Verify JWT_SECRET matches

3. **Test Authentication**
   ```bash
   # Get token
   curl -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

## Debug Mode

### Enable Debug Mode

The component now has debug mode enabled by default. You'll see:

1. **Debug Panel** (bottom-right corner)
   - Real-time log of all actions
   - Timestamps for each event
   - Error messages with details

2. **Console Logs**
   - All logs prefixed with `[WhatsApp Signup]`
   - Detailed information about each step

3. **Button States**
   - Shows "Loading SDK..." while SDK loads
   - Shows "Loading..." while config loads
   - Disabled until ready

### Reading Debug Logs

Example debug log:
```
10:30:45: Component mounted
10:30:45: Loading config from backend...
10:30:46: Config loaded: App ID 123456789, Config ID 987654321
10:30:46: Loading Facebook SDK...
10:30:47: Facebook SDK script loaded
10:30:47: Initializing FB SDK with App ID: 123456789
10:30:47: Facebook SDK initialized successfully
10:30:50: Launch button clicked
10:30:50: Launching FB.login with config_id: 987654321
10:30:51: FB.login called successfully
```

## Testing Checklist

Before going live, test these scenarios:

- [ ] Button loads and becomes enabled
- [ ] Clicking button opens Meta popup
- [ ] Can log in to Facebook
- [ ] Can select WhatsApp Business Account
- [ ] Can grant permissions
- [ ] Phone selection works (if multiple)
- [ ] Account created successfully
- [ ] Webhook configured automatically
- [ ] Can send test message
- [ ] Error handling works
- [ ] Retry after error works

## Quick Diagnostic Commands

### Check Environment Variables
```bash
# Frontend
cat .env.local | grep META

# Backend
cat backend/.env | grep META
```

### Test Backend API
```bash
# Health check
curl http://localhost:5000/health

# Config endpoint (requires auth)
curl http://localhost:5000/api/v1/meta-embedded-signup/config \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Facebook SDK
```javascript
// In browser console
console.log(window.FB);
console.log(process.env.NEXT_PUBLIC_META_APP_ID);
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Click "Quick Connect"
4. Look for:
   - `sdk.js` - Facebook SDK
   - `config` - Backend config
   - `exchange-token` - Token exchange
   - `phone-numbers` - Phone list
   - `complete` - Final signup

## Still Having Issues?

### Collect Debug Information

1. **Browser Console Logs**
   - Copy all `[WhatsApp Signup]` messages
   - Include any error messages

2. **Network Tab**
   - Export HAR file
   - Check failed requests

3. **Backend Logs**
   ```bash
   cat backend/logs/combined.log | grep -i "meta\|whatsapp\|signup"
   ```

4. **Environment Variables**
   ```bash
   # Sanitize before sharing!
   env | grep -i "meta\|whatsapp" | sed 's/=.*/=***/'
   ```

### Contact Support

Include:
- Debug logs from component
- Browser console errors
- Backend logs
- Environment (OS, browser, Node version)
- Steps to reproduce

## Meta Resources

- [Embedded Signup Docs](https://developers.facebook.com/docs/whatsapp/embedded-signup)
- [Debug Tool](https://developers.facebook.com/tools/debug/)
- [App Dashboard](https://developers.facebook.com/apps/)
- [Support](https://developers.facebook.com/support/)

## Common Meta Errors

### Error 190: Invalid OAuth access token
- **Cause**: Token expired or invalid
- **Solution**: Generate new token

### Error 100: Invalid parameter
- **Cause**: Missing or wrong config_id
- **Solution**: Verify config ID

### Error 200: Permissions error
- **Cause**: Missing permissions
- **Solution**: Add required permissions to app

### Error 368: Temporarily blocked
- **Cause**: Too many requests
- **Solution**: Wait and try again

## Prevention Tips

1. **Always use HTTPS in production**
2. **Keep tokens secure**
3. **Monitor error rates**
4. **Test in development first**
5. **Have fallback to manual setup**
6. **Log all errors**
7. **Provide clear error messages**
8. **Allow users to retry**

## Success Indicators

You know it's working when:
- ✅ Button loads and enables
- ✅ Popup opens on click
- ✅ Can complete authorization
- ✅ Phone selection appears (if multiple)
- ✅ Success message shows
- ✅ Account appears in list
- ✅ Can send test message
- ✅ Webhook receives messages

If all these work, your embedded signup is configured correctly!
