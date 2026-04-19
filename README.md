 # Intelligent News Credibility Analysis and Agentic Misinformation Monitoring System
 
 ![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
 ![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Logistic%20Regression-orange)
 ![NLP](https://img.shields.io/badge/NLP-TF--IDF-green)
 ![UI](https://img.shields.io/badge/UI-Streamlit-red)
 
 ## Project Overview
 This repository contains the source code, models, and documentation for a machine learning-based News Credibility Analysis system. Designed to combat the rapid spread of online misinformation, this project utilizes Natural Language Processing (NLP) and Logistic Regression to classify news articles as either **Real** or **Fake** with 96% accuracy.
 
 This represents **Milestone 1** of a larger initiative to build a fully Agentic Misinformation Monitoring System.
 
 ## Key Features
 - **Automated NLP Pipeline:** Cleans and processes raw news text (lowercasing, special character removal, NLTK stopword filtering).
 - **High-Dimensional Feature Extraction:** Utilizes TF-IDF vectorization (20,000 max features, sublinear scaling) to capture critical semantic patterns.
 - **Optimized Classification:** Deploys a computationally efficient Logistic Regression model with balanced class weights to prevent prediction bias.
 - **Interactive Web Interface:** Includes a real-time Streamlit application allowing users to input news text and receive instant credibility scores.
 
 ## Repository Structure
 This project follows a modular, reproducible structure:
 
 ```text
 News_credibilty_analysis/
 │
 ├── data/               # Contains raw, processed, and external datasets
 ├── notebooks/          # Jupyter Notebooks for EDA, training, and evaluation
 ├── src/                # Modular Python source code (e.g., app.py for UI)
 ├── models/             # Serialized models (model.pkl, vectorizer.pkl)
 ├── results/            # Exported evaluation artifacts (Confusion Matrix, Feature Charts)
 ├── requirements.txt    # Exact Python dependencies
 └── README.md           # Project documentation
 ```
 
 ## Installation & Setup
 To run this project locally, ensure you have Python installed, then follow these steps:
 
 1. **Clone the repository**
 
    ```bash
    git clone https://github.com/Advikkhandelwal/News_credibilty_analysis.git
    cd News_credibilty_analysis
    ```
 
 2. **Install dependencies**
 
    ```bash
    pip install -r requirements.txt
    ```
 
 3. **Run the Streamlit application**
 
    Navigate to the source directory and launch the web app:
 
    ```bash
    streamlit run app.py
    ```
 
 ## Model Performance Metrics
 The model was trained and evaluated using an 80:20 train-test split with stratified sampling.
 
 - **Overall Accuracy:** 96%
 - **Precision (Fake News):** 0.96
 - **Recall (Fake News):** 0.97
 - **F1-Score:** 0.97
 
 ## Future Work (Milestone 2 Roadmap)
 - Transition from a static classifier to an Agentic AI Assistant using open-source LLMs (e.g., Llama 3).
 - Implement Evidence-Based Reporting to generate structured, cited analysis rather than binary scores.
 - Deploy the application to a public cloud hosting platform for scalable accessibility.
 
 ## Team Members (Team X)
 - Advik Khandelwal
 - Sahil Kumar
 - Harsh Ahalawat
 - Meet Kumar
 
