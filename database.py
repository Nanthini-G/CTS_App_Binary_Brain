import os
import sqlite3
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "predictions.db")
from datetime import datetime

# def init_db():
#     os.makedirs(BASE_DIR, exist_ok=True)
#     with sqlite3.connect(DB_PATH) as conn:
#         c = conn.cursor()
#         c.execute("""
#             CREATE TABLE IF NOT EXISTS health_predictions (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 timestamp TEXT,
#                 heart_prob REAL,
#                 heart_risk TEXT,
#                 diabetes_prob REAL,
#                 diabetes_risk TEXT
#             )
#         """)
#         conn.commit()

# # Initialize DB
# init_db()
# with sqlite3.connect(DB_PATH) as conn:
#         c = conn.cursor()
#         c.execute("""
#             INSERT INTO health_predictions (timestamp, heart_prob, heart_risk, diabetes_prob, diabetes_risk)
#             VALUES (?, ?, ?, ?, ?)
#         """, (datetime.now().isoformat(),0.45, 'High', 0.7, 'Low'))
#         conn.commit()

with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        c.execute("""
            SELECT * FROM health_predictions
        """)
        rows = c.fetchall()
        col_names = [description[0] for description in c.description]
        print("Columns:", col_names)
        for row in rows:
            print(row)