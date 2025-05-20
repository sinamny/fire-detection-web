import React, { useState, useEffect, useRef } from "react"; 
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Analyze = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { videoFile, videoUrl, mode } = useSelector((state) => state.video);
  const [activeTab, setActiveTab] = useState("video");
  const [localVideoSrc, setLocalVideoSrc] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [status, setStatus] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [videoFrameUrl, setVideoFrameUrl] = useState(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null);

  const token = localStorage.getItem("access_token");
  const user = useSelector((state) => state.user.user);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/notifications/settings", {
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("access_token")}` 
          }
        });

        if (!res.ok) {
          console.warn("Không lấy được cài đặt thông báo:", res.status);
          return;
        }

        const data = await res.json();
        setNotificationEnabled(data.enable_website_notification === true);
      } catch (error) {
        console.error("Lỗi khi lấy cài đặt thông báo:", error);
      }
    };

    fetchNotificationSettings();
  }, []);

  const socketRef = useRef(null);

  // File hoặc URL YouTube hiện tại
  const selectedFile = videoFile || null;
  const youtubeUrl = videoUrl || "";
  const authToken = token || "";

  const addLog = (message, type = "info") => {
    console.log(`[${type}] ${message}`);
  };

  useEffect(() => {
    if (videoFile) {
      const objectUrl = URL.createObjectURL(videoFile);
      setLocalVideoSrc(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setLocalVideoSrc(null);
    }
  }, [videoFile]);

  const extractYouTubeID = (url) => {
    const regex = /(?:\?v=|\/embed\/|\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url?.match(regex);
    return match ? match[1] : "";
  };

  // const startCamera = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     const videoElement = document.getElementById("cameraFeed");
  //     if (videoElement) {
  //       videoElement.srcObject = stream;
  //       videoElement.onloadedmetadata = () => {
  //         videoElement.play();
  //         navigate("/video/cameraresult", { state: { mode: "camera" } });
  //       };
  //     }
  //   } catch (err) {
  //     console.error("Không thể truy cập camera:", err);
  //   }
  // };
  const startCamera = () => {
  navigate("/video/cameraresult", { state: { mode: "camera" } });
};


  const handleBackToUpload = () => {
    navigate("/video");
  };

  const handleAnalyze = () => {
    setErrorMsg(null);

    if (mode === "camera") {
      navigate("/video/cameraresult", { state: { mode } });
      return;
    }

    if (!selectedFile && !youtubeUrl) {
      setErrorMsg("Chưa chọn video hoặc nhập link YouTube.");
      return;
    }

    if (selectedFile && selectedFile.size > 15 * 1024 * 1024) {
      setErrorMsg("File quá lớn! Kích thước tối đa 15MB.");
      return;
    }

    if (socketRef.current) {
      socketRef.current.close();
    }

    const ws = new WebSocket("ws://localhost:8000/api/v1/ws/direct-process");
    socketRef.current = ws;

    let fireDetectionTimes = []; 
    let allFramesInfo = [];
    let processedVideoUrl = null;

    ws.onopen = () => {
      addLog("Đã kết nối WebSocket", "success");

      if (authToken.trim()) {
        addLog("Gửi token xác thực...");
        ws.send(JSON.stringify({ token: authToken.trim() }));
      } else {
        addLog("Kết nối dưới dạng khách (không có token)");
        ws.send(JSON.stringify({ token: null }));
      }

      const metadata = {
        type: selectedFile ? "upload" : "youtube",
        ...(selectedFile ? {} : { youtube_url: youtubeUrl.trim() })
      };
      ws.send(JSON.stringify(metadata));

      if (selectedFile) {
        setStatus("loading"); // bật loading spinner
        
        const reader = new FileReader();

        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgressPercent(percent);
          }
        };

        reader.onload = () => {
          addLog("Đã đọc xong file vào bộ nhớ, chuẩn bị gửi...");
          setProgressPercent(0);
          try {
            ws.send(reader.result);
            addLog(`Đã gửi ${(reader.result.byteLength / (1024 * 1024)).toFixed(2)} MB dữ liệu`);
            setStatus("loading"); // giữ loading spinner khi upload
          } catch (error) {
            addLog(`Lỗi khi gửi: ${error.message}`, "error");
            setStatus(""); // tắt loading spinner
          }
        };

        reader.onerror = () => {
          addLog("Lỗi khi đọc file", "error");
          setStatus("");
        };

        reader.readAsArrayBuffer(selectedFile);
      } else {
        setStatus("loading"); // loading khi chờ xử lý YouTube
      }
    };

    ws.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const url = URL.createObjectURL(event.data);
        setVideoFrameUrl(url);
      } else {
        try {
          const data = JSON.parse(event.data);
          addLog(`${data.status}: ${data.message || JSON.stringify(data)}`);

          switch (data.status) {
            case "info":
              // không hiển thị status text
              break;
            case "ready":
              setStatus(""); // tắt loading spinner
              break;
            case "uploading":
              setStatus("loading"); // giữ loading spinner
              break;
            case "processing":
              setStatus("loading"); // giữ loading spinner
              break;
            case "frame":
              const frameInfo = data.frame_info;
              allFramesInfo.push(frameInfo); 
              if (frameInfo.fire_detected) {
                fireDetectionTimes.push(frameInfo.video_time);
              }
              break;
            case "progress":
              setProgressPercent(Math.min(100, Math.floor((data.frames_processed / 500) * 100)));
              break;
            case "completed":
              processedVideoUrl = data.processed_url;
              setProcessedVideoUrl(processedVideoUrl);
              setStatus(""); // tắt loading spinner
              setProgressPercent(100);
              addLog("Xử lý video hoàn tất", "success");

              if (mode === "video") {
                navigate("/video/detectionresult", {
                  state: { 
                    mode,
                    processedVideoUrl,
                    notificationEnabled,
                    videoSource: selectedFile ? selectedFile.name : youtubeUrl,
                    fireDetectionTimes,
                    allFramesInfo, 
                    stats: {
                      totalFrames: data.frames_processed,
                      fireFrames: allFramesInfo.filter(f => f.fire_detected).length,
                      maxFireArea: Math.max(...allFramesInfo.map(f => f.total_area || 0))
                    }
                  }
                });
              }
              break;
            case "error":
              setStatus("");
              setErrorMsg(`Lỗi: ${data.message}`);
              addLog(`Lỗi: ${data.message}`, "error");
              break;
            default:
              break;
          }
        } catch (e) {
          addLog("Lỗi khi xử lý dữ liệu từ server", "error");
          console.error(e);
        }
      }
    };

    ws.onerror = (err) => {
      addLog("Lỗi WebSocket: " + (err.message || "Unknown error"), "error");
      setStatus("");
      setErrorMsg("Lỗi kết nối WebSocket");
    };

    ws.onclose = () => {
      addLog("Kết nối WebSocket đã đóng");
      setStatus("");
    };
  };

  return (
    <div className="video-page">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "video" ? "active" : ""}`}
          onClick={handleBackToUpload}
        >
          Video
        </button>
        <button
          className={`tab-button ${activeTab === "camera" ? "active" : ""}`}
          onClick={() => setActiveTab("camera")}
        >
          Camera
        </button>
      </div>

      {activeTab === "video" && (
        <div className="video-preview-section">
          <div className="video-frame">
            {videoFile || videoUrl ? (
              videoFile ? (
                <video
                  src={localVideoSrc}
                  controls
                  className="analyze-video-player"
                />
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeID(
                    videoUrl
                  )}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allowFullScreen
                  className="analyze-video-player"
                />
              )
            ) : (
              <p>Không có video được chọn.</p>
            )}
          </div>

          <div style={{ marginTop: "16px" }}>
            <button className="analyze-button" onClick={handleAnalyze}>
              Phân tích phát hiện cháy từ Video
            </button>
          </div>
          {errorMsg && (
            <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>
          )}
          {status === "loading" && (
            <div style={{ marginTop: "10px" }}>
              <div className="spinner" />
              <p>Đang xử lý, vui lòng chờ...</p>
            </div>
          )}

          {progressPercent > 0 && (
            <p>Tiến độ: {progressPercent} %</p>
          )}
        </div>
      )}

      {activeTab === "camera" && (
        <div className="tab-content camera-tab">
          <video
            id="cameraFeed"
            autoPlay
            playsInline
            muted
            className="camera-video"
          />
          <button className="camera-button" onClick={startCamera}>
            Bắt đầu Camera
          </button>
        </div>
      )}
      <style>{`
        .spinner {
          margin: 0 auto;
          width: 40px;
          height: 40px;
          border: 4px solid #ccc;
          border-top-color: #1d72b8;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Analyze;
