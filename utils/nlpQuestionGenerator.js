// /**
//  * NLP-Based Question Generator
//  * Pure Algorithmic NLP – No API Required
//  */

// import AsyncStorage from '@react-native-async-storage/async-storage';

// /* ===============================
//    NLP PROCESSOR
// =================================*/
// class NLPProcessor {

//   static generateDistractors(correctAnswer, category) {
//     let distractors = [];

//     // Semantic distractors
//     distractors.push(...this.generateSemanticDistractors(correctAnswer, category));

//     // Numeric distractors
//     if (this.isNumeric(correctAnswer)) {
//       distractors.push(...this.generateNumericDistractors(correctAnswer));
//     }

//     // Remove duplicates + correct answer
//     distractors = [...new Set(distractors)]
//       .filter(opt => opt !== correctAnswer)
//       .slice(0, 3);

//     return distractors;
//   }

//   static isNumeric(value) {
//     return /^\d+/.test(value.toString());
//   }

//   static generateNumericDistractors(correctAnswer) {
//     const map = {
//       '220V': ['110V', '440V', '380V'],
//       '10 feet': ['3 feet', '5 feet', '20 feet'],
//       '30-35 PSI': ['20-25 PSI', '40-45 PSI', '50-55 PSI'],
//       '3/4 inch': ['1/2 inch', '1 inch', '1.5 inch']
//     };

//     return map[correctAnswer] || [];
//   }

//   static generateSemanticDistractors(correctAnswer, category) {
//     const semanticMap = {
//       Electrician: {
//         'Green/Yellow': ['Red', 'Black', 'Blue'],
//         'Red': ['Black', 'Green/Yellow', 'Blue'],
//         'Protecting circuit from overload': [
//           'Measuring current',
//           'Connecting wires',
//           'Testing voltage'
//         ],
//         'All of the above': [
//           'Check voltage only',
//           'Turn off main switch only',
//           'Wear gloves only'
//         ]
//       },
//       Plumber: {
//         'CPVC': ['PVC', 'Copper', 'Galvanized iron'],
//         'Prevent sewer gases': [
//           'Increase pressure',
//           'Filter water',
//           'Reduce flow'
//         ]
//       },
//       Mechanic: {
//         'Spark plug socket': ['Wrench', 'Pliers', 'Screwdriver'],
//         'Synchronize engine valves': [
//           'Drive wheels',
//           'Cool engine',
//           'Charge battery'
//         ]
//       },
//       'Data Entry': {
//         'Ctrl+S': ['Ctrl+P', 'Ctrl+A', 'Ctrl+V'],
//         'Adds numbers together': [
//           'Multiplies numbers',
//           'Divides numbers',
//           'Subtracts numbers'
//         ]
//       }
//     };

//     return semanticMap[category]?.[correctAnswer] || [];
//   }
// }

// /* ===============================
//    KNOWLEDGE BASE
// =================================*/
// class NLPKnowledgeBase {

//   constructor() {
//     this.knowledge = {
//       Electrician: [
//         {
//           base: 'What is the standard voltage for household supply in India?',
//           correctAnswer: '220V',
//           explanation: 'India uses 220V for household supply.',
//           difficulty: 'intermediate'
//         },
//         {
//           base: 'What color wire is used for Earth connection?',
//           correctAnswer: 'Green/Yellow',
//           explanation: 'Green/Yellow is used for earth connection.',
//           difficulty: 'basic'
//         },
//         {
//           base: 'What is MCB used for?',
//           correctAnswer: 'Protecting circuit from overload',
//           explanation: 'MCB protects circuits from overload.',
//           difficulty: 'intermediate'
//         }
//       ],

//       Plumber: [
//         {
//           base: 'What is the standard pipe size for main water supply?',
//           correctAnswer: '3/4 inch',
//           explanation: '3/4 inch is standard for main supply.',
//           difficulty: 'intermediate'
//         },
//         {
//           base: 'Which material is best for hot water pipes?',
//           correctAnswer: 'CPVC',
//           explanation: 'CPVC is suitable for hot water.',
//           difficulty: 'intermediate'
//         }
//       ],

//       Mechanic: [
//         {
//           base: 'What is the standard tire pressure for most cars?',
//           correctAnswer: '30-35 PSI',
//           explanation: '30-35 PSI is standard tire pressure.',
//           difficulty: 'basic'
//         },
//         {
//           base: 'What tool is used to remove spark plugs?',
//           correctAnswer: 'Spark plug socket',
//           explanation: 'Spark plug socket is used to remove spark plugs.',
//           difficulty: 'basic'
//         }
//       ],

