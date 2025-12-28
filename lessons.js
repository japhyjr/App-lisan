/*
═══════════════════════════════════════════════════════════════
  LESSONS.JS - STRUCTURED LEARNING MODULE
  
  NARRATIVE:
  This file contains curated Arabic lessons in a progressive order.
  Unlike the phrases database (which is for translation), these
  lessons are specifically designed for learning - ordered from
  beginner to advanced.
  
  STRUCTURE:
  Each lesson object contains:
  - ar: Arabic text
  - pron: Pronunciation guide
  - en: English translation
  - tip: Learning tip or cultural context
  - level: difficulty level (beginner/intermediate/advanced)
  
  PEDAGOGY:
  Lessons are ordered using spaced repetition principles:
  1. Most common/useful phrases first
  2. Building blocks before complex sentences
  3. Cultural context to aid memory
  4. Pronunciation guides for confidence
═══════════════════════════════════════════════════════════════
*/

// ========== LESSON PROGRESSION ==========
const lessons = [
    // ────────────────────────────────────────
    // LEVEL 1: Essential Greetings (Lessons 1-5)
    // ────────────────────────────────────────
    {
      ar: "مرحبا",
      pron: "Marhaba",
      en: "Hello",
      tip: "The most common greeting in Arabic - use it anytime!",
      level: "beginner"
    },
    {
      ar: "السلام عليكم",
      pron: "As-salamu alaykum",
      en: "Peace be upon you",
      tip: "Traditional Islamic greeting used across all Arab countries. Response: 'Wa alaykum as-salam'",
      level: "beginner"
    },
    {
      ar: "شكرا",
      pron: "Shukran",
      en: "Thank you",
      tip: "Essential word for showing gratitude. Add 'جزيلا' (jazeelan) for 'thank you very much'",
      level: "beginner"
    },
    {
      ar: "من فضلك",
      pron: "Min fadlak",
      en: "Please",
      tip: "Use this to be polite when asking for something. For females, say 'Min fadlik'",
      level: "beginner"
    },
    {
      ar: "عفوا",
      pron: "Afwan",
      en: "You're welcome / Excuse me",
      tip: "Multi-purpose word - use for 'you're welcome' or to politely get attention",
      level: "beginner"
    },
    
    // ────────────────────────────────────────
    // LEVEL 2: Basic Responses (Lessons 6-10)
    // ────────────────────────────────────────
    {
      ar: "نعم",
      pron: "Na'am",
      en: "Yes",
      tip: "Formal way to say yes. In casual speech, you can also say 'آه' (aah)",
      level: "beginner"
    },
    {
      ar: "لا",
      pron: "La",
      en: "No",
      tip: "Simple and direct - works in all contexts",
      level: "beginner"
    },
    {
      ar: "تمام",
      pron: "Tamaam",
      en: "OK / Perfect",
      tip: "Very common response meaning 'okay' or 'perfect' - you'll hear this constantly",
      level: "beginner"
    },
    {
      ar: "ممتاز",
      pron: "Mumtaz",
      en: "Excellent",
      tip: "Use this to express that something is great or excellent",
      level: "beginner"
    },
    {
      ar: "آسف",
      pron: "Aasif",
      en: "Sorry",
      tip: "For apologies. Females say 'آسفة' (aasifa)",
      level: "beginner"
    },
    
    // ────────────────────────────────────────
    // LEVEL 3: Conversation Starters (Lessons 11-15)
    // ────────────────────────────────────────
    {
      ar: "كيف حالك",
      pron: "Kayfa halak",
      en: "How are you?",
      tip: "Standard way to ask how someone is. For females: 'Kayfa halik'",
      level: "beginner"
    },
    {
      ar: "بخير",
      pron: "Bikhayr",
      en: "I'm fine",
      tip: "Common response meaning 'I'm well'. Often followed by 'الحمد لله' (Alhamdulillah)",
      level: "beginner"
    },
    {
      ar: "الحمد لله",
      pron: "Alhamdulillah",
      en: "Praise be to God",
      tip: "Used to express gratitude and contentment. Literally means 'praise to God'",
      level: "beginner"
    },
    {
      ar: "أهلا وسهلا",
      pron: "Ahlan wa sahlan",
      en: "Welcome",
      tip: "Warm welcoming phrase - literally means 'family and ease'",
      level: "beginner"
    },
    {
      ar: "صباح الخير",
      pron: "Sabah al-khayr",
      en: "Good morning",
      tip: "Morning greeting. Response is 'صباح النور' (sabah an-nur) - 'morning of light'",
      level: "beginner"
    },
    
    // ────────────────────────────────────────
    // LEVEL 4: Time-Based Greetings (Lessons 16-20)
    // ────────────────────────────────────────
    {
      ar: "مساء الخير",
      pron: "Masa al-khayr",
      en: "Good evening",
      tip: "Evening greeting. Response: 'مساء النور' (masa an-nur)",
      level: "beginner"
    },
    {
      ar: "تصبح على خير",
      pron: "Tusbih ala khayr",
      en: "Good night",
      tip: "Said before sleeping. Literally: 'may you wake up well'",
      level: "beginner"
    },
    {
      ar: "مع السلامة",
      pron: "Ma'a as-salama",
      en: "Goodbye",
      tip: "Farewell phrase - literally means 'with peace'",
      level: "beginner"
    },
    {
      ar: "إلى اللقاء",
      pron: "Ila al-liqa",
      en: "See you later",
      tip: "More casual farewell - literally 'until the meeting'",
      level: "beginner"
    },
    {
      ar: "اليوم",
      pron: "Al-yawm",
      en: "Today",
      tip: "Time word for 'today'. Build sentences like 'اليوم جميل' (today is beautiful)",
      level: "beginner"
    },
    
    // ────────────────────────────────────────
    // LEVEL 5: Pronouns & Basic Identity (Lessons 21-25)
    // ────────────────────────────────────────
    {
      ar: "أنا",
      pron: "Ana",
      en: "I / Me",
      tip: "First person singular pronoun. Example: 'أنا طالب' (I am a student)",
      level: "intermediate"
    },
    {
      ar: "أنت",
      pron: "Anta",
      en: "You (masculine)",
      tip: "Second person pronoun for males. For females: 'أنتِ' (anti)",
      level: "intermediate"
    },
    {
      ar: "هو",
      pron: "Huwa",
      en: "He",
      tip: "Third person masculine pronoun",
      level: "intermediate"
    },
    {
      ar: "هي",
      pron: "Hiya",
      en: "She",
      tip: "Third person feminine pronoun",
      level: "intermediate"
    },
    {
      ar: "نحن",
      pron: "Nahnu",
      en: "We",
      tip: "First person plural pronoun",
      level: "intermediate"
    },
    
    // ────────────────────────────────────────
    // LEVEL 6: Common Verbs (Lessons 26-30)
    // ────────────────────────────────────────
    {
      ar: "أريد",
      pron: "Ureed",
      en: "I want",
      tip: "Very useful verb. Example: 'أريد ماء' (I want water)",
      level: "intermediate"
    },
    {
      ar: "أحب",
      pron: "Uhibb",
      en: "I love / I like",
      tip: "Express preference or love. Works for both meanings in Arabic",
      level: "intermediate"
    },
    {
      ar: "أفهم",
      pron: "Afham",
      en: "I understand",
      tip: "Important for learning. Negative: 'ما أفهم' (I don't understand)",
      level: "intermediate"
    },
    {
      ar: "ما أفهم",
      pron: "Ma afham",
      en: "I don't understand",
      tip: "Crucial phrase when learning - don't be shy to use it!",
      level: "intermediate"
    },
    {
      ar: "أعرف",
      pron: "A'rif",
      en: "I know",
      tip: "Used for knowledge. Negative: 'لا أعرف' (I don't know)",
      level: "intermediate"
    },
    
    // ────────────────────────────────────────
    // LEVEL 7: Questions (Lessons 31-35)
    // ────────────────────────────────────────
    {
      ar: "أين",
      pron: "Ayna",
      en: "Where",
      tip: "Question word for location. Example: 'أين الحمام؟' (Where is the bathroom?)",
      level: "intermediate"
    },
    {
      ar: "متى",
      pron: "Mata",
      en: "When",
      tip: "Question word for time. Example: 'متى تذهب؟' (When do you go?)",
      level: "intermediate"
    },
    {
      ar: "لماذا",
      pron: "Limadha",
      en: "Why",
      tip: "Formal way to ask 'why'. Casual: 'ليش' (laysh)",
      level: "intermediate"
    },
    {
      ar: "ماذا",
      pron: "Madha",
      en: "What",
      tip: "Question word for 'what'. Casual: 'شو' (shu)",
      level: "intermediate"
    },
    {
      ar: "من",
      pron: "Man",
      en: "Who",
      tip: "Question word for 'who'. Example: 'من أنت؟' (Who are you?)",
      level: "intermediate"
    },
    
    // ────────────────────────────────────────
    // LEVEL 8: Time Expressions (Lessons 36-40)
    // ────────────────────────────────────────
    {
      ar: "غدا",
      pron: "Ghadan",
      en: "Tomorrow",
      tip: "Future time reference. Plan ahead with this word!",
      level: "intermediate"
    },
    {
      ar: "أمس",
      pron: "Ams",
      en: "Yesterday",
      tip: "Past time reference. Talk about what happened yesterday",
      level: "intermediate"
    },
    {
      ar: "الآن",
      pron: "Al-aan",
      en: "Now",
      tip: "Present moment. Example: 'الآن أفهم' (Now I understand)",
      level: "intermediate"
    },
    {
      ar: "بعدين",
      pron: "Ba'dayn",
      en: "Later",
      tip: "Common word for 'later' or 'afterwards'",
      level: "intermediate"
    },
    {
      ar: "دائما",
      pron: "Da'iman",
      en: "Always",
      tip: "Frequency word - expresses something that happens always",
      level: "intermediate"
    }
  ];
  
  // ========== LESSON MANAGEMENT ==========
  
  /**
   * Get total number of lessons
   * @returns {number} Total lesson count
   */
  function getTotalLessons() {
    return lessons.length;
  }
  
  /**
   * Get lesson by index
   * @param {number} index - Lesson index
   * @returns {Object|null} Lesson object or null if invalid
   */
  function getLesson(index) {
    if (index >= 0 && index < lessons.length) {
      return lessons[index];
    }
    return null;
  }
  
  /**
   * Get lessons by difficulty level
   * @param {string} level - Difficulty level
   * @returns {Array} Filtered lessons
   */
  function getLessonsByLevel(level) {
    return lessons.filter(lesson => lesson.level === level);
  }
  
  /**
   * Get random lesson
   * @returns {Object} Random lesson object
   */
  function getRandomLesson() {
    const randomIndex = Math.floor(Math.random() * lessons.length);
    return lessons[randomIndex];
  }
  
  /**
   * Search lessons by keyword
   * @param {string} keyword - Search term
   * @returns {Array} Matching lessons
   */
  function searchLessons(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    return lessons.filter(lesson => 
      lesson.ar.includes(keyword) ||
      lesson.en.toLowerCase().includes(lowerKeyword) ||
      lesson.pron.toLowerCase().includes(lowerKeyword) ||
      lesson.tip.toLowerCase().includes(lowerKeyword)
    );
  }
  
  /**
   * Get lesson progress percentage
   * @param {number} currentIndex - Current lesson index
   * @returns {number} Progress percentage (0-100)
   */
  function getLessonProgress(currentIndex) {
    if (currentIndex < 0 || lessons.length === 0) return 0;
    return Math.round(((currentIndex + 1) / lessons.length) * 100);
  }
  
  // ========== LESSON CATEGORIES ==========
  const lessonCategories = {
    greetings: [0, 1, 14, 15, 16, 17],
    responses: [2, 3, 4, 5, 6, 7, 8, 9, 11, 12],
    pronouns: [20, 21, 22, 23, 24],
    verbs: [25, 26, 27, 28, 29],
    questions: [30, 31, 32, 33, 34],
    time: [19, 35, 36, 37, 38, 39]
  };
  
  /**
   * Get lessons by category
   * @param {string} category - Category name
   * @returns {Array} Lessons in that category
   */
  function getLessonsByCategory(category) {
    const indices = lessonCategories[category] || [];
    return indices.map(index => lessons[index]);
  }
  
  /*
  ═══════════════════════════════════════════════════════════════
    END OF LESSONS.JS
    
    EXPANSION IDEAS:
    
    1. Add quiz mode after every 5 lessons
    2. Include audio files for native pronunciation
    3. Add video demonstrations for pronunciation
    4. Create flashcard mode for practice
    5. Implement spaced repetition algorithm
    6. Track user progress in localStorage
    7. Add lesson notes/annotations
    8. Include cultural context videos
    
    CURRENT: 40 lessons
    TARGET: 100+ lessons covering:
    - Numbers & counting
    - Colors & descriptions
    - Food & dining
    - Travel & directions
    - Shopping & money
    - Family & relationships
    - Weather & nature
    - Work & education
    
    DIFFICULTY PROGRESSION:
    - Beginner (Lessons 1-20): Essential phrases
    - Intermediate (Lessons 21-40): Grammar basics
    - Advanced (Future): Complex sentences, idioms
  ═══════════════════════════════════════════════════════════════
  */