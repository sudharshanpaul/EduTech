import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import BOSGenerator from './components/features/bos/BOSGenerator';
import CodeGenerator from './components/features/code_generator/CodeGenerator';
import ResourceGenerator from './components/features/resource_generator/ResourceGenerator';
import SOSExamRescueKit from './components/features/sos_exam_prep_kit/SOS_ExamResourceGenerator';
import FlowChartGenerator from './components/features/flowchart_generator/FlowchartGenerator';
import PuzzleSolver from './components/features/puzzle_solver/PuzzleSolver';
import AITutor from './components/features/ai_tutor/AI_Tutor';
import KnowledgeCheckQuiz from './components/features/knowledge_check/Knowledge_Check'

function AppContent() {
  const location = useLocation();

  return (
    <Layout>
      <Routes location={location}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bos" element={<BOSGenerator />} />
        <Route path="/code_generator" element={<CodeGenerator />} />
        {/* Add this new route */}
        <Route path="/resource_generator" element={<ResourceGenerator />} />
        <Route path="/sos_exam_prep_kit" element={<SOSExamRescueKit />} />
        <Route path="/flowchart_generator" element={<FlowChartGenerator />} />
        <Route path="/puzzle_solver" element={<PuzzleSolver />} />
        <Route path="/ai_tutor" element={<AITutor />} />
        <Route path="/knowledge_check" element={<KnowledgeCheckQuiz />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Layout from './components/layout/Layout';
// import Dashboard from './components/dashboard/Dashboard';
// import BOSGenerator from './components/features/bos/BOSGenerator';
// import CodeGenerator from './components/features/code_generator/CodeGenerator';

// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/bos" element={<BOSGenerator />} />
//           <Route path="/code-generator" element={<CodeGenerator />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;