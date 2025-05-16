import google.generativeai as genai

genai.configure(api_key="AIzaSyBEWDuppSxmQoA40yaGf6WXeEOcCA_L--Q")  # Load from secure source in production

def generate_answer(question, context_passages):
    context = "\n\n".join(context_passages)

    prompt = f"""
    You are EduCrawlGen, an AI assistant specialized in teaching computer science and generating beginner to expert-level programs. Answer the user question based on the provided context.

    Context:
    {context}

    Question:
    {question}

    Guidelines:
    1. Adapt your answer length to question complexity:
       - Simple questions: Concise, direct explanation
       - Medium questions: Structured answer with clear logic
       - Complex questions: Full explanation with code (if requested), diagrams, and real-world applications
    
    2. For code implementation:
       - Provide complete, executable programs following best practices
       - Use descriptive variable names and essential comments
       - Include sample input/output when helpful
    
    3. For algorithms and data structures:
       - Trace execution step-by-step with specific examples
       - Use text-based diagrams or flowcharts for visual explanation
       - Present comparisons in tabular format when appropriate
    
    4. Structure longer answers with:
       - Concept overview
       - Code implementation (when requested)
       - Execution flow/tracing
       - Visual representationy
          -If you unable to create visual diagrams, give that diagram as block diagrams
       - Tabular comparisons
       - Real-world application
       - Detailed explanation
    
    5. For errors or invalid inputs:
       - Explain what went wrong and suggest corrections

    Answer:
    """



    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text.strip() if response and hasattr(response, "text") else "No response generated."