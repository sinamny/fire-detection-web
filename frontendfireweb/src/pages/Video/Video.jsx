import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import { RiLinkM } from 'react-icons/ri';
import './Video.css';

const Video = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [activeTab, setActiveTab] = useState('video');
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = () => {
    if (videoFile || videoUrl) {
      setUploaded(true);
    }
  };

  const handleAnalyze = () => {
    if (videoFile || videoUrl) {
      navigate('/detectionresult', { state: { mode: 'video', videoFile, videoUrl } });
    }
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoElement = document.getElementById('cameraFeed');
    if (videoElement) {
      videoElement.srcObject = stream;
      navigate('/cameraresult', { state: { mode: 'camera' } });
    }
  };

  const extractYouTubeID = (url) => {
    const regex = /(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  return (
    <div className="video-page">
      <div className="tabs">
        <button className={`tab-button ${activeTab === 'video' ? 'active' : ''}`} onClick={() => setActiveTab('video')}>
          Video
        </button>
        <button className={`tab-button ${activeTab === 'camera' ? 'active' : ''}`} onClick={() => setActiveTab('camera')}>
          Camera
        </button>
      </div>

      {activeTab === 'video' && (
        <div className="tab-content video-tab">
          {!uploaded ? (
            <div className="upload-section">
              <div className="upload-header">
                <FileUploadOutlinedIcon className="file-upload-icon" />
                <p className="upload-title">Tải lên video</p>
              </div>

              <div className="upload-box" onClick={() => document.getElementById('video-upload-input').click()}>
                <div className="upload-icon">
                  <VideoLibraryOutlinedIcon className="file-upload-icon-2" />
                </div>
                <p>Hỗ trợ các định dạng: MP4, AVI (tối đa 50MB)</p>
                <input
                  id="video-upload-input"
                  type="file"
                  accept="video/mp4,video/avi"
                  style={{ display: 'none' }}
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
              </div>

              <div className="upload-title">Hoặc</div>

              <div className="upload-link">
                <RiLinkM className="link-icon" />
                <p className="upload-title">Đường dẫn video</p>
              </div>

              <div className="url-input">
                <input
                  type="text"
                  placeholder="Nhập URL video Youtube..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>

              <button className="upload-button" onClick={handleUpload}>
                Tải lên
              </button>
            </div>
          ) : (
            <div className="video-preview-section">
              <div className="video-frame">
                {videoFile ? (
                  <video src={URL.createObjectURL(videoFile)} controls className="video-player" />
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeID(videoUrl)}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allowFullScreen
                    className="video-player"
                  />
                )}
              </div>
              <button className="analyze-button" onClick={handleAnalyze}>
                Phân tích phát hiện cháy từ Video
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'camera' && (
        <div className="tab-content camera-tab">
          <video id="cameraFeed" autoPlay playsInline muted className="camera-video" />
          <button className="camera-button" onClick={startCamera}>Bắt đầu Camera</button>
        </div>
      )}
    </div>
  );
};

export default Video;
// import React, { useState } from 'react';
// import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
// import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
// import { RiLinkM } from "react-icons/ri";
// import './Video.css';

// const Video = () => {
//   const [videoUrl, setVideoUrl] = useState('');
//   const [videoFile, setVideoFile] = useState(null);
//   const [activeTab, setActiveTab] = useState('video');
//   const [uploaded, setUploaded] = useState(false);
//   const [analyzing, setAnalyzing] = useState(false);


//   const handleUpload = () => {
//     if (videoFile) {
//       console.log('Uploading file:', videoFile);
//       setUploaded(true);
//     } else if (videoUrl) {
//       console.log('Uploading URL:', videoUrl);
//       setUploaded(true);
//     }
//   };

//   const startCamera = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     const videoElement = document.getElementById('cameraFeed');
//     if (videoElement) {
//       videoElement.srcObject = stream;
//     }
//   };

//   const extractYouTubeID = (url) => {
//     const regex = /(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/;
//     const match = url.match(regex);
//     return match ? match[1] : '';
//   };

//   return (
//     <div className="video-page">
//       <div className="tabs">
//         <button
//           className={`tab-button ${activeTab === 'video' ? 'active' : ''}`}
//           onClick={() => setActiveTab('video')}
//         >
//           Video
//         </button>
//         <button
//           className={`tab-button ${activeTab === 'camera' ? 'active' : ''}`}
//           onClick={() => setActiveTab('camera')}
//         >
//           Camera
//         </button>
//       </div>

//       {activeTab === 'video' && (
//         <div className="tab-content video-tab">
//           {!uploaded ? (
//             <div className="upload-section">
//               <div className="upload-header">
//                 <FileUploadOutlinedIcon className="file-upload-icon" />
//                 <p className="upload-title">Tải lên video</p>
//               </div>

//               <div
//                 className="upload-box"
//                 onClick={() => document.getElementById('video-upload-input').click()}
//               >
//                 <div className="upload-icon">
//                   <VideoLibraryOutlinedIcon className="file-upload-icon-2" />
//                 </div>
//                 <p>Hỗ trợ các định dạng: MP4, AVI (tối đa 50MB)</p>
//                 <input
//                   id="video-upload-input"
//                   type="file"
//                   accept="video/mp4,video/avi"
//                   style={{ display: 'none' }}
//                   onChange={(e) => setVideoFile(e.target.files[0])}
//                 />
//               </div>

//               <div className="upload-title">Hoặc</div>

//               <div className="upload-link">
//                 <RiLinkM className="link-icon" />
//                 <p className="upload-title">Đường dẫn video</p>
//               </div>

//               <div className="url-input">
//                 <input
//                   type="text"
//                   placeholder="Nhập URL video Youtube..."
//                   value={videoUrl}
//                   onChange={(e) => setVideoUrl(e.target.value)}
//                 />
//               </div>

//               <button className="upload-button" onClick={handleUpload}>
//                 Tải lên
//               </button>
//             </div>
//           ) : (
//             <div className="video-preview-section">
//               {/* <h3 className="video-title">
//                 {videoFile?.name || "Tên Video ABC Youtube abc"}
//               </h3> */}
//               <div className="video-frame">
//                 {videoFile ? (
//                   <video
//                     src={URL.createObjectURL(videoFile)}
//                     controls
//                     className="video-player"
//                   />
//                 ) : (
//                   <iframe
//                     width="560"
//                     height="315"
//                     src={`https://www.youtube.com/embed/${extractYouTubeID(videoUrl)}`}
//                     title="YouTube video player"
//                     frameBorder="0"
//                     allowFullScreen
//                     className="video-player"
//                   ></iframe>
//                 )}
//               </div>
//               <button className="analyze-button">Phân tích phát hiện cháy từ Video</button>
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === 'camera' && (
//         <div className="tab-content camera-tab">
//           <video id="cameraFeed" autoPlay playsInline muted className="camera-video" />
//           <button className="camera-button" onClick={startCamera}>Bắt đầu Camera</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Video;
