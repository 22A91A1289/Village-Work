import React from 'react';
import { 
  IoBriefcaseOutline, 
  IoPeopleOutline
} from 'react-icons/io5';
import './Dashboard.css';

const Dashboard = () => {
  // Matching mobile app stats: Active Jobs and Applications
  const stats = [
    { label: 'Active Jobs', value: '6', icon: IoBriefcaseOutline, color: '#4F46E5' },
    { label: 'Applications', value: '43', icon: IoPeopleOutline, color: '#10B981' },
  ];

  // Matching mobile app job data structure
  const recentJobs = [
    { id: 1, title: 'Farm Labor - Experienced Workers Preferred', category: 'Farm Labor', location: 'Rajam, Srikakulam', applicants: 12, status: 'Active', posted: '2 hours ago', salary: '₹450/day' },
    { id: 2, title: 'Construction Helper - Experience Required', category: 'Construction Helper', location: 'Kothavalasa', applicants: 8, status: 'Active', posted: '1 day ago', salary: '₹600/day' },
    { id: 3, title: 'Plumber Helper - Basic Skills Required', category: 'Plumber Helper', location: 'Vizianagaram', applicants: 5, status: 'Active', posted: '3 days ago', salary: '₹700/day' },
    { id: 4, title: 'Electrician Helper - Experience Preferred', category: 'Electrician Helper', location: 'Srikakulam', applicants: 3, status: 'Active', posted: '1 day ago', salary: '₹650/day' },
    { id: 5, title: 'Garden Maintenance - Experienced Gardeners', category: 'Gardening', location: 'Vizianagaram', applicants: 6, status: 'Active', posted: '4 hours ago', salary: '₹400/day' },
    { id: 6, title: 'Welder Trainee - Basic Skills Required', category: 'Welder Trainee', location: 'Srikakulam', applicants: 4, status: 'Active', posted: '6 hours ago', salary: '₹800/day' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your jobs.</p>
      </div>

      {/* Stats Grid - Matching Mobile App */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                <IconComponent />
              </div>
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Jobs - Matching Mobile App Data */}
      <div className="card">
        <div className="card-header">
          <h2>Your Posted Jobs</h2>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job) => (
                <tr key={job.id}>
                  <td className="job-title-cell">
                    <div className="job-title-main">{job.title}</div>
                    <div className="job-category">{job.category}</div>
                  </td>
                  <td>{job.location}</td>
                  <td className="salary-cell">{job.salary}</td>
                  <td>{job.applicants}</td>
                  <td>
                    <span className={`status-badge ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{job.posted}</td>
                  <td>
                    <button className="btn-link">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
