import sqlite3
import json

DB_NAME = "credibility.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            source_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analysis_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            article_id INTEGER NOT NULL,
            ml_label TEXT NOT NULL,
            confidence REAL NOT NULL,
            json_report TEXT NOT NULL,
            generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(article_id) REFERENCES articles(id)
        )
    ''')
    conn.commit()
    conn.close()

def save_analysis(content: str, source_url: str, ml_label: str, confidence: float, report: dict):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute('INSERT INTO articles (content, source_url) VALUES (?, ?)', (content, source_url))
    article_id = cursor.lastrowid
    
    cursor.execute('''
        INSERT INTO analysis_results (article_id, ml_label, confidence, json_report)
        VALUES (?, ?, ?, ?)
    ''', (article_id, ml_label, confidence, json.dumps(report)))
    
    conn.commit()
    conn.close()
    return article_id

def get_history():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT a.id, a.content, a.source_url, a.created_at,
               r.ml_label, r.confidence, r.json_report
        FROM articles a
        JOIN analysis_results r ON a.id = r.article_id
        ORDER BY a.created_at DESC
    ''')
    rows = cursor.fetchall()
    conn.close()
    
    history = []
    for row in rows:
        history.append({
            "article_id": row[0],
            "content": row[1][:200] + "..." if len(row[1]) > 200 else row[1],
            "source_url": row[2],
            "created_at": row[3],
            "ml_label": row[4],
            "confidence": row[5],
            "report": json.loads(row[6])
        })
    return history

init_db()
