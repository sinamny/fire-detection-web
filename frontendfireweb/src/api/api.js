export const baseURL = process.env.REACT_APP_BASE_API || "http://localhost:8000"

const SummaryApi = {
  login: {
    url: "/api/v1/auth/login",
    method: "post"
  },
  getCurrentUser: {
    url: "/api/v1/users/me",
    method: "get"
  },
  update_user_info: {
    url: "/api/v1/users/me",
    method: "put"
  }, 
  directProcessWS: `${baseURL.replace(/^http/, "ws")}/api/v1/ws/direct-process`,
  fireCameraWS: `${baseURL.replace(/^http/, "ws")}/api/v1/ws/fire`,
  fetchVideos: {
    url: "/api/v1/videos",
    method: "get",
  },
  fetchHistory: {
    url: "/api/v1/history/me",
    method: "get",
  },
   fetchAllUsers: {
    url: "/api/v1/users",
    method: "get",
  },
  fetchAllVideos: {
    url: "/api/v1/videos/all",
    method: "get",
  },
};

export default SummaryApi;