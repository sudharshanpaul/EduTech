import React, { useState } from 'react';
import { ClipboardList, Brain, AlertTriangle, Loader2 } from 'lucide-react';

const SOSExamRescueKit = () => {
  const [examTopic, setExamTopic] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<string>('Cheatsheet');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setGeneratedContent(''); // Clear previous content

    // Simulate API call
    setTimeout(() => {
      let content = '';
      switch (selectedComponent) {
        case 'Cheatsheet':
          content = `**Cheatsheet for ${examTopic}**\n\n- Key concept 1: Explanation\n- Key concept 2: Explanation\n- Key concept 3: Explanation`;
          break;
        case 'Memory Aids':
          content = `**Memory Aids for ${examTopic}**\n\n- Mnemonic 1: Explanation\n- Mnemonic 2: Explanation\n- Mnemonic 3: Explanation`;
          break;
        case 'Common Mistakes':
          content = `**Common Mistakes in ${examTopic}**\n\n- Mistake 1: Explanation\n- Mistake 2: Explanation\n- Mistake 3: Explanation`;
          break;
        default:
          content = 'No content generated.';
      }
      setGeneratedContent(content);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 animate-slide-in-top">
        <div className="flex items-center space-x-4">
          <ClipboardList className="w-8 h-8 text-blue-600 transition-transform duration-300 hover:scale-110" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SOS Exam Rescue Kit</h1>
            <p className="text-gray-600">Last minute study aids for Exam preparation</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        {/* Input Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:shadow-xl animate-slide-in-left">
          <h2 className="text-lg font-semibold mb-6 text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Enter Your Exam Topic
          </h2>
          <div className="space-y-6">
            <input
              type="text"
              value={examTopic}
              onChange={(e) => setExamTopic(e.target.value)}
              placeholder="e.g., Calculus, Organic Chemistry, World History..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
            />

            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
            >
              <option value="Cheatsheet">Cheatsheet</option>
              <option value="Memory Aids">Memory Aids</option>
              <option value="Common Mistakes">Common Mistakes</option>
            </select>

            <button
              onClick={handleGenerate}
              disabled={!examTopic.trim() || loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                        hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed 
                        transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in-right">
          <h2 className="text-lg font-semibold mb-6">Generated Content</h2>

          <div className="space-y-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-600">Generating content...</p>
              </div>
            ) : generatedContent ? (
              <div className="bg-gray-50 rounded-xl p-5 transform transition-all duration-300 hover:scale-[1.01]">
                <div className="flex items-center space-x-2 mb-4">
                  {selectedComponent === 'Cheatsheet' && (
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                  )}
                  {selectedComponent === 'Memory Aids' && (
                    <Brain className="w-5 h-5 text-green-600" />
                  )}
                  {selectedComponent === 'Common Mistakes' && (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                  <h3 className="font-semibold text-gray-800">{selectedComponent}</h3>
                </div>
                <pre className="whitespace-pre-wrap text-gray-900">{generatedContent}</pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-pulse">
                <ClipboardList className="w-12 h-12 mb-2" />
                <p>Enter a topic and select a component to generate content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSExamRescueKit;