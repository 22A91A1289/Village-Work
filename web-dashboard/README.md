# WORKNEX Employer Dashboard

React web application for employers/recruiters to manage jobs, applications, and workers.

## 🚀 Getting Started

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Running the Application

```bash
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
web-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout.js          # Main layout with sidebar
│   │   └── Layout.css
│   ├── pages/
│   │   ├── Login.js           # Login page
│   │   ├── Dashboard.js       # Main dashboard
│   │   ├── Jobs.js            # Job management
│   │   ├── Applications.js    # Application management
│   │   ├── Workers.js         # Worker browsing
│   │   └── Profile.js         # Employer profile
│   ├── App.js                 # Main app component with routing
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## 🔑 Features

- **Dashboard**: Overview with stats and recent jobs
- **Job Management**: Create, edit, and manage job postings
- **Applications**: Review and manage job applications
- **Workers**: Browse and view worker profiles
- **Profile**: Manage employer profile and settings

## 🔐 Demo Login

- **Email**: Any email
- **Password**: Any password

For demo purposes, any credentials will work.

## 📦 Dependencies

- `react` - React library
- `react-dom` - React DOM
- `react-router-dom` - Routing
- `react-scripts` - Build scripts
- `axios` - HTTP client (for future API integration)

## 🔄 Next Steps

1. **Backend Integration**: Connect to your backend API
2. **Authentication**: Implement real authentication
3. **State Management**: Add Redux or Context API if needed
4. **API Service**: Create API service layer in `src/services/api.js`
5. **Styling**: Enhance with Material-UI or Ant Design if needed

## 🌐 Mobile App Integration

This dashboard is designed to work alongside the React Native mobile app:
- **Mobile App**: For workers (job search, applications, profile)
- **Web Dashboard**: For employers (job posting, management, analytics)

Both apps will share the same backend API.

