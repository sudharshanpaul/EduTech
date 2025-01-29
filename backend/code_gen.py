# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List
# from langchain_groq import ChatGroq
# from langchain.memory import ConversationBufferMemory
# from langchain.chains import ConversationChain
# from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
# from datetime import datetime
# import os

# # Your Groq API key
# GROQ_API_KEY = "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"  

# # Initialize FastAPI app
# app = FastAPI(title="Groq Code Generation API")

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Pydantic models
# class Message(BaseModel):
#     role: str
#     content: str
#     timestamp: datetime = datetime.now()

# class ChatRequest(BaseModel):
#     prompt: str

# class ChatResponse(BaseModel):
#     response: str
#     messages: List[Message]

# class GroqCodeChatbot:
#     def __init__(self):
#         self.llm = ChatGroq(
#             groq_api_key=GROQ_API_KEY,
#             model="gemma2-9b-it"
#         )
        
#         self.prompt = ChatPromptTemplate.from_messages([
#             ("system", "You are a helpful code generation assistant."),
#             MessagesPlaceholder(variable_name="history"),
#             ("human", "{input}")
#         ])
        
#         self.memory = ConversationBufferMemory(return_messages=True)
        
#         self.conversation = ConversationChain(
#             llm=self.llm,
#             prompt=self.prompt,
#             memory=self.memory,
#             verbose=False
#         )

#     def generate_response(self, prompt: str) -> str:
#         try:
#             response = self.conversation.predict(input=prompt)
#             return response
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=str(e))

#     def get_messages(self) -> List[Message]:
#         messages = []
#         for msg in self.memory.chat_memory.messages:
#             messages.append(
#                 Message(
#                     role="human" if msg.type == "human" else "ai",
#                     content=msg.content
#                 )
#             )
#         return messages

# # Initialize a single chatbot instance
# chatbot = GroqCodeChatbot()

# @app.post("/chat", response_model=ChatResponse)
# async def chat(request: ChatRequest):
#     try:
#         response = chatbot.generate_response(request.prompt)
#         messages = chatbot.get_messages()
#         return ChatResponse(response=response, messages=messages)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/messages", response_model=List[Message])
# async def get_chat_history():
#     return chatbot.get_messages()

# @app.delete("/messages")
# async def clear_chat_history():
#     global chatbot
#     chatbot = GroqCodeChatbot()
#     return {"message": "Chat history cleared successfully"}

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from datetime import datetime
import re
import os

# Your Groq API key
GROQ_API_KEY = "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"  # Replace with your actual API key

# Initialize FastAPI app
app = FastAPI(title="Groq Code Generation API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Message(BaseModel):
    role: str
    content: str
    timestamp: datetime = datetime.now()

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    code_blocks: List[str]
    explanation: str
    messages: List[Message]

def separate_code_and_text(input_text: str):
    # Find all code blocks
    code_blocks = re.findall(r"```(?:\w+)?\n(.*?)```", input_text, re.DOTALL)
    
    # Remove code blocks from the text to get explanation
    explanation = input_text
    for block in code_blocks:
        explanation = explanation.replace(f"```{block}```", "")
    
    # Clean up explanation text
    explanation = re.sub(r'\n{3,}', '\n\n', explanation.strip())
    
    return code_blocks, explanation

class GroqCodeChatbot:
    def __init__(self):
        self.llm = ChatGroq(
            groq_api_key=GROQ_API_KEY,
            model="gemma2-9b-it"
        )
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a helpful code generation assistant. 
            When providing code examples, always wrap them in triple backticks (```).
            Separate your explanations from the code clearly."""),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ])
        
        self.memory = ConversationBufferMemory(return_messages=True)
        
        self.conversation = ConversationChain(
            llm=self.llm,
            prompt=self.prompt,
            memory=self.memory,
            verbose=False
        )

    def generate_response(self, prompt: str) -> tuple[List[str], str]:
        try:
            response = self.conversation.predict(input=prompt)
            code_blocks, explanation = separate_code_and_text(response)
            return code_blocks, explanation
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_messages(self) -> List[Message]:
        messages = []
        for msg in self.memory.chat_memory.messages:
            messages.append(
                Message(
                    role="human" if msg.type == "human" else "ai",
                    content=msg.content
                )
            )
        return messages

# Initialize a single chatbot instance
chatbot = GroqCodeChatbot()

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        code_blocks, explanation = chatbot.generate_response(request.prompt)
        messages = chatbot.get_messages()
        return ChatResponse(
            code_blocks=code_blocks,
            explanation=explanation,
            messages=messages
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/messages", response_model=List[Message])
async def get_chat_history():
    return chatbot.get_messages()

@app.delete("/messages")
async def clear_chat_history():
    global chatbot
    chatbot = GroqCodeChatbot()
    return {"message": "Chat history cleared successfully"}