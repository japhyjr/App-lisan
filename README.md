# 🗣️ LISAN - Arabic Learning & Translation App

A **zero-budget**, **open-source** Progressive Web App (PWA) for learning Arabic and translating between Arabic ↔ English with voice input support.

---

## 📦 **PROJECT STRUCTURE**

```
lisan-app/
│
├── index.html          # Main UI (entry point)
├── style.css           # RTL/LTR responsive styles
├── app.js              # Main application controller
├── translate.js        # Translation engine
├── lessons.js          # Learning module
├── phrases.js          # Translation database
├── voice.js            # Voice recognition & TTS
├── manifest.json       # PWA configuration
├── service-worker.js   # Offline caching
├── README.md           # This file
│
└── assets/ (create these)
    ├── icon-192.png    # App icon (192x192)
    ├── icon-512.png    # App icon (512x512)
    └── offline.html    # Offline fallback page
```

---

## 🚀 **QUICK START**

### **Option 1: Simple File Opening (Testing)**
1. Download all files to a folder
2. Open `index.html` in Chrome/Edge
3. ⚠️ Service Worker won't work (needs server)

### **Option 2: Local Server (Recommended)**

#### **Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### **Using Node.js (http-server):**
```bash
npm install -g http-server
http-server -p 8000
```

#### **Using VS Code:**
Install "Live Server" extension → Right-click `index.html` → "Open with Live Server"

Then open: `http://localhost:8000`

---

## 🎯 **FEATURES**

### ✅ **Currently Implemented**

| Feature | Description | Status |
|---------|-------------|--------|
| 🔄 **Translation** | Arabic ↔ English dictionary-based | ✅ |
| 🎤 **Voice Input** | Speech-to-text (Chrome/Edge) | ✅ |
| 🔊 **Audio Output** | Text-to-speech for Arabic | ✅ |
| 📚 **Lessons** | 40 progressive Arabic lessons | ✅ |
| 📱 **PWA** | Installable as mobile app | ✅ |
| 🌐 **Offline** | Works without internet | ✅ |
| 📊 **Progress** | Track learning progress | ✅ |
| ⌨️ **Keyboard** | Arrow keys for navigation | ✅ |
| 🎨 **RTL Support** | Proper Arabic text direction | ✅ |

### ⏳ **Future Enhancements**

- [ ] Quiz mode
- [ ] Flashcards
- [ ] AI-powered translation (API integration)
- [ ] Spaced repetition
- [ ] Dark mode
- [ ] User-generated phrases
- [ ] Pronunciation feedback

---

## 📝 **FILE DESCRIPTIONS**

### **1. index.html** - Main Structure
- Contains UI layout
- Links all scripts and styles
- Semantic HTML5 structure

### **2. style.css** - Styling
- Mobile-first responsive design
- RTL (Right-to-Left) for Arabic
- Modern gradient themes
- Smooth animations

### **3. phrases.js** - Translation Data
- ~100 Arabic ↔ English phrases
- Includes pronunciation guides
- Categorized by type
- **Easily expandable** - just add more entries!

### **4. lessons.js** - Learning Content
- 40 progressive lessons
- Beginner → Intermediate → Advanced
- Cultural tips included
- Organized by categories

### **5. translate.js** - Translation Logic
- Dictionary-based matching
- Word-by-word fallback
- Multi-sentence support
- Language detection

### **6. voice.js** - Voice Features
- Web Speech API integration
- Speech-to-text (Arabic/English)
- Text-to-speech output
- Error handling

### **7. app.js** - Main Controller
- Coordinates all modules
- Lesson navigation
- Progress tracking
- PWA installation

### **8. manifest.json** - PWA Config
- App metadata
- Icon definitions
- Display settings
- Installation behavior

### **9. service-worker.js** - Offline Support
- Caches app files
- Offline functionality
- Cache management
- Network strategies

---

## 🎨 **CREATING APP ICONS**

You need to create two icon files:

### **Method 1: Online Tool**
1. Go to https://realfavicongenerator.net/
2. Upload your logo/design
3. Generate and download icons
4. Place in project root

### **Method 2: Manual Creation**
1. Create a 512x512px PNG in Figma/Canva
2. Resize to 192x192px for smaller icon
3. Name them: `icon-512.png` and `icon-192.png`

**Design Tips:**
- Simple, recognizable symbol
- High contrast
- No small text
- Test on different backgrounds

---

## 🔧 **CUSTOMIZATION GUIDE**

### **Adding More Phrases**

