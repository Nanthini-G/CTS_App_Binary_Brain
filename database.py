import os
import sqlite3
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "backend\predictions.db")
USER_PATH = os.path.join(BASE_DIR, r"backend\backendregister.db")
from datetime import datetime

# conn = sqlite3.connect(USER_PATH)
# cursor = conn.cursor()
# cursor.execute("""
#             CREATE TABLE IF NOT EXISTS users (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 Name TEXT,
#                 Email TEXT,
#                 Password TEXT,
#                 Phone TEXT,
#                 Address TEXT,
#                 DOB TEXT,
#                 BloodGroup TEXT,
#                 BMI TEXT,
#                 Age TEXT,
#                 Gender TEXT
#             )
#         """)
# conn.commit()
# conn.close()


# def init_db():
#     with sqlite3.connect(USER_PATH) as conn:
#         c = conn.cursor()
#         c.execute("""
#             CREATE TABLE IF NOT EXISTS health_predictions (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 userid REAL,
#                 timestamp TEXT,
#                 heart_prob REAL,
#                 heart_risk TEXT,
#                 diabetes_prob REAL,
#                 diabetes_risk TEXT
#             )
#         """)
#         conn.commit()

# # # Initialize DB
# init_db()
# with sqlite3.connect(DB_PATH) as conn:
#         c = conn.cursor()
#         c.execute("""
#             INSERT INTO health_predictions (timestamp, heart_prob, heart_risk, diabetes_prob, diabetes_risk)
#             VALUES (?, ?, ?, ?, ?)
#         """, (datetime.now().isoformat(),0.45, 'High', 0.7, 'Low'))
#         conn.commit()

# with sqlite3.connect(USER_PATH) as conn:
#     cursor = conn.cursor()
#     cursor.execute(f"DROP TABLE IF EXISTS health_predictions;")
#     print(f"Dropped table: health_predictions")


# with sqlite3.connect(USER_PATH) as conn:
#     cursor = conn.cursor()
#     cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
#     tables = cursor.fetchall()
#     for table in tables:
#         print(table[0])

# with sqlite3.connect(USER_PATH) as conn:
#     cursor = conn.cursor()
    
#     # Add a new column 'Password' (TEXT type, change type if needed)
#     cursor.execute("ALTER TABLE users ADD COLUMN Password TEXT;")
    
#     print("Column 'Password' added successfully.")


# with sqlite3.connect(USER_PATH) as conn:
#         c = conn.cursor()
#         c.execute("""
#             SELECT * FROM users
#         """)
#         rows = c.fetchall()
#         col_names = [description[0] for description in c.description]
#         print("Columns:", col_names)
#         for row in rows:
#             print(row)

            

with sqlite3.connect(USER_PATH) as conn:
        c = conn.cursor()
        c.execute("""
            SELECT * FROM health_predictions
        """)
        rows = c.fetchall()
        col_names = [description[0] for description in c.description]
        print("Columns:", col_names)
        for row in rows:
            print(row)