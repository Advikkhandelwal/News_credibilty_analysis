import joblib
import os
import numpy as np
import re
import json
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

nltk.download('stopwords', quiet=True)
stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'model', 'saved_models')

try:
    best_model = joblib.load(os.path.join(MODEL_DIR, 'best_model.pkl'))
    vectorizer = joblib.load(os.path.join(MODEL_DIR, 'vectorizer.pkl'))
    
    with open(os.path.join(MODEL_DIR, 'metrics.json'), 'r') as f:
        metrics_data = json.load(f)
        best_model_name = metrics_data.get('best_model', 'Logistic Regression')
except Exception as e:
    print(f"Error loading models: {e}")
    best_model = None
    vectorizer = None
    best_model_name = "Unknown"

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    tokens = text.split()
    tokens = [stemmer.stem(token) for token in tokens if token not in stop_words]
    return " ".join(tokens)

def predict_credibility(text: str):
    if not best_model or not vectorizer:
        return {
            "label": "Unknown",
            "probability": 0.0,
            "confidence_percentage": 0.0,
            "important_keywords": [],
            "model_used": "None"
        }
        
    cleaned = clean_text(text)
    features = vectorizer.transform([cleaned])
    
    prediction = best_model.predict(features)[0]
    
    try:
        probabilities = best_model.predict_proba(features)[0]
        confidence = float(np.max(probabilities))
    except:
        confidence = 0.85 # fallback
        
    # Get top keywords
    feature_names = vectorizer.get_feature_names_out()
    tfidf_scores = features.toarray()[0]
    top_indices = tfidf_scores.argsort()[-5:][::-1]
    top_keywords = [feature_names[i] for i in top_indices if tfidf_scores[i] > 0]
    
    return {
        "label": prediction,
        "probability": confidence,
        "confidence_percentage": round(confidence * 100, 2),
        "important_keywords": top_keywords,
        "model_used": best_model_name
    }
