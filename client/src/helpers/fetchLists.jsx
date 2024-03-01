import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const fetchLists = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/lists`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error("error fetching lists");
  }
};


