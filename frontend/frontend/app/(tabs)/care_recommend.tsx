import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";            // ✅ import router
import { getCareRecommendation } from "../../src/services/recommendation";

export default function RecommendationScreen() {
  const router = useRouter();                       // ✅ create router
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");

  const handleFetch = async () => {
    try {
      setLoading(true);
      setRecommendation("");
      const data = await getCareRecommendation();
      setRecommendation(data.recommendation);
    } catch (err) {
      console.error(err);
      setRecommendation("❌ Failed to fetch recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dxekkc0pq/image/upload/v1756531627/AI_xbfwrz.jpg",
      }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(232, 255, 232, 0.7)",
          "rgba(167, 255, 243, 0.7)",
          "rgba(116, 249, 254, 0.7)",
          "rgba(0, 225, 255, 0.7)",
        ]}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerBox}>
            <Text style={styles.title}>🩺 AI Care Recommendation</Text>
            <Text style={styles.subtitle}>
              Get personalized AI-driven health tips & lifestyle suggestions
            </Text>
          </View>

          <TouchableOpacity onPress={handleFetch} disabled={loading} style={styles.buttonWrapper}>
            <LinearGradient
              colors={["#06B6D4", "#3B82F6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {loading ? "Loading..." : "Get Recommendation"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {loading && (
            <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 20 }} />
          )}

          {recommendation ? (
            <>
              <View style={styles.card}>
                <Ionicons
                  name="medkit-outline"
                  size={28}
                  color="#06B6D4"
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.result}>{recommendation}</Text>
              </View>

              {/* 🔹 Button to go to Personalized Plan */}
              <TouchableOpacity
                onPress={() => router.push("/personalized")}
                style={styles.nextButtonWrapper}
              >
                <LinearGradient
                  colors={["#22c55e", "#16a34a"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.nextButton}
                >
                  <Text style={styles.nextButtonText}>Get Personalized Plan</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : null}
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: "center" },

  headerBox: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 18,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#065f46",
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: { fontSize: 15, color: "#374151", textAlign: "center", lineHeight: 20 },

  buttonWrapper: { width: "100%", marginBottom: 20 },
  button: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.5 },

  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 16,
    padding: 20,
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  result: { fontSize: 16, color: "#111", lineHeight: 22, textAlign: "center" },

  // ✅ new styles for the "Get Personalized Plan" button
  nextButtonWrapper: {
    width: "100%",
    marginTop: 20,
  },
  nextButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#16a34a",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
