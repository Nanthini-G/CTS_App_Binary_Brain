// src/services/personalized.ts
const API_BASE = "http://192.168.1.6:5000"; // 🔹 change to your system IP

export async function getPersonalizedPlan() {
  const response = await fetch(`${API_BASE}/personalized`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json(); // returns { plan: "..." }
}
