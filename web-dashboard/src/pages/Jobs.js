import React, { useState } from 'react';
import { IoAddOutline, IoCloseOutline } from 'react-icons/io5';
import './Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Farm Labor - Experienced Workers Preferred', category: 'Daily Work', location: 'Rajam, Srikakulam', salary: '₹450/day', applicants: 12, status: 'Active', posted: '2024-01-08' },
    { id: 2, title: 'Construction Helper - Experience Required', category: 'Daily Work', location: 'Kothavalasa', salary: '₹600/day', applicants: 8, status: 'Active', posted: '2024-01-07' },
    { id: 3, title: 'Electrician Helper - Experience Preferred', category: 'Technical', location: 'Srikakulam', salary: '₹650/day', applicants: 15, status: 'Active', posted: '2024-01-05' },
    { id: 4, title: 'Plumber Helper - Basic Skills Required', category: 'Technical', location: 'Vizianagaram', salary: '₹700/day', applicants: 5, status: 'Active', posted: '2024-01-03' },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'daily',
    location: '',
    salary: '',
    description: '',
    experienceLevel: 'helper',
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCreateJob = () => {
    if (!formData.title || !formData.location || !formData.salary) {
      alert('Please fill all required fields');
      return;
    }

    const newJob = {
      id: jobs.length + 1,
      title: formData.title,
      category: formData.category === 'daily' ? 'Daily Work' : 'Technical',
      location: formData.location,
      salary: formData.salary,
      applicants: 0,
      status: 'Active',
      posted: new Date().toISOString().split('T')[0],
    };

    setJobs([newJob, ...jobs]);
    setShowCreateModal(false);
    setFormData({
      title: '',
      category: 'daily',
      location: '',
      salary: '',
      description: '',
      experienceLevel: 'helper',
    });
    alert('Job posted successfully!');
  };

  return (
    <div className="jobs-page">
      <div className="page-header">
        <div>
          <h1>Job Management</h1>
          <p>Create and manage your job postings</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <IoAddOutline />
          Create New Job
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="job-title">{job.title}</td>
                  <td>
                    <span className={`category-badge ${job.category.toLowerCase().replace(' ', '-')}`}>
                      {job.category}
                    </span>
                  </td>
                  <td>{job.location}</td>
                  <td className="salary-cell">{job.salary}</td>
                  <td>{job.applicants}</td>
                  <td>
                    <span className={`status-badge ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-link">View Applications</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Job</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <IoCloseOutline />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Electrician Helper Needed"
                />
              </div>

              <div className="form-group">
                <label>Job Category *</label>
                <div className="category-selector">
                  <button
                    className={`category-option ${formData.category === 'daily' ? 'active' : ''}`}
                    onClick={() => handleInputChange('category', 'daily')}
                  >
                    Daily Work
                  </button>
                  <button
                    className={`category-option ${formData.category === 'technical' ? 'active' : ''}`}
                    onClick={() => handleInputChange('category', 'technical')}
                  >
                    Technical
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Srikakulam, Andhra Pradesh"
                />
              </div>

              <div className="form-group">
                <label>Salary per Day *</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder="e.g., ₹500/day"
                />
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                >
                  <option value="helper">Helper (New/Learning)</option>
                  <option value="worker">Worker (Experienced)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Job Description</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the job requirements and responsibilities..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateJob}>
                Post Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
