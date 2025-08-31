


def heart_features_string_converter(age, sex, cp, trestbps, chol, fbs, restecg,
                      thalach, exang, oldpeak, slope):
    sex_str = "Male" if sex==1 else "Female"
    heart_features_str = (
    " Age : " + str(age) +
    " , Sex : " + sex_str +
    " , chest Pain : " + str(cp) +
    " , RestBP : " + str(trestbps) +
    " , Cholestrol : " + str(chol) +
    " , FastingBS : " + str(fbs) +
    " , RestECG : " + str(restecg) +
    " , MaxHR : " + str(thalach) +
    " , ExerciseAngina : " + str(exang) +
    " , old peak : " + str(oldpeak) +
    " , ST Slope : " + str(slope)
    )
    return heart_features_str