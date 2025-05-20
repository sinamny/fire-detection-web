import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate, useLocation } from "react-router-dom";
import "./ResultDisplay.css";

const ResultDisplay = () => {
  const { state } = useLocation();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [firePercent, setFirePercent] = useState(0);
  const [backgroundPercent, setBackgroundPercent] = useState(100);
  const [fireDetectionTimes, setFireDetectionTimes] = useState(
    state?.fireDetectionTimes || []
  );
  const [videoEnded, setVideoEnded] = useState(false);
  const [played, setPlayed] = useState(0);
  const [cameraOn, setCameraOn] = useState(true);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [currentDisplayTimeIndex, setCurrentDisplayTimeIndex] = useState(0);
  const [displayedFireTimes, setDisplayedFireTimes] = useState([]);
  const notificationEnabled = state?.notificationEnabled ?? false;
  const [showFireAlert, setShowFireAlert] = useState(false);
 const [wsConnected, setWsConnected] = useState(false);
  const [frameBase64, setFrameBase64] = useState(null);
  const [fireDetected, setFireDetected] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("disconnected");

  const wsRef = useRef(null);


  const navigate = useNavigate();

  const {
    mode,
    processedVideoUrl,
    videoSource,
    allFramesInfo = [],
    stats = {},
  } = state || {};

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const speakAlert = (text) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

    // Kết nối WebSocket khi ở chế độ camera
  useEffect(() => {
    if (mode !== "camera") return;

    const connectWebSocket = async () => {
      setCameraStatus("connecting");
      console.log("Đang kết nối đến WebSocket...");
      
      const wsUrl = process.env.REACT_APP_WS_URL || "ws://localhost:8000/api/v1/ws/fire";
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Kết nối WebSocket thành công");
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Xử lý message trạng thái từ server
          if (data.status) {
            if (data.status === "ready") {
              console.log("Camera đã sẵn sàng");
              setCameraStatus("connected");
              setCameraOn(true);
            } else if (data.status === "error") {
              console.error("Lỗi camera:", data.message);
              setCameraStatus("error");
              setCameraOn(false);
            }
            return;
          }

          // Xử lý frame data
          setFrameBase64(data.frame);
          setFireDetected(data.fire_detected);
          setFirePercent(data.total_area);
          setBackgroundPercent(100 - data.total_area);

          if (data.fire_detected) {
            console.log("Phát hiện cháy tại:", data.time);
            setFireDetectionTimes((prev) => [...prev, data.time]);
          }
        } catch (error) {
          console.error("Lỗi phân tích dữ liệu:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("Lỗi WebSocket:", error);
        setCameraStatus("error");
        setWsConnected(false);
        setCameraOn(false);
      };

      ws.onclose = () => {
        console.log("WebSocket đã đóng");
        setCameraStatus("disconnected");
        setWsConnected(false);
        setCameraOn(false);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [mode]);

  useEffect(() => {
    if (fireDetectionTimes.length === 0 || !notificationEnabled) return;

    setShowFireAlert(true);
    speakAlert("Cảnh báo phát hiện cháy, vui lòng kiểm tra ngay!");

    const timer = setTimeout(() => {
      setShowFireAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [fireDetectionTimes]);

  useEffect(() => {
    if (showFireAlert && audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => console.log("Lỗi phát âm thanh:", e));
    }
  }, [showFireAlert]);

  useEffect(() => {
    const fire =
      Math.round(allFramesInfo[currentFrameIndex]?.total_area, 2) || 0;
    const bg = 100 - fire;
    setFirePercent(fire);
    setBackgroundPercent(bg);
  }, [allFramesInfo, currentFrameIndex]);

  useEffect(() => {
    if (mode === "camera" || fireDetectionTimes.length === 0) return;

    let intervalId = null;
    if (currentDisplayTimeIndex < fireDetectionTimes.length) {
      intervalId = setInterval(() => {
        setDisplayedFireTimes((prev) => [
          ...prev,
          fireDetectionTimes[currentDisplayTimeIndex],
        ]);
        setCurrentDisplayTimeIndex((prev) => prev + 1);
      }, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fireDetectionTimes, currentDisplayTimeIndex, mode]);



 const handleTurnOffCamera = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("Đang gửi lệnh tắt camera...");
      wsRef.current.send("stop");
      wsRef.current.close();
    }
    setCameraStatus("disconnected");
    setCameraOn(false);
    setFrameBase64(null);
    console.log("Camera đã tắt");
  };

  const handleCreateNew = () => {
    navigate("/video");
  };

  return (
    <div className="result-page">
      <Snackbar
        open={showFireAlert}
        autoHideDuration={5000}
        onClose={() => setShowFireAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          Cảnh báo phát hiện cháy! Vui lòng kiểm tra ngay!
        </Alert>
      </Snackbar>

      <div className="video-result-frame" style={{ position: "relative" }}>
        {mode === "camera" ? (
         <>
            {frameBase64 ? (
              <img
                src={`data:image/jpeg;base64,${frameBase64}`}
                alt="Camera Fire Detection"
                style={{ width: "100%", height: "62vh", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "62vh",
                  backgroundColor: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
            
              </div>
            )}
            {/* {wsConnected && (
              <button className="new-button" onClick={handleTurnOffCamera} style={{ position: "absolute", top: 10, right: 10 }}>
                Tắt camera
              </button>
            )} */}
          </>
        ) : (
          <>
            <ReactPlayer
              url={processedVideoUrl}
              playing
              onProgress={({ played }) => setPlayed(played)}
              controls={false}
              width="100%"
              height="60vh"
              onEnded={() => setVideoEnded(true)}
            />
            {videoEnded && processedVideoUrl && (
              <div className="video-overlay">
                <p>Streaming kết thúc !</p>
                <button
                  className="review-button"
                  onClick={() =>
                    navigate("/video/review", {
                      state: { videoSource },
                    })
                  }
                >
                  Xem lại kết quả
                </button>
              </div>
            )}
          </>
        )}
        {mode === "video" && (
          <div className="custom-control">
            <div className="custom-progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${played * 100}%` }}
              ></div>
              <div
                className="progress-thumb"
                style={{ left: `calc(${played * 100}% - 8px)` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="stats-bar">
        <div className="left-column">
          <div className="progress-text">Fire</div>
          <div className="progress-container">
            <div className="progress-bar-wrapper">
              <div
                className="progress-fire"
                style={{ width: `${firePercent}%` }}
              ></div>
            </div>
            <span className="progress-percent">{firePercent}%</span>
          </div>

          <div className="progress-text">Background</div>
          <div className="progress-container">
           <div className="progress-bar-wrapper">
              <div
                className="progress-bg"
                style={{ width: `${backgroundPercent}%` }}
              ></div>
            </div>
            <span className="progress-percent">{backgroundPercent}%</span>
          </div>
        </div>

        <div className="right-column">
          <div className="detection-time">
            <strong>
              {mode === "camera"
                ? "Thời gian hiện tại"
                : "Thời điểm phát hiện cháy"}
              :{" "}
              {mode === "camera"
                ? currentTime.toLocaleTimeString()
                : displayedFireTimes.length > 0
                ? displayedFireTimes[displayedFireTimes.length - 1]
                : "Chưa phát hiện"}
            </strong>
          </div>

          <div className="turnoff-button">
            {mode === "camera" && cameraOn && (
              <button className="new-button" onClick={handleTurnOffCamera}>
                Tắt camera
              </button>
            )}
            <button className="new-button" onClick={handleCreateNew}>
              Tạo mới
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src="/fire-alert.mp3" preload="auto" />
    </div>
  );
};

export default ResultDisplay;
