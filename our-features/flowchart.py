import os
import re
import streamlit as st
from graphviz import Digraph
from langchain_groq import ChatGroq
from collections import OrderedDict

# Set up the Groq API Key
api_key = "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" # Replace with your actual Groq API key
os.environ["GROQ_API_KEY"] = api_key

# Initialize the ChatGroq model
llm = ChatGroq(groq_api_key=api_key, model_name="Gemma2-9b-It")

def generate_flowchart_content(topic):
    """
    Uses ChatGroq to generate flowchart content for the given topic.
    """
    prompt = f"""
    Create a detailed vertical flowchart for the topic "{topic}". Use EXACTLY this format:

    1. List steps as arrows between nodes using format: "Node A -> Node B"
    2. After all nodes, write explanation starting with "Explanation:"
    
    Example:
    Data Collection -> Data Preprocessing
    Data Preprocessing -> Model Selection
    Model Selection -> Training and Validation
    Explanation: This flowchart shows the machine learning workflow...

    Your response must contain ONLY nodes and explanation in this format. No extra text.
    """
    
    # Call the Groq model
    response = llm.predict(prompt)
    return response

def parse_flowchart_content(content):
    """
    Parses the flowchart content into nodes and edges for Graphviz, and extracts explanation.
    """
    nodes = OrderedDict()
    edges = []
    explanation = []
    
    # Split content into lines and clean
    lines = [line.strip() for line in content.split("\n") if line.strip()]
    
    # Process each line
    explanation_found = False
    for line in lines:
        if re.match(r'^explanation:?', line, re.IGNORECASE):
            explanation_found = True
            explanation_text = re.split(r'explanation:?', line, flags=re.IGNORECASE)[-1].strip()
            if explanation_text:
                explanation.append(explanation_text)
        elif explanation_found:
            explanation.append(line)
        elif '->' in line:
            parts = [p.strip() for p in line.split('->')]
            if len(parts) == 2:
                source, target = parts
                if source not in nodes:
                    nodes[source] = True
                if target not in nodes:
                    nodes[target] = True
                edges.append((source, target))

    return list(nodes.keys()), edges, ' '.join(explanation).strip()

# Streamlit UI
st.title("Flowchart Generator with Groq API")
st.write("Enter a topic name, and the app will generate a flowchart explaining it.")

# User Input
topic = st.text_input("Enter the topic name:", placeholder="E.g., Photosynthesis, Machine Learning")

# Generate Flowchart
if st.button("Generate Flowchart"):
    if topic.strip():
        try:
            # Step 1: Get the flowchart content from Groq model
            content = generate_flowchart_content(topic.strip())
            st.write("### Model Response:")
            st.code(content)  # Debug view
            
            # Step 2: Parse the flowchart content
            nodes, edges, explanation = parse_flowchart_content(content)
            
            # Validate parsed content
            if not nodes:
                raise ValueError("No nodes detected in the response")
                
            # Step 3: Render the flowchart
            dot = Digraph()
            dot.attr(rankdir='TB', nodesep='0.5', ranksep='0.5')
            
            # Add nodes with consistent styling
            for node in nodes:
                dot.node(node, shape="box", style="rounded,filled", fillcolor="#e0f0ff")
            
            # Add edges
            for edge in edges:
                dot.edge(edge[0], edge[1])
            
            # Force linear layout
            with dot.subgraph() as s:
                s.attr(rank='same')
                for i in range(len(nodes)-1):
                    s.edge(nodes[i], nodes[i+1], style="invis")

            st.graphviz_chart(dot)
            
            # Display explanation
            st.write("### Explanation of the Flowchart:")
            st.write(explanation if explanation else "No explanation provided in the model response")

        except Exception as e:
            st.error(f"Error: {str(e)}")
            st.info("Common issues: 1) Model response format unexpected 2) Network error")
    else:
        st.warning("Please provide a valid topic.")