import React from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  View,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function DashboardScreen() {
  const router = useRouter();

  const Card = ({
    title,
    desc,
    colors,
    route,
  }: {
    title: string;
    desc: string;
    colors: string[];
    route: string;
  }) => (
    <Pressable
      onPress={() => router.push(route)}
      style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]}
    >
      <LinearGradient colors={colors} style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </LinearGradient>
    </Pressable>
  );

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dxekkc0pq/image/upload/v1756392075/4c78d45f-1d50-4f53-bd5d-1fab15fb2d93_ymbzww.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.55)", "rgba(255,255,255,0.25)"]}
        style={styles.overlay}
      >
        <Text style={styles.title}>Health Monitor</Text>

        <Card
          title="Diabetes Analysis"
          desc="Track glucose levels & insights"
          colors={["#fef3c7", "#fde68a"]}
          route="/diabetes"
        />

        <Card
          title="Heart Health"
          desc="Monitor heart rate & BP trends"
          colors={["#e0f2fe", "#bae6fd"]}
          route="/heart"
        />
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e3a8a",
    textAlign: "center",
    marginBottom: 35,
  },
  card: {
    padding: 22,
    borderRadius: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#0f172a",
  },
  cardDesc: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 20,
  },
});
