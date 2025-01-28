import React, { useState } from 'react';
import { BookOpen, MonitorPlay, Globe, Youtube, Loader2 } from 'lucide-react';

interface ResourceCategory {
  title: string;
  icon: React.ReactNode;
  items: ResourceItem[];
}

interface ResourceItem {
  title: string;
  description: string;
  link: string;
}

const LearningResourceGenerator = () => {
  const [topic, setTopic] = useState('');
  const [resources, setResources] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Dummy data for demonstration
  const sampleResources: ResourceCategory[] = [
    {
      title: 'Books',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      items: [
        {
          title: 'Deep Learning Fundamentals',
          description: 'Comprehensive guide to machine learning basics',
          link: '#'
        },
        {
          title: 'Advanced Python Programming',
          description: 'Master Python with practical examples',
          link: '#'
        }
      ]
    },
    {
      title: 'Courses',
      icon: <MonitorPlay className="w-5 h-5 text-green-600" />,
      items: [
        {
          title: 'Machine Learning A-Z',
          description: 'Hands-on course with real-world projects',
          link: '#'
        },
        {
          title: 'Web Development Bootcamp',
          description: 'Full-stack development from scratch',
          link: '#'
        }
      ]
    },
    {
      title: 'Websites',
      icon: <Globe className="w-5 h-5 text-purple-600" />,
      items: [
        {
          title: 'FreeCodeCamp',
          description: 'Open-source learning platform',
          link: 'https://freecodecamp.org'
        },
        {
          title: 'Stack Overflow',
          description: 'Developer community Q&A',
          link: 'https://stackoverflow.com'
        }
      ]
    },
    {
      title: 'YouTube',
      icon: <Youtube className="w-5 h-5 text-red-600" />,
      items: [
        {
          title: 'Fireship',
          description: 'Short technical videos',
          link: 'https://youtube.com/fireship'
        },
        {
          title: 'Traversy Media',
          description: 'Web development tutorials',
          link: 'https://youtube.com/traversymedia'
        }
      ]
    }
  ];

  const handleGenerate = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResources(sampleResources);
      setLoading(false);
    }, 1500);
  };

  const filteredResources =
    activeCategory === 'All'
      ? resources
      : resources.filter((category) => category.title === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 animate-slide-in-top">
        <div className="flex items-center space-x-4">
          <BookOpen className="w-8 h-8 text-blue-600 transition-transform duration-300 hover:scale-110" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learning Resource Generator</h1>
            <p className="text-gray-600">Discover the best resources to master any topic</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        {/* Input Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:shadow-xl animate-slide-in-left">
          <h2 className="text-lg font-semibold mb-6 text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Enter Your Learning Topic
          </h2>
          <div className="space-y-6">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Machine Learning, Web Development..."
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
              {loading ? 'Generating...' : 'Generate Resources'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in-right">
          <h2 className="text-lg font-semibold mb-6">Recommended Resources</h2>

          {/* Navigation Bar */}
          <div className="flex space-x-4 mb-6">
            {['All','Books', 'Courses', 'Websites', 'YouTube'].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-600">Searching best resources...</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-pulse">
                <BookOpen className="w-12 h-12 mb-2" />
                <p>Enter a topic to get learning resources</p>
              </div>
            ) : (
              filteredResources.map((category) => (
                <div 
                  key={category.title} 
                  className="bg-gray-50 rounded-xl p-5 transform transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    {category.icon}
                    <h3 className="font-semibold text-gray-800">{category.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {category.items.map((item, index) => (
                      <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-white rounded-lg hover:shadow-md transition-all duration-300 
                                  transform hover:-translate-y-1 hover:border-blue-200 border border-transparent"
                      >
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningResourceGenerator;
