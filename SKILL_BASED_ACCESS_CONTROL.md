# ✅ Skill-Based Access Control System

## 🎯 Overview

Implemented a **category-specific skill testing system** where users must pass individual skill tests for each technical category to access those jobs.

---

## 🔐 How It Works

### **3-Level Access System:**

```
Level 1: General Quiz (Entry Level)
   ↓
Pass → See Technical Work categories

Level 2: Category-Specific Quiz (Per Skill)
   ↓
Click category → Take skill test (1 attempt)
   ↓
   ├─ Pass → ✅ Unlock that category's jobs
   └─ Fail → 🔒 Category locked forever

Level 3: Job Access
   ↓
Only see jobs for skills you've unlocked
```

---

## 📊 Category States

Each technical category has 3 possible states:

### **1. 📝 Available (Blue Badge)**
- **Condition:** User hasn't attempted this skill test yet
- **Badge:** "📝 Take Test"
- **Action:** Click → Prompt to take skill test
- **Message:** "To access [Category] jobs, you need to pass a skill test"

### **2. ✅ Unlocked (Green Badge)**
- **Condition:** User passed this skill test
- **Badge:** "✅ Unlocked"
- **Action:** Click → Navigate to category jobs
- **Result:** See all jobs in this category

### **3. 🔒 Locked (Red Badge)**
- **Condition:** User attempted but failed the skill test
- **Badge:** "🔒 Locked"
- **Action:** Click → Show locked message
- **Message:** "You attempted the [Category] skill test but didn't pass. This skill remains locked."
- **Note:** Can still attempt other skills!

---

## 🔄 Complete User Flow

### **New User Journey:**

```
Step 1: Sign Up
   ↓
Step 2: General Quiz (5 questions, any category)
   ↓
   ├─ Fail (< 60%) → Only Daily Work jobs
   │
   └─ Pass (≥ 60%) → Technical Work categories visible
        ↓
        HomeScreen shows:
        ┌─────────────────────┐
        │ Technical Work      │
        │                     │
        │ ⚡ Electrician      │
        │ 📝 Take Test        │  ← All show "Take Test"
        │                     │
        │ 💧 Plumber          │
        │ 📝 Take Test        │
        │                     │
        │ 🔨 Carpenter        │
        │ 📝 Take Test        │
        └─────────────────────┘
```

### **Taking Skill Tests:**

```
Step 3: Click "Electrician"
   ↓
Alert: "To access Electrician jobs, pass skill test"
[Later] [Take Test]
   ↓
Step 4: Click "Take Test"
   ↓
Navigate to QuizScreen with category: "Electrician"
   ↓
Step 5: Take Electrician-specific quiz
   ↓
   ├─ Pass (≥ 60%) → ✅ Electrician Unlocked!
   │    ↓
   │    Electrician jobs now accessible
   │    Badge: "✅ Unlocked"
   │
   └─ Fail (< 60%) → 🔒 Electrician Locked!
        ↓
        Cannot access Electrician jobs
        Badge: "🔒 Locked"
        Can still try Plumber, Carpenter, etc.
```

---

## 📱 UI Examples

### **Before Taking Any Skill Test:**

```
Technical Work
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   ⚡             │  │   💧             │  │   🔨             │
│   Electrician   │  │   Plumber       │  │   Carpenter     │
│ 📝 Take Test    │  │ 📝 Take Test    │  │ 📝 Take Test    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
    All blue badges - all available to test
```

### **After Passing Electrician, Failing Plumber:**

```
Technical Work
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   ⚡             │  │   💧             │  │   🔨             │
│   Electrician   │  │   Plumber       │  │   Carpenter     │
│ ✅ Unlocked     │  │ 🔒 Locked       │  │ 📝 Take Test    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
   Green - works!      Red - blocked!      Blue - try it!
```

---

## 💻 Technical Implementation

### **Frontend Changes (`HomeScreen.js`):**

#### **1. Added State for User Skills:**
```javascript
const [userSkills, setUserSkills] = useState({});
// Format: { 
//   'Electrician': { passed: true, attempted: true, score: 4, percentage: 80 },
//   'Plumber': { passed: false, attempted: true, score: 2, percentage: 40 },
//   'Carpenter': { passed: false, attempted: false }
// }
```

