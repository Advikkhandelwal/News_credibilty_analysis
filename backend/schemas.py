from pydantic import BaseModel
from typing import List, Optional

class TextRequest(BaseModel):
    text: str

class UrlRequest(BaseModel):
    url: str

class MLPrediction(BaseModel):
    label: str
    probability: float
    confidence_percentage: float
    important_keywords: List[str]
    model_used: str

class AgentReport(BaseModel):
    article_summary: str
    credibility_indicators: List[str]
    risk_factors: List[str]
    cross_source_verification: List[str]
    confidence_level: str
    final_verdict: str
    references: List[str]
    ethical_disclaimer: str

class AnalysisResponse(BaseModel):
    ml_prediction: MLPrediction
    agent_report: AgentReport