//       'Data Entry': [
//         {
//           base: 'What is the shortcut key to save a file in Excel?',
//           correctAnswer: 'Ctrl+S',
//           explanation: 'Ctrl+S saves the file.',
//           difficulty: 'basic'
//         },
//         {
//           base: 'What does SUM function do?',
//           correctAnswer: 'Adds numbers together',
//           explanation: 'SUM adds numbers.',
//           difficulty: 'basic'
//         }
//       ]
//     };
//   }

//   getConcepts(category) {
//     return this.knowledge[category] || [];
//   }
// }

// /* ===============================
//    MAIN GENERATOR
// =================================*/
// export const generateNLPQuestions = async (
//   category,
//   numQuestions = 5
// ) => {

//   try {

//     const usedKey = `usedQuestions_${category}`;
//     const stored = await AsyncStorage.getItem(usedKey);
//     const usedQuestions = stored ? JSON.parse(stored) : [];
//     const usedSet = new Set(usedQuestions.map(q => q.toLowerCase()));

//     const knowledgeBase = new NLPKnowledgeBase();
//     const concepts = knowledgeBase.getConcepts(category);

//     if (concepts.length === 0) return null;

//     const shuffled = [...concepts].sort(() => Math.random() - 0.5);
//     const generated = [];

//     for (let concept of shuffled) {

//       if (generated.length >= numQuestions) break;

//       if (usedSet.has(concept.base.toLowerCase())) continue;

//       const correct = concept.correctAnswer;
//       const distractors = NLPProcessor.generateDistractors(correct, category);

//       const options = [correct, ...distractors];

//       // Ensure 4 options always
//       while (options.length < 4) {
//         options.push('None of the above');
//       }

//       const shuffledOptions = options.sort(() => Math.random() - 0.5);
//       const correctIndex = shuffledOptions.indexOf(correct);

//       generated.push({
//         question: concept.base,
//         options: shuffledOptions,
//         correctAnswer: correctIndex,
//         explanation: concept.explanation,
//         difficulty: concept.difficulty
//       });

//       usedSet.add(concept.base.toLowerCase());
//     }

//     // Save used questions
//     await AsyncStorage.setItem(
//       usedKey,
//       JSON.stringify([...usedSet])
//     );

//     return generated.length > 0 ? generated : null;

//   } catch (error) {
//     console.error('NLP Generation Error:', error);
//     return null;
//   }
// };

// export { NLPProcessor, NLPKnowledgeBase };
// import AsyncStorage from '@react-native-async-storage/async-storage';

// /* =========================================
//    DYNAMIC KNOWLEDGE BASE
// =========================================*/

// class DynamicKnowledgeBase {
//     constructor() {
//         this.knowledge = {

//             'Data Entry': [
//                 { type: 'shortcut', action: 'Save file', key: 'Ctrl+S' },
//                 { type: 'shortcut', action: 'Copy', key: 'Ctrl+C' },
//                 { type: 'shortcut', action: 'Paste', key: 'Ctrl+V' },
//                 { type: 'shortcut', action: 'Undo last action', key: 'Ctrl+Z' },
//                 { type: 'formula', concept: 'Average', formula: '=AVERAGE()' },
//                 { type: 'formula', concept: 'Sum', formula: '=SUM()' }
//             ],

//             Electrician: [
//                 { type: 'voltage', value: '220V' },
//                 { type: 'wire', purpose: 'Earth connection', color: 'Green/Yellow' },
//                 { type: 'device', name: 'MCB', purpose: 'Protecting circuit from overload' },
//                 { type: 'tool', purpose: 'Test voltage', name: 'Tester' },
//                 { type: 'safety', rule: 'Turn off main power before working' }
//             ],

//             Mechanic: [
//                 { type: 'pressure', value: '30-35 PSI' },
//                 { type: 'tool', purpose: 'Remove spark plugs', name: 'Spark plug socket' },
//                 { type: 'component', name: 'Radiator', purpose: 'Cool engine' },
//                 { type: 'component', name: 'Alternator', purpose: 'Charge battery' },
//                 { type: 'fluid', name: 'Engine oil', purpose: 'Lubricate moving parts' }
//             ],

//             Plumber: [
//                 { type: 'pipe', size: '3/4 inch' },
//                 { type: 'material', name: 'CPVC', purpose: 'Hot water pipes' },
//                 { type: 'tool', purpose: 'Cut PVC pipes', name: 'Pipe cutter' },
//                 { type: 'device', name: 'Trap', purpose: 'Prevent sewer gas' },
//                 { type: 'issue', cause: 'Sudden valve closure', problem: 'Water hammer' }
//             ],
//             Carpenter: [
//                 { type: 'tool', purpose: 'Cut wood in straight lines', name: 'Handsaw' },
//                 { type: 'tool', purpose: 'Cut curves in wood', name: 'Jigsaw' },
//                 { type: 'tool', purpose: 'Measure wood accurately', name: 'Measuring tape' },
//                 { type: 'component', name: 'Dovetail joint', purpose: 'Strong wood joint connection' },
//                 { type: 'safety', rule: 'Wear safety goggles while cutting wood' }
//             ],

//         };
//     }

//     getFacts(category) {
//         return this.knowledge[category] || [];
//     }
// }

// /* =========================================
//    TEMPLATE ENGINE
// =========================================*/

// class TemplateEngine {

//     static generateQuestion(fact,category) {

//         switch (fact.type) {

//             case 'shortcut':
//                 return {
//                     question: `Which key is used to ${fact.action}?`,
//                     correctAnswer: fact.key,
//                     explanation: `${fact.key} is used to ${fact.action}.`
//                 };

//             case 'formula':
//                 return {
//                     question: `Which formula calculates ${fact.concept}?`,
//                     correctAnswer: fact.formula,
//                     explanation: `${fact.formula} calculates ${fact.concept}.`
//                 };

//             case 'voltage':
//                 return {
//                     question: 'What is the standard household voltage in India?',
//                     correctAnswer: fact.value,
//                     explanation: `${fact.value} is standard voltage.`
//                 };

//             case 'wire':
//                 return {
//                     question: `Which color wire is used for ${fact.purpose}?`,
//                     correctAnswer: fact.color,
//                     explanation: `${fact.color} is used for ${fact.purpose}.`
//                 };

//             case 'device':
//                 return {
//                     question: `What is ${fact.name} used for?`,
//                     correctAnswer: fact.purpose,
//                     explanation: `${fact.name} is used for ${fact.purpose}.`
//                 };

//             case 'tool':
//                 return {
//                     question: `Which tool is used to ${fact.purpose}?`,
//                     correctAnswer: fact.name,
//                     explanation: `${fact.name} is used to ${fact.purpose}.`
//                 };

//             case 'safety':
//                 return {
//                     question: `What is an important safety rule in ${category}?`,
//                     correctAnswer: fact.rule,
//                     explanation: fact.rule
//                 };

//             case 'component':
//                 return {
//                     question: `What is the function of ${fact.name}?`,
//                     correctAnswer: fact.purpose,
//                     explanation: `${fact.name} is used to ${fact.purpose}.`
//                 };

//             case 'fluid':
//                 return {
//                     question: `What is the purpose of ${fact.name}?`,
//                     correctAnswer: fact.purpose,
//                     explanation: `${fact.name} is used to ${fact.purpose}.`
//                 };

//             case 'pipe':
//                 return {
//                     question: 'What is the standard pipe size for main water supply?',
//                     correctAnswer: fact.size,
//                     explanation: `${fact.size} is standard size.`
//                 };

//             case 'material':
//                 return {
//                     question: `Which material is used for ${fact.purpose}?`,
//                     correctAnswer: fact.name,
//                     explanation: `${fact.name} is used for ${fact.purpose}.`
//                 };

//             case 'issue':
//                 return {
//                     question: `What causes ${fact.problem}?`,
//                     correctAnswer: fact.cause,
//                     explanation: `${fact.cause} causes ${fact.problem}.`
//                 };

//             default:
//                 return null;
//         }
//     }
// }

// /* =========================================
//    DISTRACTOR ENGINE
// =========================================*/

// class DistractorEngine {

//     static generateOptions(correctAnswer) {

//         const pool = [
//             'Ctrl+P', 'Ctrl+A', 'Ctrl+X',
//             '=SUM()', '=COUNT()',
//             '110V', '440V',
//             'Red', 'Blue',
//             'Hammer', 'Wrench',
//             'PVC', 'Copper',
//             'Radiator', 'Battery',
//             'Trap', '1/2 inch'
//         ];

//         const distractors = pool
//             .filter(opt => opt !== correctAnswer)
//             .sort(() => 0.5 - Math.random())
//             .slice(0, 3);

//         return [correctAnswer, ...distractors]
//             .sort(() => 0.5 - Math.random());
//     }
// }

// /* =========================================
//    MAIN GENERATOR (3 SET SYSTEM)
// =========================================*/

// export const generateQuizQuestions = async (
//   category,
//   numQuestions = 5,
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
