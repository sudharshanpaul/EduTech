import React, { useState } from 'react';
import { Upload, BookOpen, ChevronDown, Loader, Check } from 'lucide-react';

interface Unit {
  name: string;
  topics: string[];
}

const BOSGenerator = () => {
  const [mode, setMode] = useState<'direct' | 'bos' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [analyzedUnits, setAnalyzedUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState<{ front: string; back: string }[]>([]);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const generateFlashcards = () => {
    const generatedCards = selectedTopics.flatMap(topic => [
      {
        front: `What is the main concept of ${topic}?`,
        back: `The primary concept of ${topic} involves...`
      },
      {
        front: `Key formula in ${topic}`,
        back: `The fundamental formula is: X = Y + Z`
      }
    ]);
    
    setFlashcards(generatedCards);
    setShowFlashcards(true);
  };
  
  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
  };
  
  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const mockUnits: Unit[] = [
    { name: 'Unit 1: Introduction', topics: ['Basic Concepts', 'History', 'Fundamental Principles'] },
    { name: 'Unit 2: Core Theory', topics: ['Main Theories', 'Advanced Concepts', 'Case Studies'] },
    { name: 'Unit 3: Applications', topics: ['Practical Implementations', 'Real-world Examples'] },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzedUnits(mockUnits);
      setAnalyzing(false);
    }, 1500);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setIsSubmitted(true); // Set isSubmitted to true to show the generated content page
    }, 2000);
  };

  const handleDownload = () => {
    const content = `
      Subject: ${subjectName}
      Unit: ${selectedUnit}
      
      Selected Topics:
      ${selectedTopics.join('\n    ')}
  
      Study Materials:
      ${selectedTopics.map(topic => `
      ${topic}:
      - Detailed content and explanations
      - Important concept 1
      - Key formula/equation
      - Practical example`).join('\n')}
    `;
  
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subjectName}_Study_Materials.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (mode === null) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Syllabus Content Generator</h1>
                <p className="text-gray-600">Choose how you want to generate content</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
            <button
              onClick={() => setMode('direct')}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Generate Content Directly
            </button>
            <button
              onClick={() => setMode('bos')}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Generate Content Based on BOS
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'direct') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Direct Content Generation</h1>
                <p className="text-gray-600">Enter the details to generate content directly</p>
              </div>
            </div>
          </div>
          {!isSubmitted ? (
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">1. Enter Subject Name</h3>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Enter subject name"
                  className="w-full rounded-lg border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">2. Enter Topic Name</h3>
                <input
                  type="text"
                  value={selectedTopics[0] || ''}
                  onChange={(e) => setSelectedTopics([e.target.value])}
                  placeholder="Enter topic name"
                  className="w-full rounded-lg border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">3. Select Level</h3>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  className="w-full rounded-lg border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating || !subjectName || !selectedTopics.length}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200"
              >
                {generating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Generating Content...</span>
                  </div>
                ) : (
                  'Generate Study Materials'
                )}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Generated Content for {subjectName}</h2>
                <Check className="w-6 h-6 text-green-600" />
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Download Study Materials
                  </button>
                  <button
                    onClick={generateFlashcards}
                    className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    Generate Flashcards ({selectedTopics.length * 2})
                  </button>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Selected Topic:</h3>
                  <p>{selectedTopics[0]}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-4">Study Materials:</h3>
                  <div className="space-y-4">
                    {selectedTopics.map((topic, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
                        <h4 className="font-medium mb-2 text-lg">{topic}</h4>
                        <p className="text-gray-600 mb-4">Detailed content and explanations for {topic.toLowerCase()}...</p>
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-500 font-medium mb-2">Key points:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Important concept 1</li>
                            <li>Key formula/equation</li>
                            <li>Practical example</li>
                            <li>Common applications</li>
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Syllabus Content Generator</h1>
              <p className="text-gray-600">Complete the form to generate study materials</p>
            </div>
          </div>
        </div>

        {!isSubmitted ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">1. Upload Syllabus PDF</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                <input
                  type="file"
                  id="syllabus"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf"
                />
                <label
                  htmlFor="syllabus"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : 'Click to upload PDF syllabus'}
                  </span>
                </label>
              </div>
            </div>

            {selectedFile && (
              <div className="space-y-4">
                <h3 className="font-semibold">2. Enter Subject Details</h3>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="Enter subject name"
                  className="w-full rounded-lg border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={!subjectName || analyzing}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
                >
                  {analyzing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Analyzing Syllabus...</span>
                    </div>
                  ) : (
                    'Analyze Syllabus'
                  )}
                </button>
              </div>
            )}

            {analyzedUnits.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">3. Select Unit</h3>
                <div className="relative">
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full appearance-none rounded-lg border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a Unit</option>
                    {analyzedUnits.map((unit, index) => (
                      <option key={index} value={unit.name}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {selectedUnit && (
              <div className="space-y-4">
                <h3 className="font-semibold">4. Select Topic</h3>
                <div className="relative">
                  <select
                    onChange={(e) => setSelectedTopics([e.target.value])}
                    className="w-full h-12 rounded-lg border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Topic</option>
                    {analyzedUnits.find(u => u.name === selectedUnit)?.topics.map((topic, index) => (
                      <option key={index} value={topic}>{topic}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-sm text-gray-500">Select a single topic</p>
              </div>
            )}

            {selectedTopics.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">5. Select Level</h3>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  className="w-full rounded-lg border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            )}

            {selectedTopics.length > 0 && (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200"
              >
                {generating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Generating Content...</span>
                  </div>
                ) : (
                  'Generate Study Materials'
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Generated Content for {subjectName}</h2>
              <Check className="w-6 h-6 text-green-600" />
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Download Study Materials
                </button>
                <button
                  onClick={generateFlashcards}
                  className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  Generate Flashcards ({selectedTopics.length * 2})
                </button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Selected Unit:</h3>
                <p>{selectedUnit}</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg space-y-4">
                <h3 className="font-semibold mb-2">Selected Topics:</h3>
                <ul className="list-disc pl-5">
                  {selectedTopics.map((topic, index) => (
                    <li key={index} className="mb-2">{topic}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-4">Study Materials:</h3>
                <div className="space-y-4">
                  {selectedTopics.map((topic, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="font-medium mb-2 text-lg">{topic}</h4>
                      <p className="text-gray-600 mb-4">Detailed content and explanations for {topic.toLowerCase()}...</p>
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-500 font-medium mb-2">Key points:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Important concept 1</li>
                          <li>Key formula/equation</li>
                          <li>Practical example</li>
                          <li>Common applications</li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BOSGenerator;