import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import { Avatar } from "antd";
import "./Topbar.css";

const Topbar = () => {
  return (
    <div className="topbar">
     <div className="topbar-left">
        <MdOutlineLocalFireDepartment className="topbar-logo" />
        <h1 className="topbar-title">Phát hiện đám cháy</h1>
      </div>
      <div className="topbar-user">
        <Avatar size="1.9rem" icon={<FaRegUserCircle className="topbar-user-logo"/>} />
        <div className="topbar-username-container">
          <span className="topbar-username">ABC Nguyen</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;