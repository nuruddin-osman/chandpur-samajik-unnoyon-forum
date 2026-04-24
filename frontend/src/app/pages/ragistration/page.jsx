"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  FiUser,
  FiPhone,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiHome,
  FiBriefcase,
  FiCalendar,
  FiDroplet,
  FiCreditCard,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";

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
const selectClass = `${inputClass} appearance-none cursor-pointer`;

const IconInput = ({ className, icon, ...props }) => (
  <input className={`${className} pl-10`} {...props} />
);

const IconSelect = ({ className, icon, children, ...props }) => (
  <select className={`${className} pl-10 appearance-none`} {...props}>
    {children}
  </select>
);

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 py-5">
    <span className="text-base font-semibold tracking-wider uppercase text-heading font-playfair">
      {children}
    </span>
    <div className="flex-1 h-px bg-border-prim/30" />
  </div>
);

const getPasswordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = [
    "",
    "দুর্বল",
    "মোটামুটি",
    "ভালো",
    "শক্তিশালী",
    "অত্যন্ত শক্তিশালী",
  ];
  const colors = [
    "bg-gray-200",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-emerald-500",
    "bg-emerald-700",
  ];
  return { score, label: labels[score], color: colors[score] };
};

const page = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedType, setSubmittedType] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { memberType: "" },
  });

  const password = watch("password") || "";
  const strength = getPasswordStrength(password);

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    setSubmittedType(data.memberType);
    setSubmitted(true);
  };

  const handleReset = () => {
    reset();
    setSubmitted(false);
    setSubmittedType("");
  };
  return (
    <div className="min-h-screen bg-section-bg-gray py-10 px-4 font-inter">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-t-2xl shadow-sm px-8 pt-8 pb-6 text-center border-b border-border-prim/20">
          <div className="w-14 h-14 bg-button-bg/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FiUsers className="text-button-bg text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-heading font-playfair">
            সদস্য নিবন্ধন
          </h1>
          <p className="text-text text-sm mt-1 opacity-80">
            সংগঠনের সদস্যপদের জন্য ফর্মটি পূরণ করুন
          </p>
        </div>

        <div className="bg-white rounded-b-2xl shadow-sm px-6 md:px-8 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <SectionLabel>ব্যক্তিগত তথ্য</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldWrapper
                label="পূর্ণ নাম"
                required
                error={errors.fullName?.message}
                icon={<FiUser />}
              >
                <IconInput
                  type="text"
                  placeholder="আপনার পূর্ণ নাম"
                  className={errors.fullName ? inputErrorClass : inputClass}
                  {...register("fullName", {
                    required: "পূর্ণ নাম দেওয়া আবশ্যক",
                    minLength: { value: 2, message: "কমপক্ষে ২ অক্ষর" },
                  })}
                />
              </FieldWrapper>
              <FieldWrapper
                label="পিতার নাম"
                required
                error={errors.fatherName?.message}
                icon={<FiUser />}
              >
                <IconInput
                  type="text"
                  placeholder="পিতার পূর্ণ নাম"
                  className={errors.fatherName ? inputErrorClass : inputClass}
                  {...register("fatherName", {
                    required: "পিতার নাম দেওয়া আবশ্যক",
                    minLength: { value: 2, message: "কমপক্ষে ২ অক্ষর" },
                  })}
                />
              </FieldWrapper>
              <FieldWrapper
                label="বয়স"
                required
                error={errors.age?.message}
                icon={<FiUser />}
              >
                <IconInput
                  type="number"
                  placeholder="বয়স (বছর)"
                  className={errors.age ? inputErrorClass : inputClass}
                  {...register("age", {
                    required: "বয়স দেওয়া আবশ্যক",
                    min: { value: 10, message: "বয়স কমপক্ষে ১০ বছর" },
                    max: { value: 100, message: "সঠিক বয়স দিন" },
                    valueAsNumber: true,
                  })}
                />
              </FieldWrapper>
              <FieldWrapper
                label="জন্ম তারিখ"
                required
                error={errors.dateOfBirth?.message}
                icon={<FiCalendar />}
              >
                <IconInput
                  type="date"
                  className={errors.dateOfBirth ? inputErrorClass : inputClass}
                  {...register("dateOfBirth", {
                    required: "জন্ম তারিখ দেওয়া আবশ্যক",
                  })}
                />
              </FieldWrapper>

              <FieldWrapper
                label="রক্তের গ্রুপ"
                error={errors.bloodGroup?.message}
                icon={<FiDroplet />}
              >
                <IconSelect
                  className={errors.bloodGroup ? inputErrorClass : selectClass}
                  {...register("bloodGroup")}
                >
                  <option value="">রক্তের গ্রুপ</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ),
                  )}
                </IconSelect>
              </FieldWrapper>
              <FieldWrapper
                label="NID / জন্ম নিবন্ধন নম্বর"
                error={errors.nid?.message}
                icon={<FiCreditCard />}
              >
                <IconInput
                  type="text"
                  placeholder="NID বা জন্ম সনদ নম্বর"
                  className={errors.nid ? inputErrorClass : inputClass}
                  {...register("nid")}
                />
              </FieldWrapper>
            </div>

            <SectionLabel>যোগাযোগ তথ্য</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldWrapper
                label="ফোন নম্বর"
                required
                error={errors.phone?.message}
                icon={<FiPhone />}
              >
                <IconInput
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className={errors.phone ? inputErrorClass : inputClass}
                  {...register("phone", {
                    required: "ফোন নম্বর দেওয়া আবশ্যক",
                    pattern: {
                      value: /^01[3-9]\d{8}$/,
                      message: "সঠিক বাংলাদেশি নম্বর দিন",
                    },
                  })}
                />
              </FieldWrapper>

              <FieldWrapper
                label="ইমেইল"
                error={errors.email?.message}
                icon={<FiMail />}
              >
                <IconInput
                  type="email"
                  placeholder="example@email.com"
                  className={errors.email ? inputErrorClass : inputClass}
                  {...register("email", {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "সঠিক ইমেইল দিন",
                    },
                  })}
                />
              </FieldWrapper>

              <FieldWrapper
                label="গ্রামের নাম"
                required
                error={errors.village?.message}
                icon={<FiMapPin />}
              >
                <IconInput
                  type="text"
                  placeholder="গ্রামের নাম"
                  className={errors.village ? inputErrorClass : inputClass}
                  {...register("village", {
                    required: "গ্রামের নাম দেওয়া আবশ্যক",
                  })}
                />
              </FieldWrapper>

              <FieldWrapper
                label="বাড়ির নাম / নম্বর"
                required
                error={errors.houseName?.message}
                icon={<FiHome />}
              >
                <IconInput
                  type="text"
                  placeholder="বাড়ির নাম বা নম্বর"
                  className={errors.houseName ? inputErrorClass : inputClass}
                  {...register("houseName", {
                    required: "বাড়ির তথ্য দেওয়া আবশ্যক",
                  })}
                />
              </FieldWrapper>
            </div>

            <SectionLabel>পেশা</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldWrapper
                label="পেশা"
                required
                error={errors.occupation?.message}
                icon={<FiBriefcase />}
              >
                <IconSelect
                  className={errors.occupation ? inputErrorClass : selectClass}
                  {...register("occupation", {
                    required: "পেশা নির্বাচন করুন",
                  })}
                >
                  <option value="">পেশা নির্বাচন করুন</option>
                  <option value="student">ছাত্র / ছাত্রী</option>
                  <option value="employee">চাকরিজীবী</option>
                  <option value="student_employee">ছাত্র + চাকরিজীবী</option>
                  <option value="others">অন্যান্য</option>
                </IconSelect>
              </FieldWrapper>
            </div>

            <SectionLabel>সদস্যপদের ধরন</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldWrapper
                label="সদস্যের ধরন নির্বাচন করুন"
                required
                error={errors.memberType?.message}
                icon={<FiUsers />}
              >
                <IconSelect
                  className={selectClass}
                  {...register("memberType", {
                    required: "সদস্যপদের ধরন নির্বাচন করুন",
                  })}
                >
                  <option value="">— সদস্যপদের ধরন —</option>
                  <option value="paid">পেইড সদস্য</option>
                  <option value="non-paid">নন-পেইড সদস্য</option>
                </IconSelect>
              </FieldWrapper>
            </div>

            <SectionLabel>অ্যাকাউন্ট সুরক্ষা</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldWrapper
                label="পাসওয়ার্ড"
                required
                error={errors.password?.message}
                icon={<FiLock />}
              >
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="পাসওয়ার্ড তৈরি করুন"
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
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${(strength.score / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {strength.label}
                    </p>
                  </div>
                )}
              </FieldWrapper>

              <FieldWrapper
                label="পাসওয়ার্ড নিশ্চিত করুন"
                required
                error={errors.confirmPassword?.message}
                icon={<FiLock />}
              >
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="পুনরায় লিখুন"
                    className={`${errors.confirmPassword ? inputErrorClass : inputClass} pl-10 pr-10`}
                    {...register("confirmPassword", {
                      required: "পাসওয়ার্ড নিশ্চিত করুন",
                      validate: (val) =>
                        val === password || "পাসওয়ার্ড মিলছে না",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-button-bg"
                  >
                    {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </FieldWrapper>
            </div>

            <div className="mt-6 flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-0.5 accent-button-bg w-4 h-4"
                {...register("terms", {
                  required: "শর্তাবলী মেনে নেওয়া আবশ্যক",
                })}
              />
              <label
                htmlFor="terms"
                className="text-sm text-text leading-relaxed cursor-pointer"
              >
                আমি সংগঠনের{" "}
                <span className="text-button-bg font-medium">
                  নিয়মাবলী ও শর্তাবলী
                </span>{" "}
                মেনে নিচ্ছি।
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-500 mt-1">
                {errors.terms.message}
              </p>
            )}

            <button
              type="submit"
              className="mt-8 w-full h-12 bg-button-bg hover:bg-button-bg/90 text-white-text rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] shadow-sm"
            >
              নিবন্ধন সম্পন্ন করুন
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
