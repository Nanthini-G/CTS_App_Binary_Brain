import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";

export default function AppointmentScreen() {
  const [appointments, setAppointments] = useState([]);

  const addAppointment = () => {
    setAppointments([...appointments, { type: "Checkup", datetime: "Tomorrow", medication: "Vitamin D" }]);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Appointments</Text>
      <Button title="Add Appointment" onPress={addAppointment} />
      {appointments.map((a, index) => (
        <Text key={index}>{a.type} | {a.datetime} | {a.medication}</Text>
      ))}
    </ScrollView>
  );
}
