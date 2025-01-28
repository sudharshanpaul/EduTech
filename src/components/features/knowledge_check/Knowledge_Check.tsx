import React, { useState, useEffect, memo, useCallback } from 'react';
import { Book, Volume2, Brain, ChevronRight, AlertCircle, BarChart, RefreshCcw } from 'lucide-react';

// Extracted reusable card components
const CardHeader = memo(({ children }) => (
  <div className="flex flex-col space-y-1.5 p-6">{children}</div>
));

const CardTitle = memo(({ children }) => (
  <h3 className="text-2xl font-semibold leading-none tracking-tight">{children}</h3>
));

const CardContent = memo(({ children }) => (
  <div className="p-6 pt-0">{children}</div>
));

// Extracted QuizSetupScreen component
const QuizSetupScreen = memo(({ quizSetup, onInputChange, onStartQuiz }) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg animate-fade-in">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Book className="w-6 h-6 text-blue-600" />
        Knowledge Check Quiz
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Grade (e.g., 10th, 12th)"
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
          value={quizSetup.grade}
          onChange={(e) => onInputChange(e, 'grade')}
        />
        <input
          type="text"
          placeholder="Subject"
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
          value={quizSetup.subject}
          onChange={(e) => onInputChange(e, 'subject')}
        />
        <input
          type="text"
          placeholder="Topic"
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
          value={quizSetup.topic}
          onChange={(e) => onInputChange(e, 'topic')}
        />
        <select
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
          value={quizSetup.difficulty}
          onChange={(e) => onInputChange(e, 'difficulty')}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input
          type="number"
          placeholder="Number of Questions"
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
          value={quizSetup.questionCount}
          onChange={(e) => onInputChange(e, 'questionCount')}
          min="1"
          max="10"
        />
      </div>
      <button
        onClick={onStartQuiz}
        disabled={!quizSetup.grade || !quizSetup.subject || !quizSetup.topic}
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
                  hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Start Quiz
      </button>
    </CardContent>
  </div>
));

// Extracted StudyAssistant component
const StudyAssistant = memo(({ query, response, onQueryChange, onGetHelp }) => (
  <div className="mt-8 pt-8 border-t">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <Brain className="w-5 h-5 text-purple-600" />
      Study Assistant
    </h3>
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Ask a question about this topic..."
        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500"
        value={query}
        onChange={onQueryChange}
      />
      <button
        onClick={onGetHelp}
        className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg
                    hover:bg-purple-50 transition-all duration-300"
      >
        Get Help
      </button>
      {response && (
        <div className="p-4 bg-purple-50 rounded-lg">
          {response}
        </div>
      )}
    </div>
  </div>
));

// Extracted QuizQuestionScreen component
const QuizQuestionScreen = memo(({ 
  currentQuestion,
  questions,
  isVoicePlaying,
  onVoicePlayback,
  onSubmitAnswer,
  studyAssistantProps
}) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg animate-fade-in">
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</span>
        <button
          onClick={onVoicePlayback}
          className="flex items-center gap-2 text-blue-600"
        >
          <Volume2 className={`w-5 h-5 ${isVoicePlaying ? 'animate-pulse' : ''}`} />
          {isVoicePlaying ? 'Stop' : 'Listen'}
        </button>
      </div>
      
      <h2 className="text-xl font-semibold mb-6">{questions[currentQuestion]?.question}</h2>
      
      <div className="space-y-4">
        {questions[currentQuestion]?.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSubmitAnswer(index)}
            className="w-full p-4 text-left rounded-lg border hover:bg-blue-50 hover:border-blue-300
                      transition-all duration-300"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
    <StudyAssistant {...studyAssistantProps} />
  </div>
));

