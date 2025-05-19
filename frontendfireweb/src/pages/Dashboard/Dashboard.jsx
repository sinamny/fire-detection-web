import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Typography } from "antd";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./Dashboard.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const centerTextPlugin = {
  id: "centerTextPlugin",
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;
    const fireCount = chart.data.datasets[0].data[1];
    const fontSize = 20;
    const fontFamily = "'Montserrat', sans-serif";

    ctx.save();
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = "#ff7a3a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    ctx.fillText(`${fireCount}`, centerX, centerY);
    ctx.restore();
  },
};
ChartJS.register(centerTextPlugin);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, videoRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/v1/users", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            params: { skip: 0, limit: 100 },
          }),
          axios.get("http://127.0.0.1:8000/api/v1/videos/all", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }),
        ]);
        setUsers(userRes.data);
        setVideos(videoRes.data);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const fireCount = videos.filter((v) => v.fire_detected).length;
  const noFireCount = videos.length - fireCount;

  const pieData = {
    labels: ["Không cháy", "Có cháy"],
    datasets: [
      {
        data: [noFireCount, fireCount],
        backgroundColor: ["#4caf50", "#ff7a3a"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        reverse: true,
        position: "bottom",
        labels: {
          font: {
            family: "Montserrat",
            size: 12,
            weight: "bold",
          },
          usePointStyle: true,
          pointStyle: "circle",
          padding: 5,
          boxWidth: 15,
          color: "#000000",
        },
      },
    },
  };

  const isToday = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  };

  const todayAlerts = videos.filter(
    (v) => v.fire_detected && isToday(v.created_at)
  ).length;

  const weekAlerts = videos.filter(
    (v) => v.fire_detected && isThisWeek(v.created_at)
  ).length;

  return (
    <div
      className="dashboard-container"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                flex: 1,
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Card
                className="dashboard-card"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    fontFamily: "Montserrat",
                    fontSize: "1rem",
                    color: "#000000",
                  }}
                >
                  Tổng số người dùng
                </div>
                <Statistic
                  value={users.length}
                  valueStyle={{
                    fontSize: "0.9rem",
                    color: "#000000",
                    fontFamily: "Montserrat",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
              </Card>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <Card
                className="dashboard-card"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    fontFamily: "Montserrat",
                    fontSize: "1rem",
                    color: "#000000",
                  }}
                >
                  Số video đã tải lên
                </div>
                <Statistic
                  value={videos.length}
                  valueStyle={{
                    fontSize: "0.9rem",
                    color: "#000000",
                    fontFamily: "Montserrat",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
              </Card>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <Card
            className="dashboard-card"
            style={{ height: "100%", textAlign: "center" }}
          >
            <div
              className="chart-title"
              style={{
                textAlign: "center",
                fontWeight: "600",
                marginBottom: "1rem",
                fontFamily: "Montserrat",
              }}
            >
              Tỉ lệ video có cháy / không cháy
            </div>
            <div
              style={{
                width: "100%",
                height: "40vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Doughnut data={pieData} options={pieOptions} />
              
            </div>
            <span>
                Tỷ lệ cháy / tổng video:{" "}
                {videos.length > 0
                  ? `${((fireCount / videos.length) * 100).toFixed(2)}%`
                  : "0%"}
              </span>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "1.5rem" }}>
        <Col span={24}>
          <Card className="dashboard-card" style={{ textAlign: "center" }}>
            <Typography.Title
              level={4}
              style={{
                marginBottom: 16,
                fontFamily: "Montserrat",
                textAlign: "center",
                margin: 0,
                fontSize: "1rem",
              }}
            >
                Thống kê hoạt động hệ thống trong tuần
            </Typography.Title>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.9rem",
                padding: "0 2rem",
                color: "#000000",
                marginTop: "0.5rem",
              }}
            >
               <span>Người dùng mới trong tuần: {users.filter(u => isThisWeek(u.created_at)).length}</span>
              <span>Video tải lên trong tuần: {videos.filter(v => isThisWeek(v.created_at)).length}</span>
              <span>Video phát hiện cháy trong tuần: {weekAlerts}</span>
               
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
