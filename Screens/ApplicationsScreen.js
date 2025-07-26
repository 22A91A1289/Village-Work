import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ApplicationsScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Generate sample applications for this specific job
  const generateJobApplications = () => {
    const applications = [];
    const applicantCount = job.applicants || 0;
    
    for (let i = 0; i < applicantCount; i++) {
      applications.push({
        id: `${job.id}-${i}`,
        name: `${job.experienceLevel === 'helper' ? 'Helper' : 'Worker'} ${i + 1}`,
        experience: job.experienceLevel === 'helper' ? 
          Math.floor(Math.random() * 2) : Math.floor(Math.random() * 5) + 2,
        rating: (Math.random() * 2 + 3).toFixed(1),
        status: ['pending', 'shortlisted', 'rejected'][Math.floor(Math.random() * 3)],
        appliedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        location: job.location,
        skills: job.category === 'technical' ? 
          ['Electrical Work', 'Tool Handling', 'Safety Protocols'] :
          ['Physical Labor', 'Team Work', 'Punctuality'],
        profileImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
      });
    }
    return applications;
  };

  const applications = useMemo(() => generateJobApplications(), [job]);

  const filters = [
    { key: 'all', label: 'All', count: applications.length },
    { key: 'pending', label: 'Pending', count: applications.filter(a => a.status === 'pending').length },
    { key: 'shortlisted', label: 'Shortlisted', count: applications.filter(a => a.status === 'shortlisted').length },
    { key: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length },
  ];

  const filteredApplications = applications.filter(app => 
    selectedFilter === 'all' || app.status === selectedFilter
  );

  const handleStatusChange = (applicantId, newStatus) => {
    Alert.alert(
      'Change Status',
      `Change application status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            // Here you would update the status in your backend
            console.log(`Changing ${applicantId} status to ${newStatus}`);
          }
        },
      ]
    );
  };

  const handleCall = (phone) => {
    Alert.alert('Call', `Call ${phone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => console.log(`Calling ${phone}`) },
    ]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'shortlisted': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderApplicationCard = ({ item }) => (
    <View style={styles.applicationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.applicantInfo}>
          <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
          <View style={styles.applicantDetails}>
            <Text style={styles.applicantName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{item.rating}</Text>
              <Text style={styles.experience}>• {item.experience} years exp</Text>
            </View>
            <Text style={styles.appliedDate}>
              Applied {item.appliedDate.toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.skillsContainer}>
        <Text style={styles.skillsLabel}>Skills:</Text>
        <View style={styles.skillsList}>
          {item.skills.map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleCall(item.phone)}
        >
          <Ionicons name="call" size={16} color="#4F46E5" />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('WorkerDetails', { worker: item })}
        >
          <Ionicons name="person" size={16} color="#4F46E5" />
          <Text style={styles.actionText}>View Profile</Text>
        </TouchableOpacity>

        <View style={styles.statusActions}>
          {item.status === 'pending' && (
            <>
              <TouchableOpacity 
                style={[styles.statusButton, styles.approveButton]}
                onPress={() => handleStatusChange(item.id, 'shortlisted')}
              >
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.statusButton, styles.rejectButton]}
                onPress={() => handleStatusChange(item.id, 'rejected')}
              >
                <Ionicons name="close" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Job Header */}
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <View style={styles.jobBadges}>
          <View style={[styles.experienceBadge, { 
            backgroundColor: job.experienceLevel === 'helper' ? '#10B981' : '#3B82F6' 
          }]}>
            <Text style={styles.badgeText}>
              {job.experienceLevel === 'helper' ? 'Helper Level' : 'Worker Level'}
            </Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{job.category}</Text>
          </View>
        </View>
        <Text style={styles.jobDetails}>₹{job.salary}/day • {job.location}</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.activeFilterTab
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === filter.key && styles.activeFilterTabText
            ]}>
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Applications List */}
      <FlatList
        data={filteredApplications}
        keyExtractor={item => item.id}
        renderItem={renderApplicationCard}
        contentContainerStyle={styles.applicationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No applications found</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'all' ? 
                'No one has applied for this job yet' : 
                `No ${selectedFilter} applications`}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  jobHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  jobBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  experienceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  jobDetails: {
    fontSize: 16,
    color: '#6B7280',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    borderBottomColor: '#4F46E5',
  },
  filterTabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  applicationsList: {
    paddingHorizontal: 16,
  },
  applicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  applicantInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  applicantDetails: {
    flex: 1,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  experience: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  appliedDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  skillsContainer: {
    marginBottom: 16,
  },
  skillsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#4F46E5',
  },
  statusActions: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default ApplicationsScreen;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   FlatList,
//   Alert,
//   Modal,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// // Enhanced applicant data with better structure
// const sampleApplicants = [
//   {
//     id: 1,
//     name: 'Ravi Kumar',
//     age: 22,
//     experience: 'Entry Level',
//     availability: 'Full-time',
//     appliedDate: '2 hours ago',
//     contact: '+91 9876543210',
//     location: 'Rajam, Srikakulam',
//     motivation: 'Want to learn farming and earn for my family',
//     canStartImmediately: true,
//     hasTransport: false,
//     education: 'High School',
//     topSkills: ['Eager to learn', 'Physically fit', 'Good attitude'],
//     rating: 0,
//     references: 'Village Elder - Ramana Rao',
//     languages: ['Telugu', 'Hindi'],
//     status: 'pending',
//     matchScore: 85,
//   },
//   {
//     id: 2,
//     name: 'Suresh Babu',
//     age: 28,
//     experience: 'Basic Knowledge',
//     availability: 'Full-time',
//     appliedDate: '1 day ago',
//     contact: '+91 9876543211',
//     location: 'Kothavalasa',
//     motivation: 'Looking to build a career in construction',
//     canStartImmediately: true,
//     hasTransport: true,
//     education: 'Intermediate',
//     topSkills: ['Basic tools', 'Team player', 'Reliable'],
//     rating: 0,
//     references: 'Local Contractor - Srinivas',
//     languages: ['Telugu', 'Hindi', 'English'],
//     status: 'reviewed',
//     matchScore: 92,
//   },
//   {
//     id: 3,
//     name: 'Lakshmi Devi',
//     age: 24,
//     experience: 'Home Experience',
//     availability: 'Part-time',
//     appliedDate: '3 hours ago',
//     contact: '+91 9876543212',
//     location: 'Vizianagaram',
//     motivation: 'Want to work and support my children\'s education',
//     canStartImmediately: false,
//     hasTransport: false,
//     education: 'Primary School',
//     topSkills: ['Household work', 'Reliable', 'Dedicated'],
//     rating: 0,
//     references: 'Neighbor - Kamala Devi',
//     languages: ['Telugu'],
//     status: 'shortlisted',
//     matchScore: 78,
//   },
//   {
//     id: 4,
//     name: 'Anjali Reddy',
//     age: 19,
//     experience: 'Fresh Graduate',
//     availability: 'Full-time',
//     appliedDate: '5 hours ago',
//     contact: '+91 9876543213',
//     location: 'Srikakulam',
//     motivation: 'Want to start my career and learn new skills',
//     canStartImmediately: true,
//     hasTransport: true,
//     education: 'Graduate',
//     topSkills: ['Quick learner', 'Communication', 'Tech savvy'],
//     rating: 0,
//     references: 'College Professor - Dr. Prasad',
//     languages: ['Telugu', 'English', 'Hindi'],
//     status: 'pending',
//     matchScore: 88,
//   },
//   {
//     id: 5,
//     name: 'Ramesh Naidu',
//     age: 26,
//     experience: 'Some Experience',
//     availability: 'Full-time',
//     appliedDate: '6 hours ago',
//     contact: '+91 9876543214',
//     location: 'Narasannapeta',
//     motivation: 'Want to learn new skills and support my family',
//     canStartImmediately: true,
//     hasTransport: false,
//     education: 'High School',
//     topSkills: ['Physical strength', 'Willing to learn', 'Hardworking'],
//     rating: 0,
//     references: 'Village Head - Subba Rao',
//     languages: ['Telugu'],
//     status: 'pending',
//     matchScore: 82,
//   },
// ];

// const ApplicationsScreen = ({ route, navigation }) => {
//   const { job } = route.params;
//   const [selectedTab, setSelectedTab] = useState('applicants');
//   const [expandedCard, setExpandedCard] = useState(null);
//   const [selectedApplicant, setSelectedApplicant] = useState(null);
//   const [filterStatus, setFilterStatus] = useState('all');

//   const getFilteredApplicants = () => {
//     if (filterStatus === 'all') return sampleApplicants;
//     return sampleApplicants.filter(applicant => applicant.status === filterStatus);
//   };

//   const filteredApplicants = getFilteredApplicants();

//   const handleApplicantAction = (applicantId, action) => {
//     const applicant = sampleApplicants.find(app => app.id === applicantId);
    
//     switch (action) {
//       case 'contact':
//         Alert.alert('Contact Worker', `Calling ${applicant.contact}...`);
//         break;
//       case 'hire':
//         Alert.alert(
//           'Hire Worker',
//           `Hire ${applicant.name}? They will be notified immediately.`,
//           [
//             { text: 'Cancel', style: 'cancel' },
//             { 
//               text: 'Hire', 
//               onPress: () => {
//                 Alert.alert('Success', 'Worker hired successfully!');
//                 // Update applicant status here
//               }
//             }
//           ]
//         );
//         break;
//       case 'interview':
//         Alert.alert(
//           'Schedule Interview',
//           `Schedule an interview with ${applicant.name}?`,
//           [
//             { text: 'Cancel', style: 'cancel' },
//             { 
//               text: 'Schedule', 
//               onPress: () => Alert.alert('Success', 'Interview scheduled!')
//             }
//           ]
//         );
//         break;
//       case 'viewProfile':
//         setSelectedApplicant(applicant);
//         break;
//       case 'reject':
//         Alert.alert(
//           'Reject Application',
//           `Are you sure you want to reject ${applicant.name}'s application?`,
//           [
//             { text: 'Cancel', style: 'cancel' },
//             { 
//               text: 'Reject', 
//               style: 'destructive',
//               onPress: () => Alert.alert('Done', 'Application rejected.')
//             }
//           ]
//         );
//         break;
//     }
//   };

//   const getExperienceColor = (experience) => {
//     switch (experience) {
//       case 'Entry Level': return '#10B981';
//       case 'Basic Knowledge': return '#3B82F6';
//       case 'Some Experience': return '#8B5CF6';
//       case 'Fresh Graduate': return '#F59E0B';
//       default: return '#6B7280';
//     }
//   };

//   const getMatchScoreColor = (score) => {
//     if (score >= 90) return '#10B981';
//     if (score >= 80) return '#3B82F6';
//     if (score >= 70) return '#F59E0B';
//     return '#EF4444';
//   };

//   const renderApplicantCard = ({ item: applicant }) => {
//     const isExpanded = expandedCard === applicant.id;

//     return (
//       <View style={styles.applicantCard}>
//         {/* Header Section */}
//         <TouchableOpacity
//           onPress={() => setExpandedCard(isExpanded ? null : applicant.id)}
//           style={styles.cardHeader}
//           activeOpacity={0.7}
//         >
//           <View style={styles.headerLeft}>
//             <Text style={styles.applicantName}>{applicant.name}</Text>
//             <View style={styles.headerMeta}>
//               <Text style={styles.ageMeta}>Age {applicant.age}</Text>
//               <Text style={styles.educationMeta}>• {applicant.education}</Text>
//             </View>
//             <View style={styles.locationRow}>
//               <Ionicons name="location-outline" size={12} color="#6B7280" />
//               <Text style={styles.locationText}>{applicant.location}</Text>
//             </View>
//           </View>

//           <View style={styles.headerRight}>
//             <View style={[
//               styles.matchScore,
//               { backgroundColor: getMatchScoreColor(applicant.matchScore) + '15' }
//             ]}>
//               <Text style={[
//                 styles.matchScoreText,
//                 { color: getMatchScoreColor(applicant.matchScore) }
//               ]}>
//                 {applicant.matchScore}% match
//               </Text>
//             </View>
//             <Text style={styles.appliedTime}>{applicant.appliedDate}</Text>
//           </View>
//         </TouchableOpacity>

//         {/* Quick Info Tags */}
//         <View style={styles.quickTags}>
//           <View style={[
//             styles.experienceTag,
//             { backgroundColor: getExperienceColor(applicant.experience) + '15' }
//           ]}>
//             <Text style={[
//               styles.experienceText,
//               { color: getExperienceColor(applicant.experience) }
//             ]}>
//               {applicant.experience}
//             </Text>
//           </View>

//           <View style={styles.availabilityTag}>
//             <Ionicons 
//               name={applicant.canStartImmediately ? "checkmark-circle" : "time"} 
//               size={12} 
//               color={applicant.canStartImmediately ? "#10B981" : "#F59E0B"} 
//             />
//             <Text style={[
//               styles.availabilityText,
//               { color: applicant.canStartImmediately ? "#10B981" : "#F59E0B" }
//             ]}>
//               {applicant.canStartImmediately ? 'Available now' : 'Needs notice'}
//             </Text>
//           </View>

