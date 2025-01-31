import streamlit as st
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import PyPDF2
import speech_recognition as sr

from langchain_groq import ChatGroq
import re
from langchain.schema import HumanMessage, AIMessage

class ReActAgent:
    def __init__(self, llm, system_prompt, max_tokens=2000):
        self.llm = llm
        self.system_prompt = system_prompt
        self.max_tokens = max_tokens
        self.max_iterations = 3

    def _truncate_context(self, context, max_tokens=2000):
        return context[-max_tokens:] if len(context) > max_tokens else context

    def react_reasoning(self, query, context=None):
        react_prompt = f"""{self.system_prompt}
        
ReAct Process:
1. Analyze teaching style requirements
2. Identify key concepts in query
3. Select appropriate response structure
4. Verify style compliance
5. Generate final answer

Query: {query}
Context: {context or 'No specific context'}
Final Answer: """
        
        try:
            response = self.llm.predict(text=react_prompt)
            return response.split("Final Answer:")[-1].strip()
        except Exception as e:
            return f"Error: {str(e)}"

class RAGChatbot:
    def __init__(self, api_key):
        os.environ["GROQ_API_KEY"] = api_key
        self.llm = ChatGroq(
            groq_api_key=api_key, 
            model_name="mixtral-8x7b-32768",
            temperature=0.3,
            max_tokens=1024
        )

        self.memory = ConversationBufferMemory(
            memory_key="history",
            return_messages=True,
            input_key="input",
            output_key="output"
        )
        
        self.conversation = ConversationChain(
            llm=self.llm,
            memory=self.memory,
            verbose=False,
            input_key="input",
            output_key="output"
        )

        self.document_chunks = []
        self.recognizer = sr.Recognizer()
        self.system_prompt = ""
        self.current_mode = "Chat"
        self.react_agent = None
        self.active_style = "General"
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=self._count_tokens_approx
        )

    def _count_tokens_approx(self, text):
        return max(round(len(text) / 4), 1)

    def _truncate_context(self, text, max_tokens=2000):
        tokens = self._count_tokens_approx(text)
        if tokens > max_tokens:
            chars = max_tokens * 4
            return text[:chars]
        return text

    def process_text_input(self, user_input):
        try:
            # Get conversation history
            history = self.memory.load_memory_variables({})["history"]
            
            # Get document context
            relevant_chunks = []
            if self.document_chunks:
                relevant_chunks = self._get_relevant_chunks(user_input)
            
            context = "\n\n".join(relevant_chunks)[:4000]
            context = self._truncate_context(context)

            # Build comprehensive prompt
            prompt = f"""**Follow these style rules:** {self.active_style}
            
            Conversation History:
            {self._format_history(history)}
            
            Document Context:
            {context or 'No relevant document sections found'}
            
            User Question: {user_input}
            
            Required Format: {self._get_style_instructions()}"""
            
            # Generate response
            if self.current_mode == "Chat" and self.react_agent:
                response = self.react_agent.react_reasoning(prompt, context)
                # Manually save to memory for React path
                self.memory.save_context({"input": user_input}, {"output": response})
            else:
                response = self.conversation.predict(input=prompt)
            
            return self.enforce_style(response)
            
        except Exception as e:
            return f"Error: {str(e)}"
        
    def _format_history(self, history):
        return "\n".join([
            f"User: {msg.content}" if isinstance(msg, HumanMessage) 
            else f"Assistant: {msg.content}" 
            for msg in history
        ]) or "No conversation history"
    
    
    def _get_style_instructions(self):
        style_short = {
            "Detailed Explanation": "Academic language with technical terms and section headers",
            "Simplified Learning": "Conversational with emojis and metaphors",
            "Exam Preparation": "Problem-solving strategies with warning symbols",
            "Quick Summary": "Bullet points with icon prefixes"
        }
        return style_short.get(self.active_style, "")
    

    def get_ai_teacher_system_prompt(self, subject, learning_style, has_document):
        style_config = {
            "Detailed Explanation": {
                "sections": ["## Concept Overview", "### Core Components", "#### Example", "## Summary"],
                "rules": [
                    "Use academic language with technical terms",
                    "Include 1-2 real-world applications",
                    "Provide historical context where relevant",
                    "Structure with clear section headers"
                ],
                "format": "Markdown headers and bullet points"
            },
            "Simplified Learning": {
                "sections": ["🔍 Real-World Analogy", "💡 Basic Idea", "📌 Key Points", "🎯 Try This"],
                "rules": [
                    "Use everyday language and metaphors",
                    "Include emojis every 2-3 sentences",
                    "Limit paragraphs to 3 lines max",
                    "Ask rhetorical questions"
                ],
                "format": "Conversational with emoji emphasis"
            },
            "Exam Preparation": {
                "sections": ["⚠️ Common Mistakes", "✅ Best Approach", "⏱️ Time Saver", "📝 Practice Problem"],
                "rules": [
                    "Focus on problem-solving strategies",
                    "Include warning symbols for pitfalls",
                    "Provide step-by-step solutions",
                    "Offer memorization techniques"
                ],
                "format": "Numbered lists with symbols"
            },
            "Quick Summary": {
                "sections": ["📌 Essentials", "🔗 Connections", "🚀 Actions"],
                "rules": [
                    "Use bullet points only",
                    "Limit to 5 key points max",
                    "Include icon prefixes",
                    "Avoid complete sentences"
                ],
                "format": "Concise bulleted list"
            }
        }

        style = style_config.get(learning_style, style_config["Detailed Explanation"])
        sections = "\n".join(style["sections"])
        rules = "\n".join(f"- {r}" for r in style["rules"])
        
        return f"""**AI Tutor Configuration**
Subject: {subject}
Teaching Style: {learning_style}
Document Context: {'Available ✅' if has_document else 'None ❌'}

**Response Structure:**
{sections}

**Style Rules:**
{rules}

**Format Requirements:**
{style['format']}

**Interaction Guidelines:**
1. Vary response structures between answers
2. Never repeat example scenarios
3. Adapt depth to user's apparent level
4. Maintain natural conversation flow
5. Enforce style strictly in all responses"""

    def _set_style_temperature(self):
        temp_settings = {
            "Detailed Explanation": 0.2,
            "Simplified Learning": 0.5,
            "Exam Preparation": 0.3,
            "Quick Summary": 0.1
        }
        self.llm.temperature = temp_settings.get(self.active_style, 0.3)

    def enforce_style(self, response):
        style_rules = {
            "Detailed Explanation": [
                (r"(Concept Overview|Core Components)", r"## \1"),
                (r"Example:", "#### Practical Example:"),
                (r"(\d+\.\s)", "- ")
            ],
            "Simplified Learning": [
                (r"\.\s", " "),
                (r"\b(Like|Think)\b", "🔍 \\1"),
                (r"(\btip\b)", "🎯 \\1")
            ],
            "Exam Preparation": [
                (r"Common Mistake", "⚠️ Common Mistake"),
                (r"Approach", "✅ Recommended Approach"),
                (r"Practice", "📝 Try This Problem")
            ],
            "Quick Summary": [
                (r"^(\w)", "• \\1"),
                (r"\n(\w)", "\n• \\1"),
                (r"Key Points", "📌 Essentials")
            ]
        }

        for pattern, replacement in style_rules.get(self.active_style, []):
            response = re.sub(pattern, replacement, response)

        if self.active_style == "Quick Summary":
            response = self._limit_summary_items(response)
        elif self.active_style == "Detailed Explanation":
            response = self._ensure_detailed_sections(response)
            
        return response

    def _limit_summary_items(self, response):
        items = [item for item in response.split("\n") if item.startswith("•")]
        if len(items) > 5:
            return "\n".join(items[:5]) + "\n..."
        return response

    def _ensure_detailed_sections(self, response):
        required = ["Concept Overview", "Core Components"]
        for section in required:
            if section not in response:
                response = f"## {section}\nContent placeholder\n\n{response}"
        return response

    def _get_relevant_chunks(self, query, max_tokens=3000):
        query_keywords = set(query.lower().split())
        selected_chunks = []
        total_tokens = 0
        
        for chunk in self.document_chunks:
            chunk_tokens = self._count_tokens_approx(chunk)
            if total_tokens + chunk_tokens > max_tokens:
                break
            
            chunk_keywords = set(chunk.lower().split())
            if len(query_keywords & chunk_keywords) > 0:
                selected_chunks.append(chunk)
                total_tokens += chunk_tokens
                
        return selected_chunks[:5]

        
    def process_voice_input(self):
        try:
            with sr.Microphone() as source:
                self.recognizer.adjust_for_ambient_noise(source)
                st.write("🎧 Listening... (15s max)")
                audio = self.recognizer.listen(source, timeout=3, phrase_time_limit=15)
                text = self.recognizer.recognize_google(audio)
                return self.process_text_input(text)
        except Exception as e:
            st.error(f"Voice error: {str(e)}")
            return None
        
    def _build_conversation_prompt(self, user_input, history):
        # Build conversation history context
        history_text = "\n".join(
            [f"User: {msg.content}" if isinstance(msg, HumanMessage) 
             else f"Assistant: {msg.content}" 
             for msg in history]
        )[-2000:]  # Keep last 2000 characters of history

        # Get document context
        doc_context = self._get_document_context(user_input)

        return f"""{self.system_prompt}
        
Conversation History:
{history_text}

Document Context:
{doc_context}

Current Query: {user_input}
"""

    def process_pdf(self, file):
        try:
            pdf_reader = PyPDF2.PdfReader(file)
            full_text = "\n".join([page.extract_text() for page in pdf_reader.pages])
            self.document_chunks = self.text_splitter.split_text(full_text)
            total_chars = sum(len(chunk) for chunk in self.document_chunks)
            return total_chars
        except Exception as e:
            st.error(f"PDF processing error: {str(e)}")
            return 0

    def setup_react_agent(self):
        react_template = f"""{self.system_prompt}

ReAct Framework:
1. Thought: Analyze style requirements from {self.active_style}
2. Action: Select appropriate response components
3. Observation: Check against style guidelines
4. Thought: Structure answer elements
5. Action: Apply formatting rules
Final Answer: """
        self.react_agent = ReActAgent(self.llm, react_template)

