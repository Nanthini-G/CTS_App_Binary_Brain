import React from "react";
import { View, Text, Button } from "react-native";

export default function ProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>User Profile</Text>
      <Button title="Go to Dashboard" onPress={() => navigation.navigate("Dashboard")} />
    </View>
  );
}
