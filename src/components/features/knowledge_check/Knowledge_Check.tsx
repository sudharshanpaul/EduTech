// import React, { useState } from 'react';
// import { Loader2, CheckCircle, XCircle, BookOpen, Rocket } from 'lucide-react';

// interface Question {
//   Question: string;
//   Options: { A: string; B: string; C: string; D: string };
//   Answer: string;
// }

// interface QuizState {
//   apiKey: string;
//   userDetails: {
//     grade: number;
//     subject: string;
//     topic: string;
//     difficulty: string;
//     numQuestions: number;
//   };
//   questions: Question[];
//   score: number;
//   answers: (string | null)[];
//   isLoading: boolean;
//   error: string | null;
//   showResults: boolean;
// }

// const QuizApplication = () => {
//   const [quiz, setQuiz] = useState<QuizState>({
//     apiKey: '',
//     userDetails: {
//       grade: 5,
//       subject: '',
//       topic: '',
//       difficulty: 'Beginner',
//       numQuestions: 10,
//     },
//     questions: [],
//     score: 0,
//     answers: [],
//     isLoading: false,
//     error: null,
//     showResults: false,
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === 'apiKey') {
//       setQuiz((prev) => ({ ...prev, apiKey: value }));
//     } else {
//       setQuiz((prev) => ({
//         ...prev,
//         userDetails: { ...prev.userDetails, [name]: value },
//       }));
//     }
//   };

//   const generateQuiz = async () => {
//     if (!quiz.apiKey || !quiz.userDetails.subject || !quiz.userDetails.topic) {
//       setQuiz((prev) => ({ ...prev, error: 'Please fill in all fields.' }));
//       return;
//     }

//     setQuiz((prev) => ({ ...prev, isLoading: true, error: null }));

//     try {
//       // Simulate API call to generate questions
//       const prompt = `Generate ${quiz.userDetails.numQuestions} ${quiz.userDetails.subject} questions about ${quiz.userDetails.topic} for a ${quiz.userDetails.grade}th grade student at ${quiz.userDetails.difficulty} level.`;
//       const response = await fetch('https://api.example.com/generate-quiz', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${quiz.apiKey}`,
//         },
//         body: JSON.stringify({ prompt }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to generate quiz questions.');
//       }

//       const data = await response.json();
//       setQuiz((prev) => ({
//         ...prev,
//         questions: data.questions,
//         answers: Array(data.questions.length).fill(null),
//         isLoading: false,
//       }));
//     } catch (err) {
//       setQuiz((prev) => ({
//         ...prev,
//         error: 'Failed to generate quiz. Please try again.',
//         isLoading: false,
//       }));
//     }
//   };

//   const handleAnswerSelect = (index: number, answer: string) => {
//     setQuiz((prev) => ({
//       ...prev,
//       answers: prev.answers.map((a, i) => (i === index ? answer : a)),
//     }));
//   };

//   const calculateScore = () => {
//     const score = quiz.questions.reduce((acc, question, index) => {
//       return acc + (quiz.answers[index] === question.Answer ? 1 : 0);
//     }, 0);

//     setQuiz((prev) => ({ ...prev, score, showResults: true }));
//   };

//   const resetQuiz = () => {
//     setQuiz((prev) => ({
//       ...prev,
//       questions: [],
//       answers: [],
//       score: 0,
//       showResults: false,
//     }));
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
//       {/* Header */}
//       <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 animate-slide-in-top">
//         <div className="flex items-center space-x-4">
//           <BookOpen className="w-8 h-8 text-blue-600 transition-transform duration-300 hover:scale-110" />
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">🎓 Quiz Application</h1>
//             <p className="text-gray-600">Test your knowledge on any topic!</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
//         {/* Input Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:shadow-xl animate-slide-in-left">
//           <h2 className="text-lg font-semibold mb-6 text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Quiz Parameters
//           </h2>
//           <div className="space-y-6">
//             <input
//               type="password"
//               name="apiKey"
//               value={quiz.apiKey}
//               onChange={handleInputChange}
//               placeholder="Enter Groq API Key"
//               className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
//             />
//             <input
//               type="number"
//               name="grade"
//               value={quiz.userDetails.grade}
//               onChange={handleInputChange}
//               placeholder="Grade Level"
//               min={1}
//               max={12}
//               className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
//             />
//             <input
//               type="text"
//               name="subject"
//               value={quiz.userDetails.subject}
//               onChange={handleInputChange}
//               placeholder="Subject"
//               className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
//             />
//             <input
//               type="text"
//               name="topic"
//               value={quiz.userDetails.topic}
//               onChange={handleInputChange}
//               placeholder="Topic"
//               className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
//             />
//             <select
//               name="difficulty"
//               value={quiz.userDetails.difficulty}
//               onChange={handleInputChange}
//               className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
//             >
//               <option value="Beginner">Beginner</option>
//               <option value="Intermediate">Intermediate</option>
//               <option value="Advanced">Advanced</option>
//             </select>
//             <input
//               type="number"
//               name="numQuestions"
//               value={quiz.userDetails.numQuestions}
//               onChange={handleInputChange}
//               placeholder="Number of Questions"
//               min={5}
//               max={20}
//               className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
//             />
//             <button
//               onClick={generateQuiz}
//               disabled={quiz.isLoading}
//               className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
//             >
//               {quiz.isLoading ? 'Generating...' : '🚀 Start Quiz'}
//             </button>
//             {quiz.error && (
//               <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
//                 {quiz.error}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Quiz Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in-right">
//           {quiz.questions.length > 0 ? (
//             <>
//               <h2 className="text-lg font-semibold mb-6">Quiz Questions</h2>
//               {quiz.questions.map((question, index) => (
//                 <div key={index} className="mb-6">
//                   <h3 className="font-semibold text-gray-800">Question {index + 1}</h3>
//                   <p className="text-gray-600">{question.Question}</p>
//                   <div className="mt-4 space-y-2">
//                     {Object.entries(question.Options).map(([key, value]) => (
//                       <button
//                         key={key}
//                         onClick={() => handleAnswerSelect(index, value)}
//                         className={`w-full text-left px-4 py-2 rounded-lg border ${
//                           quiz.answers[index] === value
//                             ? 'border-blue-600 bg-blue-50'
//                             : 'border-gray-200 hover:bg-gray-50'
//                         } transition-all duration-300`}
//                       >
//                         {value}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//               <button
//                 onClick={calculateScore}
//                 className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg"
//               >
//                 Submit Quiz
//               </button>
//             </>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-pulse">
//               <Rocket className="w-12 h-12 mb-2" />
//               <p>Enter quiz parameters to get started</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Results Section */}
//       {quiz.showResults && (
//         <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg animate-slide-in-bottom">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Results</h2>
//           <div className="flex items-center space-x-4 mb-6">
//             <div className="text-4xl font-bold text-blue-600">
//               {quiz.score}/{quiz.questions.length}
//             </div>
//             <div className="flex-1">
//               <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-blue-600"
//                   style={{ width: `${(quiz.score / quiz.questions.length) * 100}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//           <div className="space-y-6">
//             {quiz.questions.map((question, index) => (
//               <div key={index} className="bg-gray-50 rounded-xl p-5">
//                 <h3 className="font-semibold text-gray-800">Question {index + 1}</h3>
//                 <p className="text-gray-600">{question.Question}</p>
//                 <div className="mt-4 space-y-2">
//                   {Object.entries(question.Options).map(([key, value]) => (
//                     <div
//                       key={key}
//                       className={`px-4 py-2 rounded-lg border ${
//                         quiz.answers[index] === value
//                           ? quiz.answers[index] === question.Answer
//                             ? 'border-green-600 bg-green-50'
//                             : 'border-red-600 bg-red-50'
//                           : question.Answer === value
//                           ? 'border-green-600 bg-green-50'
//                           : 'border-gray-200'
//                       }`}
//                     >
//                       {value}
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-4 flex items-center space-x-2">
//                   {quiz.answers[index] === question.Answer ? (
//                     <CheckCircle className="w-5 h-5 text-green-600" />
//                   ) : (
//                     <XCircle className="w-5 h-5 text-red-600" />
//                   )}
//                   <span className="text-sm text-gray-600">
//                     Your answer: {quiz.answers[index] || 'Not answered'}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button
//             onClick={resetQuiz}
//             className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg"
//           >
//             Take Another Quiz
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizApplication;



import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle, BookOpen, Rocket } from 'lucide-react';

