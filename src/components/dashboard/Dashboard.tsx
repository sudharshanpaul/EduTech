import React from 'react';
import FeatureCard from './FeatureCard';
import { Feature } from '../../types';
import { BookOpen, Brain, Map, Book, Lightbulb, Puzzle as PuzzlePiece, FileCode, Calculator } from 'lucide-react';

const features: Feature[] = [
  {
    id: '1',
    title: 'BOS Content Generator',
    description: 'Generate study materials and flashcards based on your syllabus',
    icon: 'BookOpen',
    path: '/bos'
  },
  {
    id: '2',
    title: 'AI Tutor',
    description: 'Get personalized help with multiple teaching styles',
    icon: 'Brain',
    path: '/ai_tutor'
  },
  {
    id: '3',
    title: 'Roadmap Generator',
    description: 'Create custom learning paths for any domain',
    icon: 'Map',
    path: '/flowchart_generator'
  },
  {
    id: '4',
    title: 'Resource Provider',
    description: 'Find curated learning resources and materials',
    icon: 'Book',
    path: '/resource_generator'
  },
  {
    id: '5',
    title: 'SOS Exam Prep',
    description: 'Quick exam preparation with cheat sheets and mnemonics',
    icon: 'Lightbulb',
    path: '/sos_exam_prep_kit'
  },
  {
    id: '6',
    title: 'Puzzle Solver',
    description: 'Get step-by-step solutions for complex problems',
    icon: 'PuzzlePiece',
    path: '/puzzle_solver'
  },
  {
    id: '7',
    title: 'Code Generator',
    description: 'Generate and explain code solutions',
    icon: 'FileCode',
    path: '/code_generator'
  },
  {
    id: '8',
    title: 'Calculator',
    description: 'Advanced calculator for quick computations',
    icon: 'Calculator',
    path: '/calculator'
  }
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight text-white animate-fade-in">
            Welcome to EduTech
          </h1>
          <p className="mt-4 max-w-xl text-lg text-blue-100 animate-slide-up">
            Empowering your learning journey with AI-powered tools
          </p>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4">
          <div className="h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <FeatureCard feature={feature} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;