// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { GEMINI_API_KEY, GEMINI_CONFIG, USE_AI_GENERATION } from '../config/gemini.config';

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// /**
//  * Generate quiz questions using Google Gemini API
//  * @param {string} category - Category name (e.g., 'Electrician', 'Plumber')
//  * @param {number} numQuestions - Number of questions to generate (default: 5)
//  * @param {string} language - Language code ('en', 'te', 'hi') - default: 'en'
//  * @returns {Promise<Array>} Array of question objects
//  */
// export const generateQuizQuestions = async (category, numQuestions = 5, language = 'en') => {
//   try {
//     // Check if AI generation is enabled
//     if (!USE_AI_GENERATION) {
//       console.log('⚡ AI generation disabled, using fallback questions');
//       return null;
//     }

//     // Check if API key is set - return immediately if not configured
//     if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
//       console.log('⚠️ Gemini API key not configured');
//       console.log('📝 To enable AI generation:');
//       console.log('   1. Visit: https://aistudio.google.com/app/apikey');
//       console.log('   2. Create a free API key');
//       console.log('   3. Add it to config/gemini.config.js');
//       console.log('⚡ Using fallback questions for now');
//       return null; // Immediately return null to use fallback
//     }

//     console.log(`🤖 Generating AI questions for ${category} in ${language}...`);

//     // Set a timeout for AI generation
//     const timeoutPromise = new Promise((_, reject) => 
//       setTimeout(() => reject(new Error('AI generation timeout')), GEMINI_CONFIG.timeout)
//     );

//     const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.model });

//     // Language mapping for prompt
//     const languageNames = {
//       'en': 'English',
//       'te': 'Telugu (తెలుగు)',
//       'hi': 'Hindi (हिंदी)'
//     };
//     const targetLanguage = languageNames[language] || 'English';

//     const prompt = `Generate exactly ${numQuestions} multiple-choice quiz questions for ${category} skill assessment in India.

// IMPORTANT: Generate ALL text (questions, options, explanations) in ${targetLanguage} language.

// Requirements:
// - Questions should be practical and relevant for Indian workers/students
// - Each question must have exactly 4 options (A, B, C, D)
// - Include one correct answer (index 0-3)
// - Difficulty: Intermediate level suitable for skilled workers
// - Topics: Tools, safety practices, techniques, standards used in India
// - Make questions clear and unambiguous
// - Options should be plausible but only one correct
// - ALL text must be in ${targetLanguage} language

// Return ONLY a valid JSON array in this exact format (no markdown, no code blocks):
// [
//   {
//     "question": "Question text here in ${targetLanguage}?",
//     "options": ["Option A in ${targetLanguage}", "Option B in ${targetLanguage}", "Option C in ${targetLanguage}", "Option D in ${targetLanguage}"],
//     "correctAnswer": 0,
//     "explanation": "Brief explanation in ${targetLanguage}"
//   }
// ]

// Generate questions for ${category} category in ${targetLanguage} language.`;

//     // Race between AI generation and timeout
//     const generatePromise = model.generateContent(prompt);
//     const result = await Promise.race([generatePromise, timeoutPromise]);
//     const response = await result.response;
//     const text = response.text();

//     // Clean the response text (remove markdown code blocks if present)
//     let cleanedText = text.trim();
//     if (cleanedText.startsWith('```json')) {
//       cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
//     } else if (cleanedText.startsWith('```')) {
//       cleanedText = cleanedText.replace(/```\n?/g, '');
//     }

//     // Parse JSON
//     const questions = JSON.parse(cleanedText);

//     // Validate questions format
//     if (Array.isArray(questions) && questions.length > 0) {
//       // Ensure all questions have required fields
//       const validatedQuestions = questions.map((q, index) => ({
//         question: q.question || `Question ${index + 1}`,
//         options: Array.isArray(q.options) && q.options.length === 4 
//           ? q.options 
//           : ['Option A', 'Option B', 'Option C', 'Option D'],
//         correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3
//           ? q.correctAnswer
//           : 0,
//         explanation: q.explanation || 'No explanation provided'
//       }));

//       console.log(`✅ Generated ${validatedQuestions.length} AI questions for ${category}`);
//       return validatedQuestions;
//     } else {
//       throw new Error('Invalid question format from API');
//     }

//   } catch (error) {
//     console.error('Error generating questions with Gemini API:', error);
//     // Return null to trigger fallback
//     return null;
//   }
// };

