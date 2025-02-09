import { Flip, ToastContainer} from "react-toastify";
import React from "react";

export const CustomToast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      transition={Flip}
      style={{ fontSize: "15px", borderBottomColor: "red" }} // Custom style
    />
  );
};