# Village Work App - Backend Requirements

## 📋 Overview

This document outlines all the backend requirements needed to support the Village Work React Native frontend. The backend must provide APIs for user authentication, job management, applications, notifications, and real-time features.

---

## 🏗️ Backend Architecture Requirements

### Technology Stack
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL + Redis
- **Authentication:** JWT tokens
- **File Storage:** AWS S3
- **Real-time:** Socket.io
- **SMS Service:** Twilio/AWS SNS
- **Deployment:** Docker + AWS

---

## 📊 Database Schema Requirements

### Core Tables Needed

#### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('worker', 'owner') NOT NULL,
    profile_image_url VARCHAR(255),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    address TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    available_for_work BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. Jobs Table
```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category ENUM('daily', 'technical') NOT NULL,
    sub_category VARCHAR(100),
    experience_level ENUM('helper', 'worker', 'expert') NOT NULL,
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_type ENUM('daily', 'weekly', 'monthly') DEFAULT 'daily',
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    address TEXT,
    training_provided BOOLEAN DEFAULT FALSE,
    requirements TEXT[],
    benefits TEXT[],
    urgency_level ENUM('normal', 'urgent', 'emergency') DEFAULT 'normal',
    status ENUM('active', 'inactive', 'completed', 'cancelled') DEFAULT 'active',
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. Applications Table
```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status ENUM('pending', 'accepted', 'rejected', 'withdrawn') DEFAULT 'pending',
    message TEXT,
    proposed_salary DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. Job Categories Table
```sql
CREATE TABLE job_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    parent_category VARCHAR(100),
    experience_required ENUM('none', 'basic', 'intermediate', 'expert'),
    training_provided BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. Notifications Table
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type ENUM('job_application', 'job_accepted', 'job_rejected', 'new_job', 'reminder'),
    related_job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. Reviews Table
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reviewed_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 7. Bookmarks Table
```sql
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);
```

---

## 🔌 API Endpoints Required

### Authentication APIs

#### 1. User Registration
```
POST /api/auth/register
Content-Type: application/json

{
  "phone": "+919876543210",
  "name": "Ramesh Kumar",
  "role": "worker",
  "email": "ramesh@example.com"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "phone": "+919876543210",
      "name": "Ramesh Kumar",
      "role": "worker",
      "is_verified": false
    },
    "token": "jwt_token_here"
  },
  "message": "Registration successful. Please verify your phone number."
}
```

#### 2. Phone Verification
```
POST /api/auth/verify-phone
Content-Type: application/json

{
  "phone": "+919876543210",
  "otp": "123456"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "is_verified": true
    }
  },
  "message": "Phone number verified successfully."
}
```

#### 3. User Login
```
POST /api/auth/login
Content-Type: application/json

{
  "phone": "+919876543210"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "phone": "+919876543210",
      "name": "Ramesh Kumar",
      "role": "worker",
      "is_verified": true
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful."
}
```

### User Management APIs

#### 4. Get User Profile
```
GET /api/users/profile
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "phone": "+919876543210",
      "name": "Ramesh Kumar",
      "email": "ramesh@example.com",
      "role": "worker",
      "profile_image_url": "https://s3.amazonaws.com/profile.jpg",
      "location_lat": 17.3850,
      "location_lng": 78.4867,
      "address": "Rajam, Andhra Pradesh",
      "is_verified": true,
      "is_online": true,
      "available_for_work": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### 5. Update User Profile
```
PUT /api/users/profile
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "address": "Rajam, Andhra Pradesh"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Ramesh Kumar",
      "email": "ramesh@example.com",
      "address": "Rajam, Andhra Pradesh",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Profile updated successfully."
}
```

