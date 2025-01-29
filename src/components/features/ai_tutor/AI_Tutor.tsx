import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Loader2, FileText } from 'lucide-react';

// Custom Card Components
const Card = ({ className = '', children }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = '', children }) => (
  <div className={`p-4 border-b ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = '', children }) => (
  <h2 className={`text-xl font-semibold ${className}`}>
    {children}
  </h2>
);

const CardContent = ({ className = '', children }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const AITutor = () => {
  const [subject, setSubject] = useState('General Learning');
  const [teachingStyle, setTeachingStyle] = useState('Simplified Learning');
  const [interactiveMode, setInteractiveMode] = useState('Chat');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    configureBot();
  }, [subject, teachingStyle, interactiveMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const configureBot = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          learning_style: teachingStyle,
          mode: interactiveMode
        })
      });
      if (!response.ok) throw new Error('Configuration failed');
    } catch (error) {
      console.error('Error configuring bot:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          subject,
          learning_style: teachingStyle
        })
      });

      if (!response.ok) throw new Error('Chat request failed');

      const data = await response.json();
      setChatHistory(prev => [...prev, 
        { role: 'user', content: message },
        { role: 'assistant', content: data.response }
      ]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/upload-pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('PDF upload failed');

      const data = await response.json();
      setPdfFile(file);
      alert('PDF uploaded successfully!');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            AI Tutor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="General Learning">General Learning</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="History">History</option>
            </select>

            <select
              value={teachingStyle}
              onChange={(e) => setTeachingStyle(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Simplified Learning">Simplified Learning</option>
              <option value="Detailed Explanation">Detailed Explanation</option>
              <option value="Exam Preparation">Exam Preparation</option>
              <option value="Quick Summary">Quick Summary</option>
            </select>

            <div className="flex gap-4">
              {['Chat', 'PDF Q&A'].map((mode) => (
                <label key={mode} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={mode}
                    checked={interactiveMode === mode}
                    onChange={(e) => setInteractiveMode(e.target.value)}
                    className="form-radio text-blue-600"
                  />
                  <span>{mode}</span>
                </label>
              ))}
            </div>

            {interactiveMode === 'PDF Q&A' && (
              <div className="mt-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {pdfFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Uploaded: {pdfFile.name}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Send'
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITutor;