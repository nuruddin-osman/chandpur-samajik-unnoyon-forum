"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        pauseOnHover
        draggable
        theme="light"
      />
    </Provider>
  );
}
