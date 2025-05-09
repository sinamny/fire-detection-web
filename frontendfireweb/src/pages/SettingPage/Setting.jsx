// File: /setting.jsx
import React, { useState } from 'react';
import './Setting.css';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import WarningIcon from '@mui/icons-material/Warning';
import { Slider, Box } from '@mui/material';

export default function Setting() {
  const [volume, setVolume] = useState(70);
  const [alert1, setAlert1] = useState(true);
  const [alert2, setAlert2] = useState(true);

  const speak = (text) => {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'vi-VN'; // Giọng đọc tiếng Việt
  synth.speak(utter);
};
  
    const handleVolumeChange = (event, newValue) => {
        // if (newValue > 80) {
        //     speak("Cảnh báo: Phát hiện có cháy");
        // }
    setVolume(newValue);


  };
  return (
    <div className="settings-container">
      <h2 className="settings-title">
        <SettingsOutlinedIcon sx={{ marginRight: '0.5rem'}} className='setting-icon' />
        Cài đặt
      </h2>

      <div className="section-a">
        <button className="section-settingbutton">
          Âm lượng cảnh báo
        </button>
        <div className="volume-control">
         <Box className="volume-control" sx={{ width: 300 }}>
          <VolumeUpIcon />
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Volume"
            valueLabelDisplay="auto"
            min={0}
            max={100}
            sx={{ marginLeft: 2, flex: 1 }}
          />
          <span className="volume-value">{volume}</span>
        </Box>
        </div>
      </div>

      <hr className="divider" />

      <div className="section-b">
        <button className="section-button-danger">
          <WarningIcon style={{ marginRight: '8px' }} />
          Chế độ cảnh báo
        </button>
        <div className="alert-option">
           <label>Hiển thị báo động ra màn hình kèm chuông báo</label>
          <input
            type="checkbox"
            checked={alert1}
            onChange={() => setAlert1(!alert1)}
          />
        </div>
        <div className="alert-option">
           <label>Gửi cảnh báo về email kèm hình ảnh cháy trích từ video</label>
          <input
            type="checkbox"
            checked={alert2}
            onChange={() => setAlert2(!alert2)}
          />
        </div>
      </div>
    </div>
  );
}
