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
};

export default SummaryApi;