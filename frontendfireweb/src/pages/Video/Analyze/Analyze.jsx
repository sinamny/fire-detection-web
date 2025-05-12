import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Analyze = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  // const { videoFile, videoUrl, mode } = state || {};
  const [activeTab, setActiveTab] = useState("video");
  //   const storedVideoUrl = sessionStorage.getItem('videoUrl');
  // const storedVideoFileObjectUrl = sessionStorage.getItem('videoFileObjectUrl');
  // const storedMode = sessionStorage.getItem('videoMode');

  const { videoFile, videoUrl, mode } = useSelector((state) => state.video);

  const [localVideoSrc, setLocalVideoSrc] = useState(null);

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

  const videoSrc = useMemo(() => {
    return videoFile ? URL.createObjectURL(videoFile) : videoUrl || null;
  }, [videoFile, videoUrl]);

  useEffect(() => {
    return () => {
      // Giải phóng URL video khi không còn sử dụng
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.getElementById("cameraFeed");
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          navigate("/video/cameraresult", { state: { mode: "camera" } });
        };
      }
    } catch (err) {
      console.error("Không thể truy cập camera:", err);
    }
  };

  const handleAnalyze = () => {
    console.log("Current mode:", mode);
    if (mode === "video") {
      navigate("/video/detectionresult", {
        state: { mode, videoFile, videoUrl },
      });
    } else if (mode === "camera") {
      navigate("/video/cameraresult", { state: { mode } });
    }
  };

  const handleBackToUpload = () => {
    navigate("/video");
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
                <video src={localVideoSrc} controls className="analyze-video-player" />
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeID(videoUrl)}`}
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
    </div>
  );
};

export default Analyze;