#### **2. Load Skills on Mount:**
```javascript
const loadUserSkills = async () => {
  const quizResults = await api.get('/api/quiz/my-results', { auth: true });
  
  const skillsMap = {};
  quizResults.forEach(quiz => {
    if (quiz.category) {
      skillsMap[quiz.category] = {
        passed: quiz.passed,
        attempted: true,
        score: quiz.score,
        percentage: quiz.percentage
      };
    }
  });
  
  setUserSkills(skillsMap);
};
```

#### **3. Check Access on Category Click:**
```javascript
const handleCategoryPress = async (category) => {
  // Daily Work - always accessible
  if (!category.requiresTest) {
    navigation.navigate('CategoryJobs', { ... });
    return;
  }

  // Technical Work - check skill status
  const skillStatus = userSkills[category.name];
  
  if (skillStatus?.passed) {
    // ✅ Unlocked - allow access
    navigation.navigate('CategoryJobs', { ... });
  } else if (skillStatus?.attempted && !skillStatus?.passed) {
    // 🔒 Locked - show error
    Alert.alert('Skills Locked', '...');
  } else {
    // 📝 Available - offer test
    Alert.alert('Skill Test', '...', [
      { text: 'Later' },
      { text: 'Take Test', onPress: () => navigation.navigate('QuizScreen', { category }) }
    ]);
  }
};
```

#### **4. Dynamic Badges:**
```javascript
{technicalCategories.map(category => {
  const skillStatus = userSkills[category.name];
  const isPassed = skillStatus?.passed;
  const isLocked = skillStatus?.attempted && !skillStatus?.passed;
  const isAvailable = !skillStatus?.attempted;

  return (
    <TouchableOpacity ...>
      {isPassed && <Badge text="Unlocked" color="green" />}
      {isLocked && <Badge text="Locked" color="red" />}
      {isAvailable && <Badge text="Take Test" color="blue" />}
    </TouchableOpacity>
  );
})}
```

---

## 🗄️ Database Schema

### **Quiz Collection:**
```javascript
{
  user: ObjectId,
  category: String,      // ← KEY: "Electrician", "Plumber", etc.
  passed: Boolean,       // ← true if score ≥ 60%
  score: Number,
  totalQuestions: Number,
  percentage: Number,
  completedAt: Date
}
```

### **Query to Get User Skills:**
```javascript
// Get all quiz attempts for a user
const quizzes = await Quiz.find({ user: userId });

// Group by category - latest attempt only
const skillsMap = {};
quizzes.forEach(quiz => {
  if (!skillsMap[quiz.category] || quiz.completedAt > skillsMap[quiz.category].completedAt) {
    skillsMap[quiz.category] = quiz;
  }
});
```

---

## 🔄 State Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│ User passes general quiz                                 │
│ testStatus = 'passed'                                    │
└──────────────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────────┐
│ Technical Work categories appear                         │
│ All show: "📝 Take Test" (blue)                         │
└──────────────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────────────┐
│ User clicks "Electrician"                                │
│ Check: userSkills['Electrician']                         │
└──────────────────────────────────────────────────────────┘
                      ↓
         ┌────────────┴────────────┐
         │                         │
    undefined                  attempted
         │                         │
         ↓                         ↓
   📝 Take Test            Check: passed?
   Show prompt                    │
         │              ┌─────────┴─────────┐
         ↓              │                   │
   Navigate to     passed=true        passed=false
   QuizScreen           │                   │
         │              ↓                   ↓
         ↓         ✅ Unlocked         🔒 Locked
   Complete quiz   Navigate to       Show error
         │         CategoryJobs       "Locked"
         ↓
   Save result
   Update userSkills
         ↓
   Return to HomeScreen
   Badge updates!
```

---

## 🧪 Testing Scenarios

### **Scenario 1: New User - First Category**

**Setup:**
- User just passed general quiz
- Never attempted any skill tests

**Test:**
1. See Technical Work categories
2. All show: "📝 Take Test" (blue)
3. Click "Electrician"

**Expected:**
```
Alert: "Electrician Skill Test"
"To access Electrician jobs, you need to pass a skill test for this category.

You get 1 attempt. Pass = Unlock jobs"

