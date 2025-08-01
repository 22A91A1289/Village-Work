// Utility functions for translating job data

// Job title translations
const jobTitleTranslations = {
  te: {
    'Farm Assistant Needed': 'వ్యవసాయ సహాయకుడు అవసరం',
    'Experienced Electrician Required': 'అనుభవజ్ఞుడైన విద్యుత్ సాంకేతికుడు అవసరం',
    'Carpenter - All Levels Welcome': 'వడ్రంగి - అన్ని స్థాయిలు స్వాగతం',
    'Construction Helper - No Experience Required': 'నిర్మాణ సహాయకుడు - అనుభవం అవసరం లేదు',
    'Cleaning Helper - Learn While Working': 'అమరిక సహాయకుడు - పని చేస్తూ నేర్చుకోండి',
    'Plumber Trainee Position': 'ప్లంబర్ ట్రైనీ స్థానం',
  },
  en: {},
};

// Job type translations
const jobTypeTranslations = {
  te: {
    'Daily Work': 'రోజువారీ పని',
    'Technical Work': 'సాంకేతిక పని',
  },
  en: {},
};

// Benefit translations
const benefitTranslations = {
  te: {
    'Daily payment': 'రోజువారీ చెల్లింపు',
    'Lunch provided': 'మధ్యాహ్న భోజనం అందించబడుతుంది',
    'Transport allowance': 'ప్రయాణ భత్యం',
    'High pay': 'అధిక జీతం',
    'Project bonus': 'ప్రాజెక్ట్ బోనస్',
    'Future work opportunities': 'భవిష్యత్ పని అవకాశాలు',
    'Skill development': 'నైపుణ్య అభివృద్ధి',
    'Variable pay based on skill': 'నైపుణ్యం ఆధారంగా వేరియబుల్ చెల్లింపు',
    'Weekly bonus': 'వారపు బోనస్',
    'On-job training provided': 'పనిలో శిక్షణ అందించబడుతుంది',
    'Professional mentorship': 'ప్రొఫెషనల్ మెంటర్‌షిప్',
    'Safety training': 'భద్రతా శిక్షణ',
    'Complete training program': 'పూర్తి శిక్షణ కార్యక్రమం',
    'Certification upon completion': 'పూర్తి చేసిన తర్వాత సర్టిఫికేషన్',
    'Job placement assistance': 'ఉద్యోగ ప్లేస్‌మెంట్ సహాయం',
  },
  en: {},
};

// Job description translations
const jobDescriptionTranslations = {
  te: {
    'Help with daily farming activities. Training provided for beginners.': 'రోజువారీ వ్యవసాయ కార్యకలాపాలలో సహాయం. ప్రారంభకులకు శిక్షణ అందించబడుతుంది.',
    'Complex home wiring project. Experience mandatory.': 'సంక్లిష్టమైన హోమ్ వైరింగ్ ప్రాజెక్ట్. అనుభవం తప్పనిసరి.',
    'Furniture making project. Beginners can learn, experienced get higher pay.': 'ఫర్నిచర్ తయారీ ప్రాజెక్ట్. ప్రారంభకులు నేర్చుకోవచ్చు, అనుభవజ్ఞులకు అధిక జీతం లభిస్తుంది.',
    'Perfect opportunity for beginners to learn construction skills with experienced professionals.': 'అనుభవజ్ఞులైన నిపుణులతో నిర్మాణ నైపుణ్యాలను నేర్చుకోవడానికి ప్రారంభకులకు సంపూర్ణ అవకాశం.',
    'Join our team as a cleaning helper and learn valuable skills.': 'అమరిక సహాయకుడిగా మా టీమ్‌లో చేరి విలువైన నైపుణ్యాలను నేర్చుకోండి.',
    'Start your career in plumbing with comprehensive training and support.': 'సమగ్ర శిక్షణ మరియు మద్దతుతో ప్లంబింగ్‌లో మీ వృత్తిని ప్రారంభించండి.',
  },
  en: {},
};

// Requirement translations
const requirementTranslations = {
  te: {
    'Physically fit': 'శారీరకంగా ఫిట్',
    'Available full day': 'మొత్తం రోజు అందుబాటులో',
    '5+ years experience': '5+ సంవత్సరాల అనుభవం',
    'Own tools': 'సొంత సాధనాలు',
    'Safety certified': 'భద్రతా సర్టిఫైడ్',
    'Interest in woodworking': 'వడ్రంగి పనిలో ఆసక్తి',
    'Basic tool knowledge helpful': 'ప్రాథమిక సాధన పరిజ్ఞానం ఉపయోగకరం',
    'Willingness to learn': 'నేర్చుకోవడానికి సిద్ధత',
    'Hardworking attitude': 'కష్టపడే వైఖరి',
    'No prior experience needed': 'మునుపటి అనుభవం అవసరం లేదు',
    'Eager to learn new skills': 'కొత్త నైపుణ్యాలను నేర్చుకోవడానికి ఆసక్తి',
    'Team player': 'టీమ్ ప్లేయర్',
    'Interest in learning': 'నేర్చుకోవడంలో ఆసక్తి',
    'Basic education helpful': 'ప్రాథమిక విద్య ఉపయోగకరం',
    'Punctual and reliable': 'సమయపాలన మరియు నమ్మకమైన',
  },
  en: {},
};

// Time ago translations
const timeAgoTranslations = {
  te: {
    '2 hours ago': '2 గంటల క్రితం',
    '4 hours ago': '4 గంటల క్రితం',
    '1 day ago': '1 రోజు క్రితం',
    '3 days ago': '3 రోజులు క్రితం',
  },
  en: {},
};

// Translate a single job object
export const translateJob = (job, language = 'en') => {
  if (language === 'en') {
    return job; // Return as-is for English
  }

  const translatedJob = { ...job };
  
  // Preserve original type for comparisons
  translatedJob.originalType = job.type;

  // Translate title
  if (jobTitleTranslations[language] && jobTitleTranslations[language][job.title]) {
    translatedJob.title = jobTitleTranslations[language][job.title];
  }

  // Translate type
  if (jobTypeTranslations[language] && jobTypeTranslations[language][job.type]) {
    translatedJob.type = jobTypeTranslations[language][job.type];
  }

  // Translate description
  if (jobDescriptionTranslations[language] && jobDescriptionTranslations[language][job.description]) {
    translatedJob.description = jobDescriptionTranslations[language][job.description];
  }

  // Translate benefits
  if (job.benefits && benefitTranslations[language]) {
    translatedJob.benefits = job.benefits.map(benefit => 
      benefitTranslations[language][benefit] || benefit
    );
  }

  // Translate requirements
  if (job.requirements && requirementTranslations[language]) {
    translatedJob.requirements = job.requirements.map(req => 
      requirementTranslations[language][req] || req
    );
  }

  // Translate timeAgo
  if (job.timeAgo && timeAgoTranslations[language] && timeAgoTranslations[language][job.timeAgo]) {
    translatedJob.timeAgo = timeAgoTranslations[language][job.timeAgo];
  }

  return translatedJob;
};

// Translate array of jobs
export const translateJobs = (jobs, language = 'en') => {
  return jobs.map(job => translateJob(job, language));
};