#### 6. Update User Location
```
PUT /api/users/location
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "location_lat": 17.3850,
  "location_lng": 78.4867,
  "address": "Rajam, Andhra Pradesh"
}

Response:
{
  "success": true,
  "data": {
    "location": {
      "location_lat": 17.3850,
      "location_lng": 78.4867,
      "address": "Rajam, Andhra Pradesh"
    }
  },
  "message": "Location updated successfully."
}
```

#### 7. Update Work Availability
```
PUT /api/users/availability
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "available_for_work": true,
  "is_online": true
}

Response:
{
  "success": true,
  "data": {
    "availability": {
      "available_for_work": true,
      "is_online": true
    }
  },
  "message": "Availability updated successfully."
}
```

#### 8. Upload Profile Photo
```
POST /api/users/upload-photo
Authorization: Bearer jwt_token
Content-Type: multipart/form-data

Form Data:
- photo: file

Response:
{
  "success": true,
  "data": {
    "profile_image_url": "https://s3.amazonaws.com/profile.jpg"
  },
  "message": "Profile photo uploaded successfully."
}
```

### Job Management APIs

#### 9. Get All Jobs (with filters)
```
GET /api/jobs?category=daily&experience_level=helper&radius=10&lat=17.3850&lng=78.4867&page=1&limit=10
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "title": "Farm Labor - No Experience Required",
        "description": "Perfect for beginners - we will teach you everything about farming!",
        "category": "daily",
        "sub_category": "Farming",
        "experience_level": "helper",
        "salary_min": 450,
        "salary_max": 500,
        "salary_type": "daily",
        "location_lat": 17.3850,
        "location_lng": 78.4867,
        "address": "Rajam, Srikakulam",
        "training_provided": true,
        "requirements": ["Willingness to learn", "Physically fit"],
        "benefits": ["On-job training", "Daily payment"],
        "urgency_level": "urgent",
        "status": "active",
        "views_count": 25,
        "applications_count": 3,
        "owner": {
          "id": "uuid",
          "name": "Ramesh Naidu",
          "phone": "9876543210"
        },
        "created_at": "2024-01-15T10:30:00Z",
        "distance": 2.5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "total_pages": 5
    }
  }
}
```

#### 10. Get Job Details
```
GET /api/jobs/{job_id}
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "data": {
    "job": {
      "id": "uuid",
      "title": "Farm Labor - No Experience Required",
      "description": "Perfect for beginners - we will teach you everything about farming!",
      "category": "daily",
      "sub_category": "Farming",
      "experience_level": "helper",
      "salary_min": 450,
      "salary_max": 500,
      "salary_type": "daily",
      "location_lat": 17.3850,
      "location_lng": 78.4867,
      "address": "Rajam, Srikakulam",
      "training_provided": true,
      "requirements": ["Willingness to learn", "Physically fit"],
      "benefits": ["On-job training", "Daily payment"],
      "urgency_level": "urgent",
      "status": "active",
      "views_count": 25,
      "applications_count": 3,
      "owner": {
        "id": "uuid",
        "name": "Ramesh Naidu",
        "phone": "9876543210",
        "rating": 4.5
      },
      "created_at": "2024-01-15T10:30:00Z",
      "is_bookmarked": false,
      "has_applied": false
    }
  }
}
```

#### 11. Create New Job (Owner only)
```
POST /api/jobs
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "title": "Farm Labor - No Experience Required",
  "description": "Perfect for beginners - we will teach you everything about farming!",
  "category": "daily",
  "sub_category": "Farming",
  "experience_level": "helper",
  "salary_min": 450,
  "salary_max": 500,
  "salary_type": "daily",
  "location_lat": 17.3850,
  "location_lng": 78.4867,
  "address": "Rajam, Srikakulam",
  "training_provided": true,
  "requirements": ["Willingness to learn", "Physically fit"],
  "benefits": ["On-job training", "Daily payment"],
  "urgency_level": "urgent"
}

Response:
{
  "success": true,
  "data": {
    "job": {
      "id": "uuid",
      "title": "Farm Labor - No Experience Required",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Job created successfully."
}
```

