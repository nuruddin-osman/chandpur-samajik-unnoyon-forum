"use client";

import { setCredentials } from "@/store/auth/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const AuthLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        const user = JSON.parse(userStr);
        dispatch(setCredentials({ token, user }));
      }
    } catch (e) {
      console.error("Auth rehydrate error:", e);
    }
  }, [dispatch]);

  return null;
};

export default AuthLoader;
