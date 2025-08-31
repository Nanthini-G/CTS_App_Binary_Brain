from datetime import datetime
import sqlite3
import os
import bcrypt

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REGISTER_DB = "register.db"
class UserDataBase:
    def __init__(self):
        conn = sqlite3.connect(REGISTER_DB)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name TEXT,
                Email TEXT,
                Phone TEXT,
                Address TEXT,
                DOB TEXT,
                BloodGroup TEXT,
                BMI TEXT,
                Age TEXT,
                Gender TEXT
            )
        """)
        conn.commit()
        conn.close()
    
    def loginIntoUsers(self,email,password):
        with sqlite3.connect(REGISTER_DB) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE Email=?", (email,))
            user = cursor.fetchone()
        return user
    
    def registerIntoUsers(self,data):
        conn = sqlite3.connect(REGISTER_DB)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE Email=?", (data['Email'],))
        if cursor.fetchone():
            return ("Email already registered",400)
        
        cursor.execute("""
            INSERT INTO users (Name, Email, Password, Phone, Address, DOB, BloodGroup, BMI, Age, Gender)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data['Name'], data['Email'], data['Password'], data['Phone'],
            data['Address'], data['DOB'], data['BloodGroup'], data['BMI'],
            data['Age'], data['Gender']
        ))
        conn.commit()
        conn.close()
        return ("User registered successfully",200)
    
    def getCurrentUser(self,email):
        with sqlite3.connect(REGISTER_DB) as conn:
            c = conn.cursor()
            c.execute("SELECT id FROM users WHERE Email = ?", (email,))
            result = c.fetchone()
            if result:
                return result[0]
            else:
                return 0
    def getUserData(self,what,userid):
        with sqlite3.connect(REGISTER_DB) as conn:
            c = conn.cursor()
            c.execute(f"SELECT {what} FROM users WHERE id = ?", (userid,))
            result = c.fetchone()
            if result:
                return result[0]
            else:
                return 0
            


class UserHealthDb:
    def __init__(self):
            conn = sqlite3.connect(REGISTER_DB)
            cursor = conn.cursor()
            cursor.execute("""
                    CREATE TABLE IF NOT EXISTS health_predictions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        userid REAL,
                        timestamp TEXT,
                        heart_prob REAL,
                        heart_risk TEXT,
                        diabetes_prob REAL,
                        diabetes_risk TEXT
                    )
                """)
            conn.commit()
            conn.close()
    
    def save_prediction(self,userID,heart_prob, heart_risk, diabetes_prob, diabetes_risk):
        try:
            heart_prob = float(heart_prob) if heart_prob is not None else None
        except (ValueError, TypeError):
            heart_prob = None

        try:
            diabetes_prob = float(diabetes_prob) if diabetes_prob is not None else None
        except (ValueError, TypeError):
            diabetes_prob = None

        with sqlite3.connect(REGISTER_DB) as conn:
            c = conn.cursor()
            c.execute("""
                INSERT INTO health_predictions (userid,timestamp, heart_prob, heart_risk, diabetes_prob, diabetes_risk)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (userID,datetime.now().isoformat(), heart_prob, heart_risk, diabetes_prob, diabetes_risk))
            conn.commit()

            
