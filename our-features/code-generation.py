import os
import streamlit as st
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder

class GroqCodeChatbot:
    def __init__(self, api_key):
        # Initialize Groq LLM
        self.llm = ChatGroq(
            groq_api_key=api_key,
            model="gemma2-9b-it"
        )
        
        # Create prompt template
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful code generation assistant."),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ])
        
        # Initialize conversation memory
        self.memory = ConversationBufferMemory(return_messages=True)
        
        # Create conversation chain
        self.conversation = ConversationChain(
            llm=self.llm,
            prompt=self.prompt,
            memory=self.memory,
            verbose=False
        )

    def generate_response(self, prompt):
        try:
            response = self.conversation.predict(input=prompt)
            return response
        except Exception as e:
            return f"Error generating response: {str(e)}"

def main():
    st.title("🤖 Groq Code Generation Chatbot")

    # API Key input
    api_key = st.sidebar.text_input("Enter Groq API Key", type="password")

    if api_key:
        # Initialize chatbot
        if 'chatbot' not in st.session_state:
            st.session_state.chatbot = GroqCodeChatbot(api_key)

        # Chat history display
        for message in st.session_state.chatbot.memory.chat_memory.messages:
            role = "human" if message.type == "human" else "ai"
            with st.chat_message(role):
                st.markdown(message.content)

        # User input
        if prompt := st.chat_input("Enter your code generation prompt"):
            # Display user message
            st.chat_message("human").markdown(prompt)

            # Generate response
            with st.spinner("Generating response..."):
                response = st.session_state.chatbot.generate_response(prompt)

            # Display AI response
            st.chat_message("ai").markdown(response)
    else:
        st.warning("Please enter your Groq API Key in the sidebar")

if __name__ == "__main__":
    main()