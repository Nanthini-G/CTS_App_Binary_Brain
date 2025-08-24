import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";

export default function DiabetesScreen() {
  const [data, setData] = useState({});
  const [prediction, setPrediction] = useState("");

  const handlePredict = () => {
    // Call API later
    setPrediction("Predicted Risk: Moderate");
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Diabetes Risk Prediction</Text>
      {["Pregnancies", "Glucose", "Blood Pressure", "Skin Thickness", "Insulin", "BMI", "Diabetes Pedigree Function", "Age"].map((field) => (
        <TextInput key={field} placeholder={field} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      ))}
      <Button title="Predict" onPress={handlePredict} />
      {prediction ? <Text style={{ marginTop: 20 }}>{prediction}</Text> : null}
    </ScrollView>
  );
}
