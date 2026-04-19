import os
import json
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from schemas import AgentReport
from dotenv import load_dotenv

load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

def generate_report(article_text: str, ml_prediction: str) -> dict:
    load_dotenv()
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key or groq_api_key == "gsk_your_groq_api_key_here":
        # Mock response if no key is provided
        return {
            "article_summary": "Mock summary due to missing GROQ_API_KEY.",
            "credibility_indicators": ["Mock indicator 1", "Mock indicator 2"],
            "risk_factors": ["Mock risk 1"],
            "cross_source_verification": ["Source A says true", "Source B says false"],
            "confidence_level": "Medium",
            "final_verdict": f"The ML model predicted {ml_prediction}. (Mock verdict)",
            "references": ["http://example.com"],
            "ethical_disclaimer": "This is a mock report."
        }
        
    try:
        llm = ChatGroq(
            api_key=groq_api_key,
            model_name="llama-3.3-70b-versatile", 
            temperature=0.1
        )
        
        prompt = PromptTemplate(
            input_variables=["article", "ml_prediction"],
            template="""You are an expert fact-checker and AI credibility analyst. 
Analyze the following news article. The ML system has predicted it as: {ml_prediction}.
Do not invent facts. If evidence is missing, state uncertainty. Use the ML prediction as a supporting signal. Be neutral and factual.

Return ONLY a valid JSON object matching this structure exactly (no markdown formatting outside the JSON, no extra text):
{{
  "article_summary": "Brief summary of the article",
  "credibility_indicators": ["List of signs that it is credible"],
  "risk_factors": ["List of signs that it is suspicious/fake"],
  "cross_source_verification": ["Known facts or counter-claims about this topic"],
  "confidence_level": "High/Medium/Low",
  "final_verdict": "Your overall conclusion",
  "references": ["Potential or real sources to check"],
  "ethical_disclaimer": "Standard disclaimer about AI limits"
}}

Article text:
{article}
"""
        )
        
        chain = prompt | llm
        response = chain.invoke({"article": article_text, "ml_prediction": ml_prediction})
        
        # Clean response string to parse JSON
        content = response.content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
            
        report_data = json.loads(content)
        return report_data
    except Exception as e:
        print(f"Error generating report: {e}")
        return {
            "article_summary": "Error generating report.",
            "credibility_indicators": [],
            "risk_factors": [],
            "cross_source_verification": [],
            "confidence_level": "Unknown",
            "final_verdict": str(e),
            "references": [],
            "ethical_disclaimer": "An error occurred during AI processing."
        }
