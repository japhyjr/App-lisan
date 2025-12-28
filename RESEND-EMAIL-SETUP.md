# 📧 RESEND EMAIL SETUP - Complete Guide

Quick setup for email capture with Resend API (Free tier: 3,000 emails/month).

---

## 🚀 **STEP 1: CREATE RESEND ACCOUNT** (5 minutes)

1. **Go to:** https://resend.com/
2. **Sign up** with your email
3. **Verify email** (check inbox)
4. **Log in** to dashboard

---

## 🔑 **STEP 2: GET API KEY** (2 minutes)

1. **In Resend Dashboard:**
   - Click "API Keys" in sidebar
   - Click "Create API Key"
   - Name: "App-lisan Production"
   - Permission: "Sending access"
   - Click "Create"

2. **COPY THE KEY** (looks like: `re_xxxxxxxxxxxxx`)
   - ⚠️ **SAVE THIS!** You can't see it again!
   - Paste it somewhere safe temporarily

---

## 👥 **STEP 3: CREATE AUDIENCE** (3 minutes)

1. **In Resend Dashboard:**
   - Click "Audiences" in sidebar
   - Click "Create Audience"
   - Name: "App-lisan Waitlist"
   - Click "Create"

2. **COPY AUDIENCE ID** (looks like: `aud_xxxxxxxxxxxxx`)
   - Click on your audience name
   - Copy the ID from the URL or details
   - Save this too!

---

## 🔧 **STEP 4: UPDATE email-capture.js** (5 minutes)

Open your `email-capture.js` and update these lines:

```javascript
// FIND THIS (around line 13-18):
const EMAIL_CONFIG = {
  resend: {
    apiKey: 'YOUR_RESEND_API_KEY',        // ← PASTE YOUR API KEY HERE
    audienceId: 'YOUR_AUDIENCE_ID',       // ← PASTE YOUR AUDIENCE ID HERE
    endpoint: 'https://api.resend.com/audiences',
    enabled: false  // ← CHANGE TO: true
  },
```

**UPDATE TO:**
```javascript
const EMAIL_CONFIG = {
  resend: {
    apiKey: 're_your_actual_key_here',              // ← YOUR REAL KEY
    audienceId: 'aud_your_actual_audience_here',    // ← YOUR REAL ID
    endpoint: 'https://api.resend.com/audiences',
    enabled: true  // ← SET TO TRUE
  },
```

**Save the file!** (`Ctrl + S`)

---

## 🧪 **STEP 5: TEST LOCALLY** (5 minutes)

1. **Hard refresh:** `Ctrl + Shift + R`

2. **Go to landing page**

3. **Enter email in form**

4. **Click "Notify Me"**

5. **Check Resend Dashboard:**
   - Go to Audiences → Your audience
   - Should see the email appear! ✅

---

## ⚠️ **SECURITY: DON'T COMMIT API KEYS!**

### **Option A: Environment Variables (Recommended for Production)**

If deploying to Netlify/Vercel:

1. **Don't put API key in code!**

2. **In Netlify/Vercel Dashboard:**
   - Go to Site Settings
   - Environment Variables
   - Add:
     ```
     RESEND_API_KEY = re_your_key_here
     RESEND_AUDIENCE_ID = aud_your_id_here
     ```

3. **Update email-capture.js to read from env:**
   ```javascript
   const EMAIL_CONFIG = {
     resend: {
       apiKey: process.env.RESEND_API_KEY || '',
       audienceId: process.env.RESEND_AUDIENCE_ID || '',
       endpoint: 'https://api.resend.com/audiences',
       enabled: true
     },
   ```

### **Option B: Backend Proxy (Most Secure)**

Create a serverless function (Netlify/Vercel):

```javascript
// netlify/functions/subscribe.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);
  
  const response = await fetch(
    `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, unsubscribed: false })
    }
  );
  
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
```

Then call from frontend:
```javascript
await fetch('/.netlify/functions/subscribe', {
  method: 'POST',
  body: JSON.stringify({ email })
});
```

---

## 🎯 **FOR NOW (Quick Launch):**

### **Temporary Solution:**

1. Put API keys directly in `email-capture.js`
2. Add to `.gitignore`:
   ```
   email-capture.js
   ```
3. Keep a separate `email-capture.template.js` in Git
4. After launch, move to environment variables

---

## 📊 **WHAT HAPPENS WHEN USER SIGNS UP:**

```
User enters email on landing page
    ↓
Email saved to localStorage (always works)
    ↓
Email sent to Resend API
    ↓
Appears in your Resend Dashboard
    ↓
You can export CSV anytime
    ↓
Use for marketing emails later
```

---

## 📧 **MANAGING YOUR AUDIENCE:**

### **View Contacts:**
- Resend Dashboard → Audiences → App-lisan Waitlist
- See all emails collected

### **Export CSV:**
- Click "Export" button
- Download CSV file
- Import to email marketing tool

### **Send Campaigns (Later):**
Resend also lets you send bulk emails:
```javascript
// When you're ready to announce premium launch
await resend.emails.send({
  from: 'noreply@app-lisan.com',
  to: ['waitlist@audience.id'],
  subject: '🎉 App-lisan Premium is LIVE!',
  html: '<h1>Special launch pricing...</h1>'
});
```

---

## 🆓 **FREE TIER LIMITS:**

Resend Free Plan:
- ✅ 3,000 emails/month
- ✅ Unlimited contacts
- ✅ Email API
- ✅ Audience management

**More than enough for launch!**

---

## ✅ **QUICK CHECKLIST:**

- [ ] Resend account created
- [ ] API key obtained
- [ ] Audience created
- [ ] Audience ID obtained
- [ ] email-capture.js updated
- [ ] `enabled: true` set
- [ ] Tested locally
- [ ] Email appears in dashboard

---

## 🚀 **READY FOR PRODUCTION:**

Once tested locally:
1. ✅ Deploy with keys (temporary)
2. ✅ Test on live site
3. ✅ Move to environment variables (within 24 hours)
4. ✅ Start collecting emails!

---

**Time to complete: 15-20 minutes**

**Next: Lemon Squeezy payment setup!** 💰