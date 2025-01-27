import streamlit as st
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

def generate_resources(topic, api_key):
    # Initialize Groq LLM
    llm = ChatGroq(
        temperature=0.7, 
        model_name="gemma2-9b-it", 
        groq_api_key=api_key
    )
    
    # Create prompt template
    prompt = ChatPromptTemplate.from_template("""
    Generate a comprehensive list of learning resources for the topic: {topic}
    
    Provide the response as a JSON with the following structure:
    {{
        "books": [
            {{
                "title": "Book Title",
                "author": "Author Name",
                "description": "Brief book description"
            }}
        ],
        "online_courses": [
            {{
                "platform": "Course Platform",
                "course_name": "Course Title",
                "url": "Course URL",
                "description": "Course overview"
            }}
        ],
        "websites": [
            {{
                "name": "Website Name",
                "url": "Website URL",
                "description": "What makes this resource valuable"
            }}
        ],
        "youtube_channels": [
            {{
                "channel_name": "Channel Name",
                "url": "Channel URL",
                "description": "Why this channel is helpful"
            }}
        ]
    }}
    """)
    
    # Create output parser
    output_parser = JsonOutputParser()
    
    # Create chain
    chain = prompt | llm | output_parser
    
    # Generate resources
    try:
        resources = chain.invoke({"topic": topic})
        return resources
    except Exception as e:
        st.error(f"Error generating resources: {str(e)}")
        return None

def main():
    st.title("Learning Resources Generator")
    
    # Groq API Key input
    api_key = st.text_input("Enter your Groq API Key", type="password")
    
    # Topic input
    topic = st.text_input("Enter the topic you want to learn about")
    
    # Generate button
    if st.button("Generate Resources"):
        if not api_key:
            st.warning("Please enter your Groq API Key")
            return
        
        if not topic:
            st.warning("Please enter a topic")
            return
        
        # Generate and display resources
        with st.spinner("Generating resources..."):
            resources = generate_resources(topic, api_key)
        
        if resources:
            # Display Books
            st.subheader("📚 Recommended Books")
            for book in resources.get('books', []):
                st.write(f"**{book['title']}** by {book['author']}")
                st.write(book['description'])
                st.markdown("---")
            
            # Display Online Courses
            st.subheader("💻 Online Courses")
            for course in resources.get('online_courses', []):
                st.write(f"**{course['course_name']}** on {course['platform']}")
                st.write(f"[Course Link]({course['url']})")
                st.write(course['description'])
                st.markdown("---")
            
            # Display Websites
            st.subheader("🌐 Helpful Websites")
            for website in resources.get('websites', []):
                st.write(f"**{website['name']}**")
                st.write(f"[Website Link]({website['url']})")
                st.write(website['description'])
                st.markdown("---")
            
            # Display YouTube Channels
            st.subheader("▶️ YouTube Channels")
            for channel in resources.get('youtube_channels', []):
                st.write(f"**{channel['channel_name']}**")
                st.write(f"[Channel Link]({channel['url']})")
                st.write(channel['description'])
                st.markdown("---")

if __name__ == "__main__":
    main()