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

  useEffect(() => {
    let mounted = true;
    const video = videoRef.current;

    const startCamera = async () => {
      if (mode !== "camera") return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (video) video.srcObject = stream;
        setCameraOn(true);
      } catch (error) {
        console.error("Không thể truy cập camera:", error);
      }
    };

    startCamera();

    return () => {
      mounted = false;
      const stream = streamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => {
          if (track.readyState === "live") track.stop();
        });
      }
      if (video) video.srcObject = null;
      streamRef.current = null;
    };
  }, [mode]);

  const handleTurnOffCamera = () => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.readyState === "live") track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
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
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-result-video"
            style={{ width: "100%", height: "62vh", transform: "scaleX(-1)" }}
          />
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
