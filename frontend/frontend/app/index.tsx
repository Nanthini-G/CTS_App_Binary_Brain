// import React from "react";
// import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import { AppTheme } from "../src/theme"; // import your theme

// export default function HomeScreen() {
//   const router = useRouter();

//   return (
//     <LinearGradient
//       colors={AppTheme.gradientBackground}
//       style={{ flex: 1 }}
//     >
//       <ScrollView contentContainerStyle={styles.container}>
        
//         {/* App Title */}
//         <LinearGradient
//           colors={["#00E1FF", "#74F9FE"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.titleGradient}
//         >
//           <Text style={styles.title}>CuraPath</Text>
//         </LinearGradient>

//         <Text style={styles.description}>Your Health, Your Insight.</Text>

//         <View style={styles.buttonContainer}>
//           {/* Login Button */}
//           <TouchableOpacity onPress={() => router.push("/LoginScreen")}>
//             <LinearGradient
//               colors={AppTheme.buttonGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.button}
//             >
//               <Text style={styles.buttonText}>Login</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           {/* Register Button */}
//           <TouchableOpacity onPress={() => router.push("/RegisterScreen")}>
//             <LinearGradient
//               colors={["#10B981", "#3B82F6"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.button}
//             >
//               <Text style={styles.buttonText}>Register</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     paddingHorizontal: 20,
//     paddingTop: 100,
//     paddingBottom: 60,
//     justifyContent: "center",
//   },
//   titleGradient: {
//     alignSelf: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 14,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.25,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   title: {
//     fontSize: 42,
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "white",
//   },
//   description: {
//     fontSize: 18,
//     textAlign: "center",
//     color: "#374151",
//     marginBottom: 50,
//   },
//   buttonContainer: {
//     marginTop: 10,
//   },
//   button: {
//     paddingVertical: 16,
//     borderRadius: 14,
//     marginBottom: 24,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   dashboardButton: {
//     borderWidth: 2,
//     borderColor: "#00E1FF",
//     borderRadius: 14,
//     marginBottom: 24,
//     overflow: "hidden",
//   },
//   dashboardGradient: {
//     paddingVertical: 16,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   dashboardText: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "white",
//     textShadowColor: "rgba(0,0,0,0.15)",
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
// });



import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { AppTheme } from "../src/theme"; // keep your theme path

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dxekkc0pq/image/upload/v1756392225/download_10_ndazax.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(0, 225, 255, 0.2)", 
          "rgba(116, 249, 254, 0.2)",
        ]}
        style={styles.gradientOverlay}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* App Title */}
          <LinearGradient
            colors={["#00E1FF", "#74F9FE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.titleGradient}
          >
            <Text style={styles.title}>CuraPath</Text>
          </LinearGradient>

          <Text style={styles.description}>Your Health, Your Insight.</Text>

          <View style={styles.buttonContainer}>
            {/* Login Button */}
            <TouchableOpacity onPress={() => router.push("/LoginScreen")}>
              <LinearGradient
                colors={AppTheme.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity onPress={() => router.push("/RegisterScreen")}>
              <LinearGradient
                colors={["#10B981", "#3B82F6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Register</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 60,
    justifyContent: "center",
  },
  titleGradient: {
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    color: "#374151",
    marginBottom: 50,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
