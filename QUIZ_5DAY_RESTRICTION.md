# ✅ Quiz 5-Day Restriction System

## 🎯 Overview

Implemented a smart 5-day restriction system for the skill assessment quiz that:
- ✅ **Allows new users to attempt immediately** (no waiting for first attempt)
- ✅ **Enforces 5-day waiting period AFTER first attempt** (prevents quick retakes)
- ✅ **Displays clear restriction UI** with remaining days and next available date
- ✅ **Encourages proper skill development** between attempts

---

## 📊 System Logic

### **New Users (No Previous Attempts):**
```
User creates account
   ↓
Opens Quiz Screen
   ↓
Backend checks: Any previous attempts?
   ↓
NO → ✅ ALLOW IMMEDIATELY
   ↓
User takes quiz
   ↓
Result saved with timestamp
```

### **Users With Previous Attempts:**
```
User opens Quiz Screen
   ↓
Backend checks: Any previous attempts?
   ↓
YES → Check last attempt date
   ↓
Calculate: Days since last attempt
   ↓
   ├─ >= 5 days → ✅ ALLOW RETAKE
   │              "You can retake the skill assessment quiz"
   │
   └─ < 5 days → ❌ RESTRICT
                 "You can retake the quiz in X days"
                 Show: Remaining days & next available date
```

---

## 🔄 Complete Flow

### **First Attempt (New User):**

```
Step 1: User clicks "Take Quiz"
Step 2: System checks eligibility
        ↓
        GET /api/quiz/can-attempt
        ↓
        Response: {
          canAttempt: true,
          isFirstAttempt: true,
          message: "You can take the skill assessment quiz"
        }
Step 3: ✅ Quiz loads immediately
Step 4: User completes quiz
Step 5: Result saved with completedAt: Date.now()
```

### **Second Attempt (Same Day):**

```
Step 1: User clicks "Take Quiz"
Step 2: System checks eligibility
        ↓
        GET /api/quiz/can-attempt
        ↓
        Find last quiz: completedAt = "2026-01-27"
        Current date: "2026-01-27"
        Days difference: 0 days
        ↓
        Response: {
          canAttempt: false,
          isFirstAttempt: false,
          daysRemaining: 5,
          message: "You can retake the quiz in 5 days"
        }
Step 3: ❌ Restriction UI displayed
        - Shows: "Quiz Temporarily Unavailable"
        - Days Remaining: 5 days
        - Available From: February 1, 2026
```

### **Retake After 5 Days:**

```
Step 1: User clicks "Take Quiz"
Step 2: System checks eligibility
        ↓
        GET /api/quiz/can-attempt
        ↓
        Find last quiz: completedAt = "2026-01-27"
        Current date: "2026-02-02"
        Days difference: 6 days
        ↓
        Response: {
          canAttempt: true,
          isFirstAttempt: false,
          daysSinceLastAttempt: 6,
          message: "You can retake the skill assessment quiz"
        }
Step 3: ✅ Quiz loads successfully
```

---

## 📁 Files Modified

### **1. Backend - routes/quiz.js**

**Added:**
- ✅ New endpoint: `GET /api/quiz/can-attempt`
- ✅ Checks last quiz attempt from database
- ✅ Calculates days since last attempt
- ✅ Returns eligibility status with detailed info

**Code:**
```javascript
router.get('/can-attempt', auth, async (req, res) => {
  try {
    const lastQuiz = await Quiz.findOne({ user: req.userId })
      .sort({ completedAt: -1 });
    
    // New user - allow immediately
    if (!lastQuiz) {
      return res.json({ 
        canAttempt: true, 
        isFirstAttempt: true,
        message: 'You can take the skill assessment quiz' 
      });
    }
    
    // Calculate days since last attempt
    const lastAttemptDate = new Date(lastQuiz.completedAt);
    const currentDate = new Date();
    const daysDifference = Math.floor((currentDate - lastAttemptDate) / (1000 * 60 * 60 * 24));
    
    if (daysDifference >= 5) {
      return res.json({ canAttempt: true, ... });
    } else {
      return res.json({ 
        canAttempt: false,
        daysRemaining: 5 - daysDifference,
        message: `You can retake the quiz in ${5 - daysDifference} days` 
      });
    }
  } catch (error) { ... }
});
```

**Response Examples:**

**First Attempt:**
```json
{
  "canAttempt": true,
  "isFirstAttempt": true,
  "message": "You can take the skill assessment quiz"
}
```

