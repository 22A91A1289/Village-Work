import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API Key - Replace with your API key or use environment variable
const API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; // Get from: https://makersuite.google.com/app/apikey

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generate quiz questions using Google Gemini API
 * @param {string} category - Category name (e.g., 'Electrician', 'Plumber')
 * @param {number} numQuestions - Number of questions to generate (default: 5)
 * @param {string} language - Language code ('en', 'te', 'hi') - default: 'en'
 * @returns {Promise<Array>} Array of question objects
 */
export const generateQuizQuestions = async (category, numQuestions = 5, language = 'en') => {
  try {
    // Check if API key is set
    if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      console.warn('Gemini API key not configured, using fallback questions');
      return null;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Language mapping for prompt
    const languageNames = {
      'en': 'English',
      'te': 'Telugu (తెలుగు)',
      'hi': 'Hindi (हिंदी)'
    };
    const targetLanguage = languageNames[language] || 'English';

    const prompt = `Generate exactly ${numQuestions} multiple-choice quiz questions for ${category} skill assessment in India.

IMPORTANT: Generate ALL text (questions, options, explanations) in ${targetLanguage} language.

Requirements:
- Questions should be practical and relevant for Indian workers/students
- Each question must have exactly 4 options (A, B, C, D)
- Include one correct answer (index 0-3)
- Difficulty: Intermediate level suitable for skilled workers
- Topics: Tools, safety practices, techniques, standards used in India
- Make questions clear and unambiguous
- Options should be plausible but only one correct
- ALL text must be in ${targetLanguage} language

Return ONLY a valid JSON array in this exact format (no markdown, no code blocks):
[
  {
    "question": "Question text here in ${targetLanguage}?",
    "options": ["Option A in ${targetLanguage}", "Option B in ${targetLanguage}", "Option C in ${targetLanguage}", "Option D in ${targetLanguage}"],
    "correctAnswer": 0,
    "explanation": "Brief explanation in ${targetLanguage}"
  }
]

Generate questions for ${category} category in ${targetLanguage} language.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response text (remove markdown code blocks if present)
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    // Parse JSON
    const questions = JSON.parse(cleanedText);

    // Validate questions format
    if (Array.isArray(questions) && questions.length > 0) {
      // Ensure all questions have required fields
      const validatedQuestions = questions.map((q, index) => ({
        question: q.question || `Question ${index + 1}`,
        options: Array.isArray(q.options) && q.options.length === 4 
          ? q.options 
          : ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3
          ? q.correctAnswer
          : 0,
        explanation: q.explanation || 'No explanation provided'
      }));

      console.log(`✅ Generated ${validatedQuestions.length} AI questions for ${category}`);
      return validatedQuestions;
    } else {
      throw new Error('Invalid question format from API');
    }

  } catch (error) {
    console.error('Error generating questions with Gemini API:', error);
    // Return null to trigger fallback
    return null;
  }
};

/**
 * Get fallback/hardcoded questions for a category
 * This is used when API fails or is not configured
 * @param {string} categoryName - Category name
 * @param {string} language - Language code ('en', 'te', 'hi') - default: 'en'
 */
export const getFallbackQuestions = (categoryName, language = 'en') => {
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

  const questions = allQuestions[categoryName] || allQuestions['Electrician'];
  
  // Return English questions as fallback
  // AI questions will handle language automatically via generateQuizQuestions
  return questions;
};

