import pandas as pd
import numpy as np
import re
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import json
import os
import kagglehub
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Download stopwords
nltk.download('stopwords', quiet=True)
stop_words = set(stopwords.words('english'))
stemmer = PorterStemmer()

def clean_text(text):
    if not isinstance(text, str):
        return ""
    # Text cleaning: Lowercase, remove special chars
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    # Simple tokenization and stemming
    tokens = text.split()
    tokens = [stemmer.stem(token) for token in tokens if token not in stop_words]
    return " ".join(tokens)

def train_and_evaluate():
    print("Downloading WELFake dataset via kagglehub...")
    path = kagglehub.dataset_download('saurabhshahane/fake-news-classification')
    csv_file = os.path.join(path, 'WELFake_Dataset.csv')
    
    print(f"Loading dataset from {csv_file}...")
    df = pd.read_csv(csv_file)
    
    # Use a random sample to make training faster locally (e.g., 20,000 samples)
    # If the machine is powerful, we can use the full dataset. Let's use 20k to be safe.
    df = df.sample(n=20000, random_state=42).reset_index(drop=True)
    
    # Drop rows with empty text
    df = df.dropna(subset=['text'])
    
    # Map labels: in WELFake, 1 = Fake, 0 = Real
    def map_label(val):
        if val == 1:
            return "Fake / High Risk"
        elif val == 0:
            return "Credible"
        return "Suspicious"
        
    df['label_str'] = df['label'].apply(map_label)
    
    print("Cleaning text (this may take a moment)...")
    df['cleaned_text'] = df['text'].apply(clean_text)
    
    # Drop any that became empty after cleaning
    df = df[df['cleaned_text'].str.len() > 0]
    
    # TF-IDF
    print("Extracting TF-IDF features...")
    vectorizer = TfidfVectorizer(max_features=5000)
    X = vectorizer.fit_transform(df['cleaned_text'])
    y = df['label_str']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Models
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(),
        "Random Forest": RandomForestClassifier(n_estimators=100, n_jobs=-1)
    }
    
    best_model_name = ""
    best_model = None
    best_f1 = -1
    metrics = {}
    
    print("Training models...")
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
        rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
        cm = confusion_matrix(y_test, y_pred).tolist()
        
        metrics[name] = {
            "Accuracy": acc,
            "Precision": prec,
            "Recall": rec,
            "F1 Score": f1,
            "Confusion Matrix": cm
        }
        
        print(f"Model: {name} - F1: {f1:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = model
            
    print(f"\nBest Model: {best_model_name}")
    
    # Save the best model and vectorizer
    os.makedirs("saved_models", exist_ok=True)
    joblib.dump(best_model, "saved_models/best_model.pkl")
    joblib.dump(vectorizer, "saved_models/vectorizer.pkl")
    
    # Save metrics
    with open("saved_models/metrics.json", "w") as f:
        json.dump({
            "best_model": best_model_name,
            "all_metrics": metrics
        }, f, indent=4)
        
    print("Training complete. Models and metrics saved.")

if __name__ == "__main__":
    train_and_evaluate()