#### 12. Update Job
```
PUT /api/jobs/{job_id}
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "title": "Updated Job Title",
  "description": "Updated description",
  "salary_min": 500,
  "salary_max": 550
}

Response:
{
  "success": true,
  "data": {
    "job": {
      "id": "uuid",
      "title": "Updated Job Title",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Job updated successfully."
}
```

#### 13. Delete Job
```
DELETE /api/jobs/{job_id}
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "message": "Job deleted successfully."
}
```

#### 14. Get Job Categories
```
GET /api/jobs/categories

Response:
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Farming",
        "icon": "leaf",
        "color": "#10B981",
        "parent_category": "daily",
        "experience_required": "none",
        "training_provided": true
      },
      {
        "id": "uuid",
        "name": "Construction",
        "icon": "hammer",
        "color": "#F59E0B",
        "parent_category": "daily",
        "experience_required": "none",
        "training_provided": true
      }
    ]
  }
}
```

#### 15. Get Nearby Jobs
```
GET /api/jobs/nearby?lat=17.3850&lng=78.4867&radius=10&page=1&limit=10
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "title": "Farm Labor - No Experience Required",
        "distance": 2.5,
        "location": "Rajam, Srikakulam",
        "salary": "₹450/day",
        "category": "daily",
        "urgency_level": "urgent"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "total_pages": 3
    }
  }
}
```

#### 16. Search Jobs
```
GET /api/jobs/search?q=farm&category=daily&experience_level=helper&radius=10&lat=17.3850&lng=78.4867
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "title": "Farm Labor - No Experience Required",
        "description": "Perfect for beginners...",
        "distance": 2.5,
        "salary": "₹450/day"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

### Application Management APIs

#### 17. Apply for Job
```
POST /api/applications
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "job_id": "uuid",
  "message": "I am interested in this job and available immediately.",
  "proposed_salary": 450
}

Response:
{
  "success": true,
  "data": {
    "application": {
      "id": "uuid",
      "job_id": "uuid",
      "worker_id": "uuid",
      "status": "pending",
      "message": "I am interested in this job and available immediately.",
      "proposed_salary": 450,
      "created_at": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Application submitted successfully."
}
```

#### 18. Get Applications for Job (Owner only)
```
GET /api/applications/job/{job_id}
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "status": "pending",
        "message": "I am interested in this job and available immediately.",
        "proposed_salary": 450,
        "created_at": "2024-01-15T10:30:00Z",
        "worker": {
          "id": "uuid",
          "name": "Ramesh Kumar",
          "phone": "9876543210",
          "rating": 4.2,
          "profile_image_url": "https://s3.amazonaws.com/profile.jpg"
        }
      }
    ]
  }
}
```

#### 19. Get User Applications
```
GET /api/applications/user/{user_id}
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "status": "pending",
        "message": "I am interested in this job and available immediately.",
        "proposed_salary": 450,
        "created_at": "2024-01-15T10:30:00Z",
        "job": {
          "id": "uuid",
          "title": "Farm Labor - No Experience Required",
          "salary": "₹450/day",
          "location": "Rajam, Srikakulam",
          "owner": {
            "name": "Ramesh Naidu",
            "phone": "9876543210"
          }
        }
      }
    ]
  }
}
```

#### 20. Update Application Status (Owner only)
```
PUT /api/applications/{application_id}
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "status": "accepted"
}

Response:
{
  "success": true,
  "data": {
    "application": {
      "id": "uuid",
      "status": "accepted",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Application status updated successfully."
}
```

#### 21. Withdraw Application
```
DELETE /api/applications/{application_id}
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "message": "Application withdrawn successfully."
}
```

### Notification APIs

#### 22. Get User Notifications
```
GET /api/notifications?page=1&limit=10
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "title": "New Application",
        "message": "Someone applied for your job",
        "type": "job_application",
        "related_job_id": "uuid",
        "is_read": false,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "total_pages": 3
    }
  }
}
```

#### 23. Mark Notification as Read
```
PUT /api/notifications/{notification_id}
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "is_read": true
}

