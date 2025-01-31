import React, { useState } from "react";
import axios from "axios";

const QuizGenerator = () => {
  const [context, setContext] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!context.trim() || !apiKey.trim()) {
      setError("Please enter both context and API key.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://127.0.0.1:8002/generate-quiz", {
        context,
        groq_api_key: apiKey
      });
      setQuestions(response.data);
      setAnswers({});
      setResults(null);
    } catch (err) {
      setError("Failed to generate questions. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8002/evaluate-quiz", { answers });
      setResults(response.data);
    } catch (err) {
      setError("Failed to evaluate answers. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6">AI-Powered Quiz Generator</h1>
        
        {/* API Key Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Groq API Key
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Groq API key"
          />
        </div>

        {/* Context Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Context
          </label>
          <textarea
            className="w-full border border-gray-300 p-2 rounded-md"
            rows="5"
            placeholder="Enter the context for quiz generation..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md transition-colors"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {questions && (
          <div className="mt-8 space-y-6">
            {/* Multiple Choice Questions */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Multiple Choice Questions</h2>
              {questions.mcq.map((q, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-3">{q.question}</p>
                  <div className="space-y-2">
                    {Object.entries(q.options).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded">
                        <input
                          type="radio"
                          name={`mcq-${index}`}
                          value={key}
                          onChange={(e) => 
                            setAnswers({ ...answers, [`mcq-${index}`]: e.target.value })
                          }
                          className="text-blue-600"
                        />
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Fill in the Blank Questions */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Fill in the Blank Questions</h2>
              {questions.fillBlanks.map((q, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-3">{q.question}</p>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded-md"
                    placeholder="Enter your answer..."
                    onChange={(e) => 
                      setAnswers({ ...answers, [`fitb-${index}`]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-md transition-colors"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Answers"}
            </button>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Results</h2>
            {results.map((res, index) => (
              <div key={index} className="bg-white border p-4 rounded-lg">
                <p className="font-medium">{res.question}</p>
                <div className={`mt-2 font-semibold ${
                  res.correct ? "text-green-600" : "text-red-600"
                }`}>
                  {res.correct ? "✅ Correct" : "❌ Incorrect"}
                </div>
                <p className="mt-2">
                  <span className="font-medium">Correct Answer:</span> {res.correct_answer}
                </p>
                <p className="mt-2 text-gray-600">{res.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;