import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";

export default function HeartScreen() {
  const [prediction, setPrediction] = useState("");

  const handlePredict = () => {
    setPrediction("Predicted Risk: High, Recommendation: Consult doctor");
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Heart Disease Risk</Text>
      {["Age", "Sex", "Chest Pain", "Resting BP", "Cholesterol", "FBS", "Rest ECG", "Max HR", "Exercise Angina", "Old Peak", "ST Slope"].map((field) => (
        <TextInput key={field} placeholder={field} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      ))}
      <Button title="Predict" onPress={handlePredict} />
      {prediction ? <Text style={{ marginTop: 20 }}>{prediction}</Text> : null}
    </ScrollView>
  );
}
