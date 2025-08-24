import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({});

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Register</Text>
      {["Name", "Email", "Phone", "Address", "DOB", "Blood Group", "BMI", "Age", "Gender"].map((field) => (
        <TextInput key={field} placeholder={field} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      ))}
      <Button title="Submit" onPress={() => navigation.navigate("Profile")} />
    </ScrollView>
  );
}
