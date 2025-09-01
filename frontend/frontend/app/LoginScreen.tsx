import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ImageBackground,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<"success" | "error">("success");
  const [popupMessage, setPopupMessage] = useState("");
  const [focusAnim] = useState(new Animated.Value(0));

  const showPopup = (type: "success" | "error", message: string) => {
    setPopupType(type);
    setPopupMessage(message);
    setPopupVisible(true);
  };
  const handleSubmit = async () => {
    let newErrors: Record<string, string> = {};

    if(!email) newErrors.email = "Email is required";
    if(!password) newErrors.password = "Password is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0){
        try{
          const response = await fetch(
            "http://10.0.16.242:5000/user/login",
            {
              method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Email:email,
              Password:password
            }),
            }
          );
          const data = await response.json();
          if (response.ok) {
            showPopup("success", data.message);
          } 
          else {
            showPopup("error", data.message);
          }
        } catch (err) {
        showPopup("error", "Could not connect to server. Check IP and network.");
        console.error(err);
      }
    }
  };
  const handleFocus = () => {
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Email Validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Login Handler
  const handleLogin = () => {
    if (!validateEmail(email)) {
      setErrors("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setErrors("Password must be at least 6 characters");
      return;
    }
    setErrors("");
    router.push("/(tabs)/dashboard");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dxekkc0pq/image/upload/v1756398348/download_11_lzshq8.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.55)", "rgba(255,255,255,0.25)"]}
        style={styles.gradientOverlay}
      >
        <View style={styles.container}>
          <Text style={styles.logo}>CuraPath</Text>

          <Animated.View
            style={[
              styles.card,
              {
                shadowOpacity: focusAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.15, 0.35],
                }),
                transform: [
                  {
                    scale: focusAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.02],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.95)", "rgba(240,240,255,0.85)"]}
              style={styles.cardGradient}
            >
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Login to continue your health journey
              </Text>

              {errors ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* Email Input */}
              <LinearGradient
                colors={["#93c5fd", "#bfdbfe"]}
                style={styles.inputWrapper}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#555"
                  value={email}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </LinearGradient>

              {/* Password Input */}
              <LinearGradient
                colors={["#c7d2fe", "#e0e7ff"]}
                style={styles.inputWrapper}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#555"
                  secureTextEntry
                  value={password}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChangeText={setPassword}
                />
              </LinearGradient>

              {/* Login Button */}
              <Pressable
                onPress={handleLogin}
                style={({ pressed }) => [
                  { transform: [{ scale: pressed ? 0.96 : 1 }] },
                ]}
              >
                <LinearGradient
                  colors={["#3B82F6", "#06B6D4"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>LOGIN</Text>
                </LinearGradient>
              </Pressable>

              {/* Register Button */}
              <Pressable
                onPress={() => router.push("/RegisterScreen")}
                style={({ pressed }) => [
                  { transform: [{ scale: pressed ? 0.96 : 1 }] },
                ]}
              >
                <LinearGradient
                  colors={["#22c55e", "#16a34a"]}
                  style={styles.buttonAlt}
                >
                  <Text style={styles.buttonAltText}>REGISTER</Text>
                </LinearGradient>
              </Pressable>

              {/* Forgot Password */}
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </LinearGradient>
          </Animated.View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  gradientOverlay: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 10,
  },
  cardGradient: {
    padding: 25,
    borderRadius: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#64748b",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  inputWrapper: {
    borderRadius: 14,
    padding: 2,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: "#111827",
  },
  button: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 14,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonAlt: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonAltText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  forgotText: {
    color: "#1E3A8A",
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
  },
});
