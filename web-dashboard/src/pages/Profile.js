import React, { useState } from 'react';
import { 
  IoCameraOutline, 
  IoCheckmarkCircle,
  IoBriefcaseOutline,
  IoPeopleOutline,
  IoStarOutline,
  IoTimeOutline,
  IoLocationOutline
} from 'react-icons/io5';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '+91 9876543210',
    location: 'Srikakulam, Andhra Pradesh',
    businessName: 'Kumar Enterprises',
    businessType: 'Agriculture & Construction',
    bio: 'Experienced contractor providing quality work opportunities in agriculture and construction sectors.',
    rating: 4.8,
    reviews: 124,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempProfileData, setTempProfileData] = useState(profileData);

  const profileStats = [
    { icon: IoBriefcaseOutline, label: 'Active Jobs', value: '6', color: '#10B981', description: 'Currently posted' },
    { icon: IoPeopleOutline, label: 'Total Hires', value: '156', color: '#3B82F6', description: 'Workers hired' },
    { icon: IoStarOutline, label: 'Rating', value: '4.8', color: '#F59E0B', description: 'Out of 5.0' },
    { icon: IoTimeOutline, label: 'Response', value: '< 2hrs', color: '#8B5CF6', description: 'Average time' },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInputChange = (field, value) => {
    setTempProfileData({
      ...tempProfileData,
      [field]: value
    });
  };

  const handleSave = () => {
    setProfileData(tempProfileData);
    setIsEditMode(false);
    alert('✓ Success! Your profile has been updated successfully!');
  };

  const handleCancel = () => {
    setTempProfileData(profileData);
    setIsEditMode(false);
  };

  const displayData = isEditMode ? tempProfileData : profileData;

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your employer profile and settings</p>
        </div>
        {!isEditMode ? (
          <button className="btn btn-primary" onClick={() => setIsEditMode(true)}>
            Edit Profile
          </button>
        ) : (
          <div className="edit-actions">
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Profile Header with Photo */}
      <div className="card profile-header-card">
        <div className="profile-header-content">
          <div className="avatar-container">
            <div className="avatar">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="avatar-image" />
              ) : (
                <span className="avatar-text">{getInitials(displayData.name)}</span>
              )}
            </div>
            <div className="verification-badge">
              <IoCheckmarkCircle />
            </div>
            {isEditMode && (
              <label className="camera-button" htmlFor="profile-image-input">
                <IoCameraOutline />
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
          
          <div className="profile-info">
            <h2 className="profile-name">{displayData.name}</h2>
            <p className="business-name">{displayData.businessName}</p>
            <div className="location-info">
              <IoLocationOutline className="location-icon" />
              <span className="location-text">{displayData.location}</span>
            </div>
            <div className="rating-info">
              <IoStarOutline className="star-icon" />
              <span className="rating-value">{displayData.rating}</span>
              <span className="review-count">({displayData.reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      {displayData.bio && (
        <div className="card bio-card">
          <h3 className="bio-title">About Your Business</h3>
          <p className="bio-text">{displayData.bio}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        {profileStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-card-profile">
              <div className="stat-icon-profile" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                <IconComponent />
              </div>
              <div className="stat-content-profile">
                <div className="stat-value-profile">{stat.value}</div>
                <div className="stat-label-profile">{stat.label}</div>
                <div className="stat-description-profile">{stat.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Form */}
      <div className="card">
        <div className="profile-section">
          <h2>Company Information</h2>
          
          <div className="form-group">
            <label>Full Name</label>
            {isEditMode ? (
              <input 
                type="text" 
                value={displayData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            ) : (
              <div className="field-value">{displayData.name}</div>
            )}
          </div>

          <div className="form-group">
            <label>Business Name</label>
            {isEditMode ? (
              <input 
                type="text" 
                value={displayData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Enter business name"
              />
            ) : (
              <div className="field-value">{displayData.businessName}</div>
            )}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            {isEditMode ? (
              <input 
                type="email" 
                value={displayData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            ) : (
              <div className="field-value">{displayData.email}</div>
            )}
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            {isEditMode ? (
              <input 
                type="tel" 
                value={displayData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 9876543210"
              />
            ) : (
              <div className="field-value">{displayData.phone}</div>
            )}
          </div>

          <div className="form-group">
            <label>Location</label>
            {isEditMode ? (
              <input 
                type="text" 
                value={displayData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, State"
              />
            ) : (
              <div className="field-value">{displayData.location}</div>
            )}
          </div>

          <div className="form-group">
            <label>About Your Business</label>
            {isEditMode ? (
              <textarea 
                rows="4" 
                value={displayData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Describe your business and services"
              />
            ) : (
              <div className="field-value textarea-value">{displayData.bio}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
