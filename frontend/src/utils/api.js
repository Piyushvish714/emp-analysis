import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally - redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => API.post("/auth/signup", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
};

// Employee APIs
export const employeeAPI = {
  add: (data) => API.post("/employees", data),
  getAll: (params) => API.get("/employees", { params }),
  search: (params) => API.get("/employees/search", { params }),
  getById: (id) => API.get(`/employees/${id}`),
  update: (id, data) => API.put(`/employees/${id}`, data),
  delete: (id) => API.delete(`/employees/${id}`),
  getRankings: () => API.get("/employees/rankings"),
};

// AI APIs
export const aiAPI = {
  recommend: (employeeId) => API.post("/ai/recommend", { employeeId }),
  rankAll: () => API.post("/ai/rank-all"),
  trainingSuggestions: (employeeId) => API.post("/ai/training-suggestions", { employeeId }),
};

export default API;