[Later] [Take Test]
```

4. Click "Take Test"
5. Navigate to QuizScreen
6. Complete quiz (80% score)
7. Return to HomeScreen

**Expected:**
- Electrician badge: "✅ Unlocked" (green)
- Others still: "📝 Take Test" (blue)

---

### **Scenario 2: Failed Skill Test**

**Setup:**
- User attempts Plumber skill test
- Scores 40% (fails)

**Test:**
1. Return to HomeScreen
2. Plumber shows: "🔒 Locked" (red, dimmed)
3. Click "Plumber"

**Expected:**
```
Alert: "Plumber Skills Locked"
"You attempted the Plumber skill test but didn't pass. This skill remains locked.

You can still attempt tests for other skills."

[OK]
```

**Result:** Cannot access Plumber jobs

---

### **Scenario 3: Multiple Skills**

**Setup:**
- Electrician: Passed (✅)
- Plumber: Failed (🔒)
- Carpenter: Not attempted (📝)

**Test:**
1. View Technical Work categories

**Expected Display:**
```
⚡ Electrician  → ✅ Unlocked
💧 Plumber     → 🔒 Locked
🔨 Carpenter   → 📝 Take Test
```

2. Click Electrician → Navigate to jobs ✅
3. Click Plumber → Alert: "Locked" ❌
4. Click Carpenter → Prompt: "Take Test?" 📝

---

## ✅ Benefits

### **For Workers:**
- ✅ **Fair progression** - prove skills for each category
- ✅ **Multiple opportunities** - one skill failing doesn't block others
- ✅ **Clear status** - know exactly which skills are unlocked
- ✅ **Motivation** - badges show achievement

### **For Employers:**
- ✅ **Quality assurance** - workers tested in specific skills
- ✅ **Better matches** - workers qualified for the category
- ✅ **Reduced training** - workers have baseline knowledge
- ✅ **Trust indicator** - passed test = verified skill level

### **For Platform:**
- ✅ **Skill verification** - automated testing system
- ✅ **Job quality** - better applicant-job matching
- ✅ **User engagement** - gamification with unlockable categories
- ✅ **Data tracking** - know which skills users have

---

## 🎯 Business Logic

### **Why 1 Attempt Per Skill?**

1. **Prevents Guessing:** Users can't repeatedly attempt until they pass
2. **Encourages Learning:** Must prepare before attempting
3. **Maintains Standards:** Failed test = insufficient knowledge
4. **Platform Quality:** Only qualified workers access jobs

### **Why Multiple Skills Available?**

1. **Flexibility:** Failing one skill doesn't end journey
2. **Discovery:** Users can find their true strengths
3. **Engagement:** Multiple paths to success
4. **Market Coverage:** Platform serves diverse job types

---

## 🔧 Future Enhancements

### **Potential Additions:**

1. **Skill Retake (with waiting period):**
   ```javascript
   failedDate + 30days = canRetake
   ```

2. **Study Materials Before Test:**
   - Show learning resources
   - Practice questions
   - Video tutorials

3. **Skill Levels (Basic → Advanced):**
   ```
   Electrician Basic (Pass 60%) → Helper jobs
   Electrician Advanced (Pass 80%) → Expert jobs
   ```

4. **Certificates:**
   - Generate PDF certificate for passed skills
   - Share on profile
   - Show to employers

---

## 📊 Analytics Tracking

**Metrics to Track:**
- Skill test attempt rate per category
- Pass rate per skill category
- Most/least passed skills
- Time spent before attempting test
- Correlation: test score vs job applications

---

## 🎯 Summary

### **Problem Solved:**
- ❌ Users accessing jobs without relevant skills
- ❌ No verification of category-specific knowledge
- ❌ All-or-nothing quiz system (pass once = access everything)

### **Solution Implemented:**
- ✅ Category-specific skill testing
- ✅ Individual unlock system per skill
- ✅ Visual badges showing lock status
- ✅ 1 attempt per skill (prevents gaming)
- ✅ Failed skills don't block other skills

### **Files Modified:**
- ✅ `Screens/HomeScreen.js` - Logic + UI
- ✅ Backend already supports it (Quiz model has `category` field)

---

**Status:** ✅ Complete - Skill-based access control implemented!  
**Date:** January 31, 2026  
**Type:** Category-specific skill verification with unlock system  
**Attempts:** 1 per skill (no retries if failed)
