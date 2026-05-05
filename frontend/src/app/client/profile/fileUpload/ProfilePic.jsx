"use client";

import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FiUser, FiCamera } from "react-icons/fi";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const ProfilePic = () => {
  const [imageFile, setImageFile] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Redux থেকে token ও user নাও
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  // Page load এ Member fetch করে profileImage দেখাও
  useEffect(() => {
    const fetchMember = async () => {
      if (!token || !user?._id) return;

      setLoading(true);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/members/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (res.data.profileImage) {
          setImageFile(res.data.profileImage);
        }
      } catch (error) {
        console.error("Fetch member error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [token, user]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const postFile = async (file) => {
    if (!token || !user?._id) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      // ১. File upload
      const res = await axios.post(
        "http://localhost:5000/api/members/upload-file",
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const url = res.data.file.url;

      // ২. Member profileImage update
      await axios.patch(
        `http://localhost:5000/api/members/${user._id}`,
        { profileImage: url },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setImageFile(url);
      console.log("Upload success:", url);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) postFile(file);
  };

  return (
    <div className="w-20 h-20 relative">
      <div className="w-20 h-20 rounded-2xl bg-button-bg/10 flex items-center justify-center relative overflow-hidden">
        {loading ? (
          <ClipLoader color="#your-button-bg-color" size={28} />
        ) : imageFile ? (
          <Image
            src={`/api/media/${imageFile.replace("/assets/", "")}`}
            alt="profile"
            fill
            sizes="80px"
            className="object-cover rounded-2xl"
          />
        ) : (
          <FiUser className="text-button-bg text-3xl" />
        )}
      </div>

      <button
        onClick={handleClick}
        className="absolute bottom-0 right-0 bg-button-bg text-white p-2 rounded-full shadow-md hover:scale-105 transition"
      >
        <FiCamera className="text-sm" />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePic;
