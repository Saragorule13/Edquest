"""
LangChain conversational agent for oral viva examinations.
"""
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.prompts import PromptTemplate


VIVA_SYSTEM_TEMPLATE = """You are an oral examiner conducting a viva voce examination on the topic: {topic}.

{custom_instructions}

Guidelines:
- Ask one question at a time
- Start with a foundational question and gradually increase difficulty
- Follow up on the student's answers to probe deeper understanding
- If the student gives a wrong answer, guide them gently without giving the answer directly
- Be conversational but maintain academic rigor
- Keep your responses concise (2-3 sentences max) since they will be spoken aloud
- After 8-10 exchanges, wrap up the viva with a brief summary of the student's performance

Current conversation:
{{history}}

Student: {{input}}
Examiner:"""


def create_viva_agent(topic: str, custom_instructions: str = ""):
    """Create a LangChain conversation chain for a viva session."""
    
    prompt_text = VIVA_SYSTEM_TEMPLATE.format(
        topic=topic,
        custom_instructions=custom_instructions or "No additional instructions."
    )
    
    prompt = PromptTemplate(
        input_variables=["history", "input"],
        template=prompt_text
    )
    
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.7,
        max_tokens=200,
    )
    
    memory = ConversationBufferMemory(
        human_prefix="Student",
        ai_prefix="Examiner"
    )
    
    chain = ConversationChain(
        llm=llm,
        memory=memory,
        prompt=prompt,
        verbose=False
    )
    
    return chain


def get_opening_question(chain: ConversationChain) -> str:
    """Generate the opening question for the viva."""
    response = chain.predict(
        input="Hello, I'm ready for my viva examination."
    )
    return response
