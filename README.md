# AI-Powered News Credibility & Misinformation Detection System

A complete full-stack academic project that detects misinformation using Machine Learning and Agentic AI reasoning.

## 🚀 Features

- **Milestone 1**: ML-based news credibility classifier (Logistic Regression, Decision Tree, Random Forest) using TF-IDF.
- **Milestone 2**: Agentic AI Assistant using Llama 3 70B (via Groq API) for cross-source verification and reasoning.
- **Frontend**: React + Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: FastAPI, Uvicorn, SQLite.
- **Outputs**: Generates detailed JSON credibility reports and allows PDF export.

## 📁 Project Structure

```
news_credibility_ai/
├── backend/
│   ├── agent.py            # Groq Llama 3 integration & LangChain logic
│   ├── database.py         # SQLite setup & queries
│   ├── main.py             # FastAPI entry point
│   ├── ml_service.py       # ML inference
│   └── schemas.py          # Pydantic models
├── frontend/
│   ├── src/                # React application
│   │   ├── pages/          # Home, Analyze, Results, History
│   │   ├── App.jsx         # Routing
│   │   └── index.css       # Tailwind configuration
├── model/
│   ├── dataset.csv         # Sample dataset
│   ├── train.py            # ML training script
│   └── saved_models/       # Serialized models and metrics
└── reports/                # Generated PDFs (optional storage)
```

## 🛠 Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Machine Learning Setup
```bash
cd model
python3 -m venv venv
source venv/bin/activate
pip install pandas numpy scikit-learn spacy
python -m spacy download en_core_web_sm
python train.py
```
This trains the models and saves the best one (Logistic Regression) into `model/saved_models/`.

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt # (or manually install fastapi uvicorn pydantic langchain langchain-groq langchain-core python-dotenv python-multipart beautifulsoup4 requests reportlab)
```
Create a `.env` file inside `backend/` and add your Groq API key:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```
Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The React app will be available at `http://localhost:3000`.

## 📚 Technical Details

### Machine Learning
- **Text Preprocessing**: Lowercasing, punctuation removal, lemmatization (spaCy), stopword removal.
- **Feature Extraction**: TF-IDF Vectorizer.
- **Models**: Evaluates Logistic Regression, Decision Tree, and Random Forest.
- **Explainability**: Extracts top keywords influencing the prediction.

### Agentic AI (Groq Llama 3)
- Receives the article text and ML prediction.
- Analyzes credibility indicators and risk factors.
- Generates a structured JSON report containing a final verdict and cross-source verification.

### UI / UX
- **Premium Design**: Dark mode interface with glassmorphism elements.
- **Animations**: Fluid page transitions using Framer Motion.
- **Data Vis**: Confidence gauge using Recharts.

---
*Developed for academic purposes to combat misinformation.*
