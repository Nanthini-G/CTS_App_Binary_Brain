// src/services/careRecommendation.ts

const API_BASE = "http://192.168.1.11:5000"; 
// ⚠️ replace with your backend IP (check with `ipconfig`) 
// or even better: put it in process.env

export async function getCareRecommendation() {
  const response = await fetch(`${API_BASE}/recommendation`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json(); // { recommendation: "..." }
}

