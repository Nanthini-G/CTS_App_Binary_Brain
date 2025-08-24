import React from "react";
import { View, Button, Text } from "react-native";

export default function DashboardScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Health Dashboard</Text>
      <Button title="Diabetes Analysis" onPress={() => navigation.navigate("Diabetes")} />
      <Button title="Heart Health" onPress={() => navigation.navigate("Heart")} />
      <Button title="Appointments" onPress={() => navigation.navigate("Appointment")} />
    </View>
  );
}
