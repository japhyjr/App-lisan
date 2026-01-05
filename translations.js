/*
═══════════════════════════════════════════════════════════════
  TRANSLATIONS.JS - Multi-language Support (EN/AR)
  
  FEATURES:
  - English ↔ Arabic interface translation
  - RTL support for Arabic
  - Cairo font for Arabic text
  - localStorage persistence
  - Instant switching
═══════════════════════════════════════════════════════════════
*/

// ========== TRANSLATIONS DATABASE ==========

const TRANSLATIONS = {
    // Language Switcher
    lang_en: {
      en: "EN",
      ar: "إنجليزي"
    },
    lang_ar: {
      en: "AR",
      ar: "عربي"
    },
    
    // ===== INDEX/APP PAGE =====
    app_title: {
      en: "App-lisan - English to Arabic Translator",
      ar: "أبليسان - مترجم من الإنجليزية إلى العربية"
    },
    app_subtitle: {
      en: "Translate English to Arabic instantly",
      ar: "ترجم من الإنجليزية إلى العربية فوراً"
    },
    input_placeholder: {
      en: "Enter English text...",
      ar: "أدخل النص الإنجليزي..."
    },
    translate_button: {
      en: "Translate",
      ar: "ترجم"
    },
    clear_button: {
      en: "Clear",
      ar: "مسح"
    },
    copy_button: {
      en: "Copy",
      ar: "نسخ"
    },
    translation_output: {
      en: "Arabic Translation",
      ar: "الترجمة العربية"
    },
    daily_limit: {
      en: "Daily translations remaining:",
      ar: "الترجمات المتبقية اليوم:"
    },
    upgrade_premium: {
      en: "Upgrade to Premium",
      ar: "الترقية إلى بريميوم"
    },
    limit_reached: {
      en: "Daily limit reached!",
      ar: "تم الوصول إلى الحد اليومي!"
    },
    premium_features: {
      en: "Premium Features",
      ar: "ميزات بريميوم"
    },
    
    // ===== LANDING PAGE =====
    hero_title: {
      en: "Master Arabic Translation",
      ar: "أتقن الترجمة العربية"
    },
    hero_subtitle: {
      en: "Fast, accurate English to Arabic translation powered by AI",
      ar: "ترجمة سريعة ودقيقة من الإنجليزية إلى العربية بواسطة الذكاء الاصطناعي"
    },
    get_started: {
      en: "Get Started Free",
      ar: "ابدأ مجاناً"
    },
    notify_me: {
      en: "Notify Me",
      ar: "أعلمني"
    },
    email_placeholder: {
      en: "your@email.com",
      ar: "بريدك@الإلكتروني.com"
    },
    feature_fast: {
      en: "⚡ Lightning Fast",
      ar: "⚡ سريع كالبرق"
    },
    feature_fast_desc: {
      en: "Instant translations in milliseconds",
      ar: "ترجمات فورية في ميلي ثانية"
    },
    feature_accurate: {
      en: "🎯 Highly Accurate",
      ar: "🎯 دقة عالية"
    },
    feature_accurate_desc: {
      en: "AI-powered contextual translation",
      ar: "ترجمة سياقية بالذكاء الاصطناعي"
    },
    feature_free: {
      en: "💎 Free to Use",
      ar: "💎 مجاني للاستخدام"
    },
    feature_free_desc: {
      en: "Get started with free daily translations",
      ar: "ابدأ بترجمات يومية مجانية"
    },
    how_it_works: {
      en: "How It Works",
      ar: "كيف يعمل"
    },
    step_1: {
      en: "1. Enter Text",
      ar: "١. أدخل النص"
    },
    step_1_desc: {
      en: "Type or paste your English text",
      ar: "اكتب أو الصق نصك الإنجليزي"
    },
    step_2: {
      en: "2. Translate",
      ar: "٢. ترجم"
    },
    step_2_desc: {
      en: "Click translate for instant results",
      ar: "انقر على ترجم للحصول على نتائج فورية"
    },
    step_3: {
      en: "3. Use & Share",
      ar: "٣. استخدم وشارك"
    },
    step_3_desc: {
      en: "Copy and use your Arabic translation",
      ar: "انسخ واستخدم ترجمتك العربية"
    },
    
    // ===== PREMIUM PAGE =====
    premium_title: {
      en: "Unlock Premium Features",
      ar: "افتح ميزات بريميوم"
    },
    premium_subtitle: {
      en: "Get unlimited translations and advanced features",
      ar: "احصل على ترجمات غير محدودة وميزات متقدمة"
    },
    free_plan: {
      en: "Free Plan",
      ar: "الخطة المجانية"
    },
    premium_plan: {
      en: "Premium Plan",
      ar: "خطة بريميوم"
    },
    unlimited_translations: {
      en: "Unlimited Translations",
      ar: "ترجمات غير محدودة"
    },
    priority_support: {
      en: "Priority Support",
      ar: "دعم ذو أولوية"
    },
    advanced_features: {
      en: "Advanced Features",
      ar: "ميزات متقدمة"
    },
    no_ads: {
      en: "No Advertisements",
      ar: "بدون إعلانات"
    },
    monthly: {
      en: "Monthly",
      ar: "شهرياً"
    },
    yearly: {
      en: "Yearly",
      ar: "سنوياً"
    },
    save: {
      en: "Save 20%",
      ar: "وفر ٢٠٪"
    },
    choose_plan: {
      en: "Choose Plan",
      ar: "اختر الخطة"
    },
    
    // ===== POPUP MESSAGES =====
    popup_exit_title: {
      en: "👋 Before you go...",
      ar: "👋 قبل أن تغادر..."
    },
    popup_exit_message: {
      en: "Join our waitlist and get early access to premium features!",
      ar: "انضم إلى قائمة الانتظار واحصل على وصول مبكر للميزات المميزة!"
    },
    popup_limit_title: {
      en: "🔒 Daily Limit Reached",
      ar: "🔒 تم الوصول للحد اليومي"
    },
    popup_limit_message: {
      en: "Get notified when premium launches with unlimited translations!",
      ar: "احصل على إشعار عند إطلاق بريميوم بترجمات غير محدودة!"
    },
    popup_success_title: {
      en: "🎉 You're In!",
      ar: "🎉 أنت مسجل!"
    },
    popup_success_message: {
      en: "Thanks for joining the waitlist!",
      ar: "شكراً لانضمامك إلى قائمة الانتظار!"
    },
    popup_success_note: {
      en: "We'll notify you about premium launch with special pricing!",
      ar: "سنخطرك بإطلاق بريميوم بأسعار خاصة!"
    },
    join_waitlist: {
      en: "Join Waitlist 🔔",
      ar: "انضم لقائمة الانتظار 🔔"
    },
    continue_learning: {
      en: "Continue Learning →",
      ar: "تابع التعلم ←"
    },
    maybe_later: {
      en: "Maybe later",
      ar: "ربما لاحقاً"
    },
    
    // ===== COMMON =====
    loading: {
      en: "Loading...",
      ar: "جاري التحميل..."
    },
    error: {
      en: "Error",
      ar: "خطأ"
    },
    success: {
      en: "Success!",
      ar: "نجح!"
    },
    try_again: {
      en: "Try Again",
      ar: "حاول مرة أخرى"
    },
    close: {
      en: "Close",
      ar: "إغلاق"
    }
  };
  
  // ========== LANGUAGE SWITCHER ==========
  
  class LanguageSwitcher {
    constructor() {
      this.currentLang = this.getStoredLanguage() || 'en';
      this.init();
    }
    
    init() {
      // Apply language on load
      this.applyLanguage(this.currentLang);
      
      // Create switcher button
      this.createSwitcherButton();
      
      console.log(`✅ Language system initialized (${this.currentLang.toUpperCase()})`);
    }
    
    getStoredLanguage() {
      return localStorage.getItem('preferredLanguage');
    }
    
    setStoredLanguage(lang) {
      localStorage.setItem('preferredLanguage', lang);
    }
    
    createSwitcherButton() {
      // Check if button already exists
      if (document.getElementById('lang-switcher')) return;
      
      const button = document.createElement('button');
      button.id = 'lang-switcher';
      button.className = 'language-switcher';
      button.innerHTML = `
        <span class="lang-option ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</span>
        <span class="lang-divider">|</span>
        <span class="lang-option ${this.currentLang === 'ar' ? 'active' : ''}" data-lang="ar">عربي</span>
      `;
      
      button.addEventListener('click', (e) => {
        if (e.target.dataset.lang) {
          this.switchLanguage(e.target.dataset.lang);
        }
      });
      
      // Add to page (top-right of header or body)
      const header = document.querySelector('header') || document.querySelector('nav') || document.body;
      header.appendChild(button);
    }
    
    switchLanguage(lang) {
      if (lang === this.currentLang) return;
      
      this.currentLang = lang;
      this.setStoredLanguage(lang);
      this.applyLanguage(lang);
      
      // Update button states
      document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
      });
      
      // Track event
      if (typeof trackEvent === 'function') {
        trackEvent('language_switched', { to: lang });
      }
      
      console.log(`✅ Language switched to ${lang.toUpperCase()}`);
    }
    
    applyLanguage(lang) {
      // Set HTML attributes
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.body.setAttribute('lang', lang);
      
      // Load Arabic font if needed
      if (lang === 'ar') {
        this.loadArabicFont();
      }
      
      // Translate all elements with data-i18n attribute
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (TRANSLATIONS[key] && TRANSLATIONS[key][lang]) {
          element.textContent = TRANSLATIONS[key][lang];
        }
      });
      
      // Translate placeholders
      document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (TRANSLATIONS[key] && TRANSLATIONS[key][lang]) {
          element.placeholder = TRANSLATIONS[key][lang];
        }
      });
    }
    
    loadArabicFont() {
      // Check if already loaded
      if (document.getElementById('arabic-font')) return;
      
      const link = document.createElement('link');
      link.id = 'arabic-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap';
      document.head.appendChild(link);
    }
    
    translate(key) {
      if (TRANSLATIONS[key] && TRANSLATIONS[key][this.currentLang]) {
        return TRANSLATIONS[key][this.currentLang];
      }
      return key; // Return key if translation not found
    }
    
    getCurrentLanguage() {
      return this.currentLang;
    }
  }
  
  // ========== AUTO-INITIALIZE ==========
  
  let languageSwitcher;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      languageSwitcher = new LanguageSwitcher();
    });
  } else {
    languageSwitcher = new LanguageSwitcher();
  }
  
  // ========== EXPORT ==========
  
  window.TRANSLATIONS = TRANSLATIONS;
  window.LanguageSwitcher = languageSwitcher;
  
  // Helper function for manual translation
  window.t = (key) => {
    return languageSwitcher ? languageSwitcher.translate(key) : key;
  };
  
  console.log('✅ Translation system loaded');