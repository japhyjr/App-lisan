# 🍋 LEMON SQUEEZY INTEGRATION GUIDE

Complete step-by-step guide to integrate Lemon Squeezy payments into App-lisan.

---

## 📋 **PREREQUISITES**

- ✅ Lemon Squeezy account (you have this!)
- ✅ App-lisan deployed (GitHub Pages/Netlify)
- ✅ premium.html ready
- ⏱️ Time needed: 30 minutes

---

## 🚀 **STEP 1: LEMON SQUEEZY SETUP** (10 minutes)

### **A. Create Store**

1. **Log in to Lemon Squeezy:**
   ```
   https://app.lemonsqueezy.com/
   ```

2. **Create a Store:**
   - Go to Settings → Stores
   - Click "Create Store"
   - Store Name: "App-lisan"
   - Store URL: "app-lisan" (or your choice)
   - Click "Create"

3. **Store Settings:**
   - Add store logo (use your icon-512.png)
   - Add description: "Arabic learning app"
   - Set currency: USD
   - Save

---

### **B. Create Products**

#### **Product 1: Basic Plan**

```
Name: App-lisan Basic
Price: $5.00
Billing: Recurring (Monthly)
Description: 
  ✅ 100 AI translations per day
  ✅ All dictionary features
  ✅ Priority support
  ✅ Ad-free experience
```

**Steps:**
1. Go to Products → New Product
2. Fill in details above
3. Product Type: Subscription
4. Billing Interval: Monthly
5. Price: $5.00
6. Click "Create Product"
7. **COPY THE CHECKOUT URL** (looks like: `https://app-lisan.lemonsqueezy.com/checkout/buy/...`)

#### **Product 2: Premium Plan**

```
Name: App-lisan Premium
Price: $12.00
Billing: Recurring (Monthly)
Description:
  ✅ Unlimited AI translations
  ✅ AI conversation practice
  ✅ Pronunciation feedback
  ✅ Custom lesson plans
  ✅ API access
  ✅ Priority support
```

**Steps:**
1. Go to Products → New Product
2. Fill in details above
3. Product Type: Subscription
4. Billing Interval: Monthly
5. Price: $12.00
6. Mark as "Featured" or "Popular"
7. Click "Create Product"
8. **COPY THE CHECKOUT URL**

---

### **C. Get Your Checkout URLs**

After creating products, you'll have 2 URLs like:

```
Basic Plan:
https://app-lisan.lemonsqueezy.com/checkout/buy/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

Premium Plan:
https://app-lisan.lemonsqueezy.com/checkout/buy/YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY
```

**SAVE THESE URLS!** You'll need them in Step 2.

---

## 🔧 **STEP 2: UPDATE PREMIUM.HTML** (5 minutes)

### **Replace Button Actions:**

Open your `premium.html` and find these lines:

```html
<!-- OLD (Line ~113) -->
<button class="cta-button secondary" onclick="joinWaitlist('basic')">Join Waitlist 🔔</button>

<!-- REPLACE WITH -->
<a href="YOUR-BASIC-CHECKOUT-URL" class="cta-button secondary">
  Choose Basic 💳
</a>
```

```html
<!-- OLD (Line ~161) -->
<button class="cta-button primary" onclick="joinWaitlist('premium')">Join Waitlist 🔔</button>

<!-- REPLACE WITH -->
<a href="YOUR-PREMIUM-CHECKOUT-URL" class="cta-button primary">
  Go Premium 🚀
</a>
```

### **Complete Updated premium.html Section:**

Replace the pricing cards section with this:

```html
<!-- Basic Plan -->
<div class="pricing-card">
  <div class="plan-name">Basic</div>
  <div class="price">$5<span>/month</span></div>
  <div class="price-note">Great for casual learners</div>
  
  <ul class="features">
    <li><span class="check">✓</span> 100 AI translations/day</li>
    <li><span class="check">✓</span> Everything in Free</li>
    <li><span class="check">✓</span> Priority translation</li>
    <li><span class="check">✓</span> No ads</li>
    <li><span class="check">✓</span> Email support</li>
    <li><span class="cross">✗</span> Unlimited translations</li>
    <li><span class="cross">✗</span> Custom lessons</li>
    <li><span class="cross">✗</span> API access</li>
  </ul>
  
  <!-- LEMON SQUEEZY BUTTON -->
  <a href="https://app-lisan.lemonsqueezy.com/checkout/buy/YOUR-BASIC-PRODUCT-ID" 
     class="cta-button secondary">
    Choose Basic 💳
  </a>
</div>

<!-- Premium Plan (Featured) -->
<div class="pricing-card featured">
  <div class="badge">⭐ MOST POPULAR</div>
  <div class="plan-name">Premium</div>
  <div class="price">$12<span>/month</span></div>
  <div class="price-note">For serious learners</div>
  
  <ul class="features">
    <li><span class="check">✓</span> Unlimited AI translations</li>
    <li><span class="check">✓</span> Everything in Basic</li>
    <li><span class="check">✓</span> AI conversation practice</li>
    <li><span class="check">✓</span> Pronunciation feedback</li>
    <li><span class="check">✓</span> Custom lesson plans</li>
    <li><span class="check">✓</span> Grammar correction</li>
    <li><span class="check">✓</span> Priority support</li>
    <li><span class="check">✓</span> API access</li>
  </ul>
  
  <!-- LEMON SQUEEZY BUTTON -->
  <a href="https://app-lisan.lemonsqueezy.com/checkout/buy/YOUR-PREMIUM-PRODUCT-ID" 
     class="cta-button primary">
    Go Premium 🚀
  </a>
</div>
```

