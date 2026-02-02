# 💼 Work Preferences Feature

## 📋 Implementation Complete

Created a comprehensive work preferences screen that appears after signup to help match workers with relevant jobs!

---

## ✨ **What's New:**

### **1. Work Preferences Screen** 📝

A beautiful onboarding screen that collects:
- ✅ Work Categories (up to 5)
- ✅ Work Types (Full Time, Part Time, etc.)
- ✅ Availability (When can start)
- ✅ Experience Level (New to Expert)

---

## 📱 **User Journey:**

### **New User Signup Flow:**

```
Sign Up Screen
     ↓
Enter details (Name, Email, Phone, Password, Location)
     ↓
Tap "Sign Up"
     ↓
Account created ✓
     ↓
Navigate to Work Preferences Screen
     ↓
Select preferences
     ↓
Tap "Save Preferences"
     ↓
Navigate to Home (WorkerTabNavigator)
     ↓
Start finding jobs!
```

### **Option to Skip:**

```
Work Preferences Screen
     ↓
Tap "Skip" button (top right)
     ↓
Confirmation dialog
"You can set preferences later from profile"
     ↓
Tap "Skip"
     ↓
Navigate to Home
```

---

## 🎯 **Work Preferences Sections:**

### **1. Work Categories** 🔧

Select up to 5 categories:

```
┌─────────────────────────────────────┐
│ 🔨 Construction  ⚡ Electrician     │
│ 🔧 Plumber      🪛 Carpenter        │
│ 🎨 Painter      ⚙️ Mechanic         │
│ 🚴 Delivery     🚗 Driver           │
│ 🏠 Housekeeping 🌱 Gardening        │
│ 🛡️ Security     💻 Data Entry       │
└─────────────────────────────────────┘
```

**Grid Layout:**
- 3 columns
- Icon + Name
- Checkmark badge when selected
- Limit: Maximum 5 categories

---

### **2. Work Types** ⏰

Select all that apply:

```
┌─────────────────────────────────────┐
│ 💼 Full Time                    ✓   │
│    Work full-time hours             │
│                                     │
│ ⏰ Part Time                     ✓   │
│    Work part-time hours             │
│                                     │
│ 📄 Contract                         │
│    Project-based work               │
│                                     │
│ 🚀 Freelance                        │
│    Independent projects             │
└─────────────────────────────────────┘
```

**Options:**
- Full Time
- Part Time
- Contract
- Freelance

---

### **3. Availability** 📅

When can you start?

```
┌─────────────────────────────────────┐
│ ✅ Immediate                     ✓   │
│    Can start now                    │
│                                     │
│ 📆 Within 1 Week                    │
│    Ready in a week                  │
│                                     │
│ 📆 Within 2 Weeks                   │
│    Ready in 2 weeks                 │
│                                     │
│ 📆 Within 1 Month                   │
│    Ready in a month                 │
└─────────────────────────────────────┘
```

**Options:**
- Immediate
- Within 1 Week
- Within 2 Weeks
- Within 1 Month

---

### **4. Experience Level** 🏆

Select your experience:

```
┌─────────────────────────────────────┐
│ 🌱 New Worker                    ✓   │
│    0-1 years                        │
│                                     │
│ 🏆 Intermediate                     │
│    1-3 years                        │
│                                     │
│ ⭐ Experienced                      │
│    3-5 years                        │
│                                     │
│ 🏅 Expert                           │
│    5+ years                         │
└─────────────────────────────────────┘
```

**Options:**
- New Worker (0-1 years)
- Intermediate (1-3 years)
- Experienced (3-5 years)
- Expert (5+ years)

---

## 💻 **Technical Implementation:**

### **Frontend (`WorkPreferencesScreen.js`):**

#### **State Management:**
```javascript
const [selectedCategories, setSelectedCategories] = useState([]);
const [selectedWorkType, setSelectedWorkType] = useState([]);
const [selectedAvailability, setSelectedAvailability] = useState('');
const [selectedExperience, setSelectedExperience] = useState('');
const [isLoading, setIsLoading] = useState(false);
```

#### **Save Preferences:**
```javascript
const handleSavePreferences = async () => {
  // Validation
  if (selectedCategories.length === 0) {
    Alert.alert('Required', 'Please select at least one work category');
    return;
  }

  const preferences = {
    workCategories: selectedCategories,
    workTypes: selectedWorkType,
    availability: selectedAvailability,
    experienceLevel: selectedExperience,
  };

  // Save to backend
  await api.put('/api/users/work-preferences', preferences, { auth: true });

  // Save to AsyncStorage
  await AsyncStorage.setItem('workPreferences', JSON.stringify(preferences));
  await AsyncStorage.setItem('workPreferencesCompleted', 'true');

  // Navigate to home
  navigation.reset({
    index: 0,
    routes: [{ name: 'WorkerTabNavigator' }],
  });
};
```

---

### **Backend (`backend/routes/users.js`):**

