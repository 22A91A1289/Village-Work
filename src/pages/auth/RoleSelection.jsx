import React from 'react'
import { Link } from 'react-router-dom'
import { FaUserTie, FaUserCog, FaUserShield } from 'react-icons/fa'

const RoleSelection = () => {
  const roles = [
    {
      id: 'worker',
      title: 'I am a Worker',
      description: 'Looking for job opportunities in farming, construction, technical work, and daily labor',
      icon: FaUserTie,
      color: 'primary',
      features: [
        'Browse and apply for jobs',
        'Complete skill assessments',
        'Track applications and payments',
        'Build your work profile'
      ],
      link: '/login?role=worker'
    },
    {
      id: 'owner',
      title: 'I am a Job Owner',
      description: 'Post jobs, manage workers, and track project progress',
      icon: FaUserCog,
      color: 'secondary',
      features: [
        'Post and manage job listings',
        'Review worker applications',
        'Track worker performance',
        'Process payments securely'
      ],
      link: '/login?role=owner'
    },
    {
      id: 'admin',
      title: 'I am an Admin',
      description: 'Manage platform operations, payments, and user accounts',
      icon: FaUserShield,
      color: 'accent',
      features: [
        'Platform oversight and management',
        'Payment processing and monitoring',
        'User account management',
        'Analytics and reporting'
      ],
      link: '/login?role=admin'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      primary: {
        bg: 'bg-primary-50',
        border: 'border-primary-200',
        text: 'text-primary-700',
        hover: 'hover:bg-primary-100',
        icon: 'text-primary-600'
      },
      secondary: {
        bg: 'bg-secondary-50',
        border: 'border-secondary-200',
        text: 'text-secondary-700',
        hover: 'hover:bg-secondary-100',
        icon: 'text-secondary-600'
      },
      accent: {
        bg: 'bg-accent-50',
        border: 'border-accent-200',
        text: 'text-accent-700',
        hover: 'hover:bg-accent-100',
        icon: 'text-accent-600'
      }
    }
    return colors[color]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
              Village Work
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect village workers with meaningful job opportunities. 
              Build your future, one job at a time.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span>Trusted by 10,000+ workers</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
              <span>500+ active jobs</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
              <span>Secure payments</span>
            </div>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role) => {
              const colors = getColorClasses(role.color)
              const IconComponent = role.icon
              
              return (
                <div
                  key={role.id}
                  className={`card ${colors.bg} ${colors.border} ${colors.hover} transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
                >
                  <div className="card-body text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.bg} ${colors.border} mb-6`}>
                      <IconComponent className={`w-8 h-8 ${colors.icon}`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {role.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                      {role.description}
                    </p>
                    
                    <ul className="text-left space-y-2 mb-8">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${colors.icon}`}></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link
                      to={role.link}
                      className={`btn btn-${role.color} w-full`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection 