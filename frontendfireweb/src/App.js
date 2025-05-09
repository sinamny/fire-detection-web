import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import './App.css';
import Sidebar from "./pages/global/Sidebar/Sidebar";
import Topbar from "./pages/global/Topbar/Topbar"; 
import Video from "./pages/Video/Video";
import Bottombar from "./pages/global/Bottombar/Bottombar"; 
import DetectionResult from "./pages/DetectionResult/DetectionResult"; 
import CameraResult from "./pages/CameraResult/CameraResult"; 
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
                  <Route path="/video" element={<Video />} />
                   <Route path="/detectionresult" element={<DetectionResult />} />
                  <Route path="/cameraresult" element={<CameraResult />} />
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