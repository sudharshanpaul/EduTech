import React, { useState } from 'react';
import { LayoutTemplate, ArrowRight, Image, FileText, Loader2 } from 'lucide-react';

const FlowChartGenerator = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelResponse, setModelResponse] = useState<string>('');
  const [flowchartImage, setFlowchartImage] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');

  const handleGenerate = () => {
    setLoading(true);
    setModelResponse('');
    setFlowchartImage('');
    setExplanation('');

    // Simulate API call
    setTimeout(() => {
      // Mock data for demonstration
      setModelResponse(
        `1. Start -> 2. Research Topic -> 3. Analyze Data -> 4. Create Flowchart -> 5. Review -> 6. End`
      );
      setFlowchartImage('https://via.placeholder.com/600x400.png?text=Generated+Flowchart+Image');
      setExplanation(
        `This flowchart outlines the process of creating a flowchart for the topic "${topic}". It starts with research, followed by data analysis, flowchart creation, review, and finally concludes.`
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 animate-slide-in-top">
        <div className="flex items-center space-x-4">
          <LayoutTemplate className="w-8 h-8 text-blue-600 transition-transform duration-300 hover:scale-110" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Flow Chart Generator</h1>
            <p className="text-gray-600">Visualize complex topics with ease</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:shadow-xl animate-slide-in-left">
          <h2 className="text-lg font-semibold mb-6 text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Enter Your Topic
          </h2>
          <div className="space-y-6">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Software Development Lifecycle, Photosynthesis..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />

            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                        hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed 
                        transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {loading ? 'Generating Flowchart...' : 'Generate Flowchart'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in-right">
          <h2 className="text-lg font-semibold mb-6">Generated Flowchart</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-gray-600">Generating flowchart...</p>
            </div>
          ) : modelResponse ? (
            <div className="space-y-8">
              {/* Model Response Section */}
              <div className="bg-gray-50 rounded-xl p-5 transform transition-all duration-300 hover:scale-[1.01]">
                <div className="flex items-center space-x-2 mb-4">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Model Response (Text Roadmap)</h3>
                </div>
                <pre className="whitespace-pre-wrap text-gray-900">{modelResponse}</pre>
              </div>

              {/* Flowchart Image Section */}
              <div className="bg-gray-50 rounded-xl p-5 transform transition-all duration-300 hover:scale-[1.01]">
                <div className="flex items-center space-x-2 mb-4">
                  <Image className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Flowchart Image</h3>
                </div>
                <img
                  src={flowchartImage}
                  alt="Generated Flowchart"
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>

              {/* Explanation Section */}
              <div className="bg-gray-50 rounded-xl p-5 transform transition-all duration-300 hover:scale-[1.01]">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Explanation</h3>
                </div>
                <p className="text-gray-900">{explanation}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-pulse">
              <LayoutTemplate className="w-12 h-12 mb-2" />
              <p>Enter a topic to generate a flowchart</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowChartGenerator;