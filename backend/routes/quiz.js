const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// @route   POST /api/quiz/submit
// @desc    Submit quiz results
// @access  Private
router.post('/submit', auth, async (req, res) => {
  try {
    const { category, questions, timeTaken } = req.body;
    
    if (!category || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Category and questions are required' });
    }
    
    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = questions.length;
    
    questions.forEach((q, index) => {
      if (q.userAnswer === q.correctAnswer) {
        correctAnswers++;
        q.isCorrect = true;
      } else {
        q.isCorrect = false;
      }
    });
    
    const percentage = (correctAnswers / totalQuestions) * 100;
    const passed = percentage >= 60; // 60% to pass
    
    // Create quiz record
    const quiz = new Quiz({
      user: req.userId,
      category,
      questions,
      score: correctAnswers,
      totalQuestions,
      percentage,
      passed,
      timeTaken: timeTaken || 0
    });
    
    await quiz.save();
    
    // Update user profile
    const user = await User.findById(req.userId);
    user.quizScore = correctAnswers;
    user.quizPassed = passed;
    user.quizCategory = category;
    user.skillLevel = passed ? 'experienced' : 'new';
    await user.save();
    
    res.status(201).json({
      quiz: quiz,
      message: passed 
        ? 'Congratulations! You passed the quiz.' 
        : 'You did not pass. You can retake the quiz after some time.'
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/quiz/can-attempt?category=CategoryName
// @desc    Check if user can attempt quiz for a specific category
// @access  Private
router.get('/can-attempt', auth, async (req, res) => {
  try {
    const { category } = req.query;
    
    // If no category specified, check for any quiz attempt (backwards compatibility)
    const query = category 
      ? { user: req.userId, category: category }
      : { user: req.userId };
    
    const lastQuiz = await Quiz.findOne(query)
      .sort({ completedAt: -1 });
    
    // New user - no previous attempts for this category, allow immediately
    if (!lastQuiz) {
      return res.json({ 
        canAttempt: true, 
        isFirstAttempt: true,
        category: category || 'any',
        message: category 
          ? `You can take the ${category} skill assessment quiz`
          : 'You can take the skill assessment quiz'
      });
    }
    
    // Calculate days since last attempt for this category
    const lastAttemptDate = new Date(lastQuiz.completedAt);
    const currentDate = new Date();
    const daysDifference = Math.floor((currentDate - lastAttemptDate) / (1000 * 60 * 60 * 24));
    
    // Check if 5 days have passed since last attempt for this category
    if (daysDifference >= 5) {
      return res.json({ 
        canAttempt: true,
        isFirstAttempt: false,
        category: category || 'any',
        daysSinceLastAttempt: daysDifference,
        message: category
          ? `You can retake the ${category} skill assessment quiz`
          : 'You can retake the skill assessment quiz' 
      });
    } else {
      const daysRemaining = 5 - daysDifference;
      return res.json({ 
        canAttempt: false,
        isFirstAttempt: false,
        category: category || 'any',
        daysSinceLastAttempt: daysDifference,
        daysRemaining: daysRemaining,
        lastAttemptDate: lastAttemptDate,
        nextAvailableDate: new Date(lastAttemptDate.getTime() + (5 * 24 * 60 * 60 * 1000)),
        message: category
          ? `You can retake the ${category} quiz in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}`
          : `You can retake the quiz in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}` 
      });
    }
  } catch (error) {
    console.error('Check quiz eligibility error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/quiz/my-results
// @desc    Get current user's quiz results
// @access  Private
router.get('/my-results', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.userId })
      .sort({ completedAt: -1 });
    
    res.json(quizzes);
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/quiz/:id
// @desc    Get specific quiz result
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('user', 'name email');
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    // Check if user owns this quiz
    if (quiz.user._id.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this quiz' });
    }
    
    res.json(quiz);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
