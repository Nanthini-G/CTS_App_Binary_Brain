const API_BASE = "http://192.168.1.11:5000"; // 👈 replace with your system IP

export async function getYouTubeVideos() {
  const response = await fetch(`${API_BASE}/youtube`, { method: "GET" });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  return response.json(); // { videos: [ { title, url } ] }
}
