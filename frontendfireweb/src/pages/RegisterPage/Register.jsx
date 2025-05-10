import React, { useState } from "react";
import "../LoginPage/Login.css"; 
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import fireImage from "../../assets/img/firefighters.jpg"; 

const mockRegisterApi = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password.length >= 6) {
        resolve("Đăng ký thành công");
      } else {
        reject(new Error("Thông tin không hợp lệ"));
      }
    }, 1000);
  });
};

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMsg("Mật khẩu không khớp");
      return;
    }

    try {
      await mockRegisterApi(email, password);
        setErrorMsg(""); 
        setSuccessMsg("Đăng ký thành công!"); 
        setTimeout(() => {
      navigate("/login");
    }, 1000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form-section">
          <div className="fire-header1">
            <MdOutlineLocalFireDepartment className="fire-icon-home" />
          </div>
          <h2 className="login-title">Đăng ký tài khoản</h2>
          <form onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
            <div className="password-input-wrapper">
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
            />
            <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            </div>
           <div className="password-input-wrapper">
            <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="login-input"
                required
            />
            <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            </div>
            {errorMsg && <p className="login-error">{errorMsg}</p>}
            <button type="submit" className="login-button">
              Đăng ký
            </button>
          </form>
           {successMsg && <p className="login-success">{successMsg}</p>}
          <div className="login-divider">
            <hr className="divider-line" />
            <span className="divider-text">Hoặc</span>
            <hr className="divider-line" />
          </div>
          <div className="login-register">
            Đã có tài khoản?{" "}
            <span className="register-link" onClick={() => navigate("/login")}>
              Đăng nhập
            </span>
          </div>
         
        </div>
         <div className="login-image-section">
          <img
            src={fireImage}
            alt="Login Visual"
            className="login-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
