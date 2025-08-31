import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getPersonalizedPlan } from "../../src/services/personalized";
import { getYouTubeVideos } from "../../src/services/youtube";

export default function WellnessScreen() {
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [plan, setPlan] = useState("");
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [videos, setVideos] = useState<{ title: string; url: string }[]>([]);

  const fetchPlan = async () => {
    try {
      setLoadingPlan(true);
      const data = await getPersonalizedPlan();
      setPlan(data.plan);
    } catch (err) {
      console.error(err);
      setPlan("❌ Failed to fetch personalized plan");
    } finally {
      setLoadingPlan(false);
    }
  };

  const fetchVideos = async () => {
    try {
      setLoadingVideos(true);
      setVideos([]);
      const data = await getYouTubeVideos();
      setVideos(data.videos);
    } catch (error) {
      console.error(error);
      setVideos([{ title: "❌ Failed to fetch videos", url: "" }]);
    } finally {
      setLoadingVideos(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dxekkc0pq/image/upload/v1756541620/%D0%91%D1%83%D0%B4%D1%83%D1%89%D0%B5%D0%B5_%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B6__%D0%9A%D0%B0%D0%BA_%D0%BD%D0%B5%D0%B9%D1%80%D0%BE%D1%81%D0%B5%D1%82%D0%B8_%D0%BC%D0%B5%D0%BD%D1%8F%D1%8E%D1%82_%D0%B2%D0%B0%D1%88%D0%B5_%D0%B2%D0%B7%D0%B0%D0%B8%D0%BC%D0%BE%D0%B4%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D0%B5_%D1%81_%D0%BA%D0%BB%D0%B8%D0%B5%D0%BD%D1%82%D0%B0%D0%BC%D0%B8_%D0%B2_%D0%B1%D0%B8%D0%B7%D0%BD%D0%B5%D1%81%D0%B5_elzey5.jpg",
      }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* Aqua Overlay */}
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* ---- Personalized Plan Section ---- */}
          <View style={styles.headerBox}>
            <Text style={styles.title}>Personalized Care Plan</Text>
            <Text style={styles.subtitle}>
              Get AI-driven care recommendations tailored just for you
            </Text>
          </View>

          <TouchableOpacity
            onPress={fetchPlan}
            disabled={loadingPlan}
            style={styles.buttonWrapper}
          >
            <LinearGradient colors={["#74F9FE", "#00E1FF"]} style={styles.button}>
              <Text style={styles.buttonText}>
                {loadingPlan ? "Loading..." : "Generate Plan"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {loadingPlan && (
            <ActivityIndicator size="large" color="#00E1FF" style={{ marginTop: 20 }} />
          )}

          {plan ? (
            <View style={styles.card}>
              <Text style={styles.result}>{plan}</Text>
            </View>
          ) : null}

          {/* ---- Divider ---- */}
          <View style={styles.divider} />

          {/* ---- YouTube Section ---- */}
          <View style={styles.headerBox}>
            <Text style={styles.title}>YouTube Recommendations</Text>
            <Text style={styles.subtitle}>
              Discover curated health and wellness videos just for you
            </Text>
          </View>

          <TouchableOpacity
            onPress={fetchVideos}
            disabled={loadingVideos}
            style={styles.buttonWrapper}
          >
            <LinearGradient colors={["#74F9FE", "#00E1FF"]} style={styles.button}>
              <Text style={styles.buttonText}>
                {loadingVideos ? "Loading..." : "Get Recommendations"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {loadingVideos && (
            <ActivityIndicator size="large" color="#00E1FF" style={{ marginTop: 20 }} />
          )}

          {videos.length > 0 &&
            videos.map((video, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => video.url && Linking.openURL(video.url)}
                style={styles.card}
              >
                <Text style={styles.videoTitle}>{video.title}</Text>
                {video.url ? (
                  <Text style={styles.videoLink}>{video.url}</Text>
                ) : (
                  <Text style={styles.errorText}>Invalid video link</Text>
                )}
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: "center" },
  overlay: { flex: 1, backgroundColor: "rgba(0, 255, 255, 0.3)" }, // Aqua tint
  headerBox: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#065f46",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: { fontSize: 15, color: "#374151", textAlign: "center", lineHeight: 20 },
  buttonWrapper: { width: "100%", marginBottom: 20 },
  button: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#00E1FF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.5 },
  card: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: "#00E1FF",
  },
  result: { fontSize: 16, color: "#111", lineHeight: 22 },
  videoTitle: { fontSize: 16, fontWeight: "600", color: "#111" },
  videoLink: { fontSize: 14, color: "#2563eb", marginTop: 4 },
  errorText: { fontSize: 14, color: "red" },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 25,
  },
});
