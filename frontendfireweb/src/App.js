import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import './App.css';
import Sidebar from "./pages/global/Sidebar/Sidebar";
import Topbar from "./pages/global/Topbar/Topbar"; 
import Home from "./pages/HomePage/Home";
import Video from "./pages/Video/Video";
import Bottombar from "./pages/global/Bottombar/Bottombar"; 
import Analyze from './pages/Video/Analyze/Analyze';
import DetectionResult from "./pages/DetectionResult/DetectionResult"; 
import CameraResult from "./pages/CameraResult/CameraResult"; 
import ReviewResult from "./pages/ReviewPage/ReviewPage";
import Account from "./pages/Account/Account"
import Setting from "./pages/SettingPage/Setting";
import Manage from "./pages/Manage/Manage";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider, CssBaseline } from '@mui/material';

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router> 
          {/* <div className="App">
          <Topbar setIsSidebar={setIsSidebar} />
            <div className="body-layout">
              <Sidebar isSidebar={isSidebar} />
              <main className={`main-content ${isSidebar ? "" : "collapsed"}`}>
                <Routes>
                  <Route path="/video" element={<Video />} />
                </Routes>
              </main>
            </div>
            <Bottombar />
          </div> */}
           <div className="app-container">
            <Topbar setIsSidebar={setIsSidebar} />
            <div className="body-layout">
              <Sidebar isSidebar={isSidebar} />
              <main className={`main-content ${isSidebar ? "" : "collapsed"}`}>
                <Routes>
                   <Route path="/" element={<Home />} />
                   <Route path="/video" element={<Video />} />
                   <Route path="/video/analyze" element={<Analyze />} />
                   <Route path="/video/detectionresult" element={<DetectionResult />} />
                   <Route path="/video/cameraresult" element={<CameraResult />} />
                   <Route path="/video/review" element={<ReviewResult />} />
                   <Route path="/account" element={<Account/>} />
                   <Route path="/settings" element={<Setting/>} />
                   <Route path="/manage" element={<Manage/>} />
                  {/* Các Route khác */}
                </Routes>
              </main>
            </div>
            <Bottombar />
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;