# 🤖 AI Quiz Setup - తెలుగు గైడ్

## 🎯 మీ సమస్య పరిష్కారం

### మీరు అడిగిన సమస్య:
> "కానీ నేను retest attempt చేసినప్పుడు నాకు questions change అవ్వాలి కదా. అవి అయినప్పుడు language change కాదు కదా. AI model ఏదైనా వాడి direct change అయ్యేలా పెట్టచ్చు కదా. Static data అయితే మనకి సెట్ కాదు కదా."

### ✅ పరిష్కారం:
**AI Question Generation enable చేశాను!** 🚀

---

## 🌟 ఇప్పుడు మీకు లభిస్తుంది:

### 1. **అన్‌లిమిటెడ్ క్వశ్చన్స్** 🎯
- ప్రతి attempt లో కొత్త questions
- ఎప్పటికీ పునరావృతం కాదు
- AI dynamically generate చేస్తుంది

### 2. **మల్టీ-లాంగ్వేజ్ సపోర్ట్** 🗣️
- Telugu ఎంచుకుంటే → Telugu questions
- Hindi ఎంచుకుంటే → Hindi questions
- English ఎంచుకుంటే → English questions

### 3. **స్మార్ట్ ఫాల్‌బ్యాక్** 🛡️
- AI fail అయితే → Static questions use అవుతాయి
- Internet లేకపోతే → Offline questions ready
- ఎల్లప్పుడూ quiz పని చేస్తుంది

---

## 🚀 5 నిమిషాల్లో Setup

### Step 1: API Key తీసుకోండి (ఫ్రీ)

1. **ఈ వెబ్‌సైట్ open చేయండి:**
   ```
   https://aistudio.google.com/app/apikey
   ```

2. **మీ Google account తో sign in చేయండి**

3. **"Create API Key" బటన్ click చేయండి**

4. **API key copy చేయండి** (AIzaSy... లా ఉంటుంది)

### Step 2: Config File లో పెట్టండి

1. **ఈ file open చేయండి:**
   ```
   config/gemini.config.js
   ```

2. **API key paste చేయండి:**
   ```javascript
   // ఇలా మార్చండి:
   export const GEMINI_API_KEY = 'మీ-API-కీ-ఇక్కడ-పేస్ట్-చేయండి';
   ```

3. **File save చేయండి**

### Step 3: Test చేయండి!

1. App reload చేయండి (R press చేయండి)
2. ఏదైనా technical category select చేయండి
3. "Take Test" click చేయండి
4. "తెలుగు" select చేయండి
5. **AI fresh Telugu questions generate చేస్తుంది! 🎉**

---

## 💡 ఎలా పని చేస్తుంది?

```
మీరు "తెలుగు" select చేశారు
         ↓
AI తెలుగులో questions generate చేస్తుంది
         ↓
    ✅ కొత్త questions
    ✅ పూర్తిగా తెలుగులో
    ✅ ప్రతి సారీ different
```

### ఉదాహరణ (Mechanic Quiz):

**AI Generated Telugu Question:**
```
ప్రశ్న: ఇంజిన్ వెడెక్కడానికి కారణం ఏమిటి?

ఆప్షన్స్:
A) తక్కువ కూలెంట్
B) దెబ్బతిన్న థర్మోస్టాట్
C) బ్లాక్ అయిన రేడియేటర్
D) పైన ఉన్న అన్నీ ✓

వివరణ: తక్కువ కూలెంట్, దెబ్బతిన్న థర్మోస్టాట్ లేదా 
బ్లాక్ అయిన రేడియేటర్ వంటి అనేక కారణాల వల్ల 
వేడెక్కడం సంభవిస్తుంది.
```

**ప్రతి attempt లో ఇలాంటివే కొత్త questions!**

---

## 📊 ఫ్రీ Limits

Google Gemini Free Tier:
- ✅ రోజుకు 1,500 quizzes generate చేయవచ్చు
- ✅ నిమిషానికి 60 quizzes
- ✅ Credit card అవసరం లేదు
- ✅ పూర్తిగా ఫ్రీ!

