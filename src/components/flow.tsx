import React, { useEffect, useRef } from 'react';
import Viz from 'viz.js'; // Import the Viz function
import { Module, render } from 'viz.js/full.render.js'; // Import the full renderer

const Flowchart = ({ nodes, edges }) => {
  const graphRef = useRef(null);

  // Generate the DOT language string for the graph
  const generateDot = (nodes, edges) => {
    let dot = 'digraph G {\n';
    
    // Add nodes
    nodes.forEach(node => {
      dot += `  "${node}" [label="${node}"];\n`;
    });

    // Add edges
    edges.forEach(edge => {
      dot += `  "${edge[0]}" -> "${edge[1]}";\n`;
    });

    dot += '}';
    return dot;
  };

  useEffect(() => {
    const dot = generateDot(nodes, edges);

    // Render the DOT string as an SVG
    const viz = new Viz({ Module, render }); // Initialize Viz with the full renderer
    viz
      .renderSVGElement(dot)
      .then((svg) => {
        // Append the SVG to the DOM
        if (graphRef.current) {
          graphRef.current.innerHTML = '';
          graphRef.current.appendChild(svg);
        }
      })
      .catch((error) => {
        console.error('Error rendering graph:', error);
      });
  }, [nodes, edges]);

  return <div ref={graphRef}></div>;
};

export default Flowchart;