#### **Save Work Preferences Endpoint:**
```javascript
// @route   PUT /api/users/work-preferences
// @desc    Update user work preferences
// @access  Private
router.put('/work-preferences', auth, async (req, res) => {
  const { workCategories, workTypes, availability, experienceLevel } = req.body;
  
  const user = await User.findById(req.userId);
  
  // Update preferences
  user.workCategories = workCategories;
  user.workTypes = workTypes;
  user.availability = availability;
  user.experienceLevel = experienceLevel;
  user.workPreferencesCompleted = true;
  
  await user.save();
  
  res.json({ message: 'Work preferences saved successfully' });
});
```

#### **Get Work Preferences Endpoint:**
```javascript
// @route   GET /api/users/work-preferences
// @desc    Get user work preferences
// @access  Private
router.get('/work-preferences', auth, async (req, res) => {
  const user = await User.findById(req.userId)
    .select('workCategories workTypes availability experienceLevel workPreferencesCompleted');
  
  res.json({
    workCategories: user.workCategories || [],
    workTypes: user.workTypes || [],
    availability: user.availability || '',
    experienceLevel: user.experienceLevel || '',
    workPreferencesCompleted: user.workPreferencesCompleted || false
  });
});
```

---

### **Database Model (`backend/models/User.js`):**

#### **New Fields:**
```javascript
// Work Preferences
workCategories: [{
  type: String
}],
workTypes: [{
  type: String
}],
experienceLevel: {
  type: String,
  enum: ['new', 'intermediate', 'experienced', 'expert'],
  default: 'new'
},
workPreferencesCompleted: {
  type: Boolean,
  default: false
},
```

#### **Updated Field:**
```javascript
availability: { 
  type: mongoose.Schema.Types.Mixed, // Can be Boolean or String
  default: true 
},
```

---

## 🎨 **UI/UX Features:**

### **1. Grid Layout for Categories:**
```javascript
<View style={styles.grid}>
  {workCategories.map((category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.gridItem,
        selectedCategories.includes(category.id) && styles.gridItemSelected,
      ]}
      onPress={() => toggleCategory(category.id)}
    >
      <Ionicons name={category.icon} size={28} color={...} />
      <Text>{category.name}</Text>
      {selectedCategories.includes(category.id) && (
        <View style={styles.checkBadge}>
          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  ))}
</View>
```

### **2. List Layout for Options:**
```javascript
<View style={styles.optionList}>
  {availabilityOptions.map((option) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        selectedAvailability === option.id && styles.optionItemSelected,
      ]}
      onPress={() => setSelectedAvailability(option.id)}
    >
      <View style={styles.optionContent}>
        <Text>{option.name}</Text>
        <Text>{option.subtitle}</Text>
      </View>
      {selectedAvailability === option.id && (
        <Ionicons name="checkmark-circle" size={24} color="#4F46E5" />
      )}
    </TouchableOpacity>
  ))}
</View>
```

