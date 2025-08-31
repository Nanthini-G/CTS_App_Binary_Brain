
def classify_risk(prob, disease_type):
    if prob < 0.33:
        return "Low", f"Your {disease_type} risk is low. Maintain a healthy lifestyle."
    elif prob < 0.66:
        return "Moderate", f"Your {disease_type} risk is moderate. Regular check-ups are advised."
    else:
        return "High", f"Your {disease_type} risk is high. Please consult a doctor immediately."

def validate_heart_input(data):
    required = ["ChestPainType","RestingBP","Cholesterol","FastingBS","RestingECG","MaxHR","ExerciseAngina","Oldpeak","ST_Slope"]
    for field in required:
        if field not in data:
            return False, f"Missing heart field: {field}"
    return True, ""

def validate_diabetes_input(data):
    required = ["Pregnancies","Glucose","BloodPressure","SkinThickness","Insulin","BMI","DiabetesPedigreeFunction"]
    for field in required:
        if field not in data:
            return False, f"Missing diabetes field: {field}"
    return True, ""