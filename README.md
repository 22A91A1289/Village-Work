# 🏘️ Village Work - React Native App

A comprehensive job marketplace platform connecting rural workers with job opportunities. Built with React Native and Expo, this app serves as a bridge between skilled workers and employers in rural areas.

## 📱 Project Overview

Village Work is a mobile application designed to empower rural communities by providing a platform where workers can find job opportunities and employers can hire skilled labor. The app supports multiple user roles including Workers, Job Owners, and Administrators.

### 🎯 Key Features

- **Multi-Role Support**: Workers, Job Owners, and Admin roles
- **Job Management**: Create, browse, and manage job postings
- **Application System**: Apply for jobs and manage applications
- **Skill Assessment**: Built-in skill testing for workers
- **Real-time Notifications**: Instant updates on job applications and status changes
- **Location-based Job Search**: Find jobs near your location
- **Profile Management**: Complete user profiles with skills and work history
- **Payment Integration**: Secure payment processing for completed jobs

## 🏗️ Architecture

### Frontend Stack
- **React Native** with Expo
- **React Navigation** for navigation
- **AsyncStorage** for local data persistence
- **React Native Vector Icons** for UI icons
- **Expo Location** for location services

### Project Structure
```
Village-Work/
├── App.js                          # Main app entry point
├── navigation/                     # Navigation configuration
│   ├── AppNavigator.js            # Main navigation setup
│   └── BottomTabnavigator.js      # Tab navigation
├── Screens/                       # Application screens
│   ├── Authentication/            # Login, signup, role selection
│   ├── Worker/                    # Worker-specific screens
│   ├── Owner/                     # Owner-specific screens
│   └── Admin/                     # Admin management screens
├── components/                    # Reusable components
│   └── chatmessage.js            # Chat message component
└── assets/                       # Images and static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Village-Work
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For web
   npm run web
   ```

## 📱 App Features

### 🔐 Authentication System
- **Role Selection**: Choose between Worker, Owner, or Admin
- **Login/Signup**: Secure authentication with demo credentials
- **Profile Setup**: Complete profile creation with skills and experience

### 👷 Worker Features
- **Job Discovery**: Browse jobs by category and location
- **Job Applications**: Apply for jobs with custom messages
- **Skill Assessment**: Take skill tests to improve profile
- **Work History**: Track completed jobs and earnings
- **Profile Management**: Update skills, availability, and personal info

### 🏢 Owner Features
- **Job Creation**: Post new job opportunities
- **Application Management**: Review and manage job applications
- **Worker Profiles**: View worker details and ratings
- **Job Tracking**: Monitor job status and completion
- **Business Profile**: Manage business information

### 👨‍💼 Admin Features
- **Dashboard**: Overview of platform statistics
- **Worker Management**: Manage worker profiles and skill levels
- **Skill Test Reviews**: Review and approve skill assessments
- **Payment Management**: Process payments and handle commissions

## 🎨 UI/UX Design

### Design System
- **Primary Color**: `#4F46E5` (Indigo)
- **Success Color**: `#10B981` (Green)
- **Warning Color**: `#F59E0B` (Amber)
- **Error Color**: `#EF4444` (Red)
- **Neutral Color**: `#6B7280` (Gray)

### Navigation Structure
```
AppNavigator
├── Authentication Stack
│   ├── RoleSelection
│   ├── LoginScreen
│   └── SignUpScreen
├── Worker Tab Navigator
│   ├── Home (HomeScreen)
│   └── Profile (ProfileScreen)
├── Owner Tab Navigator
│   ├── Home (OwnerHomeScreen)
│   └── Profile (OwnerProfile)
├── Admin Tab Navigator
│   ├── Dashboard (AdminDashboard)
│   └── Payments (AdminPaymentManagement)
└── Stack Screens
    ├── JobDetailsScreen
    ├── CreateJobScreen
    ├── ApplicationsScreen
    ├── SkillAssessmentScreen
    └── TestStatusScreen
```

## 🧪 Testing

### Demo Credentials
For testing purposes, use these demo credentials:

- **Admin**: `admin@vwork.com` (any password)
- **Owner**: `owner@vwork.com` (any password)
- **Worker**: `worker@vwork.com` (any password)

### Testing Flow
1. **Start with Login**: Use demo credentials
2. **Test Admin Flow**: Dashboard → Workers → Tests → Payments
3. **Test Owner Flow**: Create jobs → Manage applications → Process payments
4. **Test Worker Flow**: Browse jobs → Apply → Take skill tests → View profile

## 📊 Backend Integration

The frontend is designed to integrate with a comprehensive backend system that includes:

### API Endpoints
- **Authentication**: Registration, login, phone verification
- **User Management**: Profile updates, location tracking
- **Job Management**: CRUD operations for job postings
- **Applications**: Apply, manage, and track applications
- **Notifications**: Real-time notifications via WebSocket
- **Reviews & Ratings**: User feedback system
- **Payment Processing**: Secure payment handling

### Database Schema
- **Users**: User profiles and authentication
- **Jobs**: Job postings and details
- **Applications**: Job applications and status
- **Notifications**: User notifications
- **Reviews**: User ratings and feedback
- **Bookmarks**: Saved job functionality

## 🔧 Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run in web browser
```

### Key Dependencies
```json
{
  "@react-navigation/native": "^7.1.9",
  "@react-navigation/stack": "^7.3.2",
  "@react-navigation/bottom-tabs": "^7.3.13",
  "expo": "^53.0.20",
  "react-native": "^0.79.5",
  "react-native-vector-icons": "^10.2.0",
  "@react-native-async-storage/async-storage": "2.1.2"
}
```

## 🚀 Deployment

### Expo Build
```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios
```

### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 📈 Performance

### Optimization Features
- **Lazy Loading**: Screens load only when needed
- **Image Optimization**: Compressed images for faster loading
- **Caching**: Local storage for frequently accessed data
- **Offline Support**: Basic offline functionality

### Performance Targets
- **App Launch Time**: < 3 seconds
- **Screen Navigation**: < 500ms
- **Image Loading**: < 2 seconds
- **API Response**: < 200ms

## 🔒 Security

### Security Features
- **Input Validation**: All user inputs are validated
- **Secure Storage**: Sensitive data stored securely
- **API Security**: JWT token-based authentication
- **Data Protection**: User data privacy compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Complete frontend implementation
- ✅ Navigation structure
- ✅ UI/UX design
- ✅ Demo data integration

### Phase 2 (Next)
- 🔄 Backend API development
- 🔄 Database implementation
- 🔄 Authentication system
- 🔄 Real-time features

### Phase 3 (Future)
- 📋 Payment integration
- 📋 Advanced analytics
- 📋 Multi-language support
- 📋 Offline functionality

---

**Built with ❤️ for rural communities** 