//           {applicant.hasTransport && (
//             <View style={styles.transportTag}>
//               <Ionicons name="car" size={12} color="#3B82F6" />
//               <Text style={styles.transportText}>Has transport</Text>
//             </View>
//           )}
//         </View>

//         {/* Expanded Content */}
//         {isExpanded && (
//           <View style={styles.expandedContent}>
//             <View style={styles.motivationSection}>
//               <Text style={styles.sectionLabel}>Why they want this job:</Text>
//               <Text style={styles.motivationText}>"{applicant.motivation}"</Text>
//             </View>

//             <View style={styles.skillsSection}>
//               <Text style={styles.sectionLabel}>Key Skills & Qualities:</Text>
//               <View style={styles.skillsGrid}>
//                 {applicant.topSkills.map((skill, index) => (
//                   <View key={index} style={styles.skillChip}>
//                     <Text style={styles.skillText}>{skill}</Text>
//                   </View>
//                 ))}
//               </View>
//             </View>

//             <View style={styles.contactInfo}>
//               <Ionicons name="call" size={14} color="#4F46E5" />
//               <Text style={styles.contactText}>{applicant.contact}</Text>
//             </View>
//           </View>
//         )}

//         {/* Action Buttons */}
//         <View style={styles.actionButtons}>
//           <TouchableOpacity
//             onPress={() => handleApplicantAction(applicant.id, 'contact')}
//             style={styles.contactButton}
//           >
//             <Ionicons name="call" size={14} color="#4F46E5" />
//             <Text style={styles.contactButtonText}>Call</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => handleApplicantAction(applicant.id, 'viewProfile')}
//             style={styles.profileButton}
//           >
//             <Ionicons name="person" size={14} color="#F59E0B" />
//             <Text style={styles.profileButtonText}>Profile</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => handleApplicantAction(applicant.id, 'interview')}
//             style={styles.interviewButton}
//           >
//             <Ionicons name="calendar" size={14} color="#8B5CF6" />
//             <Text style={styles.interviewButtonText}>Interview</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => handleApplicantAction(applicant.id, 'hire')}
//             style={styles.hireButton}
//           >
//             <Ionicons name="checkmark" size={14} color="#10B981" />
//             <Text style={styles.hireButtonText}>Hire</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const renderJobDetails = () => (
//     <ScrollView style={styles.jobDetailsWrapper} showsVerticalScrollIndicator={false}>
//       <View style={styles.jobDetailsContainer}>
//         <Text style={styles.sectionTitle}>Job Description</Text>
//         <Text style={styles.jobDescription}>{job.description}</Text>

//         <Text style={styles.sectionTitle}>What We Offer</Text>
//         <View style={styles.benefitsList}>
//           <View style={styles.benefitItem}>
//             <Ionicons name="school" size={16} color="#10B981" />
//             <Text style={styles.benefitText}>Complete training provided</Text>
//           </View>
//           <View style={styles.benefitItem}>
//             <Ionicons name="cash" size={16} color="#10B981" />
//             <Text style={styles.benefitText}>Daily payment</Text>
//           </View>
//           <View style={styles.benefitItem}>
//             <Ionicons name="trending-up" size={16} color="#10B981" />
//             <Text style={styles.benefitText}>Career growth opportunities</Text>
//           </View>
//           <View style={styles.benefitItem}>
//             <Ionicons name="people" size={16} color="#10B981" />
//             <Text style={styles.benefitText}>Supportive work environment</Text>
//           </View>
//         </View>

//         <Text style={styles.sectionTitle}>Requirements</Text>
//         <View style={styles.requirementsList}>
//           <Text style={styles.requirementItem}>• Willingness to learn and grow</Text>
//           <Text style={styles.requirementItem}>• Good attitude and work ethic</Text>
//           <Text style={styles.requirementItem}>• Physically capable for the role</Text>
//           <Text style={styles.requirementItem}>• Available for scheduled hours</Text>
//           <Text style={styles.requirementItem}>• Basic communication skills</Text>
//         </View>
//       </View>
//     </ScrollView>
//   );

//   const renderProfileModal = () => (
//     <Modal
//       visible={!!selectedApplicant}
//       animationType="slide"
//       presentationStyle="pageSheet"
//     >
//       <SafeAreaView style={styles.modalContainer}>
//         <View style={styles.modalHeader}>
//           <TouchableOpacity onPress={() => setSelectedApplicant(null)}>
//             <Text style={styles.modalCancelText}>Close</Text>
//           </TouchableOpacity>
//           <Text style={styles.modalTitle}>Worker Profile</Text>
//           <View style={styles.modalPlaceholder} />
//         </View>

//         {selectedApplicant && (
//           <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
//             <View style={styles.profileHeader}>
//               <View style={styles.profileAvatar}>
//                 <Text style={styles.profileInitial}>
//                   {selectedApplicant.name.charAt(0)}
//                 </Text>
//               </View>
//               <Text style={styles.profileName}>{selectedApplicant.name}</Text>
//               <Text style={styles.profileLocation}>{selectedApplicant.location}</Text>
//             </View>

//             <View style={styles.profileDetails}>
//               <View style={styles.profileSection}>
//                 <Text style={styles.profileSectionTitle}>Basic Information</Text>
//                 <View style={styles.profileInfoGrid}>
//                   <View style={styles.profileInfoItem}>
//                     <Text style={styles.profileInfoLabel}>Age</Text>
//                     <Text style={styles.profileInfoValue}>{selectedApplicant.age} years</Text>
//                   </View>
//                   <View style={styles.profileInfoItem}>
//                     <Text style={styles.profileInfoLabel}>Education</Text>
//                     <Text style={styles.profileInfoValue}>{selectedApplicant.education}</Text>
//                   </View>
//                   <View style={styles.profileInfoItem}>
//                     <Text style={styles.profileInfoLabel}>Experience</Text>
//                     <Text style={styles.profileInfoValue}>{selectedApplicant.experience}</Text>
//                   </View>
//                   <View style={styles.profileInfoItem}>
//                     <Text style={styles.profileInfoLabel}>Availability</Text>
//                     <Text style={styles.profileInfoValue}>{selectedApplicant.availability}</Text>
//                   </View>
//                 </View>
//               </View>

//               <View style={styles.profileSection}>
//                 <Text style={styles.profileSectionTitle}>Skills & Qualities</Text>
//                 <View style={styles.profileSkillsGrid}>
//                   {selectedApplicant.topSkills.map((skill, index) => (
//                     <View key={index} style={styles.profileSkillChip}>
//                       <Text style={styles.profileSkillText}>{skill}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>

//               <View style={styles.profileSection}>
//                 <Text style={styles.profileSectionTitle}>Motivation</Text>
//                 <Text style={styles.profileMotivation}>"{selectedApplicant.motivation}"</Text>
//               </View>

//               <View style={styles.profileSection}>
//                 <Text style={styles.profileSectionTitle}>Practical Details</Text>
//                 <View style={styles.practicalDetails}>
//                   <View style={styles.practicalItem}>
//                     <Ionicons 
//                       name={selectedApplicant.canStartImmediately ? "checkmark-circle" : "time"} 
//                       size={16} 
//                       color={selectedApplicant.canStartImmediately ? "#10B981" : "#F59E0B"} 
//                     />
//                     <Text style={styles.practicalText}>
//                       {selectedApplicant.canStartImmediately ? 'Can start immediately' : 'Needs notice period'}
//                     </Text>
//                   </View>
//                   <View style={styles.practicalItem}>
//                     <Ionicons 
//                       name={selectedApplicant.hasTransport ? "checkmark-circle" : "close-circle"} 
//                       size={16} 
//                       color={selectedApplicant.hasTransport ? "#10B981" : "#EF4444"} 
//                     />
//                     <Text style={styles.practicalText}>
//                       {selectedApplicant.hasTransport ? 'Has own transport' : 'Needs transport help'}
//                     </Text>
//                   </View>
//                   <View style={styles.practicalItem}>
//                     <Ionicons name="chatbubbles" size={16} color="#6B7280" />
//                     <Text style={styles.practicalText}>
//                       Languages: {selectedApplicant.languages.join(', ')}
//                     </Text>
//                   </View>
//                 </View>
//               </View>

//               <View style={styles.profileSection}>
//                 <Text style={styles.profileSectionTitle}>References</Text>
//                 <Text style={styles.referenceText}>{selectedApplicant.references}</Text>
//               </View>
//             </View>

