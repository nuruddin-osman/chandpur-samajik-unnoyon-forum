// app/profile/page.jsx
"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiHome,
  FiBriefcase,
  FiDroplet,
  FiCreditCard,
  FiUsers,
  FiCalendar,
  FiLogOut,
} from "react-icons/fi";
import { logout } from "@/store/auth/authSlice";

const InfoRow = ({ icon, label, value }) =>
  value ? (
    <div className="flex items-start gap-3 py-3 border-b border-border-prim/20 last:border-0">
      <span className="text-button-bg mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-text">{value}</p>
      </div>
    </div>
  ) : null;

const occupationMap = {
  student: "ছাত্র",
  employee: "চাকরিজীবী",
  student_employee: "ছাত্র + চাকরিজীবী",
  others: "অন্যান্য",
};

const page = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/pages/login");
  }, [token]);

  if (!user) return null;

  const dob = user.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString("bn-BD")
    : null;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/pages/login");
  };
  return (
    <div className="min-h-screen bg-section-bg-gray py-10 px-4 font-inter">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-sm px-8 pt-8 pb-6 text-center border-b border-border-prim/20">
          <div className="w-16 h-16 bg-button-bg/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-button-bg text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-heading font-playfair">
            {user.fullName}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
              {user.memberType === "paid" ? "পেইড সদস্য" : "নন-পেইড সদস্য"}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white shadow-sm px-6 md:px-8 py-2">
          <InfoRow
            icon={<FiUser size={15} />}
            label="পিতার নাম"
            value={user.fatherName}
          />
          <InfoRow
            icon={<FiCalendar size={15} />}
            label="জন্ম তারিখ"
            value={dob}
          />
          <InfoRow
            icon={<FiUser size={15} />}
            label="বয়স"
            value={user.age ? `${user.age} বছর` : null}
          />
          <InfoRow
            icon={<FiDroplet size={15} />}
            label="রক্তের গ্রুপ"
            value={user.bloodGroup}
          />
          <InfoRow
            icon={<FiCreditCard size={15} />}
            label="NID / জন্ম নিবন্ধন"
            value={user.nid}
          />
          <InfoRow
            icon={<FiPhone size={15} />}
            label="ফোন নম্বর"
            value={user.phone}
          />
          <InfoRow
            icon={<FiMail size={15} />}
            label="ইমেইল"
            value={user.email}
          />
          <InfoRow
            icon={<FiMapPin size={15} />}
            label="গ্রাম"
            value={user.village}
          />
          <InfoRow
            icon={<FiHome size={15} />}
            label="বাড়ির নাম / নম্বর"
            value={user.houseName}
          />
          <InfoRow
            icon={<FiBriefcase size={15} />}
            label="পেশা"
            value={occupationMap[user.occupation]}
          />
        </div>

        {/* Logout */}
        <div className="bg-white rounded-b-2xl shadow-sm px-6 md:px-8 pb-6 pt-2">
          <button
            onClick={handleLogout}
            className="mt-4 w-full h-11 border border-red-300 text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FiLogOut size={15} />
            লগআউট
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