def main():
    st.title("🎓 Adaptive Teaching Assistant")
    
    if 'chatbot' not in st.session_state:
        st.session_state.chatbot = None
        st.session_state.pdf_uploaded = False

    st.sidebar.header("Configuration")
    api_key = st.sidebar.text_input("GROQ API Key", type="password")
    
    if not api_key:
        st.warning("Please enter your GROQ API key")
        return

    if st.session_state.chatbot is None:
        st.session_state.chatbot = RAGChatbot(api_key)

    subject = st.sidebar.text_input("Subject", "General Learning")
    learning_style = st.sidebar.selectbox(
        "Teaching Style",
        ["Detailed Explanation", "Simplified Learning", "Exam Preparation", "Quick Summary"],
        index=1
    )
    
    mode = st.sidebar.radio("Interaction Mode", ["Chat", "Voice", "PDF Q&A"], index=0)
    st.session_state.chatbot.current_mode = mode
    st.session_state.chatbot.active_style = learning_style

    has_document = st.session_state.pdf_uploaded
    st.session_state.chatbot.system_prompt = st.session_state.chatbot.get_ai_teacher_system_prompt(
        subject, learning_style, has_document
    )
    
    if mode == "Chat":
        st.session_state.chatbot.setup_react_agent()

    st.sidebar.markdown(f"""
    **Active Configuration**  
    🎨 Style: {learning_style}  
    📚 Subject: {subject}  
    📁 Document: {'📤 Loaded' if has_document else '📥 None'}
    """)

    if mode == "Chat":
        st.header("Interactive Learning Chat")
        
        # Display conversation history from memory
        chat_history = st.session_state.chatbot.memory.load_memory_variables({})["history"]
        for msg in chat_history:
            role = "User" if isinstance(msg, HumanMessage) else "AI"
            with st.chat_message("user" if role == "User" else "assistant"):
                st.markdown(f"**{role}:** {msg.content}")

        if prompt := st.chat_input("Ask your question..."):
            with st.chat_message("user"):
                st.markdown(f"**You:** {prompt}")

            with st.chat_message("assistant"):
                with st.spinner("🧠 Analyzing..."):
                    response = st.session_state.chatbot.process_text_input(prompt)
                st.markdown(response)

        if st.sidebar.button("🧹 Clear History"):
            st.session_state.chatbot.memory.clear()
            st.rerun()

    elif mode == "Voice":
        st.header("Voice Interaction")
        
        if st.button("🎤 Start Recording"):
            user_input = st.session_state.chatbot.process_voice_input()
            if user_input:
                with st.expander("Live Conversation"):
                    st.write(f"**You:** {user_input}")
                    response = st.session_state.chatbot.process_text_input(user_input)
                    st.write(f"**AI:** {response}")

    elif mode == "PDF Q&A":
        st.header("Document Analysis Mode")
        
        uploaded_file = st.file_uploader("Upload PDF", type=["pdf"])
        if uploaded_file:
            total_chars = st.session_state.chatbot.process_pdf(uploaded_file)
            if total_chars > 0:
                st.session_state.pdf_uploaded = True
                st.success(f"📄 Document loaded ({total_chars} characters)")
                
                if prompt := st.chat_input("Ask about the document..."):
                    with st.chat_message("user"):
                        st.markdown(f"**You:** {prompt}")
                    
                    with st.chat_message("assistant"):
                        response = st.session_state.chatbot.process_text_input(prompt)
                        st.markdown(response)

        if st.sidebar.button("❌ Clear Document"):
            st.session_state.chatbot.document_chunks = []
            st.session_state.pdf_uploaded = False
            st.rerun()

if __name__ == "__main__":
    main()