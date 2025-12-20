import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});


// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => {
    throw error; 
  }
);


// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:5000/api/user/refresh",
          {},
          { withCredentials: true }
        );

        const user = JSON.parse(localStorage.getItem("userInfo"));
        user.token = res.data.token;
        localStorage.setItem("userInfo", JSON.stringify(user));

        originalRequest.headers.Authorization = `Bearer ${res.data.token}`;

        return api(originalRequest); 
      } catch (err) {
        localStorage.removeItem("userInfo");
        window.location.href = "/auth/login";
        throw err; 
      }
    }

    throw error; 
  }
);

export default api;