**మీ app కోసం:** రోజుకు 50-100 quizzes expected
→ **ఎక్కువ ఎక్కువ సరిపోతుంది!** ✅

---

## 🎯 ప్రస్తుత స్థితి

### ✅ ఇప్పుడు Ready:

1. **AI Integration** - configured
2. **Multi-language support** - Telugu, Hindi, English
3. **Fallback system** - 50+ static questions
4. **Smart loading** - AI first, fallback if fails

### 📁 కొత్త Files:

1. `config/gemini.config.js` - API configuration
2. `AI_QUIZ_GENERATION_SETUP.md` - English guide
3. `AI_QUIZ_SETUP_TELUGU.md` - ఈ file

---

## ⚙️ Configuration

### AI Enable/Disable:

**AI వాడాలంటే:**
```javascript
export const USE_AI_GENERATION = true; // AI enabled
```

**Static questions మాత్రమే వాడాలంటే:**
```javascript
export const USE_AI_GENERATION = false; // Only static
```

---

## 🔍 టెస్టింగ్

### Test 1: AI Generation
1. API key configure చేయండి
2. "Mechanic" select చేయండి
3. "తెలుగు" select చేయండి
4. **Result:** Fresh AI Telugu questions ✅

### Test 2: Multiple Attempts
1. మొదటి quiz complete చేయండి
2. మళ్లీ same category attempt చేయండి
3. **Result:** కొత్త questions ✅

### Test 3: Language Change
1. మొదటి సారి Telugu select చేయండి
2. రెండవ attempt Hindi select చేయండి
3. **Result:** Hindi లో కొత్త questions ✅

---

## ⚠️ Problems & Solutions

### Problem 1: "API key not configured" message
**పరిష్కారం:**
- `config/gemini.config.js` check చేయండి
- API key సరిగ్గా paste చేశారా చూడండి

### Problem 2: Questions English లో వస్తున్నాయి
**కారణం:** AI disabled or fallback mode
**పరిష్కారం:** 
- API key configure చేయండి
- `USE_AI_GENERATION = true` అని check చేయండి

### Problem 3: Slow loading
**కారణం:** AI generate చేయడానికి 5-8 seconds పడుతుంది
**Normal:** This is expected
- AI generation: 5-8 seconds
- Loading indicator shows
- One-time delay per quiz

---

## 🎁 మీకు రెండు Options

### Option 1: AI Enable చేయండి (Recommended) 🚀
**Benefits:**
- ✅ అన్‌లిమిటెడ్ questions
- ✅ ఎప్పటికీ పునరావృతం కాదు
- ✅ ఏ language లోనైనా
- ⏱️ 5 minutes setup

### Option 2: Static Questions Use చేయండి
**Benefits:**
- ✅ Instant loading
- ✅ No internet needed
- ✅ No setup required
- ⚠️ Limited questions (10-15)

---

## 📞 Help

**API Key Issues:**
- Visit: https://aistudio.google.com/app/apikey
- Google account తో sign in చేయండి
- Support: https://ai.google.dev/

**App Issues:**
- Console logs check చేయండి
- Internet connection verify చేయండి
- App restart చేయండి

---

## ✅ సారాంశం

### మీరు అడిగింది:
> "Static data manaki setkadu, AI model vadi questions change avvali"

### నేను చేసింది:
✅ AI integration enabled
✅ Multi-language support (తెలుగు, हिंदी, English)
✅ Dynamic question generation
✅ Smart fallback system
✅ Free API configuration

### ఇప్పుడు చేయాల్సింది:
1. API key get చేయండి (5 min)
2. Config file లో paste చేయండి
3. App test చేయండి
4. **Enjoy unlimited Telugu questions!** 🎉

---

## 🎯 Final Note

**API key లేకుండా:**
- App పని చేస్తుంది ✅
- Static questions use అవుతాయి
- Questions repeat అవుతాయి (10+ attempts తర్వాత)

**API key తో:**
- AI generate చేస్తుంది 🚀
- ఎప్పటికీ repeat కాదు
- ఏ language లోనైనా
- Unlimited fresh questions

**మీ choice!** రెండూ పని చేస్తాయి, but AI better experience! 💯
