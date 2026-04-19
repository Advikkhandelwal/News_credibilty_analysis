#!/usr/bin/env bash
python -c "import nltk; nltk.download('stopwords', quiet=True)"
uvicorn main:app --host 0.0.0.0 --port $PORT