// /**
//  * Get fallback/hardcoded questions for a category
//  * This is used when API fails or is not configured
//  * @param {string} categoryName - Category name
//  * @param {string} language - Language code ('en', 'te', 'hi') - default: 'en'
//  */
// export const getFallbackQuestions = (categoryName, language = 'en') => {
//   const allQuestions = {
//     'Electrician': [
//       {
//         question: 'What is the standard voltage for household electrical supply in India?',
//         options: ['110V', '220V', '440V', '380V'],
//         correctAnswer: 1,
//         explanation: 'India uses 220V as the standard household voltage supply.'
//       },
//       {
//         question: 'What color wire is typically used for Earth/Ground connection?',
//         options: ['Red', 'Black', 'Green/Yellow', 'Blue'],
//         correctAnswer: 2,
//         explanation: 'Green/Yellow striped wire is used for Earth/Ground connection for safety.'
//       },
//       {
//         question: 'What should you do before working on any electrical circuit?',
//         options: ['Check voltage', 'Turn off main switch', 'Wear gloves', 'All of the above'],
//         correctAnswer: 3,
//         explanation: 'Always turn off main switch, check voltage, and wear proper safety equipment.'
//       },
//       {
//         question: 'What is MCB used for?',
//         options: ['Measuring current', 'Protecting circuit from overload', 'Connecting wires', 'Testing voltage'],
//         correctAnswer: 1,
//         explanation: 'MCB (Miniature Circuit Breaker) protects circuits from overload and short circuits.'
//       },
//       {
//         question: 'What is the minimum safe distance from overhead power lines?',
//         options: ['3 feet', '10 feet', '20 feet', '5 feet'],
//         correctAnswer: 1,
//         explanation: 'Maintain at least 10 feet distance from overhead power lines for safety.'
//       }
//     ],
//     'Plumber': [
//       {
//         question: 'What is the standard pipe size for main water supply in homes?',
//         options: ['1/2 inch', '3/4 inch', '1 inch', '1.5 inch'],
//         correctAnswer: 1,
//         explanation: '3/4 inch is the standard size for main water supply lines.'
//       },
//       {
//         question: 'What tool is used to cut PVC pipes?',
//         options: ['Hacksaw', 'Pipe cutter', 'Both A and B', 'Hammer'],
//         correctAnswer: 2,
//         explanation: 'Both hacksaw and pipe cutter can be used to cut PVC pipes cleanly.'
//       },
//       {
//         question: 'What causes water hammer in pipes?',
//         options: ['Low pressure', 'Sudden valve closure', 'Leakage', 'High temperature'],
//         correctAnswer: 1,
//         explanation: 'Water hammer occurs when a valve is closed suddenly, causing pressure waves.'
//       },
//       {
//         question: 'What is the purpose of a trap in plumbing?',
//         options: ['Increase pressure', 'Prevent sewer gases', 'Filter water', 'Reduce flow'],
//         correctAnswer: 1,
//         explanation: 'Traps hold water to prevent sewer gases from entering the building.'
//       },
//       {
//         question: 'Which material is best for hot water pipes?',
//         options: ['PVC', 'CPVC', 'Galvanized iron', 'Copper'],
//         correctAnswer: 1,
//         explanation: 'CPVC (Chlorinated Polyvinyl Chloride) is designed to handle hot water safely.'
//       }
//     ],
//     'Carpenter': [
//       {
//         question: 'What is the standard thickness of plywood sheets?',
//         options: ['6mm', '12mm', '18mm', 'All of the above'],
//         correctAnswer: 3,
//         explanation: 'Plywood comes in various thicknesses including 6mm, 12mm, and 18mm.'
//       },
//       {
//         question: 'What tool is essential for making precise cuts?',
//         options: ['Handsaw', 'Circular saw', 'Measuring tape and marking tool', 'Hammer'],
//         correctAnswer: 2,
//         explanation: 'Accurate measurements and markings are essential before making any cuts.'
//       },
//       {
//         question: 'What type of joint is strongest for connecting two pieces of wood?',
//         options: ['Butt joint', 'Dovetail joint', 'Nail joint', 'Glue joint'],
//         correctAnswer: 1,
//         explanation: 'Dovetail joints provide the strongest mechanical connection between wood pieces.'
//       },
//       {
//         question: 'What is the purpose of wood seasoning?',
//         options: ['Add color', 'Remove moisture', 'Increase strength', 'Make it flexible'],
//         correctAnswer: 1,
//         explanation: 'Seasoning removes moisture from wood to prevent warping and cracking.'
//       },
//       {
//         question: 'Which saw is best for cutting curves?',
//         options: ['Handsaw', 'Circular saw', 'Jigsaw', 'Table saw'],
//         correctAnswer: 2,
//         explanation: 'Jigsaw is designed for cutting curves and intricate shapes in wood.'
//       }
//     ],
//     'Mechanic': [
//       {
//         question: 'What does engine oil primarily do?',
//         options: ['Cool the engine', 'Lubricate moving parts', 'Clean the engine', 'All of the above'],
//         correctAnswer: 3,
//         explanation: 'Engine oil lubricates, cools, and helps clean engine components.'
//       },
//       {
//         question: 'What is the standard tire pressure for most cars?',
//         options: ['20-25 PSI', '30-35 PSI', '40-45 PSI', '50-55 PSI'],
//         correctAnswer: 1,
//         explanation: 'Most passenger cars require 30-35 PSI tire pressure for optimal performance.'
//       },
//       {
//         question: 'What tool is used to remove spark plugs?',
//         options: ['Wrench', 'Spark plug socket', 'Pliers', 'Screwdriver'],
//         correctAnswer: 1,
//         explanation: 'Spark plug socket is specifically designed to remove and install spark plugs.'
//       },
//       {
//         question: 'What causes engine overheating?',
//         options: ['Low coolant', 'Faulty thermostat', 'Blocked radiator', 'All of the above'],
//         correctAnswer: 3,
//         explanation: 'Multiple factors can cause overheating including low coolant, faulty thermostat, or blocked radiator.'
//       },
//       {
//         question: 'What is the purpose of a timing belt?',
//         options: ['Drive wheels', 'Synchronize engine valves', 'Cool engine', 'Charge battery'],
//         correctAnswer: 1,
//         explanation: 'Timing belt synchronizes the rotation of crankshaft and camshaft for proper valve timing.'
//       }
//     ],
//     'Data Entry': [
//       {
//         question: 'In Microsoft Excel, what is the shortcut key to save a file?',
//         options: ['Ctrl+P', 'Ctrl+S', 'Ctrl+A', 'Ctrl+V'],
//         correctAnswer: 1,
//         explanation: 'Ctrl+S is the universal shortcut to save files in Excel and most applications.'
//       },
//       {
//         question: 'What does the SUM function do in Excel?',
//         options: ['Multiplies numbers', 'Adds numbers together', 'Divides numbers', 'Subtracts numbers'],
//         correctAnswer: 1,
//         explanation: 'The SUM function adds (totals) a range of numbers in Excel.'
//       },
//       {
//         question: 'How do you select all cells in an Excel worksheet?',
//         options: ['Ctrl+A', 'Ctrl+S', 'Ctrl+C', 'Ctrl+X'],
//         correctAnswer: 0,
//         explanation: 'Ctrl+A selects all cells in the current worksheet or data range.'
//       },
//       {
//         question: 'What is a cell in Excel?',
//         options: ['A row', 'A column', 'Intersection of row and column', 'A worksheet'],
//         correctAnswer: 2,
//         explanation: 'A cell is the intersection of a row and column, identified like A1, B2, etc.'
//       },
//       {
//         question: 'What is the correct way to write a formula in Excel?',
//         options: ['Start with @', 'Start with =', 'Start with #', 'Start with *'],
//         correctAnswer: 1,
//         explanation: 'All Excel formulas must start with an equal sign (=).'
//       },
//       {
//         question: 'What does Ctrl+C do?',
//         options: ['Cut', 'Copy', 'Paste', 'Delete'],
//         correctAnswer: 1,
//         explanation: 'Ctrl+C copies selected text or cells to the clipboard.'
//       },
//       {
//         question: 'What is the formula to find the average in Excel?',
//         options: ['=SUM()', '=AVERAGE()', '=TOTAL()', '=MEAN()'],
//         correctAnswer: 1,
//         explanation: '=AVERAGE() calculates the mean of a range of numbers.'
//       },
//       {
//         question: 'Which key is used to move to the next cell in Excel?',
//         options: ['Enter', 'Tab', 'Both A and B', 'Spacebar'],
//         correctAnswer: 2,
//         explanation: 'Both Enter (moves down) and Tab (moves right) navigate to the next cell.'
//       },
//       {
//         question: 'What is the shortcut to undo the last action?',
//         options: ['Ctrl+Y', 'Ctrl+Z', 'Ctrl+X', 'Ctrl+U'],
//         correctAnswer: 1,
//         explanation: 'Ctrl+Z undoes the last action, while Ctrl+Y redoes it.'
//       },
//       {
//         question: 'How do you merge cells in Excel?',
//         options: ['Right-click → Merge', 'Home tab → Merge & Center', 'Ctrl+M', 'Alt+M'],
//         correctAnswer: 1,
//         explanation: 'Use the Merge & Center button in the Home tab to combine cells.'
//       }
//     ]
//   };

//   // Telugu questions
//   const teluguQuestions = {
//     'Mechanic': [
//       {
//         question: 'ఇంజిన్ ఆయిల్ ప్రధానంగా ఏమి చేస్తుంది?',
//         options: ['ఇంజిన్‌ను చల్లగా చేస్తుంది', 'కదిలే భాగాలకు లూబ్రికేట్ చేస్తుంది', 'ఇంజిన్‌ను శుభ్రం చేస్తుంది', 'పైన ఉన్న అన్నీ'],
//         correctAnswer: 3,
//         explanation: 'ఇంజిన్ ఆయిల్ లూబ్రికేట్ చేస్తుంది, చల్లగా చేస్తుంది మరియు ఇంజిన్ భాగాలను శుభ్రంగా ఉంచడంలో సహాయపడుతుంది.'
//       },
//       {
//         question: 'చాలా కార్లకు స్టాండర్డ్ టైర్ ప్రెజర్ ఎంత?',
//         options: ['20-25 PSI', '30-35 PSI', '40-45 PSI', '50-55 PSI'],
//         correctAnswer: 1,
//         explanation: 'చాలా ప్యాసింజర్ కార్లకు సరైన పనితీరు కోసం 30-35 PSI టైర్ ప్రెజర్ అవసరం.'
//       },
//       {
//         question: 'స్పార్క్ ప్లగ్‌లను తొలగించడానికి ఏ పరికరాన్ని ఉపయోగిస్తారు?',
//         options: ['రెంచ్', 'స్పార్క్ ప్లగ్ సాకెట్', 'ప్లైయర్స్', 'స్క్రూడ్రైవర్'],
//         correctAnswer: 1,
//         explanation: 'స్పార్క్ ప్లగ్ సాకెట్ స్పార్క్ ప్లగ్‌లను తొలగించడానికి మరియు అమర్చడానికి ప్రత్యేకంగా రూపొందించబడింది.'
//       },
//       {
//         question: 'ఇంజిన్ వేడెక్కడానికి కారణం ఏమిటి?',
//         options: ['తక్కువ కూలెంట్', 'దెబ్బతిన్న థర్మోస్టాట్', 'బ్లాక్ అయిన రేడియేటర్', 'పైన ఉన్న అన్నీ'],
//         correctAnswer: 3,
//         explanation: 'తక్కువ కూలెంట్, దెబ్బతిన్న థర్మోస్టాట్ లేదా బ్లాక్ అయిన రేడియేటర్ వంటి అనేక కారణాల వల్ల వేడెక్కడం సంభవిస్తుంది.'
//       },
//       {
//         question: 'టైమింగ్ బెల్ట్ యొక్క ఉద్దేశ్యం ఏమిటి?',
//         options: ['చక్రాలను నడిపించడం', 'ఇంజిన్ వాల్వ్‌లను సింక్రనైజ్ చేయడం', 'ఇంజిన్‌ను చల్లగా చేయడం', 'బ్యాటరీ ఛార్జ్ చేయడం'],
//         correctAnswer: 1,
//         explanation: 'టైమింగ్ బెల్ట్ సరైన వాల్వ్ టైమింగ్ కోసం క్రాంక్‌షాఫ్ట్ మరియు క్యామ్‌షాఫ్ట్ యొక్క రొటేషన్‌ను సింక్రనైజ్ చేస్తుంది.'
//       }
//     ],
//     'Data Entry': [
//       {
//         question: 'Microsoft Excel లో ఫైల్ సేవ్ చేయడానికి షార్ట్‌కట్ కీ ఏది?',
//         options: ['Ctrl+P', 'Ctrl+S', 'Ctrl+A', 'Ctrl+V'],
//         correctAnswer: 1,
//         explanation: 'Ctrl+S అనేది Excel మరియు చాలా అప్లికేషన్‌లలో ఫైల్‌లను సేవ్ చేయడానికి సార్వత్రిక షార్ట్‌కట్.'
//       },
//       {
//         question: 'Excel లో SUM ఫంక్షన్ ఏమి చేస్తుంది?',
//         options: ['సంఖ్యలను గుణిస్తుంది', 'సంఖ్యలను కలుపుతుంది', 'సంఖ్యలను భాగిస్తుంది', 'సంఖ్యలను తీసివేస్తుంది'],
//         correctAnswer: 1,
//         explanation: 'SUM ఫంక్షన్ Excel లో సంఖ్యల శ్రేణిని కలుపుతుంది (మొత్తం చేస్తుంది).'
//       },
//       {
//         question: 'Excel వర్క్‌షీట్‌లో అన్ని సెల్‌లను ఎలా ఎంచుకుంటారు?',
//         options: ['Ctrl+A', 'Ctrl+S', 'Ctrl+C', 'Ctrl+X'],
//         correctAnswer: 0,
//         explanation: 'Ctrl+A ప్రస్తుత వర్క్‌షీట్ లేదా డేటా శ్రేణిలో అన్ని సెల్‌లను ఎంచుకుంటుంది.'
//       },
//       {
//         question: 'Excel లో సెల్ అంటే ఏమిటి?',
//         options: ['ఒక అడ్డు వరుస', 'ఒక నిలువు వరుస', 'అడ్డు మరియు నిలువు వరుసల కూడలి', 'ఒక వర్క్‌షీట్'],
//         correctAnswer: 2,
//         explanation: 'సెల్ అనేది ఒక అడ్డు మరియు నిలువు వరుసల కూడలి, A1, B2 వంటిగా గుర్తించబడుతుంది.'
//       },
//       {
//         question: 'Excel లో ఫార్ములా రాయడానికి సరైన మార్గం ఏమిటి?',
//         options: ['@ తో ప్రారంభించండి', '= తో ప్రారంభించండి', '# తో ప్రారంభించండి', '* తో ప్రారంభించండి'],
//         correctAnswer: 1,
//         explanation: 'అన్ని Excel ఫార్ములాలు సమాన చిహ్నం (=) తో ప్రారంభం కావాలి.'
//       },
//       {
//         question: 'Ctrl+C ఏమి చేస్తుంది?',
//         options: ['కట్', 'కాపీ', 'పేస్ట్', 'డిలీట్'],
//         correctAnswer: 1,
//         explanation: 'Ctrl+C ఎంచుకున్న టెక్స్ట్ లేదా సెల్‌లను క్లిప్‌బోర్డ్‌కు కాపీ చేస్తుంది.'
//       },
//       {
//         question: 'Excel లో సగటు కనుగొనడానికి ఫార్ములా ఏమిటి?',
//         options: ['=SUM()', '=AVERAGE()', '=TOTAL()', '=MEAN()'],
//         correctAnswer: 1,
//         explanation: '=AVERAGE() సంఖ్యల శ్రేణి యొక్క సగటును లెక్కిస్తుంది.'
//       },
//       {
//         question: 'Excel లో తదుపరి సెల్‌కు వెళ్లడానికి ఏ కీని ఉపయోగిస్తారు?',
//         options: ['Enter', 'Tab', 'A మరియు B రెండూ', 'Spacebar'],
//         correctAnswer: 2,
//         explanation: 'Enter (క్రిందికి వెళుతుంది) మరియు Tab (కుడివైపు వెళుతుంది) రెండూ తదుపరి సెల్‌కు నావిగేట్ చేస్తాయి.'
//       },
//       {
//         question: 'చివరి చర్యను రద్దు చేయడానికి షార్ట్‌కట్ ఏమిటి?',
//         options: ['Ctrl+Y', 'Ctrl+Z', 'Ctrl+X', 'Ctrl+U'],
//         correctAnswer: 1,
//         explanation: 'Ctrl+Z చివరి చర్యను రద్దు చేస్తుంది, అయితే Ctrl+Y దానిని మళ్లీ చేస్తుంది.'
//       },
//       {
//         question: 'Excel లో సెల్‌లను ఎలా విలీనం చేస్తారు?',
//         options: ['రైట్-క్లిక్ → మెర్జ్', 'Home ట్యాబ్ → Merge & Center', 'Ctrl+M', 'Alt+M'],
//         correctAnswer: 1,
//         explanation: 'సెల్‌లను కలపడానికి Home ట్యాబ్‌లో Merge & Center బటన్‌ను ఉపయోగించండి.'
//       }
//     ],
//     'Electrician': [
//       {
//         question: 'భారతదేశంలో గృహ విద్యుత్ సరఫరా కోసం ప్రామాణిక వోల్టేజ్ ఎంత?',
//         options: ['110V', '220V', '440V', '380V'],
//         correctAnswer: 1,
//         explanation: 'భారతదేశం ప్రామాణిక గృహ వోల్టేజ్ సరఫరాగా 220V ఉపయోగిస్తుంది.'
//       },
//       {
//         question: 'ఎర్త్/గ్రౌండ్ కనెక్షన్ కోసం సాధారణంగా ఏ రంగు వైర్ ఉపయోగించబడుతుంది?',
//         options: ['ఎరుపు', 'నలుపు', 'ఆకుపచ్చ/పసుపు', 'నీలం'],
//         correctAnswer: 2,
//         explanation: 'భద్రత కోసం ఆకుపచ్చ/పసుపు చారల వైర్ ఎర్త్/గ్రౌండ్ కనెక్షన్ కోసం ఉపయోగించబడుతుంది.'
//       },
//       {
//         question: 'ఏదైనా విద్యుత్ సర్క్యూట్‌పై పని చేసే ముందు మీరు ఏమి చేయాలి?',
//         options: ['వోల్టేజ్ తనిఖీ చేయండి', 'మెయిన్ స్విచ్ ఆఫ్ చేయండి', 'గ్లోవ్స్ ధరించండి', 'పైన ఉన్న అన్నీ'],
//         correctAnswer: 3,
//         explanation: 'ఎల్లప్పుడూ మెయిన్ స్విచ్ ఆఫ్ చేయండి, వోల్టేజ్ తనిఖీ చేయండి మరియు సరైన భద్రతా పరికరాలను ధరించండి.'
//       },
//       {
//         question: 'MCB దేనికి ఉపయోగపడుతుంది?',
//         options: ['కరెంట్ కొలవడం', 'ఓవర్‌లోడ్ నుండి సర్క్యూట్‌ను రక్షించడం', 'వైర్లను కనెక్ట్ చేయడం', 'వోల్టేజ్ పరీక్షించడం'],
//         correctAnswer: 1,
//         explanation: 'MCB (మినియేచర్ సర్క్యూట్ బ్రేకర్) ఓవర్‌లోడ్ మరియు షార్ట్ సర్క్యూట్‌ల నుండి సర్క్యూట్‌లను రక్షిస్తుంది.'
//       },
//       {
//         question: 'ఓవర్‌హెడ్ పవర్ లైన్‌ల నుండి కనీస సురక్షిత దూరం ఎంత?',
//         options: ['3 అడుగులు', '10 అడుగులు', '20 అడుగులు', '5 అడుగులు'],
//         correctAnswer: 1,
//         explanation: 'భద్రత కోసం ఓవర్‌హెడ్ పవర్ లైన్‌ల నుండి కనీసం 10 అడుగుల దూరం ఉంచండి.'
//       }
//     ],
//     'Plumber': [
//       {
//         question: 'ఇళ్లలో ప్రధాన నీటి సరఫరా కోసం ప్రామాణిక పైప్ పరిమాణం ఎంత?',
//         options: ['1/2 అంగుళం', '3/4 అంగుళం', '1 అంగుళం', '1.5 అంగుళం'],
//         correctAnswer: 1,
//         explanation: '3/4 అంగుళం ప్రధాన నీటి సరఫరా లైన్‌ల కోసం ప్రామాణిక పరిమాణం.'
//       },
//       {
//         question: 'PVC పైపులను కత్తిరించడానికి ఏ పరికరాన్ని ఉపయోగిస్తారు?',
//         options: ['హ్యాక్సా', 'పైప్ కట్టర్', 'A మరియు B రెండూ', 'హామర్'],
//         correctAnswer: 2,
//         explanation: 'హ్యాక్సా మరియు పైప్ కట్టర్ రెండూ PVC పైపులను శుభ్రంగా కత్తిరించడానికి ఉపయోగించవచ్చు.'
//       },
//       {
//         question: 'పైపులలో వాటర్ హామర్‌కు కారణం ఏమిటి?',
//         options: ['తక్కువ ఒత్తిడి', 'అకస్మాత్తుగా వాల్వ్ మూసివేయడం', 'లీకేజ్', 'అధిక ఉష్ణోగ్రత'],
//         correctAnswer: 1,
//         explanation: 'అకస్మాత్తుగా వాల్వ్ మూసివేయడం వల్ల వాటర్ హామర్ సంభవిస్తుంది, ఇది ఒత్తిడి తరంగాలను కలిగిస్తుంది.'
//       },
//       {
//         question: 'ప్లంబింగ్‌లో ట్రాప్ యొక్క ఉద్దేశ్యం ఏమిటి?',
//         options: ['ఒత్తిడి పెంచడం', 'మురుగు వాయువులను నిరోధించడం', 'నీటిని ఫిల్టర్ చేయడం', 'ప్రవాహాన్ని తగ్గించడం'],
//         correctAnswer: 1,
//         explanation: 'ట్రాప్‌లు మురుగు వాయువులు భవనంలోకి ప్రవేశించకుండా నిరోధించడానికి నీటిని పట్టుకుంటాయి.'
//       },
//       {
//         question: 'వేడి నీటి పైపుల కోసం ఏ పదార్థం ఉత్తమం?',
//         options: ['PVC', 'CPVC', 'గాల్వనైజ్డ్ ఇనుము', 'కాపర్'],
//         correctAnswer: 1,
//         explanation: 'CPVC (క్లోరినేటెడ్ పాలీవినైల్ క్లోరైడ్) వేడి నీటిని సురక్షితంగా నిర్వహించడానికి రూపొందించబడింది.'
//       }
//     ],
//     'Carpenter': [
//       {
//         question: 'ప్లైవుడ్ షీట్ల యొక్క ప్రామాణిక మందం ఎంత?',
//         options: ['6mm', '12mm', '18mm', 'పైన ఉన్న అన్నీ'],
//         correctAnswer: 3,
//         explanation: 'ప్లైవుడ్ 6mm, 12mm మరియు 18mm సహా వివిధ మందాలలో వస్తుంది.'
//       },
//       {
//         question: 'ఖచ్చితమైన కట్‌లు చేయడానికి ఏ పరికరం అవసరం?',
//         options: ['చేతి రంపం', 'సర్కులర్ రంపం', 'కొలత టేప్ మరియు మార్కింగ్ టూల్', 'సుత్తి'],
//         correctAnswer: 2,
//         explanation: 'ఏదైనా కట్‌లు చేసే ముందు ఖచ్చితమైన కొలతలు మరియు మార్కింగ్‌లు అవసరం.'
//       },
//       {
//         question: 'చెక్క రెండు ముక్కలను కలపడానికి ఏ రకమైన జాయింట్ బలమైనది?',
//         options: ['బట్ జాయింట్', 'డోవ్‌టెయిల్ జాయింట్', 'నెయిల్ జాయింట్', 'గ్లూ జాయింట్'],
//         correctAnswer: 1,
//         explanation: 'డోవ్‌టెయిల్ జాయింట్‌లు చెక్క ముక్కల మధ్య బలమైన యాంత్రిక కనెక్షన్‌ను అందిస్తాయి.'
//       },
//       {
//         question: 'చెక్క సీజనింగ్ యొక్క ఉద్దేశ్యం ఏమిటి?',
//         options: ['రంగు జోడించడం', 'తేమను తొలగించడం', 'బలాన్ని పెంచడం', 'దానిని సౌకర్యవంతంగా చేయడం'],
//         correctAnswer: 1,
//         explanation: 'సీజనింగ్ వంకరగా మరియు పగుళ్లు ఏర్పడకుండా నిరోధించడానికి చెక్క నుండి తేమను తొలగిస్తుంది.'
//       },
//       {
//         question: 'వక్రతలను కత్తిరించడానికి ఏ రంపం ఉత్తమం?',
//         options: ['చేతి రంపం', 'సర్కులర్ రంపం', 'జిగ్‌సా', 'టేబుల్ రంపం'],
//         correctAnswer: 2,
//         explanation: 'జిగ్‌సా చెక్కలో వక్రతలు మరియు క్లిష్టమైన ఆకృతులను కత్తిరించడానికి రూపొందించబడింది.'
//       }
//     ]
//   };

//   // Return Telugu questions if language is Telugu
//   if (language === 'te' && teluguQuestions[categoryName]) {
//     return teluguQuestions[categoryName];
//   }

//   // Return English questions as default
//   const questions = allQuestions[categoryName] || allQuestions['Electrician'];
//   return questions;
// };

// import { generateNLPQuestions } from './nlpQuestionGenerator';

// /**
//  * Generate quiz questions (Attempt Aware)
//  */
// export const generateQuizQuestions = async (
//   category,
//   numQuestions = 5,
//   language = 'en',
//   attemptNumber = 0
// ) => {

//   try {

//     console.log(`🧠 Generating NLP questions for ${category}`);
//     console.log(`🔁 Attempt Number: ${attemptNumber}`);

//     const questions = await generateNLPQuestions(
//       category,
//       numQuestions,
//       attemptNumber
//     );

//     if (questions && questions.length > 0) {
//       return questions;
//     }

//     return null;

//   } catch (error) {
//     console.error('Quiz Generation Error:', error);
//     return null;
//   }
// };


// /**
//  * Fallback questions (5 per category)
//  */
// export const getFallbackQuestions = (categoryName) => {

//   const fallback = {

//     Electrician: [
//       {
//         question: 'What is standard voltage in India?',
//         options: ['110V', '220V', '440V', '380V'],
//         correctAnswer: 1,
//         explanation: 'India uses 220V.'
//       },
//       {
//         question: 'What color is earth wire?',
//         options: ['Red', 'Black', 'Green/Yellow', 'Blue'],
//         correctAnswer: 2,
//         explanation: 'Green/Yellow is earth.'
//       },
//       {
//         question: 'MCB protects from?',
//         options: ['Overload', 'Low current', 'Loose wire', 'Heat'],
//         correctAnswer: 0,
//         explanation: 'MCB protects from overload.'
//       },
//       {
//         question: 'Before wiring work you must?',
//         options: ['Turn off power', 'Test only', 'Wear shoes', 'Call friend'],
//         correctAnswer: 0,
//         explanation: 'Switch off power.'
//       },
//       {
//         question: 'Tool to test voltage?',
//         options: ['Hammer', 'Tester', 'Spanner', 'Knife'],
//         correctAnswer: 1,
//         explanation: 'Tester checks voltage.'
//       }
//     ],

