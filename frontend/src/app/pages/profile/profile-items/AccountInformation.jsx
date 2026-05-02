"use client";

import {
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiHome,
  FiBriefcase,
  FiDroplet,
  FiCreditCard,
  FiCalendar,
} from "react-icons/fi";

const InfoRow = ({ icon, label, value }) =>
  value ? (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="text-button-bg mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-text break-words">{value}</p>
      </div>
    </div>
  ) : null;

const AccountInformation = ({ user }) => {
  const occupationMap = {
    student: "ছাত্র / ছাত্রী",
    employee: "চাকরিজীবী",
    student_employee: "ছাত্র + চাকরিজীবী",
    others: "অন্যান্য",
  };
  const dob = user?.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString("bn-BD")
    : null;

  return (
    <div>
      {/* Profile card top */}
      <div className="flex flex-col items-center text-center py-6 border-b border-gray-100 mb-2">
        <div className="w-16 h-16 rounded-2xl bg-button-bg/10 flex items-center justify-center mb-3">
          <FiUser className="text-button-bg text-2xl" />
        </div>
        <h2 className="text-lg font-bold text-heading font-playfair">
          {user?.fullName}
        </h2>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
            {user?.memberType === "paid" ? "পেইড সদস্য" : "নন-পেইড সদস্য"}
          </span>
        </div>
      </div>

      {/* Info rows */}
      <div className="px-1">
        <InfoRow
          icon={<FiUser size={14} />}
          label="পিতার নাম"
          value={user?.fatherName}
        />
        <InfoRow
          icon={<FiCalendar size={14} />}
          label="জন্ম তারিখ"
          value={dob}
        />
        <InfoRow
          icon={<FiUser size={14} />}
          label="বয়স"
          value={user?.age ? `${user.age} বছর` : null}
        />
        <InfoRow
          icon={<FiDroplet size={14} />}
          label="রক্তের গ্রুপ"
          value={user?.bloodGroup}
        />
        <InfoRow
          icon={<FiCreditCard size={14} />}
          label="NID / জন্ম নিবন্ধন"
          value={user?.nid}
        />
        <InfoRow
          icon={<FiPhone size={14} />}
          label="ফোন নম্বর"
          value={user?.phone}
        />
        <InfoRow
          icon={<FiMail size={14} />}
          label="ইমেইল"
          value={user?.email}
        />
        <InfoRow
          icon={<FiMapPin size={14} />}
          label="গ্রাম"
          value={user?.village}
        />
        <InfoRow
          icon={<FiHome size={14} />}
          label="বাড়ির নাম / নম্বর"
          value={user?.houseName}
        />
        <InfoRow
          icon={<FiBriefcase size={14} />}
          label="পেশা"
          value={occupationMap[user?.occupation]}
        />
      </div>
    </div>
  );
};

export default AccountInformation;
