import React, { useState } from 'react';
import { IoCallOutline, IoPersonOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';
import './Applications.css';

const Applications = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([
    { 
      id: 1, 
      worker: 'Rajesh Kumar', 
      job: 'Farm Labor - Experienced Workers Preferred',
      jobId: 1,
      phone: '+91 9876543210',
      experience: '5 years',
      rating: 4.8,
      location: 'Rajam, Srikakulam',
      status: 'Pending',
      applied: '2024-01-09',
      skills: ['Physical Labor', 'Team Work', 'Punctuality']
    },
    { 
      id: 2, 
      worker: 'Priya Singh', 
      job: 'Construction Helper - Experience Required',
      jobId: 2,
      phone: '+91 9876543211',
      experience: '2 years',
      rating: 4.5,
      location: 'Kothavalasa',
      status: 'Accepted',
      applied: '2024-01-08',
      skills: ['Construction', 'Hard Work', 'Reliable']
    },
    { 
      id: 3, 
      worker: 'Amit Patel', 
      job: 'Electrician Helper - Experience Preferred',
      jobId: 3,
      phone: '+91 9876543212',
      experience: '8 years',
      rating: 4.9,
      location: 'Srikakulam',
      status: 'Pending',
      applied: '2024-01-07',
      skills: ['Electrical Work', 'Tool Handling', 'Safety Protocols']
    },
    { 
      id: 4, 
      worker: 'Suresh Reddy', 
      job: 'Farm Labor - Experienced Workers Preferred',
      jobId: 1,
      phone: '+91 9876543213',
      experience: '3 years',
      rating: 4.6,
      location: 'Rajam, Srikakulam',
      status: 'Pending',
      applied: '2024-01-10',
      skills: ['Farming', 'Physical Labor', 'Team Work']
    },
  ]);

  const jobs = [
    { id: 1, title: 'Farm Labor - Experienced Workers Preferred' },
    { id: 2, title: 'Construction Helper - Experience Required' },
    { id: 3, title: 'Electrician Helper - Experience Preferred' },
    { id: 4, title: 'Plumber Helper - Basic Skills Required' },
  ];

  const filteredApplications = selectedJob 
    ? applications.filter(app => app.jobId === selectedJob)
    : applications;

  const handleStatusChange = (applicationId, newStatus) => {
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
    alert(`Application ${newStatus === 'Accepted' ? 'accepted' : 'rejected'}!`);
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  return (
    <div className="applications-page">
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p>Review and select workers for your jobs</p>
        </div>
        <select 
          className="filter-select"
          value={selectedJob || ''}
          onChange={(e) => setSelectedJob(e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">All Jobs</option>
          {jobs.map(job => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>

      <div className="applications-grid">
        {filteredApplications.map((app) => (
          <div key={app.id} className="application-card">
            <div className="application-header">
              <div className="applicant-info">
                <div className="applicant-avatar">
                  {app.worker.charAt(0)}
                </div>
                <div className="applicant-details">
                  <h3 className="applicant-name">{app.worker}</h3>
                  <div className="applicant-meta">
                    <span className="rating">
                      ⭐ {app.rating}
                    </span>
                    <span className="experience">• {app.experience}</span>
                  </div>
                  <div className="applicant-location">{app.location}</div>
                </div>
              </div>
              <span className={`status-badge ${app.status.toLowerCase()}`}>
                {app.status}
              </span>
            </div>

            <div className="application-job">
              <strong>Job:</strong> {app.job}
            </div>

            <div className="application-skills">
              <strong>Skills:</strong>
              <div className="skills-list">
                {app.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="application-footer">
              <div className="application-actions">
                <button 
                  className="btn-icon" 
                  onClick={() => handleCall(app.phone)}
                  title="Call"
                >
                  <IoCallOutline />
                </button>
                <button 
                  className="btn-icon"
                  title="View Profile"
                >
                  <IoPersonOutline />
                </button>
              </div>
              
              {app.status === 'Pending' && (
                <div className="status-actions">
                  <button
                    className="btn-status accept"
                    onClick={() => handleStatusChange(app.id, 'Accepted')}
                  >
                    <IoCheckmarkCircleOutline />
                    Accept
                  </button>
                  <button
                    className="btn-status reject"
                    onClick={() => handleStatusChange(app.id, 'Rejected')}
                  >
                    <IoCloseCircleOutline />
                    Reject
                  </button>
                </div>
              )}
            </div>

            <div className="application-date">
              Applied on {new Date(app.applied).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="empty-state">
          <p>No applications found</p>
        </div>
      )}
    </div>
  );
};

export default Applications;