// Extracted ResultsScreen component
const ResultsScreen = memo(({ questions, answers, onRetakeQuiz }) => {
  const correctAnswers = answers.filter(
    (answer, index) => answer.selected === questions[index].correctAnswer
  ).length;
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BarChart className="w-6 h-6 text-blue-600" />
          Quiz Results
        </h2>
        
        <div className="p-6 bg-blue-50 rounded-xl mb-8">
          <h3 className="text-xl font-semibold mb-4">Performance Summary</h3>
          <p className="text-gray-700">
            You answered {correctAnswers} out of {questions.length} questions correctly ({(correctAnswers/questions.length * 100).toFixed(1)}%).
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Question Review</h3>
          {questions.map((question, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <p className="font-medium mb-2">{question.question}</p>
              <p className="text-green-600">Correct Answer: {question.options[question.correctAnswer]}</p>
              <p className={`${answers[index].selected === question.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                Your Answer: {question.options[answers[index].selected]}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onRetakeQuiz}
        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
                  hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        <RefreshCcw className="w-5 h-5" />
        Retake Quiz
      </button>
    </div>
  );
});

// Main component
const KnowledgeCheckQuiz = () => {
  const [quizSetup, setQuizSetup] = useState({
    grade: '',
    subject: '',
    topic: '',
    difficulty: 'medium',
    questionCount: 5
  });
  
  const [currentScreen, setCurrentScreen] = useState('setup');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [studyAssistantQuery, setStudyAssistantQuery] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Generate questions based on quiz setup
  const generateQuestions = useCallback((count) => {
    const sampleQuestions = [
      {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
      },
      {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Fe", "Au", "Cu"],
        correctAnswer: 2
      },
      {
        id: 4,
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "What is the largest organ in the human body?",
        options: ["Brain", "Heart", "Liver", "Skin"],
        correctAnswer: 3
      },
      {
        id: 6,
        question: "Which continent is the largest?",
        options: ["North America", "Africa", "Asia", "Europe"],
        correctAnswer: 2
      },
      {
        id: 7,
        question: "What is the chemical formula for water?",
        options: ["CO2", "H2O", "O2", "N2"],
        correctAnswer: 1
      },
      {
        id: 8,
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
        correctAnswer: 1
      },
      {
        id: 9,
        question: "What is the square root of 144?",
        options: ["10", "12", "14", "16"],
        correctAnswer: 1
      },
      {
        id: 10,
        question: "Which element has the symbol 'Fe'?",
        options: ["Gold", "Silver", "Iron", "Copper"],
        correctAnswer: 2
      }
    ];

    // If requested count is greater than available questions, return all questions
    if (count >= sampleQuestions.length) {
      return sampleQuestions;
    }

    // Randomly select the specified number of questions
    const shuffled = [...sampleQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }, []);

  // Memoized handlers
  const handleInputChange = useCallback((e, field) => {
    const value = e.target.value;
    setQuizSetup(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleStartQuiz = useCallback(() => {
    setCurrentScreen('quiz');
  }, []);

  const handleSubmitAnswer = useCallback((selectedOption) => {
    setAnswers(prev => [...prev, { 
      questionId: questions[currentQuestion].id, 
      selected: selectedOption 
    }]);
    
    setCurrentQuestion(prev => {
      if (prev < questions.length - 1) {
        return prev + 1;
      } else {
        setCurrentScreen('results');
        return prev;
      }
    });
  }, [currentQuestion, questions]);

  const handleVoicePlayback = useCallback(() => {
    setIsVoicePlaying(prev => !prev);
  }, []);

  const handleStudyAssistant = useCallback(() => {
    setAssistantResponse(`Here's help regarding ${studyAssistantQuery}`);
  }, [studyAssistantQuery]);

  const handleRetakeQuiz = useCallback(() => {
    setCurrentScreen('setup');
    setCurrentQuestion(0);
    setAnswers([]);
    setStudyAssistantQuery('');
    setAssistantResponse('');
    setQuizSetup({
      grade: '',
      subject: '',
      topic: '',
      difficulty: 'medium',
      questionCount: 5
    });
  }, []);

  // Quiz initialization effect
  useEffect(() => {
    if (currentScreen === 'quiz') {
      const newQuestions = generateQuestions(Number(quizSetup.questionCount));
      setQuestions(newQuestions);
      setCurrentQuestion(0);
      setAnswers([]);
    }
  }, [currentScreen, quizSetup.questionCount, generateQuestions]);

  // Voice playback effect
  useEffect(() => {
    if (isVoicePlaying) {
      // Voice playback logic would go here
      return () => {
        // Cleanup voice playback
      };
    }
  }, [isVoicePlaying]);

  // Memoized study assistant props
  const studyAssistantProps = {
    query: studyAssistantQuery,
    response: assistantResponse,
    onQueryChange: (e) => setStudyAssistantQuery(e.target.value),
    onGetHelp: handleStudyAssistant
  };

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       {currentScreen === 'setup' && (
//         <QuizSetupScreen 
//           quizSetup={quizSetup}
//           onInputChange={handleInputChange}
//           onStartQuiz={handleStartQuiz}
//         />
//       )}
//       {currentScreen === 'quiz' && (
//         <QuizQuestionScreen 
//           currentQuestion={currentQuestion}
//           questions={questions}
//           isVoicePlaying={isVoicePlaying}
//           onVoicePlayback={handleVoicePlayback}
//           onSubmitAnswer={handleSubmit

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {currentScreen === 'setup' && (
        <QuizSetupScreen 
          quizSetup={quizSetup}
          onInputChange={handleInputChange}
          onStartQuiz={handleStartQuiz}
        />
      )}
      {currentScreen === 'quiz' && (
        <QuizQuestionScreen 
          currentQuestion={currentQuestion}
          questions={questions}
          isVoicePlaying={isVoicePlaying}
          onVoicePlayback={handleVoicePlayback}
          onSubmitAnswer={handleSubmitAnswer}
          studyAssistantProps={studyAssistantProps}
        />
      )}
      {currentScreen === 'results' && (
        <ResultsScreen 
          questions={questions}
          answers={answers}
          onRetakeQuiz={handleRetakeQuiz}
        />
      )}
    </div>
  );
};

export default KnowledgeCheckQuiz;