//     'Data Entry': [
//       {
//         question: 'Shortcut to save file?',
//         options: ['Ctrl+P', 'Ctrl+S', 'Ctrl+A', 'Ctrl+V'],
//         correctAnswer: 1,
//         explanation: 'Ctrl+S saves.'
//       },
//       {
//         question: 'SUM function does?',
//         options: ['Add', 'Multiply', 'Divide', 'Subtract'],
//         correctAnswer: 0,
//         explanation: 'SUM adds numbers.'
//       },
//       {
//         question: 'Ctrl+C does?',
//         options: ['Cut', 'Copy', 'Paste', 'Delete'],
//         correctAnswer: 1,
//         explanation: 'Copies.'
//       },
//       {
//         question: 'Undo shortcut?',
//         options: ['Ctrl+Y', 'Ctrl+Z', 'Ctrl+X', 'Ctrl+U'],
//         correctAnswer: 1,
//         explanation: 'Ctrl+Z.'
//       },
//       {
//         question: 'Formula starts with?',
//         options: ['=', '+', '-', '*'],
//         correctAnswer: 0,
//         explanation: 'Starts with =.'
//       }
//     ],

//     Mechanic: [
//       {
//         question: 'Standard tire pressure?',
//         options: ['20-25 PSI', '30-35 PSI', '40-45 PSI', '50 PSI'],
//         correctAnswer: 1,
//         explanation: '30-35 PSI is standard.'
//       },
//       {
//         question: 'Tool to remove spark plugs?',
//         options: ['Wrench', 'Socket', 'Hammer', 'Screwdriver'],
//         correctAnswer: 1,
//         explanation: 'Socket removes spark plugs.'
//       },
//       {
//         question: 'What cools engine?',
//         options: ['Radiator', 'Battery', 'Fuel pump', 'Gear box'],
//         correctAnswer: 0,
//         explanation: 'Radiator cools engine.'
//       },
//       {
//         question: 'What lubricates engine?',
//         options: ['Water', 'Oil', 'Fuel', 'Coolant'],
//         correctAnswer: 1,
//         explanation: 'Oil lubricates engine.'
//       },
//       {
//         question: 'What charges battery?',
//         options: ['Radiator', 'Alternator', 'Starter', 'Pump'],
//         correctAnswer: 1,
//         explanation: 'Alternator charges battery.'
//       }
//     ],

//     Plumber: [
//       {
//         question: 'Standard main pipe size?',
//         options: ['1/2 inch', '3/4 inch', '1 inch', '2 inch'],
//         correctAnswer: 1,
//         explanation: '3/4 inch is standard.'
//       },
//       {
//         question: 'Material for hot water pipes?',
//         options: ['PVC', 'CPVC', 'Iron', 'Copper'],
//         correctAnswer: 1,
//         explanation: 'CPVC is used.'
//       },
//       {
//         question: 'Tool to cut PVC?',
//         options: ['Pipe cutter', 'Hammer', 'Knife', 'Wrench'],
//         correctAnswer: 0,
//         explanation: 'Pipe cutter cuts PVC.'
//       },
//       {
//         question: 'What prevents sewer gas?',
//         options: ['Valve', 'Trap', 'Pump', 'Filter'],
//         correctAnswer: 1,
//         explanation: 'Trap prevents sewer gas.'
//       },
//       {
//         question: 'Water hammer caused by?',
//         options: ['Low pressure', 'Sudden valve closure', 'Leak', 'Heat'],
//         correctAnswer: 1,
//         explanation: 'Sudden closure causes hammer.'
//       }
//     ],
//     Carpenter: [
//   {
//     question: 'What is standard plywood thickness?',
//     options: ['6mm', '12mm', '18mm', 'All of the above'],
//     correctAnswer: 3,
//     explanation: 'Plywood comes in multiple thicknesses.'
//   },
//   {
//     question: 'Which tool cuts curves?',
//     options: ['Handsaw', 'Jigsaw', 'Hammer', 'Chisel'],
//     correctAnswer: 1,
//     explanation: 'Jigsaw cuts curves.'
//   },
//   {
//     question: 'What is wood seasoning?',
//     options: ['Painting', 'Removing moisture', 'Cutting', 'Polishing'],
//     correctAnswer: 1,
//     explanation: 'Seasoning removes moisture.'
//   },
//   {
//     question: 'Strongest wood joint?',
//     options: ['Butt joint', 'Dovetail joint', 'Glue joint', 'Nail joint'],
//     correctAnswer: 1,
//     explanation: 'Dovetail joint is strongest.'
//   },
//   {
//     question: 'Tool for accurate measurement?',
//     options: ['Hammer', 'Saw', 'Measuring tape', 'Knife'],
//     correctAnswer: 2,
//     explanation: 'Measuring tape ensures accuracy.'
//   }
// ],

//   };

//   const normalizedCategory = categoryName?.trim().toLowerCase();

//   const matchedKey = Object.keys(fallback).find(
//     key => key.toLowerCase() === normalizedCategory
//   );

//   return matchedKey ? fallback[matchedKey] : [];
// };
import AsyncStorage from '@react-native-async-storage/async-storage';

/* =========================================
   DYNAMIC KNOWLEDGE BASE
=========================================*/

class DynamicKnowledgeBase {
  constructor() {
    this.knowledge = {

      'Data Entry': [
        { type: 'shortcut', action: 'Save file', key: 'Ctrl+S' },
        { type: 'shortcut', action: 'Copy', key: 'Ctrl+C' },
        { type: 'shortcut', action: 'Paste', key: 'Ctrl+V' },
        { type: 'shortcut', action: 'Undo last action', key: 'Ctrl+Z' },
        { type: 'formula', concept: 'Average', formula: '=AVERAGE()' },
        { type: 'formula', concept: 'Sum', formula: '=SUM()' }
      ],

      Electrician: [
        { type: 'voltage', value: '220V' },
        { type: 'wire', purpose: 'Earth connection', color: 'Green/Yellow' },
        { type: 'device', name: 'MCB', purpose: 'Protecting circuit from overload' },
        { type: 'tool', purpose: 'Test voltage', name: 'Tester' },
        { type: 'safety', rule: 'Turn off main power before working' }
      ],

      Mechanic: [
        { type: 'pressure', value: '30-35 PSI' },
        { type: 'tool', purpose: 'Remove spark plugs', name: 'Spark plug socket' },
        { type: 'component', name: 'Radiator', purpose: 'Cool engine' },
        { type: 'component', name: 'Alternator', purpose: 'Charge battery' },
        { type: 'fluid', name: 'Engine oil', purpose: 'Lubricate moving parts' }
      ],

      Plumber: [
        { type: 'pipe', size: '3/4 inch' },
        { type: 'material', name: 'CPVC', purpose: 'Hot water pipes' },
        { type: 'tool', purpose: 'Cut PVC pipes', name: 'Pipe cutter' },
        { type: 'device', name: 'Trap', purpose: 'Prevent sewer gas' },
        { type: 'issue', cause: 'Sudden valve closure', problem: 'Water hammer' }
      ],

      Carpenter: [
        { type: 'tool', purpose: 'Cut wood in straight lines', name: 'Handsaw' },
        { type: 'tool', purpose: 'Cut curves in wood', name: 'Jigsaw' },
        { type: 'tool', purpose: 'Measure wood accurately', name: 'Measuring tape' },
        { type: 'component', name: 'Dovetail joint', purpose: 'Strong wood joint connection' },
        { type: 'safety', rule: 'Wear safety goggles while cutting wood' }
      ],
    };
  }

  getFacts(category) {
    if (!category) return [];

    const normalized = category.trim().toLowerCase();

    const matchedKey = Object.keys(this.knowledge).find(
      key => key.toLowerCase() === normalized
    );

    return matchedKey ? this.knowledge[matchedKey] : [];
  }
}

/* =========================================
   TEMPLATE ENGINE
=========================================*/

class TemplateEngine {

  static generateQuestion(fact, category) {

    switch (fact.type) {

      case 'shortcut':
        return {
          question: `Which key is used to ${fact.action}?`,
          correctAnswer: fact.key,
          explanation: `${fact.key} is used to ${fact.action}.`
        };

      case 'formula':
        return {
          question: `Which formula calculates ${fact.concept}?`,
          correctAnswer: fact.formula,
          explanation: `${fact.formula} calculates ${fact.concept}.`
        };

      case 'voltage':
        return {
          question: 'What is the standard household voltage in India?',
          correctAnswer: fact.value,
          explanation: `${fact.value} is standard voltage.`
        };

      case 'wire':
        return {
          question: `Which color wire is used for ${fact.purpose}?`,
          correctAnswer: fact.color,
          explanation: `${fact.color} is used for ${fact.purpose}.`
        };

      case 'device':
        return {
          question: `What is ${fact.name} used for?`,
          correctAnswer: fact.purpose,
          explanation: `${fact.name} is used for ${fact.purpose}.`
        };

      case 'tool':
        return {
          question: `Which tool is used to ${fact.purpose}?`,
          correctAnswer: fact.name,
          explanation: `${fact.name} is used to ${fact.purpose}.`
        };

      case 'safety':
        return {
          question: `What is an important safety rule in ${category}?`,
          correctAnswer: fact.rule,
          explanation: fact.rule
        };

      case 'component':
      case 'fluid':
        return {
          question: `What is the function of ${fact.name}?`,
          correctAnswer: fact.purpose,
          explanation: `${fact.name} is used to ${fact.purpose}.`
        };

      case 'pipe':
        return {
          question: 'What is the standard pipe size for main water supply?',
          correctAnswer: fact.size,
          explanation: `${fact.size} is standard size.`
        };

      case 'material':
        return {
          question: `Which material is used for ${fact.purpose}?`,
          correctAnswer: fact.name,
          explanation: `${fact.name} is used for ${fact.purpose}.`
        };

      case 'issue':
        return {
          question: `What causes ${fact.problem}?`,
          correctAnswer: fact.cause,
          explanation: `${fact.cause} causes ${fact.problem}.`
        };

      default:
        return null;
    }
  }
}

/* =========================================
   DISTRACTOR ENGINE
=========================================*/

class DistractorEngine {

  static generateOptions(correctAnswer) {

    const pool = [
      'Ctrl+P', 'Ctrl+A', 'Ctrl+X',
      '=SUM()', '=COUNT()',
      '110V', '440V',
      'Red', 'Blue',
      'Hammer', 'Wrench',
      'PVC', 'Copper',
      'Radiator', 'Battery',
      'Trap', '1/2 inch'
    ];

    const distractors = pool
      .filter(opt => opt !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return [correctAnswer, ...distractors]
      .sort(() => 0.5 - Math.random());
  }
}

/* =========================================
   MAIN NLP GENERATOR
=========================================*/

export const generateNLPQuestions = async (
  category,
  numQuestions = 5,
  attemptNumber = 0
) => {

  try {

    const knowledgeBase = new DynamicKnowledgeBase();
    const facts = knowledgeBase.getFacts(category);

    if (!facts.length) return null;

    const setIndex = Number(attemptNumber) % 3;

    let selectedFacts;

    if (setIndex === 0) {
      selectedFacts = [...facts];
    } 
    else if (setIndex === 1) {
      selectedFacts = [...facts].reverse();
    } 
    else {
      selectedFacts = [...facts].sort(() => Math.random() - 0.5);
    }

    const generated = [];

    for (let i = 0; i < numQuestions; i++) {

      const fact = selectedFacts[i % selectedFacts.length];
      const base = TemplateEngine.generateQuestion(fact, category);
      if (!base) continue;

      const options = DistractorEngine.generateOptions(base.correctAnswer);
      const correctIndex = options.indexOf(base.correctAnswer);

      generated.push({
        question: base.question,
        options,
        correctAnswer: correctIndex,
        explanation: base.explanation
      });
    }

    return generated;

  } catch (error) {
    console.error("Dynamic NLP Error:", error);
    return null;
  }
};

/* =========================================
   WRAPPER FUNCTION (IMPORTANT FIX)
=========================================*/

export const generateQuizQuestions = async (
  category,
  numQuestions = 5,
  attemptNumber = 0
) => {

  try {

    const questions = await generateNLPQuestions(
      category,
      numQuestions,
      attemptNumber
    );

    if (questions && questions.length > 0) {
      return questions;
    }

    return null;

  } catch (error) {
    console.error('Quiz Generation Error:', error);
    return null;
  }
};
