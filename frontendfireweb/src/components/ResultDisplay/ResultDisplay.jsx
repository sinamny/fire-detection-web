import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import "./ResultDisplay.css";

const ResultDisplay = ({ mode, videoFile, videoUrl }) => {
 const videoRef = useRef(null);
   const streamRef = useRef(null);
   const [firePercent, setFirePercent] = useState(0);
   const [backgroundPercent, setBackgroundPercent] = useState(100);
   const [detectionTime, setDetectionTime] = useState("");
   const [videoEnded, setVideoEnded] = useState(false);
   const navigate = useNavigate();
   const [played, setPlayed] = useState(0);
   const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const mockData = {
        total_area: +(Math.random() * 100).toFixed(2),
      };
      setFirePercent(mockData.total_area);
      setBackgroundPercent(+(100 - mockData.total_area).toFixed(2));

      if (mode === "video" && videoRef.current) {
        const currentTime = videoRef.current.getCurrentTime();
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        setDetectionTime(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      } else if (mode === "camera") {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        setDetectionTime(timeString);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);
useEffect(() => {
    const video = videoRef.current;
    let mounted = true;

    const startCamera = async () => {
      if (mode !== "camera") return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (video) {
          video.srcObject = stream;
        }
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
          if (track.readyState === "live") {
            track.stop();
          }
        });
      }

      if (video) {
        video.srcObject = null;
      }
      streamRef.current = null;
    };
  }, [mode]);

  const handleTurnOffCamera = () => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
  };

  const handleCreateNew = () => {
    if (mode === "camera") {
      setTimeout(() => {
        navigate("/video");
      }, 10);
    } else if (mode === "video") {
      navigate("/video");
    }
  };


  return (
    <div className="result-page">
      <div className="video-result-frame" style={{ position: "relative" }}>
        {mode === "camera" ? (
          <>
            <video
               ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-result-video"
              style={{ width: "100%", height: "62vh", transform: "scaleX(-1)" }}
            />
          </>
        ) : (
          <>
            <ReactPlayer
              ref={videoRef}
              url={videoFile ? URL.createObjectURL(videoFile) : videoUrl}
              playing
              controls={false}
              onProgress={({ played }) => setPlayed(played)}
              width="100%"
              height="60vh"
              onEnded={() => setVideoEnded(true)}
            />
            {videoEnded && (
              <div className="video-overlay">
                <p>Streaming kết thúc !</p>
                <button
                  className="review-button"
                  onClick={() =>
                    navigate("/video/review", {
                      state: { videoFile, videoUrl },
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
              : {detectionTime}
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
    </div>
  );
};

export default ResultDisplay;
// import React, { useEffect, useRef, useState } from "react";
// import ReactPlayer from "react-player";
// import { useNavigate } from "react-router-dom";
// import "./ResultDisplay.css";

// const WS_BASE_URL = "ws://localhost:8000"; // sửa lại cho đúng backend bạn

// const ResultDisplay = ({ mode, videoFile, videoUrl, videoId }) => {
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);

//   const [firePercent, setFirePercent] = useState(0);
//   const [backgroundPercent, setBackgroundPercent] = useState(100);
//   const [detectionTime, setDetectionTime] = useState("");
//   const [videoEnded, setVideoEnded] = useState(false);
//   const [played, setPlayed] = useState(0);
//   const [cameraOn, setCameraOn] = useState(true);
//   const [alertVisible, setAlertVisible] = useState(false);
//   const [firstFireDetectedTime, setFirstFireDetectedTime] = useState(null);

//   const navigate = useNavigate();

//   // Giữ websocket instance
//   const ws1Ref = useRef(null);
//   const ws2Ref = useRef(null);

//   useEffect(() => {
//     if (mode === "camera") return; // Camera không dùng websocket lấy fire data

//     // Tạo 2 WebSocket kết nối backend
//     if (!videoId) {
//       console.warn("Video ID chưa có, không thể mở WS");
//       return;
//     }

//     // WS 1: kết nối với /ws/process/{videoId}
//     ws1Ref.current = new WebSocket(`${WS_BASE_URL}/ws/process/${videoId}`);

//     // WS 2: kết nối với /ws/process_url/{videoId}
//     ws2Ref.current = new WebSocket(`${WS_BASE_URL}/ws/process_url/${videoId}`);

//     // Xử lý message WS1
//     ws1Ref.current.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.total_area !== undefined) {
//           setFirePercent(data.total_area);
//           setBackgroundPercent(100 - data.total_area);

//           if (data.total_area > 0 && !firstFireDetectedTime) {
//             const now = new Date();
//             setFirstFireDetectedTime(now);
//             setAlertVisible(true);
//           }
//         }
//         if (data.detection_time) {
//           setDetectionTime(data.detection_time);
//         }
//       } catch (err) {
//         console.error("WS1 data parse error:", err);
//       }
//     };

//     ws1Ref.current.onerror = (err) => {
//       console.error("WebSocket1 error:", err);
//     };

//     ws1Ref.current.onclose = () => {
//       console.log("WebSocket1 closed");
//     };

//     // Xử lý message WS2 (tương tự, bạn có thể tuỳ chỉnh nếu cần)
//     ws2Ref.current.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         // Có thể dùng WS2 cho mục đích khác nếu cần
//         // Ví dụ cập nhật detectionTime hoặc các chỉ số khác
//       } catch (err) {
//         console.error("WS2 data parse error:", err);
//       }
//     };

//     ws2Ref.current.onerror = (err) => {
//       console.error("WebSocket2 error:", err);
//     };

//     ws2Ref.current.onclose = () => {
//       console.log("WebSocket2 closed");
//     };

//     // Cleanup khi unmount
//     return () => {
//       if (ws1Ref.current) ws1Ref.current.close();
//       if (ws2Ref.current) ws2Ref.current.close();
//     };
//   }, [mode, videoId, firstFireDetectedTime]);

//   // Xử lý thời gian phát hiện cháy cho video mode
//   useEffect(() => {
//     if (mode !== "video" || !videoRef.current) return;

//     const video = videoRef.current;

//     const updateDetectionTime = () => {
//       const currentTime = video.getCurrentTime ? video.getCurrentTime() : video.currentTime || 0;
//       const minutes = Math.floor(currentTime / 60);
//       const seconds = Math.floor(currentTime % 60);
//       setDetectionTime(
//         `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
//       );
//     };

//     const interval = setInterval(updateDetectionTime, 1000);

//     return () => clearInterval(interval);
//   }, [mode]);

//   // Camera mode dùng video element trực tiếp đã có trong code cũ, không đổi

//   const handleTurnOffCamera = () => {
//     const stream = streamRef.current;
//     if (stream) {
//       stream.getTracks().forEach((track) => {
//         if (track.readyState === "live") {
//           track.stop();
//         }
//       });
//       streamRef.current = null;
//     }

//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }

//     setCameraOn(false);
//   };

//   const handleCreateNew = () => {
//     if (mode === "camera") {
//       setTimeout(() => {
//         navigate("/video");
//       }, 10);
//     } else if (mode === "video") {
//       navigate("/video");
//     }
//   };

//   const handleCloseAlert = () => {
//     setAlertVisible(false);
//   };

//   return (
//     <div className="result-page">
//       <div className="video-result-frame" style={{ position: "relative" }}>
//         {mode === "camera" ? (
//           <>
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               muted
//               className="camera-result-video"
//               style={{ width: "100%", height: "62vh", transform: "scaleX(-1)" }}
//             />
//             {cameraOn && (
//               <button className="stop-camera-button" onClick={handleTurnOffCamera}>
//                 Tắt camera
//               </button>
//             )}
//           </>
//         ) : (
//           <>
//             <ReactPlayer
//               ref={videoRef}
//               url={videoFile ? URL.createObjectURL(videoFile) : videoUrl}
//               playing
//               controls={false}
//               onProgress={({ played }) => setPlayed(played)}
//               width="100%"
//               height="60vh"
//               onEnded={() => setVideoEnded(true)}
//             />
//             {videoEnded && (
//               <div className="video-overlay">
//                 <p>Streaming kết thúc !</p>
//                 <button
//                   className="review-button"
//                   onClick={() =>
//                     navigate("/video/review", {
//                       state: { videoFile, videoUrl },
//                     })
//                   }
//                 >
//                   Xem lại kết quả
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//         {mode === "video" && (
//           <div className="custom-control">
//             <div className="custom-progress-bar">
//               <div className="progress-fill" style={{ width: `${played * 100}%` }}></div>
//               <div className="progress-thumb" style={{ left: `calc(${played * 100}% - 8px)` }}></div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="stats-bar">
//         <div className="left-column">
//           <div className="progress-text">Fire</div>
//           <div className="progress-container">
//             <div className="progress-bar-wrapper">
//               <div className="progress-fire" style={{ width: `${firePercent}%` }}></div>
//             </div>
//             <span className="progress-percent">{firePercent.toFixed(2)}%</span>
//           </div>

//           <div className="progress-text">Background</div>
//           <div className="progress-container">
//             <div className="progress-bar-wrapper">
//               <div className="progress-bg" style={{ width: `${backgroundPercent}%` }}></div>
//             </div>
//             <span className="progress-percent">{backgroundPercent.toFixed(2)}%</span>
//           </div>
//         </div>

//         <div className="right-column">
//           <div className="detection-time">
//             <strong>
//               {mode === "camera" ? "Thời gian hiện tại" : "Thời điểm phát hiện cháy"}: {detectionTime}
//             </strong>
//           </div>

//           <div className="turnoff-button">
//             <button className="new-button" onClick={handleCreateNew}>
//               Tạo mới
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Hiển thị cảnh báo phát hiện cháy lần đầu */}
//       {alertVisible && (
//         <div className="fire-alert-popup">
//           <p>Cảnh báo: Phát hiện cháy lần đầu lúc {firstFireDetectedTime.toLocaleTimeString()}</p>
//           <button onClick={handleCloseAlert}>Đóng</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResultDisplay;
