import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { predictDiabetes } from "../../src/services/predict";
import { Stack } from "expo-router";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DiabetesScreen() {
  const [form, setForm] = useState({
    Pregnancies: "",
    Age: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
  });

  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Validation function
  const validateForm = (form: any) => {
    if (
      isNaN(Number(form.Pregnancies)) ||
      Number(form.Pregnancies) < 0 ||
      Number(form.Pregnancies) > 20
    )
      return "Pregnancies must be between 0 and 20";

    if (
      isNaN(Number(form.Glucose)) ||
      Number(form.Glucose) < 50 ||
      Number(form.Glucose) > 300
    )
      return "Glucose must be between 50 and 300 mg/dL";

    if (
      isNaN(Number(form.BloodPressure)) ||
      Number(form.BloodPressure) < 40 ||
      Number(form.BloodPressure) > 200
    )
      return "Blood Pressure must be between 40 and 200 mmHg";

    if (
      isNaN(Number(form.SkinThickness)) ||
      Number(form.SkinThickness) < 10 ||
      Number(form.SkinThickness) > 100
    )
      return "Skin Thickness must be between 10 and 100 mm";

    if (
      isNaN(Number(form.Insulin)) ||
      Number(form.Insulin) < 15 ||
      Number(form.Insulin) > 900
    )
      return "Insulin must be between 15 and 900 mu U/ml";

    if (
      isNaN(Number(form.BMI)) ||
      Number(form.BMI) < 10 ||
      Number(form.BMI) > 70
    )
      return "BMI must be between 10 and 70";

    if (
      isNaN(Number(form.DiabetesPedigreeFunction)) ||
      Number(form.DiabetesPedigreeFunction) < 0 ||
      Number(form.DiabetesPedigreeFunction) > 3
    )
      return "Diabetes Pedigree Function must be between 0.0 and 3.0";

    if (
      isNaN(Number(form.Age)) ||
      Number(form.Age) < 1 ||
      Number(form.Age) > 120
    )
      return "Age must be between 1 and 120";

    return null; // ✅ all good
  };

  const handlePredict = async () => {
    try {
      setLoading(true);
      setResultMessage("");

      // 🔹 Run validation before API call
      const error = validateForm(form);
      if (error) {
        LayoutAnimation.easeInEaseOut();
        setResultMessage(`❌ ${error}`);
        setLoading(false);
        return;
      }

      // 🔹 Prepare payload
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, Number(v)])
      );

      const result = await predictDiabetes(payload);

      const message = `⚖️ Risk Score: ${result.risk_score}`;
      LayoutAnimation.easeInEaseOut();
      setResultMessage(message);
    } catch (err) {
      console.error(err);
      LayoutAnimation.easeInEaseOut();
      setResultMessage("❌ Error: Something went wrong while predicting.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Input component with icon
  const renderInput = (field: string, placeholder: string, icon: any) => (
    <View style={styles.inputGroup} key={field}>
      <Text style={styles.label}>{placeholder}</Text>
      <View style={styles.inputWrapper}>
        {icon}
        <TextInput
          value={form[field as keyof typeof form]}
          onChangeText={(text) => handleChange(field, text)}
          placeholder={`Enter ${placeholder}`}
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          style={styles.input}
        />
      </View>
    </View>
  );

  return (
    <LinearGradient colors={["#E0F7FA", "#ffffff"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 50, paddingTop: 50 }}
          keyboardShouldPersistTaps="handled"
        >
          <Stack.Screen options={{ title: "Diabetes Prediction" }} />
          <Text style={styles.title}> Diabetes Prediction</Text>

          {/* Section 1 - Patient Info */}
          <Text style={styles.sectionTitle}> Patient Info</Text>
          {renderInput(
            "Pregnancies",
            "Pregnancies",
            <Ionicons name="female" size={20} color="#3B82F6" />
          )}
          {renderInput(
            "Age",
            "Age",
            <Ionicons name="person" size={20} color="#3B82F6" />
          )}

          {/* Section 2 - Clinical Measurements */}
          <Text style={styles.sectionTitle}>🩺 Clinical Measurements</Text>
          {renderInput(
            "Glucose",
            "Glucose Level",
            <MaterialCommunityIcons
              name="water-percent"
              size={20}
              color="#3B82F6"
            />
          )}
          {renderInput(
            "BloodPressure",
            "Blood Pressure",
            <MaterialCommunityIcons
              name="heart-pulse"
              size={20}
              color="#3B82F6"
            />
          )}
          {renderInput(
            "SkinThickness",
            "Skin Thickness",
            <MaterialCommunityIcons
              name="texture-box"
              size={20}
              color="#3B82F6"
            />
          )}
          {renderInput(
            "Insulin",
            "Insulin",
            <MaterialCommunityIcons name="needle" size={20} color="#3B82F6" />
          )}
          {renderInput(
            "BMI",
            "BMI",
            <MaterialCommunityIcons
              name="human-male-height"
              size={20}
              color="#3B82F6"
            />
          )}

          {/* Section 3 - Risk Factor */}
          <Text style={styles.sectionTitle}>📊 Risk Factor</Text>
          {renderInput(
            "DiabetesPedigreeFunction",
            "Diabetes Pedigree Function",
            <Ionicons name="analytics" size={20} color="#3B82F6" />
          )}

          {/* Predict Button */}
          <TouchableOpacity
            onPress={handlePredict}
            disabled={loading}
            style={styles.button}
          >
            <LinearGradient
              colors={["#3B82F6", "#06B6D4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>🔍 Predict Diabetes</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Result Card */}
          {resultMessage ? (
            <LinearGradient
              colors={
                resultMessage.startsWith("❌")
                  ? ["#fee2e2", "#fecaca"]
                  : ["#dcfce7", "#bbf7d0"]
              }
              style={styles.resultBox}
            >
              <Text
                style={[
                  styles.resultText,
                  {
                    color: resultMessage.startsWith("❌")
                      ? "#b91c1c"
                      : "#166534",
                  },
                ]}
              >
                {resultMessage}
              </Text>
            </LinearGradient>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e3a8a",
    marginBottom: 26,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 16,
    marginBottom: 8,
  },
  inputGroup: { marginBottom: 16 },
  label: {
    marginBottom: 6,
    color: "#334155",
    fontSize: 15,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  input: { flex: 1, padding: 12, fontSize: 15, color: "#111827" },
  button: {
    borderRadius: 14,
    marginTop: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  buttonGradient: { paddingVertical: 16, alignItems: "center" },
  buttonText: { color: "white", fontSize: 17, fontWeight: "700" },
  resultBox: {
    marginTop: 28,
    padding: 18,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  resultText: { fontSize: 16, lineHeight: 22, fontWeight: "600" },
});
