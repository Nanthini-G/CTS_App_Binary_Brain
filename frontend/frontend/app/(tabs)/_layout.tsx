// app/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function Layout() {
  return (
    <SafeAreaProvider>
        <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#1E3A8A",
          tabBarInactiveTintColor: "#888",
          tabBarStyle: { backgroundColor: "#fff", height: 125 },
        }}
      >
        {/* <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          }}
        /> */}
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Ionicons name="speedometer-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="heart"
          options={{
            title: "Heart",
            tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="diabetes"
          options={{
            title: "Diabetes",
            tabBarIcon: ({ color, size }) => <Ionicons name="medkit-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="care_recommend"
          options={{
            title: "Care Support",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="leaf-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="personalized"
          options={{
            title: "Personal Plan",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: "Reports",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
