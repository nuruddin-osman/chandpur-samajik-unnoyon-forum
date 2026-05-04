"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiPhone, FiLock, FiEye, FiEyeOff, FiUsers } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/auth/authSlice";

const FieldWrapper = ({ label, required, error, icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-text">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-border-prim text-base z-10">
          {icon}
        </span>
      )}
      {children}
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const inputBaseClass =
  "w-full h-11 bg-white border rounded-xl pl-10 pr-3 text-sm text-text outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-2";
const inputClass = `${inputBaseClass} border-border-prim focus:border-button-bg focus:ring-button-bg/20`;
const inputErrorClass = `${inputBaseClass} border-red-300 focus:border-red-500 focus:ring-red-100`;

const LoginPage = () => {
  const [showPass, setShowPass] = useState(false);
  const [userData, setUserData] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/members/login",
        data,
      );

      const rawToken = response.data.token.replace("Bearer ", "");

      // decode token
      const payload = JSON.parse(atob(rawToken.split(".")[1]));
      const ID = payload.id;

      //  user fetch directly
      const res = await axios.get(`http://localhost:5000/api/members/${ID}`, {
        headers: { Authorization: `Bearer ${rawToken}` },
      });
      console.log(res.data);

      const user = res.data;

      //  redux
      dispatch(setCredentials({ token: rawToken, user }));

      toast.success(response.data.message);
      router.push("/pages/profile");
    } catch (error) {
      const msg = error.response?.data?.message || "কিছু একটা সমস্যা হয়েছে";
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-section-bg-gray flex items-center justify-center py-10 px-4 font-inter">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="bg-white rounded-t-2xl shadow-sm px-8 pt-8 pb-6 text-center border-b border-border-prim/20">
            <div className="w-14 h-14 bg-button-bg/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FiUsers className="text-button-bg text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-heading font-playfair">
              লগইন
            </h1>
            <p className="text-text text-sm mt-1 opacity-80">
              আপনার একাউন্টে প্রবেশ করুন
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-b-2xl shadow-sm px-6 md:px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-4 pt-6">
                {/* Phone */}
                <FieldWrapper
                  label="ফোন নম্বর"
                  required
                  error={errors.phone?.message}
                  icon={<FiPhone />}
                >
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className={`${errors.phone ? inputErrorClass : inputClass} pl-10`}
                    {...register("phone", {
                      required: "ফোন নম্বর দেওয়া আবশ্যক",
                      pattern: {
                        value: /^01[3-9]\d{8}$/,
                        message: "সঠিক বাংলাদেশি নম্বর দিন",
                      },
                    })}
                  />
                </FieldWrapper>

                {/* Password */}
                <FieldWrapper
                  label="পাসওয়ার্ড"
                  required
                  error={errors.password?.message}
                  icon={<FiLock />}
                >
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="পাসওয়ার্ড দিন"
                      className={`${errors.password ? inputErrorClass : inputClass} pl-10 pr-10`}
                      {...register("password", {
                        required: "পাসওয়ার্ড দেওয়া আবশ্যক",
                        minLength: { value: 6, message: "কমপক্ষে ৬ অক্ষর" },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-button-bg"
                    >
                      {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </FieldWrapper>
              </div>

              <button
                type="submit"
                className="mt-8 w-full h-12 bg-button-bg hover:bg-button-bg/90 text-white-text rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] shadow-sm"
              >
                লগইন করুন
              </button>

              <p className="text-center text-sm text-text mt-4 opacity-70">
                একাউন্ট নেই?{" "}
                <a
                  href="/pages/ragistration"
                  className="text-button-bg font-medium hover:underline"
                >
                  নিবন্ধন করুন
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
