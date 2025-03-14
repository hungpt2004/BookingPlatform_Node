import { Flip, toast, ToastContainer } from "react-toastify";
import React from "react";

export const CustomToast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick={false}
      closeButton={false}
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      transition={Flip}
      style={{ fontSize: "15px", borderBottomColor: "red" }}
    />
  );
};

export const CustomSuccessToast = (msg) => {
  return toast.success(
    msg,
    {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  )
}

export const CustomFailedToast = (msg) => {
  return toast.fail(
    msg,
    {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  )
}