Response:
{
  "success": true,
  "data": {
    "notification": {
      "id": "uuid",
      "is_read": true
    }
  },
  "message": "Notification marked as read."
}
```

#### 24. Mark All Notifications as Read
```
PUT /api/notifications/read-all
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "message": "All notifications marked as read."
}
```

### Bookmark APIs

#### 25. Bookmark Job
```
POST /api/jobs/{job_id}/bookmark
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "data": {
    "bookmark": {
      "id": "uuid",
      "job_id": "uuid",
      "user_id": "uuid",
      "created_at": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Job bookmarked successfully."
}
```

#### 26. Remove Bookmark
```
DELETE /api/jobs/{job_id}/bookmark
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "message": "Bookmark removed successfully."
}
```

#### 27. Get User Bookmarks
```
GET /api/users/bookmarks?page=1&limit=10
Authorization: Bearer jwt_token

Response:
{
  "success": true,
  "data": {
    "bookmarks": [
      {
        "id": "uuid",
        "created_at": "2024-01-15T10:30:00Z",
        "job": {
          "id": "uuid",
          "title": "Farm Labor - No Experience Required",
          "salary": "₹450/day",
          "location": "Rajam, Srikakulam",
          "category": "daily"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

### Review & Rating APIs

#### 28. Submit Review
```
POST /api/reviews
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "reviewed_id": "uuid",
  "job_id": "uuid",
  "rating": 5,
  "comment": "Great experience working together!"
}

Response:
{
  "success": true,
  "data": {
    "review": {
      "id": "uuid",
      "reviewer_id": "uuid",
      "reviewed_id": "uuid",
      "job_id": "uuid",
      "rating": 5,
      "comment": "Great experience working together!",
      "created_at": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Review submitted successfully."
}
```

#### 29. Get User Reviews
```
GET /api/reviews/user/{user_id}?page=1&limit=10

Response:
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "comment": "Great experience working together!",
        "created_at": "2024-01-15T10:30:00Z",
        "reviewer": {
          "id": "uuid",
          "name": "Ramesh Kumar",
          "profile_image_url": "https://s3.amazonaws.com/profile.jpg"
        },
        "job": {
          "id": "uuid",
          "title": "Farm Labor - No Experience Required"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "total_pages": 2
    },
    "average_rating": 4.5,
    "total_reviews": 15
  }
}
```

---

## 🔄 Real-time Features

### WebSocket Events

#### 1. Connection Management
```javascript
// Client connects
socket.emit('join', { userId: 'uuid' });

// Server handles connection
io.on('connection', (socket) => {
  socket.on('join', (data) => {
    socket.join(`user_${data.userId}`);
  });
});
```

#### 2. Notification Events
```javascript
// Server sends notification
io.to(`user_${userId}`).emit('notification', {
  type: 'job_application',
  title: 'New Application',
  message: 'Someone applied for your job',
  job_id: 'uuid',
  created_at: '2024-01-15T10:30:00Z'
});

// Client listens for notifications
socket.on('notification', (data) => {
  // Handle notification
});
```

#### 3. Job Status Updates
```javascript
// Server sends job status update
io.to(`user_${userId}`).emit('job_update', {
  job_id: 'uuid',
  status: 'completed',
  updated_at: '2024-01-15T10:30:00Z'
});
```

#### 4. Application Status Updates
```javascript
// Server sends application status update
io.to(`user_${userId}`).emit('application_update', {
  application_id: 'uuid',
  status: 'accepted',
  updated_at: '2024-01-15T10:30:00Z'
});
```

---

## 📱 Frontend Integration Points

### 1. Role Selection Screen
- **API:** `POST /api/auth/register` (for new users)
- **API:** `POST /api/auth/login` (for existing users)
- **Storage:** Save user role and token in AsyncStorage

### 2. Home Screen (Worker)
- **API:** `GET /api/jobs/nearby` (for nearby jobs)
- **API:** `GET /api/jobs/categories` (for job categories)
- **API:** `GET /api/notifications` (for notification count)
- **Real-time:** WebSocket for live notifications

### 3. Home Screen (Owner)
- **API:** `GET /api/jobs` (for user's posted jobs)
- **API:** `GET /api/applications/job/{id}` (for job applications)
- **API:** `GET /api/notifications` (for notification count)
- **Real-time:** WebSocket for new applications

### 4. Job Details Screen
- **API:** `GET /api/jobs/{id}` (for job details)
- **API:** `POST /api/applications` (for applying)
- **API:** `POST /api/jobs/{id}/bookmark` (for bookmarking)
- **API:** `DELETE /api/jobs/{id}/bookmark` (for removing bookmark)

### 5. Create Job Screen
- **API:** `POST /api/jobs` (for creating job)
- **API:** `GET /api/jobs/categories` (for categories)

### 6. Profile Screen
- **API:** `GET /api/users/profile` (for user profile)
- **API:** `PUT /api/users/profile` (for updating profile)
- **API:** `PUT /api/users/availability` (for work availability)
- **API:** `POST /api/users/upload-photo` (for profile photo)

### 7. Applications Screen
- **API:** `GET /api/applications/user/{id}` (for user applications)
- **API:** `PUT /api/applications/{id}` (for updating status)

### 8. All Applications Screen (Owner)
- **API:** `GET /api/applications/job/{id}` (for job applications)
- **API:** `PUT /api/applications/{id}` (for accepting/rejecting)

---

## 🔧 Environment Setup

### Required Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=village_work
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=village-work-uploads

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Package Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "redis": "^4.6.10",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5-lts.1",
    "aws-sdk": "^2.1450.0",
    "socket.io": "^4.7.2",
    "twilio": "^4.15.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0",
    "compression": "^1.7.4",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "supertest": "^6.3.3"
  }
}
```

---

## 🚀 Deployment Requirements

### Docker Setup
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=village_work
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 📊 Performance Requirements

### Response Time Targets
- **API Response Time:** < 200ms for 95% of requests
- **Database Query Time:** < 100ms for complex queries
- **Image Upload Time:** < 5 seconds for 5MB images
- **Real-time Notifications:** < 1 second delay

### Scalability Targets
- **Concurrent Users:** Support 1000+ concurrent users
- **Database Connections:** Handle 100+ concurrent connections
- **File Storage:** Support 10GB+ of user uploads
- **API Rate Limiting:** 100 requests per 15 minutes per IP

---

## 🔒 Security Requirements

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (worker/owner)
- Token refresh mechanism
- Secure password hashing with bcrypt

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting

### File Upload Security
- File type validation
- File size limits (5MB max)
- Virus scanning for uploads
- Secure S3 bucket configuration

---

## 📈 Monitoring & Analytics

### Required Metrics
- API response times
- Error rates
- User registration/login rates
- Job posting/application rates
- Notification delivery rates
- Database performance metrics

### Logging Requirements
- Request/response logging
- Error logging with stack traces
- User action logging
- Performance monitoring
- Security event logging

---

## 🧪 Testing Requirements

### Unit Tests
- API endpoint testing
- Database query testing
- Authentication testing
- File upload testing

### Integration Tests
- End-to-end API testing
- Database integration testing
- WebSocket testing
- SMS service testing

### Load Tests
- Concurrent user simulation
- Database performance testing
- API rate limiting testing
- File upload stress testing

---

This comprehensive backend requirements document provides all the necessary APIs, database schemas, and integration points needed to support your Village Work React Native frontend. The backend should be implemented following these specifications to ensure seamless integration with your mobile application. 