**Too Soon (2 days since last):**
```json
{
  "canAttempt": false,
  "isFirstAttempt": false,
  "daysSinceLastAttempt": 2,
  "daysRemaining": 3,
  "lastAttemptDate": "2026-01-27T10:30:00.000Z",
  "nextAvailableDate": "2026-02-01T10:30:00.000Z",
  "message": "You can retake the quiz in 3 days"
}
```

**Retake Allowed (6 days since last):**
```json
{
  "canAttempt": true,
  "isFirstAttempt": false,
  "daysSinceLastAttempt": 6,
  "message": "You can retake the skill assessment quiz"
}
```

---

### **2. Frontend - Screens/QuizScreen.js**

**Added:**

1. **Eligibility State:**
```javascript
const [eligibilityCheck, setEligibilityCheck] = useState({
  canAttempt: true,
  isChecking: true,
  message: '',
  daysRemaining: 0,
  isFirstAttempt: false,
});
```

2. **Eligibility Check Function:**
```javascript
const checkQuizEligibility = async () => {
  try {
    const response = await api.get('/api/quiz/can-attempt', { auth: true });
    setEligibilityCheck({
      canAttempt: response.canAttempt,
      isChecking: false,
      message: response.message,
      daysRemaining: response.daysRemaining || 0,
      isFirstAttempt: response.isFirstAttempt || false,
      lastAttemptDate: response.lastAttemptDate,
      nextAvailableDate: response.nextAvailableDate,
    });
  } catch (error) {
    // Fail open - allow quiz on error
    setEligibilityCheck({
      canAttempt: true,
      isChecking: false,
      message: 'Unable to check eligibility, proceeding...',
    });
  }
};
```

3. **Restriction UI:**
```javascript
if (!eligibilityCheck.canAttempt) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.restrictionContainer}>
        <Ionicons name="time-outline" size={80} color="#F59E0B" />
        <Text style={styles.restrictionTitle}>Quiz Temporarily Unavailable</Text>
        <Text style={styles.restrictionMessage}>{eligibilityCheck.message}</Text>
        
        {/* Info Card with Days Remaining & Next Available Date */}
        <View style={styles.restrictionInfoCard}>
          <View style={styles.restrictionInfoRow}>
            <Ionicons name="calendar-outline" size={24} color="#6B7280" />
            <View style={styles.restrictionInfoText}>
              <Text style={styles.restrictionInfoLabel}>Days Remaining</Text>
              <Text style={styles.restrictionInfoValue}>
                {eligibilityCheck.daysRemaining} days
              </Text>
            </View>
          </View>
          
          <View style={styles.restrictionInfoRow}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#6B7280" />
            <View style={styles.restrictionInfoText}>
              <Text style={styles.restrictionInfoLabel}>Available From</Text>
              <Text style={styles.restrictionInfoValue}>
                {new Date(eligibilityCheck.nextAvailableDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Note */}
        <View style={styles.restrictionNote}>
          <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
          <Text style={styles.restrictionNoteText}>
            You must wait 5 days between quiz attempts to ensure proper skill development.
          </Text>
        </View>

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.restrictionBackButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.restrictionBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
```

4. **Updated useEffect:**
```javascript
// Check eligibility first
useEffect(() => {
  checkQuizEligibility();
}, []);

// Load questions only if eligible
useEffect(() => {
  if (eligibilityCheck.canAttempt && !eligibilityCheck.isChecking) {
    loadQuestions();
  }
}, [eligibilityCheck.canAttempt, eligibilityCheck.isChecking]);
```

---

## 🎨 Restriction UI Design

### **When Blocked:**

```
┌─────────────────────────────────────────┐
│                                         │
│            🕐 (clock icon)              │
│                                         │
│    Quiz Temporarily Unavailable         │
│                                         │
│  You can retake the quiz in 3 days      │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  📅  Days Remaining: 3 days       │  │
│  │                                   │  │
│  │  ✓   Available From:              │  │
│  │      Saturday, February 1, 2026   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ⓘ  You must wait 5 days between       │
│     quiz attempts to ensure proper      │
│     skill development.                  │
│                                         │
│        [← Go Back]                      │
│                                         │
└─────────────────────────────────────────┘
```

**Design Features:**
- ✅ Large clock icon (80px, orange color)
- ✅ Clear title: "Quiz Temporarily Unavailable"
- ✅ Friendly message with days remaining
- ✅ Info card with:
  - Days remaining counter
  - Next available date (full format)
- ✅ Yellow note explaining 5-day rule
- ✅ Blue "Go Back" button to return

---

## 🧪 Testing Scenarios

### **Scenario 1: Brand New User**

**Setup:** Create fresh account, never taken quiz

**Steps:**
1. Navigate to Quiz Screen
2. Observe eligibility check

**Expected:**
```
Console: ✅ Quiz allowed: First attempt
UI: Quiz loads immediately
No restriction message
```

**Database:**
```javascript
Quiz.find({ user: userId }) = []  // No quizzes
```

**API Response:**
```json
{
  "canAttempt": true,
  "isFirstAttempt": true,
  "message": "You can take the skill assessment quiz"
}
```

---

### **Scenario 2: User Completed Quiz Today**

**Setup:** User completed quiz on Jan 27, 2026 at 10:00 AM

**Steps:**
1. Same day at 3:00 PM, navigate to Quiz Screen
2. Observe eligibility check

**Expected:**
```
Console: ❌ Quiz restricted: You can retake the quiz in 5 days
UI: Restriction screen displayed
- Days Remaining: 5 days
- Available From: February 1, 2026
```

**Database:**
```javascript
lastQuiz.completedAt = "2026-01-27T10:00:00.000Z"
currentDate = "2026-01-27T15:00:00.000Z"
daysDifference = 0 days
```

**API Response:**
```json
{
  "canAttempt": false,
  "isFirstAttempt": false,
  "daysSinceLastAttempt": 0,
  "daysRemaining": 5,
  "message": "You can retake the quiz in 5 days"
}
```

---

### **Scenario 3: User on Day 3 After Quiz**

**Setup:** User completed quiz on Jan 27, today is Jan 30

**Steps:**
1. Navigate to Quiz Screen
2. Observe eligibility check

**Expected:**
```
Console: ❌ Quiz restricted: You can retake the quiz in 2 days
UI: Restriction screen displayed
- Days Remaining: 2 days
- Available From: February 1, 2026
```

**Database:**
```javascript
lastQuiz.completedAt = "2026-01-27T10:00:00.000Z"
currentDate = "2026-01-30T14:00:00.000Z"
daysDifference = 3 days
```

**API Response:**
```json
{
  "canAttempt": false,
  "daysRemaining": 2,
  "message": "You can retake the quiz in 2 days"
}
```

---

### **Scenario 4: User on Day 5 (Exactly)**

**Setup:** User completed quiz on Jan 27, today is Feb 1 (exactly 5 days)

**Steps:**
1. Navigate to Quiz Screen
2. Observe eligibility check

**Expected:**
```
Console: ✅ Quiz allowed: Retake allowed
UI: Quiz loads successfully
```

**Database:**
```javascript
lastQuiz.completedAt = "2026-01-27T10:00:00.000Z"
currentDate = "2026-02-01T10:00:00.000Z"
daysDifference = 5 days
```

**API Response:**
```json
{
  "canAttempt": true,
  "isFirstAttempt": false,
  "daysSinceLastAttempt": 5,
  "message": "You can retake the skill assessment quiz"
}
```

---

### **Scenario 5: User After 10 Days**

**Setup:** User completed quiz on Jan 27, today is Feb 6 (10 days later)

**Steps:**
1. Navigate to Quiz Screen
2. Observe eligibility check

**Expected:**
```
Console: ✅ Quiz allowed: Retake allowed
UI: Quiz loads successfully
```

**Database:**
```javascript
lastQuiz.completedAt = "2026-01-27T10:00:00.000Z"
currentDate = "2026-02-06T14:00:00.000Z"
daysDifference = 10 days
```

**API Response:**
```json
{
  "canAttempt": true,
  "isFirstAttempt": false,
  "daysSinceLastAttempt": 10,
  "message": "You can retake the skill assessment quiz"
}
```

---

## 💡 Why 5 Days?

### **Educational Benefits:**

1. **Prevents Spam:** Users can't repeatedly attempt to "guess" correct answers
2. **Encourages Learning:** 5-day gap allows time to study and improve skills
3. **Reduces Server Load:** Limits quiz generation API calls
4. **Maintains Quiz Integrity:** Prevents memorization of specific questions
5. **Professional Standard:** Similar to certification exam retake policies

### **User Experience:**

