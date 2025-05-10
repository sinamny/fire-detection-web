import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useLocation, useNavigate } from "react-router-dom";
import ReplayIcon from '@mui/icons-material/Replay';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import FastRewindOutlinedIcon from '@mui/icons-material/FastRewindOutlined';
import FastForwardOutlinedIcon from '@mui/icons-material/FastForwardOutlined';
import "../../components/ResultDisplay/ResultDisplay.css";

const ReviewPage = () => {
   const navigate = useNavigate();
  const location = useLocation();
  const { videoFile, videoUrl } = location.state || {};
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);

  return (
    <div className="result-page">
      <div className="video-result-frame">
        <ReactPlayer
          ref={playerRef}
          url={videoFile ? URL.createObjectURL(videoFile) : videoUrl}
          playing={playing}
          controls={false}
          onProgress={({ playedSeconds }) => setPlayedSeconds(playedSeconds)}
          width="100%"
          height="53vh"
        />
      </div>

      <div className="custom-controls">
        <button
          onClick={() => {
            if (playerRef.current) {
              playerRef.current.seekTo(0);
              setPlaying(false);
            }
          }}
        >
          <ReplayIcon className="control-button" />
        </button>

        <span className="control-time">
          {new Date(playedSeconds * 1000).toISOString().substr(14, 5)}
        </span>

        <button
          onClick={() => {
            if (playerRef.current)
              playerRef.current.seekTo(playedSeconds - 5, "seconds");
          }}
        >
          <FastRewindOutlinedIcon className="control-button" />
        </button>

        <button onClick={() => setPlaying(!playing)}>
          <PlayArrowOutlinedIcon className="control-button" />
        </button>

        <button
          onClick={() => {
            if (playerRef.current)
              playerRef.current.seekTo(playedSeconds + 5, "seconds");
          }}
        >
          <FastForwardOutlinedIcon className="control-button" />
        </button>

        <button
          onClick={() => {
            const url = URL.createObjectURL(videoFile);
            const a = document.createElement("a");
            a.href = url;
            a.download = "result.mp4";
            a.click();
          }}
        >
          <SaveAltOutlinedIcon className="control-button" />
        </button>
      </div>
       <button className="new-review-button" onClick={() => navigate("/video")}>
        Tạo mới
      </button>
    </div>
  );
};

export default ReviewPage;
