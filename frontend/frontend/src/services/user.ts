const API_BASE = "http://192.168.1.6:5000";

export async function getUserByEmail(email: string) {
  const response = await fetch(`${API_BASE}/user?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  const data = await response.json();
  return { Age: data.Age, BMI: data.BMI }; // only return what you need for diabetes
}
