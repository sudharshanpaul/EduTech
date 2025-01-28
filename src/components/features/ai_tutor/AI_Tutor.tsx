import React, { useState } from 'react';
import { MessageSquare, Mic, FileText, Loader2 } from 'lucide-react';

const AITutor = () => {
  const [subject, setSubject] = useState<string>('');
  const [teachingStyle, setTeachingStyle] = useState<string>('Detailed Explanation');
  const [interactiveMode, setInteractiveMode] = useState<string>('Chat');
  const [chatMessages, setChatMessages] = useState<{ sender: string; message: string }[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceOutput, setVoiceOutput] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfQAMessages, setPdfQAMessages] = useState<{ sender: string; message: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Simulate voice recording and AI response
  const handleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setVoiceOutput('');
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setLoading(true);
        // Simulate AI response after recording
        setTimeout(() => {
          setVoiceOutput(`This is a voice response about ${subject} in ${teachingStyle} style.`);
          setLoading(false);
        }, 1500);
      }, 3000);
    }
  };

  const handleSendChatMessage = () => {
    if (subject.trim()) {
      setLoading(true);
      const userMessage = { sender: 'User', message: subject };
      setChatMessages((prev) => [...prev, userMessage]);

      // Simulate AI response
      setTimeout(() => {
        const aiMessage = { sender: 'AI', message: `This is a detailed explanation about ${subject} in ${teachingStyle} style.` };
        setChatMessages((prev) => [...prev, aiMessage]);
        setLoading(false);
      }, 1500);
    }
  };

  const handlePdfQA = () => {
    if (pdfFile && subject.trim()) {
      setLoading(true);
      const userMessage = { sender: 'User', message: subject };
      setPdfQAMessages((prev) => [...prev, userMessage]);

      // Simulate AI response
      setTimeout(() => {
        const aiMessage = { sender: 'AI', message: `This is a response based on the uploaded PDF about ${subject}.` };
        setPdfQAMessages((prev) => [...prev, aiMessage]);
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 animate-slide-in-top">
        <div className="flex items-center space-x-4">
          <MessageSquare className="w-8 h-8 text-blue-600 transition-transform duration-300 hover:scale-110" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Tutor</h1>
            <p className="text-gray-600">Your personal AI-powered learning assistant</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:shadow-xl animate-slide-in-left">
          <h2 className="text-lg font-semibold mb-6 text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Enter Your Subject
          </h2>
          <div className="space-y-6">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, Physics, History..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
            />

            <select
              value={teachingStyle}
              onChange={(e) => setTeachingStyle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
            >
              <option value="Detailed Explanation">Detailed Explanation</option>
              <option value="Simplified Learning">Simplified Learning</option>
              <option value="Exam Preparation">Exam Preparation</option>
              <option value="Quick Summary">Quick Summary</option>
            </select>

            <div className="flex space-x-4">
              {['Chat', 'Voice', 'PDF Q&A'].map((mode) => (
                <label
                  key={mode}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    value={mode}
                    checked={interactiveMode === mode}
                    onChange={() => setInteractiveMode(mode)}
                    className="form-radio text-blue-600 focus:ring-blue-500"
                  />
                  <span>{mode}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Display Selected Options */}
        <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in-right">
          <h2 className="text-lg font-semibold mb-6">Selected Options</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Subject:</span> {subject || 'Not selected'}</p>
            <p><span className="font-semibold">Teaching Style:</span> {teachingStyle}</p>
            <p><span className="font-semibold">Interactive Mode:</span> {interactiveMode}</p>
          </div>
        </div>

        {/* Chat Interface */}
        {interactiveMode === 'Chat' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in-right">
            <h2 className="text-lg font-semibold mb-6">Chat with AI Tutor</h2>
            <div className="h-96 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 ${msg.sender === 'User' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      msg.sender === 'User'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                    >
                    {msg.message}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 
                          focus:border-blue-500 transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
              />
              <button
                onClick={handleSendChatMessage}
                disabled={!subject.trim() || loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:scale-[1.02] disabled:opacity-50 
                          disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Voice Interface */}
        {interactiveMode === 'Voice' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in-right">
            <h2 className="text-lg font-semibold mb-6">Voice Interaction</h2>
            <div className="space-y-6">
              <button
                onClick={handleVoiceRecording}
                disabled={!subject.trim() || loading}
                className={`w-full py-3 px-6 ${
                  isRecording ? 'bg-red-600' : 'bg-blue-600'
                } text-white rounded-lg hover:scale-[1.02] disabled:opacity-50 
                          disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg`}
              >
                {isRecording ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span>Recording...</span>
                  </div>
                ) : (
                  'Start Recording'
                )}
              </button>
              {voiceOutput && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-900">{voiceOutput}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PDF Q&A Interface */}
        {interactiveMode === 'PDF Q&A' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in-right">
            <h2 className="text-lg font-semibold mb-6">PDF Q&A</h2>
            <div className="space-y-6">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 
                          focus:border-blue-500 transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
              />
              {pdfFile && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-900">Uploaded PDF: {pdfFile.name}</p>
                </div>
              )}

              {/* Chat-like Conversation */}
              <div className="h-96 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-4">
                {pdfQAMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${msg.sender === 'User' ? 'text-right' : 'text-left'}`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        msg.sender === 'User'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                )}
              </div>

              {/* Input for Asking Questions */}
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ask a question about the PDF..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 
                            focus:border-blue-500 transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
                />
                <button
                  onClick={handlePdfQA}
                  disabled={!pdfFile || !subject.trim() || loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:scale-[1.02] disabled:opacity-50 
                            disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Ask
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITutor;