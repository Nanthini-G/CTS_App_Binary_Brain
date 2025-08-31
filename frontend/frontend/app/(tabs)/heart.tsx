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
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { predictHeart } from "../../src/services/predict";
import heartVitals from "../../assets/data/heart_vitals.json";

export default function HeartScreen() {
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState(heartVitals[0]);
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const handlePredict = async () => {
    try {
      setLoading(true);
      setResultMessage("");
      const result = await predictHeart(form);
      const message = `Risk Score: ${result.risk_score}`;
      setResultMessage(message);
      const next = (index + 1) % heartVitals.length;
      setIndex(next);
      setForm(heartVitals[next]);
    } catch {
      setResultMessage("❌ Error: Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dxekkc0pq/image/upload/v1756392074/download_9_jvo3lw.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(0, 0, 0, 0.2)",  // Light dark overlay
          "rgba(0, 0, 0, 0.1)"
        ]}
        style={styles.gradientOverlay}
      >
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 50 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Screen Title */}
            <Text style={styles.header}>❤️ Heart Disease Prediction</Text>

            {/* Patient Data Card */}
            <View style={styles.card}>
              <LinearGradient
                colors={["#74F9FE", "#00E1FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardHeader}
              >
                <Text style={styles.cardHeaderText}>Patient Data</Text>
              </LinearGradient>

              {Object.keys(form).map((field) => (
                <View key={field} style={styles.inputGroup}>
                  <Text style={styles.label}>{field}</Text>
                  <LinearGradient
                    colors={["#E8FFE8", "#A7FFF3"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.inputWrapper}
                  >
                    <TextInput
                      value={String(form[field as keyof typeof form])}
                      editable={false}
                      style={styles.input}
                    />
                  </LinearGradient>
                </View>
              ))}
            </View>

            {/* Predict Button */}
            <TouchableOpacity onPress={handlePredict} disabled={loading}>
              <LinearGradient
                colors={
                  loading ? ["#fca5a5", "#f87171"] : ["#74F9FE", "#00E1FF"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>🔍 Run Prediction</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Results */}
            {resultMessage ? (
              <View style={styles.card}>
                <LinearGradient
                  colors={
                    resultMessage.startsWith("❌")
                      ? ["#fca5a5", "#dc2626"]
                      : ["#bbf7d0", "#16a34a"]
                  }
                  style={styles.cardHeader}
                >
                  <Text style={styles.cardHeaderText}>
                    Prediction Result
                  </Text>
                </LinearGradient>
                <Text
                  style={[
                    styles.resultText,
                    {
                      color: resultMessage.startsWith("❌") ? "#dc2626" : "#065f46",
                    },
                  ]}
                >
                  {resultMessage}
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#fff",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  cardHeaderText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  label: {
    color: "#006994",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputWrapper: {
    borderRadius: 12,
    padding: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    fontSize: 15,
    color: "#333",
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resultText: {
    padding: 16,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500",
  },
});
