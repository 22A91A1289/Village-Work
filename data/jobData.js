// Shared job data for the entire app
export const allJobs = [
  {
    id: 1,
    title: 'Farm Assistant Needed',
    location: 'Rajam, Srikakulam',
    salary: '₹450/day',
    type: 'Daily Work',
    timeAgo: '2 hours ago',
    urgency: 'urgent',
    description: 'Help with daily farming activities. Training provided for beginners.',
    skillLevel: 'any',
    requirements: ['Physically fit', 'Available full day'],
    benefits: ['Daily payment', 'Lunch provided', 'Transport allowance'],
    postedBy: 'Ramesh Naidu',
    contact: '9876543210',
    isApplied: false,
    trainingProvided: true,
    experienceLevel: 'beginner',
  },
  {
    id: 2,
    title: 'Experienced Electrician Required',
    location: 'Kothavalasa',
    salary: '₹1200/day',
    type: 'Technical Work',
    timeAgo: '1 day ago',
    urgency: 'normal',
    description: 'Complex home wiring project. Experience mandatory.',
    skillLevel: 'expert',
    requirements: ['5+ years experience', 'Own tools', 'Safety certified'],
    benefits: ['High pay', 'Project bonus', 'Future work opportunities'],
    postedBy: 'Anil Kumar',
    contact: '9876501234',
    isApplied: false,
    requiresSkillTest: true,
    testDetails: 'Basic electrical safety and wiring knowledge test',
    experienceLevel: 'expert',
  },
  {
    id: 3,
    title: 'Carpenter - All Levels Welcome',
    location: 'Vizianagaram',
    salary: '₹600-1000/day',
    type: 'Technical Work',
    timeAgo: '3 days ago',
    urgency: 'normal',
    description: 'Furniture making project. Beginners can learn, experienced get higher pay.',
    skillLevel: 'any',
    requirements: ['Interest in woodworking', 'Basic tool knowledge helpful'],
    benefits: ['Skill development', 'Variable pay based on skill', 'Weekly bonus'],
    postedBy: 'Suresh',
    contact: '9998887777',
    isApplied: false,
    hasSkillAssessment: true,
    experienceLevel: 'any',
  },
  {
    id: 4,
    title: 'Construction Helper - No Experience Required',
    location: 'Rajam, Srikakulam',
    salary: '₹500/day',
    type: 'Daily Work',
    timeAgo: '4 hours ago',
    urgency: 'urgent',
    description: 'Perfect opportunity for beginners to learn construction skills with experienced professionals.',
    requirements: ['Willingness to learn', 'Hardworking attitude', 'No prior experience needed'],
    benefits: ['On-job training provided', 'Daily payment', 'Skill development'],
    postedBy: 'Local Employer',
    contact: '9876543210',
    isApplied: false,
    trainingProvided: true,
    experienceLevel: 'beginner',
  },
  {
    id: 5,
    title: 'Cleaning Helper - Learn While Working',
    location: 'Kothavalasa',
    salary: '₹450/day',
    type: 'Daily Work',
    timeAgo: '1 day ago',
    urgency: 'urgent',
    description: 'Join our team as a cleaning helper and learn valuable skills.',
    requirements: ['Eager to learn new skills', 'Physically fit', 'Team player'],
    benefits: ['Professional mentorship', 'Weekly bonus', 'Safety training'],
    postedBy: 'Skill Development Center',
    contact: '9876543211',
    isApplied: false,
    trainingProvided: true,
    experienceLevel: 'beginner',
  },
  {
    id: 6,
    title: 'Plumber Trainee Position',
    location: 'Vizianagaram',
    salary: '₹600/day',
    type: 'Technical Work',
    timeAgo: '3 days ago',
    urgency: 'normal',
    description: 'Start your career in plumbing with comprehensive training and support.',
    requirements: ['Interest in learning', 'Basic education helpful', 'Punctual and reliable'],
    benefits: ['Complete training program', 'Certification upon completion', 'Job placement assistance'],
    postedBy: 'Training Institute',
    contact: '9876543212',
    isApplied: false,
    trainingProvided: true,
    experienceLevel: 'beginner',
  },
];

// Get jobs by category
export const getJobsByCategory = (categoryName) => {
  return allJobs.filter(job => {
    const jobType = job.type.toLowerCase();
    const category = categoryName.toLowerCase();
    
    if (category === 'daily work') {
      return jobType === 'daily work';
    } else if (category === 'technical work') {
      return jobType === 'technical work';
    } else if (category === 'construction') {
      return job.title.toLowerCase().includes('construction') || 
             job.description.toLowerCase().includes('construction');
    } else if (category === 'cleaning') {
      return job.title.toLowerCase().includes('cleaning') || 
             job.description.toLowerCase().includes('cleaning');
    } else if (category === 'farming') {
      return job.title.toLowerCase().includes('farm') || 
             job.description.toLowerCase().includes('farm');
    } else if (category === 'electrician') {
      return job.title.toLowerCase().includes('electrician') || 
             job.description.toLowerCase().includes('electrician');
    } else if (category === 'carpenter') {
      return job.title.toLowerCase().includes('carpenter') || 
             job.description.toLowerCase().includes('carpenter');
    } else if (category === 'plumber') {
      return job.title.toLowerCase().includes('plumber') || 
             job.description.toLowerCase().includes('plumber');
    }
    
    return true; // Return all jobs if category doesn't match
  });
};

// Get jobs by search term
export const searchJobs = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return allJobs.filter(job => 
    job.title.toLowerCase().includes(term) ||
    job.postedBy.toLowerCase().includes(term) ||
    job.type.toLowerCase().includes(term) ||
    job.location.toLowerCase().includes(term) ||
    job.description.toLowerCase().includes(term)
  );
}; 