//             <View style={styles.profileActions}>
//               <TouchableOpacity
//                 onPress={() => {
//                   setSelectedApplicant(null);
//                   handleApplicantAction(selectedApplicant.id, 'contact');
//                 }}
//                 style={styles.profileContactButton}
//               >
//                 <Ionicons name="call" size={18} color="#FFFFFF" />
//                 <Text style={styles.profileContactButtonText}>Call Now</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => {
//                   setSelectedApplicant(null);
//                   handleApplicantAction(selectedApplicant.id, 'hire');
//                 }}
//                 style={styles.profileHireButton}
//               >
//                 <Ionicons name="checkmark" size={18} color="#FFFFFF" />
//                 <Text style={styles.profileHireButtonText}>Hire Worker</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         )}
//       </SafeAreaView>
//     </Modal>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={20} color="#4F46E5" />
//         </TouchableOpacity>
        
//         <View style={styles.headerCenter}>
//           <Text style={styles.headerTitle}>Applications</Text>
//           <Text style={styles.headerSubtitle}>{filteredApplicants.length} candidates</Text>
//         </View>
        
//         <TouchableOpacity style={styles.filterButton}>
//           <Ionicons name="funnel" size={20} color="#6B7280" />
//         </TouchableOpacity>
//       </View>

//       {/* Job Summary */}
//       <View style={styles.jobSummary}>
//         <View style={styles.jobSummaryLeft}>
//           <Text style={styles.jobTitle}>{job.title}</Text>
//           <View style={styles.jobMetaRow}>
//             <Ionicons name="location-outline" size={14} color="#6B7280" />
//             <Text style={styles.jobLocation}>{job.location}</Text>
//             <Text style={styles.jobSalary}>• {job.salary}</Text>
//           </View>
//         </View>
        
//         {job.trainingProvided && (
//           <View style={styles.trainingBadge}>
//             <Ionicons name="school" size={12} color="#10B981" />
//             <Text style={styles.trainingBadgeText}>Training</Text>
//           </View>
//         )}
//       </View>

//       {/* Quick Stats */}
//       <View style={styles.quickStats}>
//         <View style={styles.quickStat}>
//           <Text style={styles.quickStatNumber}>{filteredApplicants.length}</Text>
//           <Text style={styles.quickStatLabel}>Total Applications</Text>
//         </View>
        
//         <View style={styles.quickStat}>
//           <Text style={styles.quickStatNumber}>
//             {filteredApplicants.filter(app => app.canStartImmediately).length}
//           </Text>
//           <Text style={styles.quickStatLabel}>Available Now</Text>
//         </View>
        
//         <View style={styles.quickStat}>
//           <Text style={styles.quickStatNumber}>
//             {filteredApplicants.filter(app => app.matchScore >= 85).length}
//           </Text>
//           <Text style={styles.quickStatLabel}>Strong Matches</Text>
//         </View>
        
//         <View style={styles.quickStat}>
//           <Text style={styles.quickStatNumber}>
//             {Math.round(filteredApplicants.reduce((sum, app) => sum + app.matchScore, 0) / filteredApplicants.length)}%
//           </Text>
//           <Text style={styles.quickStatLabel}>Avg Match</Text>
//         </View>
//       </View>

//       {/* Filter Tabs */}
//       <View style={styles.filterTabs}>
//         {['all', 'pending', 'reviewed', 'shortlisted'].map((status) => (
//           <TouchableOpacity
//             key={status}
//             onPress={() => setFilterStatus(status)}
//             style={[
//               styles.filterTab,
//               filterStatus === status && styles.activeFilterTab
//             ]}
//           >
//             <Text style={[
//               styles.filterTabText,
//               filterStatus === status && styles.activeFilterTabText
//             ]}>
//               {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Main Content Tabs */}
//       <View style={styles.mainTabs}>
//         <TouchableOpacity
//           onPress={() => setSelectedTab('applicants')}
//           style={[styles.mainTab, selectedTab === 'applicants' && styles.activeMainTab]}
//         >
//           <Text style={[
//             styles.mainTabText,
//             selectedTab === 'applicants' && styles.activeMainTabText
//           ]}>
//             Candidates ({filteredApplicants.length})
//           </Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity
//           onPress={() => setSelectedTab('details')}
//           style={[styles.mainTab, selectedTab === 'details' && styles.activeMainTab]}
//         >
//           <Text style={[
//             styles.mainTabText,
//             selectedTab === 'details' && styles.activeMainTabText
//           ]}>
//             Job Details
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Content */}
//       {selectedTab === 'applicants' ? (
//         filteredApplicants.length > 0 ? (
//           <FlatList
//             data={filteredApplicants}
//             renderItem={renderApplicantCard}
//             keyExtractor={(item) => item.id.toString()}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.listContainer}
//             ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
//           />
//         ) : (
//           <View style={styles.emptyState}>
//             <Ionicons name="people-outline" size={48} color="#D1D5DB" />
//             <Text style={styles.emptyStateTitle}>No applications found</Text>
//             <Text style={styles.emptyStateSubtitle}>
//               Try adjusting your filters or wait for more applications
//             </Text>
//           </View>
//         )
//       ) : (
//         renderJobDetails()
//       )}

