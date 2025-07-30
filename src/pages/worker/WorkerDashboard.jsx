import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaClock, 
  FaMoneyBillWave,
  FaStar,
  FaBell,
  FaUser,
  FaBriefcase,
  FaChartLine,
  FaCheckCircle
} from 'react-icons/fa'

const WorkerDashboard = () => {
  const { user } = useAuth()
  const { unreadCount } = useNotifications()
  const [searchText, setSearchText] = useState('')
  const [location, setLocation] = useState(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const dailyWorkCategories = [
    { name: 'Farming', icon: '🌾', color: 'bg-secondary-500', count: 45 },
    { name: 'Construction', icon: '🏗️', color: 'bg-accent-500', count: 32 },
    { name: 'Sweeper', icon: '🧹', color: 'bg-primary-500', count: 28 },
    { name: 'Maid', icon: '👩‍💼', color: 'bg-pink-500', count: 15 },
  ]

  const technicalWorkCategories = [
    { name: 'Electrician Helper', icon: '⚡', color: 'bg-red-500', count: 18 },
    { name: 'Plumber Helper', icon: '🔧', color: 'bg-blue-500', count: 22 },
    { name: 'Carpenter Assistant', icon: '🔨', color: 'bg-purple-500', count: 12 },
    { name: 'Mechanic Trainee', icon: '🚗', color: 'bg-cyan-500', count: 8 },
  ]

  const nearbyJobs = [
    {
      id: 1,
      title: 'Farm Labor - No Experience Required',
      location: 'Rajam, Srikakulam',
      salary: '₹450/day',
      type: 'Daily Work',
      timeAgo: '2 hours ago',
      urgency: 'urgent',
      description: 'Perfect for beginners - we will teach you everything about farming!',
      requirements: ['Willingness to learn', 'Physically fit', 'Available full day'],
      benefits: ['On-job training', 'Daily payment', 'Lunch provided'],
      postedBy: 'Ramesh Naidu',
      contact: '9876543210',
      isApplied: false,
      trainingProvided: true,
      experienceLevel: 'beginner',
    },
    {
      id: 2,
      title: 'Electrician Helper - Learn While Working',
      location: 'Kothavalasa',
      salary: '₹600/day',
      type: 'Technical Work',
      timeAgo: '1 day ago',
      urgency: 'normal',
      description: 'Great opportunity to learn electrical work from experienced professionals.',
      requirements: ['Basic interest in electrical work', 'Safety conscious', 'Eager to learn'],
      benefits: ['Professional training', 'Safety equipment provided', 'Career growth'],
      postedBy: 'Anil Kumar',
      contact: '9876501234',
      isApplied: false,
      trainingProvided: true,
      experienceLevel: 'beginner',
    },
    {
      id: 3,
      title: 'Construction Helper - Training Included',
      location: 'Vizianagaram',
      salary: '₹500/day',
      type: 'Daily Work',
      timeAgo: '3 days ago',
      urgency: 'normal',
      description: 'Join our construction team and learn valuable building skills.',
      requirements: ['Hardworking attitude', 'Team player', 'Willing to learn'],
      benefits: ['Skill development', 'Weekly bonus', 'Career advancement'],
      postedBy: 'Suresh',
      contact: '9998887777',
      isApplied: false,
      trainingProvided: true,
      experienceLevel: 'beginner',
    },
  ]

  useEffect(() => {
    // Simulate loading jobs
    setTimeout(() => {
      setJobs(nearbyJobs)
      setLoading(false)
    }, 1000)
  }, [])

  const fetchLocation = async () => {
    try {
      setLoadingLocation(true)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
            setLoadingLocation(false)
          },
          (error) => {
            console.error('Location error:', error)
            setLoadingLocation(false)
          }
        )
      }
    } catch (error) {
      console.error('Location fetch error:', error)
      setLoadingLocation(false)
    }
  }

  const handleCategoryPress = (category) => {
    // Navigate to category jobs
    console.log('Category pressed:', category.name)
  }

  const handleJobPress = (job) => {
    // Navigate to job details
    console.log('Job pressed:', job.title)
  }

  const handleApplyJob = (job) => {
    // Apply for job logic
    setJobs(jobs.map(j => 
      j.id === job.id ? { ...j, isApplied: true } : j
    ))
  }

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSkillLevelText = (level) => {
    switch (level) {
      case 'beginner': return 'Beginner Friendly'
      case 'intermediate': return 'Some Experience'
      case 'advanced': return 'Experienced Required'
      default: return 'Any Level'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Worker'}!</h1>
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-400" />
                <span className="text-sm text-gray-600">4.8 rating</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/worker/profile" className="relative">
                <FaBell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link to="/worker/profile" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for jobs..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <button
              onClick={fetchLocation}
              disabled={loadingLocation}
              className="btn btn-outline flex items-center space-x-2"
            >
              <FaMapMarkerAlt className="w-4 h-4" />
              <span>{loadingLocation ? 'Getting location...' : 'Use my location'}</span>
            </button>
          </div>
          
          {location && (
            <div className="text-sm text-gray-600">
              📍 Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="card-body text-center">
              <FaBriefcase className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">12</h3>
              <p className="text-sm text-gray-600">Active Applications</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <FaCheckCircle className="w-8 h-8 text-secondary-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">8</h3>
              <p className="text-sm text-gray-600">Completed Jobs</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <FaMoneyBillWave className="w-8 h-8 text-accent-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">₹15,400</h3>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <FaChartLine className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Job Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Work</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dailyWorkCategories.map((category) => (
              <div
                key={category.name}
                onClick={() => handleCategoryPress(category)}
                className="card cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="card-body text-center">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} jobs</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Technical Work</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {technicalWorkCategories.map((category) => (
              <div
                key={category.name}
                onClick={() => handleCategoryPress(category)}
                className="card cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="card-body text-center">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} jobs</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Nearby Jobs</h2>
            <Link to="/worker/jobs" className="text-primary-600 hover:text-primary-700 font-medium">
              View all jobs →
            </Link>
          </div>
          
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="card hover:shadow-md transition-shadow">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        {job.urgency === 'urgent' && (
                          <span className="badge badge-error">Urgent</span>
                        )}
                        <span className={`badge ${getSkillLevelColor(job.experienceLevel)}`}>
                          {getSkillLevelText(job.experienceLevel)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <FaMapMarkerAlt className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaMoneyBillWave className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaClock className="w-4 h-4" />
                          <span>{job.timeAgo}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span key={index} className="badge badge-primary">{req}</span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Posted by <span className="font-medium">{job.postedBy}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleJobPress(job)}
                            className="btn btn-outline btn-sm"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleApplyJob(job)}
                            disabled={job.isApplied}
                            className={`btn btn-sm ${job.isApplied ? 'btn-secondary' : 'btn-primary'}`}
                          >
                            {job.isApplied ? 'Applied' : 'Apply Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkerDashboard 