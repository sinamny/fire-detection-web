// import React, { useEffect, useRef, useState } from "react";
// import ReactPlayer from "react-player";
// import ReplayIcon from '@mui/icons-material/Replay';
// import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
// import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
// import FastRewindOutlinedIcon from '@mui/icons-material/FastRewindOutlined';
// import FastForwardOutlinedIcon from '@mui/icons-material/FastForwardOutlined';
// import { useNavigate } from "react-router-dom";
// import "./ResultDisplay.css";

// const ResultDisplay = ({ mode, videoFile, videoUrl }) => {
//   const videoRef = useRef(null);
//   const [firePercent, setFirePercent] = useState(0);
//   const [backgroundPercent, setBackgroundPercent] = useState(100);
//   const [detectionTime, setDetectionTime] = useState("");
//   const [cameraStream, setCameraStream] = useState(null);
//   const streamRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const mockData = {
//         total_area: +(Math.random() * 100).toFixed(2),
//       };
//       setFirePercent(mockData.total_area);
//       setBackgroundPercent(+(100 - mockData.total_area).toFixed(2));

//       // Cập nhật thời gian phát hiện tùy theo chế độ
//       if (mode === "camera") {
//         setDetectionTime(new Date().toLocaleTimeString());
//       } else if (mode === "video" && videoRef.current) {
//         const currentTime = videoRef.current.currentTime;
//         const minutes = Math.floor(currentTime / 60);
//         const seconds = Math.floor(currentTime % 60);
//         setDetectionTime(
//           `${minutes.toString().padStart(2, "0")}:${seconds
//             .toString()
//             .padStart(2, "0")}`
//         );
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [mode]);

//   useEffect(() => {
//     let stream;

//     const startCamera = async () => {
//       try {
//         stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         streamRef.current = stream;
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error("Không thể truy cập camera:", error);
//       }
//     };

//     if (mode === "camera") {
//       startCamera();
//     }

//     return () => {
//       const currentVideoRef = videoRef.current;

//       if (currentVideoRef) {
//         currentVideoRef.pause();
//         currentVideoRef.srcObject = null;
//       }

//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => {
//           track.stop();
//         });

//         streamRef.current = null;
//       }
//     };
//   }, [mode]);

//   const handleNewClick = () => {
//     if (cameraStream) {
//       cameraStream.getTracks().forEach((track) => track.stop());
//       if (videoRef.current) {
//         videoRef.current.srcObject = null;
//       }
//       setCameraStream(null);
//     }

//     // Delay nhỏ để đảm bảo dừng xong mới navigate (nếu cần)
//     setTimeout(() => {
//       navigate("/video");
//     }, 100);
//   };

//   const [playing, setPlaying] = useState(false);
//   const [playedSeconds, setPlayedSeconds] = useState(0);
//   const playerRef = useRef(null);

//   return (
//     <div className="result-page">
//       {mode === "video" && (
//         <div className="video-result-frame">
//           {/* {videoFile ? (
//             <video
//                 src={URL.createObjectURL(videoFile)}
//                 controls
//                 ref={videoRef}
//                 className="video-player"
//             />
//             ) : videoUrl ? (
//             <iframe
//                 className="video-player"
//                 src={`https://www.youtube.com/embed/${extractYouTubeID(videoUrl)}`}
//                 title="YouTube video"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//             />
//             ) : (
//             <div>Không có video để hiển thị</div>
//             )} */}
//           <ReactPlayer
//             ref={playerRef}
//             url={videoFile ? URL.createObjectURL(videoFile) : videoUrl}
//             playing={playing}
//             controls={false}
//             onProgress={({ playedSeconds }) => setPlayedSeconds(playedSeconds)}
//             width="100%"
//             height="53vh"
//           />

//           {/* Custom control bar */}
//           <div className="custom-controls">
//             <button
//               onClick={() => {
//                 if (playerRef.current) {
//                   playerRef.current.seekTo(0);
//                   setPlaying(false);
//                 }
//               }}
//             >
//               <ReplayIcon className="control-button" />
//             </button>

//             <span className="control-time">
//               {new Date(playedSeconds * 1000).toISOString().substr(14, 5)}
//             </span>

//             <button
//               onClick={() => {
//                 if (playerRef.current)
//                   playerRef.current.seekTo(playedSeconds - 5, "seconds");
//               }}
//             >
//               <FastRewindOutlinedIcon className="control-button"/>
//             </button>

//             <button onClick={() => setPlaying(!playing)}>
//               <PlayArrowOutlinedIcon className="control-button" />
//             </button>

//             <button
//               onClick={() => {
//                 if (playerRef.current)
//                   playerRef.current.seekTo(playedSeconds + 5, "seconds");
//               }}
//             >
//               <FastForwardOutlinedIcon className="control-button" />
//             </button>

//             <button
//               onClick={() => {
//                 const url = URL.createObjectURL(videoFile);
//                 const a = document.createElement("a");
//                 a.href = url;
//                 a.download = "result.mp4";
//                 a.click();
//               }}
//             >
//               <SaveAltOutlinedIcon className="control-button" />
//             </button>
//           </div>
//         </div>
//       )}

//       {mode === "camera" && (
//         <div className="video-result-frame">
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             muted
//             className="camera-result-video"
//             style={{ height: '57vh', width: '100%' }}
//           />
//         </div>
//       )}

//       <div className="stats-bar">
//         <div className="left-column">
//           <div className="progress-text">Fire</div>
//             <div className="progress-container">
//                 <div className="progress-bar-wrapper">
//                     <div
//                     className="progress-fire"
//                     style={{ width: `${firePercent}%` }}
//                     ></div>
//                 </div>
//                 <span className="progress-percent">{firePercent}%</span>
//             </div>

//           <div className="progress-text">Background</div>
//           <div className="progress-container">
//             <div className="progress-bar-wrapper">
//                 <div
//                 className="progress-bg"
//                 style={{ width: `${backgroundPercent}%` }}
//                 ></div>
//             </div>
//             <span className="progress-percent">{backgroundPercent}%</span>
//             </div>

//         </div>

//         <div className="right-column">
//           <div className="detection-time">
//             {mode === "camera"
//               ? "Thời gian hiện tại"
//               : "Thời điểm phát hiện cháy"}
//             : <strong>{detectionTime}</strong>
//           </div>
//           <button className="new-button" onClick={handleNewClick}>
//             Tạo mới
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultDisplay;
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import "./ResultDisplay.css";

const DetectionDisplay = ({ mode, videoFile, videoUrl }) => {
  const videoRef = useRef(null);
   const streamRef = useRef(null);
  const [firePercent, setFirePercent] = useState(0);
  const [backgroundPercent, setBackgroundPercent] = useState(100);
  const [detectionTime, setDetectionTime] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const navigate = useNavigate();
  const [played, setPlayed] = useState(0);

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
        // Yêu cầu quyền truy cập camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (video) {
          video.srcObject = stream;
        }
      } catch (error) {
        console.error("Không thể truy cập camera:", error);
      }
    };

    startCamera();

    return () => {
      console.log("Cleanup chạy khi rời trang");
      mounted = false;

      const stream = streamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            console.log("Dừng track:", track.kind);
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


  const handleCreateNew = () => {
    if (mode === "camera") {
      setTimeout(() => {
        // window.location.assign("/video");
        navigate("/video"); 
      }, 10);
    } else if (mode === "video") {
      navigate("/video"); 
    }
};

 

  // console.log("DetectionDisplay rendered, mode:", mode);

  return (
    <div className="result-page">
      <div className="video-result-frame" style={{ position: "relative" }}>
        {mode === "camera" ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-result-video"
            style={{ width: "100%", height: "62vh" }}
          />
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
            {mode === "camera"
              ? "Thời gian hiện tại"
              : "Thời điểm phát hiện cháy"}
            :{" "}
             <strong>{detectionTime}</strong>
          </div>
          <button className="new-button" onClick={handleCreateNew}>
            Tạo mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetectionDisplay;

// import React, { useEffect, useRef, useState } from 'react';
// import { FaRedo, FaBackward, FaPlay, FaForward, FaDownload } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import './ResultDisplay.css';

// const fakeFrames = [
//     { frame: 270, video_time: "00:00:01", fire_detected: true, total_area: 2.6045, url: 'https://imgur.com/a/GVlLmET' },
//     { frame: 272, video_time: "00:00:02", fire_detected: false, total_area: 0.0, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00001.jpg?raw=true' },
//     { frame: 274, video_time: "00:00:03", fire_detected: true, total_area: 2.7434, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00002.jpg?raw=true' },
//     { frame: 276, video_time: "00:00:04", fire_detected: false, total_area: 0.0, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00003.jpg?raw=true' },
//     { frame: 278, video_time: "00:00:05", fire_detected: true, total_area: 2.3698, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00004.jpg?raw=true' },
//     { frame: 280, video_time: "00:00:06", fire_detected: false, total_area: 0.0, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00005.jpg?raw=true' },
//     { frame: 282, video_time: "00:00:07", fire_detected: true, total_area: 3.1015, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00006.jpg?raw=true' },
//     { frame: 284, video_time: "00:00:08", fire_detected: false, total_area: 0.0, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00007.jpg?raw=true' },
//     { frame: 286, video_time: "00:00:09", fire_detected: true, total_area: 2.8556, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00008.jpg?raw=true' },
//     { frame: 288, video_time: "00:00:10", fire_detected: false, total_area: 0.0, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00009.jpg?raw=true' },
//     { frame: 290, video_time: "00:00:11", fire_detected: true, total_area: 2.9987, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00010.jpg?raw=true' },
//     { frame: 292, video_time: "00:00:12", fire_detected: false, total_area: 0.0, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00011.jpg?raw=true' },
//     { frame: 294, video_time: "00:00:13", fire_detected: true, total_area: 2.4539, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00012.jpg?raw=true' },
//     { frame: 296, video_time: "00:00:14", fire_detected: false, total_area: 0.0, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00013.jpg?raw=true' },
//     { frame: 298, video_time: "00:00:15", fire_detected: true, total_area: 3.2148, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00014.jpg?raw=true' },
//     { frame: 300, video_time: "00:00:16", fire_detected: false, total_area: 0.0, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00015.jpg?raw=true' },
//     { frame: 302, video_time: "00:00:17", fire_detected: true, total_area: 2.6764, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00016.jpg?raw=true' },
//     { frame: 304, video_time: "00:00:18", fire_detected: false, total_area: 0.0, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00017.jpg?raw=true' },
//     { frame: 306, video_time: "00:00:19", fire_detected: true, total_area: 3.1229, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00018.jpg?raw=true' },
//     { frame: 308, video_time: "00:00:20", fire_detected: false, total_area: 0.0, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00019.jpg?raw=true' },
//     { frame: 310, video_time: "00:00:21", fire_detected: true, total_area: 2.8531, url: 'https://github.com/nggiang63/fire-detection/blob/main/data/extracted_frames/frame_00020.jpg?raw=true' },
//     ];

// const ResultDisplay = ({ mode, frames = fakeFrames, predictions = fakeFrames.map(frame => frame.fire_detected ? 100 : 0) }) => {
//   const videoRef = useRef(null);
//   const [firePercent, setFirePercent] = useState(0);
//   const [backgroundPercent, setBackgroundPercent] = useState(100);
//   const [detectionTime, setDetectionTime] = useState('');
//   const [playing, setPlaying] = useState(false);
//   const [frameIndex, setFrameIndex] = useState(0);
//   const [videoStream, setVideoStream] = useState(null);
//   const canvasRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (frames.length === 0 || predictions.length === 0) return;

//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     const currentFrame = frames[frameIndex];
//     const currentPrediction = predictions[frameIndex];

//     // Draw the frame
//     const image = new Image();
//     image.src = currentFrame.url;
//     console.log("Image source: ", currentFrame.url);

//     image.onload = () => {
//       console.log("Image loaded successfully");
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

//       // Draw fire detection area (if any)
//       if (currentPrediction > 0) {
//         ctx.strokeStyle = 'red';
//         ctx.lineWidth = 3;
//         ctx.strokeRect(10, 10, 200, 100); // Example coordinates for detection area
//         ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
//         ctx.fillRect(10, 10, 200, 100); // Example filled area for detected fire
//       }
//     };

//     // Update fire detection percentages
//     setFirePercent(currentFrame.fire_detected ? currentFrame.total_area : 0);
//     setBackgroundPercent(100 - firePercent);

//   }, [frameIndex, frames, predictions, firePercent]);

//   const handleNewClick = () => {
//     navigate('/video');
//   };

//   const handlePlayPause = () => {
//     setPlaying(!playing);
//   };

//   const handleSeek = (seconds) => {
//     const nextFrameIndex = Math.max(0, Math.min(frames.length - 1, frameIndex + seconds));
//     setFrameIndex(nextFrameIndex);
//   };

//   const handleDownload = () => {
//     const url = frames[frameIndex].url;
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'frame.jpg';
//     a.click();
//   };
//     const handleRestart = () => {
//     setFrameIndex(0);
//   };

//   return (
//     <div className="result-page">
//       {mode === 'video' && videoStream && (
//         <div className="video-frame">
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             muted
//             className="video-player"
//             srcObject={videoStream}
//           />
//           <div className="custom-controls">
//             <button onClick={handleRestart}><FaRedo /></button>
//             <span className="control-time">{detectionTime}</span>
//             <button onClick={() => setFrameIndex(Math.max(0, frameIndex - 5))}><FaBackward /></button>
//             <button onClick={() => setPlaying(!playing)}><FaPlay /></button>
//             <button onClick={() => setFrameIndex(Math.min(fakeFrames.length - 1, frameIndex + 5))}><FaForward /></button>
//           </div>
//         </div>
//       )}

//       {mode === 'camera' && (
//         <div className="video-frame">
//           <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
//         </div>
//       )}

//       <div className="stats-bar">
//         <div className="progress-text">Fire</div>
//         <div className="progress-container">
//           <div className="progress-fire" style={{ width: `${firePercent}%` }}></div>
//         </div>
//         <div className="progress-percent">{firePercent}%</div>

//         <div className="progress-text">Background</div>
//         <div className="progress-container">
//           <div className="progress-bg" style={{ width: `${backgroundPercent}%` }}></div>
//         </div>
//         <div className="progress-percent">{backgroundPercent}%</div>

//         <div className="detection-time">
//           Thời điểm phát hiện cháy: <strong>{detectionTime}</strong>
//         </div>

//         <button className="new-button" onClick={handleNewClick}>Tạo mới</button>
//       </div>
//     </div>
//   );
// };

// export default ResultDisplay;