//       {renderProfileModal()}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: '#F3F4F6',
//   },
//   filterButton: {
//     padding: 8,
//     borderRadius: 12,
//     backgroundColor: '#F3F4F6',
//   },
//   headerCenter: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1F2937',
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   jobSummary: {
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   jobSummaryLeft: {
//     flex: 1,
//   },
//   jobTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   jobMetaRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   jobLocation: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginLeft: 4,
//   },
//   jobSalary: {
//     fontSize: 14,
//     color: '#059669',
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   trainingBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F0FDF4',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#BBF7D0',
//   },
//   trainingBadgeText: {
//     fontSize: 11,
//     color: '#10B981',
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   quickStats: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   quickStat: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   quickStatNumber: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1F2937',
//   },
//   quickStatLabel: {
//     fontSize: 11,
//     color: '#6B7280',
//     marginTop: 2,
//     textAlign: 'center',
//   },
//   filterTabs: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   filterTab: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginRight: 8,
//     backgroundColor: '#F9FAFB',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   activeFilterTab: {
//     backgroundColor: '#4F46E5',
//     borderColor: '#4F46E5',
//   },
//   filterTabText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#6B7280',
//   },
//   activeFilterTabText: {
//     color: '#FFFFFF',
//   },
//   mainTabs: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   mainTab: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   activeMainTab: {
//     borderBottomWidth: 3,
//     borderBottomColor: '#4F46E5',
//   },
//   mainTabText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#6B7280',
//   },
//   activeMainTabText: {
//     color: '#4F46E5',
//   },
//   listContainer: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   cardSeparator: {
//     height: 12,
//   },
//   applicantCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     borderWidth: 1,
//     borderColor: '#F3F4F6',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   headerLeft: {
//     flex: 1,
//   },
//   headerRight: {
//     alignItems: 'flex-end',
//   },
//   applicantName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   headerMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   ageMeta: {
//     fontSize: 13,
//     color: '#6B7280',
//   },
//   educationMeta: {
//     fontSize: 13,
//     color: '#6B7280',
//   },
//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   locationText: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginLeft: 4,
//   },
//   matchScore: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     marginBottom: 4,
//   },
//   matchScoreText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   appliedTime: {
//     fontSize: 11,
//     color: '#9CA3AF',
//   },
//   quickTags: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 12,
//     gap: 6,
//   },
//   experienceTag: {
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 6,
//   },
//   experienceText: {
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   availabilityTag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//     borderRadius: 6,
//     backgroundColor: '#F9FAFB',
//   },
//   availabilityText: {
//     fontSize: 11,
//     fontWeight: '500',
//     marginLeft: 3,
//   },
//   transportTag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//     borderRadius: 6,
//     backgroundColor: '#EBF8FF',
//   },
//   transportText: {
//     fontSize: 11,
//     color: '#3B82F6',
//     fontWeight: '500',
//     marginLeft: 3,
//   },
//   expandedContent: {
//     borderTopWidth: 1,
//     borderTopColor: '#F3F4F6',
//     paddingTop: 12,
//     marginBottom: 12,
//   },
//   motivationSection: {
//     marginBottom: 12,
//   },
//   sectionLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 6,
//   },
//   motivationText: {
//     fontSize: 13,
//     color: '#6B7280',
//     fontStyle: 'italic',
//     backgroundColor: '#FFFBEB',
//     padding: 10,
//     borderRadius: 8,
//     borderLeftWidth: 3,
//     borderLeftColor: '#F59E0B',
//   },
//   skillsSection: {
//     marginBottom: 12,
//   },
//   skillsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 6,
//   },
//   skillChip: {
//     backgroundColor: '#EBF8FF',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#DBEAFE',
//   },
//   skillText: {
//     fontSize: 11,
//     color: '#1E40AF',
//     fontWeight: '600',
//   },
//   contactInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F8FAFC',
//     padding: 8,
//     borderRadius: 8,
//   },
//   contactText: {
//     fontSize: 13,
//     color: '#4F46E5',
//     marginLeft: 8,
//     fontWeight: '600',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   contactButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#EBF4FF',
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#DBEAFE',
//   },
//   contactButtonText: {
//     fontSize: 12,
//     color: '#4F46E5',
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   profileButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FFFBEB',
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#FED7AA',
//   },
//   profileButtonText: {
//     fontSize: 12,
//     color: '#F59E0B',
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   interviewButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F3F4F6',
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   interviewButtonText: {
//     fontSize: 12,
//     color: '#8B5CF6',
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   hireButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F0FDF4',
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#BBF7D0',
//   },
//   hireButtonText: {
//     fontSize: 12,
//     color: '#10B981',
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   emptyState: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//   },
//   emptyStateTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#6B7280',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyStateSubtitle: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   jobDetailsWrapper: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   jobDetailsContainer: {
//     padding: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 12,
//   },
//   jobDescription: {
//     fontSize: 15,
//     color: '#6B7280',
//     lineHeight: 22,
//     marginBottom: 24,
//   },
//   benefitsList: {
//     backgroundColor: '#F0FDF4',
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#BBF7D0',
//     marginBottom: 24,
//   },
//   benefitItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   benefitText: {
//     fontSize: 14,
//     color: '#047857',
//     marginLeft: 12,
//     fontWeight: '500',
//     lineHeight: 20,
//   },
//   requirementsList: {
//     backgroundColor: '#F9FAFB',
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   requirementItem: {
//     fontSize: 14,
//     color: '#6B7280',
//     lineHeight: 22,
//     marginBottom: 8,
//   },
//   // Modal Styles
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1F2937',
//   },
//   modalCancelText: {
//     fontSize: 16,
//     color: '#6B7280',
//     fontWeight: '600',
//   },
//   modalPlaceholder: {
//     width: 50,
//   },
//   modalContent: {
//     flex: 1,
//   },
//   profileHeader: {
//     alignItems: 'center',
//     padding: 24,
//     backgroundColor: '#F8FAFC',
//   },
//   profileAvatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#4F46E5',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   profileInitial: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },
//   profileName: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   profileLocation: {
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   profileDetails: {
//     padding: 20,
//   },
//   profileSection: {
//     marginBottom: 24,
//   },
//   profileSectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 12,
//   },
//   profileInfoGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   profileInfoItem: {
//     width: '50%',
//     marginBottom: 16,
//   },
//   profileInfoLabel: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     fontWeight: '600',
//     marginBottom: 4,
//     textTransform: 'uppercase',
//   },
//   profileInfoValue: {
//     fontSize: 16,
//     color: '#1F2937',
//     fontWeight: '600',
//   },
//   profileSkillsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   profileSkillChip: {
//     backgroundColor: '#EBF8FF',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#DBEAFE',
//   },
//   profileSkillText: {
//     fontSize: 13,
//     color: '#1E40AF',
//     fontWeight: '600',
//   },
//   profileMotivation: {
//     fontSize: 15,
//     color: '#6B7280',
//     fontStyle: 'italic',
//     backgroundColor: '#FFFBEB',
//     padding: 16,
//     borderRadius: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#F59E0B',
//     lineHeight: 22,
//   },
//   practicalDetails: {
//     gap: 12,
//   },
//   practicalItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   practicalText: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginLeft: 12,
//   },
//   referenceText: {
//     fontSize: 14,
//     color: '#6B7280',
//     backgroundColor: '#F9FAFB',
//     padding: 12,
//     borderRadius: 8,
//   },
//   profileActions: {
//     flexDirection: 'row',
//     padding: 20,
//     gap: 12,
//   },
//   profileContactButton: {
//     flex: 1,
//     backgroundColor: '#4F46E5',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     borderRadius: 12,
//   },
//   profileContactButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   profileHireButton: {
//     flex: 1,
//     backgroundColor: '#10B981',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     borderRadius: 12,
//   },
//   profileHireButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
// });

// export default ApplicationsScreen;