---

## 🧪 **STEP 3: TEST IN SANDBOX MODE** (5 minutes)

Before going live, test with test cards:

1. **Enable Test Mode in Lemon Squeezy:**
   - Go to Settings → Store Settings
   - Toggle "Test Mode" ON
   - You'll get test checkout URLs

2. **Test Card Numbers:**
   ```
   Success: 4242 4242 4242 4242
   Decline: 4000 0000 0000 0002
   
   Any future expiry date (e.g., 12/25)
   Any 3-digit CVC (e.g., 123)
   Any ZIP code (e.g., 12345)
   ```

3. **Test the Flow:**
   - Click "Choose Basic" button
   - Should open Lemon Squeezy checkout
   - Enter test card: 4242 4242 4242 4242
   - Complete purchase
   - Check if you receive confirmation email

4. **Verify in Dashboard:**
   - Go to Lemon Squeezy Dashboard → Orders
   - Should see test order
   - Check email for receipt

---

## ✅ **STEP 4: GO LIVE!** (2 minutes)

Once testing works:

1. **Disable Test Mode:**
   - Lemon Squeezy → Settings → Store Settings
   - Toggle "Test Mode" OFF

2. **Update premium.html:**
   - Replace test URLs with live URLs
   - Deploy to production

3. **Test with Real Card:**
   - Use your own card
   - Complete a $5 purchase
   - Verify you receive:
     - Order confirmation email
     - Receipt
     - Dashboard shows order

4. **Refund Test Transaction:**
   - Go to Orders → Find your test order
   - Click "Refund"
   - Get your $5 back

---

## 📊 **STEP 5: WEBHOOKS** (Optional but Recommended)

Webhooks notify your app when:
- Someone subscribes
- Subscription renews
- Payment fails
- Subscription cancels

### **Setup Webhooks:**

1. **In Lemon Squeezy:**
   - Go to Settings → Webhooks
   - Click "Add Endpoint"
   - URL: `https://your-domain.com/webhook/lemon-squeezy`
   - Secret: (auto-generated, save this!)
   - Events to listen:
     - ✅ order_created
     - ✅ subscription_created
     - ✅ subscription_updated
     - ✅ subscription_cancelled
     - ✅ subscription_payment_success
     - ✅ subscription_payment_failed

2. **Create Webhook Handler:**

If using Netlify Functions:

```javascript
// netlify/functions/lemon-squeezy.js
exports.handler = async (event) => {
  // Verify webhook signature
  const signature = event.headers['x-signature'];
  // TODO: Verify signature with secret
  
  const payload = JSON.parse(event.body);
  const eventName = payload.meta.event_name;
  
  switch (eventName) {
    case 'order_created':
      // Handle new order
      const email = payload.data.attributes.user_email;
      const productId = payload.data.attributes.first_order_item.product_id;
      
      // Grant access to user
      // Save to database
      console.log('New subscriber:', email);
      break;
      
    case 'subscription_created':
      // Handle new subscription
      break;
      
    case 'subscription_cancelled':
      // Handle cancellation
      break;
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};
```

---

## 🎨 **STEP 6: CUSTOMIZE CHECKOUT** (Optional)

Make checkout match your brand:

1. **Checkout Settings:**
   - Go to Settings → Checkout
   - Upload logo (icon-512.png)
   - Set brand color: #667eea
   - Custom message: "Thank you for supporting App-lisan!"

2. **Email Templates:**
   - Customize confirmation emails
   - Add your branding
   - Include app link

---

## 💰 **PRICING STRATEGY TIPS**

### **Current Pricing:**
- Free: $0 (5 translations/day)
- Basic: $5/month (100 translations/day)
- Premium: $12/month (unlimited)

### **Optimization Ideas:**

#### **1. Add Annual Plans (20% discount):**
```
Basic Annual: $48/year (save $12)
Premium Annual: $115/year (save $29)
```

#### **2. Lifetime Deal (Launch Special):**
```
Lifetime Premium: $199 one-time
Limited to first 100 customers
```

#### **3. Student Discount:**
```
50% off with .edu email
Basic: $2.50/month
Premium: $6/month
```

#### **4. Free Trial:**
```
7-day free trial for Premium
No credit card required
```

---

## 📈 **TRACKING & ANALYTICS**

### **What to Monitor:**

1. **Conversion Rate:**
   ```
   Visitors to premium.html → Checkout clicks → Completed purchases
   
   Target: 2-5% conversion
   ```

2. **Monthly Recurring Revenue (MRR):**
   ```
   MRR = (Basic subscribers × $5) + (Premium subscribers × $12)
   
   Goal Month 1: $100 MRR (20 subscribers)
   Goal Month 3: $500 MRR (100 subscribers)
   Goal Month 6: $2,000 MRR (400 subscribers)
   ```

3. **Churn Rate:**
   ```
   Churn = Cancellations / Total subscribers
   
   Target: <5% monthly churn
   ```

4. **Lifetime Value (LTV):**
   ```
   LTV = Average subscription length × Monthly price
   
   Example: 6 months × $12 = $72 LTV
   ```

---

## ⚠️ **COMMON ISSUES & FIXES**

### **Issue 1: "Checkout doesn't open"**

**Fix:**
```
✅ Check if URL is correct
✅ Make sure product is published
✅ Disable ad blockers
✅ Try incognito mode
```

### **Issue 2: "Payment fails"**

**Fix:**
```
✅ Check if Test Mode is off (for real payments)
✅ Verify bank details in Lemon Squeezy
✅ Check user's card details
✅ Review failed payment in dashboard
```

### **Issue 3: "No confirmation email"**

**Fix:**
```
✅ Check spam folder
✅ Verify email templates are enabled
✅ Check Lemon Squeezy email settings
✅ Manually resend from dashboard
```

---

## 🎯 **SUCCESS CHECKLIST**

Before launch:

- [ ] ✅ Store created in Lemon Squeezy
- [ ] ✅ 2 products created (Basic + Premium)
- [ ] ✅ Checkout URLs copied
- [ ] ✅ premium.html updated with checkout links
- [ ] ✅ Tested in sandbox mode
- [ ] ✅ Test purchase successful
- [ ] ✅ Confirmation email received
- [ ] ✅ Test refunded
- [ ] ✅ Test Mode disabled
- [ ] ✅ Live checkout working
- [ ] ✅ Webhooks configured (optional)
- [ ] ✅ Analytics tracking ready

---

## 🚀 **LAUNCH SEQUENCE**

### **Day 1: Soft Launch**
1. Update premium.html with Lemon Squeezy links
2. Deploy to production
3. Test yourself with real purchase
4. Refund test purchase
5. Announce to small group (friends/family)

### **Day 2-7: Validation**
1. Monitor for first real purchase
2. Check for any payment issues
3. Respond to questions quickly
4. Collect feedback

### **Week 2: Public Launch**
1. Announce on social media
2. Share pricing page
3. Offer launch discount (optional)
4. Monitor conversion rate
5. Optimize based on data

---

## 💡 **REVENUE PROJECTIONS**

### **Conservative Scenario:**
```
Month 1: 10 subscribers → $70 MRR
Month 2: 25 subscribers → $175 MRR
Month 3: 50 subscribers → $350 MRR
Month 6: 100 subscribers → $700 MRR
Month 12: 250 subscribers → $1,750 MRR
```

### **Optimistic Scenario:**
```
Month 1: 25 subscribers → $175 MRR
Month 2: 75 subscribers → $525 MRR
Month 3: 150 subscribers → $1,050 MRR
Month 6: 400 subscribers → $2,800 MRR
Month 12: 1,000 subscribers → $7,000 MRR
```

**Key: Focus on providing value, and growth will follow!**

---

## 📞 **SUPPORT**

### **Lemon Squeezy Support:**
- Email: hello@lemonsqueezy.com
- Docs: https://docs.lemonsqueezy.com
- Discord: https://discord.gg/lemonsqueezy

### **Your Support Email:**
- Set up: support@app-lisan.com
- Or use: yourname+support@gmail.com

---

## ✅ **YOU'RE READY TO MONETIZE!**

**Current Status:**
- ✅ Free app working
- ✅ Landing page live
- ✅ Premium page ready
- ✅ Lemon Squeezy account ready
- ⚡ Next: Create products & add checkout links (30 min)

**Let's make money!** 💰🚀

---

**Questions?** Re-read this guide or contact Lemon Squeezy support!

**Good luck with your launch!** 🍋💪