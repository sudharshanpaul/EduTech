# main.py
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import io
import re

# Import required libraries
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage, AIMessage
import speech_recognition as sr
import PyPDF2

# Configure your API key here
api_key= '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' 
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
    def __init__(self):
        self.llm = ChatGroq(
            model_name="mixtral-8x7b-32768",
            temperature=0.3,
            max_tokens=1024,
            groq_api_key=api_key,
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

    def process_pdf(self, file):
        try:
            pdf_reader = PyPDF2.PdfReader(file)
            full_text = "\n".join([page.extract_text() for page in pdf_reader.pages])
            self.document_chunks = self.text_splitter.split_text(full_text)
            total_chars = sum(len(chunk) for chunk in self.document_chunks)
            return total_chars
        except Exception as e:
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

# Create FastAPI app
app = FastAPI(title="Teaching Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ConfigurationRequest(BaseModel):
    subject: str = "General Learning"
    learning_style: str = "Simplified Learning"
    mode: str = "Chat"

class ChatRequest(BaseModel):
    message: str
    subject: Optional[str] = "General Learning"
    learning_style: Optional[str] = "Simplified Learning"

class ChatResponse(BaseModel):
    response: str
    history: List[dict]

# Global chatbot instance
chatbot_instance = None

@app.on_event("startup")
async def startup_event():
    """Initialize chatbot on application startup"""
    global chatbot_instance
    try:
        chatbot_instance = RAGChatbot()
        chatbot_instance.current_mode = "Chat"
        chatbot_instance.active_style = "Simplified Learning"
        chatbot_instance.system_prompt = chatbot_instance.get_ai_teacher_system_prompt(
            "General Learning",
            "Simplified Learning",
            False
        )
        chatbot_instance.setup_react_agent()
    except Exception as e:
        print(f"Error initializing chatbot: {str(e)}")

@app.post("/configure")
async def configure_chatbot(config: ConfigurationRequest):
    """Update chatbot configuration"""
    try:
        if not chatbot_instance:
            raise HTTPException(status_code=500, detail="Chatbot not initialized")
            
        chatbot_instance.current_mode = config.mode
        chatbot_instance.active_style = config.learning_style
        chatbot_instance.system_prompt = chatbot_instance.get_ai_teacher_system_prompt(
            config.subject,
            config.learning_style,
            bool(chatbot_instance.document_chunks)
        )
        
        if config.mode == "Chat":
            chatbot_instance.setup_react_agent()
        
        return {"status": "success", "message": "Configuration updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_request: ChatRequest):
    """Handle chat messages"""
    try:
        if not chatbot_instance:
            raise HTTPException(status_code=500, detail="Chatbot not initialized")
            
        response = chatbot_instance.process_text_input(chat_request.message)
        
        history = chatbot_instance.memory.load_memory_variables({})["history"]
        history_list = [
            {
                "role": "user" if isinstance(msg, HumanMessage) else "assistant",
                "content": msg.content
            }
            for msg in history
        ]
        
        return ChatResponse(response=response, history=history_list)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Handle PDF upload"""
    try:
        if not chatbot_instance:
            raise HTTPException(status_code=500, detail="Chatbot not initialized")
            
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
            
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        
        total_chars = chatbot_instance.process_pdf(pdf_file)
        
        return {
            "status": "success",
            "message": f"PDF processed successfully",
            "total_characters": total_chars
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/clear-history")
async def clear_history():
    """Clear conversation history"""
    try:
        if not chatbot_instance:
            raise HTTPException(status_code=500, detail="Chatbot not initialized")
            
        chatbot_instance.memory.clear
    except Exception as e:
        raise e