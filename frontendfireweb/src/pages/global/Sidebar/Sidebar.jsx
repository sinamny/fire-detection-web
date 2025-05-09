import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import { NavLink } from "react-router-dom";  
import { useLocation } from 'react-router-dom';
import "./Sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isVideoActive = ['/video', '/detectionresult', '/cameraresult'].some(path =>
    location.pathname.startsWith(path)
  );
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}>
      <div className="sidebar-header">
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
      </div>
      <div className="fire-icon" style={{ display: collapsed ? 'none' : 'block' }}>
        <NavLink to="/">  
          <MdOutlineLocalFireDepartment />
        </NavLink>
      </div>
      <nav className="sidebar-nav">
      <ul>
        <li>
            <NavLink 
            to="/video"
            className={({ isActive }) => `sidebar-item ${isVideoActive ? "active" : ""}`}
            >
            <SmartDisplayOutlinedIcon className="sidebar-icon" /> {!collapsed && "Video"}
            </NavLink>
        </li>
        <li>
            <NavLink 
            to="/account"
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
            >
            <PersonOutlineOutlinedIcon className="sidebar-icon" /> {!collapsed && "Tài khoản"}
            </NavLink>
        </li>
        <li>
            <NavLink 
            to="/settings"
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
            >
            <SettingsOutlinedIcon className="sidebar-icon" /> {!collapsed && "Cài đặt"}
            </NavLink>
        </li>
        <li>
            <NavLink 
            to="/manage"
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
            >
            <ManageAccountsOutlinedIcon className="sidebar-icon" /> {!collapsed && "Quản lý"}
            </NavLink>
        </li>
        </ul>

      </nav>
    </div>
  );
};

export default Sidebar;