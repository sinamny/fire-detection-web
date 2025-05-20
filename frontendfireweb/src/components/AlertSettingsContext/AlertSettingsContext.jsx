import React, { createContext, useState } from "react";

export const AlertSettingsContext = createContext();

export const AlertSettingsProvider = ({ children }) => {
  const [volume, setVolume] = useState(70); 

  return (
    <AlertSettingsContext.Provider value={{ volume, setVolume }}>
      {children}
    </AlertSettingsContext.Provider>
  );
};
