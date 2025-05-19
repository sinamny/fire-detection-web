import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
} from "./authSlice";
import {
  getUserStart,
  getUserSuccess,
  getUserFailure,
} from './userSlice';


export const loginUser = (email, password, dispatch, navigate) => {
  dispatch(loginStart()); 

  axios
    .post(
      "http://127.0.0.1:8000/api/v1/auth/login",
      new URLSearchParams({
        username: email,
        password: password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((response) => {
      const data = response.data;
      dispatch(loginSuccess(data));
      localStorage.setItem("access_token", data.access_token);
      navigate("/home");
    })
    .catch((err) => {
      dispatch(loginFailed()); 
      console.error("Login failed:", err);
    });
};

export const fetchCurrentUser = async (dispatch) => {
  dispatch(getUserStart());
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/v1/users/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    dispatch(getUserSuccess(res.data));
  } catch (err) {
    console.error('Lỗi khi lấy thông tin người dùng:', err);
    dispatch(getUserFailure(err.response?.data || err.message));
  }
};