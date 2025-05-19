// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ element }) => {
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   const accessToken = localStorage.getItem("accessToken");
   

//   if (isAuthenticated || accessToken) {
//     return element;
//   }
//   return <Navigate to="/login" />;
  
// };

// export default ProtectedRoute;
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