### **3. Visual Feedback:**
- ✅ Selected items highlight in purple (#4F46E5)
- ✅ Checkmark badges appear
- ✅ Border color changes
- ✅ Background color changes to light purple
- ✅ Icons change color

---

## 🔄 **Navigation Flow:**

### **Updated Signup Flow:**

**Before:**
```
SignUpScreen → WorkerTabNavigator
```

**After:**
```
SignUpScreen → WorkPreferencesScreen → WorkerTabNavigator
```

### **Code Change in SignUpScreen.js:**
```javascript
// Before:
navigation.reset({ index: 0, routes: [{ name: 'WorkerTabNavigator' }] });

// After:
navigation.reset({ 
  index: 0, 
  routes: [{ 
    name: 'WorkPreferencesScreen',
    params: { fromSignup: true }
  }] 
});
```

---

## ✅ **Validation:**

### **Required Fields:**

1. **Work Categories:** At least 1 (max 5)
2. **Work Types:** At least 1
3. **Availability:** Exactly 1
4. **Experience Level:** Exactly 1

### **Validation Messages:**
```javascript
// Work Categories
if (selectedCategories.length === 0) {
  Alert.alert('Required', 'Please select at least one work category');
  return;
}

// Max 5 categories
if (selectedCategories.length >= 5) {
  Alert.alert('Limit Reached', 'You can select up to 5 categories');
  return;
}

// Work Types
if (selectedWorkType.length === 0) {
  Alert.alert('Required', 'Please select at least one work type');
  return;
}

// Availability
if (!selectedAvailability) {
  Alert.alert('Required', 'Please select your availability');
  return;
}

// Experience Level
if (!selectedExperience) {
  Alert.alert('Required', 'Please select your experience level');
  return;
}
```

---

## 📊 **Data Storage:**

### **AsyncStorage:**
```javascript
// Save preferences locally
await AsyncStorage.setItem('workPreferences', JSON.stringify(preferences));
await AsyncStorage.setItem('workPreferencesCompleted', 'true');
await AsyncStorage.setItem('userSkillLevel', selectedExperience);
```

### **Backend:**
```javascript
// MongoDB User document
{
  workCategories: ['electrician', 'plumber', 'carpenter'],
  workTypes: ['fullTime', 'partTime'],
  availability: 'immediate',
  experienceLevel: 'intermediate',
  workPreferencesCompleted: true
}
```

---

## 🎯 **Use Cases:**

### **1. Better Job Matching:**
```
User preferences:
- Categories: Electrician, Plumber
- Types: Full Time
- Availability: Immediate
- Experience: Intermediate

↓

Jobs shown:
- Electrician jobs (Full Time)
- Plumber jobs (Full Time)
- Immediate start jobs
- Intermediate level jobs
```

### **2. Personalized Recommendations:**
```
Based on preferences:
- Show relevant job categories
- Filter by work type
- Match experience level
- Consider availability
```

### **3. Profile Completion:**
```
Work preferences completed → Profile 100%
↓
Better visibility to employers
↓
More job opportunities
```

---

## 🚀 **Future Enhancements:**

### **Potential Features:**

1. **Smart Suggestions** 🤖
   - Suggest categories based on location
   - Recommend work types based on experience

2. **Skill Matching** 🎯
   - Match preferences with skills
   - Suggest skill assessments

3. **Job Alerts** 📢
   - Notify about matching jobs
   - Daily/weekly job digests

4. **Preference Updates** ✏️
   - Allow editing from profile
   - Track preference changes

5. **Analytics** 📊
   - Show job match rate
   - Suggest preference improvements

---

## 🧪 **Testing:**

```bash
# Rebuild app
npx expo start -c

# Test Signup Flow:
1. Open app
2. Tap "Sign Up"
3. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Password: test123
   - Location: Hyderabad
4. Tap "Sign Up"
5. ✓ Navigate to Work Preferences Screen

# Test Work Preferences:
1. ✓ See header "Work Preferences"
2. ✓ See "Skip" button (top right)
3. Select categories:
   - Tap Electrician ✓
   - Tap Plumber ✓
   - Tap Carpenter ✓
   - ✓ See checkmark badges
   - ✓ Highlight in purple
4. Try selecting 6th category:
   - ✓ Alert: "Limit Reached"
5. Select work types:
   - Tap Full Time ✓
   - Tap Part Time ✓
   - ✓ Both highlighted
6. Select availability:
   - Tap "Immediate" ✓
   - ✓ Checkmark appears
7. Select experience:
   - Tap "Intermediate" ✓
   - ✓ Checkmark appears
8. Tap "Save Preferences"
   - ✓ Loading shows
   - ✓ Success message
   - ✓ Navigate to Home

# Test Skip:
1. At Work Preferences screen
2. Tap "Skip"
3. ✓ Confirmation dialog
4. Tap "Skip" again
5. ✓ Navigate to Home

# Test Validation:
1. Don't select any category
2. Tap "Save Preferences"
3. ✓ Alert: "Please select at least one work category"

# Test Backend:
1. Check MongoDB:
   - User document updated
   - workCategories array populated
   - workTypes array populated
   - availability string set
   - experienceLevel set
   - workPreferencesCompleted: true
```

---

## 📁 **Files Created/Modified:**

### **Created:**
1. **`Screens/WorkPreferencesScreen.js`**
   - Complete preferences UI
   - Validation logic
   - Save functionality
   - 600+ lines

2. **`WORK_PREFERENCES_FEATURE.md`**
   - Complete documentation
   - Usage guide
   - API documentation

### **Modified:**
1. **`navigation/AppNavigator.js`**
   - Import WorkPreferencesScreen
   - Add route

2. **`Screens/SignUpScreen.js`**
   - Navigate to WorkPreferencesScreen
   - Pass fromSignup param

3. **`backend/routes/users.js`**
   - PUT /work-preferences endpoint
   - GET /work-preferences endpoint
   - Validation and saving

4. **`backend/models/User.js`**
   - workCategories field
   - workTypes field
   - experienceLevel field
   - workPreferencesCompleted field
   - Updated availability type

---

## 🎨 **Design Highlights:**

### **Color Scheme:**
- Primary: `#4F46E5` (Indigo)
- Selected BG: `#EEF2FF` (Light Indigo)
- Text: `#1F2937` (Dark Gray)
- Subtitle: `#6B7280` (Medium Gray)
- Border: `#E5E7EB` (Light Gray)

### **Layout:**
- **Categories:** 3-column grid
- **Options:** Full-width list
- **Spacing:** Consistent 16px padding
- **Border Radius:** 12px rounded corners
- **Icons:** 22-28px size

### **Interactions:**
- Tap to select/deselect
- Visual feedback on selection
- Smooth transitions
- Loading states
- Success/error alerts

---

## ✅ **Summary:**

| Component | Status |
|-----------|--------|
| **Work Preferences Screen** | ✅ Created |
| **Categories Selection** | ✅ Grid layout |
| **Work Types Selection** | ✅ Multi-select |
| **Availability Selection** | ✅ Single select |
| **Experience Selection** | ✅ Single select |
| **Validation** | ✅ Complete |
| **Backend API** | ✅ Implemented |
| **Database Model** | ✅ Updated |
| **Navigation** | ✅ Integrated |
| **Skip Option** | ✅ Available |
| **Loading States** | ✅ Handled |
| **Error Handling** | ✅ Complete |

---

**Work preferences feature is now complete! New users will set their preferences after signup for better job matching!** 💼✨🚀
