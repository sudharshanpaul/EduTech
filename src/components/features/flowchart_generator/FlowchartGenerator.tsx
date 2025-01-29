// import React, { useState } from 'react';
// import { LayoutTemplate, ArrowRight, Image, FileText, Loader2 } from 'lucide-react';
// import Flowchart from '../../flow';
// // MermaidFlowchart component
// const MermaidFlowchart = ({ flowchartDefinition }) => {
//   const [error, setError] = useState(null);

//   if (!flowchartDefinition) {
//     return null;
//   }

//   return (
//     <div className="w-full">
//       <div className="border border-gray-200 rounded-lg p-4 bg-white">
//         <pre className="mermaid">
//           {flowchartDefinition}
//         </pre>
//       </div>
//       {error && (
//         <div className="mt-2 text-red-500 text-sm">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// const FlowChartGenerator = () => {
//   const [topic, setTopic] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [flowchartData, setFlowchartData] = useState(null);

//   const handleGenerate = async () => {
//     if (!topic.trim()) return;

//     setLoading(true);
//     setError('');
//     setFlowchartData(null);

//     try {
//       const response = await fetch('http://localhost:8000/generate-flowchart/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ topic: topic.trim() }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to generate flowchart');
//       }

//       const data = await response.json();
      
//       // Convert the DOT format to Mermaid format
//       // This is a simplified example - you might need to adjust the conversion logic
//       const mermaidDefinition = `graph TD
//         ${data.dot_source.replace(/digraph \w+ \{|\}/g, '')
//           .replace(/->/, '-->')}`;
      
//       setFlowchartData({
//         ...data,
//         mermaid_source: mermaidDefinition
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const data = {
//     nodes: [
//       "Data Collection",
//       "Data Cleaning",
//       "Data Transformation",
//       "Feature Engineering",
//       "Model Selection",
//       "Training",
//       "Model Evaluation",
//       "Hyperparameter Tuning",
//       "Retraining",
//       "Model Deployment"
//     ],
//     edges: [
//       ["Data Collection", "Data Cleaning"],
//       ["Data Cleaning", "Data Transformation"],
//       ["Data Transformation", "Feature Engineering"],
//       ["Feature Engineering", "Model Selection"],
//       ["Model Selection", "Training"],
//       ["Training", "Model Evaluation"],
//       ["Model Evaluation", "Hyperparameter Tuning"],
//       ["Hyperparameter Tuning", "Retraining"],
//       ["Retraining", "Model Deployment"]
//     ]
//   };
  
//   return (
    
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Header */}
//       <Flowchart nodes={data.nodes} edges={data.edges} />
//       <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
//         <div className="flex items-center space-x-4">
//           <LayoutTemplate className="w-8 h-8 text-blue-600" />
//           <div>
            
//             <h1 className="text-2xl font-bold text-gray-900">Flow Chart Generator</h1>
//             <p className="text-gray-600">Visualize complex topics with ease</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-8">
//         {/* Input Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg">
//           <h2 className="text-lg font-semibold mb-6 text-blue-600">
//             Enter Your Topic
//           </h2>
//           <div className="space-y-6">
//             <input
//               type="text"
//               value={topic}
//               onChange={(e) => setTopic(e.target.value)}
//               placeholder="e.g., Software Development Lifecycle, Photosynthesis..."
//               className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
//             />

//             <button
//               onClick={handleGenerate}
//               disabled={!topic.trim() || loading}
//               className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg 
//                         hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   <span>Generating Flowchart...</span>
//                 </div>
//               ) : (
//                 'Generate Flowchart'
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Results Section */}
//         <div className="bg-white rounded-2xl p-6 shadow-lg">
//           <h2 className="text-lg font-semibold mb-6">Generated Flowchart</h2>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
//               {error}
//             </div>
//           )}

//           {loading ? (
//             <div className="flex flex-col items-center justify-center h-64 space-y-4">
//               <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
//               <p className="text-gray-600">Generating flowchart...</p>
//             </div>
//           ) : flowchartData ? (
//             <div className="space-y-8">
//               {/* Model Response Section */}
//               <div className="bg-gray-50 rounded-xl p-5">
//                 <div className="flex items-center space-x-2 mb-4">
//                   <ArrowRight className="w-5 h-5 text-blue-600" />
//                   <h3 className="font-semibold text-gray-800">Model Response (Text Roadmap)</h3>
//                 </div>
//                 <pre className="whitespace-pre-wrap text-gray-900">{flowchartData.raw_content}</pre>
//               </div>

//               {/* Flowchart Section */}
//               <div className="bg-gray-50 rounded-xl p-5">
//                 <div className="flex items-center space-x-2 mb-4">
//                   <Image className="w-5 h-5 text-green-600" />
//                   <h3 className="font-semibold text-gray-800">Flowchart Visualization</h3>
//                 </div>
//                 <MermaidFlowchart flowchartDefinition={flowchartData.mermaid_source} />
//               </div>

//               {/* Explanation Section */}
//               <div className="bg-gray-50 rounded-xl p-5">
//                 <div className="flex items-center space-x-2 mb-4">
//                   <FileText className="w-5 h-5 text-purple-600" />
//                   <h3 className="font-semibold text-gray-800">Explanation</h3>
//                 </div>
//                 <p className="text-gray-900">{flowchartData.explanation}</p>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-64 text-gray-400">
//               <LayoutTemplate className="w-12 h-12 mb-2" />
//               <p>Enter a topic to generate a flowchart</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FlowChartGenerator;



import React, { useState } from 'react';
import { LayoutTemplate, ArrowRight, Image, FileText, Loader2 } from 'lucide-react';
import Flowchart from '../../flow';

// MermaidFlowchart component
const MermaidFlowchart = ({ flowchartDefinition }) => {
  const [error, setError] = useState(null);

  if (!flowchartDefinition) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <pre className="mermaid">
          {flowchartDefinition}
        </pre>
      </div>
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

const FlowChartGenerator = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flowchartData, setFlowchartData] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setFlowchartData(null);

    try {
      const response = await fetch('http://localhost:8001/generate-flowchart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate flowchart');
      }

      const data = await response.json();
      setFlowchartData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      
      
      <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
        <div className="flex items-center space-x-4">
          <LayoutTemplate className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Flow Chart Generator</h1>
            <p className="text-gray-600">Visualize complex topics with ease</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-6 text-blue-600">
            Enter Your Topic
          </h2>
          <div className="space-y-6">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Software Development Lifecycle, Photosynthesis..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />

            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || loading}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Flowchart...</span>
                </div>
              ) : (
                'Generate Flowchart'
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-6">Generated Flowchart</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-gray-600">Generating flowchart...</p>
            </div>
          ) : flowchartData ? (
            <div className="space-y-8">
              {/* Model Response Section */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center space-x-2 mb-4">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Model Response (Text Roadmap)</h3>
                </div>
                <pre className="whitespace-pre-wrap text-gray-900">{flowchartData.raw_content}</pre>
              </div>

              {/* Flowchart Section */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center space-x-2 mb-4">
                  <Image className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-800">Flowchart Visualization</h3>
                </div>
                {flowchartData && (
        <Flowchart 
          nodes={flowchartData.nodes} 
          edges={flowchartData.edges} 
        />
      )}
              </div>

              {/* Explanation Section */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Explanation</h3>
                </div>
                <p className="text-gray-900">{flowchartData.explanation}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
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