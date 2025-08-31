const API_BASE = "http://192.168.1.6:5000"; 

// ---------------- Register User ----------------
export async function registerUser(payload: {
  Name: string;
  Email: string;
  Password: string;
  Phone: string;
  Address: string;
  DOB: string;
  BloodGroup: string;
  BMI: string;
  Age: string;
  Gender: string;
}) {
  const response = await fetch(`${API_BASE}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json(); // expects { message: "User registered successfully" }
}