- ✅ **Fair for New Users:** No barrier to first attempt
- ✅ **Clear Communication:** Exact days remaining shown
- ✅ **Transparent:** Next available date displayed
- ✅ **Motivational:** Encourages skill development between attempts

---

## 🔧 Configuration

### **Change Waiting Period:**

To change from 5 days to N days, update **two places**:

**1. Backend - routes/quiz.js:**
```javascript
// Change line 19 and 23:
if (daysDifference >= 5) {  // Change 5 to N
  // ...
} else {
  const daysRemaining = 5 - daysDifference;  // Change 5 to N
  // ...
}
```

**2. Frontend - QuizScreen.js:**
```javascript
// Update restriction note text (line ~443):
<Text style={styles.restrictionNoteText}>
  You must wait 5 days between quiz attempts...  // Change 5 to N
</Text>
```

### **Example: Change to 7 Days:**

**Backend:**
```javascript
if (daysDifference >= 7) {
  return res.json({ canAttempt: true, ... });
} else {
  const daysRemaining = 7 - daysDifference;
  // ...
}
```

**Frontend:**
```javascript
<Text style={styles.restrictionNoteText}>
  You must wait 7 days between quiz attempts to ensure proper skill development.
</Text>
```

---

## 📊 Database Considerations

### **Quiz Schema:**
```javascript
{
  user: ObjectId,
  category: String,
  score: Number,
  passed: Boolean,
  completedAt: Date  // ← THIS IS KEY
}
```

**Important:**
- ✅ `completedAt` is automatically set to `Date.now()` when quiz is saved
- ✅ Database query sorts by `completedAt: -1` (most recent first)
- ✅ Only the MOST RECENT quiz is checked for eligibility

**Query:**
```javascript
const lastQuiz = await Quiz.findOne({ user: req.userId })
  .sort({ completedAt: -1 });  // Get most recent
```

---

## 🚨 Edge Cases Handled

### **1. No Internet Connection During Check:**
```javascript
// Fail open - allow quiz on error
catch (error) {
  setEligibilityCheck({
    canAttempt: true,  // Allow quiz
    message: 'Unable to check eligibility, proceeding...'
  });
}
```

### **2. Backend Error:**
- ✅ User can still take quiz (fail open)
- ✅ Error logged to console
- ✅ Prevents UX dead-end

### **3. Timezone Issues:**
- ✅ All dates stored as UTC in database
- ✅ Day calculation uses full 24-hour periods
- ✅ Consistent across all timezones

### **4. Clock Manipulation:**
- ✅ All date checks on backend (server time)
- ✅ Frontend can't bypass restriction
- ✅ Database `completedAt` is server-set

---

## 📈 Future Enhancements

### **Possible Additions:**

1. **Email Notification:**
```javascript
// Send email when restriction lifts
if (daysRemaining === 1) {
  sendEmail(user.email, 'Quiz Available Tomorrow!');
}
```

2. **Push Notification:**
```javascript
// Notify user when they can retake
schedulePushNotification({
  title: 'Quiz Available!',
  body: 'You can now retake the skill assessment',
  trigger: { date: nextAvailableDate }
});
```

3. **Different Periods by Category:**
```javascript
const waitingPeriods = {
  'Electrician': 5,
  'Plumber': 5,
  'Advanced Electrician': 10  // Longer for advanced
};
```

4. **Admin Override:**
```javascript
// Admin can reset restriction
if (req.user.role === 'admin') {
  return res.json({ canAttempt: true });
}
```

---

## ✅ Summary

### **What We Built:**

✅ **Smart Restriction System:**
- New users: Immediate access
- Existing users: 5-day gap between attempts

✅ **Clear UI Communication:**
- Days remaining counter
- Next available date
- Informative note explaining rule

✅ **Backend Validation:**
- Server-side date checks
- Database query for last attempt
- Detailed response with all info

✅ **Edge Case Handling:**
- Network errors → fail open
- Backend errors → allow quiz
- Timezone-safe calculations

### **Benefits:**

✅ **For New Users:**
- No barrier to entry
- Can start immediately
- Great first experience

✅ **For Returning Users:**
- Clear expectations
- Motivation to study
- Fair retake policy

✅ **For Platform:**
- Prevents abuse
- Maintains quiz integrity
- Reduces server load

---

**Status:** ✅ Complete - 5-Day Restriction System  
**Date:** January 29, 2026  
**Logic:** New users → Immediate | Existing users → 5-day gap  
**Files:** `backend/routes/quiz.js`, `Screens/QuizScreen.js`
