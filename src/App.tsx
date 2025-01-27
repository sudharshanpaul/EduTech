import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import BOSGenerator from './components/features/bos/BOSGenerator';
import CodeGenerator from './components/features/code_generator/CodeGenerator';

function AppContent() {
  const location = useLocation();

  return (
    <Layout>
      <Routes location={location}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bos" element={<BOSGenerator />} />
        <Route path="/code_generator" element={<CodeGenerator />} />
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