Edit `phrases.js`:

```javascript
// Add to phrases object
"new_arabic_phrase": {
  en: "English translation",
  pron: "Pronunciation",
  category: "category_name"
},

// Add reverse mapping
"english phrase": {
  ar: "new_arabic_phrase",
  pron: "Pronunciation"
}
```

### **Adding Lessons**

Edit `lessons.js`:

```javascript
{
  ar: "Arabic text",
  pron: "Pronunciation",
  en: "English meaning",
  tip: "Learning tip or cultural note",
  level: "beginner" // or "intermediate", "advanced"
}
```

### **Changing Colors**

Edit `style.css`:

```css
/* Find these color variables and change them */
--primary: #667eea;   /* Purple blue */
--secondary: #764ba2; /* Dark purple */
```

### **Adding Categories**

Edit `phrases.js` and add category:

```javascript
category: "food"  // numbers, colors, travel, etc.
```

---

## 📱 **BROWSER COMPATIBILITY**

| Browser | Translation | Voice Input | Voice Output | PWA Install |
|---------|------------|-------------|--------------|-------------|
| Chrome | ✅ | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ | ✅ |
| Safari | ✅ | ❌ | ⚠️ Limited | ⚠️ Limited |
| Firefox | ✅ | ❌ | ✅ | ❌ |
| Opera | ✅ | ✅ | ✅ | ✅ |

**Recommended:** Chrome or Edge for full feature support

---

## 🐛 **TROUBLESHOOTING**

### **Voice input not working**
- ✅ Use Chrome or Edge
- ✅ Enable microphone permission
- ✅ Check internet connection (required for voice)
- ✅ Speak clearly and pause briefly

### **PWA won't install**
- ✅ Must be served over HTTPS (or localhost)
- ✅ manifest.json must be valid
- ✅ Service worker must register successfully
- ✅ Icons must exist at specified paths

### **Service worker issues**
```javascript
// In DevTools Console, unregister:
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister()
  }
})
```

### **Cache problems**
```javascript
// Clear all caches:
caches.keys().then(names => {
  names.forEach(name => caches.delete(name))
})
```

---

## 🚀 **DEPLOYMENT**

### **Option 1: GitHub Pages (Free)**

1. Create GitHub repository
2. Push all files
3. Go to Settings → Pages
4. Select branch → Save
5. Your app is live at `https://username.github.io/repo-name`

### **Option 2: Netlify (Free)**

1. Drag folder to https://app.netlify.com/drop
2. Your app is instantly live!

### **Option 3: Vercel (Free)**

```bash
npm install -g vercel
vercel
```

### **Important for PWA:**
- Must use HTTPS (all above provide it)
- Service worker requires secure origin

---

## 📈 **EXPANSION ROADMAP**

### **Phase 1: Enhanced Dictionary (Easy)**
- Add 500+ more phrases
- Include numbers 1-100
- Add colors, food, travel phrases
- Regional dialect variations

### **Phase 2: Learning Features (Medium)**
- Quiz mode after every 5 lessons
- Flashcard system with spaced repetition
- Progress charts and statistics
- Achievements and badges

### **Phase 3: AI Translation (Advanced)**
- Integrate Claude AI API
- Google Translate API
- Context-aware translation
- Grammar correction

### **Phase 4: Community (Advanced)**
- User-generated phrases
- Share progress on social media
- Leaderboards
- Discussion forums

---

## 🤝 **CONTRIBUTING**

This is open source! Contributions welcome:

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

**Areas needing help:**
- Adding more phrases
- Arabic dialect variations
- UI/UX improvements
- Translation accuracy
- Bug fixes

---

## 📄 **LICENSE**

MIT License - Use freely for any purpose!

---

## 🙏 **CREDITS**

- Created by [Your Name]
- Built with vanilla JavaScript (no frameworks!)
- Uses browser Web Speech API
- Inspired by language learning apps

---

## 📧 **SUPPORT**

- Found a bug? Open an issue
- Have questions? Start a discussion
- Want to contribute? Read CONTRIBUTING.md

---

## ⭐ **SHOW YOUR SUPPORT**

If this helped you learn Arabic:
- ⭐ Star the repository
- 📢 Share with friends
- 🐛 Report bugs
- 💡 Suggest features

---

**Made with ❤️ for Arabic learners worldwide**

🌍 **Arabic speakers:** 422 million native speakers  
📚 **Learning:** Millions more studying globally  
🎯 **Mission:** Make Arabic accessible to everyone

---

*Last updated: December 2024*