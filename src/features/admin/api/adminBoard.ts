import axios from "axios";

export async function fetchNotices(params: any) {
  const response = await axios.get("/api/admin/notices", { params });
  return response.data;
}

export async function fetchEvents(params: any) {
  const response = await axios.get("/api/admin/events", { params });
  return response.data;
}
