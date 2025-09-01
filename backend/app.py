from utils import *
from database import UserHealthDb
from database import UserDataBase
from care_recommend.youtube import youtube_recommend
from care_recommend.personalized import generate_personalized_plan
from care_recommend.recommend import generate_care_recommendation
from flask import Flask, request, jsonify
import pandas as pd
import joblib
import os
import numpy as np
import sqlite3
from datetime import datetime
from flask_cors import CORS
import bcrypt
from care_recommend.care_utils import heart_features_string_converter

app = Flask(__name__) 
CORS(app)



BASE_DIR = os.path.dirname(os.path.abspath(__file__))

HEART_MODEL_PATH = os.path.join(BASE_DIR,"xgb_heart_model.joblib")
DIABETES_MODEL_PATH = os.path.join(BASE_DIR,"rf_diabetes_model.joblib")  

userDatabase = UserDataBase()
predictionDatabase = UserHealthDb()

heart_model = joblib.load(HEART_MODEL_PATH)
diabetes_model = joblib.load(DIABETES_MODEL_PATH)
print("Heart model loaded from:", HEART_MODEL_PATH)
print("Diabetes model loaded from:", DIABETES_MODEL_PATH)

current_user_id = 0

def setCurrentUserID(email):
    global current_user_id
    current_user_id = userDatabase.getCurrentUser(email)



@app.route('/predict/heart', methods=['POST'])
def predict_heart():
    try:
        data = request.get_json()
        valid, msg = validate_heart_input(data)
        if not valid:
            return jsonify({"error": msg}), 400
        # print(current_user_id)
        age = userDatabase.getUserData(what = 'Age',userid = current_user_id)
        sex = userDatabase.getUserData(what = 'Gender',userid = current_user_id)
        if sex == "Male":
            sex = 1
        else:
            sex=0
        cp = float(data.get("ChestPainType"))
        trestbps = float(data.get("RestingBP"))
        chol = float(data.get("Cholesterol"))
        fbs = int(data.get("FastingBS"))
        restecg = int(data.get("RestingECG"))
        thalach = float(data.get("MaxHR"))
        exang = int(data.get("ExerciseAngina"))
        oldpeak = float(data.get("Oldpeak"))
        slope = int(data.get("ST_Slope"))
        features = np.array([[age, sex, cp, trestbps, chol, fbs, restecg,
                      thalach, exang, oldpeak, slope]])
        print(features)
        heart_prob = heart_model.predict_proba(features)[0][1]  
        heart_risk, heart_reco = classify_risk(heart_prob, "heart")
        print(heart_risk)
        predictionDatabase.save_prediction(current_user_id,heart_prob, heart_risk, None, None)

        return jsonify({
            "probability": float(heart_prob),
            "risk_score": heart_risk,
            "recommendation": heart_reco
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    try:
        data = request.get_json()

        valid, msg = validate_diabetes_input(data)
        if not valid:
            return jsonify({"error": msg}), 400
        diabetes_df = pd.DataFrame([{
            "Pregnancies": data["Pregnancies"],
            "Glucose": data["Glucose"],
            "BloodPressure": data["BloodPressure"],
            "SkinThickness": data["SkinThickness"],
            "Insulin": data["Insulin"],
            "BMI": data["BMI"],
            "DiabetesPedigreeFunction": data["DiabetesPedigreeFunction"],
            "Age": userDatabase.getUserData(what = 'Age',userid = current_user_id)
        }])

        diabetes_prob = diabetes_model.predict_proba(diabetes_df)[0][1]
        diabetes_risk, diabetes_reco = classify_risk(diabetes_prob, "diabetes")

        predictionDatabase.save_prediction(current_user_id,None, None, diabetes_prob, diabetes_risk)

        return jsonify({
            "probability": float(diabetes_prob),
            "risk_score": diabetes_risk,
            "recommendation": diabetes_reco
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route("/", methods=['GET'])
def root():
    return jsonify({
        "message": "Chronic Disease Management Backend 🚀",
        "available_endpoints": {
            "predict_heart": "/predict/heart",
            "predict_diabetes": "/predict/diabetes",
            "predict_both": "/predict/both",
            "dashboard": "/dashboard"
        }
    })



@app.route('/user/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("Email")
    password = data.get("Password")
    user = userDatabase.loginIntoUsers(email=email,password=password)

    if not user:
        return jsonify({"message": "User not found"}), 404
    
    stored_password = user[3]


    if password != stored_password:
        return jsonify({"message": "Invalid password"}), 401
    
    setCurrentUserID(email)

    return jsonify({"message": "User registered successfully"}), 200
    

    



# ------------------ Register API ------------------
@app.route('/user/register', methods=['POST'])
def register():
    data = request.json
    print(data)
    output_message,code = userDatabase.registerIntoUsers(data)
    setCurrentUserID(data['Email'])
    return jsonify({"message": output_message}), code


# ------------------ Get Users API ------------------
@app.route('/user', methods=['GET'])
def get_users():
    conn = sqlite3.connect("user.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    conn.close()

    users = []
    for row in rows:
        users.append({
            "id": row[0],
            "Name": row[1],
            "Email": row[2],
            "Phone": row[3],
            "Address": row[4],
            "DOB": row[5],
            "BloodGroup": row[6],
            "BMI": row[7],
            "Age": row[8],
            "Gender": row[9]
        })

    return jsonify(users)
@app.route("/youtube", methods=["GET"])
def get_youtube_recommend():
    # Get risks from query params (for demo purpose, you may later calculate them dynamically)
    heart_risk = float(request.args.get("heart", 0.5))
    diabetes_risk = float(request.args.get("diabetes", 0.5))

    videos = youtube_recommend(heart_risk, diabetes_risk)
    return jsonify({"videos": videos})


@app.route("/personalized", methods=["GET"])
def get_personalized_plan():
    try:
        # Example dummy patient data
        heart_status = "High risk"
        heart_prob = 0.7
        diabetes_status = "Moderate risk"
        diabetes_prob = 0.45

        # Convert heart features into string
        heart_features = heart_features_string_converter(
            age=60, sex="male", cp=4, trestbps=112, chol=261,
            fbs=0, restecg=0, thalach=140, exang=0, oldpeak=1.5, slope=1
        )
        diabetes_features = "Pregnancies: 0, Glucose: 98, BloodPressure: 100, BMI: 34, Age: 60"

        # ✅ Call your reusable function
        plan = generate_personalized_plan(
            heart_status, heart_prob, heart_features,
            diabetes_status, diabetes_prob, diabetes_features
        )

        return jsonify({"plan": plan})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@app.route("/recommendation", methods=["GET"])
def get_recommendation_route():

    result = generate_care_recommendation()
    return jsonify({"recommendation": result})



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
