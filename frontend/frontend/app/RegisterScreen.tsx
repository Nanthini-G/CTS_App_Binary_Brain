import React, { useState } from "react";
import { ImageBackground } from "react-native";

import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { router, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { Modal } from "react-native";

const genderOptions = ["Male", "Female", "Other"];
const bloodGroupOptions = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];
const bmiOptions = Array.from({ length: 31 }, (_, i) => (i + 10).toString()); // 10 to 40



export default function RegisterScreenUI() {
  const navigation = useNavigation<any>(); // ✅ typing fix
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    bloodGroup: "",
    bmi: "",
  });

  const [errors, setErrors] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [popupMessage, setPopupMessage] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (key: string, value: string) => {
    if (key === "name") value = value.replace(/[^A-Za-z ]/g, "");
    if (key === "age" || key === "phone" || key === "bmi")
      value = value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, [key]: value });
  };

  const showPopup = (type: "success" | "error", message: string) => {
    setPopupType(type);
    setPopupMessage(message);
    setPopupVisible(true);
  };

const handleSubmit = async () => {
  let newErrors: Record<string, string> = {};

  // ✅ VALIDATIONS
  if (!formData.name) newErrors.name = "Name is required";
  else if (!/^[A-Za-z ]+$/.test(formData.name))
    newErrors.name = "Only alphabets allowed";

  if (!formData.dob) newErrors.dob = "DOB is required";
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dob))
    newErrors.dob = "Format: YYYY-MM-DD";

  if (!formData.age) newErrors.age = "Age is required";
  else if (+formData.age <= 0 || +formData.age > 120)
    newErrors.age = "Age must be 1–120";

  if (!formData.gender) newErrors.gender = "Gender is required";

  if (!formData.email) newErrors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    newErrors.email = "Invalid email";

  if (!formData.phone) newErrors.phone = "Phone is required";
  else if (!/^\d{10}$/.test(formData.phone))
    newErrors.phone = "Must be 10 digits";

  if (!formData.address) newErrors.address = "Address is required";

  if (!formData.password) newErrors.password = "Password is required";
  else if (formData.password.length < 6)
    newErrors.password = "At least 6 characters";

  if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";

  if (!formData.bmi) newErrors.bmi = "BMI is required";

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(
          "http://http://192.168.1.6:5000/user/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Name: formData.name,
              Email: formData.email,
              Password: formData.password,
              Phone: formData.phone,
              Address: formData.address,
              DOB: formData.dob,
              BloodGroup: formData.bloodGroup,
              BMI: formData.bmi,
              Age: formData.age,
              Gender: formData.gender,
            }),
          }
        );

       const data = await response.json();
        if (response.ok) {
          showPopup("success", data.message);
        } else {
          showPopup("error", data.message);
        }
      } catch (err) {
        showPopup("error", "Could not connect to server. Check IP and network.");
        console.error(err);
      }
    }
  };

        
  return ( 
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dxekkc0pq/image/upload/v1756392075/4c78d45f-1d50-4f53-bd5d-1fab15fb2d93_ymbzww.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.3)", "rgba(255, 255, 255, 0.4)"]}
        style={styles.gradientOverlay}
      >
        <BlurView intensity={40} tint="light" style={styles.blurOverlay}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.logo}>CuraPath</Text>
            <View style={styles.card}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Fill in your details to register
              </Text>

              {/* PERSONAL INFO */}
              <Text style={styles.section}>Personal Info</Text>

              {/* Name */}
              <LinearGradient
                colors={["#dbeafe", "#e0f2fe"]}
                style={styles.inputWrapper}
              >
                <TextInput
                  placeholder="NAME"
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(val) => handleChange("name", val)}
                />
              </LinearGradient>
              {errors.name && <Text style={styles.error}>{errors.name}</Text>}

              {/* DOB with calendar */}
              <LinearGradient
                colors={["#dbeafe", "#e0f2fe"]}
                style={styles.inputWrapper}
              >
                <TextInput
                  placeholder="Date of Birth (YYYY-MM-DD)"
                  style={styles.input}
                  value={formData.dob}
                  onChangeText={(val) => handleChange("dob", val)}
                />
              </LinearGradient>
              {/* Age */}
              <LinearGradient
                colors={["#dbeafe", "#e0f2fe"]}
                style={styles.inputWrapper}
              >
                <TextInput
                  placeholder="AGE"
                  style={styles.input}
                  value={formData.age}
                  keyboardType="numeric"
                  onChangeText={(val) => handleChange("age", val)}
                />
              </LinearGradient>

              {/* Gender Dropdown */}
              <LinearGradient
                colors={["#dbeafe", "#e0f2fe"]}
                style={styles.inputWrapper}
              >
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.gender}
                  onValueChange={(val) => handleChange("gender", val)}
                  style={{ borderWidth: 0, backgroundColor: "transparent" }}
                >
                  <Picker.Item label="Select Gender" value=""/>
                  {genderOptions.map((g) => (
                    <Picker.Item key={g} label={g} value={g} />
                  ))}
                </Picker>
              </View>
              </LinearGradient>

              {/* CONTACT INFO */}
              <Text style={styles.section}>Contact Info</Text>
              {["email", "phone", "address", "password"].map((field) => (
                <View key={field}>
                  <LinearGradient
                    colors={["#fef3c7", "#fde68a"]}
                    style={styles.inputWrapper}
                  >
                    <TextInput
                      placeholder={field.toUpperCase()}
                      style={styles.input}
                      value={formData[field]}
                      onChangeText={(val) => handleChange(field, val)}
                      secureTextEntry={field === "password"}
                      keyboardType={field === "phone" ? "numeric" : "default"}
                    />
                  </LinearGradient>
                  {errors[field] && (
                    <Text style={styles.error}>{errors[field]}</Text>
                  )}
                </View>
              ))}

              {/* HEALTH INFO */}
              <Text style={styles.section}>Health Info</Text>

              {/* Blood Group Dropdown */}
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.bloodGroup}
                  onValueChange={(val) => handleChange("bloodGroup", val)}
                  style={{ borderWidth: 0, backgroundColor: "transparent" }}
                >
                  <Picker.Item label="Select Blood Group" value="" />
                  {bloodGroupOptions.map((bg) => (
                    <Picker.Item key={bg} label={bg} value={bg} />
                  ))}
                </Picker>
              </View>

              {/* BMI */}
              <LinearGradient
                colors={["#dcfce7", "#bbf7d0"]}
                style={styles.inputWrapper}
              >
                <TextInput
                  placeholder="BMI"
                  style={styles.input}
                  value={formData.bmi}
                  keyboardType="numeric"
                  onChangeText={(val) => handleChange("bmi", val)}
                />
              </LinearGradient>

              {/* REGISTER BUTTON */}
              <Pressable onPress={handleSubmit}>
                <LinearGradient
                  colors={["#2563eb", "#06b6d4"]}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>REGISTER</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </ScrollView>

          {/* Custom Popup */}
          <Modal
            transparent
            visible={popupVisible}
            animationType="fade"
            onRequestClose={() => setPopupVisible(false)}
          >
            <View style={styles.overlay}>
              <View
                style={[
                  styles.popupBox,
                  popupType === "success"
                    ? { backgroundColor: "#d1fae5" }
                    : { backgroundColor: "#fee2e2" },
                ]}
              >
                <Text style={styles.popupTitle}>
                  {popupType === "success" ? "✅ Success" : "❌ Error"}
                </Text>
                <Text style={styles.popupMessage}>{popupMessage}</Text>
                <Button
                  title="OK"
                  onPress={() => {
                    setPopupVisible(false);
                    if(popupType === "success")
                      {router.replace("/(tabs)/dashboard");}
                    else{
                      router.replace("/RegisterScreen");
                    }
                  }}
                />
              </View>
            </View>
          </Modal>
        </BlurView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  gradientOverlay: { flex: 1 },
  blurOverlay: { flex: 1 },
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  logo: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 20,
    padding: 25,
    elevation: 6,
  },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 15, textAlign: "center", marginBottom: 20 },
  section: { fontSize: 16, fontWeight: "700", marginTop: 15, marginBottom: 10 },
  inputWrapper: { borderRadius: 12, padding: 2, marginBottom: 6 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 14 },
  error: { color: "red", fontSize: 12, marginBottom: 4 },
  button: { padding: 16, borderRadius: 14, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 17 },
  pickerWrapper: {
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding:14
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popupBox: {
    width: 300,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  popupTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  popupMessage: { fontSize: 16, marginBottom: 20, textAlign: "center" },
});