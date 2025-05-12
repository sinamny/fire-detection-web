import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { Logout } from '@mui/icons-material';
import {IconButton} from '@mui/material';
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import { Avatar} from "antd";
import "./Topbar.css";

const Topbar = () => {
  const navigate = useNavigate(); 
   const handleUserClick = () => {
    navigate("/account"); 
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem("isAuthenticated"); 
    navigate('/login');
  };
  return (
    <div className="topbar">
     <div className="topbar-left">
        <MdOutlineLocalFireDepartment className="topbar-logo" />
        <h1 className="topbar-title">Phát hiện đám cháy</h1>
      </div>  
      <div className="topbar-right">
      <div className="topbar-user" onClick={handleUserClick} style={{ cursor: "pointer" }}>
        <Avatar size="1.5rem" icon={<FaRegUserCircle className="topbar-user-logo"/>} />
        <div className="topbar-username-container">
          <span className="topbar-username">ABC Nguyen</span>
        </div>
      </div>
      <div className="topbar-logout">
        <IconButton onClick={handleLogout}>
            <Logout  style={{ color: "white" }}/>
          </IconButton>
      </div>
      </div>
    </div>
  );
};

export default Topbar;