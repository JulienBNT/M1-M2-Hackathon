import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getAllUserPosts(userId) {
  const response = await axios.get(`${API_URL}posts/get-all-posts/${userId}`);
  return response.data;
}
