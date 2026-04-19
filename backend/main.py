import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import json
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import tempfile

from database import init_db, save_analysis, get_history
from schemas import TextRequest, UrlRequest, AnalysisResponse
from ml_service import predict_credibility
from agent import generate_report

app = FastAPI(title="News Credibility AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.post("/analyze-text", response_model=AnalysisResponse)
async def analyze_text(req: TextRequest):
    content = req.text
    if not content:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    ml_prediction = predict_credibility(content)
    agent_report = generate_report(content, ml_prediction["label"])
    
    save_analysis(content, "User Input", ml_prediction["label"], ml_prediction["probability"], agent_report)
    
    return {
        "ml_prediction": ml_prediction,
        "agent_report": agent_report
    }

@app.post("/analyze-url", response_model=AnalysisResponse)
async def analyze_url(req: UrlRequest):
    try:
        response = requests.get(req.url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        paragraphs = soup.find_all('p')
        content = " ".join([p.get_text() for p in paragraphs])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching URL: {str(e)}")
        
    if not content:
        raise HTTPException(status_code=400, detail="Could not extract text from URL")
        
    ml_prediction = predict_credibility(content)
    agent_report = generate_report(content, ml_prediction["label"])
    
    save_analysis(content, req.url, ml_prediction["label"], ml_prediction["probability"], agent_report)
    
    return {
        "ml_prediction": ml_prediction,
        "agent_report": agent_report
    }

@app.post("/upload-file", response_model=AnalysisResponse)
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        content = contents.decode('utf-8')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")
        
    ml_prediction = predict_credibility(content)
    agent_report = generate_report(content, ml_prediction["label"])
    
    save_analysis(content, file.filename, ml_prediction["label"], ml_prediction["probability"], agent_report)
    
    return {
        "ml_prediction": ml_prediction,
        "agent_report": agent_report
    }

@app.get("/metrics")
async def get_metrics():
    metrics_path = os.path.join(os.path.dirname(__file__), '..', 'model', 'saved_models', 'metrics.json')
    if os.path.exists(metrics_path):
        with open(metrics_path, 'r') as f:
            return json.load(f)
    return {"message": "Metrics not found"}

@app.get("/history")
async def get_history_route():
    return get_history()

class GenerateReportRequest(BaseModel):
    text: str
    ml_prediction: str

@app.post("/generate-report")
async def re_generate_report(req: GenerateReportRequest):
    agent_report = generate_report(req.text, req.ml_prediction)
    return {"agent_report": agent_report}

@app.get("/download-pdf")
async def download_pdf(article_id: int):
    # Fetch data
    history = get_history()
    item = next((x for x in history if x["article_id"] == article_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Article not found")
        
    # Generate PDF
    fd, pdf_path = tempfile.mkstemp(suffix='.pdf')
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "News Credibility Report")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 80, f"ML Label: {item['ml_label']}")
    c.drawString(50, height - 100, f"Confidence: {item['confidence'] * 100:.2f}%")
    
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 140, "AI Agent Verdict")
    
    c.setFont("Helvetica", 10)
    verdict = item["report"].get("final_verdict", "N/A")
    c.drawString(50, height - 160, verdict[:100] + "..." if len(verdict) > 100 else verdict)
    
    c.drawString(50, height - 200, "Full details available on the online dashboard.")
    c.save()
    os.close(fd)
    
    return FileResponse(pdf_path, media_type="application/pdf", filename=f"report_{article_id}.pdf")
