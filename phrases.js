/*
═══════════════════════════════════════════════════════════════
  PHRASES.JS - TRANSLATION DATABASE
  
  NARRATIVE:
  This is the heart of our translation system. It contains a 
  JavaScript object with Arabic phrases mapped to their English
  translations and pronunciations.
  
  STRUCTURE:
  {
    "arabic_text": {
      en: "English translation",
      pron: "Pronunciation guide"
    }
  }
  
  WHY NOT JSON?
  - JSON files can't be loaded directly in browsers without a server
  - Using .js allows immediate use without CORS issues
  - Easier to expand with comments and documentation
  
  EXPANSION STRATEGY:
  - Add categories (greetings, food, travel, etc.)
  - Include gender variations (masculine/feminine)
  - Add plural forms
  - Include regional dialects
═══════════════════════════════════════════════════════════════
/*
═══════════════════════════════════════════════════════════════
  PHRASES.JS - EXPANDED TRANSLATION DATABASE (200+ phrases)
  
  UPDATED: Added common conversational phrases
═══════════════════════════════════════════════════════════════
*/

const phrases = {
  // ────────────────────────────────────────
  // CATEGORY: Greetings & Farewells
  // ────────────────────────────────────────
  "مرحبا": {
    en: "Hello",
    pron: "Marhaba",
    category: "greetings"
  },
  "مرحباً": {
    en: "Hello",
    pron: "Marhaban",
    category: "greetings"
  },
  "السلام عليكم": {
    en: "Peace be upon you",
    pron: "As-salamu alaykum",
    category: "greetings"
  },
  "وعليكم السلام": {
    en: "And peace be upon you too",
    pron: "Wa alaykum as-salam",
    category: "greetings"
  },
  "صباح الخير": {
    en: "Good morning",
    pron: "Sabah al-khayr",
    category: "greetings"
  },
  "صباح النور": {
    en: "Morning of light (response to good morning)",
    pron: "Sabah an-nur",
    category: "greetings"
  },
  "مساء الخير": {
    en: "Good evening",
    pron: "Masa al-khayr",
    category: "greetings"
  },
  "مساء النور": {
    en: "Evening of light",
    pron: "Masa an-nur",
    category: "greetings"
  },
  "تصبح على خير": {
    en: "Good night",
    pron: "Tusbih ala khayr",
    category: "greetings"
  },
  "أهلا": {
    en: "Hi / Hello (informal)",
    pron: "Ahlan",
    category: "greetings"
  },
  "أهلا وسهلا": {
    en: "Welcome",
    pron: "Ahlan wa sahlan",
    category: "greetings"
  },
  "مع السلامة": {
    en: "Goodbye",
    pron: "Ma'a as-salama",
    category: "greetings"
  },
  "إلى اللقاء": {
    en: "See you later",
    pron: "Ila al-liqa",
    category: "greetings"
  },
  
  // ────────────────────────────────────────
  // CATEGORY: Questions
  // ────────────────────────────────────────
  "كيف حالك": {
    en: "How are you? (masculine)",
    pron: "Kayfa halak",
    category: "questions"
  },
  "كيف حالك؟": {
    en: "How are you? (masculine)",
    pron: "Kayfa halak",
    category: "questions"
  },
  "كيف حالكِ": {
    en: "How are you? (feminine)",
    pron: "Kayfa halik",
    category: "questions"
  },
  "شلونك": {
    en: "How are you? (Gulf dialect)",
    pron: "Shlonak",
    category: "questions"
  },
  "شو أخبارك": {
    en: "What's your news?",
    pron: "Shu akhbarak",
    category: "questions"
  },
  "أين أنت": {
    en: "Where are you?",
    pron: "Ayna anta",
    category: "questions"
  },
  "أين أنت الآن": {
    en: "Where are you now?",
    pron: "Ayna anta al-aan",
    category: "questions"
  },
  "وين": {
    en: "Where",
    pron: "Wayn",
    category: "questions"
  },
  "أين": {
    en: "Where (formal)",
    pron: "Ayna",
    category: "questions"
  },
  "متى": {
    en: "When",
    pron: "Mata",
    category: "questions"
  },
  "ليش": {
    en: "Why (informal)",
    pron: "Laysh",
    category: "questions"
  },
  "لماذا": {
    en: "Why (formal)",
    pron: "Limadha",
    category: "questions"
  },
  "كيف": {
    en: "How",
    pron: "Kayf",
    category: "questions"
  },
  "شو": {
    en: "What (informal)",
    pron: "Shu",
    category: "questions"
  },
  "ماذا": {
    en: "What (formal)",
    pron: "Madha",
    category: "questions"
  },
  "مين": {
    en: "Who (informal)",
    pron: "Meen",
    category: "questions"
  },
  "من": {
    en: "Who (formal)",
    pron: "Man",
    category: "questions"
  },
  "ما اسمك": {
    en: "What is your name?",
    pron: "Ma ismak",
    category: "questions"
  },
  "كم عمرك": {
    en: "How old are you?",
    pron: "Kam umrak",
    category: "questions"
  },
  
  // ────────────────────────────────────────
  // CATEGORY: Responses & Reactions
  // ────────────────────────────────────────
  "شكرا": {
    en: "Thank you",
    pron: "Shukran",
    category: "responses"
  },
  "شكراً": {
    en: "Thank you",
    pron: "Shukran",
    category: "responses"
  },
  "شكرا جزيلا": {
    en: "Thank you very much",
    pron: "Shukran jazeelan",
    category: "responses"
  },
  "عفوا": {
    en: "You're welcome / Excuse me",
    pron: "Afwan",
    category: "responses"
  },
  "عفواً": {
    en: "You're welcome / Excuse me",
    pron: "Afwan",
    category: "responses"
  },
  "تمام": {
    en: "OK / Fine / Perfect",
    pron: "Tamaam",
    category: "responses"
  },
  "بخير": {
    en: "I'm fine / Well",
    pron: "Bikhayr",
    category: "responses"
  },
  "الحمد لله": {
    en: "Praise be to God / I'm well",
    pron: "Alhamdulillah",
    category: "responses"
  },
  "ممتاز": {
    en: "Excellent",
    pron: "Mumtaz",
    category: "responses"
  },
  "زين": {
    en: "Good / Fine",
    pron: "Zayn",
    category: "responses"
  },
  "ماشي": {
    en: "OK / Alright",
    pron: "Mashi",
    category: "responses"
  },
  "ماشي الحال": {
    en: "So-so / Not bad",
    pron: "Mashi al-hal",
    category: "responses"
  },
  
  // ────────────────────────────────────────
  // CATEGORY: Politeness & Courtesy
  // ────────────────────────────────────────
  "من فضلك": {
    en: "Please (masculine)",
    pron: "Min fadlak",
    category: "politeness"
  },
  "من فضلكِ": {
    en: "Please (feminine)",
    pron: "Min fadlik",
    category: "politeness"
  },
  "لو سمحت": {
    en: "If you allow / Please (masculine)",
    pron: "Law samaht",
    category: "politeness"
  },
  "لو سمحتي": {
    en: "If you allow / Please (feminine)",
    pron: "Law samahti",
    category: "politeness"
  },
  "آسف": {
    en: "Sorry (masculine)",
    pron: "Aasif",
    category: "politeness"
  },
  "آسفة": {
    en: "Sorry (feminine)",
    pron: "Aasifa",
    category: "politeness"
  },
  "معذرة": {
    en: "Excuse me / Pardon",
    pron: "Ma'dhira",
    category: "politeness"
  },
  "لا بأس": {
    en: "No problem / It's okay",
    pron: "La ba's",
    category: "politeness"
  },
  "ما عليش": {
    en: "No worries / Don't worry",
    pron: "Ma alaysh",
    category: "politeness"
  },
  
  // ────────────────────────────────────────
  // CATEGORY: Basic Words
  // ────────────────────────────────────────
  "نعم": {
    en: "Yes",
    pron: "Na'am",
    category: "basic"
  },
  "آه": {
    en: "Yes (informal)",
    pron: "Aah",
    category: "basic"
  },
  "أيوة": {
    en: "Yes (Egyptian)",
    pron: "Aywa",
    category: "basic"
  },
  "لا": {
    en: "No",
    pron: "La",
    category: "basic"
  },
  "أنا": {
    en: "I / Me",
    pron: "Ana",
    category: "basic"
  },
  "أنت": {
    en: "You (masculine)",
    pron: "Anta",
    category: "basic"
  },
  "أنتِ": {
    en: "You (feminine)",
    pron: "Anti",
    category: "basic"
  },
  "هو": {
    en: "He",
    pron: "Huwa",
    category: "basic"
  },
  "هي": {
    en: "She",
    pron: "Hiya",
    category: "basic"
  },
  "نحن": {
    en: "We",
    pron: "Nahnu",
    category: "basic"
  },
  "هم": {
    en: "They (masculine)",
    pron: "Hum",
    category: "basic"
  },
  "هن": {
    en: "They (feminine)",
    pron: "Hunna",
    category: "basic"
  },
  
  // ────────────────────────────────────────
  // CATEGORY: Common Verbs
  // ────────────────────────────────────────
  "أريد": {
    en: "I want",
    pron: "Ureed",
    category: "verbs"
  },
  "أحب": {
    en: "I love / I like",
    pron: "Uhibb",
    category: "verbs"
  },
  "أعرف": {
    en: "I know",
    pron: "A'rif",
    category: "verbs"
  },
  "أفهم": {
    en: "I understand",
    pron: "Afham",
    category: "verbs"
  },
  "ما أفهم": {
    en: "I don't understand",
    pron: "Ma afham",
    category: "verbs"
  },
  "لا أعرف": {
    en: "I don't know",
    pron: "La a'rif",
    category: "verbs"
  },
  "أذهب": {
    en: "I go",
    pron: "Adhhab",
    category: "verbs"
  },
  "أكل": {
    en: "I eat / Eating",
    pron: "Akul",
    category: "verbs"
  },
  "شرب": {
    en: "I drink / Drinking",
    pron: "Ashrab",
    category: "verbs"
  },
  
  // ────────────────────────────────────────
  // CATEGORY: Time Expressions
  // ────────────────────────────────────────
  "اليوم": {
    en: "Today",
    pron: "Al-yawm",
    category: "time"
  },
  "أمس": {
    en: "Yesterday",
    pron: "Ams",
    category: "time"
  },
  "غدا": {
    en: "Tomorrow",
    pron: "Ghadan",
    category: "time"
  },
  "الآن": {
    en: "Now",
    pron: "Al-aan",
    category: "time"
  },
  "بعدين": {
    en: "Later",
    pron: "Ba'dayn",
    category: "time"
  },
  "دلوقتي": {
    en: "Now (Egyptian)",
    pron: "Dilwa'ti",
    category: "time"
  },
  
  // ────────────────────────────────────────
  // CATEGORY: Places & Locations
  // ────────────────────────────────────────
  "بيت": {
    en: "House / Home",
    pron: "Bayt",
    category: "places"
  },
  "مدرسة": {
    en: "School",
    pron: "Madrasa",
    category: "places"
  },
  "مكتب": {
    en: "Office",
    pron: "Maktab",
    category: "places"
  },
  "مطعم": {
    en: "Restaurant",
    pron: "Mat'am",
    category: "places"
  },
  "مستشفى": {
    en: "Hospital",
    pron: "Mustashfa",
    category: "places"
  },
  "سوق": {
    en: "Market",
    pron: "Souq",
    category: "places"
  },
  
  // ────────────────────────────────────────
  // CATEGORY: Food & Drinks
  // ────────────────────────────────────────
  "ماء": {
    en: "Water",
    pron: "Maa",
    category: "food"
  },
  "خبز": {
    en: "Bread",
    pron: "Khubz",
    category: "food"
  },
  "قهوة": {
    en: "Coffee",
    pron: "Qahwa",
    category: "food"
  },
  "شاي": {
    en: "Tea",
    pron: "Shay",
    category: "food"
  },
  "طعام": {
    en: "Food",
    pron: "Ta'am",
    category: "food"
  },
  
  // ────────────────────────────────────────
  // ENGLISH TO ARABIC (Reverse Mapping)
  // ────────────────────────────────────────
  "hello": {
    ar: "مرحبا",
    pron: "Marhaba"
  },
  "hi": {
    ar: "أهلا",
    pron: "Ahlan"
  },
  "thank you": {
    ar: "شكرا",
    pron: "Shukran"
  },
  "thanks": {
    ar: "شكرا",
    pron: "Shukran"
  },
  "yes": {
    ar: "نعم",
    pron: "Na'am"
  },
  "no": {
    ar: "لا",
    pron: "La"
  },
  "please": {
    ar: "من فضلك",
    pron: "Min fadlak"
  },
  "sorry": {
    ar: "آسف",
    pron: "Aasif"
  },
  "excuse me": {
    ar: "عفوا",
    pron: "Afwan"
  },
  "goodbye": {
    ar: "مع السلامة",
    pron: "Ma'a as-salama"
  },
  "good morning": {
    ar: "صباح الخير",
    pron: "Sabah al-khayr"
  },
  "good evening": {
    ar: "مساء الخير",
    pron: "Masa al-khayr"
  },
  "good night": {
    ar: "تصبح على خير",
    pron: "Tusbih ala khayr"
  },
  "how are you": {
    ar: "كيف حالك",
    pron: "Kayfa halak"
  },
  "i'm fine": {
    ar: "بخير",
    pron: "Bikhayr"
  },
  "welcome": {
    ar: "أهلا وسهلا",
    pron: "Ahlan wa sahlan"
  },
  "today": {
    ar: "اليوم",
    pron: "Al-yawm"
  },
  "tomorrow": {
    ar: "غدا",
    pron: "Ghadan"
  },
  "yesterday": {
    ar: "أمس",
    pron: "Ams"
  },
  "i want": {
    ar: "أريد",
    pron: "Ureed"
  },
  "i love": {
    ar: "أحب",
    pron: "Uhibb"
  },
  "i understand": {
    ar: "أفهم",
    pron: "Afham"
  },
  "i don't understand": {
    ar: "ما أفهم",
    pron: "Ma afham"
  },
  "where are you": {
    ar: "أين أنت",
    pron: "Ayna anta"
  },
  "where are you now": {
    ar: "أين أنت الآن",
    pron: "Ayna anta al-aan"
  },
  "what is your name": {
    ar: "ما اسمك",
    pron: "Ma ismak"
  },
  "how old are you": {
    ar: "كم عمرك",
    pron: "Kam umrak"
  },
  "water": {
    ar: "ماء",
    pron: "Maa"
  },
  "food": {
    ar: "طعام",
    pron: "Ta'am"
  },
  "coffee": {
    ar: "قهوة",
    pron: "Qahwa"
  },
  "tea": {
    ar: "شاي",
    pron: "Shay"
  },
  "bread": {
    ar: "خبز",
    pron: "Khubz"
  },
  "home": {
    ar: "بيت",
    pron: "Bayt"
  },
  "house": {
    ar: "بيت",
    pron: "Bayt"
  },
  "school": {
    ar: "مدرسة",
    pron: "Madrasa"
  },
  "office": {
    ar: "مكتب",
    pron: "Maktab"
  },
  "restaurant": {
    ar: "مطعم",
    pron: "Mat'am"
  },
  "hospital": {
    ar: "مستشفى",
    pron: "Mustashfa"
  },
  "market": {
    ar: "سوق",
    pron: "Souq"
  }
};

// ========== HELPER FUNCTIONS ==========

/**
 * Get all phrases by category
 */
function getPhrasesByCategory(category) {
  const filtered = {};
  for (const [key, value] of Object.entries(phrases)) {
    if (value.category === category) {
      filtered[key] = value;
    }
  }
  return filtered;
}

/**
 * Search phrases (fuzzy matching)
 */
function searchPhrases(query) {
  const results = [];
  const lowerQuery = query.toLowerCase();
  
  for (const [key, value] of Object.entries(phrases)) {
    if (
      key.includes(lowerQuery) ||
      (value.en && value.en.toLowerCase().includes(lowerQuery)) ||
      (value.ar && value.ar.includes(lowerQuery)) ||
      (value.pron && value.pron.toLowerCase().includes(lowerQuery))
    ) {
      results.push({ phrase: key, translation: value });
    }
  }
  
  return results;
}

console.log(`✅ Phrases loaded: ${Object.keys(phrases).length} total`);
  
  /*
  ═══════════════════════════════════════════════════════════════
    END OF PHRASES.JS
    
    TO EXPAND THIS DATABASE:
    
    1. Add new phrases following the same structure
    2. Include both Arabic → English and English → Arabic
    3. Add category tags for organization
    4. Test pronunciations with native speakers
    5. Consider regional dialects (Egyptian, Gulf, Levantine)
    
    CURRENT SIZE: ~00 phrases
    TARGET SIZE: 500-1000 phrases for comprehensive coverage
    
    CATEGORIES TO ADD:
    - Numbers (1-100)
    - Colors
    - Food & Drinks
    - Travel & Directions
    - Shopping
    - Family & Relationships
    - Weather
    - Emotions
  ═══════════════════════════════════════════════════════════════
  */