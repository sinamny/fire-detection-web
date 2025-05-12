import { configureStore } from "@reduxjs/toolkit";
// import { thunk } from "redux-thunk";
import authReducer from "./authSlice";
import videoReducer from "./videoSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    video: videoReducer,
   
  },
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
