import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import probabilityFunction from "../../assets/data/probability_function.json";

const screenWidth = Dimensions.get("window").width - 40;

type HealthRow = {
  Date: string;
  Heart_Probability: number;
  Diabetes_Probability: number;
};

export default function ReportsScreen() {
  const [data, setData] = useState<HealthRow[]>([]);
  const [selected, setSelected] = useState<"heart" | "diabetes">("heart");
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    value: number;
    label: string;
  } | null>(null);

  useEffect(() => {
    const simulated = probabilityFunction.map((d: HealthRow) => ({
      ...d,
      Heart_Probability: Math.min(
        100,
        Math.max(0, d.Heart_Probability + (Math.random() * 10 - 5))
      ),
      Diabetes_Probability: Math.min(
        300,
        Math.max(50, d.Diabetes_Probability + (Math.random() * 15 - 7))
      ),
    }));
    setData(simulated);
    setTooltip(null);
  }, []);

  const aggregateWeekly = (dataset: number[]) => {
    const weeks: number[] = [];
    for (let i = 0; i < dataset.length; i += 7) {
      const week = dataset.slice(i, i + 7);
      const avg = week.reduce((a, b) => a + b, 0) / week.length;
      weeks.push(Math.round(avg * 100) / 100);
    }
    return weeks;
  };

  const weeklyValues = aggregateWeekly(
    data.map((d) =>
      selected === "heart" ? d.Heart_Probability : d.Diabetes_Probability
    )
  );
  const labels = weeklyValues.map((_, i) => `Week ${i + 1}`);

  const chartConfigHeart = {
    backgroundGradientFrom: "#f3f4f6",
    backgroundGradientTo: "#e5e7eb",
    color: (opacity = 1) => `rgba(239,68,68,${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    decimalPlaces: 2,
    style: { borderRadius: 16 },
    propsForDots: { r: "5", strokeWidth: "2", stroke: "#ef4444" },
  };

  const chartConfigDiabetes = {
    ...chartConfigHeart,
    color: (opacity = 1) => `rgba(59,130,246,${opacity})`,
    propsForDots: { r: "5", strokeWidth: "2", stroke: "#3b82f6" },
  };

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dxekkc0pq/image/upload/v1756397941/Are_you_seeking_a_dependable_healthcare_mobile_app_jrcwtx.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView style={styles.overlay} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>📈 Weekly Health Reports</Text>
        <Text style={styles.subtitle}>
          Chart shows weekly average of simulated probability functions for Heart Risk (%) and Diabetes (mg/dL)
        </Text>

        <View style={styles.toggleContainer}>
          <Text
            style={[styles.toggleBtn, selected === "heart" && styles.activeBtn]}
            onPress={() => setSelected("heart")}
          >
            ❤ Heart
          </Text>
          <Text
            style={[styles.toggleBtn, selected === "diabetes" && styles.activeBtn]}
            onPress={() => setSelected("diabetes")}
          >
            🩸 Diabetes
          </Text>
        </View>

        {weeklyValues.length > 0 && (
          <View style={styles.card}>
            <LineChart
              data={{ labels, datasets: [{ data: weeklyValues }] }}
              width={screenWidth}
              height={220}
              yAxisSuffix={selected === "heart" ? "%" : " mg/dL"}
              chartConfig={selected === "heart" ? chartConfigHeart : chartConfigDiabetes}
              bezier
              style={{ borderRadius: 16, marginBottom: 8 }}
              onDataPointClick={({ value, x, y, index }) => {
                setTooltip({ x, y, value, label: labels[index] });
              }}
            />

            {tooltip && (
              <View style={[styles.tooltip, { left: tooltip.x - 25, top: tooltip.y - 40 }]}>
                <Text style={styles.tooltipText}>
                  {tooltip.value}
                  {selected === "heart" ? "%" : " mg/dL"}
                </Text>
                <Text style={styles.tooltipLabel}>{tooltip.label}</Text>
              </View>
            )}

            <View style={styles.probabilityBox}>
              <Text style={styles.probabilityText}>
                Latest {selected === "heart" ? "Heart Risk" : "Diabetes Risk"}:{" "}
                {weeklyValues[weeklyValues.length - 1]}
                {selected === "heart" ? "%" : " mg/dL"}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.75)", // Glassmorphism overlay
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    color: "#111",
  },
  subtitle: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
    marginHorizontal: 6,
    fontWeight: "600",
    color: "#374151",
  },
  activeBtn: {
    backgroundColor: "#3b82f6",
    color: "#fff",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  probabilityBox: {
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  probabilityText: { fontSize: 16, fontWeight: "600", color: "#111" },
  tooltip: {
    position: "absolute",
    backgroundColor: "#3b82f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tooltipText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  tooltipLabel: { color: "#e5e7eb", fontSize: 10, marginTop: 2 },
});
