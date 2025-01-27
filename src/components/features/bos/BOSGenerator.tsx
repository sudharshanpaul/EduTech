import React, { useState } from 'react';
import { Upload, BookOpen, Plus, Trash2 } from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  difficulty: number;
}

const BOSGenerator = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setTopics([
        ...topics,
        { id: Date.now().toString(), name: newTopic.trim(), difficulty: 5 }
      ]);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (id: string) => {
    setTopics(topics.filter(topic => topic.id !== id));
  };

  const handleDifficultyChange = (id: string, difficulty: number) => {
    setTopics(topics.map(topic => 
      topic.id === id ? { ...topic, difficulty } : topic
    ));
  };

  const handleGenerate = () => {
    setGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center space-x-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BOS Content Generator</h1>
            <p className="text-gray-600">Generate study materials and flashcards based on your syllabus</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          {/* File Upload */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Upload Syllabus</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
              <input
                type="file"
                id="syllabus"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <label
                htmlFor="syllabus"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-8 h-8 text-blue-600" />
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'Drop your syllabus here or click to upload'}
                </span>
              </label>
            </div>
          </div>

          {/* Topics */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Topics</h2>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Enter topic name"
                  className="flex-1 rounded-lg border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
                />
                <button
                  onClick={handleAddTopic}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {topics.map(topic => (
                  <div key={topic.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <span className="flex-1">{topic.name}</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={topic.difficulty}
                      onChange={(e) => handleDifficultyChange(topic.id, Number(e.target.value))}
                      className="w-24"
                    />
                    <span className="w-8 text-sm text-gray-600">{topic.difficulty}</span>
                    <button
                      onClick={() => handleRemoveTopic(topic.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Generated Content</h2>
          {generating ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Generating content...</p>
            </div>
          ) : topics.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <BookOpen className="w-12 h-12 mb-2" />
              <p>Add topics to generate content</p>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleGenerate}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Generate Content
              </button>
              <div className="border rounded-lg p-4">
                <p className="text-gray-600">Preview will appear here...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BOSGenerator;