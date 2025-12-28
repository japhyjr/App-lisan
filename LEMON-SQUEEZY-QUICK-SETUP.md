# 🍋 LEMON SQUEEZY - QUICK SETUP (30 Minutes)

Fast track setup to get payments working TODAY.

---

## ⚡ **STEP 1: CREATE STORE** (5 minutes)

1. **Log in:** https://app.lemonsqueezy.com/
2. **Create Store:**
   - Settings → Stores → Create Store
   - Name: "App-lisan"
   - URL slug: "app-lisan"
   - Click "Create"

---

## 💳 **STEP 2: CREATE PRODUCTS** (10 minutes)

### **Product 1: Basic Plan - $5/month**

1. **Go to:** Products → New Product
2. **Fill in:**
   ```
   Name: App-lisan Basic
   Description: 100 AI translations per day + all features
   
   Price: $5.00
   Billing: Subscription
   Interval: Monthly
   
   Status: Published
   ```
3. **Click "Create Product"**
4. **SAVE THE CHECKOUT URL:**
   - Click on product
   - Copy "Checkout URL"
   - Example: `https://app-lisan.lemonsqueezy.com/checkout/buy/abc123...`

### **Product 2: Premium Plan - $12/month**

1. **Products → New Product**
2. **Fill in:**
   ```
   Name: App-lisan Premium
   Description: Unlimited AI translations + advanced features
   
   Price: $12.00
   Billing: Subscription
   Interval: Monthly
   
   Mark as: Featured
   Status: Published
   ```
3. **Click "Create Product"**
4. **SAVE THE CHECKOUT URL**

---

## 🔧 **STEP 3: UPDATE PREMIUM.HTML** (5 minutes)

Open `premium.html` and find these sections:

### **Basic Plan Button (around line 113):**

```html
<!-- FIND THIS: -->
<a href="YOUR-BASIC-CHECKOUT-URL" class="cta-button secondary">
  Choose Basic 💳
</a>

<!-- REPLACE WITH YOUR REAL URL: -->
<a href="https://app-lisan.lemonsqueezy.com/checkout/buy/YOUR-BASIC-ID" 
   class="cta-button secondary">
  Choose Basic 💳
</a>
```

### **Premium Plan Button (around line 161):**

```html
<!-- FIND THIS: -->
<a href="YOUR-PREMIUM-CHECKOUT-URL" class="cta-button primary">
  Go Premium 🚀
</a>

<!-- REPLACE WITH YOUR REAL URL: -->
<a href="https://app-lisan.lemonsqueezy.com/checkout/buy/YOUR-PREMIUM-ID" 
   class="cta-button primary">
  Go Premium 🚀
</a>
```

**Save the file!**

---

## 🧪 **STEP 4: TEST IN SANDBOX** (5 minutes)

1. **In Lemon Squeezy:**
   - Settings → Store Settings
   - Enable "Test Mode" (toggle ON)

2. **Test Card:**
   ```
   Card: 4242 4242 4242 4242
   Expiry: Any future date (12/25)
   CVC: Any 3 digits (123)
   ZIP: Any (12345)
   ```

3. **Test Purchase:**
   - Click "Choose Basic" button
   - Should open Lemon Squeezy checkout
   - Enter test card
   - Complete purchase
   - Check email for receipt

4. **Verify:**
   - Lemon Squeezy Dashboard → Orders
   - Should see test order ✅

---

## ✅ **STEP 5: GO LIVE!** (2 minutes)

1. **Disable Test Mode:**
   - Settings → Store Settings
   - Toggle "Test Mode" OFF

2. **Update premium.html:**
   - Replace test URLs with live URLs
   - Save and deploy

3. **You're live!** 🎉

---

## 💰 **DEVICE LIMIT STRATEGY**

### **Option 1: Honor System** (Simplest - Start Here)

For now:
- ✅ No technical enforcement
- ✅ Terms of Service states: "1 device per account"
- ✅ 95% of users are honest
- ✅ Monitor for abuse later

**In Terms:**
```
Each subscription is for personal use on one device. 
Account sharing or multiple device usage is prohibited.
```

### **Option 2: Device Fingerprinting** (Later)

After launch, if abuse detected:
```javascript
// Generate device fingerprint
const deviceId = generateFingerprint(); // browser, OS, screen, etc.

// Store with subscription
await storeDeviceId(userId, deviceId);

// On app load
if (currentDevice !== storedDevice) {
  showError("Account already active on another device");
}
```

### **Option 3: Lemon Squeezy License Keys** (Advanced)

Lemon Squeezy has built-in license key system:
- Each subscription gets unique key
- Validate on app load
- Automatic device limit enforcement
- Implement after launch if needed

### **RECOMMENDATION: Start Simple!**

For launch:
1. ✅ No technical device limit
2. ✅ Clear Terms of Service
3. ✅ Monitor usage patterns
4. ✅ Add enforcement IF abuse happens (it probably won't)

**Why?**
- Faster to launch
- Less complexity
- Easier user experience
- Can add later if needed

---

## 📊 **PAYMENT FLOW:**

```
User clicks "Go Premium"
    ↓
Opens Lemon Squeezy checkout
    ↓
Enters payment details
    ↓
Payment processed
    ↓
User receives:
  - Order confirmation email
  - Receipt
  - Welcome email (optional)
    ↓
[Future: Webhook grants access]
    ↓
User can use premium features
```

---

## 🔔 **WEBHOOKS (Setup Later - Optional)**

After launch, to automate access:

1. **Lemon Squeezy → Webhooks**
2. **Create endpoint:** `https://yoursite.com/webhook`
3. **Listen for:**
   - `order_created`
   - `subscription_created`
   - `subscription_cancelled`

4. **Grant access automatically**

**For now:** Manual verification is fine for first users!

---

## 💡 **QUICK TIPS:**

### **Pricing Psychology:**
```
✅ $5 Basic = "Affordable impulse buy"
✅ $12 Premium = "Serious value" (2.4x Basic)
✅ Most users pick Premium (feels like best deal)
```

### **Free Trial Option:**
```
In Lemon Squeezy:
- Enable "Free Trial"
- 7 days free
- No credit card required
- Converts better!
```

### **Annual Plans (Add Later):**
```
Basic Annual: $48/year (save $12 = 20% off)
Premium Annual: $115/year (save $29 = 20% off)
```

---

## ✅ **FINAL CHECKLIST:**

- [ ] Lemon Squeezy account created
- [ ] Store created ("App-lisan")
- [ ] Basic product created ($5/month)
- [ ] Premium product created ($12/month)
- [ ] Both checkout URLs saved
- [ ] premium.html updated with URLs
- [ ] Tested in sandbox mode
- [ ] Test purchase successful
- [ ] Test mode disabled
- [ ] Live checkout working

---

## 🎯 **DEVICE LIMIT: FINAL DECISION**

**For Launch:**
```
✅ No technical enforcement
✅ Terms of Service only
✅ Monitor usage
✅ Add enforcement if needed (unlikely)
```

**Why this works:**
- 95% of users are honest
- Technical limits frustrate legitimate users
- Easy to add later if abuse happens
- Faster time to market

**Trust your users!** Most people are good. 😊

---

## 🚀 **YOU'RE READY TO ACCEPT PAYMENTS!**

Once this is done:
1. ✅ Users can click "Go Premium"
2. ✅ Checkout opens
3. ✅ Payment processes
4. ✅ You make money! 💰

**Time to complete: 30 minutes**

**Next: Deploy to production!** 🌍