interface Question {
  Question: string;
  Options: { A: string; B: string; C: string; D: string };
  Answer: string;
}

interface QuizState {
  userDetails: {
    grade: number;
    subject: string;
    topic: string;
    difficulty: string;
    num_questions: number;  // Changed to match backend
  };
  questions: Question[];
  score: number;
  answers: (string | null)[];
  isLoading: boolean;
  error: string | null;
  showResults: boolean;
}

const QuizApplication = () => {
  const [quiz, setQuiz] = useState<QuizState>({
    userDetails: {
      grade: 5,
      subject: '',
      topic: '',
      difficulty: 'Beginner',
      num_questions: 10,  // Changed to match backend
    },
    questions: [],
    score: 0,
    answers: [],
    isLoading: false,
    error: null,
    showResults: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuiz((prev) => ({
      ...prev,
      userDetails: { ...prev.userDetails, [name]: value },
    }));
  };

  const generateQuiz = async () => {
    if (!quiz.userDetails.subject || !quiz.userDetails.topic) {
      setQuiz((prev) => ({ ...prev, error: 'Please fill in all fields.' }));
      return;
    }

    setQuiz((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('http://127.0.0.1:8004/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',  // Add this line
        body: JSON.stringify({
          grade: Number(quiz.userDetails.grade),
          subject: quiz.userDetails.subject,
          topic: quiz.userDetails.topic,
          difficulty: quiz.userDetails.difficulty,
          num_questions: Number(quiz.userDetails.num_questions)
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || 'Failed to generate quiz questions.');
      }

      const questions = await response.json();
      console.log('Received questions:', questions);
      
      setQuiz((prev) => ({
        ...prev,
        questions,
        answers: Array(questions.length).fill(null),
        isLoading: false,
        showResults: false,
      }));
    } catch (err) {
      console.error('Error:', err);
      setQuiz((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to generate quiz. Please try again.',
        isLoading: false,
      }));
    }
};

  const handleAnswerSelect = (index: number, answer: string) => {
    setQuiz((prev) => ({
      ...prev,
      answers: prev.answers.map((a, i) => (i === index ? answer : a)),
    }));
  };

  const submitQuiz = async () => {
    try {
      const submission = {
        answers: quiz.answers.map((answer, index) => ({
          question_index: index,
          answer: answer || '',
        })),
        questions: quiz.questions,
      };

      const response = await fetch('http://127.0.0.1:8004/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz.');
      }

      const result = await response.json();
      setQuiz((prev) => ({
        ...prev,
        score: result.score,
        showResults: true,
      }));
    } catch (err) {
      setQuiz((prev) => ({
        ...prev,
        error: 'Failed to submit quiz. Please try again.',
      }));
    }
  };

  const resetQuiz = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [],
      answers: [],
      score: 0,
      showResults: false,
    }));
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl p-4 md:p-8 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900">🎓 Quiz Application</h1>
              <p className="text-gray-600">Test your knowledge on any topic!</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quiz Parameters
            </h2>
            <div className="space-y-4">
              <input
                type="number"
                name="grade"
                value={quiz.userDetails.grade}
                onChange={handleInputChange}
                placeholder="Grade Level"
                min={1}
                max={12}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="subject"
                value={quiz.userDetails.subject}
                onChange={handleInputChange}
                placeholder="Subject"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="topic"
                value={quiz.userDetails.topic}
                onChange={handleInputChange}
                placeholder="Topic"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="difficulty"
                value={quiz.userDetails.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <input
                type="number"
                name="num_questions"
                value={quiz.userDetails.num_questions}
                onChange={handleInputChange}
                placeholder="Number of Questions"
                min={5}
                max={20}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={generateQuiz}
                disabled={quiz.isLoading}
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg disabled:opacity-50"
              >
                {quiz.isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  '🚀 Start Quiz'
                )}
              </button>
              {quiz.error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {quiz.error}
                </div>
              )}
            </div>
          </div>

          {/* Quiz Section */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg">
            {quiz.questions.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Quiz Questions</h2>
                {quiz.questions.map((question, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800">Question {index + 1}</h3>
                    <p className="text-gray-600 mt-2">{question.Question}</p>
                    <div className="mt-4 space-y-2">
                      {Object.entries(question.Options).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => handleAnswerSelect(index, value)}
                          className={`w-full text-left p-3 rounded-lg border ${
                            quiz.answers[index] === value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={submitQuiz}
                  className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg"
                >
                  Submit Quiz
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Rocket className="w-12 h-12 mb-2" />
                <p>Enter quiz parameters to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {quiz.showResults && (
          <div className="mt-6 bg-white rounded-xl p-4 md:p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quiz Results</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-bold text-blue-600">
                {quiz.score}/{quiz.questions.length}
              </div>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${(quiz.score / quiz.questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {quiz.questions.map((question, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800">Question {index + 1}</h3>
                  <p className="text-gray-600 mt-2">{question.Question}</p>
                  <div className="mt-3 space-y-2">
                    {Object.entries(question.Options).map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-3 rounded-lg border ${
                          quiz.answers[index] === value
                            ? quiz.answers[index] === question.Answer
                              ? 'border-green-600 bg-green-50'
                              : 'border-red-600 bg-red-50'
                            : question.Answer === value
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200'
                        }`}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {quiz.answers[index] === question.Answer ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm text-gray-600">
                      Your answer: {quiz.answers[index] || 'Not answered'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={resetQuiz}
              className="w-full mt-6 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
            >
              Take Another Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizApplication;