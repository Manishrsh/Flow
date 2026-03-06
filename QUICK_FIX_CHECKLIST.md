# Quick Fix Checklist - Embedded Signup Not Working

## ✅ Step-by-Step Fix

### Step 1: Check Environment Variables (Frontend)

Create or update `.env.local` in your project root:

```env
NEXT_PUBLIC_META_APP_ID=123456789012345
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**Important:**
- Replace `123456789012345` with your actual Meta App ID
- No quotes around the values
- Must start with `NEXT_PUBLIC_` for Next.js

**Verify:**
```bash
cat .env.local
```

### Step 2: Check Environment Variables (Backend)

Update `backend/.env`:

```env
META_APP_ID=123456789012345
META_APP_SECRET=your-app-secret-here
META_CONFIG_ID=987654321
APP_URL=http://localhost:3000
```

**Important:**
- App ID must match frontend
- Get App Secret from Meta for Developers > Settings > Basic
- Get Config ID from WhatsApp > Configuration > Embedded Signup
- APP_URL should be your frontend URL

**Verify:**
```bash
cat backend/.env | grep META
```

### Step 3: Restart Everything

```bash
# Stop all running processes (Ctrl+C)

# Restart backend
cd backend
npm run dev

# In new terminal, restart frontend
npm run dev
```

### Step 4: Run Configuration Test

1. Go to: `http://localhost:3000/test-embedded-signup`
2. Click "Run Configuration Tests"
3. Check all tests pass (green checkmarks)
4. Fix any errors shown

### Step 5: Test the Button

1. Go to: `http://localhost:3000/integrations`
2. Look for "Quick Connect" button
3. Check button state:
   - ❌ "Loading SDK..." - Wait a few seconds
   - ❌ "Loading..." - Check backend is running
   - ✅ "Quick Connect" - Ready to click!

4. Click the button
5. Check debug panel (bottom-right corner)
6. Look for errors in browser console (F12)

## 🔍 Common Issues

### Issue: Button says "Loading SDK..."

**Cause:** Facebook SDK not loading

**Fix:**
1. Check internet connection
2. Disable ad blockers
3. Try different browser
4. Check browser console for errors

### Issue: Button says "Loading..."

**Cause:** Backend not responding

**Fix:**
```bash
# Check backend is running
curl http://localhost:5000/health

# If not running, start it
cd backend
npm run dev
```

### Issue: "Config ID is missing"

**Cause:** META_CONFIG_ID not set

**Fix:**
1. Go to Meta for Developers
2. WhatsApp > Configuration
3. Scroll to "Embedded signup"
4. Click "Create configuration" if none exists
5. Copy the Configuration ID
6. Add to `backend/.env`:
   ```env
   META_CONFIG_ID=your-config-id-here
   ```
7. Restart backend

### Issue: Nothing happens when clicking

**Cause:** Multiple possible issues

**Fix:**
1. Open browser console (F12)
2. Look for red errors
3. Check debug panel (bottom-right)
4. Common errors:
   - "NEXT_PUBLIC_META_APP_ID not found" → Add to .env.local
   - "Failed to load config" → Check backend is running
   - "Popup blocked" → Allow popups for localhost

### Issue: Popup blocked

**Cause:** Browser blocking popups

**Fix:**
1. Look for popup blocked icon in address bar
2. Click it and select "Always allow"
3. Or go to browser settings:
   - Chrome: Settings > Privacy > Site Settings > Popups
   - Allow popups from localhost

### Issue: "Authorization cancelled"

**Cause:** Meta popup closed or failed

**Fix:**
1. Check app is in correct mode:
   - Development: Add test users
   - Live: Complete app review
2. Verify permissions enabled:
   - whatsapp_business_management
   - whatsapp_business_messaging
3. Check OAuth redirect URIs:
   - Add `http://localhost:3000/integrations/callback`

## 📋 Verification Checklist

Before testing, verify:

- [ ] `.env.local` exists with NEXT_PUBLIC_META_APP_ID
- [ ] `backend/.env` has META_APP_ID, META_APP_SECRET, META_CONFIG_ID
- [ ] App IDs match in frontend and backend
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] You're logged in (have JWT token)
- [ ] Browser allows popups
- [ ] Internet connection working
- [ ] No ad blockers interfering

## 🧪 Test Commands

### Test Backend Health
```bash
curl http://localhost:5000/health
```
Expected: `{"status":"ok"}`

### Test Config Endpoint
```bash
# Get your JWT token first by logging in
# Then:
curl http://localhost:5000/api/v1/meta-embedded-signup/config \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
Expected: JSON with appId and configId

### Check Environment Variables
```bash
# Frontend
echo $NEXT_PUBLIC_META_APP_ID

# Backend
cd backend
node -e "require('dotenv').config(); console.log(process.env.META_APP_ID)"
```

## 🎯 Quick Debug

### Enable Debug Mode

Debug mode is already enabled! Look for:

1. **Debug Panel** (bottom-right corner)
   - Shows real-time logs
   - Click "Clear" to reset

2. **Browser Console** (F12)
   - Look for `[WhatsApp Signup]` messages
   - Red errors indicate problems

3. **Network Tab** (F12 > Network)
   - Check for failed requests
   - Look for 404, 500 errors

### Read Debug Logs

Example of working flow:
```
10:30:45: Component mounted
10:30:45: Loading config from backend...
10:30:46: Config loaded: App ID 123456789, Config ID 987654321
10:30:46: Loading Facebook SDK...
10:30:47: Facebook SDK initialized successfully
10:30:50: Launch button clicked
10:30:50: Launching FB.login with config_id: 987654321
```

If you see errors, they'll be marked with "ERROR:"

## 🆘 Still Not Working?

### Collect Information

1. **Environment Variables**
   ```bash
   # Frontend (sanitized)
   cat .env.local | sed 's/=.*/=***/'
   
   # Backend (sanitized)
   cat backend/.env | grep META | sed 's/=.*/=***/'
   ```

2. **Debug Logs**
   - Copy from debug panel
   - Copy from browser console

3. **Network Errors**
   - F12 > Network tab
   - Look for red/failed requests
   - Check response details

4. **Backend Logs**
   ```bash
   cat backend/logs/combined.log | tail -50
   ```

### Get Help

Include in your support request:
- Debug logs from component
- Browser console errors
- Backend logs
- Environment (OS, browser, Node version)
- Steps you've tried

## 📚 Documentation

- **Detailed Setup**: `EMBEDDED_SIGNUP_GUIDE.md`
- **Troubleshooting**: `EMBEDDED_SIGNUP_TROUBLESHOOTING.md`
- **Summary**: `EMBEDDED_SIGNUP_SUMMARY.md`

## ✨ Success Indicators

You know it's working when:

1. ✅ Button shows "Quick Connect" (not "Loading...")
2. ✅ Clicking opens Meta popup
3. ✅ Can complete authorization
4. ✅ Success message appears
5. ✅ Account shows in integrations list

If all these work, congratulations! Your embedded signup is configured correctly! 🎉

## 🔄 Reset and Try Again

If nothing works, try a clean start:

```bash
# 1. Stop all processes
# Press Ctrl+C in all terminals

# 2. Clear environment
rm .env.local
rm backend/.env

# 3. Recreate environment files
# Copy from .env.example and fill in your values

# 4. Restart everything
cd backend
npm run dev

# New terminal
npm run dev

# 5. Test again
# Go to http://localhost:3000/test-embedded-signup
```

Good luck! 🚀
