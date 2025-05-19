import React, { useState } from "react";
import axios from "axios";
import "../LoginPage/Login.css"; 
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import fireImage from "../../assets/img/firelogin.jpg"; 
import "./Register.css"

const Register = () => {
  const [username, setUsername] = useState("");    
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const navigate = useNavigate();

  const validatePassword = (value) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!strongPasswordRegex.test(value)) {
      setPasswordError(
        "Ít nhất 6 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

      if (passwordError) {
    setErrorMsg("Mật khẩu không hợp lệ");
    return;
  }


    if (password !== confirm) {
      setErrorMsg("Mật khẩu không khớp");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/v1/auth/register", {
        username: username,   
        email: email,
        password: password
      });

      if (response.status === 200) {
        setSuccessMsg("Đăng ký thành công!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      if (err.response) {
        const detail = err.response.data?.detail;
        if (Array.isArray(detail)) {
          setErrorMsg("Lỗi: " + detail[0]?.msg || "Đăng ký thất bại");
        } else if (typeof detail === "string") {
          setErrorMsg("Lỗi: " + detail);
        } else {
          setErrorMsg("Đăng ký thất bại, vui lòng thử lại");
        }
      } else {
        setErrorMsg("Lỗi kết nối máy chủ, vui lòng thử lại");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-form-section">
          <div className="register-fire-header1">
            <MdOutlineLocalFireDepartment className="fire-icon-home" />
          </div>
          <h2 className="register-title">Đăng ký tài khoản</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="register-input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="register-input"
              required
            />
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value); 
                }}
                className="register-input"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="register-error">
              {passwordError && <p className="register-error">{passwordError}</p>}
            </div>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="register-input"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errorMsg && <p className="register-error">{errorMsg}</p>}
            <button type="submit" className="register-button">
              Đăng ký
            </button>
          </form>
          {successMsg && <p className="register-success">{successMsg}</p>}
          <div className="register-divider">
            <hr className="divider-line" />
            <span className="divider-text">Hoặc</span>
            <hr className="divider-line" />
          </div>
          <div className="register-register">
            Đã có tài khoản?{" "}
            <span className="register-link" onClick={() => navigate("/login")}>
              Đăng nhập
            </span>
          </div>
        </div>
        <div className="register-image-section">
          <img
            src={fireImage}
            alt="Register Visual"
            className="register-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
