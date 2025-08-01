import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateQuizQuestions, getFallbackQuestions } from '../utils/aiQuizGenerator';
import { useLanguage } from '../contexts/LanguageContext';

const QuizScreen = ({ route, navigation }) => {
  const { category } = route.params || {};
  const { language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load questions on component mount
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const categoryName = category?.name || 'Electrician';
      
      // Try to generate questions using Gemini API in user's selected language
      const aiQuestions = await generateQuizQuestions(categoryName, 5, language);
      
      if (aiQuestions && aiQuestions.length > 0) {
        // Use AI-generated questions
        setQuestions(aiQuestions);
        console.log('Using AI-generated questions');
      } else {
        // Fallback to hardcoded questions in user's language
        const fallbackQuestions = getFallbackQuestions(categoryName, language);
        setQuestions(fallbackQuestions);
        console.log('Using fallback questions');
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      // Fallback to hardcoded questions on error
      const categoryName = category?.name || 'Electrician';
      const fallbackQuestions = getFallbackQuestions(categoryName, language);
      setQuestions(fallbackQuestions);
    } finally {
      setLoading(false);
    }
  };

  // Legacy function - kept for backward compatibility (not used anymore)
  const generateQuestions = (categoryName) => {
    const allQuestions = {
      'Electrician': [
        {
          question: 'What is the standard voltage for household electrical supply in India?',
          options: ['110V', '220V', '440V', '380V'],
          correctAnswer: 1,
          explanation: 'India uses 220V as the standard household voltage supply.'
        },
        {
          question: 'What color wire is typically used for Earth/Ground connection?',
          options: ['Red', 'Black', 'Green/Yellow', 'Blue'],
          correctAnswer: 2,
          explanation: 'Green/Yellow striped wire is used for Earth/Ground connection for safety.'
        },
        {
          question: 'What should you do before working on any electrical circuit?',
          options: ['Check voltage', 'Turn off main switch', 'Wear gloves', 'All of the above'],
          correctAnswer: 3,
          explanation: 'Always turn off main switch, check voltage, and wear proper safety equipment.'
        },
        {
          question: 'What is MCB used for?',
          options: ['Measuring current', 'Protecting circuit from overload', 'Connecting wires', 'Testing voltage'],
          correctAnswer: 1,
          explanation: 'MCB (Miniature Circuit Breaker) protects circuits from overload and short circuits.'
        },
        {
          question: 'What is the minimum safe distance from overhead power lines?',
          options: ['3 feet', '10 feet', '20 feet', '5 feet'],
          correctAnswer: 1,
          explanation: 'Maintain at least 10 feet distance from overhead power lines for safety.'
        }
      ],
      'Plumber': [
        {
          question: 'What is the standard pipe size for main water supply in homes?',
          options: ['1/2 inch', '3/4 inch', '1 inch', '1.5 inch'],
          correctAnswer: 1,
          explanation: '3/4 inch is the standard size for main water supply lines.'
        },
        {
          question: 'What tool is used to cut PVC pipes?',
          options: ['Hacksaw', 'Pipe cutter', 'Both A and B', 'Hammer'],
          correctAnswer: 2,
          explanation: 'Both hacksaw and pipe cutter can be used to cut PVC pipes cleanly.'
        },
        {
          question: 'What causes water hammer in pipes?',
          options: ['Low pressure', 'Sudden valve closure', 'Leakage', 'High temperature'],
          correctAnswer: 1,
          explanation: 'Water hammer occurs when a valve is closed suddenly, causing pressure waves.'
        },
        {
          question: 'What is the purpose of a trap in plumbing?',
          options: ['Increase pressure', 'Prevent sewer gases', 'Filter water', 'Reduce flow'],
          correctAnswer: 1,
          explanation: 'Traps hold water to prevent sewer gases from entering the building.'
        },
        {
          question: 'Which material is best for hot water pipes?',
          options: ['PVC', 'CPVC', 'Galvanized iron', 'Copper'],
          correctAnswer: 1,
          explanation: 'CPVC (Chlorinated Polyvinyl Chloride) is designed to handle hot water safely.'
        }
      ],
      'Carpenter': [
        {
          question: 'What is the standard thickness of plywood sheets?',
          options: ['6mm', '12mm', '18mm', 'All of the above'],
          correctAnswer: 3,
          explanation: 'Plywood comes in various thicknesses including 6mm, 12mm, and 18mm.'
        },
        {
          question: 'What tool is essential for making precise cuts?',
          options: ['Handsaw', 'Circular saw', 'Measuring tape and marking tool', 'Hammer'],
          correctAnswer: 2,
          explanation: 'Accurate measurements and markings are essential before making any cuts.'
        },
        {
          question: 'What type of joint is strongest for connecting two pieces of wood?',
          options: ['Butt joint', 'Dovetail joint', 'Nail joint', 'Glue joint'],
          correctAnswer: 1,
          explanation: 'Dovetail joints provide the strongest mechanical connection between wood pieces.'
        },
        {
          question: 'What is the purpose of wood seasoning?',
          options: ['Add color', 'Remove moisture', 'Increase strength', 'Make it flexible'],
          correctAnswer: 1,
          explanation: 'Seasoning removes moisture from wood to prevent warping and cracking.'
        },
        {
          question: 'Which saw is best for cutting curves?',
          options: ['Handsaw', 'Circular saw', 'Jigsaw', 'Table saw'],
          correctAnswer: 2,
          explanation: 'Jigsaw is designed for cutting curves and intricate shapes in wood.'
        }
      ],
      'Mechanic': [
        {
          question: 'What does engine oil primarily do?',
          options: ['Cool the engine', 'Lubricate moving parts', 'Clean the engine', 'All of the above'],
          correctAnswer: 3,
          explanation: 'Engine oil lubricates, cools, and helps clean engine components.'
        },
        {
          question: 'What is the standard tire pressure for most cars?',
          options: ['20-25 PSI', '30-35 PSI', '40-45 PSI', '50-55 PSI'],
          correctAnswer: 1,
          explanation: 'Most passenger cars require 30-35 PSI tire pressure for optimal performance.'
        },
        {
          question: 'What tool is used to remove spark plugs?',
          options: ['Wrench', 'Spark plug socket', 'Pliers', 'Screwdriver'],
          correctAnswer: 1,
          explanation: 'Spark plug socket is specifically designed to remove and install spark plugs.'
        },
        {
          question: 'What causes engine overheating?',
          options: ['Low coolant', 'Faulty thermostat', 'Blocked radiator', 'All of the above'],
          correctAnswer: 3,
          explanation: 'Multiple factors can cause overheating including low coolant, faulty thermostat, or blocked radiator.'
        },
        {
          question: 'What is the purpose of a timing belt?',
          options: ['Drive wheels', 'Synchronize engine valves', 'Cool engine', 'Charge battery'],
          correctAnswer: 1,
          explanation: 'Timing belt synchronizes the rotation of crankshaft and camshaft for proper valve timing.'
        }
      ]
    };

    return allQuestions[categoryName] || allQuestions['Electrician'];
  };

  // Use questions from state (loaded via AI or fallback)
  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null;
  const totalQuestions = questions.length;

  useEffect(() => {
    // Timer countdown
    if (!quizCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, quizCompleted]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1] || null);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1] || null);
    }
  };

  const handleSubmitQuiz = async () => {
    let correctAnswers = 0;
    
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = (correctAnswers / totalQuestions) * 100;
    const passed = percentage >= 60; // 60% to pass

    setScore(correctAnswers);
    setQuizCompleted(true);

    try {
      const quizResult = {
        category: category?.name || 'General',
        score: correctAnswers,
        totalQuestions: totalQuestions,
        percentage: percentage,
        passed: passed,
        date: new Date().toISOString(),
        answers: answers
      };

      await AsyncStorage.setItem('userSkillLevel', 'experienced');
      await AsyncStorage.setItem('quizResult', JSON.stringify(quizResult));
      await AsyncStorage.setItem('skillAssessmentCompleted', passed ? 'passed' : 'failed');
      await AsyncStorage.setItem('quizDate', new Date().toISOString());
      await AsyncStorage.setItem('selectedCategory', category?.name || 'General');

      if (passed) {
        Alert.alert(
          'Congratulations! 🎉',
          `You passed the skill assessment!\n\nScore: ${correctAnswers}/${totalQuestions} (${percentage.toFixed(1)}%)\n\nYou now have access to technical and daily work opportunities.`,
          [
            {
              text: 'Continue',
              onPress: () => navigation.replace('WorkerTabNavigator')
            }
          ]
        );
      } else {
        Alert.alert(
          'Test Not Passed',
          `Your score: ${correctAnswers}/${totalQuestions} (${percentage.toFixed(1)}%)\n\nYou need 60% to pass. You can retake the test after 1 week.\n\nFor now, you'll see daily work opportunities.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('WorkerTabNavigator')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error saving quiz result:', error);
      Alert.alert('Error', 'Failed to save quiz results. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loading state while questions are being loaded
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Generating quiz questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error if no questions available
  if (!currentQuestion || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.loadingText}>Unable to load questions</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadQuestions}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (quizCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.resultContainer}>
          <Ionicons 
            name={score >= totalQuestions * 0.6 ? "checkmark-circle" : "close-circle"} 
            size={80} 
            color={score >= totalQuestions * 0.6 ? "#10B981" : "#EF4444"} 
          />
          <Text style={styles.resultTitle}>
            {score >= totalQuestions * 0.6 ? 'Test Passed!' : 'Test Not Passed'}
          </Text>
          <Text style={styles.resultScore}>
            Score: {score}/{totalQuestions} ({(score / totalQuestions * 100).toFixed(1)}%)
          </Text>
          <Text style={styles.resultMessage}>
            {score >= totalQuestions * 0.6 
              ? 'You now have access to technical and daily work opportunities!'
              : 'You can retake the test after 1 week. For now, you\'ll see daily work opportunities.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{category?.name || 'General'} Skill Test</Text>
          <Text style={styles.headerSubtitle}>Question {currentQuestionIndex + 1} of {totalQuestions}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="#EF4444" />
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1}</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.selectedOption,
                answers[currentQuestionIndex] === index && styles.answeredOption
              ]}
              onPress={() => handleAnswerSelect(index)}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.optionCircle,
                  selectedAnswer === index && styles.selectedCircle
                ]}>
                  {selectedAnswer === index && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={[
                  styles.optionText,
                  selectedAnswer === index && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color={currentQuestionIndex === 0 ? "#9CA3AF" : "#4F46E5"} />
          <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.navButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4F46E5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    borderColor: '#4F46E5',
    backgroundColor: '#F8FAFF',
  },
  answeredOption: {
    borderColor: '#10B981',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCircle: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 8,
  },
  navButtonTextDisabled: {
    color: '#9CA3AF',
  },
  nextButton: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 12,
  },
  resultScore: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 16,
  },
  resultMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizScreen;

